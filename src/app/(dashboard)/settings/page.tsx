'use client';

import { useEffect, useState } from 'react';

const SECURITY_ITEMS = [
  { label: 'Account Lock Threshold', value: '5 failed attempts' },
  { label: 'Lock Duration',          value: '30 minutes' },
  { label: 'Session Duration',       value: '24 hours (or 30 days with Remember Me)' },
];

const SAFETY_ITEMS = [
  { label: 'Safety Score Range',    value: '0 – 100' },
  { label: 'License Expiry Warning', value: '30 days before expiry' },
];

export default function SettingsPage() {
  // ── account info from server ──────────────────────────────────────────────
  const [account, setAccount] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          const roleLabel: Record<string, string> = {
            SAFETY_OFFICER:    'Safety Officer',
            FLEET_MANAGER:     'Fleet Manager',
            DISPATCHER:        'Dispatcher',
            FINANCIAL_ANALYST: 'Financial Analyst',
          };
          setAccount({
            name:  j.data.name,
            email: j.data.email,
            role:  roleLabel[j.data.role] ?? j.data.role,
          });
        }
      })
      .catch(() => {});
  }, []);

  const accountItems = [
    { label: 'Full Name', value: account?.name  ?? '…' },
    { label: 'Email',     value: account?.email ?? '…' },
    { label: 'Role',      value: account?.role  ?? '…' },
  ];

  // ── password change ───────────────────────────────────────────────────────
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');
    setMessage('');

    if (form.next !== form.confirm) {
      setStatus('error');
      setMessage('New passwords do not match.');
      return;
    }
    if (form.next.length < 8) {
      setStatus('error');
      setMessage('New password must be at least 8 characters.');
      return;
    }
    // API not yet implemented — show a clear placeholder message
    setStatus('error');
    setMessage('Password change is not yet available. Contact your administrator to reset your password.');
  }

  // ── shared styles ─────────────────────────────────────────────────────────
  const card = 'rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-zinc-950 overflow-hidden';
  const cardHeader = 'px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.06]';
  const inputCls = 'w-full h-10 px-3 rounded-lg text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-colors';

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page header */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-zinc-400 dark:text-white/40 mb-1">
          Configuration
        </p>
        <h1 className="text-[26px] font-bold tracking-tight text-zinc-900 dark:text-white">
          Settings
        </h1>
      </div>

      {/* Account */}
      <div className={card}>
        <div className={cardHeader}>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Account</h2>
        </div>
        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {accountItems.map(item => (
            <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</span>
              <span className="text-sm text-zinc-900 dark:text-zinc-200">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security config */}
      <div className={card}>
        <div className={cardHeader}>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Security</h2>
        </div>
        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {SECURITY_ITEMS.map(item => (
            <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</span>
              <span className="text-sm text-zinc-900 dark:text-zinc-200">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Driver safety */}
      <div className={card}>
        <div className={cardHeader}>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Driver Safety</h2>
        </div>
        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          {SAFETY_ITEMS.map(item => (
            <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</span>
              <span className="text-sm text-zinc-900 dark:text-zinc-200">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className={card}>
        <div className={`${cardHeader} flex items-center justify-between`}>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Change Password</h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/[0.06] text-zinc-400 dark:text-white/40 border border-zinc-200 dark:border-white/[0.08]">
            Not yet available
          </span>
        </div>
        <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
          {status === 'error' && (
            <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
              {message}
            </div>
          )}
          {status === 'success' && (
            <div className="rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
              {message}
            </div>
          )}

          {(['current', 'next', 'confirm'] as const).map(field => (
            <div key={field} className="space-y-1.5">
              <label htmlFor={field} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {field === 'current' ? 'Current Password' : field === 'next' ? 'New Password' : 'Confirm New Password'}
              </label>
              <input
                id={field}
                type="password"
                value={form[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                required
                className={inputCls}
              />
            </div>
          ))}

          <div className="flex justify-end pt-1">
            <button type="submit" className="h-9 px-4 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
