// frontend/components/qa/QAPageContent.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { AskModal } from '@/components/qa/AskModal';
import { AnswerModal } from '@/components/qa/AnswerModal';
import { QuestionCard } from '@/components/qa/QuestionCard';
import { useQuestions } from '@/hooks/useQuestions';

function QuestionSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32" />
            <div className="h-3 bg-gray-300 rounded w-20" />
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
      </div>
      <div className="h-16 bg-gray-300 rounded" />
    </div>
  );
}

export function QAPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { questions, isLoading, error, refetch } = useQuestions();

  const [askModalOpen, setAskModalOpen] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const unanswered = searchParams.get('unanswered') === 'true';

  const handleToggleUnanswered = () => {
    const newUnanswered = !unanswered;
    const params = new URLSearchParams({
      page: '1',
      ...(newUnanswered && { unanswered: 'true' })
    });
    router.push(`/qa?${params}`);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const params = new URLSearchParams({
        page: String(page - 1),
        ...(unanswered && { unanswered: 'true' })
      });
      router.push(`/qa?${params}`);
    }
  };

  const handleNextPage = () => {
    if (questions?.pagination && page < questions.pagination.totalPages) {
      const params = new URLSearchParams({
        page: String(page + 1),
        ...(unanswered && { unanswered: 'true' })
      });
      router.push(`/qa?${params}`);
    }
  };

  const handleAnswerClick = (questionId: string) => {
    if (!session?.user) {
      alert('Please sign in to answer questions');
      return;
    }
    setSelectedQuestionId(questionId);
    setAnswerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <MessageCircle size={32} className="text-blue-600" />
              Q&A
            </h1>
            <p className="text-gray-600 mt-2">
              Ask questions about colleges, admissions, and placement
            </p>
          </div>
          <button
            onClick={() => {
              if (!session?.user) {
                alert('Please sign in to ask questions');
                return;
              }
              setAskModalOpen(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Ask Question
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={handleToggleUnanswered}
            className={`px-4 py-3 font-medium transition-colors ${
              !unanswered
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Questions
          </button>
          <button
            onClick={handleToggleUnanswered}
            className={`px-4 py-3 font-medium transition-colors ${
              unanswered
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unanswered
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4 mb-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <QuestionSkeleton key={i} />
            ))
          ) : questions?.data && questions.data.length > 0 ? (
            questions.data.map((q) => (
              <div key={q.id} className="space-y-2">
                <QuestionCard
                  question={q}
                  onDelete={refetch}
                />
                {!q.answer && session?.user && (
                  <button
                    onClick={() => handleAnswerClick(q.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium pl-4"
                  >
                    Answer this question
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                {unanswered ? 'No unanswered questions yet' : 'No questions yet'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Be the first to {unanswered ? 'answer a question' : 'ask a question'}!
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {questions?.pagination && questions.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-200">
            <button
              onClick={handlePreviousPage}
              disabled={page <= 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="text-sm text-gray-600">
              Page {page} of {questions.pagination.totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={page >= questions.pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AskModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        onSuccess={refetch}
      />
      <AnswerModal
        isOpen={answerModalOpen}
        questionId={selectedQuestionId}
        onClose={() => setAnswerModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
