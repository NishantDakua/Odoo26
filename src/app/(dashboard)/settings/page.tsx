// todo: settings page
export default function SettingsPage() {
  return <div className="p-6"><h1 className="text-xl font-semibold text-gray-800">Settings</h1><p className="text-gray-500 mt-2">Coming soon.</p></div>;
'use client';

import { useState } from 'react';

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { label: 'Full Name', value: 'Managed by administrator', readonly: true },
      { label: 'Email', value: 'Managed by administrator', readonly: true },
      { label: 'Role', value: 'Safety Officer', readonly: true },
    ],
  },
  {
    title: 'Security',
    items: [
      { label: 'Account Lock Threshold', value: '5 failed attempts', readonly: true },
      { label: 'Lock Duration', value: '30 minutes', readonly: true },
      { label: 'Session Duration', value: '24 hours (or 30 days with Remember Me)', readonly: true },
    ],
  },
  {
    title: 'Driver Safety',
    items: [
      { label: 'Safety Score Range', value: '0 – 100', readonly: true },
      { label: 'License Expiry Warning', value: '30 days before expiry', readonly: true },
    ],
  },
];

export default function SettingsPage() {
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [pwStatus, setPwStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pwMessage, setPwMessage] = useState('');

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwStatus('idle');
    setPwMessage('');

    if (passwordForm.next !== passwordForm.confirm) {
      setPwStatus('error');
      setPwMessage('New passwords do not match.');
      return;
    }
    if (passwordForm.next.length < 8) {
      setPwStatus('error');
      setPwMessage('New password must be at least 8 characters.');
      return;
    }

    // Placeholder — password change API not yet implemented
    setPwStatus('error');
    setPwMessage('Password change endpoint is not yet available.');
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">System configuration and account settings.</p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-zinc-950 overflow-hidden">
          <div className="px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">{section.title}</h2>
          </div>
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</span>
                <span className="text-sm text-zinc-900 dark:text-zinc-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Change Password */}
      <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
          {pwStatus === 'error' && (
            <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
              {pwMessage}
            </div>
          )}
          {pwStatus === 'success' && (
            <div className="rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 px-4 py-2.5 text-sm text-green-600 dark:text-green-400">
              {pwMessage}
            </div>
          )}
          {(['current', 'next', 'confirm'] as const).map((field) => (
            <div key={field} className="space-y-1.5">
              <label htmlFor={field} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {field === 'current' ? 'Current Password' : field === 'next' ? 'New Password' : 'Confirm New Password'}
              </label>
              <input
                id={field}
                type="password"
                value={passwordForm[field]}
                onChange={(e) => setPasswordForm((p) => ({ ...p, [field]: e.target.value }))}
                required
                className="w-full h-10 px-3 rounded-lg text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-colors"
              />
            </div>
          ))}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="h-9 px-4 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
