// todo: dashboard layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Navbar />
        {/* Main content area — pages that need full-bleed (like Operations) use
            a negative-margin wrapper inside to escape this padding */}
        <main
          id="dashboard-main"
          style={{
            flex: 1,
            padding: "28px 32px",
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
