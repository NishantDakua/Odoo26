"use client";

import { useEffect, useState } from "react";

/* ──────────────── Props ─────────────────── */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/* ──────────────── Component ─────────────── */

/**
 * A centred overlay modal with a blurred backdrop.
 *
 * - Locks body scroll while open.
 * - Clicking outside the card, or the ✕ button, triggers `onClose`.
 * - Uses a `mounted` flag to avoid SSR / hydration mismatches on the portal.
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock / unlock body scroll when the modal opens or closes
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Don't render until after first client‑side mount (prevents hydration issues)
  if (!isMounted || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center
                 justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl
                   transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-3">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100
                       rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414
                   1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10
                   11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293
                   5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
}
