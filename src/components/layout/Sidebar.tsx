'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@prisma/client';

const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/dashboard',     roles: ['DISPATCHER'] as UserRole[] },
  { label: 'Fleet',           href: '/fleet',         roles: ['FLEET_MANAGER'] as UserRole[] },
  { label: 'Drivers',         href: '/drivers',       roles: ['SAFETY_OFFICER'] as UserRole[] },
  { label: 'Trips',           href: '/trips',         roles: ['DISPATCHER'] as UserRole[] },
  { label: 'Maintenance',     href: '/maintenance',   roles: ['FLEET_MANAGER'] as UserRole[] },
  { label: 'Fuel & Expenses', href: '/fuel-expenses', roles: ['FINANCIAL_ANALYST'] as UserRole[] },
  { label: 'Analytics',       href: '/analytics',     roles: ['FINANCIAL_ANALYST'] as UserRole[] },
  { label: 'Settings',        href: '/settings',      roles: ['SAFETY_OFFICER'] as UserRole[] },
];

const DIVIDER_BEFORE = new Set(['/fuel-expenses', '/settings']);

const ROLE_LABELS: Record<UserRole, string> = {
  SAFETY_OFFICER:    'Safety Officer',
  FLEET_MANAGER:     'Fleet Manager',
  DISPATCHER:        'Dispatcher',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export default function Sidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  const visible = NAV_ITEMS.filter(i => i.roles.includes(userRole));

  return (
    <aside
      style={{
        width: 160,
        minWidth: 160,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 8L4.5 3L7 8L9.5 5"
                stroke="var(--bg-page)"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            TransitOps
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {visible.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <React.Fragment key={item.href}>
              {DIVIDER_BEFORE.has(item.href) && (
                <div style={{ height: 1, margin: '6px 4px', background: 'var(--border)' }} />
              )}
              <Link
                href={item.href}
                style={{
                  display: 'block',
                  padding: '7px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  letterSpacing: '-0.01em',
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: isActive ? 'var(--input-bg)' : 'transparent',
                  transition: 'background 0.1s, color 0.1s',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--input-bg)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  }
                }}
              >
                {item.label}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 8px' }}>
        <button
          onClick={async () => {
            try { await fetch('/api/auth/logout', { method: 'POST' }); } finally {
              window.location.href = '/login';
            }
          }}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            padding: '7px 12px', borderRadius: 6,
            fontSize: 13, color: 'var(--text-muted)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            transition: 'background 0.1s, color 0.1s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--input-bg)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
        >
          Sign Out
        </button>
        <p style={{ marginTop: 6, padding: '0 12px', fontSize: 11, color: 'var(--text-muted)', opacity: 0.6, letterSpacing: '0.01em' }}>
          v1.0 · {ROLE_LABELS[userRole]}
        </p>
      </div>
    </aside>
  );
}
