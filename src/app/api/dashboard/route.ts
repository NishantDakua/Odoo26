import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/modules/analytics/analytics.service";

const VALID_STATUSES = ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED", "STANDBY"];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const type = searchParams.get("type") || undefined;
  const statusParam = searchParams.get("status");
  const region = searchParams.get("region") || undefined;
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");

  let status: string | undefined;
  if (statusParam) {
    if (!VALID_STATUSES.includes(statusParam)) {
      return NextResponse.json(
        { error: { message: `Invalid status: ${statusParam}`, code: "INVALID_FILTER" } },
        { status: 400 }
      );
    }
    status = statusParam;
  }

  let dateFrom: Date | undefined;
  let dateTo: Date | undefined;

  if (dateFromParam) {
    dateFrom = new Date(dateFromParam);
    if (isNaN(dateFrom.getTime())) {
      return NextResponse.json(
        { error: { message: "Invalid dateFrom format", code: "INVALID_FILTER" } },
        { status: 400 }
      );
    }
  }

  if (dateToParam) {
    dateTo = new Date(dateToParam);
    if (isNaN(dateTo.getTime())) {
      return NextResponse.json(
        { error: { message: "Invalid dateTo format", code: "INVALID_FILTER" } },
        { status: 400 }
      );
    }
  }

  if (dateFrom && dateTo && dateFrom > dateTo) {
    return NextResponse.json(
      { error: { message: "dateFrom must be before dateTo", code: "INVALID_FILTER" } },
      { status: 400 }
    );
  }

  try {
    const data = await getDashboardData({ type, status, region, dateFrom, dateTo });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: { message: "Failed to fetch dashboard data", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
