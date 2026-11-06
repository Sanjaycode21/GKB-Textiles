import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth/session';
import { canManageTargetUser, sanitizeUser } from '@/lib/auth/permissions';
import { generateRandomToken } from '@/lib/auth/password';
import { recordAuditLog } from '@/lib/auth/audit';
import { sendAdminEmail, getInvitationEmailHtml } from '@/lib/auth/email';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';

/**
 * GET: Lists all administrators and pending invitations.
 * Only accessible to SUPER_ADMIN.
 */
export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedAdmin(request);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (auth.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Super Admin privilege required.' }, { status: 403 });
    }

    const [users, invitations] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invitation.findMany({
        where: { acceptedAt: null, expiresAt: { gt: new Date() } },
        include: { invitedBy: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      users: users.map(sanitizeUser),
      pendingInvitations: invitations.map(i => ({
        id: i.id,
        email: i.email,
        name: i.name,
        role: i.role,
        expiresAt: i.expiresAt,
        createdAt: i.createdAt,
        invitedBy: i.invitedBy.name || i.invitedBy.email,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Failed to fetch administrator records.' }, { status: 500 });
  }
}

/**
 * POST: Invites a new administrator.
 * Only accessible to SUPER_ADMIN.
 */
export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedAdmin(request);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (auth.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Super Admin privilege required.' }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, role, permissions } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    const assignedRole = role in Role ? (role as Role) : Role.ADMIN;
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An administrator account with this email already exists.' }, { status: 409 });
    }

    // Determine granular permissions based on role or overrides
    const isSuper = assignedRole === Role.SUPER_ADMIN;
    const isSupport = assignedRole === Role.SUPPORT_ADMIN;

    const canManageInquiries = isSuper ? true : Boolean(permissions?.canManageInquiries ?? isSupport);
    const canDeleteInquiries = isSuper ? true : Boolean(permissions?.canDeleteInquiries ?? false);
    const canExportInquiries = isSuper ? true : Boolean(permissions?.canExportInquiries ?? isSupport);
    const canManageUsers = isSuper;
    const canViewAuditLogs = isSuper ? true : Boolean(permissions?.canViewAuditLogs ?? isSupport);

    const inviteToken = generateRandomToken(32);
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // Create invited user and invitation record in a transaction
    const [newUser, invitation] = await prisma.$transaction([
      prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name.trim(),
          role: assignedRole,
          status: 'INVITED',
          canManageInquiries,
          canDeleteInquiries,
          canExportInquiries,
          canManageUsers,
          canViewAuditLogs,
        },
      }),
      prisma.invitation.create({
        data: {
          email: normalizedEmail,
          name: name.trim(),
          role: assignedRole,
          token: inviteToken,
          expiresAt,
          invitedById: auth.user.id,
        },
      }),
    ]);

    await recordAuditLog({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: 'USER_INVITED',
      details: { invitedEmail: normalizedEmail, role: assignedRole },
      request,
    });

    // Send invitation email
    const origin = request.headers.get('origin') || 'https://gkbtextiles.vercel.app';
    const inviteUrl = `${origin}/admin/accept-invite?token=${inviteToken}`;
    await sendAdminEmail({
      to: normalizedEmail,
      subject: 'You have been invited to GKB Textiles Admin Dashboard',
      html: getInvitationEmailHtml(inviteUrl, name.trim(), assignedRole),
    });

    return NextResponse.json({
      success: true,
      message: `Invitation successfully sent to ${normalizedEmail}.`,
      user: sanitizeUser(newUser),
      inviteToken, // Returned in dev mode for easy testing if SMTP is not configured
    });
  } catch (error) {
    console.error('Error creating admin invitation:', error);
    return NextResponse.json({ error: 'Failed to create administrator invitation.' }, { status: 500 });
  }
}

/**
 * PATCH: Updates administrator role, permissions, or status (enable/disable).
 * Only accessible to SUPER_ADMIN.
 */
export async function PATCH(request: Request) {
  try {
    const auth = await getAuthenticatedAdmin(request);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (auth.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Super Admin privilege required.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, role, status, permissions } = body;

    if (!id) {
      return NextResponse.json({ error: 'Target user ID is required.' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found.' }, { status: 404 });
    }

    const superAdminCount = await prisma.user.count({
      where: { role: Role.SUPER_ADMIN, status: 'ACTIVE' },
    });

    const check = canManageTargetUser(auth.user, targetUser, superAdminCount);
    if (!check.allowed) {
      return NextResponse.json({ error: check.reason }, { status: 403 });
    }

    const dataToUpdate: any = {};

    if (role && role in Role) {
      dataToUpdate.role = role as Role;
      if (role === Role.SUPER_ADMIN) {
        dataToUpdate.canManageInquiries = true;
        dataToUpdate.canDeleteInquiries = true;
        dataToUpdate.canExportInquiries = true;
        dataToUpdate.canManageUsers = true;
        dataToUpdate.canViewAuditLogs = true;
      }
    }

    if (status && ['ACTIVE', 'DISABLED'].includes(status)) {
      dataToUpdate.status = status;
      // If disabling account, immediately revoke all active sessions
      if (status === 'DISABLED') {
        await prisma.session.deleteMany({
          where: { userId: targetUser.id },
        });
      }
    }

    if (permissions && typeof permissions === 'object') {
      if (typeof permissions.canManageInquiries === 'boolean') dataToUpdate.canManageInquiries = permissions.canManageInquiries;
      if (typeof permissions.canDeleteInquiries === 'boolean') dataToUpdate.canDeleteInquiries = permissions.canDeleteInquiries;
      if (typeof permissions.canExportInquiries === 'boolean') dataToUpdate.canExportInquiries = permissions.canExportInquiries;
      if (typeof permissions.canViewAuditLogs === 'boolean') dataToUpdate.canViewAuditLogs = permissions.canViewAuditLogs;
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: dataToUpdate,
    });

    await recordAuditLog({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: 'USER_UPDATED',
      details: { targetUserId: targetUser.id, targetEmail: targetUser.email, updates: dataToUpdate },
      request,
    });

    return NextResponse.json({
      success: true,
      message: 'Administrator account updated successfully.',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update administrator account.' }, { status: 500 });
  }
}

/**
 * DELETE: Revokes and removes an administrator account or pending invitation.
 * Only accessible to SUPER_ADMIN.
 */
export async function DELETE(request: Request) {
  try {
    const auth = await getAuthenticatedAdmin(request);
    if (!auth) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (auth.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Super Admin privilege required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const inviteId = searchParams.get('inviteId');

    // Case 1: Cancel pending invitation
    if (inviteId) {
      const invite = await prisma.invitation.findUnique({
        where: { id: Number(inviteId) },
      });
      if (invite) {
        await prisma.invitation.delete({ where: { id: invite.id } });
        // Also remove placeholder user if still INVITED
        await prisma.user.deleteMany({
          where: { email: invite.email, status: 'INVITED' },
        });
      }
      return NextResponse.json({ success: true, message: 'Invitation revoked successfully.' });
    }

    // Case 2: Delete existing administrator
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Administrator account not found.' }, { status: 404 });
    }

    const superAdminCount = await prisma.user.count({
      where: { role: Role.SUPER_ADMIN, status: 'ACTIVE' },
    });

    const check = canManageTargetUser(auth.user, targetUser, superAdminCount);
    if (!check.allowed) {
      return NextResponse.json({ error: check.reason }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: targetUser.id },
    });

    await recordAuditLog({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: 'USER_DELETED',
      details: { deletedEmail: targetUser.email, deletedRole: targetUser.role },
      request,
    });

    return NextResponse.json({ success: true, message: 'Administrator account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting administrator:', error);
    return NextResponse.json({ error: 'Failed to delete administrator account.' }, { status: 500 });
  }
}

