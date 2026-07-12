"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  mockVehicles,
  mockDrivers,
  initialTrips,
  type MockTrip,
  type MockVehicle,
  type MockDriver,
} from "@/lib/trips-mock-data";

type TripFormState = {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: string;
  plannedDistanceKm: string;
};

type CompletionData = {
  finalOdometer: string;
  fuelConsumedL: string;
  revenueInr: string;
};

const emptyForm: TripFormState = {
  source: "",
  destination: "",
  vehicleId: "",
  driverId: "",
  cargoWeightKg: "",
  plannedDistanceKm: "",
};

const STAGES = ["DRAFT", "DISPATCHED", "COMPLETED"] as const;
type Stage = (typeof STAGES)[number] | "CANCELLED";

function TripStepper({ status }: { status: Stage }) {
  const cancelled = status === "CANCELLED";
  const activeIndex = cancelled ? -1 : STAGES.indexOf(status as (typeof STAGES)[number]);
  return (
    <div className="flex items-center">
      {STAGES.map((stage, i) => {
        const done = !cancelled && activeIndex > i;
        const active = !cancelled && activeIndex === i;
        const isCancelSlot = cancelled && i === 1;
        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                  isCancelSlot
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : done
                    ? "border-blue-500 bg-blue-500 text-white"
                    : active
                    ? "border-blue-500 bg-blue-500/10 text-blue-500"
                    : "border-gray-300 dark:border-gray-700 bg-transparent text-gray-400",
                ].join(" ")}
              >
                {done ? <CheckCircle2 size={14} /> : isCancelSlot ? <XCircle size={14} /> : i + 1}
              </div>
              <span
                className={[
                  "text-[10px] font-medium whitespace-nowrap",
                  isCancelSlot ? "text-red-400" : active ? "text-blue-500" : done ? "text-gray-600 dark:text-gray-300" : "text-gray-400",
                ].join(" ")}
              >
                {isCancelSlot ? "CANCELLED" : stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div className={["w-16 h-0.5 mb-5 mx-1 transition-colors", done ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"].join(" ")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function CompleteModal({ trip, onConfirm, onClose }: {
  trip: MockTrip; onConfirm: (data: CompletionData) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<CompletionData>({ finalOdometer: "", fuelConsumedL: "", revenueInr: "" });
  const valid = form.finalOdometer !== "" && form.fuelConsumedL !== "";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader><CardTitle>Complete Trip — {trip.tripCode}</CardTitle></CardHeader>
        <CardContent className="space-y-4 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{trip.source} → {trip.destination}</p>
          <Field label="Final Odometer (km)" type="number" value={form.finalOdometer} onChange={(v) => setForm({ ...form, finalOdometer: v })} required />
          <Field label="Fuel Consumed (L)" type="number" value={form.fuelConsumedL} onChange={(v) => setForm({ ...form, fuelConsumedL: v })} required />
          <Field label="Revenue (INR, optional)" type="number" value={form.revenueInr} onChange={(v) => setForm({ ...form, revenueInr: v })} />
          <div className="flex gap-2 pt-1">
            <button onClick={() => valid && onConfirm(form)} disabled={!valid} className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Mark as Completed
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Cancel
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TripCard({ trip, isSelected, onSelect, onComplete, onCancel }: {
  trip: MockTrip; isSelected: boolean; onSelect: () => void; onComplete: () => void; onCancel: () => void;
}) {
  const etaNote =
    trip.status === "DRAFT" ? "Awaiting dispatch"
    : trip.status === "CANCELLED" ? "Cancelled"
    : trip.status === "COMPLETED" ? "Arrived"
    : trip.eta;
  return (
    <div
      onClick={onSelect}
      className={[
        "rounded-xl border p-4 cursor-pointer transition-all",
        isSelected
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{trip.tripCode}</span>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <span>{trip.source}</span>
            <ChevronRight size={12} className="shrink-0" />
            <span>{trip.destination}</span>
          </div>
        </div>
        <StatusBadge status={trip.status} variant="trip" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400 mb-3">
        <span><span className="text-gray-400 dark:text-gray-500">Vehicle: </span>{trip.vehicleLabel}</span>
        <span><span className="text-gray-400 dark:text-gray-500">Driver: </span>{trip.driverLabel}</span>
        <span><span className="text-gray-400 dark:text-gray-500">Cargo: </span>{trip.cargoWeightKg.toLocaleString()} kg</span>
        <span><span className="text-gray-400 dark:text-gray-500">ETA: </span>{etaNote}</span>
      </div>
      {trip.status === "DISPATCHED" && (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={onComplete} className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">Complete</button>
          <button onClick={onCancel} className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">Cancel</button>
        </div>
      )}
    </div>
  );
}

const selectCls = "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

function CreateTripForm({ availableVehicles, availableDrivers, onDispatch }: {
  availableVehicles: MockVehicle[]; availableDrivers: MockDriver[]; onDispatch: (form: TripFormState) => void;
}) {
  const [form, setForm] = useState<TripFormState>(emptyForm);
  const selectedVehicle = availableVehicles.find((v) => v.id === form.vehicleId);
  const cargoNum = parseFloat(form.cargoWeightKg) || 0;
  const overCapacity = selectedVehicle && cargoNum > 0 ? cargoNum - selectedVehicle.capacityKg : 0;
  const canDispatch =
    form.source.trim() !== "" && form.destination.trim() !== "" &&
    form.vehicleId !== "" && form.driverId !== "" &&
    cargoNum > 0 && form.plannedDistanceKm !== "" && overCapacity <= 0;

  function handleSubmit() {
    if (!canDispatch) return;
    onDispatch(form);
    setForm(emptyForm);
  }

  return (
    <Card>
      <CardHeader><CardTitle>Create Trip</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-4 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Source" value={form.source} onChange={(v) => setForm({ ...form, source: v })} placeholder="e.g. Mumbai" />
          <Field label="Destination" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} placeholder="e.g. Pune" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Vehicle</label>
          <select value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className={selectCls}>
            <option value="">Select a vehicle…</option>
            {availableVehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.label} — {v.capacityKg.toLocaleString()} kg capacity</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Driver</label>
          <select value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })} className={selectCls}>
            <option value="">Select a driver…</option>
            {availableDrivers.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cargo Weight (kg)" type="number" value={form.cargoWeightKg} onChange={(v) => setForm({ ...form, cargoWeightKg: v })} placeholder="0" />
          <Field label="Planned Distance (km)" type="number" value={form.plannedDistanceKm} onChange={(v) => setForm({ ...form, plannedDistanceKm: v })} placeholder="0" />
        </div>
        {overCapacity > 0 && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
            <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 dark:text-red-400">
              Capacity exceeded by <span className="font-semibold">{overCapacity.toLocaleString()} kg</span> — dispatch blocked
            </p>
          </div>
        )}
        <div className="flex gap-2 pt-1">
          <button onClick={handleSubmit} disabled={!canDispatch} className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {canDispatch ? "Dispatch" : "Dispatch (Unavailable)"}
          </button>
          <button onClick={() => setForm(emptyForm)} className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

let nextTripNum = initialTrips.length + 1;

export default function TripsPage() {
  const [trips, setTrips] = useState<MockTrip[]>(initialTrips);
  const [selectedId, setSelectedId] = useState<string>(initialTrips[0].id);
  const [completingTrip, setCompletingTrip] = useState<MockTrip | null>(null);

  const selectedTrip = trips.find((t) => t.id === selectedId) ?? trips[0];

  const dispatchedVehicleIds = new Set(trips.filter((t) => t.status === "DISPATCHED").map((t) => t.vehicleId));
  const availableVehicles = mockVehicles.filter((v) => v.status === "AVAILABLE" && !dispatchedVehicleIds.has(v.id));

  const dispatchedDriverIds = new Set(trips.filter((t) => t.status === "DISPATCHED").map((t) => t.driverId));
  const availableDrivers = mockDrivers.filter((d) => d.status === "AVAILABLE" && d.licenseValid && !dispatchedDriverIds.has(d.id));

  function handleDispatch(form: TripFormState) {
    const vehicle = mockVehicles.find((v) => v.id === form.vehicleId)!;
    const driver = mockDrivers.find((d) => d.id === form.driverId)!;
    const num = nextTripNum++;
    const newTrip: MockTrip = {
      id: `t${num}`,
      tripCode: `TR${String(num).padStart(3, "0")}`,
      source: form.source.trim(),
      destination: form.destination.trim(),
      vehicleId: vehicle.id,
      vehicleLabel: vehicle.label,
      driverId: driver.id,
      driverLabel: driver.label,
      cargoWeightKg: parseFloat(form.cargoWeightKg),
      plannedDistanceKm: parseFloat(form.plannedDistanceKm),
      status: "DISPATCHED",
      eta: "Calculating…",
    };
    setTrips((prev) => [newTrip, ...prev]);
    setSelectedId(newTrip.id);
  }

  function handleComplete(trip: MockTrip, data: CompletionData) {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === trip.id
          ? { ...t, status: "COMPLETED" as const, eta: "Arrived", finalOdometer: parseFloat(data.finalOdometer), fuelConsumedL: parseFloat(data.fuelConsumedL), revenueInr: data.revenueInr ? parseFloat(data.revenueInr) : undefined }
          : t
      )
    );
    setCompletingTrip(null);
  }

  function handleCancel(tripId: string) {
    setTrips((prev) =>
      prev.map((t) => t.id === tripId ? { ...t, status: "CANCELLED" as const, eta: "Cancelled" } : t)
    );
  }

  return (
    <div className="p-5 space-y-5">
      <Card>
        <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 mb-0.5">Selected trip</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {selectedTrip.tripCode} — {selectedTrip.source} → {selectedTrip.destination}
            </p>
          </div>
          <div className="sm:ml-auto">
            <TripStepper status={selectedTrip.status} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
        <div className="lg:col-span-2">
          <CreateTripForm availableVehicles={availableVehicles} availableDrivers={availableDrivers} onDispatch={handleDispatch} />
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Board</CardTitle>
                <span className="text-xs text-gray-400 tabular-nums">{trips.length} trips</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-4">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  isSelected={trip.id === selectedId}
                  onSelect={() => setSelectedId(trip.id)}
                  onComplete={() => setCompletingTrip(trip)}
                  onCancel={() => handleCancel(trip.id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {completingTrip && (
        <CompleteModal
          trip={completingTrip}
          onConfirm={(data) => handleComplete(completingTrip, data)}
          onClose={() => setCompletingTrip(null)}
        />
      )}
    </div>
  );
}
