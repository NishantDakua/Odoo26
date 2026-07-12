import { NextResponse } from 'next/server';
import { JWT_COOKIE_NAME } from '@/lib/constants';
import { ApiResponse } from '@/types';

export async function POST() {
  const response = NextResponse.json<ApiResponse>(
    { success: true, message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear the JWT cookie
  response.cookies.set(JWT_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // expire immediately
  });

  return response;
}
