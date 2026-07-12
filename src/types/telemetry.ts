export type TelemetryData = {
  vehicleId: string;
  latitude: number;
  longitude: number;
  heading: number; // 0-360 degrees
  speed: number; // km/h
  fuelRemaining: number; // liters or percentage
  engineStatus: 'ON' | 'OFF' | 'IDLE';
  timestamp: string; // ISO 8601
};

export type FuelAnalytics = {
  vehicleId: string;
  fuelUsedLiters: number;
  fuelRemainingLiters: number;
  fuelEfficiency: number; // km per liter
  idleTimeMinutes: number;
  averageSpeedKmh: number;
  estimatedRemainingRangeKm: number;
};
