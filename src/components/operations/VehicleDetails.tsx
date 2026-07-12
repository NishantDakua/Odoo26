import { LiveTripState } from "@/types/tracking";
import DriverCard from "./DriverCard";
import VehicleCard from "./VehicleCard";
import TripInformation from "./TripInformation";
import TelemetryCard from "./TelemetryCard";

interface VehicleDetailsProps {
  liveState: LiveTripState | null;
  onClose: () => void;
}

export default function VehicleDetails({ liveState, onClose }: VehicleDetailsProps) {
  if (!liveState) {
    return (
      <div style={{
        width: 300, minWidth: 280, borderLeft: "1px solid var(--border)",
        backgroundColor: "var(--sidebar)", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 24, gap: 12,
      }}>
        <div style={{ fontSize: 32 }}>📍</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>No Vehicle Selected</div>
        <div style={{ fontSize: 12, color: "#555", textAlign: "center" }}>
          Select a trip from the list or click a vehicle on the map.
        </div>
      </div>
    );
  }

  const { trip } = liveState;

  return (
    <div style={{
      width: 300, minWidth: 280,
      display: "flex", flexDirection: "column",
      borderLeft: "1px solid var(--border)",
      backgroundColor: "var(--sidebar)",
      overflow: "hidden",
    }}>
      {/* Panel header */}
      <div style={{
        flexShrink: 0, padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
            {trip.vehicle.registrationNumber}
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 1, fontFamily: "monospace" }}>
            {trip.tripCode}
          </div>
        </div>
        <button
          className="ops-map-btn"
          style={{ width: 28, height: 28, fontSize: 16 }}
          onClick={onClose}
          title="Close panel"
        >
          ×
        </button>
      </div>

      {/* Scrollable card stack */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
        <TelemetryCard liveState={liveState} />
        <DriverCard driver={trip.driver} />
        <VehicleCard vehicle={trip.vehicle} currentStatus={trip.status} />
        <TripInformation liveState={liveState} />
      </div>
    </div>
  );
}
