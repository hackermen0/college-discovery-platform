// frontend/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@/components/auth/UserMenu';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/colleges', label: 'Colleges' },
    { href: '/compare', label: 'Compare' },
    { href: '/saved-comparisons', label: 'Saved Comparisons' },
    { href: '/qa', label: 'Q&A' }
  ];

  return (
    <header className="w-full border-b border-gray-600 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-2">
        <Link href="/" className="text-2xl font-bold text-gray-900 shrink-0">
          College Discovery
        </Link>

        <div className="flex items-center gap-4 flex-wrap">
          <nav className="flex gap-6 flex-wrap">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.href === '/saved-comparisons' ? (
                  <>
                    <span className="hidden sm:inline">{link.label}</span>
                    <span className="sm:hidden">Saved</span>
                  </>
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </nav>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
