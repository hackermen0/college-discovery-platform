// frontend/components/qa/QuestionCard.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { apiDelete } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';
import type { Question } from '@/types/question';

interface QuestionCardProps {
  question: Question;
  onDelete?: () => void;
}

export function QuestionCard({ question, onDelete }: QuestionCardProps) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = !!(session?.user?.id && question.user?.id && session.user.id === question.user.id);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    setIsDeleting(true);
    try {
      await apiDelete(`/questions/${question.id}`);
      onDelete?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete question');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {question.user?.imageUrl ? (
            <img
              src={question.user.imageUrl}
              alt={question.user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
              {(question.user?.name?.charAt(0) || 'U').toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {question.user?.name || 'Anonymous'}
            </p>
            <p className="text-xs text-gray-500">
              {formatRelativeTime(question.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            title="Delete question"
            aria-label="Delete question"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Question */}
      <p className="text-gray-800 mb-3 text-sm leading-relaxed">{question.question}</p>

      {/* Answer */}
      {question.answer ? (
        <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded">
          <p className="text-xs font-medium text-blue-900 mb-1">Answer:</p>
          <p className="text-sm text-gray-700">{question.answer}</p>
        </div>
      ) : (
        <div className="text-xs text-gray-500 italic">
          Waiting for an answer...
        </div>
      )}
    </div>
  );
}
