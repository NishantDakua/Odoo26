"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const BREADCRUMBS: Record<string, string[]> = {
  "/fleet":        ["Fleet", "Vehicle Registry"],
  "/maintenance":  ["Fleet", "Maintenance"],
  "/dashboard":    ["Dashboard"],
  "/drivers":      ["Drivers"],
  "/trips":        ["Trips"],
  "/fuel-expenses":["Fuel & Expenses"],
  "/analytics":    ["Analytics"],
  "/settings":     ["Settings"],
};

export default function Navbar() {
  const pathname = usePathname();

  const crumbs =
    Object.entries(BREADCRUMBS).find(([key]) =>
      pathname === key || (key !== "/dashboard" && pathname.startsWith(key))
    )?.[1] ?? ["TransitOps"];

  return (
    <header className="navbar">
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {crumbs.map((crumb, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2.5L7.5 6L4 9.5" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            )}
            <span style={{
              fontSize: "13px",
              fontWeight: i === crumbs.length - 1 ? 500 : 400,
              color: i === crumbs.length - 1 ? "var(--text-primary)" : "var(--text-muted)",
              letterSpacing: "-0.01em",
            }}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg
            width="13" height="13" viewBox="0 0 13 13" fill="none"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="5.5" cy="5.5" r="4" stroke="var(--text-muted)" strokeWidth="1.2"/>
            <path d="M9 9L11.5 11.5" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="input"
            style={{
              padding: "6px 12px 6px 32px",
              width: "192px",
            }}
          />
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "20px", backgroundColor: "var(--border)" }} />
        
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Role badge */}
        <span className="role-pill">
          Fleet Manager
        </span>

        {/* Avatar */}
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: "var(--border)",
        }} />
      </div>
    </header>
  );
}
