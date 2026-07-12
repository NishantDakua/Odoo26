import { formatRelativeTime } from "@/lib/format-relative-time";
import {
  getVehicleCounts,
  getActiveVehicleCount,
  getAvailableVehicleCount,
  getInShopVehicleCount,
  getTripCounts,
  getDriversOnDutyCount,
  getRecentTrips,
  type DashboardFilters,
} from "./analytics.repository";

type DashboardData = {
  kpis: {
    activeVehicles: number;
    availableVehicles: number;
    vehiclesInMaintenance: number;
    activeTrips: number;
    pendingTrips: number;
    driversOnDuty: number;
    fleetUtilizationPct: number;
  };
  recentTrips: Array<{
    tripCode: string;
    vehicleLabel: string;
    driverLabel: string;
    status: string;
    eta: string;
    updatedAgo: string;
  }>;
  vehicleStatus: {
    total: number;
    breakdown: {
      available: { count: number; pct: number };
      onTrip: { count: number; pct: number };
      inShop: { count: number; pct: number };
      retired: { count: number; pct: number };
      standby: { count: number; pct: number };
    };
  };
};

export async function getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
  const [
    activeVehicles,
    availableVehicles,
    inShopVehicles,
    { active: activeTrips, pending: pendingTrips },
    driversOnDuty,
    { total: vehicleTotal, byStatus },
    recentTripsRaw,
  ] = await Promise.all([
    getActiveVehicleCount(filters),
    getAvailableVehicleCount(filters),
    getInShopVehicleCount(filters),
    getTripCounts(filters),
    getDriversOnDutyCount(),
    getVehicleCounts(filters),
    getRecentTrips(filters),
  ]);

  const onTripCount = byStatus.find((s: any) => s.status === "ON_TRIP")?._count ?? 0;
  const fleetUtilizationPct =
    activeVehicles > 0
      ? Math.round((onTripCount / activeVehicles) * 100)
      : 0;

  const statusCounts = {
    available: byStatus.find((s: any) => s.status === "AVAILABLE")?._count ?? 0,
    onTrip: byStatus.find((s: any) => s.status === "ON_TRIP")?._count ?? 0,
    inShop: byStatus.find((s: any) => s.status === "IN_SHOP")?._count ?? 0,
    retired: byStatus.find((s: any) => s.status === "RETIRED")?._count ?? 0,
    standby: byStatus.find((s: any) => s.status === "STANDBY")?._count ?? 0,
  };

  const breakdown = distributePercentages(statusCounts, vehicleTotal);

  const recentTrips = recentTripsRaw.map((trip: any) => ({
    tripCode: trip.tripCode,
    vehicleLabel: trip.vehicle?.registrationNumber ?? "--",
    driverLabel: trip.driver?.name ?? "--",
    status: trip.status,
    eta: trip.status === "COMPLETED" ? "Arrived" : trip.status === "DRAFT" ? "Pending" : "--",
    updatedAgo: formatRelativeTime(trip.updatedAt),
  }));

  return {
    kpis: {
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance: inShopVehicles,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilizationPct,
    },
    recentTrips,
    vehicleStatus: {
      total: vehicleTotal,
      breakdown,
    },
  };
}

function distributePercentages(
  counts: Record<string, number>,
  total: number
): {
  available: { count: number; pct: number };
  onTrip: { count: number; pct: number };
  inShop: { count: number; pct: number };
  retired: { count: number; pct: number };
  standby: { count: number; pct: number };
} {
  if (total === 0) {
    return {
      available: { count: 0, pct: 0 },
      onTrip: { count: 0, pct: 0 },
      inShop: { count: 0, pct: 0 },
      retired: { count: 0, pct: 0 },
      standby: { count: 0, pct: 0 },
    };
  }

  const pcts = {
    available: Math.round((counts.available / total) * 100),
    onTrip: Math.round((counts.onTrip / total) * 100),
    inShop: Math.round((counts.inShop / total) * 100),
    retired: Math.round((counts.retired / total) * 100),
    standby: Math.round((counts.standby / total) * 100),
  };

  const sum = pcts.available + pcts.onTrip + pcts.inShop + pcts.retired + pcts.standby;
  const diff = 100 - sum;

  if (diff !== 0) {
    const largest = Object.keys(pcts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    ) as keyof typeof pcts;
    pcts[largest] += diff;
  }

  return {
    available: { count: counts.available, pct: pcts.available },
    onTrip: { count: counts.onTrip, pct: pcts.onTrip },
    inShop: { count: counts.inShop, pct: pcts.inShop },
    retired: { count: counts.retired, pct: pcts.retired },
    standby: { count: counts.standby, pct: pcts.standby },
  };
}
