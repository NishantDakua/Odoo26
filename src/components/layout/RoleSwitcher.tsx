'use client';

import React from 'react';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/navigation';

export function RoleSwitcher({ currentRole }: { currentRole: UserRole }) {
  const router = useRouter();

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    // In a real app, this would be an API call to change the user's role on the backend 
    // or log them in as a different demo user.
    // Here we'll just hit a mock endpoint to set a new JWT for demo purposes.
    try {
      await fetch('/api/auth/demo-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      router.refresh();
      window.location.reload(); // Hard reload to reset layout states
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-2xl flex items-center gap-3">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Demo Role</span>
      </div>
      <select 
        value={currentRole} 
        onChange={handleRoleChange}
        className="bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
      >
        <option value="SAFETY_OFFICER">Safety Officer</option>
        <option value="FLEET_MANAGER">Fleet Manager</option>
        <option value="DISPATCHER">Dispatcher</option>
        <option value="FINANCIAL_ANALYST">Financial Analyst</option>
      </select>
    </div>
  );
}
