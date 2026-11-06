import { hashPassword, verifyPassword, generateRandomToken, generateNumericOTP } from '../src/lib/auth/password';
import { hasPermission, canManageTargetUser, sanitizeUser, PermissionAction } from '../src/lib/auth/permissions';
import { checkRateLimit } from '../src/lib/auth/rate-limiter';
import { Role, UserStatus, User } from '@prisma/client';

async function runSecurityTests() {
  console.log('--- STARTING AUTH & RBAC SECURITY TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Password Hashing & Timing-Safe Verification
  console.log('\n[TEST GROUP 1] Password Hashing & Verification');
  const password = 'SuperSecretPassword@2026!';
  const hash = await hashPassword(password);
  assert(hash.length > 50 && hash.includes(':'), 'Password hashed with salt:key scrypt format');
  
  const isValid = await verifyPassword(password, hash);
  assert(isValid === true, 'Correct password verifies successfully');

  const isInvalid = await verifyPassword('WrongPassword123!', hash);
  assert(isInvalid === false, 'Wrong password rejected');

  const token = generateRandomToken(32);
  assert(token.length === 64, 'Random token has proper length (32 bytes hex = 64 chars)');

  const otp = generateNumericOTP(6);
  assert(otp.length === 6 && /^\d{6}$/.test(otp), '6-digit OTP generated correctly');

  // 2. Role-Based Access Control (RBAC) Permissions Matrix
  console.log('\n[TEST GROUP 2] RBAC Permission Matrix');
  
  const baseUser = {
    passwordHash: 'dummy',
    twoFactorSecret: null,
    twoFactorExpires: null,
    invitedBy: null,
    failedLoginAttempts: 0,
    lockoutUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const superAdminUser: User = {
    ...baseUser,
    id: 'usr-super',
    email: 'owner@gkbtextiles.com',
    name: 'Owner',
    role: Role.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    twoFactorEnabled: false,
    canManageInquiries: true,
    canDeleteInquiries: true,
    canExportInquiries: true,
    canManageUsers: true,
    canViewAuditLogs: true,
  };

  const supportAdminUser: User = {
    ...baseUser,
    id: 'usr-support',
    email: 'zockle@agency.com',
    name: 'Support Team',
    role: Role.SUPPORT_ADMIN,
    status: UserStatus.ACTIVE,
    twoFactorEnabled: false,
    canManageInquiries: true,
    canDeleteInquiries: false, // Per prompt: cannot delete unless explicitly permitted
    canExportInquiries: true,
    canManageUsers: false,
    canViewAuditLogs: false,
  };

  const staffAdminUser: User = {
    ...baseUser,
    id: 'usr-staff',
    email: 'staff@gkbtextiles.com',
    name: 'Staff Member',
    role: Role.ADMIN,
    status: UserStatus.ACTIVE,
    twoFactorEnabled: false,
    canManageInquiries: true,
    canDeleteInquiries: false,
    canExportInquiries: false,
    canManageUsers: false,
    canViewAuditLogs: false,
  };

  // Check Inquiries Permissions
  assert(hasPermission(superAdminUser, 'VIEW_INQUIRIES') === true, 'SUPER_ADMIN can view contacts');
  assert(hasPermission(superAdminUser, 'DELETE_INQUIRIES') === true, 'SUPER_ADMIN can delete contacts');
  assert(hasPermission(superAdminUser, 'EXPORT_INQUIRIES') === true, 'SUPER_ADMIN can export contacts');

  assert(hasPermission(supportAdminUser, 'VIEW_INQUIRIES') === true, 'SUPPORT_ADMIN can view contacts');
  assert(hasPermission(supportAdminUser, 'EXPORT_INQUIRIES') === true, 'SUPPORT_ADMIN can export contacts');
  assert(hasPermission(supportAdminUser, 'DELETE_INQUIRIES') === false, 'SUPPORT_ADMIN CANNOT delete contacts');

  assert(hasPermission(staffAdminUser, 'VIEW_INQUIRIES') === true, 'ADMIN can view contacts');
  assert(hasPermission(staffAdminUser, 'EXPORT_INQUIRIES') === false, 'ADMIN CANNOT export contacts');
  assert(hasPermission(staffAdminUser, 'DELETE_INQUIRIES') === false, 'ADMIN CANNOT delete contacts');

  // Check Revoked / Disabled and Invited Account Permissions
  const disabledUser: User = { ...superAdminUser, status: UserStatus.DISABLED };
  const invitedUser: User = { ...superAdminUser, status: UserStatus.INVITED };
  assert(hasPermission(disabledUser, 'VIEW_INQUIRIES') === false, 'DISABLED user cannot view contacts even if Super Admin');
  assert(hasPermission(disabledUser, 'MANAGE_USERS') === false, 'DISABLED user cannot manage users');
  assert(hasPermission(invitedUser, 'VIEW_INQUIRIES') === false, 'INVITED (unactivated) user has no access');

  // Check Admin Management Permissions
  assert(hasPermission(superAdminUser, 'MANAGE_USERS') === true, 'SUPER_ADMIN can manage admins');
  assert(hasPermission(supportAdminUser, 'MANAGE_USERS') === false, 'SUPPORT_ADMIN CANNOT manage admins');
  assert(hasPermission(staffAdminUser, 'MANAGE_USERS') === false, 'ADMIN CANNOT manage admins');

  // Check Audit Log Permissions
  assert(hasPermission(superAdminUser, 'VIEW_AUDIT_LOGS') === true, 'SUPER_ADMIN can view audit logs');
  assert(hasPermission(supportAdminUser, 'VIEW_AUDIT_LOGS') === false, 'SUPPORT_ADMIN CANNOT view audit logs');
  assert(hasPermission(staffAdminUser, 'VIEW_AUDIT_LOGS') === false, 'ADMIN CANNOT view audit logs');

  // 3. Hierarchy & Business Owner Protection
  console.log('\n[TEST GROUP 3] Hierarchy & Privilege Escalation Protection');
  
  // SUPPORT_ADMIN attempting to modify SUPER_ADMIN
  const supportModifyingOwner = canManageTargetUser(supportAdminUser, superAdminUser, 'delete');
  assert(supportModifyingOwner.allowed === false, 'SUPPORT_ADMIN cannot delete Business Owner');

  // SUPPORT_ADMIN attempting to modify another SUPPORT_ADMIN
  const supportModifyingPeer = canManageTargetUser(supportAdminUser, { ...supportAdminUser, id: 'peer' }, 'edit');
  assert(supportModifyingPeer.allowed === false, 'SUPPORT_ADMIN cannot edit other administrators');

  // SUPER_ADMIN deleting self
  const ownerDeletingSelf = canManageTargetUser(superAdminUser, superAdminUser, 'delete');
  assert(ownerDeletingSelf.allowed === false, 'SUPER_ADMIN cannot delete own account');

  // SUPER_ADMIN modifying another staff user
  const ownerManagingStaff = canManageTargetUser(superAdminUser, staffAdminUser, 'edit');
  assert(ownerManagingStaff.allowed === true, 'SUPER_ADMIN can manage regular staff');

  // 4. Rate Limiter Sliding Window Logic
  console.log('\n[TEST GROUP 4] Sliding Window IP Rate Limiter');
  const testIp = '192.168.1.100';
  const prefix = 'test-security-suite';
  
  // Set limit to 3 requests in 10 seconds
  const r1 = checkRateLimit(`${prefix}:${testIp}`, 3, 10000);
  assert(r1.allowed === true && r1.remaining === 2, 'Rate limiter passes 1st request');

  const r2 = checkRateLimit(`${prefix}:${testIp}`, 3, 10000);
  assert(r2.allowed === true && r2.remaining === 1, 'Rate limiter passes 2nd request');

  const r3 = checkRateLimit(`${prefix}:${testIp}`, 3, 10000);
  assert(r3.allowed === true && r3.remaining === 0, 'Rate limiter passes 3rd request');

  const r4 = checkRateLimit(`${prefix}:${testIp}`, 3, 10000);
  assert(r4.allowed === false, 'Rate limiter blocks 4th request (limit exceeded)');

  // 5. Data Sanitization
  console.log('\n[TEST GROUP 5] User Data Sanitization');
  const userWithSensitiveInfo = {
    ...superAdminUser,
    passwordHash: 'secret_hash',
    twoFactorSecret: 'secret_otp_key',
    twoFactorExpires: new Date(),
  };
  const sanitized: any = sanitizeUser(userWithSensitiveInfo);
  assert(sanitized.passwordHash === undefined, 'passwordHash omitted from sanitized output');
  assert(sanitized.twoFactorSecret === undefined, 'twoFactorSecret omitted from sanitized output');
  assert(sanitized.twoFactorExpires === undefined, 'twoFactorExpires omitted from sanitized output');
  assert(sanitized.email === superAdminUser.email, 'Safe user attributes preserved');

  console.log(`\n================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
