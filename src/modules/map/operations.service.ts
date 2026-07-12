import { Depot, VehicleMapState } from "@/types/map";

// Hardcoded sample depots for the MVP map
const DEPOTS: Depot[] = [
  { id: "depot-1", name: "Ahmedabad Hub", location: { lng: 72.5714, lat: 23.0225 } },
  { id: "depot-2", name: "Mumbai Port", location: { lng: 72.8777, lat: 19.0760 } },
  { id: "depot-3", name: "Delhi Logistics", location: { lng: 77.2090, lat: 28.6139 } },
  { id: "depot-4", name: "Bangalore Tech Park", location: { lng: 77.5946, lat: 12.9716 } },
];

export const OperationsService = {
  getDepots(): Depot[] {
    return DEPOTS;
  },

  /**
   * Fetches the current state of all vehicles for the map.
   * In a real app, this would poll a live backend or listen to a WebSocket.
   */
  async getVehicleMapStates(): Promise<VehicleMapState[]> {
    try {
      const response = await fetch("/api/vehicles");
      if (!response.ok) return [];
      
      const vehicles = await response.json();
      
      // Map database vehicles to map state, assigning them random initial positions near a depot
      return vehicles.map((v: any, index: number) => {
        const depot = DEPOTS[index % DEPOTS.length];
        // Add slight random offset to prevent overlap
        const lng = depot.location.lng + (Math.random() - 0.5) * 0.1;
        const lat = depot.location.lat + (Math.random() - 0.5) * 0.1;

        return {
          id: v.id,
          registrationNumber: v.registrationNumber,
          status: v.status,
          type: v.type,
          location: { lng, lat },
          heading: Math.random() * 360,
          speed: v.status === 'ON_TRIP' ? Math.floor(Math.random() * 40) + 40 : 0, // 40-80 km/h
          fuelRemaining: Math.floor(Math.random() * 100) + 50,
        };
      });
    } catch (err) {
      console.error("Failed to load map states:", err);
      return [];
    }
  }
};
