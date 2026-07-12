import { z } from "zod";

export const createTripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  cargoWeightKg: z.number().positive("Cargo weight must be positive"),
  plannedDistanceKm: z.number().positive("Planned distance must be positive"),
  vehicleId: z.string().cuid().optional(),
  driverId: z.string().cuid().optional(),
});

export const dispatchTripSchema = z.object({
  vehicleId: z.string().cuid().optional(),
  driverId: z.string().cuid().optional(),
});

export const completeTripSchema = z.object({
  finalOdometerKm: z.number().nonnegative(),
  fuelConsumedLiters: z.number().positive(),
  revenue: z.number().nonnegative().optional(),
});

// cancel has no body, but define an empty schema so route handling is consistent
export const cancelTripSchema = z.object({}).strict();
