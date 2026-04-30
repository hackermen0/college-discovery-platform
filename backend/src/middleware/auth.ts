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

  // Avoid unique constraint errors when a different user already exists with
  // the same email. First try to find an existing user by id or email. If one
  // exists, update it and return; otherwise create a new user with the token's
  // subject as the id.
  const email = claims.email ?? undefined;

  const whereClause: any = email ? { OR: [{ id: claims.sub }, { email }] } : { id: claims.sub };

  const existing = await prisma.user.findFirst({ where: whereClause });

  if (existing) {
    // Update the found user record with latest profile info and return it.
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        email: claims.email ?? existing.email,
        name: claims.name ?? existing.name,
        imageUrl: claims.picture ?? existing.imageUrl
      }
    });
  }

  // No existing user found; create a new one using the token's subject as id.
  return prisma.user.create({
    data: {
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
      console.error('Unexpected error in requireAuth:', error);
      next(new HttpError(500, 'Failed to authenticate request.'));
    }
  }
}
