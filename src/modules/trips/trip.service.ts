import { setVehicleStatus } from "@/lib/vehicle-status-client";
import { setDriverStatus } from "@/lib/driver-status-client";
import {
  findTripById,
  listTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  getVehicleWithStatus,
  getDriverWithStatus,
} from "./trip.repository";
import type {
  CreateTripInput,
  DispatchTripInput,
  CompleteTripInput,
  TripWithRelations,
} from "./trip.types";

class TripError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 400
  ) {
    super(message);
  }
}

export async function listTripsService(filters: Parameters<typeof listTrips>[0]) {
  return listTrips(filters);
}

export async function createTripService(input: CreateTripInput): Promise<TripWithRelations> {
  return createTrip(input);
}

export async function dispatchTripService(
  id: string,
  input: DispatchTripInput,
  dispatchedById: string
): Promise<TripWithRelations> {
  const trip = await findTripById(id);
  if (!trip) throw new TripError("Trip not found", "TRIP_NOT_FOUND", 404);
  if (trip.status !== "DRAFT") {
    throw new TripError(
      `Cannot dispatch a trip with status ${trip.status}`,
      "INVALID_STATUS_TRANSITION"
    );
  }

  const vehicleId = input.vehicleId ?? trip.vehicleId;
  const driverId = input.driverId ?? trip.driverId;

  if (!vehicleId) throw new TripError("Vehicle is required to dispatch", "VEHICLE_NOT_AVAILABLE");
  if (!driverId) throw new TripError("Driver is required to dispatch", "DRIVER_NOT_AVAILABLE");

  const [vehicle, driver] = await Promise.all([
    getVehicleWithStatus(vehicleId),
    getDriverWithStatus(driverId),
  ]);

  if (!vehicle) throw new TripError("Vehicle not found", "VEHICLE_NOT_AVAILABLE", 404);
  if (!driver) throw new TripError("Driver not found", "DRIVER_NOT_AVAILABLE", 404);

  if (vehicle.status !== "AVAILABLE") {
    throw new TripError(
      `Vehicle is not available (current status: ${vehicle.status})`,
      "VEHICLE_NOT_AVAILABLE"
    );
  }

  if (trip.cargoWeightKg > vehicle.maxLoadCapacityKg) {
    throw new TripError(
      `Cargo (${trip.cargoWeightKg} kg) exceeds vehicle capacity (${vehicle.maxLoadCapacityKg} kg)`,
      "CARGO_EXCEEDS_CAPACITY"
    );
  }

  if (driver.status !== "AVAILABLE") {
    throw new TripError(
      `Driver is not available (current status: ${driver.status})`,
      "DRIVER_NOT_AVAILABLE"
    );
  }

  if (new Date(driver.licenseExpiryDate) < new Date()) {
    throw new TripError("Driver's license has expired", "DRIVER_LICENSE_EXPIRED");
  }

  // Update trip first, then fire cross-module status updates in parallel.
  // If one of the external calls fails we log it but don't roll back the trip —
  // the trip record is the source of truth, and vehicle/driver status can be
  // reconciled by a background job. Wrap in try/catch per call so one failure
  // doesn't swallow the other.
  const updated = await dispatchTrip(id, {
    vehicleId,
    driverId,
    dispatchedById,
    startOdometerKm: vehicle.odometerKm,
  });

  await Promise.allSettled([
    setVehicleStatus(vehicleId, "ON_TRIP"),
    setDriverStatus(driverId, "ON_TRIP"),
  ]);

  return updated;
}

export async function completeTripService(
  id: string,
  input: CompleteTripInput
): Promise<TripWithRelations> {
  const trip = await findTripById(id);
  if (!trip) throw new TripError("Trip not found", "TRIP_NOT_FOUND", 404);
  if (trip.status !== "DISPATCHED") {
    throw new TripError(
      `Cannot complete a trip with status ${trip.status}`,
      "INVALID_STATUS_TRANSITION"
    );
  }

  if (trip.startOdometerKm == null) {
    throw new TripError(
      "Trip is missing start odometer — cannot compute actual distance",
      "INVALID_STATUS_TRANSITION"
    );
  }

  const updated = await completeTrip(id, { ...input, startOdometerKm: trip.startOdometerKm });

  if (trip.vehicleId) await setVehicleStatus(trip.vehicleId, "AVAILABLE").catch(console.error);
  if (trip.driverId) await setDriverStatus(trip.driverId, "AVAILABLE").catch(console.error);

  return updated;
}

export async function cancelTripService(id: string): Promise<TripWithRelations> {
  const trip = await findTripById(id);
  if (!trip) throw new TripError("Trip not found", "TRIP_NOT_FOUND", 404);
  if (trip.status !== "DISPATCHED") {
    throw new TripError(
      `Can only cancel a DISPATCHED trip (current status: ${trip.status})`,
      "INVALID_STATUS_TRANSITION"
    );
  }

  const updated = await cancelTrip(id);

  if (trip.vehicleId) await setVehicleStatus(trip.vehicleId, "AVAILABLE").catch(console.error);
  if (trip.driverId) await setDriverStatus(trip.driverId, "AVAILABLE").catch(console.error);

  return updated;
}

export { TripError };
