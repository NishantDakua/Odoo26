import { CesiumCoordinate } from "@/types/map";

export const AnimationService = {
  /**
   * Interpolates between two coordinates given a progress fraction (0 to 1).
   */
  interpolate(start: CesiumCoordinate, end: CesiumCoordinate, fraction: number): CesiumCoordinate {
    return {
      lng: start.lng + (end.lng - start.lng) * fraction,
      lat: start.lat + (end.lat - start.lat) * fraction,
    };
  },
  
  /**
   * Calculates the heading (in degrees) from start to end coordinate.
   */
  calculateHeading(start: CesiumCoordinate, end: CesiumCoordinate): number {
    const dy = end.lat - start.lat;
    const dx = Math.cos(Math.PI / 180 * start.lat) * (end.lng - start.lng);
    const angle = Math.atan2(dy, dx);
    let heading = (angle * 180) / Math.PI;
    // Map to 0-360 where 0 is North
    heading = (90 - heading) % 360;
    if (heading < 0) heading += 360;
    return heading;
  }
};
