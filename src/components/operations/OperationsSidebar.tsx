import { ActiveTrip, LiveTripState } from "@/types/tracking";
import TripCard from "./TripCard";

interface OperationsSidebarProps {
  trips: ActiveTrip[];
  liveStates: Record<string, LiveTripState>;
  selectedTripId: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectTrip: (id: string) => void;
}

export default function OperationsSidebar({
  trips, liveStates, selectedTripId, searchQuery, onSearchChange, onSelectTrip,
}: OperationsSidebarProps) {
  const filtered = trips.filter((t) =>
    t.vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tripCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onTripCount = trips.filter((t) => t.status === "ON_TRIP").length;

  return (
    <div
      style={{
        width: 280, minWidth: 260, maxWidth: 300,
        display: "flex", flexDirection: "column",
        borderRight: "1px solid var(--border)", backgroundColor: "var(--sidebar)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Active Trips</span>
          <span className="status-badge status-blue">
            <span className="status-dot" />
            {onTripCount} live
          </span>
        </div>
        <input
          type="text"
          className="ops-search"
          placeholder="Search vehicle, driver, trip…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "32px 16px", textAlign: "center", color: "#444", fontSize: 12 }}>
            No trips match your search.
          </div>
        )}
        {filtered.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            liveState={liveStates[trip.id]}
            isSelected={trip.id === selectedTripId}
            onClick={() => onSelectTrip(trip.id)}
          />
        ))}
      </div>
    </div>
  );
}
