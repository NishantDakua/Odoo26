import { LiveTripState } from "@/types/tracking";

interface TripInformationProps {
  liveState: LiveTripState;
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="ops-info-row">
      <span className="ops-info-label">{label}</span>
      <span className={`ops-info-value${mono ? " mono" : ""}`}>{value}</span>
    </div>
  );
}

export default function TripInformation({ liveState }: TripInformationProps) {
  const { trip, distanceRemainingKm, distanceTravelledKm, progressPercent, etaMinutes } = liveState;

  const dispatchTime = new Date(trip.dispatchedAt);
  const etaTime = new Date(Date.now() + etaMinutes * 60_000);
  const etaStr = etaMinutes > 60
    ? `${Math.floor(etaMinutes / 60)}h ${etaMinutes % 60}m`
    : `${etaMinutes}m`;

  return (
    <div className="ops-card">
      <div className="ops-card-title">Trip</div>

      <Row label="Trip ID" value={trip.tripCode} mono />
      <Row label="Origin" value={trip.source} />
      <Row label="Destination" value={trip.destination} />
      <Row label="Dispatched" value={dispatchTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} />
      <Row label="Est. Arrival" value={etaTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} />
      <Row label="ETA" value={etaStr} />
      <Row label="Total Distance" value={`${trip.distanceKm} km`} />
      <Row label="Distance Done" value={`${distanceTravelledKm} km`} />
      <Row label="Remaining" value={`${distanceRemainingKm} km`} />

      {/* Progress bar inline */}
      <div style={{ margin: "10px 0 4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginBottom: 4 }}>
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="ops-progress-bar">
          <div className="ops-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <Row label="Cargo" value={trip.cargoDescription} />
      <Row label="Weight" value={`${trip.cargoWeightKg.toLocaleString()} kg`} />
      <Row label="Supervisor" value={trip.supervisorName} />
      {trip.dispatchNotes && (
        <div style={{ marginTop: 10, padding: "8px 10px", backgroundColor: "var(--sidebar)", borderRadius: 8, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 10, color: "#555", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Notes</div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{trip.dispatchNotes}</div>
        </div>
      )}
    </div>
  );
}
