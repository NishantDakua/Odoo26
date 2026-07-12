"use client";

import { useState, useEffect, useCallback } from "react";
import MaintenanceForm from "@/components/maintenance/MaintenanceForm";
import MaintenanceTable from "@/components/maintenance/MaintenanceTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function MaintenancePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [logToClose, setLogToClose] = useState<any | null>(null);
  const [closeError, setCloseError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    const res = await fetch("/api/maintenance");
    if (res.ok) setLogs(await res.json());
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSaveMaintenance = async (data: any) => {
    setFormError(null);
    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      setFormError(err.error || "Failed to save maintenance record");
      return;
    }
    fetchLogs();
  };

  const handleConfirmClose = async () => {
    if (!logToClose) return;
    setCloseError(null);
    const res = await fetch(`/api/maintenance/${logToClose.id}/close`, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json();
      setCloseError(err.error || "Failed to close maintenance record");
      return;
    }
    setLogToClose(null);
    fetchLogs();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
            Service Records
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: 0 }}>
            Maintenance
          </h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="app-button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {showForm ? "Close Form" : "Log Service"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showForm ? "340px 1fr" : "1fr", gap: 20, alignItems: "start" }}>
        {showForm && <MaintenanceForm onSave={handleSaveMaintenance} error={formError} />}
        <MaintenanceTable logs={logs} onCloseClick={setLogToClose} />
      </div>

      <ConfirmDialog
        isOpen={!!logToClose}
        title="Close Maintenance Record"
        message={
          <>
            <p>
              Are you sure you want to close this maintenance record for{" "}
              <strong>{logToClose?.vehicle?.registrationNumber}</strong>?
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "8px" }}>
              The vehicle will be marked as AVAILABLE (unless retired).
            </p>
            {closeError && (
              <p style={{ color: "var(--status-retired-text)", marginTop: "16px", fontSize: "14px", backgroundColor: "var(--status-retired-bg)", padding: "8px", borderRadius: "8px" }}>
                {closeError}
              </p>
            )}
          </>
        }
        onConfirm={handleConfirmClose}
        onCancel={() => { setLogToClose(null); setCloseError(null); }}
        confirmText="Close Record"
      />
    </div>
  );
}
