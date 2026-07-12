// SVG icons — Lucide-style, self-contained, no npm dependency needed
const icons = {
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  india: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>
    </svg>
  ),
  zoomIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  zoomOut: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
  center: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  follow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  ),
  reset: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
  ),
};

interface MapToolbarProps {
  hasSelection: boolean;
  isFollowing: boolean;
  onFlyToIndia: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFlyToVehicle: () => void;
  onToggleFollow: () => void;
  onReset: () => void;
}

interface BtnProps {
  title: string;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolBtn({ title, disabled, active, onClick, children }: BtnProps) {
  return (
    <button
      className={`ops-map-btn${active ? " active" : ""}`}
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function MapToolbar({
  hasSelection, isFollowing,
  onFlyToIndia, onZoomIn, onZoomOut, onFlyToVehicle, onToggleFollow, onReset,
}: MapToolbarProps) {
  return (
    <div style={{ position: "absolute", top: 14, left: 14, zIndex: 10, display: "flex", flexDirection: "column", gap: 5 }}>
      <ToolBtn title="India View" onClick={onFlyToIndia}>{icons.india}</ToolBtn>
      <ToolBtn title="Zoom In" onClick={onZoomIn}>{icons.zoomIn}</ToolBtn>
      <ToolBtn title="Zoom Out" onClick={onZoomOut}>{icons.zoomOut}</ToolBtn>
      <div style={{ height: 1, background: "#232323", margin: "2px 0" }} />
      <ToolBtn title="Centre on Vehicle" disabled={!hasSelection} onClick={onFlyToVehicle}>{icons.center}</ToolBtn>
      <ToolBtn title="Follow Vehicle" disabled={!hasSelection} active={isFollowing} onClick={onToggleFollow}>{icons.follow}</ToolBtn>
      <div style={{ height: 1, background: "#232323", margin: "2px 0" }} />
      <ToolBtn title="Reset Camera" onClick={onReset}>{icons.reset}</ToolBtn>
    </div>
  );
}
