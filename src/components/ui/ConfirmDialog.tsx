"use client";

import { ReactNode } from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(4px)",
    }}>
      <div className="app-card" style={{
        width: "100%",
        maxWidth: "420px",
      }}>
        <h3 className="section-title">
          {title}
        </h3>

        <div style={{
          color: "var(--text-secondary)",
          fontSize: "13.5px",
          lineHeight: 1.6,
          marginBottom: "24px",
        }}>
          {message}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onCancel}
            className="app-button-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="app-button"
            style={{
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.25)",
              color: "var(--status-red-text)",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
