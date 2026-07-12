import { NextResponse } from "next/server";
import { createVehicle, getVehicles } from "@/modules/vehicles";
import { VehicleType } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const status = searchParams.get("status") as any;
  const type = searchParams.get("type") as any;
  const registrationNumber = searchParams.get("registration") || undefined;

  const filters = {
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
    ...(registrationNumber ? { registrationNumber } : {}),
  };

  const vehicles = await getVehicles(filters);
  return NextResponse.json(vehicles);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { registrationNumber, nameModel, type, maxLoadCapacityKg, acquisitionCost } = body;

  if (!registrationNumber || !nameModel || !type || !maxLoadCapacityKg || !acquisitionCost) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!Object.values(VehicleType).includes(type)) {
    return NextResponse.json({ error: "Invalid vehicle type" }, { status: 400 });
  }

  try {
    const vehicle = await createVehicle({
      registrationNumber,
      nameModel,
      type,
      maxLoadCapacityKg: Number(maxLoadCapacityKg),
      acquisitionCost: Number(acquisitionCost),
      odometerKm: body.odometerKm ? Number(body.odometerKm) : undefined,
      region: body.region,
      depotName: body.depotName,
    });
    return NextResponse.json(vehicle, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Registration number already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
