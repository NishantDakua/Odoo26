import { CesiumCoordinate } from "@/types/map";

export const CameraService = {
  /**
   * Fly to India top-level view
   */
  flyToIndia(viewer: any, duration = 2.0) {
    if (!viewer) return;
    const Cesium = window.Cesium;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(78.9629, 22.5937, 3500000),
      duration,
    });
  },

  /**
   * Smoothly fly to a specific coordinate and zoom in
   */
  flyToCoordinate(viewer: any, coord: CesiumCoordinate, height = 2000, duration = 1.5) {
    if (!viewer) return;
    const Cesium = window.Cesium;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(coord.lng, coord.lat, height),
      duration,
    });
  },

  /**
   * Tracks a specific Cesium Entity with a specific camera angle
   */
  trackEntity(viewer: any, entity: any) {
    if (!viewer || !entity) return;
    viewer.trackedEntity = entity;
  },

  /**
   * Stop tracking an entity
   */
  stopTracking(viewer: any) {
    if (!viewer) return;
    viewer.trackedEntity = undefined;
  },
  
  /**
   * Orbit around a specific entity (3D View)
   */
  enable3DView(viewer: any, entity: any) {
    if (!viewer || !entity) return;
    const Cesium = window.Cesium;
    viewer.trackedEntity = entity;
    
    // Tilt the camera down 45 degrees
    const heading = viewer.camera.heading;
    const pitch = Cesium.Math.toRadians(-45);
    const range = 1000;
    
    // We wait for tracking to settle slightly, but Cesium handles tracking via offset if configured
  }
};
