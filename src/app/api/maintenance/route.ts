import { NextResponse } from "next/server";
import { createMaintenance, getMaintenanceLogs } from "@/modules/maintenance";

export async function GET() {
  const logs = await getMaintenanceLogs();
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { vehicleId, serviceType, cost, serviceDate } = body;

  if (!vehicleId || !serviceType || !cost || !serviceDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const log = await createMaintenance({
      vehicleId,
      serviceType,
      cost: Number(cost),
      serviceDate: new Date(serviceDate),
      notes: body.notes,
      loggedById: body.loggedById,
    });
    return NextResponse.json(log, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
