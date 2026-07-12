"use client";

/**
 * OperationsMapView
 *
 * Cesium-only map. No Mapbox, Leaflet, or Google Maps.
 * All route geometry comes from OSRM via SimulationService.fetchRoute().
 *
 * Route colour scheme:
 *   Grey dashed   → Full planned route (lowest z)
 *   Green solid   → Traveled portion
 *   Blue solid    → Remaining portion (thicker, most prominent)
 *   Green circle  → Source depot
 *   Red circle    → Destination
 *   Blue truck    → Vehicle (rotates with heading)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import MapToolbar from "./MapToolbar";
import MapLegend from "./MapLegend";
import { LiveTripState } from "@/types/tracking";
import { Depot } from "@/types/map";

// CesiumViewer still lives in /components/operations — it's a low-level primitive
const CesiumViewerBase = dynamic(
  () => import("@/components/operations/CesiumViewer"),
  { ssr: false }
);

interface OperationsMapViewProps {
  liveStates: LiveTripState[];
  depots: Depot[];
  selectedTripId: string | null;
  onSelectTrip: (id: string | null) => void;
}

// ─── SVG helpers ─────────────────────────────────────────────────────────────

function truckSvg(color: string, selected: boolean): string {
  const ring = selected
    ? `<circle cx="18" cy="18" r="17" fill="none" stroke="white" stroke-width="2.5"/>`
    : "";
  // Arrow-style truck pointing "up" (north) — will be rotated by Cesium
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16" fill="${color}" fill-opacity="0.93"/>
    ${ring}
    <!-- Arrow pointing up = vehicle heading -->
    <polygon points="18,6 24,26 18,22 12,26" fill="white" fill-opacity="0.95"/>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function dotSvg(fill: string, size: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${fill}" stroke="white" stroke-width="2"/>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function depotSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="12" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    <rect x="8" y="13" width="12" height="8" fill="#94a3b8"/>
    <polygon points="6,14 14,8 22,14" fill="#cbd5e1"/>
    <rect x="11" y="17" width="6" height="4" fill="#1e293b"/>
  </svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

const STATUS_COLOR: Record<string, string> = {
  ON_TRIP: "#3b82f6",
  AVAILABLE: "#10b981",
  IN_SHOP: "#f59e0b",
  RETIRED: "#ef4444",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OperationsMapView({
  liveStates, depots, selectedTripId, onSelectTrip,
}: OperationsMapViewProps) {
  const viewerRef = useRef<any>(null);
  const clickHandlerRef = useRef<any>(null);
  const depotsAddedRef = useRef(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // ── Viewer ready ──────────────────────────────────────────────────────────
  const handleReady = useCallback(
    (viewer: any) => {
      viewerRef.current = viewer;

      // Add depot markers
      if (!depotsAddedRef.current) {
        const Cesium = window.Cesium;
        depots.forEach((d) => {
          viewer.entities.add({
            id: `depot-${d.id}`,
            position: Cesium.Cartesian3.fromDegrees(d.location.lng, d.location.lat, 0),
            billboard: {
              image: depotSvg(), width: 28, height: 28,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
              text: d.name, font: "10px Inter, sans-serif",
              fillColor: Cesium.Color.fromCssColorString("#94a3b8"),
              outlineColor: Cesium.Color.BLACK, outlineWidth: 2,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              pixelOffset: new Cesium.Cartesian2(0, -34),
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
          });
        });
        depotsAddedRef.current = true;
      }

      // Click handler
      setupClickHandler(viewer);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [depots]
  );

  function setupClickHandler(viewer: any) {
    clickHandlerRef.current?.destroy();
    const Cesium = window.Cesium;
    const h = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    h.setInputAction((evt: any) => {
      const picked = viewer.scene.pick(evt.position);
      if (Cesium.defined(picked) && picked.id?.id) {
        const eid: string = picked.id.id;
        if (eid.startsWith("vehicle-")) { onSelectTrip(eid.replace("vehicle-", "")); return; }
      }
      onSelectTrip(null);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    clickHandlerRef.current = h;
  }

  // ── Sync live states → Cesium entities ───────────────────────────────────
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const Cesium = window.Cesium;

    liveStates.forEach((state) => {
      const { trip, currentCoords, heading, progressPercent, route } = state;
      const isSelected = trip.id === selectedTripId;
      const color = STATUS_COLOR[trip.status] ?? "#6b7280";

      // ── Vehicle billboard ────────────────────────────────────────────────
      const eid = `vehicle-${trip.id}`;
      const pos = Cesium.Cartesian3.fromDegrees(currentCoords[0], currentCoords[1], 300);
      // Heading: Cesium billboard rotation is CCW from +X axis
      // Convert: north=0° clockwise → Cesium needs radians CCW from east
      const rotRad = -Cesium.Math.toRadians(heading);

      const existingVeh = viewer.entities.getById(eid);
      if (existingVeh) {
        existingVeh.position = pos;
        existingVeh.billboard.image = truckSvg(isSelected ? "#6366f1" : color, isSelected);
        existingVeh.billboard.rotation = rotRad;
        existingVeh.billboard.width  = isSelected ? 40 : 36;
        existingVeh.billboard.height = isSelected ? 40 : 36;
      } else {
        viewer.entities.add({
          id: eid,
          position: pos,
          billboard: {
            image: truckSvg(color, false),
            width: 36, height: 36,
            rotation: rotRad,
            alignedAxis: Cesium.Cartesian3.UNIT_Z,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: trip.vehicle.registrationNumber,
            font: "bold 11px Inter, sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -26),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
      }

      // ── Route polylines ──────────────────────────────────────────────────
      if (route && route.coordinates.length >= 2) {
        const splitIdx = Math.max(1, Math.floor((progressPercent / 100) * route.coordinates.length));
        const traveledCoords = route.coordinates.slice(0, splitIdx + 1) as [number, number][];
        const remainCoords   = route.coordinates.slice(splitIdx)        as [number, number][];

        const toC3 = (coords: [number, number][], alt: number) =>
          coords.map(([lng, lat]) => Cesium.Cartesian3.fromDegrees(lng, lat, alt));

        // 1. Full planned route — grey dashed (lowest)
        const fullId = `route-full-${trip.id}`;
        if (!viewer.entities.getById(fullId)) {
          viewer.entities.add({
            id: fullId,
            polyline: {
              positions: toC3(route.coordinates as [number, number][], 20),
              width: 2,
              material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.fromCssColorString("#374151"),
                dashLength: 12,
              }),
              clampToGround: true,
            },
          });
        }

        // 2. Completed — green solid
        if (traveledCoords.length >= 2) {
          const tId = `route-traveled-${trip.id}`;
          const tPos = toC3(traveledCoords, 30);
          const eT = viewer.entities.getById(tId);
          if (eT) eT.polyline.positions = tPos;
          else viewer.entities.add({
            id: tId,
            polyline: { positions: tPos, width: 5, material: Cesium.Color.fromCssColorString("#10b981"), clampToGround: true },
          });
        }

        // 3. Remaining — blue thick
        if (remainCoords.length >= 2) {
          const rId = `route-remaining-${trip.id}`;
          const rPos = toC3(remainCoords, 40);
          const eR = viewer.entities.getById(rId);
          if (eR) eR.polyline.positions = rPos;
          else viewer.entities.add({
            id: rId,
            polyline: { positions: rPos, width: 8, material: Cesium.Color.fromCssColorString("#3b82f6"), clampToGround: true },
          });
        }

        // 4. Source dot (green) — only once
        const srcId = `src-${trip.id}`;
        if (!viewer.entities.getById(srcId)) {
          viewer.entities.add({
            id: srcId,
            position: Cesium.Cartesian3.fromDegrees(trip.sourceCoords[0], trip.sourceCoords[1], 50),
            billboard: {
              image: dotSvg("#10b981", 20), width: 20, height: 20,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
          });
        }

        // 5. Destination dot (red) — only once
        const dstId = `dst-${trip.id}`;
        if (!viewer.entities.getById(dstId)) {
          viewer.entities.add({
            id: dstId,
            position: Cesium.Cartesian3.fromDegrees(trip.destinationCoords[0], trip.destinationCoords[1], 50),
            billboard: {
              image: dotSvg("#ef4444", 20), width: 20, height: 20,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
          });
        }
      }
    });

    // Camera follow
    if (isFollowing && selectedTripId) {
      const entity = viewer.entities.getById(`vehicle-${selectedTripId}`);
      if (entity) viewer.trackedEntity = entity;
    }
  });

  // ── Camera controls ───────────────────────────────────────────────────────

  function flyToIndia() {
    const v = viewerRef.current; if (!v) return;
    v.trackedEntity = undefined; setIsFollowing(false);
    v.camera.flyTo({ destination: window.Cesium.Cartesian3.fromDegrees(78.9629, 22.5937, 3_600_000), duration: 1.5 });
  }

  function zoomIn() {
    const v = viewerRef.current; if (!v) return;
    const cam = v.camera;
    cam.zoomIn(cam.positionCartographic.height * 0.4);
  }

  function zoomOut() {
    const v = viewerRef.current; if (!v) return;
    const cam = v.camera;
    cam.zoomOut(cam.positionCartographic.height * 0.4);
  }

  function flyToVehicle() {
    const v = viewerRef.current; if (!v || !selectedTripId) return;
    const state = liveStates.find((s) => s.trip.id === selectedTripId);
    if (!state) return;
    v.trackedEntity = undefined; setIsFollowing(false);
    v.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(state.currentCoords[0], state.currentCoords[1], 60_000),
      duration: 1.2,
    });
  }

  function toggleFollow() {
    const v = viewerRef.current; if (!v) return;
    if (isFollowing) {
      v.trackedEntity = undefined;
      setIsFollowing(false);
    } else if (selectedTripId) {
      const entity = v.entities.getById(`vehicle-${selectedTripId}`);
      if (entity) { v.trackedEntity = entity; setIsFollowing(true); }
    }
  }

  function resetCamera() {
    const v = viewerRef.current; if (!v) return;
    v.trackedEntity = undefined; setIsFollowing(false);
    v.camera.flyHome(1.0);
  }

  useEffect(() => () => clickHandlerRef.current?.destroy(), []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapToolbar
        hasSelection={!!selectedTripId}
        isFollowing={isFollowing}
        onFlyToIndia={flyToIndia}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFlyToVehicle={flyToVehicle}
        onToggleFollow={toggleFollow}
        onReset={resetCamera}
      />
      <MapLegend />
      <CesiumViewerBase onReady={handleReady} />
    </div>
  );
}
