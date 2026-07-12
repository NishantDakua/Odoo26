'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = '/';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.12]">
            <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
              <path d="M2 8L4.5 3L7 8L9.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-800 dark:text-white"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">TransitOps</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="identifier" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">User ID or Email</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="User ID or you@example.com"
              required
              autoComplete="username"
              className="w-full h-10 px-3 rounded-lg text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] placeholder:text-zinc-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full h-10 px-3 rounded-lg text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] placeholder:text-zinc-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white/20 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-white"
            />
            <label htmlFor="remember" className="text-sm text-zinc-600 dark:text-zinc-400">Remember me</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
