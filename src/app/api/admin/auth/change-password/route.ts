import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth/session';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { recordAuditLog } from '@/lib/auth/audit';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedAdmin(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
    const { user } = auth;

    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`change-password:${user.id}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many password update attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters in length.' },
        { status: 400 }
      );
    }

    // Verify current password
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Account does not have an active password configured.' },
        { status: 400 }
      );
    }

    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      await recordAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: 'PASSWORD_CHANGE_FAILED',
        details: { reason: 'Incorrect current password' },
        request,
      });

      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    // Hash and store new password
    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'PASSWORD_CHANGED',
      details: { changedBySelf: true },
      request,
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error: any) {
    console.error('Error in change-password route:', error);
    return NextResponse.json(
      { error: 'Failed to update password. Please try again.' },
      { status: 500 }
    );
  }
}
