import KpiCard from "./KpiCard";

interface OperationsStatsProps {
  activeTrips: number;
  vehiclesOnline: number;
  driversAvailable: number;
  completedToday: number;
  delayedTrips: number;
}

export default function OperationsStats(props: OperationsStatsProps) {
  return (
    <div
      style={{
        display: "flex", gap: 10,
        padding: "10px 20px",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--sidebar)",
        flexShrink: 0,
      }}
    >
      <KpiCard value={props.activeTrips} label="Active Trips" accent="#3b82f6" />
      <KpiCard value={props.vehiclesOnline} label="Vehicles Online" />
      <KpiCard value={props.driversAvailable} label="Drivers Available" accent="#10b981" />
      <KpiCard value={props.completedToday} label="Completed Today" />
      <KpiCard value={props.delayedTrips} label="Delayed" accent={props.delayedTrips > 0 ? "#f59e0b" : undefined} />
    </div>
  );
}
