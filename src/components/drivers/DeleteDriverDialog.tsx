'use client';

import { useState, useEffect } from 'react';
import { DriverListItem } from '@/types';

interface DeleteDriverDialogProps {
  driver: DriverListItem;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteDriverDialog({ driver, onClose, onDeleted }: DeleteDriverDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleDelete() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/drivers/${driver.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) { setError(json.error ?? 'Failed to delete driver'); return; }
      onDeleted();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: '100%', maxWidth: 420, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', padding: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--status-red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--status-red-text)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Delete Driver</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Are you sure you want to delete{' '}
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{driver.name}</span>?
          This action cannot be undone.
        </p>

        {error && (
          <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, fontSize: 13, background: 'var(--status-red-bg)', border: '1px solid var(--status-red-border)', color: 'var(--status-red-text)' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleDelete} disabled={loading} style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Deleting…' : 'Delete Driver'}
          </button>
        </div>
      </div>
    </div>
  );
}
