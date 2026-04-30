import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { asyncHandler } from '../lib/async-handler';
import { HttpError } from '../lib/http-error';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
});

const googleSignInSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().optional(),
  imageUrl: z.string().url().optional(),
  providerAccountId: z.string()
});

// Helper to serialize user (never include password)
function serializeUser(user: { id: string; email: string | null; name: string | null; imageUrl: string | null }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    imageUrl: user.imageUrl
  };
}

/**
 * POST /auth/register
 * Register a new user with email and password
 */
authRouter.post(
  '/register',
  asyncHandler(async (request, response) => {
    const body = registerSchema.parse(request.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      throw new HttpError(409, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create user and account in transaction
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name || null,
        imageUrl: null,
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: body.email,
            password: hashedPassword
          }
        }
      }
    });

    response.status(201).json({
      data: serializeUser(user)
    });
  })
);

/**
 * POST /auth/login
 * Login with email and password
 * Returns user object (NextAuth credentials provider will issue JWT)
 */
authRouter.post(
  '/login',
  asyncHandler(async (request, response) => {
    const body = loginSchema.parse(request.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { accounts: true }
    });

    if (!user) {
      throw new HttpError(401, 'Invalid email or password');
    }

    // Find credentials account
    const credentialsAccount = user.accounts.find((acc) => acc.provider === 'credentials');

    if (!credentialsAccount || !credentialsAccount.password) {
      throw new HttpError(401, 'Invalid email or password');
    }

    // Compare password
    const isValid = await bcrypt.compare(body.password, credentialsAccount.password);

    if (!isValid) {
      throw new HttpError(401, 'Invalid email or password');
    }

    response.json({
      data: serializeUser(user)
    });
  })
);

/**
 * POST /auth/google
 * Handle Google sign-in: upsert user and account
 * Called by frontend after Google OAuth sign-in
 */
authRouter.post(
  '/google',
  asyncHandler(async (request, response) => {
    const body = googleSignInSchema.parse(request.body);

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email: body.email },
      update: {
        name: body.name || undefined,
        imageUrl: body.imageUrl || undefined
      },
      create: {
        email: body.email,
        name: body.name || null,
        imageUrl: body.imageUrl || null
      }
    });

    // Upsert or create Google account
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: body.providerAccountId
        }
      },
      update: {},
      create: {
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: body.providerAccountId
      }
    });

    response.json({
      data: serializeUser(user)
    });
  })
);

/**
 * GET /auth/me
 * Get current authenticated user
 * Protected route - requires valid session token
 */
authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (request, response) => {
    response.json({ data: request.user });
  })
);
