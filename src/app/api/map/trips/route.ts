import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        status: { in: ['DRAFT', 'DISPATCHED'] }
      },
      include: {
        vehicle: true,
        driver: true,
      }
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Failed to fetch map trips:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
