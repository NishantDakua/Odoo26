import { NextResponse } from "next/server";
import { updateVehicleStatus } from "@/modules/vehicles";
import { VehicleStatus } from "@prisma/client";

type RouteContext = { params: { id: string } };

export async function PATCH(req: Request, { params }: RouteContext) {
  const body = await req.json();
  const { status } = body;

  if (!status || !Object.values(VehicleStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid or missing status" }, { status: 400 });
  }

  try {
    const vehicle = await updateVehicleStatus(params.id, status);
    return NextResponse.json(vehicle);
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
