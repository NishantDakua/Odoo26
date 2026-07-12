import {
  PrismaClient,
  Prisma,
  VehicleType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TransitOps database...");

  // Clear existing data
  await prisma.maintenanceLog.deleteMany();
  await prisma.vehicle.deleteMany();

  // ===========================
  // Vehicles
  // ===========================

  const van = await prisma.vehicle.create({
    data: {
      registrationNumber: "VAN-05",
      nameModel: "Tata Ace Gold",
      type: VehicleType.VAN,
      maxLoadCapacityKg: 500,
      acquisitionCost: new Prisma.Decimal(650000),
    },
  });

  const truck = await prisma.vehicle.create({
    data: {
      registrationNumber: "TRUCK-11",
      nameModel: "Ashok Leyland 1618",
      type: VehicleType.TRUCK,
      maxLoadCapacityKg: 5000,
      acquisitionCost: new Prisma.Decimal(2500000),
    },
  });

  const mini = await prisma.vehicle.create({
    data: {
      registrationNumber: "MINI-03",
      nameModel: "Mahindra Jeeto",
      type: VehicleType.MINI,
      maxLoadCapacityKg: 1200,
      acquisitionCost: new Prisma.Decimal(480000),
    },
  });

  // ===========================
  // Maintenance Logs
  // ===========================

  await prisma.maintenanceLog.create({
    data: {
      vehicleId: mini.id,
      serviceType: "Oil Change",
      cost: new Prisma.Decimal(2500),
      serviceDate: new Date(),
    },
  });

  await prisma.maintenanceLog.create({
    data: {
      vehicleId: van.id,
      serviceType: "Brake Inspection",
      cost: new Prisma.Decimal(4500),
      serviceDate: new Date(),
    },
  });

  console.log("✅ TransitOps database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });