import { NextResponse } from "next/server";
import { getVehicleById, updateVehicle, deleteVehicle } from "@/modules/vehicles";
import { VehicleType } from "@prisma/client";

type RouteContext = { params: { id: string } };

export async function GET(_req: Request, { params }: RouteContext) {
  const vehicle = await getVehicleById(params.id);
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PUT(req: Request, { params }: RouteContext) {
  const body = await req.json();

  if (body.type && !Object.values(VehicleType).includes(body.type)) {
    return NextResponse.json({ error: "Invalid vehicle type" }, { status: 400 });
  }

  try {
    const vehicle = await updateVehicle(params.id, {
      nameModel: body.nameModel,
      type: body.type,
      maxLoadCapacityKg: body.maxLoadCapacityKg ? Number(body.maxLoadCapacityKg) : undefined,
      acquisitionCost: body.acquisitionCost ? Number(body.acquisitionCost) : undefined,
      odometerKm: body.odometerKm ? Number(body.odometerKm) : undefined,
      region: body.region,
      depotName: body.depotName,
    });
    return NextResponse.json(vehicle);
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    await deleteVehicle(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === "P_CONFLICT") {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    if (err?.message === "Vehicle not found" || err?.code === "P2025") {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

