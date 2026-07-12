import { NextResponse } from "next/server";
import { RouteGeometry } from "@/types/route";

// Global cache for route geometries so the telemetry endpoint can access them statelessly
declare global {
  var routeCache: Record<string, RouteGeometry>;
}

if (!global.routeCache) {
  global.routeCache = {};
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, destination, tripId } = body;

    if (!source || !destination || !tripId) {
      return NextResponse.json({ error: "Missing source, destination, or tripId" }, { status: 400 });
    }

    const OSRM_URL = process.env.NEXT_PUBLIC_OSRM_URL || "https://router.project-osrm.org";
    const url = `${OSRM_URL}/route/v1/driving/${source[0]},${source[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch route from OSRM");
    }

    const data = await response.json();
    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      throw new Error("No route found");
    }

    const route = data.routes[0];
    const geometry: RouteGeometry = {
      coordinates: route.geometry.coordinates as [number, number][], // [lng, lat]
      distanceMeters: route.distance,
      durationSeconds: route.duration,
    };

    // Store in global cache for the telemetry simulation
    global.routeCache[tripId] = geometry;

    return NextResponse.json(geometry);
  } catch (error) {
    console.error("Routing API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
