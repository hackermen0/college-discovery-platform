// frontend/hooks/useQuestions.ts
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import type { PaginatedQuestions } from '@/types/question';

export function useQuestions() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const unanswered = searchParams.get('unanswered') === 'true';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PaginatedQuestions | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        ...(unanswered && { unanswered: 'true' })
      });
      const data = await apiGet<PaginatedQuestions>(`/questions?${params}`);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [page, unanswered]);

  return { questions, isLoading, error, refetch };
}
