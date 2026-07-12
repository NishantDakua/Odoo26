import { TripStatus, DriverStatus } from "@/types/tracking";

type BadgeVariant = TripStatus | DriverStatus | "IN_SHOP" | "RETIRED";

const BADGE_MAP: Record<BadgeVariant, { cls: string; label: string }> = {
  ON_TRIP:    { cls: "status-badge status-blue",  label: "On Trip" },
  DRAFT:      { cls: "status-badge status-amber", label: "Draft" },
  COMPLETED:  { cls: "status-badge status-green", label: "Completed" },
  CANCELLED:  { cls: "status-badge status-red",   label: "Cancelled" },
  AVAILABLE:  { cls: "status-badge status-green", label: "Available" },
  OFF_DUTY:   { cls: "status-badge status-amber", label: "Off Duty" },
  SUSPENDED:  { cls: "status-badge status-red",   label: "Suspended" },
  IN_SHOP:    { cls: "status-badge status-amber", label: "In Shop" },
  RETIRED:    { cls: "status-badge status-red",   label: "Retired" },
};

export default function StatusBadge({ status }: { status: BadgeVariant }) {
  const { cls, label } = BADGE_MAP[status] ?? { cls: "status-badge", label: status };
  return (
    <span className={cls}>
      <span className="status-dot" />
      {label}
    </span>
  );
}
