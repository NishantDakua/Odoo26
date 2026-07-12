"use server";
import { NextRequest, NextResponse } from "next/server";
import { dispatchTripSchema } from "@/modules/trips/trip.validation";
import { dispatchTripService, TripError } from "@/modules/trips/trip.service";
import { getCurrentUserId } from "@/lib/temp-auth-stub"; // TODO: replace with real auth

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: { message: "Invalid JSON body", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  const parsed = dispatchTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: parsed.error.issues[0].message, code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }

  try {
    const userId = getCurrentUserId();
    const trip = await dispatchTripService(params.id, parsed.data, userId);
    return NextResponse.json(trip);
  } catch (err) {
    if (err instanceof TripError) {
      return NextResponse.json(
        { error: { message: err.message, code: err.code } },
        { status: err.status }
      );
    }
    console.error("[POST /api/trips/:id/dispatch]", err);
    return NextResponse.json(
      { error: { message: "Failed to dispatch trip", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
