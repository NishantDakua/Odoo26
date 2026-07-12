"use client";

import { useState } from "react";
import Table from "./ui/Table";
import { Modal } from "./ui/Modal";
import { exportToCSV } from "@/lib/csv";
import type { Column } from "./ui/Table";

/* ────────────────── Types ─────────────────── */

/** Describes a single form field rendered inside the add / edit modal. */
interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  /** Only used when type === "select" (excluding the special vehicleId case). */
  options?: string[];
}

interface CrudSectionProps<T extends { id: string }> {
  /** Section heading shown above the table. */
  title: string;
  /** The rows currently displayed. */
  data: T[];
  /** Callback when rows are added, edited, or deleted. */
  onChange: (data: T[]) => void;
  /** Form field definitions for the add/edit modal. */
  fields: Field[];
  /** Column definitions for the table. */
  columns: Column<T>[];
  /** Vehicle IDs shown in the vehicle dropdown. */
  vehicleOptions: string[];
}

/* ────────────── Shared input classes ────────── */

const INPUT_CLASS =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm " +
  "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";

const SELECT_CLASS = `${INPUT_CLASS} bg-white`;

/* ───────────────── Component ──────────────── */

/**
 * Generic CRUD section — renders a titled card with a data table
 * and an add / edit modal.  Works with any record type that has an `id`.
 */
export default function CrudSection<T extends { id: string }>({
  title,
  data,
  onChange,
  fields,
  columns,
  vehicleOptions,
}: CrudSectionProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({});

  /** Singular version of the title (e.g. "Fuel Logs" → "Fuel Log"). */
  const singularTitle = title.replace(/s$/, "");

  /* ── Modal helpers ─────────────────────────────── */

  const openNewForm = () => {
    setEditingRow(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const openEditForm = (row: T) => {
    setEditingRow(row);
    setFormData(row);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  /* ── Data helpers ──────────────────────────────── */

  const handleSave = () => {
    if (editingRow) {
      // Update existing row
      onChange(
        data.map((row) =>
          row.id === editingRow.id ? { ...editingRow, ...formData } : row
        )
      );
    } else {
      // Insert new row with a random ID
      onChange([...data, { ...formData, id: crypto.randomUUID() } as T]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    onChange(data.filter((row) => row.id !== id));
  };

  const updateField = (name: string, value: string | number) => {
    setFormData({ ...formData, [name]: value });
  };

  /* ── Render ────────────────────────────────────── */

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="space-x-3">
          <button
            onClick={() => exportToCSV(data, title.toLowerCase().replace(/\s/g, "_"))}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg
                       hover:bg-gray-50 transition-colors text-gray-700"
          >
            Export CSV
          </button>
          <button
            onClick={openNewForm}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Add {singularTitle}
          </button>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-x-auto">
        <Table
          data={data}
          columns={columns}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </div>

      {/* Add / Edit modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRow ? `Edit ${singularTitle}` : `Add ${singularTitle}`}
      >
        <div className="space-y-4 mt-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
              </label>

              {/* Vehicle dropdown (special case) */}
              {field.name === "vehicleId" ? (
                <select
                  value={formData.vehicleId ?? ""}
                  onChange={(e) => updateField("vehicleId", e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">Select vehicle</option>
                  {vehicleOptions.map((id) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>

              /* Generic select */
              ) : field.type === "select" ? (
                <select
                  value={formData[field.name] ?? ""}
                  onChange={(e) => updateField(field.name, e.target.value)}
                  className={SELECT_CLASS}
                >
                  {field.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

              /* Text / number / date input */
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] ?? ""}
                  onChange={(e) =>
                    updateField(
                      field.name,
                      field.type === "number" ? Number(e.target.value) : e.target.value
                    )
                  }
                  className={INPUT_CLASS}
                />
              )}
            </div>
          ))}

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm
                       font-semibold hover:bg-blue-700 transition-colors mt-6 shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
}
