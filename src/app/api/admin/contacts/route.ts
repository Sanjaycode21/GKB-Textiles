import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/permissions';
import { recordAuditLog } from '@/lib/auth/audit';

export const dynamic = 'force-dynamic';

/**
 * GET: Fetches all contact inquiries.
 * Requires authenticated admin with VIEW_INQUIRIES permission.
 */
export async function GET(request: Request) {
  try {
    const auth = await getAuthenticatedAdmin(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!hasPermission(auth.user, 'VIEW_INQUIRIES')) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to view inquiries.' }, { status: 403 });
    }

    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

/**
 * DELETE: Permanently removes a contact inquiry.
 * Requires authenticated admin with DELETE_INQUIRIES permission (SUPER_ADMIN or explicitly permitted staff).
 */
export async function DELETE(request: Request) {
  try {
    const auth = await getAuthenticatedAdmin(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    if (!hasPermission(auth.user, 'DELETE_INQUIRIES')) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete contact submissions.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ error: 'Missing contact ID' }, { status: 400 });
    }
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid contact ID' }, { status: 400 });
    }

    const existingContact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    await prisma.contact.delete({
      where: { id },
    });

    await recordAuditLog({
      userId: auth.user.id,
      userEmail: auth.user.email,
      action: 'INQUIRY_DELETED',
      details: {
        inquiryId: id,
        senderName: existingContact.fullName,
        subject: existingContact.subject,
      },
      request,
    });

    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
