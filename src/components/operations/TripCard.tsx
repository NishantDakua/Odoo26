import { ActiveTrip, LiveTripState } from "@/types/tracking";
import StatusBadge from "./StatusBadge";

interface TripCardProps {
  trip: ActiveTrip;
  liveState?: LiveTripState;
  isSelected: boolean;
  onClick: () => void;
}

export default function TripCard({ trip, liveState, isSelected, onClick }: TripCardProps) {
  const progress = liveState?.progressPercent ?? 0;
  const etaMin   = liveState?.etaMinutes ?? 0;
  const etaStr   = etaMin > 60 ? `${Math.floor(etaMin / 60)}h ${etaMin % 60}m` : `${etaMin}m`;
  const remaining = liveState?.distanceRemainingKm ?? trip.distanceKm;

  return (
    <button
      className={`ops-trip-card${isSelected ? " selected" : ""}`}
      onClick={onClick}
      style={{ width: "100%", textAlign: "left", background: "none", cursor: "pointer" }}
    >
      {/* Row 1: vehicle + badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 14 }}>
            {trip.vehicle.type === "TRUCK" ? "🚛" : trip.vehicle.type === "VAN" ? "🚐" : "🚗"}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
            {trip.vehicle.registrationNumber}
          </span>
        </div>
        <StatusBadge status={trip.status} />
      </div>

      {/* Row 2: driver */}
      <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 4 }}>
        👤 {trip.driver.name}
      </div>

      <div className="ops-progress-bar" style={{ marginBottom: 12 }}>
        <div className="ops-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      
      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8 }}>
        <span style={{ color: "var(--text-secondary)" }}>{trip.source}</span>
        <span style={{ margin: "0 6px" }}>→</span>
        <span style={{ color: "var(--text-muted)" }}>{trip.destination}</span>
      </div>
      
      {/* Remaining Distance & ETA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>ETA {etaStr}</span>
        <span style={{ fontSize: 11, color: "var(--status-trip-text)" }}>{remaining} km left</span>
      </div>

      <div style={{
        marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>{trip.tripCode}</span>
        <span style={{ fontSize: 10, color: "var(--border-focus)" }}>{progress}%</span>
      </div>
    </button>
  );
}
