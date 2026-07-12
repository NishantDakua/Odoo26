"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Dashboard",     href: "/dashboard" },
  { label: "Operations",    href: "/operations" },
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
    <aside className="sidebar">

      {/* Wordmark */}
      <div style={{
        padding: "24px 20px 18px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div style={{
            width: "24px",
            height: "24px",
            backgroundColor: "var(--button)",
            border: "1px solid var(--button-border)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 8L4.5 3L7 8L9.5 5" stroke="var(--text-primary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "13.5px", letterSpacing: "-0.02em" }}>
            TransitOps
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "16px 0", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <div key={item.href}>
              {DIVIDER_BEFORE.has(item.href) && (
                <div style={{
                  height: "1px",
                  backgroundColor: "var(--border)",
                  margin: "8px 16px",
                }} />
              )}
              <Link
                href={item.href}
                className={`sidebar-item${isActive ? " sidebar-active" : ""}`}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
          TransitOps v1.2
        </span>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Enterprise Fleet Management
        </span>
      </div>
    </aside>
  );
}
