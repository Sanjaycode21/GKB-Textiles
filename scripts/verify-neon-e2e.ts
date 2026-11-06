import prisma from '../src/lib/db';
import { verifyPassword } from '../src/lib/auth/password';

async function verifyNeonEndToEnd() {
  console.log('--- NEON POSTGRES END-TO-END VERIFICATION ---');

  // 1. Verify Super Admin User on Neon
  const user = await prisma.user.findUnique({
    where: { email: 'gkbbalu@gmail.com' }
  });

  if (!user) {
    throw new Error('Super admin gkbbalu@gmail.com not found on Neon database.');
  }

  console.log('[PASS] Super admin verified on Neon:');
  console.log(`       ID: ${user.id}, Role: ${user.role}, Status: ${user.status}`);

  // 2. Verify Password Verification
  const isPasswordValid = await verifyPassword('GkbBalu2026!', user.passwordHash || '');
  if (!isPasswordValid) {
    throw new Error('Password verification failed for gkbbalu@gmail.com.');
  }
  console.log('[PASS] Password verification against Neon password hash succeeded.');

  // 3. Test Contact Inquiry Write & Read
  const testContact = await prisma.contact.create({
    data: {
      fullName: 'End-to-End Test Lead',
      email: 'lead@test.com',
      phone: '+91 9876543210',
      subject: 'Yarn Sourcing Inquiry',
      message: 'This is a live database test on Neon Lakebase Postgres.'
    }
  });
  console.log(`[PASS] Contact write succeeded. Record ID: ${testContact.id}`);

  const fetched = await prisma.contact.findUnique({
    where: { id: testContact.id }
  });
  if (!fetched || fetched.email !== 'lead@test.com') {
    throw new Error('Failed to read created contact from Neon.');
  }
  console.log('[PASS] Contact read verification succeeded.');

  // 4. Clean up test record
  await prisma.contact.delete({
    where: { id: testContact.id }
  });
  console.log('[PASS] Test record cleanup succeeded.');

  console.log('\n========================================');
  console.log('ALL NEON SERVICES VERIFIED END-TO-END ✅');
  console.log('========================================\n');
}

verifyNeonEndToEnd()
  .catch((err) => {
    console.error('Neon end-to-end test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

