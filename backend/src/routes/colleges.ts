import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { asyncHandler } from '../lib/async-handler';
import { HttpError } from '../lib/http-error';

export const collegesRouter = Router();

const listQuerySchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  course: z.string().optional(),
  minFees: z.coerce.number().int().nonnegative().optional(),
  maxFees: z.coerce.number().int().nonnegative().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  sortBy: z.enum(['name', 'rating', 'fees', 'placementRate']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
});

const compareBodySchema = z.object({
  collegeIds: z.array(z.string().min(1)).min(2).max(3)
});

function serializeCollege(college: {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placementRate: number;
  overview: string;
  placements: unknown;
  reviews: unknown;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...college,
    course: college.courses[0] ?? null
  };
}

function buildCollegeWhere(filters: z.infer<typeof listQuerySchema>) {
  const where: Record<string, unknown> = {};
  const andConditions: Array<Record<string, unknown>> = [];

  if (filters.query) {
    andConditions.push({
      OR: [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { location: { contains: filters.query, mode: 'insensitive' } },
        { courses: { has: filters.query } }
      ]
    });
  }

  if (filters.location) {
    andConditions.push({ location: { contains: filters.location, mode: 'insensitive' } });
  }

  if (filters.course) {
    andConditions.push({ courses: { has: filters.course } });
  }

  if (filters.minFees !== undefined || filters.maxFees !== undefined) {
    andConditions.push({
      fees: {
        ...(filters.minFees !== undefined ? { gte: filters.minFees } : {}),
        ...(filters.maxFees !== undefined ? { lte: filters.maxFees } : {})
      }
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  return where;
}

collegesRouter.get(
  '/',
  asyncHandler(async (request, response) => {
    const filters = listQuerySchema.parse(request.query);
    const where = buildCollegeWhere(filters);
    const skip = (filters.page - 1) * filters.limit;

    const [items, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy: { [filters.sortBy]: filters.sortOrder },
        skip,
        take: filters.limit
      }),
      prisma.college.count({ where })
    ]);

    response.json({
      data: items.map(serializeCollege),
      meta: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / filters.limit))
      }
    });
  })
);

collegesRouter.get(
  '/:id',
  asyncHandler(async (request, response) => {
    const collegeId = String(request.params.id);
    const college = await prisma.college.findUnique({ where: { id: collegeId } });

    if (!college) {
      throw new HttpError(404, 'College not found.');
    }

    response.json({ data: serializeCollege(college) });
  })
);

collegesRouter.post(
  '/compare',
  asyncHandler(async (request, response) => {
    const { collegeIds } = compareBodySchema.parse(request.body);
    const colleges = await prisma.college.findMany({ where: { id: { in: collegeIds } } });

    if (colleges.length !== collegeIds.length) {
      throw new HttpError(404, 'One or more colleges were not found.');
    }

    const comparison = colleges.map((college: Parameters<typeof serializeCollege>[0]) => serializeCollege(college));

    response.json({ data: comparison });
  })
);
