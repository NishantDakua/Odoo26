/**
 * Service Layer — Trip, Driver, Vehicle, Telemetry, Route, Operations
 *
 * These thin wrappers isolate the UI from the data source.
 * Today: static simulation. Tomorrow: real REST/WebSocket endpoints.
 * Only this file changes — zero UI changes required.
 */

import { SimulationService } from "@/modules/map/simulation.service";
import { ActiveTrip, LiveTripState, DriverInfo, VehicleInfo } from "@/types/tracking";
import { RouteGeometry } from "@/types/route";
import { Depot } from "@/types/map";

// ─── Static depots ────────────────────────────────────────────────────────────

const DEPOTS: Depot[] = [
  { id: "d1", name: "Ahmedabad Hub",   location: { lng: 72.5714, lat: 23.0225 } },
  { id: "d2", name: "Mumbai Port",     location: { lng: 72.8777, lat: 19.0760 } },
  { id: "d3", name: "Delhi Hub",       location: { lng: 77.2090, lat: 28.6139 } },
  { id: "d4", name: "Pune Depot",      location: { lng: 73.8567, lat: 18.5204 } },
  { id: "d5", name: "Bangalore Depot", location: { lng: 77.5946, lat: 12.9716 } },
  { id: "d6", name: "Jaipur Hub",      location: { lng: 75.7873, lat: 26.9124 } },
  { id: "d7", name: "Nashik Hub",      location: { lng: 73.7898, lat: 19.9975 } },
  { id: "d8", name: "Mysore Hub",      location: { lng: 76.6394, lat: 12.2958 } },
];

// ─── Trip Service ─────────────────────────────────────────────────────────────
/** Future: fetch('/api/trips') */
export const TripService = {
  getActiveTrips(): ActiveTrip[] {
    return SimulationService.getActiveTrips();
  },
  getTripById(id: string): ActiveTrip | undefined {
    return SimulationService.getTripById(id);
  },
  subscribe(
    tripId: string,
    onUpdate: (state: LiveTripState) => void,
    intervalMs = 1000
  ): () => void {
    return SimulationService.subscribe(tripId, onUpdate, intervalMs);
  },
};

// ─── Driver Service ───────────────────────────────────────────────────────────
/** Future: fetch('/api/drivers') */
export const DriverService = {
  getDrivers(): DriverInfo[] {
    return SimulationService.getDrivers();
  },
  getDriverById(id: string): DriverInfo | undefined {
    return SimulationService.getDrivers().find((d) => d.id === id);
  },
  getAvailableDrivers(): DriverInfo[] {
    return SimulationService.getDrivers().filter((d) => d.status === "AVAILABLE");
  },
};

// ─── Vehicle Service ──────────────────────────────────────────────────────────
/** Future: fetch('/api/vehicles') */
export const VehicleService = {
  getVehicles(): VehicleInfo[] {
    return SimulationService.getVehicles();
  },
  getVehicleById(id: string): VehicleInfo | undefined {
    return SimulationService.getVehicles().find((v) => v.id === id);
  },
  getAvailableVehicles(): VehicleInfo[] {
    return SimulationService.getVehicles().filter((v) => v.id !== "v1"); // mock
  },
};

// ─── Telemetry Service ────────────────────────────────────────────────────────
/** Future: WebSocket / SSE / GET /api/trips/:id/telemetry */
export const TelemetryService = {
  subscribe(
    tripId: string,
    onUpdate: (state: LiveTripState) => void,
    intervalMs = 1000
  ): () => void {
    return TripService.subscribe(tripId, onUpdate, intervalMs);
  },
};

// ─── Route Service ────────────────────────────────────────────────────────────
/** Future: POST /api/trips/:id/route → OSRM proxy */
export const RouteService = {
  async fetchRoute(
    tripId: string,
    source: [number, number],
    dest: [number, number]
  ): Promise<RouteGeometry> {
    return SimulationService.fetchRoute(tripId, source, dest);
  },
};

// ─── Operations Service ───────────────────────────────────────────────────────
/** Aggregates data for the Operations dashboard KPIs */
export const OperationsService = {
  getDepots(): Depot[] {
    return DEPOTS;
  },
  getKpis(trips: ActiveTrip[]) {
    return {
      activeTrips: trips.filter((t) => t.status === "ON_TRIP").length,
      vehiclesOnline: trips.filter((t) => t.status === "ON_TRIP").length,
      driversAvailable: SimulationService.getDrivers().filter((d) => d.status === "AVAILABLE").length,
      completedToday: 3,   // mock — future: GET /api/trips?completedDate=today
      delayedTrips: 1,     // mock — future: derived from ETA vs schedule
    };
  },
};
