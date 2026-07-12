'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';
import { UserRole } from '@prisma/client';

export function Header({ userRole, userName }: { userRole: UserRole; userName: string }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Generate breadcrumbs from path
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg) => {
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-8 transition-colors duration-200 shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-zinc-400 dark:text-zinc-500">TransitOps</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb}>
            <span className="text-zinc-300 dark:text-zinc-600">&gt;</span>
            <span className={idx === breadcrumbs.length - 1 ? 'text-zinc-900 dark:text-zinc-100 font-semibold' : 'text-zinc-400 dark:text-zinc-500'}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-1.5 pl-8 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:border-zinc-900 focus:ring-zinc-900 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Theme switch button */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'dark' ? (
            // Sun icon
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            // Moon icon
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </button>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Role and User avatar */}
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-2 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            {formatRole(userRole)}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-sm font-bold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
            {getInitials(userName)}
          </div>
        </div>
      </div>
    </header>
  );
}
