import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { asyncHandler } from '../lib/async-handler';
import { getSessionUser } from '../middleware/auth';

export const questionsRouter = Router();

const createQuestionSchema = z.object({
  question: z.string().min(3).max(500),
  authorName: z.string().max(120).optional()
});

function generateAnswer(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes('fees') || normalized.includes('fee')) {
    return 'Compare the fee range, placement percentage, and rating side by side before shortlisting colleges.';
  }

  if (normalized.includes('placement')) {
    return 'Use placement rate and average package together. A slightly lower package can still be strong if the placement percentage is high.';
  }

  if (normalized.includes('course') || normalized.includes('branch')) {
    return 'Match the course curriculum with your target career path, then compare campus outcomes and alumni strength.';
  }

  return 'Start with filters for location, budget, and placement outcomes. Then shortlist 2-3 colleges and compare them directly.';
}

questionsRouter.get(
  '/',
  asyncHandler(async (_request, response) => {
    const questions = await prisma.question.findMany({ orderBy: { createdAt: 'desc' }, take: 25 });
    response.json({ data: questions });
  })
);

questionsRouter.post(
  '/',
  asyncHandler(async (request, response) => {
    const input = createQuestionSchema.parse(request.body);
    const answer = generateAnswer(input.question);
    const user = await getSessionUser(request);

    const question = await prisma.question.create({
      data: {
        question: input.question,
        answer,
        userId: user?.id
      }
    });

    response.status(201).json({ data: question });
  })
);
