"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import type { FuelLog, Expense, Vehicle } from "@/lib/types";
import { fleetKPIs } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { exportToCSV } from "@/lib/csv";

/* ───────────────────────── KPI Card ───────────────────────── */

interface KPICardProps {
  label: string;
  value: string | number;
  suffix?: string;
}

/** A single metric tile shown at the top of the dashboard. */
function KPICard({ label, value, suffix }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1 text-gray-900">
        {value}
        {suffix}
      </p>
    </div>
  );
}

/* ───────────────────── Chart styling tokens ──────────────── */

const GRID_COLOUR = "#e5e7eb";
const AXIS_PROPS = { fontSize: 12, tickLine: false, axisLine: false } as const;
const CURSOR_STYLE = { fill: "#f3f4f6" };

/* ──────────────────── Analytics Dashboard ────────────────── */

interface AnalyticsDashboardProps {
  fuelLogs: FuelLog[];
  expenses: Expense[];
  vehicles: Vehicle[];
  monthlyRevenue: { month: string; revenue: number }[];
}

/**
 * Top‑level analytics section.
 *
 * Displays four KPI cards (efficiency, utilisation, cost, ROI)
 * followed by a revenue trend line chart and a bar chart of the
 * costliest vehicles.
 */
export default function AnalyticsDashboard({
  fuelLogs,
  expenses,
  vehicles,
  monthlyRevenue,
}: AnalyticsDashboardProps) {
  const kpis = fleetKPIs(fuelLogs, expenses, vehicles);

  return (
    <div className="space-y-6">
      {/* ── KPI cards row ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Fuel Efficiency" value={kpis.fuelEfficiency} suffix=" km/L" />
        <KPICard label="Fleet Utilization" value={kpis.fleetUtilization} suffix="%" />
        <KPICard label="Operational Cost" value={formatCurrency(kpis.opCost)} />
        <KPICard label="ROI" value={kpis.roi} suffix="%" />
      </div>

      {/* ── Charts row ─────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Revenue trend */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOUR} />
              <XAxis dataKey="month" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value) || 0)}
                cursor={CURSOR_STYLE}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle cost breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-600">
              Top Costliest Vehicles
            </h3>
            <button
              onClick={() => exportToCSV(kpis.costsByVehicle, "vehicle_costs")}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5
                         hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Export CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={kpis.costsByVehicle}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID_COLOUR} />
              <XAxis dataKey="name" {...AXIS_PROPS} />
              <YAxis {...AXIS_PROPS} />
              <Tooltip
                formatter={(value: any) => formatCurrency(Number(value) || 0)}
                cursor={CURSOR_STYLE}
              />
              <Bar dataKey="totalCost" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
