'use client';

import { useState, useEffect } from 'react';
import { DriverListItem, DriverStatusType, LicenseCategoryType } from '@/types';

interface DriverFormProps {
  driver?: DriverListItem | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function DriverForm({ driver, onClose, onSaved }: DriverFormProps) {
  const isEdit = !!driver;

  const [form, setForm] = useState({
    name: driver?.name ?? '',
    licenseNumber: driver?.licenseNumber ?? '',
    licenseCategory: (driver?.licenseCategory ?? 'LMV') as LicenseCategoryType,
    licenseExpiryDate: driver?.licenseExpiryDate
      ? new Date(driver.licenseExpiryDate).toISOString().split('T')[0] : '',
    contactNumber: driver?.contactNumber ?? '',
    safetyScore: driver?.safetyScore ?? 100,
    status: (driver?.status ?? 'AVAILABLE') as DriverStatusType,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/drivers/${driver!.id}` : '/api/drivers', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, safetyScore: Number(form.safetyScore) }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error ?? 'Something went wrong'); return; }
      onSaved();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const field: React.CSSProperties = {
    width: '100%', padding: '8px 12px', borderRadius: 8, fontSize: 13,
    color: 'var(--text-primary)', background: 'var(--input-bg)',
    border: '1px solid var(--input-border)', outline: 'none', boxSizing: 'border-box',
  };
  const label: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 500,
    color: 'var(--text-secondary)', marginBottom: 5,
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: '100%', maxWidth: 500, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Driver' : 'Add Driver'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ padding: '8px 12px', borderRadius: 8, fontSize: 13, background: 'var(--status-red-bg)', border: '1px solid var(--status-red-border)', color: 'var(--status-red-text)' }}>
              {error}
            </div>
          )}

          <div>
            <label style={label}>Full Name *</label>
            <input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="John Doe" style={field} />
          </div>

          <div>
            <label style={label}>License Number *</label>
            <input required value={form.licenseNumber} onChange={e => update('licenseNumber', e.target.value.toUpperCase())} placeholder="MH01 20230012345" style={field} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>Category *</label>
              <select required value={form.licenseCategory} onChange={e => update('licenseCategory', e.target.value as LicenseCategoryType)} style={field}>
                <option value="LMV">LMV — Light</option>
                <option value="HMV">HMV — Heavy</option>
              </select>
            </div>
            <div>
              <label style={label}>Expiry Date *</label>
              <input required type="date" value={form.licenseExpiryDate} onChange={e => update('licenseExpiryDate', e.target.value)} style={field} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>Contact Number *</label>
              <input required value={form.contactNumber} onChange={e => update('contactNumber', e.target.value)} placeholder="+91 98765 43210" style={field} />
            </div>
            <div>
              <label style={label}>Safety Score (0–100) *</label>
              <input required type="number" min={0} max={100} value={form.safetyScore} onChange={e => update('safetyScore', Number(e.target.value))} style={field} />
            </div>
          </div>

          <div>
            <label style={label}>Status *</label>
            <select required value={form.status} onChange={e => update('status', e.target.value as DriverStatusType)} style={field}>
              <option value="AVAILABLE">Available</option>
              <option value="ON_TRIP">On Trip</option>
              <option value="OFF_DUTY">Off Duty</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--text-primary)', color: 'var(--bg-page)', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

