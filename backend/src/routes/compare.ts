import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { asyncHandler } from '../lib/async-handler';
import { HttpError } from '../lib/http-error';
import { requireAuth } from '../middleware/auth';

export const compareRouter = Router();

const compareSchema = z.object({
  collegeIds: z.array(z.string().min(1)).min(2).max(3)
});

const saveComparisonSchema = compareSchema.extend({
  label: z.string().trim().min(1).max(120).optional()
});

type CollegePlacementJson = {
  averageSalary?: number;
  topRecruiters?: string[];
  rate?: number;
};

function serializeComparisonCollege(college: {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placementRate: number;
  placements: unknown;
}) {
  const placements = (college.placements ?? {}) as CollegePlacementJson;

  return {
    id: college.id,
    name: college.name,
    location: college.location,
    fees: college.fees,
    rating: college.rating,
    courses: college.courses,
    placementRate: college.placementRate,
    placements: {
      averageSalary: Number(placements.averageSalary ?? 0),
      topRecruiters: Array.isArray(placements.topRecruiters) ? placements.topRecruiters : [],
      rate: Number(placements.rate ?? college.placementRate)
    }
  };
}

async function loadCollegesByIds(collegeIds: string[]) {
  const colleges = await prisma.college.findMany({
    where: { id: { in: collegeIds } }
  });

  if (colleges.length !== collegeIds.length) {
    throw new HttpError(404, 'One or more colleges were not found.');
  }

  const collegeMap = new Map(colleges.map((college) => [college.id, college]));

  return collegeIds.map((collegeId) => {
    const college = collegeMap.get(collegeId);

    if (!college) {
      throw new HttpError(404, 'One or more colleges were not found.');
    }

    return serializeComparisonCollege(college);
  });
}

compareRouter.post(
  '/',
  asyncHandler(async (request, response) => {
    const input = compareSchema.parse(request.body);

    if (new Set(input.collegeIds).size !== input.collegeIds.length) {
      throw new HttpError(400, 'Please choose different colleges to compare.');
    }

    const colleges = await loadCollegesByIds(input.collegeIds);

    response.json({ colleges });
  })
);

compareRouter.post(
  '/save',
  requireAuth,
  asyncHandler(async (request, response) => {
    const input = saveComparisonSchema.parse(request.body);

    if (new Set(input.collegeIds).size !== input.collegeIds.length) {
      throw new HttpError(400, 'Please choose different colleges to compare.');
    }

    await loadCollegesByIds(input.collegeIds);

    const comparison = await prisma.savedComparison.create({
      data: {
        userId: request.user!.id,
        collegeIds: input.collegeIds,
        label: input.label
      }
    });

    response.status(201).json({ comparison });
  })
);

compareRouter.get(
  '/saved',
  requireAuth,
  asyncHandler(async (request, response) => {
    const comparisons = await prisma.savedComparison.findMany({
      where: { userId: request.user!.id },
      orderBy: { createdAt: 'desc' }
    });

    const colleges = await prisma.college.findMany({
      where: {
        id: {
          in: comparisons.flatMap((comparison) => comparison.collegeIds)
        }
      },
      select: {
        id: true,
        name: true
      }
    });

    const collegeMap = new Map(colleges.map((college) => [college.id, college.name]));

    const items = comparisons.map((comparison) => ({
      id: comparison.id,
      userId: comparison.userId,
      collegeIds: comparison.collegeIds,
      label: comparison.label,
      createdAt: comparison.createdAt,
      collegeNames: comparison.collegeIds.map((collegeId) => collegeMap.get(collegeId) ?? 'Unknown college')
    }));

    response.json({ comparisons: items });
  })
);

compareRouter.delete(
  '/saved/:id',
  requireAuth,
  asyncHandler(async (request, response) => {
    const comparison = await prisma.savedComparison.findFirst({
      where: {
        id: String(request.params.id),
        userId: request.user!.id
      }
    });

    if (!comparison) {
      throw new HttpError(404, 'Saved comparison not found.');
    }

    await prisma.savedComparison.delete({
      where: { id: comparison.id }
    });

    response.status(204).send();
  })
);