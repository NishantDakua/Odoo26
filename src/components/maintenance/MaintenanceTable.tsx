"use client";

import { MaintenanceStatus } from "@prisma/client";

type MaintenanceLogWithVehicle = any;

type MaintenanceTableProps = {
  logs: MaintenanceLogWithVehicle[];
  onCloseClick: (log: MaintenanceLogWithVehicle) => void;
};

const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; class: string }> = {
  ACTIVE:    { label: "Active",    class: "maintenance" },
  COMPLETED: { label: "Completed", class: "available" },
};

export default function MaintenanceTable({ logs, onCloseClick }: MaintenanceTableProps) {
  if (logs.length === 0) {
    return (
      <div className="card" style={{ padding: "56px 32px", textAlign: "center" }}>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>
          No maintenance records found.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Service</th>
            <th style={{ textAlign: "right" }}>Cost</th>
            <th>Date</th>
            <th>Status</th>
            <th>Closed</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const status = STATUS_CONFIG[log.status as MaintenanceStatus];
            return (
              <tr key={log.id}>
                <td>
                  <div className="mono" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {log.vehicle.registrationNumber}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {log.vehicle.nameModel}
                  </div>
                </td>
                <td>{log.serviceType}</td>
                <td style={{ textAlign: "right" }}>
                  ₹{Number(log.cost).toLocaleString("en-IN")}
                </td>
                <td>
                  {new Date(log.serviceDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td>
                  <span className={`status ${status.class}`}>
                    {status.label}
                  </span>
                </td>
                <td style={{ color: "var(--text-muted)" }}>
                  {log.closedAt
                    ? new Date(log.closedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td style={{ textAlign: "right" }}>
                  {log.status === MaintenanceStatus.ACTIVE && (
                    <button
                      onClick={() => onCloseClick(log)}
                      className="app-button-secondary"
                      style={{ padding: "4px 12px", fontSize: "12px", color: "var(--status-available-text)" }}
                    >
                      Close
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
