import { LiveTripState } from "@/types/tracking";

interface RouteTimelineProps {
  liveState: LiveTripState | null;
  speedMultiplier: number;
  onSpeedChange: (s: number) => void;
}

export default function RouteTimeline({ liveState, speedMultiplier, onSpeedChange }: RouteTimelineProps) {
  const progress = liveState?.progressPercent ?? 0;
  const remaining = liveState?.distanceRemainingKm ?? 0;
  const etaMin = liveState?.etaMinutes ?? 0;
  const etaStr = etaMin > 60 ? `${Math.floor(etaMin / 60)}h ${etaMin % 60}m` : `${etaMin}m`;

  return (
    <div className="ops-timeline">
      {/* Origin */}
      <div style={{ flexShrink: 0, width: 90, overflow: "hidden" }}>
        <div style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>Origin</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {liveState?.trip.source ?? "—"}
        </div>
      </div>

      {/* Progress track */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, color: "var(--text-secondary)" }}>
          <span>{progress}% complete</span>
          <span>{remaining} km · ETA {etaStr}</span>
        </div>
        <div style={{ position: "relative", height: 6, background: "var(--border)", borderRadius: 3, overflow: "visible" }}>
          {/* Green: traveled */}
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: `${progress}%`, background: "var(--status-available-text)", borderRadius: 3,
            transition: "width 1s ease",
          }} />
          {/* Vehicle dot on track */}
          {liveState && (
            <div style={{
              position: "absolute", top: "50%",
              left: `${progress}%`, transform: "translate(-50%, -50%)",
              width: 12, height: 12, borderRadius: "50%",
              background: "var(--status-trip-text)", border: "2px solid var(--bg)",
              zIndex: 2, transition: "left 1s ease",
            }} />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, color: "var(--text-muted)" }}>
          <span>{liveState?.trip.source ?? ""}</span>
          <span>{liveState?.trip.destination ?? ""}</span>
        </div>
      </div>

      {/* Destination */}
      <div style={{ flexShrink: 0, width: 90, overflow: "hidden", textAlign: "right" }}>
        <div style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>Destination</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {liveState?.trip.destination ?? "—"}
        </div>
      </div>

      {/* Speed multiplier */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 8 }}>
        <span style={{ fontSize: 10, color: "var(--text-secondary)", marginRight: 2 }}>SIM</span>
        {[1, 2, 4].map((s) => (
          <button
            key={s}
            className={`ops-map-btn${speedMultiplier === s ? " active" : ""}`}
            style={{ width: 28, height: 28, fontSize: 10, fontWeight: 600 }}
            onClick={() => onSpeedChange(s)}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
