'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { apiDelete, apiGet } from '@/lib/api';
import { useCompare } from '@/components/compare/CompareContext';
import type { SavedComparisonsResponse, SavedComparisonSummary } from '@/types/comparison';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function SavedComparisonSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
          <div className="h-5 w-40 rounded bg-gray-200 mb-4" />
          <div className="h-4 w-full rounded bg-gray-100 mb-2" />
          <div className="h-4 w-5/6 rounded bg-gray-100 mb-6" />
          <div className="flex gap-3">
            <div className="h-10 flex-1 rounded bg-gray-200" />
            <div className="h-10 w-24 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SavedComparisonCard({
  comparison,
  onView,
  onDelete,
  isDeleting
}: {
  comparison: SavedComparisonSummary;
  onView: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {comparison.label?.trim() || 'Untitled comparison'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">Saved on {formatDate(comparison.createdAt)}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        {comparison.collegeNames.map((name) => (
          <div key={name} className="rounded-lg bg-gray-50 px-3 py-2">
            {name}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onView}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          View Comparison
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default function SavedComparisonsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setCompareBasket } = useCompare();
  const [comparisons, setComparisons] = useState<SavedComparisonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?callbackUrl=/saved-comparisons');
      return;
    }

    if (status !== 'authenticated') {
      return;
    }

    let cancelled = false;

    async function loadComparisons() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiGet<SavedComparisonsResponse>('/compare/saved');
        if (!cancelled) {
          setComparisons(response.comparisons);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load saved comparisons.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadComparisons();

    return () => {
      cancelled = true;
    };
  }, [router, status]);

  const handleViewComparison = (comparison: SavedComparisonSummary) => {
    setCompareBasket(
      comparison.collegeIds.map((collegeId, index) => ({
        id: collegeId,
        name: comparison.collegeNames[index]
      }))
    );
    router.push('/compare');
  };

  const handleDeleteComparison = async (comparisonId: string) => {
    try {
      setDeletingId(comparisonId);
      await apiDelete(`/compare/saved/${comparisonId}`);
      setComparisons((current) => current.filter((comparison) => comparison.id !== comparisonId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this comparison.');
    } finally {
      setDeletingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-10 w-72 rounded bg-gray-200 animate-pulse" />
          <SavedComparisonSkeleton />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Saved Comparisons</h1>
            <p className="mt-2 text-gray-600">Review, reopen, or delete your saved college comparison sets.</p>
          </div>
          <Link href="/colleges" className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-white">
            Back to Colleges
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {comparisons.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">No saved comparisons yet</h2>
            <p className="mt-3 text-gray-600">Compare a few colleges and save the result to come back to it later.</p>
            <Link href="/colleges" className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              Find Colleges
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {comparisons.map((comparison) => (
              <SavedComparisonCard
                key={comparison.id}
                comparison={comparison}
                onView={() => handleViewComparison(comparison)}
                onDelete={() => handleDeleteComparison(comparison.id)}
                isDeleting={deletingId === comparison.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}