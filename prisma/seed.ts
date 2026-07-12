import {
  PrismaClient,
  Prisma,
  VehicleType,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TransitOps database...");

  // ===========================
  // Users (one per role)
  // ===========================

  const passwordHash = await bcrypt.hash("password123", 12);

  const users: { name: string; email: string; role: UserRole }[] = [
    { name: "Safety Officer",    email: "safety@transitops.com",    role: UserRole.SAFETY_OFFICER },
    { name: "Fleet Manager",     email: "fleet@transitops.com",     role: UserRole.FLEET_MANAGER },
    { name: "Dispatcher",        email: "dispatcher@transitops.com",role: UserRole.DISPATCHER },
    { name: "Financial Analyst", email: "finance@transitops.com",   role: UserRole.FINANCIAL_ANALYST },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash, role: u.role },
    });
  }

  console.log("👤 Users seeded:");
  console.log("   safety@transitops.com     / password123  (Safety Officer)");
  console.log("   fleet@transitops.com      / password123  (Fleet Manager)");
  console.log("   dispatcher@transitops.com / password123  (Dispatcher)");
  console.log("   finance@transitops.com    / password123  (Financial Analyst)");

  // ===========================
  // Vehicles
  // ===========================

  await prisma.maintenanceLog.deleteMany();
  await prisma.vehicle.deleteMany();

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