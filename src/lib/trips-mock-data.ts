export type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";
export type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

export type MockVehicle = {
  id: string;
  label: string;
  capacityKg: number;
  status: VehicleStatus;
};

export type MockDriver = {
  id: string;
  label: string;
  status: DriverStatus;
  licenseValid: boolean;
};

export type MockTrip = {
  id: string;
  tripCode: string;
  source: string;
  destination: string;
  vehicleId: string;
  vehicleLabel: string;
  driverId: string;
  driverLabel: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  status: TripStatus;
  eta: string;
  // populated when completed
  finalOdometer?: number;
  fuelConsumedL?: number;
  revenueInr?: number;
};

export const mockVehicles: MockVehicle[] = [
  { id: "v1", label: "VAN-01", capacityKg: 800, status: "AVAILABLE" },
  { id: "v2", label: "TRUCK-02", capacityKg: 5000, status: "AVAILABLE" },
  { id: "v3", label: "MINI-03", capacityKg: 400, status: "AVAILABLE" },
  { id: "v4", label: "TRUCK-04", capacityKg: 8000, status: "AVAILABLE" },
  { id: "v5", label: "VAN-05", capacityKg: 500, status: "ON_TRIP" },
  { id: "v6", label: "MINI-06", capacityKg: 350, status: "IN_SHOP" },
];

export const mockDrivers: MockDriver[] = [
  { id: "d1", label: "Aarav Shah", status: "AVAILABLE", licenseValid: true },
  { id: "d2", label: "Rohan Mehta", status: "AVAILABLE", licenseValid: true },
  { id: "d3", label: "Vikram Joshi", status: "AVAILABLE", licenseValid: true },
  { id: "d4", label: "Neeraj Kapoor", status: "ON_TRIP", licenseValid: true },
  { id: "d5", label: "Sandeep Patel", status: "AVAILABLE", licenseValid: false },
  { id: "d6", label: "Priya Sharma", status: "OFF_DUTY", licenseValid: true },
];

export const initialTrips: MockTrip[] = [
  {
    id: "t1",
    tripCode: "TR001",
    source: "Mumbai",
    destination: "Pune",
    vehicleId: "v5",
    vehicleLabel: "VAN-05",
    driverId: "d4",
    driverLabel: "Neeraj Kapoor",
    cargoWeightKg: 480,
    plannedDistanceKm: 150,
    status: "DISPATCHED",
    eta: "2h 15m",
  },
  {
    id: "t2",
    tripCode: "TR002",
    source: "Delhi",
    destination: "Agra",
    vehicleId: "v2",
    vehicleLabel: "TRUCK-02",
    driverId: "d2",
    driverLabel: "Rohan Mehta",
    cargoWeightKg: 3200,
    plannedDistanceKm: 210,
    status: "COMPLETED",
    eta: "Arrived",
    finalOdometer: 48210,
    fuelConsumedL: 38,
    revenueInr: 12500,
  },
  {
    id: "t3",
    tripCode: "TR003",
    source: "Chennai",
    destination: "Bangalore",
    vehicleId: "v1",
    vehicleLabel: "VAN-01",
    driverId: "d1",
    driverLabel: "Aarav Shah",
    cargoWeightKg: 620,
    plannedDistanceKm: 350,
    status: "DRAFT",
    eta: "Awaiting dispatch",
  },
  {
    id: "t4",
    tripCode: "TR004",
    source: "Kolkata",
    destination: "Bhubaneswar",
    vehicleId: "v4",
    vehicleLabel: "TRUCK-04",
    driverId: "d3",
    driverLabel: "Vikram Joshi",
    cargoWeightKg: 7100,
    plannedDistanceKm: 440,
    status: "CANCELLED",
    eta: "Cancelled",
  },
];
