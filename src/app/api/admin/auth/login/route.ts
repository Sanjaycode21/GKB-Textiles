import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPassword, generateNumericOTP } from '@/lib/auth/password';
import { createSession, getSessionCookieOptions } from '@/lib/auth/session';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';
import { recordAuditLog } from '@/lib/auth/audit';
import { sanitizeUser } from '@/lib/auth/permissions';
import { sendAdminEmail, getTwoFactorEmailHtml } from '@/lib/auth/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    
    // IP-based rate limiting (10 attempts per 15 mins)
    const rateLimit = checkRateLimit(clientIp, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts from your IP. Please try again in ${rateLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Look up administrator account
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordHash) {
      await recordAuditLog({
        userEmail: normalizedEmail,
        action: 'LOGIN_FAILED',
        details: { reason: 'User not found or uninitialized' },
        request,
      });
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Check account status
    if (user.status === 'DISABLED') {
      await recordAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN_FAILED',
        details: { reason: 'Account disabled' },
        request,
      });
      return NextResponse.json(
        { error: 'This administrator account has been disabled. Please contact the Business Owner.' },
        { status: 403 }
      );
    }

    if (user.status === 'INVITED') {
      return NextResponse.json(
        { error: 'This account has not been activated yet. Please accept your invitation email to set your password.' },
        { status: 400 }
      );
    }

    // Check brute-force account lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
      await recordAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN_LOCKED',
        details: { remainingMinutes },
        request,
      });
      return NextResponse.json(
        { error: `Account temporarily locked due to multiple failed attempts. Please try again in ${remainingMinutes} minute(s).` },
        { status: 429 }
      );
    }

    // Verify password in constant time
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      const failedCount = user.failedLoginAttempts + 1;
      const willLock = failedCount >= 5;
      const lockoutUntil = willLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedCount,
          lockoutUntil,
        },
      });

      await recordAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN_FAILED',
        details: { failedAttempts: failedCount, locked: willLock },
        request,
      });

      if (willLock) {
        return NextResponse.json(
          { error: 'Too many consecutive failed login attempts. Your account is locked for 15 minutes.' },
          { status: 429 }
        );
      }

      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Two-factor authentication check
    if (user.twoFactorEnabled) {
      const otpCode = generateNumericOTP(6);
      const twoFactorExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorCode: otpCode,
          twoFactorExpiresAt,
        },
      });

      // Dispatch 2FA code email
      await sendAdminEmail({
        to: user.email,
        subject: 'Your GKB Textiles Admin Verification Code',
        html: getTwoFactorEmailHtml(otpCode, user.name),
      });

      return NextResponse.json({
        requiresTwoFactor: true,
        email: user.email,
        message: 'Two-factor authentication code sent to your email.',
      });
    }

    // Successful login: reset failed attempts & create session
    await prisma.user.update({
      where: { id: user.id },
      data: {
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
      request,
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(user),
    });

    // Set secure HttpOnly cookie
    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An unexpected authentication error occurred.' }, { status: 500 });
  }
}

