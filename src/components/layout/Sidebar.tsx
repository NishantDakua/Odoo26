"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Dashboard",     href: "/dashboard" },
  { label: "Fleet",         href: "/fleet" },
  { label: "Drivers",       href: "/drivers" },
  { label: "Trips",         href: "/trips" },
  { label: "Maintenance",   href: "/maintenance" },
  { label: "Fuel & Expenses", href: "/fuel-expenses" },
  { label: "Analytics",     href: "/analytics" },
  { label: "Settings",      href: "/settings" },
];

const DIVIDER_BEFORE = new Set(["/fuel-expenses", "/settings"]);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "216px",
      minWidth: "216px",
      background: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
    }}>

      {/* Wordmark */}
      <div style={{
        padding: "24px 20px 18px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div style={{
            width: "24px",
            height: "24px",
            background: "var(--btn-primary-bg)",
            border: "1px solid var(--btn-primary-border)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 8L4.5 3L7 8L9.5 5" stroke="var(--btn-primary-text)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "13.5px", letterSpacing: "-0.02em" }}>
            TransitOps
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <div key={item.href}>
              {DIVIDER_BEFORE.has(item.href) && (
                <div style={{
                  height: "1px",
                  background: "var(--border)",
                  margin: "8px 4px",
                }} />
              )}
              <Link
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "7px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                  background: isActive ? "var(--input-bg)" : "transparent",
                  transition: "color 0.1s, background 0.1s",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "14px 20px",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.01em" }}>
          v1.0 · Fleet Manager
        </div>
      </div>
    </aside>
  );
}
