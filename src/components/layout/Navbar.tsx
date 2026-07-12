'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { UserRole } from '@prisma/client';

const BREADCRUMBS: Record<string, string[]> = {
  '/fleet':         ['Fleet', 'Vehicle Registry'],
  '/maintenance':   ['Fleet', 'Maintenance'],
  '/dashboard':     ['Dashboard'],
  '/drivers':       ['Drivers'],
  '/trips':         ['Trips'],
  '/fuel-expenses': ['Fuel & Expenses'],
  '/analytics':     ['Analytics'],
  '/settings':      ['Settings'],
};

const ROLE_LABELS: Record<UserRole, string> = {
  SAFETY_OFFICER:    'Safety Officer',
  FLEET_MANAGER:     'Fleet Manager',
  DISPATCHER:        'Dispatcher',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Navbar({ userRole, userName }: { userRole: UserRole; userName: string }) {
  const pathname = usePathname();

  const crumbs =
    Object.entries(BREADCRUMBS).find(([key]) =>
      pathname === key || (key !== '/dashboard' && pathname.startsWith(key))
    )?.[1] ?? ['TransitOps'];

  return (
    <header style={{
      height: 52,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'var(--bg-navbar)',
      borderBottom: '1px solid var(--border)',
    }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
                <path d="M4 2.5L7.5 6L4 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span style={{
              fontSize: 13,
              letterSpacing: '-0.01em',
              fontWeight: i === crumbs.length - 1 ? 500 : 400,
              color: i === crumbs.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)',
            }}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M9 9L11.5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            style={{
              paddingLeft: 30, paddingRight: 12, paddingTop: 6, paddingBottom: 6,
              width: 180, borderRadius: 7, fontSize: 13,
              color: 'var(--text-primary)',
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              outline: 'none',
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Role badge */}
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 6,
          color: 'var(--text-secondary)',
          background: 'var(--input-bg)',
          border: '1px solid var(--border)',
        }}>
          {ROLE_LABELS[userRole]}
        </span>

        {/* Avatar */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
          color: 'var(--text-primary)',
          background: 'var(--input-bg)',
          border: '1px solid var(--border)',
          cursor: 'default', userSelect: 'none', flexShrink: 0,
        }}>
          {getInitials(userName)}
        </div>
      </div>
    </header>
  );
}
