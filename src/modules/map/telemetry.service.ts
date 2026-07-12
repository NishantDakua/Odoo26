import { TelemetryData } from "@/types/telemetry";

/**
 * Polls the backend for live telemetry data.
 * The architecture is designed so this can be seamlessly swapped to WebSockets or MQTT.
 */
export const TelemetryService = {
  /**
   * Subscribe to live updates for a specific trip.
   */
  subscribeToTrip(tripId: string, callback: (data: TelemetryData) => void, intervalMs = 2000) {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch(`/api/map/telemetry?tripId=${tripId}`);
        if (!res.ok) {
          // If the route hasn't been generated yet, or trip is not found
          return;
        }
        const data: TelemetryData = await res.json();
        callback(data);
      } catch (err) {
        console.error("Telemetry fetch failed", err);
      }
    };

    // Initial fetch immediately
    fetchTelemetry();

    // Setup polling
    const timer = setInterval(fetchTelemetry, intervalMs);

    return () => clearInterval(timer);
  }
};
