import { prisma } from "@/lib/prisma";
import type { CreateTripInput, CompleteTripInput, TripWithRelations } from "./trip.types";

const tripIncludes = {
  vehicle: { select: { id: true, registrationNumber: true, nameModel: true, type: true } },
  driver: { select: { id: true, name: true, licenseNumber: true } },
} as const;

export async function findTripById(id: string): Promise<TripWithRelations | null> {
  return prisma.trip.findUnique({ where: { id }, include: tripIncludes });
}

export async function listTrips(filters: {
  status?: string;
  vehicleId?: string;
  driverId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}): Promise<{ trips: TripWithRelations[]; total: number }> {
  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.vehicleId) where.vehicleId = filters.vehicleId;
  if (filters.driverId) where.driverId = filters.driverId;
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters.dateTo) where.createdAt.lte = filters.dateTo;
  }

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      include: tripIncludes,
      orderBy: { updatedAt: "desc" },
      take: filters.limit ?? 50,
      skip: filters.offset ?? 0,
    }),
    prisma.trip.count({ where }),
  ]);

  return { trips, total };
}

async function generateTripCode(): Promise<string> {
  // Count including soft-deleted/cancelled to avoid gaps creating confusion
  const count = await prisma.trip.count();
  return `TR${String(count + 1).padStart(3, "0")}`;
}

export async function createTrip(input: CreateTripInput): Promise<TripWithRelations> {
  // Retry loop handles the rare same-instant collision on the unique tripCode
  for (let attempt = 0; attempt < 5; attempt++) {
    const tripCode = await generateTripCode();
    try {
      return await prisma.trip.create({
        data: {
          tripCode,
          source: input.source,
          destination: input.destination,
          cargoWeightKg: input.cargoWeightKg,
          plannedDistanceKm: input.plannedDistanceKm,
          vehicleId: input.vehicleId,
          driverId: input.driverId,
          status: "DRAFT",
        },
        include: tripIncludes,
      });
    } catch (err: any) {
      if (err?.code === "P2002" && err?.meta?.target?.includes("tripCode")) {
        continue; // code collision — retry
      }
      throw err;
    }
  }
  throw new Error("Failed to generate unique trip code after 5 attempts");
}

export async function dispatchTrip(
  id: string,
  data: {
    vehicleId: string;
    driverId: string;
    dispatchedById: string;
    startOdometerKm: number;
  }
): Promise<TripWithRelations> {
  return prisma.trip.update({
    where: { id },
    data: {
      status: "DISPATCHED",
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      dispatchedById: data.dispatchedById,
      dispatchedAt: new Date(),
      startOdometerKm: data.startOdometerKm,
    },
    include: tripIncludes,
  });
}

export async function completeTrip(
  id: string,
  data: CompleteTripInput & { startOdometerKm: number }
): Promise<TripWithRelations> {
  const actualDistanceKm = data.finalOdometerKm - data.startOdometerKm;
  return prisma.trip.update({
    where: { id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      finalOdometerKm: data.finalOdometerKm,
      fuelConsumedLiters: data.fuelConsumedLiters,
      actualDistanceKm,
      revenue: data.revenue != null ? data.revenue : undefined,
    },
    include: tripIncludes,
  });
}

export async function cancelTrip(id: string): Promise<TripWithRelations> {
  return prisma.trip.update({
    where: { id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
    include: tripIncludes,
  });
}

export async function getVehicleWithStatus(vehicleId: string) {
  return prisma.vehicle.findUnique({
    where: { id: vehicleId },
    select: { id: true, status: true, maxLoadCapacityKg: true, odometerKm: true },
  });
}

export async function getDriverWithStatus(driverId: string) {
  return prisma.driver.findUnique({
    where: { id: driverId },
    select: { id: true, status: true, licenseExpiryDate: true },
  });
}
