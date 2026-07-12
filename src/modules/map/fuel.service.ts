import { FuelAnalytics, TelemetryData } from "@/types/telemetry";

/**
 * Fuel Service Abstraction.
 * In a real-world scenario, this would interface with OBD-II fuel sensors,
 * CAN bus data, or a machine learning predictive model.
 */
export const FuelService = {
  /**
   * Calculates advanced fuel analytics from real-time telemetry.
   */
  calculateAnalytics(telemetry: TelemetryData, initialFuelLiters: number, totalDistanceDrivenKm: number): FuelAnalytics {
    const fuelUsedLiters = initialFuelLiters - telemetry.fuelRemaining;
    const fuelEfficiency = fuelUsedLiters > 0 ? totalDistanceDrivenKm / fuelUsedLiters : 0;
    const estimatedRemainingRangeKm = fuelEfficiency * telemetry.fuelRemaining;

    return {
      vehicleId: telemetry.vehicleId,
      fuelUsedLiters,
      fuelRemainingLiters: telemetry.fuelRemaining,
      fuelEfficiency,
      idleTimeMinutes: 0, // Would be calculated based on engineStatus = 'IDLE' over time
      averageSpeedKmh: telemetry.speed, // Simplified for now
      estimatedRemainingRangeKm,
    };
  }
};
