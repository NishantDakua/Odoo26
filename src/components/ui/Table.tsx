import React from "react";

/* ────────────── Column type ──────────────── */

/**
 * Defines how a single column is displayed in the table.
 *
 * - `key`    — the property name to read from each row object.
 * - `label`  — the human‑readable header text.
 * - `render` — optional custom renderer (e.g. for currency formatting).
 */
export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

/* ──────────────── Props ─────────────────── */

interface TableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (id: string) => void;
}

/* ──────────────── Component ─────────────── */

/**
 * A simple, re‑usable data table with optional edit / delete action buttons.
 * Shows a friendly "No data available" row when the list is empty.
 */
export default function Table<T extends { id: string }>({
  columns,
  data,
  onEdit,
  onDelete,
}: TableProps<T>) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <table className="w-full text-sm">
      {/* ── Head ────────────────────────────────── */}
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500 bg-gray-50">
          {columns.map((col) => (
            <th key={String(col.key)} className="py-3 px-4 font-medium">
              {col.label}
            </th>
          ))}
          {hasActions && (
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          )}
        </tr>
      </thead>

      {/* ── Body ────────────────────────────────── */}
      <tbody>
        {data.map((row, index) => {
          const isLastRow = index === data.length - 1;

          return (
            <tr
              key={row.id}
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                isLastRow ? "border-0" : ""
              }`}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="py-3 px-4 text-gray-700">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}

              {hasActions && (
                <td className="py-3 px-4 space-x-3 text-right">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(row.id)}
                      className="text-red-500 font-medium hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          );
        })}

        {/* Empty state */}
        {data.length === 0 && (
          <tr>
            <td
              colSpan={columns.length + (hasActions ? 1 : 0)}
              className="py-8 text-center text-gray-500"
            >
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
