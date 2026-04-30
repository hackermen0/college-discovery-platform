import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { asyncHandler } from '../lib/async-handler';
import { requireAuth, getSessionUser } from '../middleware/auth';

export const questionsRouter = Router();

function normalizeParam(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value.length > 0 ? String(value[0]) : undefined;
  if (typeof value === 'string') return value;
  return String(value);
}

const createQuestionSchema = z.object({
  question: z.string().min(10).max(500)
});

const answerSchema = z.object({
  answer: z.string().min(5).max(2000)
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

// GET /questions
// Supports: ?page=1&limit=10&unanswered=true
questionsRouter.get(
  '/',
  asyncHandler(async (request, response) => {
    const pageStr = normalizeParam(request.query.page) ?? '1';
    const limitStr = normalizeParam(request.query.limit) ?? '10';
    const unansweredStr = (normalizeParam(request.query.unanswered) ?? '').toLowerCase();

    const page = Math.max(1, parseInt(pageStr, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitStr, 10) || 10));
    const unanswered = unansweredStr === 'true';

    const where: any = {};
    if (unanswered) where.answer = null;

    const total = await prisma.question.count({ where });

    const questions = await prisma.question.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { id: true, name: true, imageUrl: true, email: true } } }
    });

    response.json({
      data: questions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  })
);

// GET /questions/:id
questionsRouter.get(
  '/:id',
  asyncHandler(async (request, response) => {
    const id = normalizeParam((request.params as any).id) ?? '';

    const question = await prisma.question.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, imageUrl: true, email: true } } }
    });

    if (!question) {
      response.status(404).json({ error: 'Question not found' });
      return;
    }

    response.json({ data: question });
  })
);

// POST /questions (protected)
questionsRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (request, response) => {
    const input = createQuestionSchema.parse(request.body);

    // Use session user set by requireAuth
    const user = request.user || (await getSessionUser(request));

    const question = await prisma.question.create({
      data: {
        question: input.question,
        answer: null,
        userId: user?.id
      },
      include: { user: { select: { id: true, name: true, imageUrl: true, email: true } } }
    });

    response.status(201).json({ data: question });
  })
);

// POST /questions/:id/answer (protected)
questionsRouter.post(
  '/:id/answer',
  requireAuth,
  asyncHandler(async (request, response) => {
    const id = normalizeParam((request.params as any).id) ?? '';
    const input = answerSchema.parse(request.body);

    const question = await prisma.question.findUnique({ where: { id } });

    if (!question) {
      response.status(404).json({ error: 'Question not found' });
      return;
    }

    if (question.answer) {
      response.status(409).json({ error: 'Question already answered' });
      return;
    }

    const updated = await prisma.question.update({
      where: { id },
      data: { answer: input.answer },
      include: { user: { select: { id: true, name: true, imageUrl: true, email: true } } }
    });

    response.json({ data: updated });
  })
);

// DELETE /questions/:id (protected)
questionsRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (request, response) => {
    const id = normalizeParam((request.params as any).id) ?? '';

    const question = await prisma.question.findUnique({ where: { id } });

    if (!question) {
      response.status(404).json({ error: 'Question not found' });
      return;
    }

    // Only owner may delete
    if (question.userId && question.userId !== request.user?.id) {
      response.status(403).json({ error: 'Not authorized to delete this question' });
      return;
    }

    await prisma.question.delete({ where: { id } });
    response.status(204).send();
  })
);
