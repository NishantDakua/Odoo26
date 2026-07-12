"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Truck, CheckCircle, Wrench, Route, Clock, Users, TrendingUp,
  Calendar, ChevronDown, MoreVertical, Fuel, BarChart2, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/DonutChart";

// ── API types (must match GET /api/dashboard response shape) ─────────────────

type DashboardKpis = {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilizationPct: number;
};

type RecentTrip = {
  tripCode: string;
  vehicleLabel: string;
  driverLabel: string;
  status: string;
  eta: string;
  updatedAgo: string;
};

type StatusBreakdown = { count: number; pct: number };

type DashboardData = {
  kpis: DashboardKpis;
  recentTrips: RecentTrip[];
  vehicleStatus: {
    total: number;
    breakdown: {
      available: StatusBreakdown;
      onTrip: StatusBreakdown;
      inShop: StatusBreakdown;
      retired: StatusBreakdown;
      standby: StatusBreakdown;
    };
  };
};

// ── KPI config ────────────────────────────────────────────────────────────────

type KpiItem =
  | { key: keyof DashboardKpis; label: string; sub: string; icon: React.ElementType; iconBg: string; iconColor: string; isCircle?: false }
  | { key: keyof DashboardKpis; label: string; sub: string; isCircle: true };

const kpiConfig: KpiItem[] = [
  { key: "activeVehicles",        label: "Active Vehicles",        sub: "Live on the road",    icon: Truck,      iconBg: "bg-blue-50 dark:bg-blue-950",   iconColor: "text-blue-500" },
  { key: "availableVehicles",     label: "Available Vehicles",     sub: "Ready to deploy",     icon: CheckCircle,iconBg: "bg-green-50 dark:bg-green-950",  iconColor: "text-green-500" },
  { key: "vehiclesInMaintenance", label: "Vehicles in Maintenance",sub: "In shop",             icon: Wrench,     iconBg: "bg-orange-50 dark:bg-orange-950",iconColor: "text-orange-500" },
  { key: "activeTrips",           label: "Active Trips",           sub: "In progress",         icon: Route,      iconBg: "bg-blue-50 dark:bg-blue-950",   iconColor: "text-blue-500" },
  { key: "pendingTrips",          label: "Pending Trips",          sub: "Scheduled",           icon: Clock,      iconBg: "bg-purple-50 dark:bg-purple-950",iconColor: "text-purple-500" },
  { key: "driversOnDuty",         label: "Drivers on Duty",        sub: "Currently assigned",  icon: Users,      iconBg: "bg-blue-50 dark:bg-blue-950",   iconColor: "text-blue-500" },
  { key: "fleetUtilizationPct",   label: "Fleet Utilization",      sub: "Utilization rate",    isCircle: true },
];

const tripStatusMap: Record<string, { label: string; className: string }> = {
  DISPATCHED: { label: "Dispatched", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400" },
  COMPLETED:  { label: "Completed",  className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" },
  DRAFT:      { label: "Draft",      className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  CANCELLED:  { label: "Cancelled",  className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
};

const quickActions = [
  { label: "Add Vehicle", icon: Truck },
  { label: "Add Trip",    icon: Route },
  { label: "Assign Driver", icon: Users },
  { label: "Maintenance", icon: Wrench },
  { label: "Fuel Entry",  icon: Fuel },
  { label: "Reports",     icon: BarChart2 },
];

const mapMarkers = [
  { top: "38%", left: "12%", count: 12, color: "bg-green-500" },
  { top: "55%", left: "17%", count: 14, color: "bg-green-500" },
  { top: "28%", left: "36%", count: 8,  color: "bg-blue-500" },
  { top: "58%", left: "52%", count: 3,  color: "bg-red-500" },
  { top: "20%", left: "72%", count: 6,  color: "bg-blue-500" },
  { top: "60%", left: "72%", count: 4,  color: "bg-orange-500" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [vehicleType, setVehicleType] = useState("All");
  const [status, setStatus]           = useState("All");
  const [region, setRegion]           = useState("All");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (vehicleType !== "All") params.set("type", vehicleType);
    if (status !== "All")      params.set("status", status);
    if (region !== "All")      params.set("region", region);

    try {
      const res = await fetch(`/api/dashboard?${params}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      setData(await res.json());
    } catch (e: any) {
      setError(e.message ?? "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [vehicleType, status, region]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const donutSegments = useMemo(() => {
    if (!data) return [];
    const b = data.vehicleStatus.breakdown;
    return [
      { label: "Available",  value: b.available.count, color: "#22c55e" },
      { label: "On Trip",    value: b.onTrip.count,    color: "#3b82f6" },
      { label: "In Shop",    value: b.inShop.count,    color: "#f97316" },
      { label: "Retired",    value: b.retired.count,   color: "#ef4444" },
      { label: "On Standby", value: b.standby.count,   color: "#d1d5db" },
    ];
  }, [data]);

  if (error) {
    return (
      <div className="p-5 flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchDashboard} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const kpis = data?.kpis;

  return (
    <div className="p-5 space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect label="Vehicle Type" value={vehicleType} onChange={setVehicleType}
          options={["All", "VAN", "TRUCK", "MINI", "OTHER"]} />
        <FilterSelect label="Status" value={status} onChange={setStatus}
          options={["All", "AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED", "STANDBY"]} />
        <FilterSelect label="Region" value={region} onChange={setRegion}
          options={["All", "North", "South", "East", "West"]} />
        <button onClick={fetchDashboard} disabled={loading}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpiConfig.map((item) => {
          const value = kpis?.[item.key] ?? 0;
          if (item.isCircle) {
            return (
              <Card key={item.key} className="flex flex-col items-center justify-center py-4 px-3 text-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#e5e7eb" strokeWidth="7" className="dark:stroke-gray-700" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#3b82f6" strokeWidth="7"
                      strokeDasharray={`${(value / 100) * 163.4} 163.4`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{loading ? "—" : `${value}%`}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">{item.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
              </Card>
            );
          }
          return (
            <Card key={item.key} className="px-4 py-3">
              <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center mb-2`}>
                <item.icon size={16} className={item.iconColor} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight mb-1">{item.label}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {loading ? "—" : String(value).padStart(2, "0")}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
            </Card>
          );
        })}
      </div>

      {/* Recent Trips + Vehicle Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trips</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {["Trip ID", "Vehicle", "Driver", "Status", "ETA", "Updated", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">Loading…</td></tr>
                ) : !data?.recentTrips.length ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">No trips found</td></tr>
                ) : (
                  data.recentTrips.map((trip) => {
                    const badge = tripStatusMap[trip.status] ?? { label: trip.status, className: "bg-gray-100 text-gray-600" };
                    return (
                      <tr key={trip.tripCode} className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{trip.tripCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{trip.vehicleLabel}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{trip.driverLabel}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>{badge.label}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{trip.eta}</td>
                        <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{trip.updatedAgo}</td>
                        <td className="px-4 py-3">
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="px-4 py-3">
              <a href="/trips" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">View all trips →</a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Vehicle Status</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-center py-4 px-4">
            {loading ? (
              <div className="text-sm text-gray-400 py-8">Loading…</div>
            ) : (
              <DonutChart segments={donutSegments} total={data?.vehicleStatus.total ?? 0} centerLabel="Total Vehicles" thickness={28} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fleet Map + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader><CardTitle>Fleet at a Glance</CardTitle></CardHeader>
          <div className="relative h-52 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900" />
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
              <path d="M0,150 Q200,80 400,150 T800,150" stroke="#93c5fd" strokeWidth="2" fill="none"/>
              <path d="M0,200 Q200,130 400,200 T800,200" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
              <path d="M150,0 Q180,150 150,300" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
              <path d="M400,0 Q420,150 400,300" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
              <path d="M650,0 Q680,150 650,300" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
            </svg>
            {[
              { name: "Ahmedabad", top: "28%", left: "9%"  },
              { name: "Mumbai",    top: "73%", left: "14%" },
              { name: "Indore",    top: "20%", left: "32%" },
              { name: "Nagpur",    top: "50%", left: "40%" },
              { name: "Raipur",    top: "44%", left: "53%" },
              { name: "Bhopal",    top: "13%", left: "43%" },
              { name: "Kolkata",   top: "8%",  left: "72%" },
              { name: "Hyderabad", top: "75%", left: "51%" },
              { name: "Bhubaneswar", top: "43%", left: "66%" },
            ].map((c) => (
              <span key={c.name} className="absolute text-[10px] text-gray-500 dark:text-gray-400 font-medium select-none pointer-events-none" style={{ top: c.top, left: c.left }}>{c.name}</span>
            ))}
            {mapMarkers.map((m, i) => (
              <div key={i} className={`absolute flex items-center justify-center ${m.color} text-white text-xs font-bold rounded-full shadow-md`}
                style={{ width: 30, height: 30, top: m.top, left: m.left, transform: "translate(-50%,-50%)" }}>
                {m.count}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map(({ label, icon: Icon }) => (
                <button key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                    <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
        {options.map((o) => (
          <option key={o} value={o}>{o === "All" ? `${label}: All` : o.replace(/_/g, " ")}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}
