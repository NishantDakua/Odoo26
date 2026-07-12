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
    <div className="app-card">
      {/* Header */}
      <div className="app-card-header">
        <h3 className="section-title">
          Log Service
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          Only available vehicles can be serviced.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label className="input-label">Vehicle</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className="input-field select-field"
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
          <label className="input-label">Service Type</label>
          <input
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            placeholder="e.g. Oil change"
            className="input-field"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label className="input-label">Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min={1}
              placeholder="0"
              className="input-field"
            />
          </div>
          <div>
            <label className="input-label">Service Date</label>
            <input
              type="date"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              className="input-field"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <div>
          <label className="input-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Optional service notes…"
            className="input-field"
            style={{
              resize: "vertical",
              lineHeight: "1.5",
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <button
            type="button"
            onClick={handleClear}
            className="app-button-secondary"
            style={{ flex: 1 }}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="app-button"
            style={{ flex: 2 }}
          >
            {isSubmitting ? "Saving…" : "Save Record"}
          </button>
        </div>
      </form>
    </div>
  );
}
