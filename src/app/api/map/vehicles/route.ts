import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEPOTS = [
  { id: "depot-1", name: "Ahmedabad Hub", location: { lng: 72.5714, lat: 23.0225 } },
  { id: "depot-2", name: "Mumbai Port", location: { lng: 72.8777, lat: 19.0760 } },
  { id: "depot-3", name: "Delhi Logistics", location: { lng: 77.2090, lat: 28.6139 } },
  { id: "depot-4", name: "Bangalore Tech Park", location: { lng: 77.5946, lat: 12.9716 } },
];

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: {
          where: { status: 'DISPATCHED' },
          take: 1
        }
      }
    });

    const mapStates = vehicles.map((v: any, index: number) => {
      const depot = DEPOTS[index % DEPOTS.length];
      // Slight offset if available so they don't overlap exactly
      const lng = v.status !== 'ON_TRIP' ? depot.location.lng + (Math.random() - 0.5) * 0.01 : depot.location.lng;
      const lat = v.status !== 'ON_TRIP' ? depot.location.lat + (Math.random() - 0.5) * 0.01 : depot.location.lat;

      return {
        id: v.id,
        registrationNumber: v.registrationNumber,
        status: v.status,
        type: v.type,
        location: { lng, lat },
        heading: 0,
        speed: 0,
        fuelRemaining: Math.floor(Math.random() * 50) + 50,
        tripId: v.trips[0]?.id
      };
    });

    return NextResponse.json(mapStates);
  } catch (error) {
    console.error("Failed to fetch map vehicles:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
