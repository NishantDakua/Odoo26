import { NextResponse } from "next/server";
import { getAvailableVehicles } from "@/modules/vehicles";

export async function GET() {
  const vehicles = await getAvailableVehicles();
  return NextResponse.json(vehicles);
}
