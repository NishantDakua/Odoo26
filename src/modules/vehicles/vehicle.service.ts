import { prisma } from "@/lib/prisma";
import { VehicleStatus, VehicleType, Prisma } from "@prisma/client";

export type CreateVehicleInput = {
  registrationNumber: string;
  nameModel: string;
  type: VehicleType;
  maxLoadCapacityKg: number;
  acquisitionCost: number;
  odometerKm?: number;
  region?: string;
  depotName?: string;
};

export type UpdateVehicleInput = Partial<Omit<CreateVehicleInput, "registrationNumber">>;

export async function createVehicle(input: CreateVehicleInput) {
  return prisma.vehicle.create({
    data: {
      ...input,
      acquisitionCost: new Prisma.Decimal(input.acquisitionCost),
    },
  });
}

export async function getVehicles(filters?: { status?: VehicleStatus; type?: VehicleType; registrationNumber?: string }) {
  const where: Prisma.VehicleWhereInput = {};
  
  if (filters?.status) where.status = filters.status;
  if (filters?.type) where.type = filters.type;
  if (filters?.registrationNumber) {
    where.registrationNumber = { contains: filters.registrationNumber, mode: "insensitive" };
  }

  return prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getVehicleById(id: string) {
  return prisma.vehicle.findUnique({ where: { id } });
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  const data: Prisma.VehicleUpdateInput = { ...input };
  if (input.acquisitionCost !== undefined) {
    data.acquisitionCost = new Prisma.Decimal(input.acquisitionCost);
  }
  return prisma.vehicle.update({ where: { id }, data });
}

export async function deleteVehicle(id: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw new Error("Vehicle not found");

  if (vehicle.status === VehicleStatus.ON_TRIP || vehicle.status === VehicleStatus.IN_SHOP) {
    const error = new Error(`Cannot delete vehicle with status ${vehicle.status}`);
    (error as any).code = "P_CONFLICT";
    throw error;
  }

  return prisma.vehicle.delete({ where: { id } });
}

export async function updateVehicleStatus(id: string, status: VehicleStatus) {
  return prisma.vehicle.update({ where: { id }, data: { status } });
}

export async function getAvailableVehicles() {
  return prisma.vehicle.findMany({
    where: { status: VehicleStatus.AVAILABLE },
    orderBy: { createdAt: "desc" },
  });
}
