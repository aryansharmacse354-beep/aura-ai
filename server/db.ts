import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { UserProfile, SecurityAuditLog, PolicySimulationResult } from '../src/types';
import { INITIAL_USER_PROFILES, INITIAL_SECURITY_LOGS } from '../src/data/mockData';

export interface UserAccount extends UserProfile {
  passwordHash: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface UserSession {
  token: string;
  userId: string;
  email: string;
  role: string;
  expiresAt: number; // epoch ms
  ip?: string;
  userAgent?: string;
  authMethod?: 'password' | 'session';
}

export interface StoredRouteRecord {
  id: string;
  userId: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  exposureReductionPct: number;
  waypoints: Array<{ lat: number; lng: number; aqi: number }>;
  createdAt: string;
}

export interface DatabaseSchema {
  version: number;
  users: UserAccount[];
  sessions: UserSession[];
  auditLogs: SecurityAuditLog[];
  savedSimulations: Array<{
    id: string;
    userId: string;
    cityId: string;
    cityName: string;
    timestamp: string;
    result: PolicySimulationResult;
  }>;
  savedRoutes: StoredRouteRecord[];
}

const DATA_DIR = process.env.DATA_DIR 
  ? path.resolve(process.env.DATA_DIR) 
  : process.env.VERCEL 
  ? path.join('/tmp', 'aura-data')
  : path.join(process.cwd(), 'data');

const DB_FILE = path.join(DATA_DIR, 'aurapredict_database.json');
const DB_BACKUP_FILE = path.join(DATA_DIR, 'aurapredict_database.bak.json');

// PBKDF2 Password Hashing Utility
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Generate Initial Seed Accounts with Secure Password Hashes
function createDefaultUserAccounts(): UserAccount[] {
  const now = new Date().toISOString();
  
  return INITIAL_USER_PROFILES.map((profile, index) => {
    // Default system credentials: User's role + 2026! (e.g., AuraPredict2026!)
    const defaultPassword = 'AuraPredict2026!';
    const { hash, salt } = hashPassword(defaultPassword);

    return {
      ...profile,
      passwordHash: hash,
      salt,
      createdAt: now,
      updatedAt: now,
      lastLogin: now
    };
  });
}

export class PersistentDatabase {
  private data: DatabaseSchema;
  private isLoaded = false;
  private writeLock = false;

  constructor() {
    this.data = {
      version: 1,
      users: [],
      sessions: [],
      auditLogs: INITIAL_SECURITY_LOGS,
      savedSimulations: [],
      savedRoutes: []
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.isLoaded = true;
      } else {
        // First run seed
        this.data.users = createDefaultUserAccounts();
        this.data.auditLogs = INITIAL_SECURITY_LOGS;
        this.persistSync();
        this.isLoaded = true;
      }
    } catch (err) {
      console.warn('[Database] Failed to read primary DB, attempting backup:', err);
      try {
        if (fs.existsSync(DB_BACKUP_FILE)) {
          const rawBackup = fs.readFileSync(DB_BACKUP_FILE, 'utf-8');
          this.data = JSON.parse(rawBackup);
          this.isLoaded = true;
        } else {
          this.data.users = createDefaultUserAccounts();
          this.data.auditLogs = INITIAL_SECURITY_LOGS;
          this.persistSync();
          this.isLoaded = true;
        }
      } catch (backupErr) {
        console.error('[Database Fatal] Database backup corrupted, initializing defaults:', backupErr);
        this.data.users = createDefaultUserAccounts();
        this.data.auditLogs = INITIAL_SECURITY_LOGS;
        this.isLoaded = true;
      }
    }
  }

  // Atomic Persistence with rotating backup
  public async persist(): Promise<void> {
    if (this.writeLock) {
      return;
    }
    this.writeLock = true;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const serialized = JSON.stringify(this.data, null, 2);
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      
      await fs.promises.writeFile(tempPath, serialized, 'utf-8');

      if (fs.existsSync(DB_FILE)) {
        try {
          await fs.promises.copyFile(DB_FILE, DB_BACKUP_FILE);
        } catch {}
      }

      await fs.promises.rename(tempPath, DB_FILE);
    } catch (err) {
      console.error('[Database Error] Failed to persist state:', err);
    } finally {
      this.writeLock = false;
    }
  }

  private persistSync(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const serialized = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(DB_FILE, serialized, 'utf-8');
    } catch (err) {
      console.error('[Database Sync Error] Failed initial seed write:', err);
    }
  }

  // --- Users ---
  public getUsers(): UserAccount[] {
    return this.data.users;
  }

  public getUserById(id: string): UserAccount | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): UserAccount | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public async createUser(account: Omit<UserAccount, 'createdAt' | 'updatedAt' | 'lastLogin'>): Promise<UserAccount> {
    const now = new Date().toISOString();
    const newUser: UserAccount = {
      ...account,
      createdAt: now,
      updatedAt: now,
      lastLogin: now
    };
    this.data.users.push(newUser);
    await this.persist();
    return newUser;
  }

  public async updateUser(id: string, updates: Partial<UserAccount>): Promise<UserAccount | null> {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    const existing = this.data.users[index];
    const updated: UserAccount = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.users[index] = updated;
    await this.persist();
    return updated;
  }

  // --- Sessions ---
  public async createSession(
    userId: string, 
    email: string, 
    role: string, 
    ip?: string, 
    userAgent?: string,
    authMethod: 'password' | 'session' = 'password'
  ): Promise<UserSession> {
    const token = generateSessionToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    const session: UserSession = {
      token,
      userId,
      email,
      role,
      expiresAt,
      ip,
      userAgent,
      authMethod
    };
    // Purge expired sessions
    this.data.sessions = this.data.sessions.filter(s => s.expiresAt > Date.now());
    this.data.sessions.push(session);
    await this.persist();
    return session;
  }

  public getSession(token: string): UserSession | null {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return null;
    if (session.expiresAt <= Date.now()) {
      this.deleteSession(token);
      return null;
    }
    return session;
  }

  public async deleteSession(token: string): Promise<boolean> {
    const initialLen = this.data.sessions.length;
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    if (this.data.sessions.length !== initialLen) {
      await this.persist();
      return true;
    }
    return false;
  }

  // --- Security Audit Logs ---
  public getAuditLogs(): SecurityAuditLog[] {
    return this.data.auditLogs;
  }

  public async addAuditLog(log: Omit<SecurityAuditLog, 'id' | 'timestamp'>): Promise<SecurityAuditLog> {
    const newLog: SecurityAuditLog = {
      id: `sec-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.auditLogs.unshift(newLog);
    // Keep max 500 logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    await this.persist();
    return newLog;
  }

  // --- Policy Simulations Persistence ---
  public getSavedSimulations(userId?: string) {
    if (userId) {
      return this.data.savedSimulations.filter(s => s.userId === userId);
    }
    return this.data.savedSimulations;
  }

  public async saveSimulation(userId: string, cityId: string, cityName: string, result: PolicySimulationResult) {
    const record = {
      id: `sim-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      userId,
      cityId,
      cityName,
      timestamp: new Date().toISOString(),
      result
    };
    this.data.savedSimulations.unshift(record);
    if (this.data.savedSimulations.length > 100) {
      this.data.savedSimulations = this.data.savedSimulations.slice(0, 100);
    }
    await this.persist();
    return record;
  }

  // --- Clean Route Navigator Persistence ---
  public getSavedRoutes(userId?: string) {
    if (userId) {
      return this.data.savedRoutes.filter(r => r.userId === userId);
    }
    return this.data.savedRoutes;
  }

  public async saveRoute(route: Omit<StoredRouteRecord, 'id' | 'createdAt'>) {
    const record: StoredRouteRecord = {
      id: `route-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      createdAt: new Date().toISOString(),
      ...route
    };
    this.data.savedRoutes.unshift(record);
    if (this.data.savedRoutes.length > 100) {
      this.data.savedRoutes = this.data.savedRoutes.slice(0, 100);
    }
    await this.persist();
    return record;
  }
}

// Global Singleton Instance
export const db = new PersistentDatabase();
