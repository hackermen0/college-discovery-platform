// frontend/components/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { CompareProvider } from '@/components/compare/CompareContext';
import { FloatingComparisonBar } from '@/components/compare/FloatingComparisonBar';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CompareProvider>
        {children}
        <FloatingComparisonBar />
      </CompareProvider>
    </SessionProvider>
  );
}
