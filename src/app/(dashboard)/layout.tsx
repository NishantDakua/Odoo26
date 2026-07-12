import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--bg-page)",
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Navbar />
        <main style={{
          flex: 1,
          padding: "28px 32px",
          overflowY: "auto",
          overflowX: "hidden",
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
