import { cookies } from 'next/headers'; // trigger reload
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { JWT_COOKIE_NAME } from '@/lib/constants';
import { SafeUser } from '@/types';

/**
 * Reads the JWT cookie and returns the authenticated user from the DB.
 * Returns null if unauthenticated or token is invalid/expired.
 */
export async function getServerSession(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    if (!user || !user.isActive) return null;
    return user as SafeUser;
  } catch {
    return null;
  }
}
