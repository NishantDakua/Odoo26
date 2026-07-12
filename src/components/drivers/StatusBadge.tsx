'use client';

import { DriverStatusType } from '@/types';

const STATUS_CONFIG: Record<
  DriverStatusType,
  { label: string; bg: string; text: string; dot: string }
> = {
  AVAILABLE: {
    label: 'Available',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  ON_TRIP: {
    label: 'On Trip',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
  },
  OFF_DUTY: {
    label: 'Off Duty',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    dot: 'bg-zinc-400',
  },
  SUSPENDED: {
    label: 'Suspended',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
};

interface StatusBadgeProps {
  status: DriverStatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
