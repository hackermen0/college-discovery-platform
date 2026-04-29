import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { asyncHandler } from '../lib/async-handler';
import { HttpError } from '../lib/http-error';
import { requireAuth } from '../middleware/auth';

export const savedRouter = Router();

const comparisonSchema = z.object({
  collegeIds: z.array(z.string().min(1)).min(2).max(3),
  label: z.string().max(120).optional()
});

savedRouter.use(requireAuth);

savedRouter.get(
  '/saved-colleges',
  asyncHandler(async (request, response) => {
    const items = await prisma.savedCollege.findMany({
      where: { userId: request.user!.id },
      include: { college: true },
      orderBy: { createdAt: 'desc' }
    });

    response.json({ data: items });
  })
);

savedRouter.post(
  '/saved-colleges/:collegeId',
  asyncHandler(async (request, response) => {
    const collegeId = String(request.params.collegeId);
    const college = await prisma.college.findUnique({ where: { id: collegeId } });

    if (!college) {
      throw new HttpError(404, 'College not found.');
    }

    const saved = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: request.user!.id,
          collegeId: college.id
        }
      },
      update: {},
      create: {
        userId: request.user!.id,
        collegeId: college.id
      },
      include: { college: true }
    });

    response.status(201).json({ data: saved });
  })
);

savedRouter.delete(
  '/saved-colleges/:collegeId',
  asyncHandler(async (request, response) => {
    await prisma.savedCollege.deleteMany({
      where: {
        userId: request.user!.id,
        collegeId: String(request.params.collegeId)
      }
    });

    response.status(204).send();
  })
);

savedRouter.get(
  '/saved-comparisons',
  asyncHandler(async (request, response) => {
    const items = await prisma.savedComparison.findMany({
      where: { userId: request.user!.id },
      orderBy: { createdAt: 'desc' }
    });

    response.json({ data: items });
  })
);

savedRouter.post(
  '/saved-comparisons',
  asyncHandler(async (request, response) => {
    const input = comparisonSchema.parse(request.body);

    const comparison = await prisma.savedComparison.create({
      data: {
        userId: request.user!.id,
        collegeIds: input.collegeIds,
        label: input.label
      }
    });

    response.status(201).json({ data: comparison });
  })
);
