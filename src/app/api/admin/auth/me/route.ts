import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/session';
import { sanitizeUser } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedAdmin(request);

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: sanitizeUser(auth.user),
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}

