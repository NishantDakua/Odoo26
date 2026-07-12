interface KpiCardProps {
  value: string | number;
  label: string;
  accent?: string; // optional colour for value
}

export default function KpiCard({ value, label, accent }: KpiCardProps) {
  return (
    <div className="ops-kpi">
      <div className="ops-kpi-value" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      <div className="ops-kpi-label">{label}</div>
    </div>
  );
}
