import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (request, response) => {
    response.json({ data: request.user });
  })
);
