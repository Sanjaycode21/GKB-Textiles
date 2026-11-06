import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin, destroySession, SESSION_COOKIE_NAME, getSessionCookieOptions } from '@/lib/auth/session';
import { recordAuditLog } from '@/lib/auth/audit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedAdmin(request);
    
    if (auth) {
      await destroySession(auth.session.token);
      await recordAuditLog({
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: 'LOGOUT',
        request,
      });
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    
    // Clear session cookie with past expiration
    const cookieOptions = getSessionCookieOptions(0);
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      ...cookieOptions,
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to process logout.' }, { status: 500 });
  }
}

