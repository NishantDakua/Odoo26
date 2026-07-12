export default function MapLegend() {
  return (
    <div style={{ position: "absolute", bottom: 14, right: 14, zIndex: 10 }}>
      <div className="ops-legend">
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#555", marginBottom: 2 }}>
          Route Legend
        </div>
        <div className="ops-legend-item">
          <div className="ops-legend-line" style={{ background: "#374151", borderTop: "2px dashed #374151", height: 0 }} />
          <span>Planned Route</span>
        </div>
        <div className="ops-legend-item">
          <div className="ops-legend-line" style={{ background: "#10b981" }} />
          <span>Completed</span>
        </div>
        <div className="ops-legend-item">
          <div className="ops-legend-line" style={{ background: "#3b82f6", height: 4 }} />
          <span>Remaining</span>
        </div>
        <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
        <div className="ops-legend-item">
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
          <span>Origin</span>
        </div>
        <div className="ops-legend-item">
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
          <span>Destination</span>
        </div>
        <div className="ops-legend-item">
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
          <span>On Trip</span>
        </div>
      </div>
    </div>
  );
}
