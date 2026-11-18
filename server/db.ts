import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  AdminDashboardPayload,
  DeletionRequestEntry,
  GenerationLogEntry,
  IntegrationSettingsView,
  OrderPublicView,
  PackageId,
} from '../src/types/studio.ts';
import { PACKAGES } from '../src/types/studio.ts';

export const IS_VERCEL = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
export const PRIVATE_ROOT = IS_VERCEL
  ? path.join('/tmp', 'meu-bebe-em-um-sonho-data')
  : path.resolve(process.cwd(), '.private_data');
export const UPLOADS_DIR = path.join(PRIVATE_ROOT, 'uploads');
export const ORIGINALS_DIR = path.join(PRIVATE_ROOT, 'originals');
export const PREVIEWS_DIR = path.join(PRIVATE_ROOT, 'previews');
const DB_FILE = path.join(PRIVATE_ROOT, 'db.json');
const ADMIN_FILE = path.join(PRIVATE_ROOT, 'admin.json');

export interface StoredGeneratedPhoto {
  photoId: string;
  scenarioId: string;
  scenarioTitle: string;
  originalPath: string;
  previewPath: string;
  createdAt: string;
}

export interface StoredSession {
  sessionId: string;
  accessCode: string;
  sessionToken: string;
  consentAccepted: boolean;
  consentTimestamp?: string;
  uploadedPhotoPath?: string;
  selectedScenarioIds: string[];
  generatedPhotos: StoredGeneratedPhoto[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredOrder {
  orderId: string;
  sessionId: string;
  accessCode: string;
  packageId: PackageId;
  packageName: string;
  amountCents: number;
  quota: number;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  paymentProvider: string;
  providerConfigured: boolean;
  externalPaymentId?: string;
  checkoutUrl?: string;
  pixCopyPaste?: string;
  unlockedPhotoIds: string[];
  createdAt: string;
  paidAt?: string;
  failureReason?: string;
}

export interface RuntimeConfigOverrides {
  aiProvider: string;
  aiModel: string;
  cloudflareModel: string;
  paymentProvider: string;
  webhookUrl: string;
  databaseDriver: string;
  storageDriver: string;
  storageBucket: string;
  retentionHours: number;
}

interface DatabaseSchema {
  sessions: Record<string, StoredSession>;
  orders: Record<string, StoredOrder>;
  generationLogs: GenerationLogEntry[];
  deletionRequests: DeletionRequestEntry[];
  runtimeConfig: RuntimeConfigOverrides;
}

interface AdminAuthFile {
  pinHash: string;
  salt: string;
  activeTokens: Record<string, string>;
}

function ensureDirectories() {
  for (const dir of [PRIVATE_ROOT, UPLOADS_DIR, ORIGINALS_DIR, PREVIEWS_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

function defaultRuntimeConfig(): RuntimeConfigOverrides {
  const retentionRaw = Number(process.env.MEDIA_RETENTION_HOURS || 168);
  return {
    aiProvider: process.env.AI_IMAGE_PROVIDER || 'auto',
    aiModel: process.env.AI_IMAGE_MODEL || 'gemini-3.1-flash-lite-image',
    cloudflareModel:
      process.env.CLOUDFLARE_IMAGE_MODEL || '@cf/black-forest-labs/flux-1-schnell',
    paymentProvider: process.env.PAYMENT_PROVIDER || '',
    webhookUrl: process.env.PAYMENT_WEBHOOK_URL || '/api/webhooks/payment',
    databaseDriver: process.env.DATABASE_DRIVER || 'local_persistent_json',
    storageDriver: process.env.STORAGE_PROVIDER || 'local_private_fs',
    storageBucket: process.env.STORAGE_BUCKET || 'private-studio-media',
    retentionHours: Number.isFinite(retentionRaw) && retentionRaw > 0 ? retentionRaw : 168,
  };
}

function readDb(): DatabaseSchema {
  ensureDirectories();
  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseSchema = {
      sessions: {},
      orders: {},
      generationLogs: [],
      deletionRequests: [],
      runtimeConfig: defaultRuntimeConfig(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
  return {
    sessions: parsed.sessions ?? {},
    orders: parsed.orders ?? {},
    generationLogs: parsed.generationLogs ?? [],
    deletionRequests: parsed.deletionRequests ?? [],
    runtimeConfig: {
      ...defaultRuntimeConfig(),
      ...(parsed.runtimeConfig ?? {}),
    },
  };
}

function writeDb(db: DatabaseSchema): void {
  ensureDirectories();
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempFile, DB_FILE);
}

export function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const pick = (len: number) =>
    Array.from({ length: len }, () => chars[crypto.randomInt(0, chars.length)]).join('');
  return `SONHO-${pick(4)}-${pick(4)}`;
}

export function createSession(): StoredSession {
  const db = readDb();
  const now = new Date();
  const retentionHours = db.runtimeConfig.retentionHours || 168;
  const expiresAt = new Date(now.getTime() + retentionHours * 3600 * 1000).toISOString();

  const session: StoredSession = {
    sessionId: crypto.randomUUID(),
    accessCode: generateAccessCode(),
    sessionToken: crypto.randomBytes(24).toString('hex'),
    consentAccepted: false,
    selectedScenarioIds: [],
    generatedPhotos: [],
    expiresAt,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  db.sessions[session.sessionId] = session;
  writeDb(db);
  return session;
}

export function upsertSession(session: StoredSession): StoredSession {
  const db = readDb();
  const existing = db.sessions[session.sessionId];
  if (existing) {
    return existing;
  }
  db.sessions[session.sessionId] = session;
  writeDb(db);
  return session;
}

export function getSession(sessionId: string): StoredSession | null {
  const db = readDb();
  return db.sessions[sessionId] ?? null;
}

export function getSessionByAccessCode(accessCode: string): StoredSession | null {
  const normalized = accessCode.trim().toUpperCase();
  const db = readDb();
  return (
    Object.values(db.sessions).find((s) => s.accessCode.toUpperCase() === normalized) ?? null
  );
}

export function updateSession(
  sessionId: string,
  updater: (session: StoredSession) => StoredSession
): StoredSession | null {
  const db = readDb();
  const current = db.sessions[sessionId];
  if (!current) return null;
  const updated = updater({ ...current, updatedAt: new Date().toISOString() });
  db.sessions[sessionId] = updated;
  writeDb(db);
  return updated;
}

export function getOrdersForSession(sessionId: string): StoredOrder[] {
  const db = readDb();
  return Object.values(db.orders)
    .filter((o) => o.sessionId === sessionId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrderById(orderId: string): StoredOrder | null {
  const db = readDb();
  return db.orders[orderId] ?? null;
}

export function saveOrder(order: StoredOrder): void {
  const db = readDb();
  db.orders[order.orderId] = order;
  writeDb(db);
}

export function updateOrder(
  orderId: string,
  updater: (order: StoredOrder) => StoredOrder
): StoredOrder | null {
  const db = readDb();
  const current = db.orders[orderId];
  if (!current) return null;
  const updated = updater(current);
  db.orders[orderId] = updated;
  writeDb(db);
  return updated;
}

export function appendGenerationLog(entry: GenerationLogEntry): void {
  const db = readDb();
  db.generationLogs.unshift(entry);
  if (db.generationLogs.length > 500) {
    db.generationLogs = db.generationLogs.slice(0, 500);
  }
  writeDb(db);
}

export function deleteSessionMediaFiles(sessionId: string, reason: string): DeletionRequestEntry | null {
  const db = readDb();
  const session = db.sessions[sessionId];
  if (!session) return null;

  if (session.uploadedPhotoPath && fs.existsSync(session.uploadedPhotoPath)) {
    fs.unlinkSync(session.uploadedPhotoPath);
  }
  for (const photo of session.generatedPhotos) {
    if (photo.originalPath && fs.existsSync(photo.originalPath)) {
      fs.unlinkSync(photo.originalPath);
    }
    if (photo.previewPath && fs.existsSync(photo.previewPath)) {
      fs.unlinkSync(photo.previewPath);
    }
  }

  const origSessionDir = path.join(ORIGINALS_DIR, sessionId);
  if (fs.existsSync(origSessionDir)) {
    fs.rmSync(origSessionDir, { recursive: true, force: true });
  }
  const prevSessionDir = path.join(PREVIEWS_DIR, sessionId);
  if (fs.existsSync(prevSessionDir)) {
    fs.rmSync(prevSessionDir, { recursive: true, force: true });
  }

  session.uploadedPhotoPath = undefined;
  session.generatedPhotos = [];
  session.updatedAt = new Date().toISOString();
  db.sessions[sessionId] = session;

  const entry: DeletionRequestEntry = {
    id: crypto.randomUUID(),
    sessionId,
    accessCode: session.accessCode,
    reason: reason || 'Solicitação direta do responsável legal',
    status: 'completed',
    requestedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
  db.deletionRequests.unshift(entry);
  writeDb(db);
  return entry;
}

export function purgeExpiredMedia(): number {
  const db = readDb();
  const nowMs = Date.now();
  let purged = 0;

  for (const session of Object.values(db.sessions)) {
    const expMs = Date.parse(session.expiresAt);
    if (Number.isFinite(expMs) && expMs < nowMs) {
      if (session.uploadedPhotoPath && fs.existsSync(session.uploadedPhotoPath)) {
        fs.unlinkSync(session.uploadedPhotoPath);
        session.uploadedPhotoPath = undefined;
        purged += 1;
      }
      if (session.generatedPhotos.length > 0) {
        const origDir = path.join(ORIGINALS_DIR, session.sessionId);
        const prevDir = path.join(PREVIEWS_DIR, session.sessionId);
        if (fs.existsSync(origDir)) fs.rmSync(origDir, { recursive: true, force: true });
        if (fs.existsSync(prevDir)) fs.rmSync(prevDir, { recursive: true, force: true });
        session.generatedPhotos = [];
        purged += 1;
      }
    }
  }

  if (purged > 0) {
    writeDb(db);
  }
  return purged;
}

export function getRuntimeConfig(): RuntimeConfigOverrides {
  return readDb().runtimeConfig;
}

export function updateRuntimeConfig(
  patch: Partial<RuntimeConfigOverrides>
): RuntimeConfigOverrides {
  const db = readDb();
  db.runtimeConfig = {
    ...db.runtimeConfig,
    ...patch,
  };
  writeDb(db);
  return db.runtimeConfig;
}

export function getIntegrationStatus(): IntegrationSettingsView {
  const cfg = getRuntimeConfig();
  const paymentProvider = (process.env.PAYMENT_PROVIDER || cfg.paymentProvider || '').trim();
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
  const cloudflareConfigured = Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID?.trim() && process.env.CLOUDFLARE_API_TOKEN?.trim()
  );
  const preferred = (process.env.AI_IMAGE_PROVIDER || cfg.aiProvider || 'auto').trim();

  let activeImageProvider: 'cloudflare-workers-ai' | 'google-genai' | 'unconfigured' =
    'unconfigured';
  if (preferred === 'cloudflare-workers-ai') {
    activeImageProvider = cloudflareConfigured ? 'cloudflare-workers-ai' : 'unconfigured';
  } else if (preferred === 'google-genai') {
    activeImageProvider = geminiConfigured ? 'google-genai' : 'unconfigured';
  } else {
    activeImageProvider = cloudflareConfigured
      ? 'cloudflare-workers-ai'
      : geminiConfigured
        ? 'google-genai'
        : 'unconfigured';
  }

  return {
    aiProvider: preferred,
    aiModel: process.env.AI_IMAGE_MODEL || cfg.aiModel,
    aiConfigured: geminiConfigured,
    aiEndpointConfigured: Boolean(process.env.AI_IMAGE_ENDPOINT && process.env.AI_IMAGE_ENDPOINT.trim()),
    cloudflareConfigured,
    cloudflareModel:
      process.env.CLOUDFLARE_IMAGE_MODEL ||
      cfg.cloudflareModel ||
      '@cf/black-forest-labs/flux-1-schnell',
    activeImageProvider,
    paymentProvider: paymentProvider || 'Não conectado',
    paymentConfigured: Boolean(paymentProvider && process.env.PAYMENT_API_KEY?.trim()),
    webhookUrl: process.env.PAYMENT_WEBHOOK_URL || cfg.webhookUrl,
    webhookSecretConfigured: Boolean(process.env.PAYMENT_WEBHOOK_SECRET?.trim()),
    databaseDriver: cfg.databaseDriver,
    databaseUrlConfigured: Boolean(process.env.DATABASE_URL?.trim()),
    storageDriver: cfg.storageDriver,
    storageBucket: cfg.storageBucket,
    retentionHours: cfg.retentionHours,
  };
}

export function toOrderPublicView(order: StoredOrder): OrderPublicView {
  return {
    orderId: order.orderId,
    sessionId: order.sessionId,
    packageId: order.packageId,
    packageName: order.packageName,
    amountCents: order.amountCents,
    quota: order.quota,
    status: order.status,
    paymentProvider: order.paymentProvider,
    providerConfigured: order.providerConfigured,
    checkoutUrl: order.checkoutUrl,
    pixCopyPaste: order.pixCopyPaste,
    unlockedPhotoIds: order.unlockedPhotoIds,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    failureReason: order.failureReason,
  };
}

export function getAdminDashboardData(): AdminDashboardPayload {
  const db = readDb();
  const orders = Object.values(db.orders);
  const sessions = Object.values(db.sessions);

  const paidOrders = orders.filter((o) => o.status === 'paid');
  const totalRevenueCents = paidOrders.reduce((acc, o) => acc + o.amountCents, 0);
  const totalGeneratedPhotos = sessions.reduce((acc, s) => acc + s.generatedPhotos.length, 0);
  const generationErrors = db.generationLogs.filter((l) => l.status === 'error');

  const popularPackages = PACKAGES.map((pkg) => {
    const pkgOrders = orders.filter((o) => o.packageId === pkg.id);
    const pkgPaid = pkgOrders.filter((o) => o.status === 'paid');
    return {
      packageId: pkg.id,
      packageName: pkg.name,
      ordersCount: pkgOrders.length,
      paidCount: pkgPaid.length,
    };
  });

  return {
    metrics: {
      totalOrders: orders.length,
      totalSessions: sessions.length,
      totalGeneratedPhotos,
      confirmedSales: paidOrders.length,
      totalRevenueCents,
      generationErrorsCount: generationErrors.length,
      deletionRequestsCount: db.deletionRequests.length,
    },
    popularPackages,
    recentOrders: orders
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 30)
      .map(toOrderPublicView),
    recentErrors: generationErrors.slice(0, 30),
    deletionRequests: db.deletionRequests.slice(0, 30),
    integrations: getIntegrationStatus(),
  };
}

// --- Admin Authentication (Zero Hardcoded Secrets) ---
function readAdminFile(): AdminAuthFile | null {
  ensureDirectories();
  if (!fs.existsSync(ADMIN_FILE)) return null;
  return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8')) as AdminAuthFile;
}

function writeAdminFile(data: AdminAuthFile): void {
  ensureDirectories();
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export function isAdminInitialized(): boolean {
  if (process.env.ADMIN_ACCESS_CODE && process.env.ADMIN_ACCESS_CODE.trim()) {
    return true;
  }
  return readAdminFile() !== null;
}

export function setupAdminPin(pin: string): string {
  const existing = readAdminFile();
  if (existing || (process.env.ADMIN_ACCESS_CODE && process.env.ADMIN_ACCESS_CODE.trim())) {
    throw new Error('ADMIN_ALREADY_CONFIGURED');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const pinHash = crypto.scryptSync(pin, salt, 64).toString('hex');
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 12 * 3600 * 1000).toISOString();
  writeAdminFile({
    pinHash,
    salt,
    activeTokens: { [token]: expiresAt },
  });
  return token;
}

export function loginAdminPin(pin: string): string | null {
  const envCode = process.env.ADMIN_ACCESS_CODE?.trim();
  const data = readAdminFile() ?? { pinHash: '', salt: '', activeTokens: {} };

  if (envCode) {
    const valid =
      pin.length === envCode.length &&
      crypto.timingSafeEqual(Buffer.from(pin), Buffer.from(envCode));
    if (!valid) return null;
  } else {
    if (!data.pinHash || !data.salt) return null;
    const derived = crypto.scryptSync(pin, data.salt, 64).toString('hex');
    const valid = crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(data.pinHash));
    if (!valid) return null;
  }

  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 12 * 3600 * 1000).toISOString();
  data.activeTokens[token] = expiresAt;
  writeAdminFile(data);
  return token;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const data = readAdminFile();
  if (!data) return false;
  const exp = data.activeTokens[token];
  if (!exp) return false;
  if (Date.parse(exp) < Date.now()) {
    delete data.activeTokens[token];
    writeAdminFile(data);
    return false;
  }
  return true;
}
