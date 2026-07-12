"use client";

import { useState, useEffect } from "react";
import { VehicleType, Vehicle } from "@prisma/client";

type VehicleFormProps = {
  vehicleToEdit: Vehicle | null;
  onSave: (vehicleData: Partial<Vehicle>) => Promise<void>;
  onClear: () => void;
  error?: string | null;
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 500,
  color: "rgba(255,255,255,0.45)",
  marginBottom: "6px",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const disabledInputStyle: React.CSSProperties = {
  ...inputStyle,
  opacity: 0.45,
  cursor: "not-allowed",
};

const TYPE_LABELS: Record<VehicleType, string> = {
  VAN: "Van",
  TRUCK: "Truck",
  MINI: "Mini",
  OTHER: "Other",
};

type FormData = Omit<Partial<Vehicle>, 'acquisitionCost'> & { acquisitionCost?: number | string };

export default function VehicleForm({ vehicleToEdit, onSave, onClear, error }: VehicleFormProps) {
  const [formData, setFormData] = useState<FormData>({
    registrationNumber: "",
    nameModel: "",
    type: "" as VehicleType,
    maxLoadCapacityKg: 0,
    odometerKm: 0,
    acquisitionCost: 0,
    region: "",
    depotName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({ ...vehicleToEdit, acquisitionCost: Number(vehicleToEdit.acquisitionCost) });
    } else {
      setFormData({ registrationNumber: "", nameModel: "", type: "" as VehicleType, maxLoadCapacityKg: 0, odometerKm: 0, acquisitionCost: 0, region: "", depotName: "" });
    }
  }, [vehicleToEdit]);

  const isValid =
    formData.registrationNumber?.trim() &&
    formData.nameModel?.trim() &&
    formData.type &&
    Number(formData.maxLoadCapacityKg) > 0 &&
    Number(formData.acquisitionCost) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    await onSave(formData as Partial<Vehicle>);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["maxLoadCapacityKg", "odometerKm", "acquisitionCost"].includes(name)
        ? value === "" ? 0 : Number(value)
        : value,
    }));
  };

  return (
    <div className="app-card">
      <div className="app-card-header">
        <h3 className="section-title">
          {vehicleToEdit ? "Edit Vehicle" : "Register New Vehicle"}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          {vehicleToEdit ? "Update details for the selected vehicle." : "Enter details to add a vehicle to your fleet."}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label className="input-label">Registration Number</label>
            <input
              name="registrationNumber"
              value={formData.registrationNumber || ""}
              onChange={handleChange}
              disabled={!!vehicleToEdit || isSubmitting}
              className="input-field"
              style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "monospace" }}
              placeholder="e.g. MH12AB1234"
            />
          </div>
          <div>
            <label className="input-label">Model</label>
            <input
              name="nameModel"
              value={formData.nameModel || ""}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Tata Ace Gold"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label className="input-label">Vehicle Type</label>
            <select
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              className="input-field select-field"
              disabled={isSubmitting}
            >
              <option value="">Select type</option>
              {Object.values(VehicleType).map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Capacity (kg)</label>
            <input
              type="number"
              name="maxLoadCapacityKg"
              value={formData.maxLoadCapacityKg || ""}
              onChange={handleChange}
              min={1}
              className="input-field"
              placeholder="500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="input-label">Odometer (km)</label>
            <input
              type="number"
              name="odometerKm"
              value={formData.odometerKm || ""}
              onChange={handleChange}
              min={0}
              className="input-field"
              placeholder="0"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div>
            <label className="input-label">Acquisition Cost</label>
            <input
              type="number"
              name="acquisitionCost"
              value={formData.acquisitionCost || ""}
              onChange={handleChange}
              min={1}
              className="input-field"
              placeholder="650000"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="input-label">Region</label>
            <input
              name="region"
              value={formData.region || ""}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. West"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="input-label">Depot</label>
            <input
              name="depotName"
              value={formData.depotName || ""}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. D1"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClear}
            className="app-button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="app-button"
          >
            {isSubmitting ? "Saving…" : vehicleToEdit ? "Update Vehicle" : "Register Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
