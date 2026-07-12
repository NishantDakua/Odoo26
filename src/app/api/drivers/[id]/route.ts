import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { JWT_COOKIE_NAME, LICENSE_EXPIRY_WARNING_DAYS } from '@/lib/constants';
import { UpdateDriverSchema, PatchStatusSchema } from '@/lib/validators/driver';

// ─── Helper: compute license expiry fields ────────────────────────────────────

function withLicenseFlags<T extends { licenseExpiryDate: Date }>(driver: T) {
  const now = new Date();
  const expiry = new Date(driver.licenseExpiryDate);
  const isLicenseExpired = expiry < now;
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isLicenseExpiringSoon = !isLicenseExpired && diffDays <= LICENSE_EXPIRY_WARNING_DAYS;
  return { ...driver, isLicenseExpired, isLicenseExpiringSoon };
}

// ─── GET /api/drivers/:id ─────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(JWT_COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || !['SAFETY_OFFICER', 'DISPATCHER'].includes(payload.role))
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const driver = await prisma.driver.findUnique({ where: { id: params.id } });
    if (!driver)
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: withLicenseFlags(driver) });
  } catch (error) {
    console.error('[GET /api/drivers/:id]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PUT /api/drivers/:id  (full update — SAFETY_OFFICER only) ────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const parsed = UpdateDriverSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );

    const driver = await prisma.driver.findUnique({ where: { id: params.id } });
    if (!driver)
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });

    // If license number is changing, ensure no collision
    if (parsed.data.licenseNumber && parsed.data.licenseNumber !== driver.licenseNumber) {
      const collision = await prisma.driver.findUnique({
        where: { licenseNumber: parsed.data.licenseNumber },
      });
      if (collision)
        return NextResponse.json(
          { success: false, error: 'License number already in use' },
          { status: 400 }
        );
    }

    const updated = await prisma.driver.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        ...(parsed.data.licenseExpiryDate && {
          licenseExpiryDate: new Date(parsed.data.licenseExpiryDate),
        }),
      },
    });

    return NextResponse.json({ success: true, data: withLicenseFlags(updated) });
  } catch (error) {
    console.error('[PUT /api/drivers/:id]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── PATCH /api/drivers/:id  (status update — SO and DISPATCHER) ──────────────
// NOTE: prefer /api/drivers/:id/status for status changes.
// This handler remains for backward compat with drivers/page.tsx inline table.

const DISPATCHER_ALLOWED = ['AVAILABLE', 'ON_TRIP'] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(JWT_COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || !['SAFETY_OFFICER', 'DISPATCHER'].includes(payload.role))
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => null);
    if (!body)
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });

    const parsed = PatchStatusSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );

    const { status } = parsed.data;

    // Dispatchers may only set AVAILABLE or ON_TRIP
    if (
      payload.role === 'DISPATCHER' &&
      !DISPATCHER_ALLOWED.includes(status as typeof DISPATCHER_ALLOWED[number])
    ) {
      return NextResponse.json(
        { success: false, error: 'Dispatchers can only set status to AVAILABLE or ON_TRIP' },
        { status: 403 }
      );
    }

    const driver = await prisma.driver.findUnique({ where: { id: params.id } });
    if (!driver)
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });

    if (payload.role === 'DISPATCHER' && status === 'ON_TRIP' && driver.status === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, error: 'Cannot assign a suspended driver to a trip' },
        { status: 400 }
      );
    }

    const updated = await prisma.driver.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[PATCH /api/drivers/:id]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// ─── DELETE /api/drivers/:id  (SAFETY_OFFICER only) ──────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(JWT_COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'SAFETY_OFFICER')
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

    const driver = await prisma.driver.findUnique({ where: { id: params.id } });
    if (!driver)
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });

    await prisma.driver.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Driver deleted' });
  } catch (error) {
    console.error('[DELETE /api/drivers/:id]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
