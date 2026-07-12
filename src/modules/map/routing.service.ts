import { RouteGeometry } from "@/types/route";

/**
 * Routing Service Abstraction.
 * Currently uses OSRM (Open Source Routing Machine) public API.
 * This can be seamlessly swapped to OpenRouteService, Mapbox, or Google Maps later.
 */
export const RoutingService = {
  /**
   * Fetches a route between two coordinates.
   * @param source - [lng, lat]
   * @param destination - [lng, lat]
   * @returns RouteGeometry containing the polyline coordinates, distance, and duration
   */
  async getRoute(source: [number, number], destination: [number, number]): Promise<RouteGeometry> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${source[0]},${source[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch route from OSRM");
      }

      const data = await response.json();
      
      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("No route found");
      }

      const route = data.routes[0];
      
      return {
        coordinates: route.geometry.coordinates as [number, number][],
        distanceMeters: route.distance,
        durationSeconds: route.duration,
      };
    } catch (error) {
      console.error("RoutingService error:", error);
      // Fallback: draw a straight line if API fails
      return {
        coordinates: [source, destination],
        distanceMeters: 0,
        durationSeconds: 0,
      };
    }
  },
};
