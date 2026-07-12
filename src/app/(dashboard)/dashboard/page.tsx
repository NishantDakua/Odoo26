"use client";

import { useMemo, useState } from "react";
import {
  Truck, CheckCircle, Wrench, Route, Clock, Users, TrendingUp,
  Calendar, ChevronDown, MoreVertical, Plus, Fuel, BarChart2, MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DonutChart } from "@/components/ui/DonutChart";
import { dashboardMockData } from "@/lib/mock-data";

const kpiConfig = [
  {
    key: "activeVehicles",
    label: "Active Vehicles",
    sub: "Live on the road",
    icon: Truck,
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-500",
  },
  {
    key: "availableVehicles",
    label: "Available Vehicles",
    sub: "Ready to deploy",
    icon: CheckCircle,
    iconBg: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-500",
  },
  {
    key: "vehiclesInMaintenance",
    label: "Vehicles in Maintenance",
    sub: "In shop",
    icon: Wrench,
    iconBg: "bg-orange-50 dark:bg-orange-950",
    iconColor: "text-orange-500",
  },
  {
    key: "activeTrips",
    label: "Active Trips",
    sub: "In progress",
    icon: Route,
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-500",
  },
  {
    key: "pendingTrips",
    label: "Pending Trips",
    sub: "Scheduled",
    icon: Clock,
    iconBg: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-500",
  },
  {
    key: "driversOnDuty",
    label: "Vehicles on Duty",
    sub: "Currently assigned",
    icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-500",
  },
  {
    key: "fleetUtilizationPct",
    label: "Fleet Utilization",
    sub: "Utilization rate",
    icon: TrendingUp,
    isCircle: true,
  },
] as const;

const tripStatusMap: Record<string, { label: string; className: string }> = {
  ON_TRIP: { label: "On Trip", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" },
  DISPATCHED: { label: "Dispatched", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400" },
  IN_SHOP: { label: "In Shop", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400" },
  RETIRED: { label: "Retired", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

const quickActions = [
  { label: "Add Vehicle", icon: Truck },
  { label: "Add Trip", icon: Route },
  { label: "Assign Driver", icon: Users },
  { label: "Maintenance", icon: Wrench },
  { label: "Fuel Entry", icon: Fuel },
  { label: "Reports", icon: BarChart2 },
];

const mapMarkers = [
  { top: "38%", left: "12%", count: 12, color: "bg-green-500" },
  { top: "55%", left: "17%", count: 14, color: "bg-green-500" },
  { top: "28%", left: "36%", count: 8, color: "bg-blue-500" },
  { top: "58%", left: "52%", count: 3, color: "bg-red-500" },
  { top: "20%", left: "72%", count: 6, color: "bg-blue-500" },
  { top: "60%", left: "72%", count: 4, color: "bg-orange-500" },
];

export default function DashboardPage() {
  const [vehicleType, setVehicleType] = useState("All");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");

  const data = dashboardMockData;
  const kpis = data.kpis as Record<string, number>;

  const filteredTrips = useMemo(() => {
    return data.recentTrips.filter((t) => {
      if (vehicleType !== "All" && t.vehicleType !== vehicleType) return false;
      if (status !== "All" && t.status !== status) return false;
      if (region !== "All" && t.region !== region) return false;
      return true;
    });
  }, [data.recentTrips, vehicleType, status, region]);

  const vsd = data.vehicleStatusBreakdown;
  const total = vsd.available + vsd.onTrip + vsd.inShop + vsd.retired + vsd.onStandby;
  const donutSegments = [
    { label: "Available", value: vsd.available, color: "#22c55e" },
    { label: "On Trip", value: vsd.onTrip, color: "#3b82f6" },
    { label: "In Shop", value: vsd.inShop, color: "#f97316" },
    { label: "Retired", value: vsd.retired, color: "#ef4444" },
    { label: "On Standby", value: vsd.onStandby, color: "#d1d5db" },
  ];

  return (
    <div className="p-5 space-y-5">
      {/* Filters + date range */}
      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect label="Vehicle Type" value={vehicleType} onChange={setVehicleType}
          options={["All", "VAN", "TRUCK", "MINI", "OTHER"]} />
        <FilterSelect label="Status" value={status} onChange={setStatus}
          options={["All", "ON_TRIP", "DISPATCHED", "COMPLETED", "IN_SHOP", "RETIRED", "DRAFT"]} />
        <FilterSelect label="Region" value={region} onChange={setRegion}
          options={["All", "North", "South", "East", "West"]} />

        <div className="ml-auto flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
          <Calendar size={14} className="text-gray-400" />
          {data.dateRange}
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpiConfig.map(({ key, label, sub, icon: Icon, iconBg, iconColor, isCircle }) => {
          const value = kpis[key];
          if (isCircle) {
            return (
              <Card key={key} className="flex flex-col items-center justify-center py-4 px-3 text-center">
                <div className="relative w-16 h-16 mb-2">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#e5e7eb" strokeWidth="7" className="dark:stroke-gray-700" />
                    <circle
                      cx="32" cy="32" r="26" fill="none"
                      stroke="#3b82f6" strokeWidth="7"
                      strokeDasharray={`${(value / 100) * 163.4} 163.4`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{value}%</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">{label}</div>
                {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
              </Card>
            );
          }
          return (
            <Card key={key} className="px-4 py-3">
              <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center mb-2`}>
                <Icon size={16} className={iconColor} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight mb-1">{label}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {String(value).padStart(2, "0")}
              </div>
              {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
            </Card>
          );
        })}
      </div>

      {/* Middle row: Recent Trips + Vehicle Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trips</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {["Trip ID", "Vehicle", "Driver", "Status", "ETA", "Updated", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => {
                  const badge = tripStatusMap[trip.status] ?? { label: trip.status, className: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={trip.tripCode} className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{trip.tripCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{trip.vehicleLabel}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{trip.driverLabel}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{trip.eta}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{trip.updated}</td>
                      <td className="px-4 py-3">
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-3">
              <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                View all trips →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Status */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-2">
            <DonutChart
              segments={donutSegments}
              total={total}
              centerLabel="Total Vehicles"
              size={150}
              thickness={24}
            />
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Map + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Fleet at a Glance */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle>Fleet at a Glance</CardTitle>
          </CardHeader>
          <div className="relative h-52 bg-blue-50 dark:bg-gray-800 overflow-hidden">
            {/* Simple map background using a placeholder gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900" />
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice">
              <path d="M0,150 Q200,80 400,150 T800,150" stroke="#93c5fd" strokeWidth="2" fill="none"/>
              <path d="M0,200 Q200,130 400,200 T800,200" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
              <path d="M150,0 Q180,150 150,300" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
              <path d="M400,0 Q420,150 400,300" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
              <path d="M650,0 Q680,150 650,300" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
            </svg>
            {/* Location markers */}
            {mapMarkers.map((m, i) => (
              <div
                key={i}
                className={`absolute flex items-center justify-center ${m.color} text-white text-xs font-bold rounded-full w-8 h-8 shadow-md cursor-pointer hover:scale-110 transition-transform`}
                style={{ top: m.top, left: m.left, transform: "translate(-50%, -50%)" }}
              >
                {m.count}
              </div>
            ))}
            {/* City labels */}
            {[
              { name: "Ahmedabad", top: "32%", left: "13%" },
              { name: "Mumbai", top: "68%", left: "16%" },
              { name: "Indore", top: "22%", left: "30%" },
              { name: "Nagpur", top: "55%", left: "38%" },
              { name: "Raipur", top: "44%", left: "50%" },
              { name: "Bhopal", top: "15%", left: "42%" },
              { name: "Kolkata", top: "18%", left: "76%" },
              { name: "Hyderabad", top: "72%", left: "52%" },
              { name: "Bhubaneswar", top: "42%", left: "66%" },
            ].map((c) => (
              <span
                key={c.name}
                className="absolute text-xs text-gray-600 dark:text-gray-400 font-medium"
                style={{ top: c.top, left: c.left }}
              >
                {c.name}
              </span>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group"
                >
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

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  const displayValue = value === "All" ? `${label}: All` : value.replace(/_/g, " ");
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === "All" ? `${label}: All` : o.replace(/_/g, " ")}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}
