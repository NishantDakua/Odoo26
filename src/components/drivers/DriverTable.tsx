'use client';

import { useState, useCallback, useEffect } from 'react';
import { DriverListItem, DriverStatusType, LicenseCategoryType } from '@/types';
import StatusBadge from './StatusBadge';
import DriverFilters from './DriverFilters';
import DriverForm from './DriverForm';
import DeleteDriverDialog from './DeleteDriverDialog';

export default function DriverTable() {
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<DriverStatusType | ''>('');
  const [licenseCategory, setLicenseCategory] = useState<LicenseCategoryType | ''>('');

  const [showForm, setShowForm] = useState(false);
  const [editDriver, setEditDriver] = useState<DriverListItem | null>(null);
  const [deleteDriver, setDeleteDriver] = useState<DriverListItem | null>(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (licenseCategory) params.set('licenseCategory', licenseCategory);
      params.set('limit', '100');

      const res = await fetch(`/api/drivers?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setDrivers(json.data.drivers ?? []);
      } else {
        setError(json.error ?? 'Failed to load drivers');
      }
    } catch {
      setError('Network error. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [search, status, licenseCategory]);

  useEffect(() => {
    const timer = setTimeout(fetchDrivers, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchDrivers, search]);

  function openAdd() { setEditDriver(null); setShowForm(true); }
  function openEdit(d: DriverListItem) { setEditDriver(d); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditDriver(null); }
  function onSaved() { closeForm(); fetchDrivers(); }
  function onDeleted() { setDeleteDriver(null); fetchDrivers(); }
  function resetFilters() { setSearch(''); setStatus(''); setLicenseCategory(''); }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const HEADERS = ['Driver', 'License', 'Category', 'Expiry Date', 'Contact', 'Safety Score', 'Status', 'Actions'];

  const statCards = [
    { label: 'Total',           value: drivers.length,                                      color: 'var(--text-primary)' },
    { label: 'Available',       value: drivers.filter(d => d.status === 'AVAILABLE').length, color: 'var(--status-green-text)' },
    { label: 'On Trip',         value: drivers.filter(d => d.status === 'ON_TRIP').length,   color: 'var(--status-blue-text)' },
    { label: 'Suspended',       value: drivers.filter(d => d.status === 'SUSPENDED').length, color: 'var(--status-red-text)' },
    { label: 'Expired License', value: drivers.filter(d => d.isLicenseExpired).length,       color: 'var(--status-amber-text)' },
  ];

  return (
    <>
      {/* Toolbar */}
      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <DriverFilters
          search={search} status={status} licenseCategory={licenseCategory}
          onSearchChange={setSearch} onStatusChange={setStatus}
          onLicenseCategoryChange={setLicenseCategory} onReset={resetFilters}
        />
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: 'var(--text-primary)', color: 'var(--bg-page)', border: 'none', cursor: 'pointer',
            transition: 'background 0.1s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--text-secondary)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--text-primary)')}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Driver
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 13,
            background: 'var(--input-bg)', border: '1px solid var(--border)',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>{s.label}: </span>
            <span style={{ fontWeight: 600, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 12, padding: '10px 14px', borderRadius: 8, fontSize: 13,
          background: 'var(--status-red-bg)', border: '1px solid var(--status-red-border)',
          color: 'var(--status-red-text)',
        }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-card)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--input-bg)' }}>
                {HEADERS.map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: 11,
                    fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: 'var(--text-muted)', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: '2px solid var(--text-primary)', borderTopColor: 'transparent',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      Loading drivers…
                    </div>
                  </td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '60px 0', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>No drivers found</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Try adjusting your filters or add a new driver</p>
                    </div>
                  </td>
                </tr>
              ) : drivers.map((d, i) => (
                <tr
                  key={d.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: i % 2 !== 0 ? 'var(--table-hover)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--input-bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 !== 0 ? 'var(--table-hover)' : 'transparent')}
                >
                  {/* Name */}
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--input-bg)', color: 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600,
                      }}>
                        {d.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{d.name}</span>
                    </div>
                  </td>

                  {/* License */}
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {d.licenseNumber}
                  </td>

                  {/* Category */}
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 99, fontSize: 11,
                      background: 'var(--pill-bg)', border: '1px solid var(--pill-border)',
                      color: 'var(--pill-text)',
                    }}>
                      {d.licenseCategory}
                    </span>
                  </td>

                  {/* Expiry */}
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 500,
                      color: d.isLicenseExpired ? 'var(--status-red-text)'
                        : d.isLicenseExpiringSoon ? 'var(--status-amber-text)'
                        : 'var(--text-muted)',
                    }}>
                      {formatDate(d.licenseExpiryDate)}
                      {d.isLicenseExpired && (
                        <span style={{
                          marginLeft: 6, padding: '1px 6px', borderRadius: 99, fontSize: 10,
                          background: 'var(--status-red-bg)', color: 'var(--status-red-text)',
                        }}>Expired</span>
                      )}
                      {!d.isLicenseExpired && d.isLicenseExpiringSoon && (
                        <span style={{
                          marginLeft: 6, padding: '1px 6px', borderRadius: 99, fontSize: 10,
                          background: 'var(--status-amber-bg)', color: 'var(--status-amber-text)',
                        }}>Expiring</span>
                      )}
                    </span>
                  </td>

                  {/* Contact */}
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontSize: 12 }}>
                    {d.contactNumber}
                  </td>

                  {/* Safety score */}
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 64, height: 5, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 99,
                          width: `${d.safetyScore}%`,
                          background: d.safetyScore >= 80 ? 'var(--status-green-text)'
                            : d.safetyScore >= 60 ? 'var(--status-amber-text)'
                            : 'var(--status-red-text)',
                        }} />
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: 600,
                        color: d.safetyScore >= 80 ? 'var(--status-green-text)'
                          : d.safetyScore >= 60 ? 'var(--status-amber-text)'
                          : 'var(--status-red-text)',
                      }}>
                        {d.safetyScore}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '10px 14px' }}>
                    <StatusBadge status={d.status} />
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => openEdit(d)}
                        title="Edit"
                        style={{
                          padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer',
                          background: 'transparent', color: 'var(--text-muted)', transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--input-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteDriver(d)}
                        title="Delete"
                        style={{
                          padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer',
                          background: 'transparent', color: 'var(--text-muted)', transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--status-red-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--status-red-text)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && drivers.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)' }}>
            Showing {drivers.length} driver{drivers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {showForm && <DriverForm driver={editDriver} onClose={closeForm} onSaved={onSaved} />}
      {deleteDriver && <DeleteDriverDialog driver={deleteDriver} onClose={() => setDeleteDriver(null)} onDeleted={onDeleted} />}
    </>
  );
}

