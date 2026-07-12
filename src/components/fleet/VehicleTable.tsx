"use client";

import { Vehicle, VehicleStatus } from "@prisma/client";

type VehicleTableProps = {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
};

const STATUS_CONFIG: Record<VehicleStatus, { label: string; class: string }> = {
  AVAILABLE: { label: "Available", class: "status-green" },
  ON_TRIP:   { label: "On Trip",   class: "status-blue" },
  IN_SHOP:   { label: "In Shop",   class: "status-amber" },
  RETIRED:   { label: "Retired",   class: "status-red" },
};

export default function VehicleTable({ vehicles, onEdit, onDelete }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="app-card" style={{ padding: "56px 32px", textAlign: "center" }}>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>
          No vehicles found. Try adjusting your filters or adding a new vehicle.
        </p>
      </div>
    );
  }

  return (
    <div className="app-card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="app-table-wrapper">
        <table className="app-table">
          <thead>
            <tr className="table-header">
              <th>Registration</th>
              <th>Make & Model</th>
              <th>Type</th>
              <th>Status</th>
              <th>Capacity</th>
              <th>Odometer</th>
              <th>Acquired</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const status = STATUS_CONFIG[v.status] || STATUS_CONFIG.AVAILABLE;
              return (
                <tr key={v.id} className="table-row">
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
                      {v.registrationNumber}
                    </span>
                  </td>
                  <td>
                    {v.nameModel}
                  </td>
                  <td>{v.type}</td>
                  <td>
                    <span className={`status-badge ${status.class}`}>
                      <span className="status-dot" />
                      {status.label}
                    </span>
                  </td>
                  <td>{Number(v.maxLoadCapacityKg).toLocaleString()} kg</td>
                  <td>{Number(v.odometerKm).toLocaleString()} km</td>
                  <td>
                    ₹{Number(v.acquisitionCost).toLocaleString("en-IN")}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => onEdit(v)}
                        className="app-button-secondary"
                        style={{ padding: "4px 12px", fontSize: "12px", borderRadius: "12px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(v)}
                        className="app-button-secondary"
                        style={{ padding: "4px 12px", fontSize: "12px", borderRadius: "12px", color: "var(--status-red-text)" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
