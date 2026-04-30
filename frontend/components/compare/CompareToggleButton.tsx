'use client';

import { Check, Plus } from 'lucide-react';
import { useCompare } from '@/components/compare/CompareContext';

interface CompareToggleButtonProps {
  collegeId: string;
  collegeName: string;
  className?: string;
  compact?: boolean;
}

export function CompareToggleButton({
  collegeId,
  collegeName,
  className = '',
  compact = false
}: CompareToggleButtonProps) {
  const { compareCount, isInCompare, addToCompare, removeFromCompare } = useCompare();

  const selected = isInCompare(collegeId);
  const isDisabled = !selected && compareCount >= 3;

  const handleToggle = () => {
    if (selected) {
      removeFromCompare(collegeId);
      return;
    }

    if (!isDisabled) {
      addToCompare(collegeId, collegeName);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isDisabled}
      title={isDisabled ? 'Maximum 3 colleges' : selected ? 'Remove from comparison' : 'Add to comparison'}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed ${
        compact ? 'px-4 py-2 text-sm' : 'px-4 py-2 text-sm'
      } ${
        selected
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
      } ${className}`}
    >
      {selected ? <Check size={16} /> : <Plus size={16} />}
      {selected ? 'Remove' : 'Add to Compare'}
    </button>
  );
}