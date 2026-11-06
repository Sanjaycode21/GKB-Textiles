import { Role, User } from '@prisma/client';

export type PermissionAction = 
  | 'VIEW_INQUIRIES'
  | 'MANAGE_INQUIRIES'
  | 'DELETE_INQUIRIES'
  | 'EXPORT_INQUIRIES'
  | 'MANAGE_USERS'
  | 'VIEW_AUDIT_LOGS';

/**
 * Checks if a user has a specific permission.
 */
export function hasPermission(user: User, action: PermissionAction): boolean {
  if (user.status !== 'ACTIVE') {
    return false;
  }

  // Super Admin has all permissions unconditionally
  if (user.role === Role.SUPER_ADMIN) {
    return true;
  }

  switch (action) {
    case 'VIEW_INQUIRIES':
    case 'MANAGE_INQUIRIES':
      return user.canManageInquiries;
      
    case 'DELETE_INQUIRIES':
      // Support Admin and Admin can only delete if explicitly granted
      return user.canDeleteInquiries;
      
    case 'EXPORT_INQUIRIES':
      return user.canExportInquiries;
      
    case 'MANAGE_USERS':
      // ONLY Super Admin can manage administrator accounts
      return false;
      
    case 'VIEW_AUDIT_LOGS':
      return user.canViewAuditLogs;
      
    default:
      return false;
  }
}

/**
 * Validates whether an actor can modify or delete a target user.
 * Implements strict Business Owner and hierarchy protection:
 * 1. Only SUPER_ADMIN can manage other users.
 * 2. Nobody can delete or demote a SUPER_ADMIN unless there are multiple SUPER_ADMINs,
 *    and a SUPER_ADMIN cannot delete themselves.
 * 3. SUPPORT_ADMIN and ADMIN cannot create, edit, or delete any SUPER_ADMIN account.
 * 4. SUPPORT_ADMIN cannot change the Business Owner's permissions.
 */
export function canManageTargetUser(actor: User, target: User, totalSuperAdminsCount: number = 1): {
  allowed: boolean;
  reason?: string;
} {
  if (actor.role !== Role.SUPER_ADMIN) {
    return {
      allowed: false,
      reason: 'Only Super Administrators can manage administrator accounts.'
    };
  }

  // Self deletion protection
  if (actor.id === target.id) {
    return {
      allowed: false,
      reason: 'You cannot delete or demote your own Super Admin account.'
    };
  }

  // Protection for last Super Admin
  if (target.role === Role.SUPER_ADMIN && totalSuperAdminsCount <= 1) {
    return {
      allowed: false,
      reason: 'Cannot remove or demote the only remaining Super Administrator.'
    };
  }

  return { allowed: true };
}

/**
 * Sanitizes a user object for client responses (removes password hashes and 2FA secrets).
 */
export function sanitizeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    canManageInquiries: user.canManageInquiries,
    canDeleteInquiries: user.canDeleteInquiries,
    canExportInquiries: user.canExportInquiries,
    canManageUsers: user.role === Role.SUPER_ADMIN,
    canViewAuditLogs: user.canViewAuditLogs || user.role === Role.SUPER_ADMIN,
    twoFactorEnabled: user.twoFactorEnabled,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

