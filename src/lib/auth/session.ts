import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { generateRandomToken } from './password';
import { getClientIp } from './rate-limiter';
import { User, Session } from '@prisma/client';

export const SESSION_COOKIE_NAME = 'gkb_admin_session';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Creates a new authenticated session in the database.
 */
export async function createSession(userId: number, request?: Request): Promise<{ session: Session; token: string }> {
  const token = generateRandomToken(32);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);
  
  const ipAddress = request ? getClientIp(request) : null;
  const userAgent = request ? request.headers.get('user-agent')?.substring(0, 255) : null;

  const session = await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  return { session, token };
}

/**
 * Verifies a session token against the database.
 * Confirms that the session is not expired and the associated user account is ACTIVE.
 */
export async function verifySessionToken(token?: string | null): Promise<{ user: User; session: Session } | null> {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  // Check session expiration
  if (session.expiresAt <= new Date()) {
    try {
      await prisma.session.delete({ where: { id: session.id } });
    } catch {}
    return null;
  }

  // Check user active status
  if (session.user.status !== 'ACTIVE') {
    return null;
  }

  return { user: session.user, session };
}

/**
 * Destroys a session in the database.
 */
export async function destroySession(token: string): Promise<void> {
  if (!token) return;
  try {
    await prisma.session.delete({ where: { token } });
  } catch {}
}

/**
 * Server-side helper to retrieve the currently authenticated administrator.
 * Reads the secure session cookie from the incoming request or next/headers.
 */
export async function getAuthenticatedAdmin(request?: Request): Promise<{ user: User; session: Session } | null> {
  let token: string | undefined;

  if (request) {
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {}
  }

  return verifySessionToken(token);
}

/**
 * Returns cookie options for setting the session cookie.
 */
export function getSessionCookieOptions(maxAge: number = SESSION_MAX_AGE_SECONDS) {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

