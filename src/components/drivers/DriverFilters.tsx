'use client';

import { DriverStatusType, LicenseCategoryType } from '@/types';

interface DriverFiltersProps {
  search: string;
  status: DriverStatusType | '';
  licenseCategory: LicenseCategoryType | '';
  onSearchChange: (v: string) => void;
  onStatusChange: (v: DriverStatusType | '') => void;
  onLicenseCategoryChange: (v: LicenseCategoryType | '') => void;
  onReset: () => void;
}

const inputStyle: React.CSSProperties = {
  padding: '7px 12px', borderRadius: 8, fontSize: 13,
  color: 'var(--text-primary)',
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  outline: 'none',
  transition: 'border-color 0.1s',
};

export default function DriverFilters({
  search, status, licenseCategory,
  onSearchChange, onStatusChange, onLicenseCategoryChange, onReset,
}: DriverFiltersProps) {
  const hasFilters = search || status || licenseCategory;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      {/* Search */}
      <div style={{ position: 'relative', minWidth: 220, flex: 1 }}>
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
          <circle cx="11" cy="11" r="8" strokeWidth={2}/>
          <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by name or license…"
          style={{ ...inputStyle, paddingLeft: 32, width: '100%' }}
        />
      </div>

      {/* Status */}
      <select
        value={status}
        onChange={e => onStatusChange(e.target.value as DriverStatusType | '')}
        style={inputStyle}
      >
        <option value="">All Statuses</option>
        <option value="AVAILABLE">Available</option>
        <option value="ON_TRIP">On Trip</option>
        <option value="OFF_DUTY">Off Duty</option>
        <option value="SUSPENDED">Suspended</option>
      </select>

      {/* Category */}
      <select
        value={licenseCategory}
        onChange={e => onLicenseCategoryChange(e.target.value as LicenseCategoryType | '')}
        style={inputStyle}
      >
        <option value="">All Categories</option>
        <option value="LMV">LMV</option>
        <option value="HMV">HMV</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onReset}
          style={{ ...inputStyle, cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
