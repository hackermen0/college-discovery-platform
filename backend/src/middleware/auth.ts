import type { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';
import { authConfig } from '../config/env';
import { prisma } from '../db/prisma';
import { HttpError } from '../lib/http-error';

type AuthClaims = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

const cookieNames = [
  '__Secure-authjs.session-token',
  'authjs.session-token',
  '__Secure-next-auth.session-token',
  'next-auth.session-token'
];

async function readSessionToken(request: Request) {
  // Try to read from cookies first
  for (const cookieName of cookieNames) {
    const token = await getToken({
      req: request as unknown as Parameters<typeof getToken>[0]['req'],
      secret: authConfig.secret || undefined,
      cookieName
    });

    if (token) {
      return token;
    }
  }

  // Try to read from Authorization Bearer header
  const authHeader = request.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    
    if (!authConfig.secret) {
      throw new HttpError(500, 'Auth is not configured. Set NEXTAUTH_SECRET or AUTH_SECRET.');
    }

    try {
      const secret = new TextEncoder().encode(authConfig.secret);
      const verified = await jwtVerify(token, secret);
      return verified.payload;
    } catch (error) {
      throw new HttpError(401, 'Invalid or expired token.');
    }
  }

  return null;
}

async function resolveAuthenticatedUser(request: Request) {
  if (authConfig.devBypass) {
    return prisma.user.upsert({
      where: { id: authConfig.devUser.id },
      update: {
        email: authConfig.devUser.email,
        name: authConfig.devUser.name,
        imageUrl: authConfig.devUser.imageUrl
      },
      create: authConfig.devUser
    });
  }

  if (!authConfig.secret) {
    throw new HttpError(500, 'Auth is not configured. Set NEXTAUTH_SECRET or AUTH_SECRET.');
  }

  const token = await readSessionToken(request);

  if (!token) {
    return null;
  }

  const claims = token as unknown as AuthClaims;

  if (!claims.sub) {
    throw new HttpError(401, 'Invalid auth token.');
  }

  return prisma.user.upsert({
    where: { id: claims.sub },
    update: {
      email: claims.email ?? null,
      name: claims.name ?? null,
      imageUrl: claims.picture ?? null
    },
    create: {
      id: claims.sub,
      email: claims.email ?? null,
      name: claims.name ?? null,
      imageUrl: claims.picture ?? null
    }
  });
}

export async function getSessionUser(request: Request) {
  return resolveAuthenticatedUser(request);
}

export async function requireAuth(request: Request, _response: Response, next: NextFunction) {
  try {
    const user = await resolveAuthenticatedUser(request);

    if (!user) {
      next(new HttpError(401, 'Missing or invalid authentication token.'));
      return;
    }

    request.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl
    };

    next();
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
    } else {
      next(new HttpError(500, 'Failed to authenticate request.'));
    }
  }
}
