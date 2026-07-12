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
    if (res.ok) {
      const data = await res.json();
      setVehicles(data);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value || undefined }));
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
      const error = await res.json();
      setFormError(error.error || "Failed to save vehicle");
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
      const error = await res.json();
      setDeleteError(error.error || "Failed to delete vehicle");
      return;
    }

    setVehicleToDelete(null);
    fetchVehicles();
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <h2 className="page-subtitle">Vehicle Registry</h2>
          <h1 className="page-title">Fleet</h1>
        </div>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="app-button"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isFormVisible ? "Close Form" : "Add Vehicle"}
        </button>
      </div>

      {!isFormVisible && (
        <div style={{ marginBottom: "16px" }}>
          <VehicleFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
      )}

      {isFormVisible && (
        <VehicleForm
          vehicleToEdit={vehicleToEdit}
          error={formError}
          onSave={handleSaveVehicle}
          onClear={() => {
            setIsFormVisible(false);
            setVehicleToEdit(null);
            setFormError(null);
          }}
        />
      )}

      {!isFormVisible && (
        <VehicleTable
          vehicles={vehicles}
          onEdit={(v) => {
            setVehicleToEdit(v);
            setIsFormVisible(true);
            setFormError(null);
          }}
          onDelete={(v) => setVehicleToDelete(v)}
        />
      )}

      <ConfirmDialog
        isOpen={!!vehicleToDelete}
        title="Delete Vehicle"
        message={
          <>
            <p>Are you sure you want to delete vehicle <strong>{vehicleToDelete?.registrationNumber}</strong>?</p>
            {deleteError && (
              <p style={{ color: "#ef4444", marginTop: "1rem", fontSize: "0.875rem", background: "#fee2e2", padding: "0.5rem", borderRadius: "0.25rem" }}>
                {deleteError}
              </p>
            )}
          </>
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setVehicleToDelete(null);
          setDeleteError(null);
        }}
        confirmText="Delete"
      />
    </div>
  );
}
