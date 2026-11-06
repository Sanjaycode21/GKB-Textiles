import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createSession, getSessionCookieOptions } from '@/lib/auth/session';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';
import { recordAuditLog } from '@/lib/auth/audit';
import { sanitizeUser } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`2fa:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'Email and 2FA code are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.twoFactorCode || !user.twoFactorExpiresAt) {
      return NextResponse.json({ error: 'Invalid or expired verification session.' }, { status: 400 });
    }

    if (user.twoFactorExpiresAt < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please log in again.' }, { status: 400 });
    }

    if (user.twoFactorCode !== cleanCode) {
      await recordAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: 'TWO_FACTOR_FAILED',
        request,
      });
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 401 });
    }

    // Clear 2FA code and finalize login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: null,
        twoFactorExpiresAt: null,
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: clientIp,
      },
    });

    const { token } = await createSession(user.id, request);

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'LOGIN_SUCCESS',
      details: { method: '2FA' },
      request,
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json({ error: 'Failed to verify authentication code.' }, { status: 500 });
  }
}

