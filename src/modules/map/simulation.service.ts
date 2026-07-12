/**
 * simulation.service.ts
 *
 * Provides static demo data and deterministic telemetry mathematics.
 * This is the ONLY file that should change when replacing simulated data
 * with real GPS hardware, MQTT, or REST endpoints.
 *
 * The UI never imports this directly — it consumes it through /services/*.
 */

import { RouteGeometry } from "@/types/route";
import { ActiveTrip, LiveTripState, DriverInfo, VehicleInfo } from "@/types/tracking";

const NOW = Date.now();
const HOUR_MS = 3_600_000;
const OSRM_BASE = process.env.NEXT_PUBLIC_OSRM_URL ?? "https://router.project-osrm.org";

// ─── Demo Drivers ─────────────────────────────────────────────────────────────

const DRIVERS: DriverInfo[] = [
  {
    id: "drv-1", employeeId: "EMP-4412", name: "Rajan Mehta",
    phone: "+91 98765 43210", licenseCategory: "HMV",
    licenseNumber: "GJ-01-20180043214", licenseExpiry: "2027-04-15",
    safetyScore: 94, experienceYears: 11, status: "ON_TRIP",
    assignedDepot: "Ahmedabad Hub",
  },
  {
    id: "drv-2", employeeId: "EMP-3371", name: "Suresh Kumar",
    phone: "+91 98112 55678", licenseCategory: "HMV",
    licenseNumber: "DL-03-20160087432", licenseExpiry: "2026-11-30",
    safetyScore: 88, experienceYears: 8, status: "ON_TRIP",
    assignedDepot: "Delhi Hub",
  },
  {
    id: "drv-3", employeeId: "EMP-2208", name: "Priya Sharma",
    phone: "+91 77891 23456", licenseCategory: "LMV",
    licenseNumber: "MH-12-20200056789", licenseExpiry: "2028-06-20",
    safetyScore: 97, experienceYears: 5, status: "ON_TRIP",
    assignedDepot: "Pune Depot",
  },
  {
    id: "drv-4", employeeId: "EMP-1095", name: "Anil Nair",
    phone: "+91 94433 78901", licenseCategory: "LMV",
    licenseNumber: "KA-05-20190023456", licenseExpiry: "2025-09-10",
    safetyScore: 76, experienceYears: 6, status: "ON_TRIP",
    assignedDepot: "Bangalore Depot",
  },
];

// ─── Demo Vehicles ────────────────────────────────────────────────────────────

const VEHICLES: VehicleInfo[] = [
  {
    id: "v1", registrationNumber: "GJ-01-AA-1234",
    model: "Tata Prima 4028.S", type: "TRUCK",
    capacityKg: 15000, currentOdometerKm: 142_834,
    assignedDepot: "Ahmedabad Hub",
    lastMaintenanceDate: "2024-06-01", nextMaintenanceDueKm: 150_000,
  },
  {
    id: "v2", registrationNumber: "DL-03-BB-5678",
    model: "Ashok Leyland 3118", type: "TRUCK",
    capacityKg: 12000, currentOdometerKm: 98_240,
    assignedDepot: "Delhi Hub",
    lastMaintenanceDate: "2024-05-18", nextMaintenanceDueKm: 105_000,
  },
  {
    id: "v3", registrationNumber: "MH-12-CC-9012",
    model: "Mahindra Supro Cargo", type: "VAN",
    capacityKg: 1200, currentOdometerKm: 67_430,
    assignedDepot: "Pune Depot",
    lastMaintenanceDate: "2024-07-02", nextMaintenanceDueKm: 75_000,
  },
  {
    id: "v4", registrationNumber: "KA-05-DD-3456",
    model: "Maruti Eeco Cargo", type: "MINI",
    capacityKg: 600, currentOdometerKm: 34_120,
    assignedDepot: "Bangalore Depot",
    lastMaintenanceDate: "2024-06-22", nextMaintenanceDueKm: 40_000,
  },
];

// ─── Demo Trips ───────────────────────────────────────────────────────────────

export const DEMO_TRIPS: ActiveTrip[] = [
  {
    id: "trip-1", tripCode: "TRP-2024-001", status: "ON_TRIP",
    driver: DRIVERS[0], vehicle: VEHICLES[0],
    source: "Ahmedabad Depot", destination: "Mumbai Warehouse",
    sourceCoords: [72.5714, 23.0225], destinationCoords: [72.8777, 19.076],
    distanceKm: 531, etaHours: 8,
    dispatchedAt: NOW - 1.5 * HOUR_MS,
    cargoWeightKg: 4200, cargoDescription: "Auto parts — engine components",
    supervisorName: "Vikram Patel", dispatchNotes: "Priority delivery. Handle with care.",
  },
  {
    id: "trip-2", tripCode: "TRP-2024-002", status: "ON_TRIP",
    driver: DRIVERS[1], vehicle: VEHICLES[1],
    source: "Delhi Hub", destination: "Jaipur Warehouse",
    sourceCoords: [77.209, 28.6139], destinationCoords: [75.7873, 26.9124],
    distanceKm: 281, etaHours: 4.5,
    dispatchedAt: NOW - 0.8 * HOUR_MS,
    cargoWeightKg: 2800, cargoDescription: "Textile goods — packaged boxes",
    supervisorName: "Arjun Singh", dispatchNotes: "Standard route. No special handling.",
  },
  {
    id: "trip-3", tripCode: "TRP-2024-003", status: "ON_TRIP",
    driver: DRIVERS[2], vehicle: VEHICLES[2],
    source: "Pune Depot", destination: "Nashik Hub",
    sourceCoords: [73.8567, 18.5204], destinationCoords: [73.7898, 19.9975],
    distanceKm: 210, etaHours: 3.5,
    dispatchedAt: NOW - 2 * HOUR_MS,
    cargoWeightKg: 900, cargoDescription: "Electronics — fragile",
    supervisorName: "Meena Joshi", dispatchNotes: "Avoid NH-160 during peak hours.",
  },
  {
    id: "trip-4", tripCode: "TRP-2024-004", status: "ON_TRIP",
    driver: DRIVERS[3], vehicle: VEHICLES[3],
    source: "Bangalore Depot", destination: "Mysore Hub",
    sourceCoords: [77.5946, 12.9716], destinationCoords: [76.6394, 12.2958],
    distanceKm: 145, etaHours: 2.5,
    dispatchedAt: NOW - 0.5 * HOUR_MS,
    cargoWeightKg: 450, cargoDescription: "Fresh produce — temperature sensitive",
    supervisorName: "Deepa Rao", dispatchNotes: "Refrigerated cargo. Deliver before 18:00.",
  },
];

// ─── Route geometry cache (in-memory, session-scoped) ─────────────────────────

const routeCache: Record<string, RouteGeometry> = {};

// ─── Pure math helpers ────────────────────────────────────────────────────────

function haversineMeters(p1: [number, number], p2: [number, number]): number {
  const R = 6_371_000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(p2[1] - p1[1]);
  const dLng = rad(p2[0] - p1[0]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(p1[1])) * Math.cos(rad(p2[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearing(p1: [number, number], p2: [number, number]): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLng = rad(p2[0] - p1[0]);
  const y = Math.sin(dLng) * Math.cos(rad(p2[1]));
  const x =
    Math.cos(rad(p1[1])) * Math.sin(rad(p2[1])) -
    Math.sin(rad(p1[1])) * Math.cos(rad(p2[1])) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function lerp(p1: [number, number], p2: [number, number], t: number): [number, number] {
  return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
}

function positionAtDistance(
  coords: [number, number][],
  targetMeters: number
): { pos: [number, number]; heading: number } {
  let accumulated = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const seg = haversineMeters(coords[i], coords[i + 1]);
    if (accumulated + seg >= targetMeters) {
      const t = (targetMeters - accumulated) / seg;
      return { pos: lerp(coords[i], coords[i + 1], t), heading: bearing(coords[i], coords[i + 1]) };
    }
    accumulated += seg;
  }
  const last = coords[coords.length - 1];
  return { pos: last, heading: 0 };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const SimulationService = {
  /** Future: GET /api/trips?status=ON_TRIP */
  getActiveTrips(): ActiveTrip[] {
    return DEMO_TRIPS;
  },

  /** Future: GET /api/trips/:id */
  getTripById(id: string): ActiveTrip | undefined {
    return DEMO_TRIPS.find((t) => t.id === id);
  },

  /** Future: GET /api/vehicles */
  getVehicles(): VehicleInfo[] {
    return VEHICLES;
  },

  /** Future: GET /api/drivers */
  getDrivers(): DriverInfo[] {
    return DRIVERS;
  },

  /** Future: POST /api/trips/:id/route → proxies to OSRM */
  async fetchRoute(
    tripId: string,
    source: [number, number],
    dest: [number, number]
  ): Promise<RouteGeometry> {
    if (routeCache[tripId]) return routeCache[tripId];

    const url = `${OSRM_BASE}/route/v1/driving/${source[0]},${source[1]};${dest[0]},${dest[1]}?overview=full&geometries=geojson`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === "Ok" && data.routes?.length > 0) {
        const r = data.routes[0];
        const geo: RouteGeometry = {
          coordinates: r.geometry.coordinates,
          distanceMeters: r.distance,
          durationSeconds: r.duration,
        };
        routeCache[tripId] = geo;
        return geo;
      }
    } catch (e) {
      console.warn("[SimulationService] OSRM unavailable, falling back to straight line:", e);
    }

    const fallback: RouteGeometry = {
      coordinates: [source, dest],
      distanceMeters: haversineMeters(source, dest),
      durationSeconds: (haversineMeters(source, dest) / 1000 / 60) * 3600,
    };
    routeCache[tripId] = fallback;
    return fallback;
  },

  /** Future: GET /api/trips/:id/telemetry */
  computeLiveState(trip: ActiveTrip, route: RouteGeometry | null): LiveTripState {
    const elapsedMs = Date.now() - trip.dispatchedAt;
    const totalMs = trip.etaHours * HOUR_MS;
    const progress = Math.min(1, elapsedMs / totalMs);

    const totalMeters = route ? route.distanceMeters : trip.distanceKm * 1000;
    const distanceTravelled = totalMeters * progress;

    let pos: [number, number] = trip.sourceCoords;
    let head = 0;

    if (route && route.coordinates.length >= 2) {
      const r = positionAtDistance(route.coordinates, distanceTravelled);
      pos = r.pos;
      head = r.heading;
    }

    const speedKmh =
      progress < 1 ? Math.round((totalMeters / (totalMs / 1000)) * 3.6) : 0;
    const distanceRemainingKm =
      Math.round(((1 - progress) * totalMeters) / 100) / 10;
    const etaMinutes = Math.round((distanceRemainingKm / Math.max(speedKmh, 1)) * 60);

    return {
      trip,
      currentCoords: pos,
      heading: head,
      speedKmh,
      distanceTravelledKm: Math.round((distanceTravelled / 1000) * 10) / 10,
      distanceRemainingKm,
      etaMinutes,
      progressPercent: Math.round(progress * 100),
      route,
      lastUpdated: Date.now(),
    };
  },

  /** Subscribe to a trip's live state. Returns unsubscribe fn. */
  subscribe(
    tripId: string,
    onUpdate: (state: LiveTripState) => void,
    intervalMs = 1000
  ): () => void {
    const trip = this.getTripById(tripId);
    if (!trip) return () => {};

    let route: RouteGeometry | null = routeCache[tripId] ?? null;

    // Kick off OSRM route fetch (async)
    this.fetchRoute(tripId, trip.sourceCoords, trip.destinationCoords).then((r) => {
      route = r;
    });

    const tick = () => onUpdate(this.computeLiveState(trip, route));
    tick();
    const timer = setInterval(tick, intervalMs);
    return () => clearInterval(timer);
  },
};
