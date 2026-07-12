import { prisma } from "@/lib/prisma";
import { MaintenanceStatus, VehicleStatus, Prisma } from "@prisma/client";

export type CreateMaintenanceInput = {
  vehicleId: string;
  serviceType: string;
  cost: number;
  serviceDate: Date | string;
  notes?: string;
  loggedById?: string;
};

export async function createMaintenance(input: CreateMaintenanceInput) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.maintenanceLog.create({
      data: {
        vehicleId: input.vehicleId,
        serviceType: input.serviceType,
        cost: new Prisma.Decimal(input.cost),
        serviceDate: new Date(input.serviceDate),
        notes: input.notes,
        loggedById: input.loggedById,
      },
    });

    await tx.vehicle.update({
      where: { id: input.vehicleId },
      data: { status: VehicleStatus.IN_SHOP },
    });

    return log;
  });
}

export async function getMaintenanceLogs() {
  return prisma.maintenanceLog.findMany({
    include: { vehicle: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function closeMaintenance(id: string) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.maintenanceLog.findUnique({ where: { id } });
    if (!log) throw new Error("Maintenance log not found");

    const updated = await tx.maintenanceLog.update({
      where: { id },
      data: {
        status: MaintenanceStatus.COMPLETED,
        closedAt: new Date(),
      },
    });

    const vehicle = await tx.vehicle.findUnique({ where: { id: log.vehicleId } });
    if (vehicle && vehicle.status !== VehicleStatus.RETIRED) {
      await tx.vehicle.update({
        where: { id: log.vehicleId },
        data: { status: VehicleStatus.AVAILABLE },
      });
    }

    return updated;
  });
}

export async function getVehicleMaintenanceHistory(vehicleId: string) {
  return prisma.maintenanceLog.findMany({
    where: { vehicleId },
    orderBy: { serviceDate: "desc" },
  });
}
