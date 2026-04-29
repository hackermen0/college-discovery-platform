import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { asyncHandler } from '../lib/async-handler';

export const predictorRouter = Router();

const querySchema = z.object({
  exam: z.string().min(1),
  rank: z.coerce.number().int().positive()
});

function deriveRecommendationBands(rank: number) {
  if (rank <= 5000) {
    return { maxFees: 400000, minRating: 4.2, minPlacementRate: 82 };
  }

  if (rank <= 20000) {
    return { maxFees: 300000, minRating: 4.0, minPlacementRate: 76 };
  }

  if (rank <= 50000) {
    return { maxFees: 220000, minRating: 3.8, minPlacementRate: 70 };
  }

  return { maxFees: 150000, minRating: 3.6, minPlacementRate: 65 };
}

predictorRouter.get(
  '/',
  asyncHandler(async (request, response) => {
    const input = querySchema.parse(request.query);
    const bands = deriveRecommendationBands(input.rank);

    const colleges = await prisma.college.findMany({
      where: {
        fees: { lte: bands.maxFees },
        rating: { gte: bands.minRating },
        placementRate: { gte: bands.minPlacementRate }
      },
      orderBy: [{ placementRate: 'desc' }, { rating: 'desc' }],
      take: 10
    });

    response.json({
      data: {
        exam: input.exam,
        rank: input.rank,
        bands,
        colleges
      }
    });
  })
);
