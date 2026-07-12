"use client";

import { useEffect, useRef, useState } from "react";

// Extend window with Cesium globals
declare global {
  interface Window {
    Cesium: any;
    CESIUM_BASE_URL: string;
  }
}

export interface CesiumViewerHandle {
  viewer: any; // The raw Cesium.Viewer instance
}

interface CesiumViewerProps {
  /** Called once when the Viewer is ready. Use to add entities, set camera, etc. */
  onReady: (viewer: any) => void;
}

const CDN_VERSION = "1.116";
const CDN_BASE = `https://cesium.com/downloads/cesiumjs/releases/${CDN_VERSION}/Build/Cesium/`;

// ── CDN loading (idempotent, safe to call multiple times) ──────────────────
let cesiumLoadPromise: Promise<void> | null = null;

function loadCesiumSDK(): Promise<void> {
  if (cesiumLoadPromise) return cesiumLoadPromise;

  cesiumLoadPromise = new Promise<void>((resolve, reject) => {
    // Already loaded in a previous render
    if (typeof window !== "undefined" && window.Cesium) {
      resolve();
      return;
    }

    // Set base URL before loading the script
    window.CESIUM_BASE_URL = CDN_BASE;

    // Load CSS once
    const cssHref = `${CDN_BASE}Widgets/widgets.css`;
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      document.head.appendChild(link);
    }

    // Load JS
    const script = document.createElement("script");
    script.src = `${CDN_BASE}Cesium.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load CesiumJS from CDN"));
    document.head.appendChild(script);
  });

  return cesiumLoadPromise;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CesiumViewer({ onReady }: CesiumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "no-token" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Guard against double-mount in React strict mode
    if (viewerRef.current) return;

    let cancelled = false;

    async function init() {
      try {
        // ── 1. Load Cesium SDK from CDN ──────────────────────────────────
        await loadCesiumSDK();
        if (cancelled) return;

        const Cesium = window.Cesium;

        // ── 2. Token validation ──────────────────────────────────────────
        const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
        if (!token) {
          setPhase("no-token");
          return;
        }

        // CRITICAL: Set token BEFORE creating the Viewer
        Cesium.Ion.defaultAccessToken = token;

        if (!containerRef.current) return;

        // ── 3. Create Viewer ─────────────────────────────────────────────
        // Don't pass imageryProvider or terrainProvider in the constructor.
        // Let Cesium Ion load the defaults (Bing Maps) automatically.
        const creditDiv = document.createElement("div");
        creditDiv.style.display = "none";

        const viewer = new Cesium.Viewer(containerRef.current, {
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
          creditContainer: creditDiv,
          // Let Cesium Ion supply default Bing Maps imagery automatically
          // via the access token — do NOT specify imageryProvider here
          requestRenderMode: false,
        });

        // ── 4. Terrain (async, add after viewer creation) ────────────────
        try {
          const terrain = await Cesium.CesiumTerrainProvider.fromIonAssetId(1);
          if (!cancelled) viewer.terrainProvider = terrain;
        } catch (e) {
          console.warn("[Cesium] World Terrain unavailable, proceeding without:", e);
        }

        if (cancelled) {
          viewer.destroy();
          return;
        }

        // ── 5. Scene configuration ───────────────────────────────────────
        viewer.scene.globe.enableLighting = false;
        viewer.scene.globe.depthTestAgainstTerrain = false;
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#0a0a0a");

        // Enable smooth frame rate
        viewer.scene.requestRenderMode = false;
        viewer.scene.maximumRenderTimeChange = Infinity;

        // ── 6. Fly camera to India ───────────────────────────────────────
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(78.9629, 22.5937, 3_600_000),
          duration: 0,
        });

        viewerRef.current = viewer;
        setPhase("ready");
        onReady(viewer);

      } catch (err: any) {
        if (!cancelled) {
          console.error("[CesiumViewer] Init failed:", err);
          setErrorMsg(err?.message ?? "Unknown error");
          setPhase("error");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // IMPORTANT: The outer div must have an explicit non-zero size.
    // Using position:absolute + inset:0 on the canvas container is the
    // only reliable way to make Cesium fill its parent in Next.js.
    <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "var(--bg)" }}>
      {/* Cesium mounts here */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Overlays — positioned above Cesium */}
      {phase === "loading" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          backgroundColor: "var(--bg)", gap: 12,
        }}>
          <div style={{
            width: 32, height: 32,
            border: "2px solid #3b82f6", borderTopColor: "transparent",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#888", fontSize: 13 }}>Initialising Globe…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {phase === "no-token" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          backgroundColor: "var(--bg)", gap: 12, padding: 32, textAlign: "center",
        }}>
          <div style={{ fontSize: 40 }}>🌍</div>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Cesium Ion Token Required</p>
          <p style={{ color: "#888", fontSize: 13, maxWidth: 320 }}>
            Add your token to <code style={{ color: "#60a5fa" }}>.env</code>:
          </p>
          <code style={{
            padding: "8px 14px", background: "#141414", border: "1px solid #2a2a2a",
            borderRadius: 6, color: "#34d399", fontSize: 12,
          }}>
            NEXT_PUBLIC_CESIUM_ION_TOKEN=eyJ...
          </code>
          <p style={{ color: "#555", fontSize: 11 }}>
            Get a free token at{" "}
            <a href="https://ion.cesium.com" target="_blank" rel="noreferrer"
              style={{ color: "#3b82f6" }}>ion.cesium.com</a>
          </p>
        </div>
      )}

      {phase === "error" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          backgroundColor: "var(--bg)", gap: 8,
        }}>
          <p style={{ color: "#ef4444", fontWeight: 600, fontSize: 14 }}>Globe failed to initialise</p>
          <p style={{ color: "#555", fontSize: 12, maxWidth: 320, textAlign: "center" }}>{errorMsg}</p>
        </div>
      )}
    </div>
  );
}
