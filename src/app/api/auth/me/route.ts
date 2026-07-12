import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { ApiResponse, SafeUser } from '@/types';

export async function GET() {
  try {
    const user = await getServerSession();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse<SafeUser>>(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/auth/me]', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
