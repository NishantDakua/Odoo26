import { NextResponse } from "next/server";
import { closeMaintenance } from "@/modules/maintenance";

type RouteContext = { params: { id: string } };

export async function PATCH(_req: Request, { params }: RouteContext) {
  try {
    const log = await closeMaintenance(params.id);
    return NextResponse.json(log);
  } catch (err: any) {
    if (err?.message === "Maintenance log not found") {
      return NextResponse.json({ error: "Maintenance log not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
