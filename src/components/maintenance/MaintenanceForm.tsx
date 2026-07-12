"use client";

import { useState, useEffect } from "react";
import { Vehicle } from "@prisma/client";

type MaintenanceFormProps = {
  onSave: (data: { vehicleId: string; serviceType: string; cost: number; serviceDate: string; notes: string }) => Promise<void>;
  error?: string | null;
};

export default function MaintenanceForm({ onSave, error }: MaintenanceFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "",
    cost: "",
    serviceDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    fetch("/api/vehicles/available")
      .then((res) => res.json())
      .then(setVehicles)
      .catch(console.error);
  }, []);

  const isValid =
    formData.vehicleId &&
    formData.serviceType.trim() &&
    Number(formData.cost) > 0 &&
    formData.serviceDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    await onSave({ ...formData, cost: Number(formData.cost) });
    setIsSubmitting(false);
    handleClear();
  };

  const handleClear = () => {
    setFormData({
      vehicleId: "",
      serviceType: "",
      cost: "",
      serviceDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        Log Service
        <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 400, marginTop: "4px" }}>
          Only available vehicles can be serviced.
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px", backgroundColor: "var(--status-retired-bg)", color: "var(--status-retired-text)", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Vehicle</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select vehicle…</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.registrationNumber} — {v.nameModel}
              </option>
            ))}
          </select>
          {vehicles.length === 0 && (
            <p style={{ margin: "6px 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
              No available vehicles at the moment.
            </p>
          )}
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Service Type</label>
          <input
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            placeholder="e.g. Oil change"
            className="input"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min={1}
              placeholder="0"
              className="input"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Service Date</label>
            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              className="input"
              // In dark mode we need color-scheme dark so the calendar picker is dark. 
              // Usually setting it on body in CSS is enough, but to be safe:
              style={{ colorScheme: "dark light" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Optional service notes…"
            className="input"
            style={{
              resize: "vertical",
              lineHeight: "1.5",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={handleClear}
            disabled={isSubmitting}
            className="app-button-secondary"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="app-button"
            style={{ opacity: (!isValid || isSubmitting) ? 0.5 : 1, cursor: (!isValid || isSubmitting) ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "Saving..." : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
}
