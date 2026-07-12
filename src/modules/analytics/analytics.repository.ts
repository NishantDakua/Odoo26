import { prisma } from "@/lib/prisma";

// These string literals will resolve to the enum values after `prisma generate`
const V = {
  AVAILABLE: "AVAILABLE",
  ON_TRIP: "ON_TRIP",
  IN_SHOP: "IN_SHOP",
  RETIRED: "RETIRED",
  STANDBY: "STANDBY",
} as const;

const T = {
  DISPATCHED: "DISPATCHED",
  DRAFT: "DRAFT",
} as const;

export type DashboardFilters = {
  type?: string;
  status?: string;
  region?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export async function getVehicleCounts(filters: DashboardFilters) {
  const where: any = {};
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.region) where.region = filters.region;

  const [total, byStatus] = await Promise.all([
    prisma.vehicle.count({ where }),
    prisma.vehicle.groupBy({
      by: ["status"],
      where,
      _count: true,
    }),
  ]);

  return { total, byStatus };
}

export async function getActiveVehicleCount(filters: DashboardFilters) {
  const where: any = { status: { not: V.RETIRED } };
  if (filters.type) where.type = filters.type;
  if (filters.region) where.region = filters.region;
  return prisma.vehicle.count({ where });
}

export async function getAvailableVehicleCount(filters: DashboardFilters) {
  const where: any = { status: V.AVAILABLE };
  if (filters.type) where.type = filters.type;
  if (filters.region) where.region = filters.region;
  return prisma.vehicle.count({ where });
}

export async function getInShopVehicleCount(filters: DashboardFilters) {
  const where: any = { status: V.IN_SHOP };
  if (filters.type) where.type = filters.type;
  if (filters.region) where.region = filters.region;
  return prisma.vehicle.count({ where });
}

export async function getTripCounts(filters: DashboardFilters) {
  const where: any = {};
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters.dateTo) where.createdAt.lte = filters.dateTo;
  }

  const [active, pending] = await Promise.all([
    prisma.trip.count({ where: { ...where, status: T.DISPATCHED } }),
    prisma.trip.count({ where: { ...where, status: T.DRAFT } }),
  ]);

  return { active, pending };
}

export async function getDriversOnDutyCount() {
  return prisma.driver.count({ where: { status: "ON_TRIP" } });
}

export async function getRecentTrips(filters: DashboardFilters, limit = 8) {
  const where: any = {};
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters.dateTo) where.createdAt.lte = filters.dateTo;
  }

  return prisma.trip.findMany({
    where,
    include: {
      vehicle: { select: { registrationNumber: true } },
      driver: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}
