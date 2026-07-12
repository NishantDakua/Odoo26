"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { dashboardMockData } from "@/lib/mock-data";

type FilterState = {
  vehicleType: string;
  status: string;
  region: string;
};

export default function DashboardPage() {
  const [filters, setFilters] = useState<FilterState>({
    vehicleType: "All",
    status: "All",
    region: "All",
  });

  const data = dashboardMockData;

  // extract unique regions from trips
  const regions = useMemo(() => {
    const unique = Array.from(new Set(data.recentTrips.map((t) => t.region)));
    return ["All", ...unique.sort()];
  }, [data.recentTrips]);

  // client-side filtering
  const filteredTrips = useMemo(() => {
    return data.recentTrips.filter((trip) => {
      if (filters.vehicleType !== "All" && trip.vehicleType !== filters.vehicleType) return false;
      if (filters.status !== "All" && trip.status !== filters.status) return false;
      if (filters.region !== "All" && trip.region !== filters.region) return false;
      return true;
    });
  }, [data.recentTrips, filters]);

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filters.vehicleType}
          onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>VAN</option>
          <option>TRUCK</option>
          <option>MINI</option>
          <option>OTHER</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>DRAFT</option>
          <option>DISPATCHED</option>
          <option>COMPLETED</option>
          <option>CANCELLED</option>
        </select>

        <select
          value={filters.region}
          onChange={(e) => setFilters({ ...filters, region: e.target.value })}
          className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {regions.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <KpiCard label="Active Vehicles" value={data.kpis.activeVehicles} />
        <KpiCard label="Available Vehicles" value={data.kpis.availableVehicles} />
        <KpiCard label="Vehicles in Maintenance" value={data.kpis.vehiclesInMaintenance} />
        <KpiCard label="Active Trips" value={data.kpis.activeTrips} />
        <KpiCard label="Pending Trips" value={data.kpis.pendingTrips} />
        <KpiCard label="Drivers on Duty" value={data.kpis.driversOnDuty} />
        <KpiCard label="Fleet Utilization" value={`${data.kpis.fleetUtilizationPct}%`} />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              data={filteredTrips}
              columns={[
                { header: "Trip", accessor: "tripCode" },
                { header: "Vehicle", accessor: "vehicleLabel" },
                { header: "Driver", accessor: "driverLabel" },
                { 
                  header: "Status", 
                  accessor: (row) => <StatusBadge status={row.status} variant="trip" /> 
                },
                { header: "ETA", accessor: "eta" },
              ]}
              emptyMessage="No trips match the selected filters"
            />
          </CardContent>
        </Card>

        {/* Vehicle Status */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusBar
              label="Available"
              count={data.vehicleStatusBreakdown.available}
              total={Object.values(data.vehicleStatusBreakdown).reduce((a, b) => a + b, 0)}
              color="bg-status-available"
            />
            <StatusBar
              label="On Trip"
              count={data.vehicleStatusBreakdown.onTrip}
              total={Object.values(data.vehicleStatusBreakdown).reduce((a, b) => a + b, 0)}
              color="bg-status-ontrip"
            />
            <StatusBar
              label="In Shop"
              count={data.vehicleStatusBreakdown.inShop}
              total={Object.values(data.vehicleStatusBreakdown).reduce((a, b) => a + b, 0)}
              color="bg-status-inshop"
            />
            <StatusBar
              label="Retired"
              count={data.vehicleStatusBreakdown.retired}
              total={Object.values(data.vehicleStatusBreakdown).reduce((a, b) => a + b, 0)}
              color="bg-status-retired"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      </CardContent>
    </Card>
  );
}

function StatusBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{count}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
