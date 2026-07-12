import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { CreateDriverSchema, DriverListQuerySchema } from '@/lib/validators/driver';
import { verifyToken } from '@/lib/jwt';
import { JWT_COOKIE_NAME, LICENSE_EXPIRY_WARNING_DAYS } from '@/lib/constants';

// ─── Helper: attach computed license fields ───────────────────────────────────

function withLicenseFlags<T extends { licenseExpiryDate: Date }>(driver: T) {
  const now = new Date();
  const expiry = new Date(driver.licenseExpiryDate);
  const isLicenseExpired = expiry < now;
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isLicenseExpiringSoon = !isLicenseExpired && diffDays <= LICENSE_EXPIRY_WARNING_DAYS;
  return { ...driver, isLicenseExpired, isLicenseExpiringSoon };
}

// ─── GET /api/drivers ─────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(JWT_COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || !['SAFETY_OFFICER', 'DISPATCHER'].includes(payload.role))
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    // Parse and validate query params
    const raw = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = DriverListQuerySchema.safeParse(raw);
    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );

    const { status, licenseCategory, licenseValid, search, page, limit } = parsed.data;

    // Build Prisma where clause
    const where: Prisma.DriverWhereInput = {};

    if (status) where.status = status;
    if (licenseCategory) where.licenseCategory = licenseCategory;

    // licenseValid=true → only drivers whose license has not expired (DB-level filter)
    if (licenseValid) where.licenseExpiryDate = { gt: new Date() };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [drivers, total] = await prisma.$transaction([
      prisma.driver.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.driver.count({ where }),
    ]);

    const enriched = drivers.map(withLicenseFlags);

    return NextResponse.json({
      success: true,
      data: { drivers: enriched, total, page, limit },
    });
  } catch (error) {
    console.error('[GET /api/drivers]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/drivers ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(JWT_COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'SAFETY_OFFICER')
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => null);
    if (!body)
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });

    const parsed = CreateDriverSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );

    const existing = await prisma.driver.findUnique({
      where: { licenseNumber: parsed.data.licenseNumber },
    });
    if (existing)
      return NextResponse.json(
        { success: false, error: 'License number already exists' },
        { status: 400 }
      );

    const driver = await prisma.driver.create({
      data: {
        name: parsed.data.name,
        licenseNumber: parsed.data.licenseNumber,
        licenseCategory: parsed.data.licenseCategory,
        licenseExpiryDate: new Date(parsed.data.licenseExpiryDate),
        contactNumber: parsed.data.contactNumber,
        safetyScore: parsed.data.safetyScore,
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ success: true, data: withLicenseFlags(driver) }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/drivers]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
