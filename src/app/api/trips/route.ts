"use server";
import { NextRequest, NextResponse } from "next/server";
import { createTripSchema } from "@/modules/trips/trip.validation";
import { createTripService, listTripsService } from "@/modules/trips/trip.service";
import { TripError } from "@/modules/trips/trip.service";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const filters = {
    status: searchParams.get("status") ?? undefined,
    vehicleId: searchParams.get("vehicleId") ?? undefined,
    driverId: searchParams.get("driverId") ?? undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
    offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : undefined,
    dateFrom: searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : undefined,
    dateTo: searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : undefined,
  };

  try {
    const result = await listTripsService(filters);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/trips]", err);
    return NextResponse.json(
      { error: { message: "Failed to fetch trips", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const parsed = createTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: parsed.error.issues[0].message, code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  try {
    const trip = await createTripService(parsed.data);
    return NextResponse.json(trip, { status: 201 });
  } catch (err) {
    if (err instanceof TripError) {
      return NextResponse.json(
        { error: { message: err.message, code: err.code } },
        { status: err.status }
      );
    }
    console.error("[POST /api/trips]", err);
    return NextResponse.json(
      { error: { message: "Failed to create trip", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
