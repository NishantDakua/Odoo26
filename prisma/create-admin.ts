/**
 * Run once to create/reset the Safety Officer test account.
 * Usage: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/create-admin.ts
 */
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'safety@transitops.com' },
    update: { passwordHash, failedLoginAttempts: 0, lockedUntil: null, isActive: true },
    create: {
      name: 'Safety Officer',
      email: 'safety@transitops.com',
      passwordHash,
      role: UserRole.SAFETY_OFFICER,
      isActive: true,
    },
  });

  console.log('✅ User ready:');
  console.log('   Email   :', user.email);
  console.log('   Password: password123');
  console.log('   Role    :', user.role);
  console.log('   ID      :', user.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
