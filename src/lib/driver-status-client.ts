// Thin wrapper over the Drivers API (owned by P3).
// Swap the fetch URL once the real endpoint is deployed.
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export async function setDriverStatus(driverId: string, status: string): Promise<void> {
  const res = await fetch(`${BASE}/api/drivers/${driverId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Driver status update failed (${res.status})`);
  }
}
