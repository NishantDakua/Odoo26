import { DriverInfo } from "@/types/tracking";
import StatusBadge from "./StatusBadge";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function avatarColor(name: string) {
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
  return colors[h % colors.length];
}

function daysUntil(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function scoreColor(score: number): string {
  if (score >= 90) return "#10b981";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
}

interface DriverCardProps { driver: DriverInfo; }

export default function DriverCard({ driver }: DriverCardProps) {
  const color = avatarColor(driver.name);
  const licDays = daysUntil(driver.licenseExpiry);
  const sc = scoreColor(driver.safetyScore);

  return (
    <div className="ops-card">
      <div className="ops-card-title">Driver</div>

      {/* Profile header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div className="ops-avatar" style={{ background: color + "22", color, borderColor: color + "44" }}>
          {initials(driver.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>{driver.name}</div>
          <div style={{ fontSize: 11, color: "#666", fontFamily: "monospace" }}>{driver.employeeId}</div>
          <div style={{ marginTop: 4 }}><StatusBadge status={driver.status} /></div>
        </div>
      </div>

      {/* Safety Score */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "#666" }}>Safety Score</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: sc }}>{driver.safetyScore} / 100</span>
        </div>
        <div className="ops-score-bar">
          <div className="ops-score-fill" style={{ width: `${driver.safetyScore}%`, background: sc }} />
        </div>
      </div>

      {/* Info rows */}
      <div className="ops-info-row">
        <span className="ops-info-label">Phone</span>
        <span className="ops-info-value mono">{driver.phone}</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">License</span>
        <span className="ops-info-value">{driver.licenseCategory}</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Lic. No.</span>
        <span className="ops-info-value mono" style={{ fontSize: 10 }}>{driver.licenseNumber}</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Expiry</span>
        <span className="ops-info-value" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {new Date(driver.licenseExpiry).toLocaleDateString("en-IN")}
          {licDays < 60 && (
            <span className="status-badge status-amber" style={{ fontSize: 10, padding: "1px 6px" }}>
              {licDays}d left
            </span>
          )}
          {licDays < 0 && (
            <span className="status-badge status-red" style={{ fontSize: 10, padding: "1px 6px" }}>
              Expired
            </span>
          )}
        </span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Experience</span>
        <span className="ops-info-value">{driver.experienceYears} years</span>
      </div>
      <div className="ops-info-row">
        <span className="ops-info-label">Depot</span>
        <span className="ops-info-value">{driver.assignedDepot}</span>
      </div>
    </div>
  );
}
