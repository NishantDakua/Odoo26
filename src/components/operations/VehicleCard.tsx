import { VehicleInfo } from "@/types/tracking";
import StatusBadge from "./StatusBadge";

const VEHICLE_ICON: Record<string, string> = {
  TRUCK: "🚛", VAN: "🚐", MINI: "🚗", OTHER: "🚌",
};

interface VehicleCardProps {
  vehicle: VehicleInfo;
  currentStatus: string; // from the trip
}

export default function VehicleCard({ vehicle, currentStatus }: VehicleCardProps) {
  const kmToMaint = vehicle.nextMaintenanceDueKm - vehicle.currentOdometerKm;
  const isMaintenanceSoon = kmToMaint < 5000;

  return (
    <div className="ops-card">
      <div className="ops-card-title">Vehicle</div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div className="ops-avatar" style={{ fontSize: 22, background: "var(--border)" }}>
          {VEHICLE_ICON[vehicle.type] ?? "🚌"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "monospace" }}>
            {vehicle.registrationNumber}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{vehicle.model}</div>
          <div style={{ marginTop: 4 }}>
            <StatusBadge status={currentStatus as any} />
          </div>
        </div>
      </div>

      <div className="ops-info-row">
        <span className="ops-info-label">Type</span>
        <span className="ops-info-value">{vehicle.type}</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Capacity</span>
        <span className="ops-info-value">{vehicle.capacityKg.toLocaleString()} kg</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Odometer</span>
        <span className="ops-info-value mono">{vehicle.currentOdometerKm.toLocaleString()} km</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Depot</span>
        <span className="ops-info-value">{vehicle.assignedDepot}</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Last Service</span>
        <span className="ops-info-value">
          {new Date(vehicle.lastMaintenanceDate).toLocaleDateString("en-IN")}
        </span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Next Service</span>
        <span className="ops-info-value" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {vehicle.nextMaintenanceDueKm.toLocaleString()} km
          {isMaintenanceSoon && (
            <span className="status-badge status-amber" style={{ fontSize: 10, padding: "1px 6px" }}>
              Due Soon
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
