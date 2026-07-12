'use client';

import { DriverStatusType } from '@/types';

const STATUS_CONFIG: Record<DriverStatusType, { label: string; bg: string; border: string; text: string; dot: string }> = {
  AVAILABLE: {
    label: 'Available',
    bg:     'var(--status-green-bg)',
    border: 'var(--status-green-border)',
    text:   'var(--status-green-text)',
    dot:    'var(--status-green-text)',
  },
  ON_TRIP: {
    label: 'On Trip',
    bg:     'var(--status-blue-bg)',
    border: 'var(--status-blue-border)',
    text:   'var(--status-blue-text)',
    dot:    'var(--status-blue-text)',
  },
  OFF_DUTY: {
    label: 'Off Duty',
    bg:     'var(--input-bg)',
    border: 'var(--border)',
    text:   'var(--text-muted)',
    dot:    'var(--text-muted)',
  },
  SUSPENDED: {
    label: 'Suspended',
    bg:     'var(--status-red-bg)',
    border: 'var(--status-red-border)',
    text:   'var(--status-red-text)',
    dot:    'var(--status-red-text)',
  },
};

interface StatusBadgeProps {
  status: DriverStatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 500,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.text,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}
