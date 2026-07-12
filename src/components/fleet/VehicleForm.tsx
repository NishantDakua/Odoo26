"use client";

import { useState, useEffect } from "react";
import { VehicleType, Vehicle } from "@prisma/client";

type VehicleFormProps = {
  vehicleToEdit: Vehicle | null;
  onSave: (vehicleData: Partial<Vehicle>) => Promise<void>;
  onClear: () => void;
  error?: string | null;
};

const TYPE_LABELS: Record<VehicleType, string> = {
  VAN: "Van",
  TRUCK: "Truck",
  MINI: "Mini",
  OTHER: "Other",
  BUS: "Bus",
  MINIBUS: "Minibus",
};

export default function VehicleForm({ vehicleToEdit, onSave, onClear, error }: VehicleFormProps) {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
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
    await onSave(formData);
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
    <div className="card" style={{ marginBottom: "24px" }}>
      <div className="card-header">
        {vehicleToEdit ? "Edit Vehicle" : "Register New Vehicle"}
        <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 400, marginTop: "4px" }}>
          {vehicleToEdit ? "Update details for the selected vehicle." : "Enter details to add a vehicle to your fleet."}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px", backgroundColor: "var(--status-retired-bg)", color: "var(--status-retired-text)", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Registration Number</label>
            <input
              name="registrationNumber"
              value={formData.registrationNumber || ""}
              onChange={handleChange}
              disabled={!!vehicleToEdit || isSubmitting}
              className="input mono"
              style={{ textTransform: "uppercase" }}
              placeholder="e.g. MH12AB1234"
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Model</label>
            <input
              name="nameModel"
              value={formData.nameModel || ""}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Tata Ace Gold"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Vehicle Type</label>
            <select
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              className="input"
              disabled={isSubmitting}
            >
              <option value="" disabled>Select Type</option>
              {Object.keys(VehicleType).map((type) => (
                <option key={type} value={type}>{TYPE_LABELS[type as VehicleType] || type}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Capacity (kg)</label>
            <input
              type="number"
              name="maxLoadCapacityKg"
              value={formData.maxLoadCapacityKg || ""}
              onChange={handleChange}
              className="input"
              placeholder="e.g. 1500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Acquisition Cost (₹)</label>
            <input
              type="number"
              name="acquisitionCost"
              value={formData.acquisitionCost || ""}
              onChange={handleChange}
              className="input"
              placeholder="e.g. 750000"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Current Odometer (km)</label>
            <input
              type="number"
              name="odometerKm"
              value={formData.odometerKm || ""}
              onChange={handleChange}
              className="input"
              placeholder="e.g. 15000"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Region</label>
            <input
              name="region"
              value={formData.region || ""}
              onChange={handleChange}
              className="input"
              placeholder="e.g. West"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>Depot Name</label>
            <input
              name="depotName"
              value={formData.depotName || ""}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Mumbai Central"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <button
            type="button"
            onClick={onClear}
            disabled={isSubmitting}
            className="app-button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="app-button"
            style={{ opacity: (!isValid || isSubmitting) ? 0.5 : 1, cursor: (!isValid || isSubmitting) ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "Saving..." : "Save Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
