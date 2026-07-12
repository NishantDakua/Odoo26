// todo: maintenance page
export default function MaintenancePage() {
  return <div className="p-6"><h1 className="text-xl font-semibold text-gray-800">Maintenance</h1><p className="text-gray-500 mt-2">Coming soon.</p></div>;
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
    if (res.ok) {
      const data = await res.json();
      setLogs(data);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSaveMaintenance = async (data: any) => {
    setFormError(null);
    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      setFormError(error.error || "Failed to save maintenance record");
      return;
    }

    fetchLogs();
  };

  const handleConfirmClose = async () => {
    if (!logToClose) return;
    setCloseError(null);

    const res = await fetch(`/api/maintenance/${logToClose.id}/close`, { method: "PATCH" });
    if (!res.ok) {
      const error = await res.json();
      setCloseError(error.error || "Failed to close maintenance record");
      return;
    }

    setLogToClose(null);
    fetchLogs();
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <h2 className="page-subtitle">Service Records</h2>
          <h1 className="page-title">Maintenance</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="app-button"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {showForm ? "Close Form" : "Log Service"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: showForm ? "340px 1fr" : "1fr", gap: "20px", alignItems: "start" }}>
        {/* LEFT: FORM */}
        {showForm && <MaintenanceForm onSave={handleSaveMaintenance} error={formError} />}

        {/* RIGHT: HISTORY */}
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
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginTop: "0.5rem" }}>
              The vehicle will be marked as AVAILABLE (unless retired).
            </p>
            {closeError && (
              <p style={{ color: "#ef4444", marginTop: "1rem", fontSize: "0.875rem", background: "#fee2e2", padding: "0.5rem", borderRadius: "0.25rem" }}>
                {closeError}
              </p>
            )}
          </>
        }
        onConfirm={handleConfirmClose}
        onCancel={() => {
          setLogToClose(null);
          setCloseError(null);
        }}
        confirmText="Close Record"
      />
    </div>
  );
}
