import { db, hashPassword } from '../server/db';
import { INITIAL_USER_PROFILES, INITIAL_SECURITY_LOGS } from '../src/data/mockData';

async function seedDatabase() {
  console.log('🌱 [AuraPredict Seed] Initializing enterprise persistent data store...');

  // 1. Seed Initial User Profiles
  for (const profile of INITIAL_USER_PROFILES) {
    const existing = db.getUserByEmail(profile.email);
    if (!existing) {
      const { hash, salt } = hashPassword('AuraPredict2026!');
      await db.createUser({
        ...profile,
        passwordHash: hash,
        salt,
        lastLogin: profile.lastLogin || new Date().toISOString()
      });
      console.log(`  ✓ Seeded user account: ${profile.email} (${profile.role})`);
    } else {
      console.log(`  ℹ User already exists: ${profile.email}`);
    }
  }

  // 2. Seed Initial Audit Logs
  const existingLogs = db.getAuditLogs();
  if (existingLogs.length === 0) {
    for (const log of INITIAL_SECURITY_LOGS) {
      await db.addAuditLog({
        event: log.event,
        ipAddress: log.ipAddress,
        location: log.location,
        device: log.device,
        status: log.status
      });
    }
    console.log(`  ✓ Seeded ${INITIAL_SECURITY_LOGS.length} historical audit entries`);
  }

  console.log('✨ [AuraPredict Seed] Seed sequence completed successfully.');
}

seedDatabase().catch(err => {
  console.error('❌ Database seeding error:', err);
  process.exit(1);
});
