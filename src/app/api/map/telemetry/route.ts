import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TelemetryData } from "@/types/telemetry";
import { RouteGeometry } from "@/types/route";

declare global {
  var routeCache: Record<string, RouteGeometry>;
}

/**
 * Calculates distance between two [lng, lat] coordinates in meters
 */
function getDistance(p1: [number, number], p2: [number, number]): number {
  const R = 6371e3; // metres
  const φ1 = p1[1] * Math.PI/180;
  const φ2 = p2[1] * Math.PI/180;
  const Δφ = (p2[1]-p1[1]) * Math.PI/180;
  const Δλ = (p2[0]-p1[0]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Interpolate coordinate based on a progress ratio (0 to 1)
 */
function interpolate(p1: [number, number], p2: [number, number], ratio: number): [number, number] {
  return [
    p1[0] + (p2[0] - p1[0]) * ratio,
    p1[1] + (p2[1] - p1[1]) * ratio
  ];
}

/**
 * Calculates heading from p1 to p2
 */
function calculateHeading(p1: [number, number], p2: [number, number]): number {
  const dy = p2[1] - p1[1];
  const dx = Math.cos(Math.PI / 180 * p1[1]) * (p2[0] - p1[0]);
  const angle = Math.atan2(dy, dx);
  let heading = (angle * 180) / Math.PI;
  heading = (90 - heading) % 360;
  if (heading < 0) heading += 360;
  return heading;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json({ error: "Missing tripId" }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true }
    });

    if (!trip || !trip.vehicleId || !trip.dispatchedAt) {
      return NextResponse.json({ error: "Trip not found or not dispatched" }, { status: 404 });
    }

    const route = global.routeCache?.[tripId];
    if (!route) {
      return NextResponse.json({ error: "Route geometry not cached. Re-generate route first." }, { status: 400 });
    }

    // SIMULATION MATH: Time based deterministic
    const elapsedSeconds = (Date.now() - trip.dispatchedAt.getTime()) / 1000;
    
    // If we've exceeded duration, snap to end
    if (elapsedSeconds >= route.durationSeconds) {
      const dest = route.coordinates[route.coordinates.length - 1];
      return NextResponse.json({
        vehicleId: trip.vehicleId,
        latitude: dest[1],
        longitude: dest[0],
        heading: 0,
        speed: 0,
        fuelRemaining: 20, // Simplified
        engineStatus: 'IDLE',
        timestamp: new Date().toISOString()
      } as TelemetryData);
    }

    // Find current segment based on distance proportional to time
    // Average speed m/s
    const avgSpeed = route.distanceMeters / route.durationSeconds;
    const distanceTraveled = avgSpeed * elapsedSeconds;

    let accumulatedDistance = 0;
    let currentPos: [number, number] = route.coordinates[0];
    let heading = 0;

    for (let i = 0; i < route.coordinates.length - 1; i++) {
      const p1 = route.coordinates[i];
      const p2 = route.coordinates[i + 1];
      const segmentDist = getDistance(p1, p2);

      if (accumulatedDistance + segmentDist >= distanceTraveled) {
        const remainingDistInSegment = distanceTraveled - accumulatedDistance;
        const ratio = remainingDistInSegment / segmentDist;
        currentPos = interpolate(p1, p2, ratio);
        heading = calculateHeading(p1, p2);
        break;
      }
      accumulatedDistance += segmentDist;
    }

    const speedKmh = (avgSpeed * 3600) / 1000;
    
    // Mock fuel burn based on distance
    const initialFuel = 100;
    const fuelRemaining = Math.max(0, initialFuel - (distanceTraveled / 1000) * 0.2); // 0.2L per km

    const telemetry: TelemetryData = {
      vehicleId: trip.vehicleId,
      latitude: currentPos[1],
      longitude: currentPos[0],
      heading,
      speed: speedKmh,
      fuelRemaining,
      engineStatus: 'ON',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(telemetry);

  } catch (error) {
    console.error("Telemetry API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
