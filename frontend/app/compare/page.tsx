'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { apiPost } from '@/lib/api';
import { useCompare } from '@/components/compare/CompareContext';
import type { CompareCollege, CompareResponse, SaveComparisonResponse } from '@/types/comparison';

function formatFees(fees: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(fees);
}

function formatSalary(amount: number) {
  return `₹${amount} LPA`;
}

function getBestIndices(colleges: CompareCollege[], selector: (college: CompareCollege) => number, direction: 'min' | 'max') {
  const values = colleges.map(selector);
  const target = direction === 'min' ? Math.min(...values) : Math.max(...values);
  return values.reduce<number[]>((indices, value, index) => {
    if (value === target) {
      indices.push(index);
    }
    return indices;
  }, []);
}

function calculatePercentageBetter(colleges: CompareCollege[], selector: (college: CompareCollege) => number, direction: 'min' | 'max', bestIndex: number): string | null {
  const values = colleges.map(selector);
  const bestValue = values[bestIndex];
  
  if (values.length < 2) return null;
  
  if (direction === 'min') {
    const otherValues = values.filter((_, i) => i !== bestIndex);
    const worstValue = Math.max(...otherValues);
    const percentage = ((worstValue - bestValue) / worstValue * 100).toFixed(1);
    return percentage;
  } else {
    const otherValues = values.filter((_, i) => i !== bestIndex);
    const worstValue = Math.min(...otherValues);
    const percentage = ((bestValue - worstValue) / worstValue * 100).toFixed(1);
    return percentage;
  }
}

function ComparisonSkeleton() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-240 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
        <div className="h-8 w-48 rounded bg-gray-200 mb-6" />
        <div className="grid grid-cols-4 gap-3 mb-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 rounded-lg bg-gray-200" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-3 mb-3">
            {Array.from({ length: 4 }).map((__, colIndex) => (
              <div key={colIndex} className="h-14 rounded-lg bg-gray-100" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonTable({ colleges }: { colleges: CompareCollege[] }) {
  const lowestFees = useMemo(() => getBestIndices(colleges, (college) => college.fees, 'min'), [colleges]);
  const highestRating = useMemo(() => getBestIndices(colleges, (college) => college.rating, 'max'), [colleges]);
  const highestPlacement = useMemo(() => getBestIndices(colleges, (college) => college.placementRate, 'max'), [colleges]);
  const highestSalary = useMemo(() => getBestIndices(colleges, (college) => college.placements.averageSalary, 'max'), [colleges]);

  const rows = [
    {
      label: 'Location',
      render: (college: CompareCollege) => college.location
    },
    {
      label: 'Annual Fees',
      render: (college: CompareCollege, index: number) => {
        const isBest = lowestFees.includes(index);
        const percentage = isBest ? calculatePercentageBetter(colleges, (c) => c.fees, 'min', index) : null;
        return (
          <div className={isBest ? 'rounded-md bg-emerald-50 px-2 py-1' : ''}>
            <span className={isBest ? 'font-semibold text-emerald-700' : ''}>
              {formatFees(college.fees)}
            </span>
            {percentage && <div className="text-xs text-emerald-600 font-medium mt-0.5">better by {percentage}%</div>}
          </div>
        );
      }
    },
    {
      label: 'Rating',
      render: (college: CompareCollege, index: number) => {
        const isBest = highestRating.includes(index);
        const percentage = isBest ? calculatePercentageBetter(colleges, (c) => c.rating, 'max', index) : null;
        return (
          <div className={isBest ? 'rounded-md bg-emerald-50 px-2 py-1' : ''}>
            <span className={isBest ? 'font-semibold text-emerald-700' : ''}>
              ⭐ {college.rating.toFixed(1)}
            </span>
            {percentage && <div className="text-xs text-emerald-600 font-medium mt-0.5">better by {percentage}%</div>}
          </div>
        );
      }
    },
    {
      label: 'Placement Rate',
      render: (college: CompareCollege, index: number) => {
        const isBest = highestPlacement.includes(index);
        const percentage = isBest ? calculatePercentageBetter(colleges, (c) => c.placementRate, 'max', index) : null;
        return (
          <div className={isBest ? 'rounded-md bg-emerald-50 px-2 py-1' : ''}>
            <span className={isBest ? 'font-semibold text-emerald-700' : ''}>
              {college.placementRate}%
            </span>
            {percentage && <div className="text-xs text-emerald-600 font-medium mt-0.5">better by {percentage}%</div>}
          </div>
        );
      }
    },
    {
      label: 'Avg. Salary',
      render: (college: CompareCollege, index: number) => {
        const isBest = highestSalary.includes(index);
        const percentage = isBest ? calculatePercentageBetter(colleges, (c) => c.placements.averageSalary, 'max', index) : null;
        return (
          <div className={isBest ? 'rounded-md bg-emerald-50 px-2 py-1' : ''}>
            <span className={isBest ? 'font-semibold text-emerald-700' : ''}>
              {formatSalary(college.placements.averageSalary)}
            </span>
            {percentage && <div className="text-xs text-emerald-600 font-medium mt-0.5">better by {percentage}%</div>}
          </div>
        );
      }
    },
    {
      label: 'Top Recruiters',
      render: (college: CompareCollege) => (
        <div className="flex flex-wrap gap-2">
          {college.placements.topRecruiters.map((recruiter) => (
            <span key={recruiter} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {recruiter}
            </span>
          ))}
        </div>
      )
    },
    {
      label: 'Courses Offered',
      render: (college: CompareCollege) => (
        <div className="flex flex-wrap gap-2">
          {college.courses.map((course) => (
            <span key={course} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {course}
            </span>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-240 w-full border-collapse text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-52 border-b border-gray-200 px-4 py-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Attribute
            </th>
            {colleges.map((college) => (
              <th key={college.id} className="border-b border-gray-200 px-4 py-4 text-sm font-semibold text-gray-900">
                <div className="space-y-1">
                  <div className="text-base font-bold text-gray-900">{college.name}</div>
                  <div className="text-xs text-gray-500">{college.location}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="align-top">
              <td className="border-b border-gray-100 bg-gray-50 px-4 py-4 text-sm font-semibold text-gray-900">
                {row.label}
              </td>
              {colleges.map((college, index) => (
                <td key={college.id} className="border-b border-gray-100 px-4 py-4 text-sm text-gray-700">
                  {row.render(college, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ComparePage() {
  const { status } = useSession();
  const { selectedItems, selectedIds, isHydrated } = useCompare();
  const [comparison, setComparison] = useState<CompareCollege[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveLabel, setSaveLabel] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedIds.length < 2) {
      return;
    }

    let cancelled = false;

    async function loadComparison() {
      try {
        setIsLoading(true);
        setError(null);
        setSaveMessage(null);

        const response = await apiPost<CompareResponse>('/compare', { collegeIds: selectedIds });

        if (!cancelled) {
          setComparison(response.colleges);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setComparison(null);
          setError(fetchError instanceof Error ? fetchError.message : 'Unable to load the comparison right now.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadComparison();

    return () => {
      cancelled = true;
    };
  }, [selectedIds]);

  const handleSaveComparison = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      const response = await apiPost<SaveComparisonResponse>('/compare/save', {
        collegeIds: selectedIds,
        label: saveLabel.trim() || undefined
      });
      setSaveMessage(response.comparison.label ? 'Comparison saved.' : 'Comparison saved successfully.');
      setSaveLabel('');
    } catch (saveError) {
      setSaveMessage(saveError instanceof Error ? saveError.message : 'Unable to save this comparison.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isHydrated) {
    return <ComparisonSkeleton />;
  }

  if (selectedIds.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Select at least 2 colleges to compare</h1>
          <p className="mt-3 text-gray-600">Add two or three colleges from the listing or detail page to build a side-by-side comparison.</p>
          <Link
            href="/colleges"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Colleges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Compare Colleges</h1>
            <p className="mt-2 text-gray-600">
              {selectedItems.map((item) => item.name).filter(Boolean).join(' vs ')}
            </p>
          </div>
          <div className="text-sm text-gray-500">{selectedIds.length} selected</div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <ComparisonSkeleton />
        ) : comparison ? (
          <ComparisonTable colleges={comparison} />
        ) : null}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Save this comparison</h2>
          {status === 'authenticated' ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={saveLabel}
                onChange={(event) => setSaveLabel(event.target.value)}
                placeholder="Label this comparison (optional)"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={handleSaveComparison}
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isSaving ? 'Saving...' : 'Save Comparison'}
              </button>
            </div>
          ) : (
            <p className="mt-4 text-gray-600">
              <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Login to save this comparison
              </Link>
            </p>
          )}

          {saveMessage && <p className="mt-3 text-sm text-gray-600">{saveMessage}</p>}
        </div>
      </div>
    </div>
  );
}