import type { Trip, Vehicle, Driver } from "@prisma/client";

export type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

export type TripWithRelations = Trip & {
  vehicle: Pick<Vehicle, "id" | "registrationNumber" | "nameModel" | "type"> | null;
  driver: Pick<Driver, "id" | "name" | "licenseNumber"> | null;
};

export type CreateTripInput = {
  source: string;
  destination: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  vehicleId?: string;
  driverId?: string;
};

export type DispatchTripInput = {
  // vehicleId/driverId can be assigned at dispatch if not set at creation
  vehicleId?: string;
  driverId?: string;
};

export type CompleteTripInput = {
  finalOdometerKm: number;
  fuelConsumedLiters: number;
  revenue?: number;
};

export type TripErrorCode =
  | "TRIP_NOT_FOUND"
  | "INVALID_STATUS_TRANSITION"
  | "CARGO_EXCEEDS_CAPACITY"
  | "VEHICLE_NOT_AVAILABLE"
  | "DRIVER_NOT_AVAILABLE"
  | "DRIVER_LICENSE_EXPIRED"
  | "VALIDATION_ERROR"
  | "INTERNAL_ERROR";

export type ApiError = {
  error: { message: string; code: TripErrorCode };
};
