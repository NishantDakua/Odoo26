"use client";

import { VehicleType, VehicleStatus } from "@prisma/client";

const STATUS_LABELS: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
};

const TYPE_LABELS: Record<VehicleType, string> = {
  VAN: "Van",
  TRUCK: "Truck",
  MINI: "Mini",
  OTHER: "Other",
};

type VehicleFiltersProps = {
  filters: { registration?: string; type?: string; status?: string };
  onFilterChange: (name: string, value: string) => void;
};

export default function VehicleFilters({ filters, onFilterChange }: VehicleFiltersProps) {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
      {/* Search */}
      <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}>
          <circle cx="6" cy="6" r="4.5" stroke="var(--text-muted)" strokeWidth="1.2"/>
          <path d="M9.5 9.5L12.5 12.5" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search registration..."
          value={filters.registration || ""}
          onChange={(e) => onFilterChange("registration", e.target.value)}
          className="input"
          style={{ paddingLeft: "36px" }}
        />
      </div>

      {/* Type filter */}
      <select
        value={filters.type || ""}
        onChange={(e) => onFilterChange("type", e.target.value)}
        className="input"
        style={{ width: "160px" }}
      >
        <option value="">All types</option>
        {Object.keys(VehicleType).map((type) => (
          <option key={type} value={type}>{TYPE_LABELS[type as VehicleType] || type}</option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={filters.status || ""}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="input"
        style={{ width: "160px" }}
      >
        <option value="">All statuses</option>
        {Object.keys(VehicleStatus).map((status) => (
          <option key={status} value={status}>{STATUS_LABELS[status as VehicleStatus] || status}</option>
        ))}
      </select>

      {/* Clear */}
      {(filters.registration || filters.type || filters.status) && (
        <button
          onClick={() => {
            onFilterChange("registration", "");
            onFilterChange("type", "");
            onFilterChange("status", "");
          }}
          className="app-button-secondary"
          style={{ border: "none" }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
