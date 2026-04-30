// frontend/hooks/useColleges.ts
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { College, ListCollegesResponse, CollegePagination } from '@/types/college';

interface UseCollegesReturn {
  colleges: College[];
  pagination: CollegePagination;
  isLoading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  setFilters: (filters: Partial<Record<string, string | number | null>>) => void;
}

export function useColleges(): UseCollegesReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<CollegePagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') ?? '1', 10);

  const fetchColleges = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');

      if (searchParams.get('search')) params.set('query', searchParams.get('search')!);
      if (searchParams.get('location')) params.set('location', searchParams.get('location')!);
      if (searchParams.get('course')) params.set('course', searchParams.get('course')!);
      if (searchParams.get('minFees')) params.set('minFees', searchParams.get('minFees')!);
      if (searchParams.get('maxFees')) params.set('maxFees', searchParams.get('maxFees')!);
      if (searchParams.get('minRating')) params.set('minRating', searchParams.get('minRating')!);
      if (searchParams.get('sortBy')) params.set('sortBy', searchParams.get('sortBy')!);
      if (searchParams.get('sortOrder')) params.set('sortOrder', searchParams.get('sortOrder')!);

      const response = await apiFetch<ListCollegesResponse>(
        `/colleges?${params.toString()}`,
        { method: 'GET' }
      );

      setColleges(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch colleges');
      setColleges([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [searchParams, page]);

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const setFilters = (filters: Partial<Record<string, string | number | null>>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  return {
    colleges,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    setFilters
  };
}
