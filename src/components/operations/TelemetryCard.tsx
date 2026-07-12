import { LiveTripState } from "@/types/tracking";

interface TelemetryCardProps {
  liveState: LiveTripState;
}

export default function TelemetryCard({ liveState }: TelemetryCardProps) {
  const { currentCoords, speedKmh, heading, lastUpdated } = liveState;
  const secondsAgo = Math.round((Date.now() - lastUpdated) / 1000);

  const cardinalDir = (deg: number) => {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className="ops-card">
      <div className="ops-card-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Live Telemetry</span>
        <span style={{ fontSize: 10, color: secondsAgo < 5 ? "#10b981" : "#f59e0b", fontWeight: 400 }}>
          {secondsAgo}s ago
        </span>
      </div>

      {/* Speed big display */}
      <div style={{ textAlign: "center", padding: "12px 0 16px", borderBottom: "1px solid var(--border)", marginBottom: 10 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
          {speedKmh}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 3 }}>km/h</div>
      </div>

      <div className="ops-info-row">
        <span className="ops-info-label">Heading</span>
        <span className="ops-info-value">
          {Math.round(heading)}° {cardinalDir(heading)}
        </span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Latitude</span>
        <span className="ops-info-value mono">{currentCoords[1].toFixed(6)}°</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Longitude</span>
        <span className="ops-info-value mono">{currentCoords[0].toFixed(6)}°</span>
      </div>
    </div>
  );
}
