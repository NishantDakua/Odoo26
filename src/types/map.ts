export type CesiumCoordinate = {
  lng: number;
  lat: number;
  alt?: number;
};

export type Depot = {
  id: string;
  name: string;
  location: CesiumCoordinate;
};

export type VehicleMapState = {
  id: string;
  registrationNumber: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';
  type: string;
  location: CesiumCoordinate;
  heading: number;
  speed: number;
  fuelRemaining: number;
  tripId?: string;
};
