// frontend/components/auth/UserMenu.tsx
'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === 'loading') {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Link
        href="/auth/login"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg hover:bg-gray-100 px-3 py-2 transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <span className="text-sm font-medium text-gray-900 hidden sm:inline">
          {session.user.name || session.user.email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
            <p className="text-xs text-gray-500">{session.user.email}</p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: '/' });
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
