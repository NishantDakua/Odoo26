"use client";

/**
 * Operations Page — Fleet Operations Center
 *
 * Layout:
 *   [TOP: Header + KPI Stats]
 *   [LEFT: OperationsSidebar] [CENTER: Cesium Globe] [RIGHT: VehicleDetails]
 *                             [BOTTOM: RouteTimeline]
 *
 * Data flow:
 *   Service Layer (TripService, OperationsService) → UI State
 *
 * All UI components are modular and decoupled from the data source.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import OperationsSidebar from "@/components/operations/OperationsSidebar";
import VehicleDetails from "@/components/operations/VehicleDetails";
import RouteTimeline from "@/components/operations/RouteTimeline";
import OperationsStats from "@/components/operations/OperationsStats";
import { TripService, OperationsService } from "@/services";
import { ActiveTrip, LiveTripState } from "@/types/tracking";

// Dynamic import — CesiumJS only works in the browser
const OperationsMapView = dynamic(
  () => import("@/components/operations/OperationsMapView"),
  { ssr: false }
);

export default function OperationsPage() {
  const [trips] = useState<ActiveTrip[]>(() => TripService.getActiveTrips());
  const [liveStates, setLiveStates] = useState<Record<string, LiveTripState>>({});
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [speedMult, setSpeedMult] = useState(1);

  const unsubsRef = useRef<Record<string, () => void>>({});

  // Fetch KPI stats from service layer
  const kpis = OperationsService.getKpis(trips);
  const depots = OperationsService.getDepots();

  // Subscribe to all trips using the Service Layer
  useEffect(() => {
    Object.values(unsubsRef.current).forEach((u) => u());
    unsubsRef.current = {};

    trips.forEach((trip) => {
      const unsub = TripService.subscribe(
        trip.id,
        (state) => setLiveStates((prev) => ({ ...prev, [trip.id]: state })),
        Math.round(1000 / speedMult)
      );
      unsubsRef.current[trip.id] = unsub;
    });

    return () => {
      Object.values(unsubsRef.current).forEach((u) => u());
    };
  }, [trips, speedMult]);

  const liveStateList = Object.values(liveStates);
  const selectedState = selectedTripId ? liveStates[selectedTripId] ?? null : null;

  return (
    <div className="ops-shell">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--navbar)",
      }}>
        <div>
          <h1 className="page-title" style={{ fontSize: 17, marginBottom: 0 }}>
            Fleet Operations Center
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 2 }}>
            Live Monitoring & Dispatch Control
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Live indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 6,
            backgroundColor: "var(--status-available-bg)", border: "1px solid var(--border)",
            color: "var(--status-available-text)", fontSize: 12,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              backgroundColor: "var(--status-available-text)",
            }} />
            System Live
          </div>
        </div>
      </div>

      {/* ── KPI Stats Bar ──────────────────────────────────────────────── */}
      <OperationsStats {...kpis} />

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT: Fleet List */}
        <OperationsSidebar
          trips={trips}
          liveStates={liveStates}
          selectedTripId={selectedTripId}
          onSelectTrip={setSelectedTripId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* CENTER: Cesium Globe + Bottom Timeline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          {/* Globe fills all available space */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000" }}>
            <OperationsMapView
              liveStates={liveStateList}
              depots={depots}
              selectedTripId={selectedTripId}
              onSelectTrip={setSelectedTripId}
            />
          </div>

          {/* BOTTOM: Timeline */}
          <RouteTimeline
            liveState={selectedState}
            speedMultiplier={speedMult}
            onSpeedChange={setSpeedMult}
          />
        </div>

        {/* RIGHT: Vehicle Details */}
        <VehicleDetails
          liveState={selectedState}
          onClose={() => setSelectedTripId(null)}
        />
      </div>
    </div>
  );
}
