"use client";

import { useState, useEffect, useCallback } from "react";
import { Vehicle } from "@prisma/client";
import VehicleFilters from "@/components/fleet/VehicleFilters";
import VehicleForm from "@/components/fleet/VehicleForm";
import VehicleTable from "@/components/fleet/VehicleTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState<{ registration?: string; type?: string; status?: string }>({});

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.registration) params.append("registration", filters.registration);
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    const res = await fetch(`/api/vehicles?${params.toString()}`);
    if (res.ok) setVehicles(await res.json());
  }, [filters]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value || undefined }));
  };

  const handleSaveVehicle = async (vehicleData: Partial<Vehicle>) => {
    setFormError(null);
    const method = vehicleToEdit ? "PUT" : "POST";
    const url = vehicleToEdit ? `/api/vehicles/${vehicleToEdit.id}` : "/api/vehicles";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    });
    if (!res.ok) {
      const err = await res.json();
      setFormError(err.error || "Failed to save vehicle");
      return;
    }
    setIsFormVisible(false);
    setVehicleToEdit(null);
    fetchVehicles();
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;
    setDeleteError(null);
    const res = await fetch(`/api/vehicles/${vehicleToDelete.id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      setDeleteError(err.error || "Failed to delete vehicle");
      return;
    }
    setVehicleToDelete(null);
    fetchVehicles();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
            Vehicle Registry
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: 0 }}>
            Fleet
          </h1>
        </div>
        <button
          onClick={() => { setIsFormVisible(!isFormVisible); setVehicleToEdit(null); setFormError(null); }}
          className="app-button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isFormVisible ? "Close Form" : "Add Vehicle"}
        </button>
      </div>

      {!isFormVisible && (
        <div style={{ marginBottom: 16 }}>
          <VehicleFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
      )}

      {isFormVisible && (
        <VehicleForm
          vehicleToEdit={vehicleToEdit}
          error={formError}
          onSave={handleSaveVehicle}
          onClear={() => { setIsFormVisible(false); setVehicleToEdit(null); setFormError(null); }}
        />
      )}

      {!isFormVisible && (
        <VehicleTable
          vehicles={vehicles}
          onEdit={v => { setVehicleToEdit(v); setIsFormVisible(true); setFormError(null); }}
          onDelete={v => setVehicleToDelete(v)}
        />
      )}

      <ConfirmDialog
        isOpen={!!vehicleToDelete}
        title="Delete Vehicle"
        message={
          <>
            <p>Delete vehicle <strong>{vehicleToDelete?.registrationNumber}</strong>? This cannot be undone.</p>
            {deleteError && <p style={{ color: "var(--status-red-text)", marginTop: 8, fontSize: 13 }}>{deleteError}</p>}
          </>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setVehicleToDelete(null); setDeleteError(null); }}
        confirmText="Delete"
      />
    </div>
  );
}
