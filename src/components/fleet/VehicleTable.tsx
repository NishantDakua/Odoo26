"use client";

import { Vehicle, VehicleStatus } from "@prisma/client";

type VehicleTableProps = {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
};

const STATUS_CONFIG: Record<VehicleStatus, { label: string; class: string }> = {
  AVAILABLE: { label: "Available", class: "available" },
  ON_TRIP:   { label: "On Trip",   class: "trip" },
  IN_SHOP:   { label: "In Shop",   class: "maintenance" },
  RETIRED:   { label: "Retired",   class: "retired" },
};

export default function VehicleTable({ vehicles, onEdit, onDelete }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="card" style={{ padding: "56px 32px", textAlign: "center" }}>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>
          No vehicles found. Try adjusting your filters or adding a new vehicle.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
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
              <tr key={v.id}>
                <td>
                  <span className="mono" style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {v.registrationNumber}
                  </span>
                </td>
                <td>
                  {v.nameModel}
                </td>
                <td>{v.type}</td>
                <td>
                  <span className={`status ${status.class}`}>
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
                      style={{ padding: "4px 12px", fontSize: "12px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(v)}
                      className="app-button-secondary"
                      style={{ padding: "4px 12px", fontSize: "12px", color: "var(--status-retired-text)" }}
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
  );
}
