export const MapService = {
  /**
   * Defines standard configuration for the CesiumViewer.
   * Cesium access tokens should be configured here.
   */
  getDefaultConfig() {
    return {
      animation: false,
      timeline: false,
      infoBox: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      homeButton: false,
      baseLayerPicker: false,
      geocoder: false,
      sceneModePicker: false,
      fullscreenButton: false,
      creditContainer: document.createElement("div"), // Hide credits dynamically
    };
  }
};
