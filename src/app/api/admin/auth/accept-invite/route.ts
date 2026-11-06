import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { createSession, getSessionCookieOptions } from '@/lib/auth/session';
import { recordAuditLog } from '@/lib/auth/audit';
import { sanitizeUser } from '@/lib/auth/permissions';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { token, password, name } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Invitation token is required.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters in length.' }, { status: 400 });
    }

    const invite = await prisma.invitation.findUnique({
      where: { token },
      include: { invitedBy: true },
    });

    if (!invite || invite.acceptedAt !== null) {
      return NextResponse.json({ error: 'This invitation is invalid or has already been accepted.' }, { status: 400 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: 'This invitation has expired. Please request a new invitation from your Super Admin.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    const passwordHash = await hashPassword(password);
    const updatedName = name && typeof name === 'string' && name.trim() ? name.trim() : user.name;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: updatedName,
        passwordHash,
        status: 'ACTIVE',
        lastLoginAt: new Date(),
      },
    });

    await prisma.invitation.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    });

    const { token: sessionToken } = await createSession(user.id, request);

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: 'USER_ACCEPTED_INVITE',
      details: { invitedBy: invite.invitedBy.email, role: user.role },
      request,
    });

    const response = NextResponse.json({
      success: true,
      user: sanitizeUser(updatedUser),
      message: 'Account activated successfully.',
    });

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, sessionToken, cookieOptions);

    return response;
  } catch (error) {
    console.error('Accept invite error:', error);
    return NextResponse.json({ error: 'Failed to complete account activation.' }, { status: 500 });
  }
}

