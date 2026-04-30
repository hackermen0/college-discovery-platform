'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useCompare } from '@/components/compare/CompareContext';

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="flex h-12 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-xs text-gray-400">
      {label}
    </div>
  );
}

export function FloatingComparisonBar() {
  const router = useRouter();
  const { selectedItems, compareCount, clearCompare, removeFromCompare, isHydrated } = useCompare();

  if (!isHydrated || compareCount === 0) {
    return null;
  }

  const slots = Array.from({ length: 3 }, (_, index) => selectedItems[index]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur shadow-[0_-12px_40px_rgba(15,23,42,0.12)]">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
            {slots.map((item, index) =>
              item ? (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {item.name?.[0]?.toUpperCase() || String(index + 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{item.name || 'Selected college'}</p>
                    <p className="text-xs text-gray-500">Selected for comparison</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(item.id)}
                    className="rounded-full p-1 text-gray-400 hover:bg-white hover:text-gray-700"
                    aria-label={`Remove ${item.name || 'college'} from comparison`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <EmptySlot key={`empty-${index}`} label="Empty slot" />
              )
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={clearCompare}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => router.push('/compare')}
              disabled={compareCount < 2}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              Compare Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}