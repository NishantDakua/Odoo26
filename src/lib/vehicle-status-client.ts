// Thin wrapper over the Vehicles API (owned by P1).
// Swap the fetch URL once the real endpoint is deployed.
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export async function setVehicleStatus(vehicleId: string, status: string): Promise<void> {
  const res = await fetch(`${BASE}/api/vehicles/${vehicleId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Vehicle status update failed (${res.status})`);
  }
}
