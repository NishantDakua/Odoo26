import { NextRequest, NextResponse } from 'next/server'; // trigger reload
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/bcrypt';
import { signToken } from '@/lib/jwt';
import { LoginSchema } from '@/lib/validators/auth';
import {
  JWT_COOKIE_NAME,
  JWT_EXPIRY_REMEMBER,
  LOCK_DURATION_MINUTES,
  LOCK_THRESHOLD,
} from '@/lib/constants';
import { ApiResponse, JWTPayload } from '@/types';

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse & validate body ──────────────────────────────────────────
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { identifier, password, rememberMe } = parsed.data;

    // ── 2. Find user — try ID first, then email ───────────────────────────
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier.toLowerCase() },
        ],
      },
    });

    if (!user) {
      // Constant-time response to prevent user enumeration via timing
      await verifyPassword('__dummy_password__', '$2b$12$KIXHnMbFMpZNpNpF3QX5DOsomethingfaketopreventtimingattack');
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ── 3. Check active status ────────────────────────────────────────────
    if (!user.isActive) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Account is disabled. Contact your administrator.' },
        { status: 403 }
      );
    }

    // ── 4. Check account lock ─────────────────────────────────────────────
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60_000
      );
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Account is locked. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
        },
        { status: 423 }
      );
    }

    // If lock has naturally expired, reset the counter so they get a fresh set of attempts
    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });
      // Reflect the reset locally so subsequent logic sees the clean state
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
    }

    // ── 5. Verify password ────────────────────────────────────────────────
    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      const newAttempts = user.failedLoginAttempts + 1;
      const shouldLock = newAttempts >= LOCK_THRESHOLD;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + LOCK_DURATION_MINUTES * 60_000)
            : null,
        },
      });

      if (shouldLock) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: `Too many failed attempts. Account locked for ${LOCK_DURATION_MINUTES} minutes.`,
          },
          { status: 423 }
        );
      }

      const remaining = LOCK_THRESHOLD - newAttempts;
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Invalid email or password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
        },
        { status: 401 }
      );
    }

    // ── 6. Success: reset failed attempts, update lastLoginAt ─────────────
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // ── 7. Sign JWT ───────────────────────────────────────────────────────
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const expiry = rememberMe ? JWT_EXPIRY_REMEMBER : '24h';
    const token = await signToken(payload, expiry);

    // ── 8. Set cookie ─────────────────────────────────────────────────────
    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Login successful',
      },
      { status: 200 }
    );

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : undefined; // 30 days or session

    response.cookies.set(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...(maxAge !== undefined && { maxAge }),
    });

    return response;
  } catch (error) {
    console.error('[POST /api/auth/login]', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
