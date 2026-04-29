import { Router } from 'express';
import { prisma } from '../db/prisma';
import { asyncHandler } from '../lib/async-handler';

export const healthRouter = Router();

healthRouter.get('/health', (_request, response) => {
  response.json({ ok: true, service: 'aisignal-backend' });
});

healthRouter.get(
  '/ready',
  asyncHandler(async (_request, response) => {
    await prisma.$queryRaw`SELECT 1`;
    response.json({ ok: true, database: 'connected' });
  })
);
