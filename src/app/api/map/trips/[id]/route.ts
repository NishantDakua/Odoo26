import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: {
        vehicle: true,
        driver: true,
      }
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Failed to fetch map trip details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
