"use server";
import { NextRequest, NextResponse } from "next/server";
import { completeTripSchema } from "@/modules/trips/trip.validation";
import { completeTripService, TripError } from "@/modules/trips/trip.service";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const parsed = completeTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: parsed.error.issues[0].message, code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  try {
    const trip = await completeTripService(params.id, parsed.data);
    return NextResponse.json(trip);
  } catch (err) {
    if (err instanceof TripError) {
      return NextResponse.json(
        { error: { message: err.message, code: err.code } },
        { status: err.status }
      );
    }
    console.error("[POST /api/trips/:id/complete]", err);
    return NextResponse.json(
      { error: { message: "Failed to complete trip", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
