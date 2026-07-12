import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { JWT_COOKIE_NAME } from '@/lib/constants';
import { PatchStatusSchema } from '@/lib/validators/driver';

// Statuses a DISPATCHER is allowed to set (trip lifecycle only)
const DISPATCHER_ALLOWED_STATUSES = ['AVAILABLE', 'ON_TRIP'] as const;

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

    // Parse and validate body
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

    // Dispatcher can only set AVAILABLE or ON_TRIP
    if (
      payload.role === 'DISPATCHER' &&
      !DISPATCHER_ALLOWED_STATUSES.includes(status as typeof DISPATCHER_ALLOWED_STATUSES[number])
    ) {
      return NextResponse.json(
        { success: false, error: 'Dispatchers can only set status to AVAILABLE or ON_TRIP' },
        { status: 403 }
      );
    }

    // Fetch driver
    const driver = await prisma.driver.findUnique({ where: { id: params.id } });
    if (!driver)
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });

    // Dispatcher cannot assign a suspended driver to a trip
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
    console.error('[PATCH /api/drivers/:id/status]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
