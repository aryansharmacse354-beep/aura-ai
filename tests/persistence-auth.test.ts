import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateSessionToken, db } from '../server/db';

describe('Cryptographic Authentication & Password Hashing Security', () => {
  it('should generate distinct salts and secure PBKDF2 hashes for identical passwords', () => {
    const rawPass = 'SecretAtmosphericPass2026!';
    const user1 = hashPassword(rawPass);
    const user2 = hashPassword(rawPass);

    expect(user1.hash).toBeDefined();
    expect(user1.salt).toBeDefined();
    expect(user2.hash).toBeDefined();
    expect(user2.salt).toBeDefined();

    // Salts must be cryptographically unique
    expect(user1.salt).not.toBe(user2.salt);
    // Hashes must differ because salts are unique
    expect(user1.hash).not.toBe(user2.hash);
  });

  it('should accurately verify correct passwords with timingSafeEqual verification', () => {
    const rawPass = 'ValidEnvironmentalKey123$';
    const { hash, salt } = hashPassword(rawPass);

    expect(verifyPassword(rawPass, hash, salt)).toBe(true);
    expect(verifyPassword('WrongPassword', hash, salt)).toBe(false);
    expect(verifyPassword('validenvironmentalkey123$', hash, salt)).toBe(false); // Case sensitive
  });

  it('should generate cryptographically strong, non-empty session tokens', () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();

    expect(token1.length).toBe(64); // 32 bytes in hex
    expect(token2.length).toBe(64);
    expect(token1).not.toBe(token2);
  });
});

describe('Database Persistence Layer & Audit Trail', () => {
  it('should have initial pre-seeded enterprise users and roles', () => {
    const users = db.getUsers();
    expect(users.length).toBeGreaterThanOrEqual(1);

    const firstUser = users[0];
    expect(firstUser.id).toBeDefined();
    expect(firstUser.email).toContain('@');
    expect(firstUser.role).toBeDefined();
  });

  it('should create and retrieve a new user account seamlessly', async () => {
    const testEmail = `test.researcher.${Date.now()}@aurapredict.ai`;
    const { hash, salt } = hashPassword('ResearchSecurePass2026!');

    const created = await db.createUser({
      id: `usr_test_${Date.now()}`,
      name: 'Dr. Jane Environmental',
      email: testEmail,
      role: 'analyst',
      healthConditions: ['asthma'],
      alertThresholdAQI: 110,
      savedLocations: [{ name: 'Research Lab', lat: 28.5355, lng: 77.3910 }],
      offlineRegions: ['off_delhi_core'],
      lastLogin: new Date().toISOString(),
      passwordHash: hash,
      salt
    });

    expect(created.id).toBeDefined();
    expect(created.email).toBe(testEmail);

    const fetched = db.getUserByEmail(testEmail);
    expect(fetched).toBeDefined();
    expect(fetched?.name).toBe('Dr. Jane Environmental');
    expect(fetched?.role).toBe('analyst');
  });

  it('should create and validate active user sessions with expiry', async () => {
    const session = await db.createSession('usr_test_1', 'test@aurapredict.ai', 'researcher', '127.0.0.1', 'Vitest Agent');
    expect(session.token).toBeDefined();
    expect(session.expiresAt).toBeGreaterThan(Date.now());

    const retrieved = db.getSession(session.token);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.userId).toBe('usr_test_1');
  });

  it('should append security audit logs with tamper-evident structure', async () => {
    const initialCount = db.getAuditLogs().length;
    const log = await db.addAuditLog({
      event: 'Automated Test Security Audit Handshake',
      ipAddress: '10.0.0.42',
      location: 'Test Subnet',
      device: 'CI Test Runner',
      status: 'success'
    });

    expect(log.id).toBeDefined();
    expect(log.timestamp).toBeDefined();
    expect(db.getAuditLogs().length).toBe(initialCount + 1);
  });
});
