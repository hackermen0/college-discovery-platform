// frontend/app/qa/page.tsx
'use client';

import { Suspense } from 'react';
import { QAPageContent } from '../../components/qa/QAPageContent';

function QAPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}

export default function QAPage() {
  return (
    <Suspense fallback={<QAPageSkeleton />}>
      <QAPageContent />
    </Suspense>
  );
}
