"use server";
import { NextRequest, NextResponse } from "next/server";
import { cancelTripService, TripError } from "@/modules/trips/trip.service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trip = await cancelTripService(params.id);
    return NextResponse.json(trip);
  } catch (err) {
    if (err instanceof TripError) {
      return NextResponse.json(
        { error: { message: err.message, code: err.code } },
        { status: err.status }
      );
    }
    console.error("[POST /api/trips/:id/cancel]", err);
    return NextResponse.json(
      { error: { message: "Failed to cancel trip", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
