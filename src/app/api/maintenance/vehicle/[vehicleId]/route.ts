import { NextResponse } from "next/server";
import { getVehicleMaintenanceHistory } from "@/modules/maintenance";

type RouteContext = { params: { vehicleId: string } };

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const history = await getVehicleMaintenanceHistory(params.vehicleId);
    return NextResponse.json(history);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
