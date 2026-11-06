import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateRandomToken } from '@/lib/auth/password';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';
import { recordAuditLog } from '@/lib/auth/audit';
import { sendAdminEmail, getPasswordResetEmailHtml } from '@/lib/auth/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`pwd_reset:${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please wait before trying again.' },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always return success even if user not found to prevent user enumeration
    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({
        success: true,
        message: 'If an active account exists with that email, a password reset link has been dispatched.',
      });
    }

    // Invalidate existing reset tokens
    await prisma.passwordReset.updateMany({
      where: { email: normalizedEmail, usedAt: null },
      data: { usedAt: new Date() },
    });

    const resetToken = generateRandomToken(32);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: {
        email: normalizedEmail,
        token: resetToken,
        expiresAt,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'PASSWORD_RESET_REQUESTED',
      request,
    });

    // Construct reset link
    const origin = request.headers.get('origin') || 'https://gkbtextiles.vercel.app';
    const resetUrl = `${origin}/admin/reset-password?token=${resetToken}`;

    await sendAdminEmail({
      to: user.email,
      subject: 'GKB Textiles: Password Reset Instructions',
      html: getPasswordResetEmailHtml(resetUrl, user.name),
    });

    return NextResponse.json({
      success: true,
      message: 'If an active account exists with that email, a password reset link has been dispatched.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}

