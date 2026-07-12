import { NextRequest, NextResponse } from 'next/server'; // trigger reload
import { verifyToken } from '@/lib/jwt';
import { JWT_COOKIE_NAME } from '@/lib/constants';
import { UserRole } from '@prisma/client';

// ─── Route → Role mapping ─────────────────────────────────────────────────────

const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/drivers':       ['SAFETY_OFFICER'],
  '/settings':      ['SAFETY_OFFICER'],
  '/fleet':         ['FLEET_MANAGER'],
  '/maintenance':   ['FLEET_MANAGER'],
  '/trips':         ['DISPATCHER'],
  '/dashboard':     ['DISPATCHER'],
  '/fuel-expenses': ['FINANCIAL_ANALYST'],
  '/analytics':     ['FINANCIAL_ANALYST'],
};

// ─── API Route → Role mapping ─────────────────────────────────────────────────

const API_PERMISSIONS: Record<string, UserRole[]> = {
  '/api/drivers': ['SAFETY_OFFICER', 'DISPATCHER'], // Dispatcher needs read for trip creation
};

// ─── Public paths (no auth required) ─────────────────────────────────────────

const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/_next',
  '/favicon.ico',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function getAllowedRoles(pathname: string): UserRole[] | null {
  // Check API routes first
  for (const [route, roles] of Object.entries(API_PERMISSIONS)) {
    if (pathname.startsWith(route)) return roles;
  }

  // Check page routes
  for (const [route, roles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) return roles;
  }

  return null; // no restriction defined → allow authenticated users
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths through immediately
  if (isPublic(pathname)) return NextResponse.next();

  // Read token from cookie
  const token = req.cookies.get(JWT_COOKIE_NAME)?.value;

  // Not authenticated → redirect to login (for pages) or 401 (for APIs)
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = await verifyToken(token);
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — invalid or expired token' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Root redirect → role-based home
  if (pathname === '/') {
    return roleBasedRedirect(payload.role, req);
  }

  // Check RBAC
  const allowedRoles = getAllowedRoles(pathname);
  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          success: false,
          error: `Forbidden — ${payload.role} does not have access to this resource`,
        },
        { status: 403 }
      );
    }
    // Redirect to their own home page instead of a blank 403
    return roleBasedRedirect(payload.role, req);
  }

  return NextResponse.next();
}

function roleBasedRedirect(role: UserRole, req: NextRequest) {
  const homeMap: Record<UserRole, string> = {
    SAFETY_OFFICER:   '/drivers',
    FLEET_MANAGER:    '/fleet',
    DISPATCHER:       '/dashboard',
    FINANCIAL_ANALYST: '/analytics',
  };
  return NextResponse.redirect(new URL(homeMap[role], req.url));
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (Next.js assets)
     * - _next/image  (optimized images)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
