import { PrismaClient, Role, UserStatus } from '@prisma/client';
import crypto from 'crypto';

// Inlined scrypt hashing matching src/lib/auth/password.ts
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
  return `${salt}:${derivedKey.toString('hex')}`;
}

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = args[1] || process.env.SUPER_ADMIN_PASSWORD || '';
  const name = (args[2] || process.env.SUPER_ADMIN_NAME || 'Business Owner').trim();

  if (!email || !email.includes('@')) {
    console.error('Error: Please provide a valid email address.');
    console.log('Usage: npm run seed:admin <email> <password> [name]');
    console.log('Example: npm run seed:admin owner@gkbtextiles.com StrongPassword123! "G. Balakrishnan"');
    process.exit(1);
  }

  if (!password || password.length < 8) {
    console.error('Error: Password must be at least 8 characters in length.');
    process.exit(1);
  }

  console.log(`Connecting to database to provision Super Admin account for: ${email}...`);

  const passwordHash = await hashPassword(password);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`User ${email} already exists. Upgrading to SUPER_ADMIN...`);
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        role: Role.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        name,
        passwordHash,
        canManageInquiries: true,
        canDeleteInquiries: true,
        canExportInquiries: true,
        canManageUsers: true,
        canViewAuditLogs: true,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: updated.id,
        userEmail: updated.email,
        action: 'SUPER_ADMIN_PROVISIONED',
        details: JSON.stringify({ method: 'CLI Seed Script', updatedExisting: true }),
      },
    });

    console.log('Super Admin account updated successfully!');
  } else {
    const created = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: Role.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        canManageInquiries: true,
        canDeleteInquiries: true,
        canExportInquiries: true,
        canManageUsers: true,
        canViewAuditLogs: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: created.id,
        userEmail: created.email,
        action: 'SUPER_ADMIN_PROVISIONED',
        details: JSON.stringify({ method: 'CLI Seed Script', createdNew: true }),
      },
    });

    console.log('Super Admin account created successfully!');
  }

  console.log('\n--- Account Details ---');
  console.log('Email:', email);
  console.log('Name:', name);
  console.log('Role:', Role.SUPER_ADMIN);
  console.log('Status: ACTIVE');
  console.log('Permissions: Full administrative & inquiry management privileges');
  console.log('------------------------\n');
}

main()
  .catch((err) => {
    console.error('Seed script error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

