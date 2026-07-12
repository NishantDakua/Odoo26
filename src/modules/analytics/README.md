# Analytics Module

Dashboard KPIs and vehicle status breakdown for TransitOps.

## Setup

The schema has been updated to add `STANDBY` to the `VehicleStatus` enum. Run:

```bash
npx prisma migrate dev --name add-standby-status
npx prisma generate
```

## API

### GET /api/dashboard

Returns KPIs, recent trips, and vehicle status breakdown.

**Query Parameters:**
- `type` (optional): Vehicle type filter (VAN, TRUCK, MINI, OTHER)
- `status` (optional): Vehicle status filter (AVAILABLE, ON_TRIP, IN_SHOP, RETIRED, STANDBY)
- `region` (optional): Region filter
- `dateFrom` (optional): ISO date string, filters trips by createdAt >= dateFrom
- `dateTo` (optional): ISO date string, filters trips by createdAt <= dateTo

**Response:**
```typescript
{
  kpis: {
    activeVehicles: number,
    availableVehicles: number,
    vehiclesInMaintenance: number,
    activeTrips: number,
    pendingTrips: number,
    driversOnDuty: number,
    fleetUtilizationPct: number
  },
  recentTrips: [{
    tripCode: string,
    vehicleLabel: string,
    driverLabel: string,
    status: string,
    eta: string,
    updatedAgo: string
  }],
  vehicleStatus: {
    total: number,
    breakdown: {
      available: { count: number, pct: number },
      onTrip: { count: number, pct: number },
      inShop: { count: number, pct: number },
      retired: { count: number, pct: number },
      standby: { count: number, pct: number }
    }
  }
}
```

**Error Response:**
```typescript
{ error: { message: string, code: string } }
```

Possible codes: `INVALID_FILTER`, `INTERNAL_ERROR`
