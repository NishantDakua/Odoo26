import { RouteGeometry } from "./route";

export type TripStatus = "ON_TRIP" | "DRAFT" | "COMPLETED" | "CANCELLED";
export type VehicleType = "TRUCK" | "VAN" | "MINI" | "OTHER";
export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";

// ─── Driver ───────────────────────────────────────────────────────────────────

export type DriverInfo = {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  licenseCategory: string;
  licenseNumber: string;
  licenseExpiry: string;         // ISO date string
  safetyScore: number;           // 0-100
  experienceYears: number;
  status: DriverStatus;
  assignedDepot: string;
};

// ─── Vehicle ─────────────────────────────────────────────────────────────────

export type VehicleInfo = {
  id: string;
  registrationNumber: string;
  model: string;
  type: VehicleType;
  capacityKg: number;
  currentOdometerKm: number;
  assignedDepot: string;
  lastMaintenanceDate: string;    // ISO date string
  nextMaintenanceDueKm: number;
};

// ─── Active Trip (enriched) ───────────────────────────────────────────────────

export type ActiveTrip = {
  id: string;
  tripCode: string;
  status: TripStatus;

  // Embedded driver snapshot (from DB join or future API include)
  driver: DriverInfo;

  // Embedded vehicle snapshot
  vehicle: VehicleInfo;

  // Route info
  source: string;
  destination: string;
  sourceCoords: [number, number];      // [lng, lat]
  destinationCoords: [number, number];
  distanceKm: number;
  etaHours: number;
  dispatchedAt: number;                // Unix ms

  // Cargo / ops
  cargoWeightKg: number;
  cargoDescription: string;
  supervisorName: string;
  dispatchNotes: string;
};

// ─── Live Telemetry ───────────────────────────────────────────────────────────

export type LiveTripState = {
  trip: ActiveTrip;
  currentCoords: [number, number];     // [lng, lat]
  heading: number;                     // degrees, clockwise from north
  speedKmh: number;
  distanceTravelledKm: number;
  distanceRemainingKm: number;
  etaMinutes: number;
  progressPercent: number;
  route: RouteGeometry | null;
  lastUpdated: number;                 // Unix ms
};
