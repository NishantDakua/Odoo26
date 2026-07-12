import { CesiumCoordinate } from "./map";

export type RouteGeometry = {
  coordinates: [number, number][]; // [lng, lat] format
  distanceMeters: number;
  durationSeconds: number;
};

export type Waypoint = {
  location: CesiumCoordinate;
  name?: string;
  type: 'SOURCE' | 'DESTINATION' | 'CHECKPOINT';
};

export type RoutePlan = {
  tripId: string;
  vehicleId: string;
  geometry: RouteGeometry;
  waypoints: Waypoint[];
};
