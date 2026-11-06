import prisma from '@/lib/db';
import { getClientIp } from './rate-limiter';

export interface AuditLogParams {
  userId?: number | null;
  userEmail: string;
  action: string;
  details?: Record<string, any>;
  request?: Request;
}

/**
 * Records a security or administrative action to the AuditLog table.
 * Strips any sensitive data before saving to the database.
 */
export async function recordAuditLog({
  userId,
  userEmail,
  action,
  details,
  request,
}: AuditLogParams): Promise<void> {
  try {
    const ipAddress = request ? getClientIp(request) : null;
    const userAgent = request ? request.headers.get('user-agent')?.substring(0, 255) : null;

    // Sanitize details: never store passwords, hashes, or tokens
    let sanitizedDetails: string | null = null;
    if (details) {
      const safeObj = { ...details };
      delete safeObj.password;
      delete safeObj.passwordHash;
      delete safeObj.token;
      delete safeObj.twoFactorSecret;
      delete safeObj.twoFactorCode;
      sanitizedDetails = JSON.stringify(safeObj);
    }

    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        userEmail: userEmail.toLowerCase().trim(),
        action,
        details: sanitizedDetails,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Fail silently in production logging so audit write failures don't crash core operations
    console.error('Failed to write audit log:', error);
  }
}

