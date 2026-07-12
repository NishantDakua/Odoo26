"use client";

import { useState } from "react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import CrudSection from "@/components/CrudSection";
import {
  fuelLogs as seedFuel,
  expenses as seedExpenses,
  vehicles,
  monthlyRevenue,
} from "@/lib/mockData";
import { formatCurrency } from "@/lib/format";
import type { FuelLog, Expense } from "@/lib/types";

/**
 * Financial Analyst — the main landing page.
 *
 * Renders KPI analytics at the top, followed by two editable data tables
 * for Fuel Logs and Expenses.  All data is kept in local state so the
 * user can add / edit / delete rows without a backend.
 */
export default function FinancePage() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(seedFuel);
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);

  // Derive a flat list of vehicle IDs for the dropdowns in the forms
  const vehicleIds = vehicles.map((vehicle) => vehicle.id);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-800">
        Financial Analyst
      </h1>

      {/* ── KPI cards + charts ───────────────────────────────── */}
      <AnalyticsDashboard
        fuelLogs={fuelLogs}
        expenses={expenses}
        vehicles={vehicles}
        monthlyRevenue={monthlyRevenue}
      />

      {/* ── Fuel Logs CRUD table ─────────────────────────────── */}
      <CrudSection<FuelLog>
        title="Fuel Logs"
        data={fuelLogs}
        onChange={setFuelLogs}
        vehicleOptions={vehicleIds}
        fields={[
          { name: "vehicleId", label: "Vehicle", type: "select" },
          { name: "liters", label: "Liters", type: "number" },
          { name: "cost", label: "Cost (₹)", type: "number" },
          { name: "date", label: "Date", type: "date" },
        ]}
        columns={[
          { key: "vehicleId", label: "Vehicle" },
          { key: "liters", label: "Liters" },
          { key: "cost", label: "Cost", render: (v: number) => formatCurrency(v) },
          { key: "date", label: "Date" },
        ]}
      />

      {/* ── Expenses CRUD table ──────────────────────────────── */}
      <CrudSection<Expense>
        title="Expenses"
        data={expenses}
        onChange={setExpenses}
        vehicleOptions={vehicleIds}
        fields={[
          { name: "vehicleId", label: "Vehicle", type: "select" },
          { name: "category", label: "Category", type: "select", options: ["Toll", "Misc"] },
          { name: "cost", label: "Cost (₹)", type: "number" },
          { name: "date", label: "Date", type: "date" },
        ]}
        columns={[
          { key: "vehicleId", label: "Vehicle" },
          { key: "category", label: "Category" },
          { key: "cost", label: "Cost", render: (v: number) => formatCurrency(v) },
          { key: "date", label: "Date" },
        ]}
      />
    </div>
  );
}
