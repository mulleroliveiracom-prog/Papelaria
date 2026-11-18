import dotenv from 'dotenv';
dotenv.config({ override: true });
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import express from 'express';
import JSZip from 'jszip';
import { createServer as createViteServer } from 'vite';
import {
  appendGenerationLog,
  createSession,
  deleteSessionMediaFiles,
  getAdminDashboardData,
  getIntegrationStatus,
  getOrderById,
  getOrdersForSession,
  getSession,
  getSessionByAccessCode,
  isAdminInitialized,
  loginAdminPin,
  purgeExpiredMedia,
  saveOrder,
  setupAdminPin,
  toOrderPublicView,
  updateOrder,
  updateRuntimeConfig,
  updateSession,
  verifyAdminToken,
  type StoredOrder,
  type StoredSession,
} from './server/db.ts';
import { saveSanitizedUpload } from './server/watermark.ts';
import { generateNewbornPhotosWithAI } from './server/ai.ts';
import { createCheckoutForOrder, verifyWebhookSignature } from './server/payments.ts';
import { PACKAGES, type PackageId, type SessionPublicView } from './src/types/studio.ts';

function getAppBaseUrl(req: express.Request): string {
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl) return envUrl.replace(/\/+$/, '');
  const proto = req.header('x-forwarded-proto') || req.protocol || 'http';
  const host = req.header('x-forwarded-host') || req.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

function buildSessionPublicView(session: StoredSession): SessionPublicView {
  const orders = getOrdersForSession(session.sessionId);
  const paidOrder = orders.find((o) => o.status === 'paid') ?? null;
  const latestOrder = paidOrder ?? orders[0] ?? null;
  const unlockedSet = new Set(paidOrder ? paidOrder.unlockedPhotoIds : []);

  return {
    sessionId: session.sessionId,
    accessCode: session.accessCode,
    sessionToken: session.sessionToken,
    consentAccepted: session.consentAccepted,
    consentTimestamp: session.consentTimestamp,
    hasUploadedPhoto: Boolean(
      session.uploadedPhotoPath && fs.existsSync(session.uploadedPhotoPath)
    ),
    selectedScenarioIds: session.selectedScenarioIds,
    generatedPhotos: session.generatedPhotos.map((p) => ({
      photoId: p.photoId,
      scenarioId: p.scenarioId,
      scenarioTitle: p.scenarioTitle,
      createdAt: p.createdAt,
      unlocked: unlockedSet.has(p.photoId),
    })),
    activeOrder: latestOrder ? toOrderPublicView(latestOrder) : null,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
  };
}

function getBearerOrQueryToken(req: express.Request): string | undefined {
  const auth = req.header('authorization');
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  const q = req.query.token;
  return typeof q === 'string' ? q.trim() : undefined;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '16mb' }));

  // Run periodic expiration cleanup on startup and every 30 minutes
  purgeExpiredMedia();
  setInterval(() => {
    purgeExpiredMedia();
  }, 30 * 60 * 1000).unref();

  // --- Health & Public Integration Capability Check ---
  app.get('/api/health', (_req, res) => {
    const status = getIntegrationStatus();
    res.json({
      ok: true,
      aiConfigured: status.aiConfigured,
      cloudflareConfigured: status.cloudflareConfigured,
      activeImageProvider: status.activeImageProvider,
      aiProvider: status.aiProvider,
      paymentConfigured: status.paymentConfigured,
      retentionHours: status.retentionHours,
    });
  });

  // --- Session Creation & Recovery ---
  app.post('/api/sessions', (_req, res) => {
    const session = createSession();
    res.status(201).json(buildSessionPublicView(session));
  });

  app.get('/api/sessions/:sessionId', (req, res) => {
    const token = getBearerOrQueryToken(req);
    const session = getSession(req.params.sessionId);
    if (!session || !token || session.sessionToken !== token) {
      res.status(401).json({ error: 'Sessão inválida ou expirada.' });
      return;
    }
    res.json(buildSessionPublicView(session));
  });

  app.post('/api/sessions/recover', (req, res) => {
    const accessCode = String(req.body?.accessCode ?? '').trim();
    if (!accessCode) {
      res.status(400).json({ error: 'Informe o código de acesso do ensaio.' });
      return;
    }
    const session = getSessionByAccessCode(accessCode);
    if (!session) {
      res.status(404).json({
        error: 'Nenhum ensaio encontrado com esse código. Verifique as letras e tente novamente.',
      });
      return;
    }
    res.json(buildSessionPublicView(session));
  });

  // --- Secure Upload (Requires Legal Guardian Consent + EXIF Stripping) ---
  app.post('/api/sessions/:sessionId/upload', async (req, res) => {
    const token = String(req.body?.token ?? getBearerOrQueryToken(req) ?? '');
    const consentAccepted = Boolean(req.body?.consentAccepted);
    const imageBase64Raw = String(req.body?.imageBase64 ?? '');

    const session = getSession(req.params.sessionId);
    if (!session || session.sessionToken !== token) {
      res.status(401).json({ error: 'Sessão não autorizada.' });
      return;
    }

    if (!consentAccepted) {
      res.status(400).json({
        error:
          'É obrigatório confirmar a autorização do responsável legal antes de enviar a fotografia.',
      });
      return;
    }

    const base64Clean = imageBase64Raw.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    if (!base64Clean || base64Clean.length < 100) {
      res.status(400).json({ error: 'Selecione uma imagem válida do rostinho do bebê.' });
      return;
    }

    try {
      const buffer = Buffer.from(base64Clean, 'base64');
      if (buffer.byteLength > 12 * 1024 * 1024) {
        res.status(400).json({ error: 'A imagem deve ter no máximo 12 MB.' });
        return;
      }

      const savedPath = await saveSanitizedUpload(session.sessionId, buffer);
      const updated = updateSession(session.sessionId, (curr) => ({
        ...curr,
        consentAccepted: true,
        consentTimestamp: curr.consentTimestamp ?? new Date().toISOString(),
        uploadedPhotoPath: savedPath,
      }));

      res.json(buildSessionPublicView(updated!));
    } catch {
      res.status(400).json({
        error: 'Não foi possível ler o arquivo de imagem. Envie uma foto JPG ou PNG nítida.',
      });
    }
  });

  // Serve sanitized reference photo strictly to session token owner
  app.get('/api/media/upload/:sessionId', (req, res) => {
    const token = getBearerOrQueryToken(req);
    const session = getSession(req.params.sessionId);
    if (!session || !token || session.sessionToken !== token) {
      res.status(401).json({ error: 'Acesso não autorizado.' });
      return;
    }
    if (!session.uploadedPhotoPath || !fs.existsSync(session.uploadedPhotoPath)) {
      res.status(404).json({ error: 'Imagem não encontrada.' });
      return;
    }
    res.setHeader('Cache-Control', 'private, no-store');
    res.sendFile(session.uploadedPhotoPath);
  });

  // --- Real AI Photo Generation ---
  app.post('/api/sessions/:sessionId/generate', async (req, res) => {
    const token = String(req.body?.token ?? getBearerOrQueryToken(req) ?? '');
    const scenarioIds = Array.isArray(req.body?.scenarioIds)
      ? req.body.scenarioIds.map(String)
      : [];

    const session = getSession(req.params.sessionId);
    if (!session || session.sessionToken !== token) {
      res.status(401).json({ error: 'Sessão não autorizada.' });
      return;
    }
    if (!session.consentAccepted || !session.uploadedPhotoPath) {
      res.status(400).json({
        error: 'Envie a fotografia com autorização do responsável antes de gerar o ensaio.',
      });
      return;
    }

    const orders = getOrdersForSession(session.sessionId);
    const paidOrder = orders.find((o) => o.status === 'paid');
    const maxAllowed = paidOrder ? Math.max(3, paidOrder.quota) : 3;

    if (scenarioIds.length === 0 || scenarioIds.length > maxAllowed) {
      res.status(400).json({
        error: `Selecione entre 1 e ${maxAllowed} cenários para esta etapa.`,
      });
      return;
    }

    updateSession(session.sessionId, (curr) => ({
      ...curr,
      selectedScenarioIds: scenarioIds,
    }));

    const result = await generateNewbornPhotosWithAI(
      session.sessionId,
      session.uploadedPhotoPath,
      scenarioIds
    );

    if (result.generated.length > 0) {
      updateSession(session.sessionId, (curr) => ({
        ...curr,
        generatedPhotos: [...curr.generatedPhotos, ...result.generated],
      }));
    }

    if (!result.ok) {
      const statusCode =
        result.errorCode === 'AI_NOT_CONFIGURED' || result.errorCode === 'AI_BILLING_REQUIRED'
          ? 503
          : 502;
      res.status(statusCode).json({
        error: result.errorMessage,
        errorCode: result.errorCode,
        session: buildSessionPublicView(getSession(session.sessionId)!),
      });
      return;
    }

    res.json(buildSessionPublicView(getSession(session.sessionId)!));
  });

  // --- Watermarked Preview Delivery (Token-Authenticated, Never High-Res Unwatermarked) ---
  app.get('/api/media/preview/:sessionId/:photoId', (req, res) => {
    const token = getBearerOrQueryToken(req);
    const session = getSession(req.params.sessionId);
    if (!session || !token || session.sessionToken !== token) {
      res.status(401).json({ error: 'Acesso não autorizado.' });
      return;
    }

    const photo = session.generatedPhotos.find((p) => p.photoId === req.params.photoId);
    if (!photo || !fs.existsSync(photo.previewPath)) {
      res.status(404).json({ error: 'Prévia não encontrada.' });
      return;
    }

    res.setHeader('Cache-Control', 'private, max-age=300');
    res.sendFile(photo.previewPath);
  });

  // --- Original High-Resolution Delivery (Strictly Requires Confirmed Paid Order & Photo Quota) ---
  app.get('/api/media/original/:sessionId/:photoId', (req, res) => {
    const token = getBearerOrQueryToken(req);
    const session = getSession(req.params.sessionId);
    if (!session || !token || session.sessionToken !== token) {
      res.status(401).json({ error: 'Acesso não autorizado.' });
      return;
    }

    const orders = getOrdersForSession(session.sessionId);
    const paidOrder = orders.find((o) => o.status === 'paid');
    if (!paidOrder) {
      res.status(403).json({
        error: 'As imagens em alta resolução são liberadas somente após a confirmação do pagamento.',
      });
      return;
    }

    if (!paidOrder.unlockedPhotoIds.includes(req.params.photoId)) {
      res.status(403).json({
        error: 'Esta fotografia não está selecionada entre as fotos desbloqueadas do seu pacote.',
      });
      return;
    }

    const photo = session.generatedPhotos.find((p) => p.photoId === req.params.photoId);
    if (!photo || !fs.existsSync(photo.originalPath)) {
      res.status(404).json({ error: 'Arquivo original não encontrado.' });
      return;
    }

    res.setHeader('Cache-Control', 'private, no-store');
    if (req.query.download === '1') {
      const safeTitle = photo.scenarioId.replace(/[^a-z0-9-]/gi, '-');
      res.download(photo.originalPath, `meu-bebe-em-um-sonho-${safeTitle}.png`);
      return;
    }
    res.sendFile(photo.originalPath);
  });

  // --- Download All Unlocked Photos in One ZIP (Authenticated + Paid Only) ---
  app.get('/api/orders/:orderId/download-all', async (req, res) => {
    const token = getBearerOrQueryToken(req);
    const order = getOrderById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado.' });
      return;
    }

    const session = getSession(order.sessionId);
    if (!session || !token || session.sessionToken !== token) {
      res.status(401).json({ error: 'Acesso não autorizado.' });
      return;
    }

    if (order.status !== 'paid') {
      res.status(403).json({ error: 'Pagamento ainda não confirmado para este pedido.' });
      return;
    }

    const zip = new JSZip();
    const allowedIds = order.unlockedPhotoIds.slice(0, order.quota);

    let count = 0;
    for (const photoId of allowedIds) {
      const photo = session.generatedPhotos.find((p) => p.photoId === photoId);
      if (photo && fs.existsSync(photo.originalPath)) {
        const buffer = fs.readFileSync(photo.originalPath);
        count += 1;
        zip.file(`${String(count).padStart(2, '0')}-${photo.scenarioId}.png`, buffer);
      }
    }

    if (count === 0) {
      res.status(404).json({ error: 'Nenhuma foto desbloqueada disponível para compactação.' });
      return;
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="meu-bebe-em-um-sonho-${order.orderId.slice(0, 8)}.zip"`
    );
    res.send(zipBuffer);
  });

  // --- Create Order & Checkout Integration ---
  app.post('/api/orders', async (req, res) => {
    const token = String(req.body?.token ?? getBearerOrQueryToken(req) ?? '');
    const sessionId = String(req.body?.sessionId ?? '');
    const packageId = String(req.body?.packageId ?? '') as PackageId;

    const session = getSession(sessionId);
    if (!session || session.sessionToken !== token) {
      res.status(401).json({ error: 'Sessão não autorizada.' });
      return;
    }

    const pkg = PACKAGES.find((p) => p.id === packageId);
    if (!pkg) {
      res.status(400).json({ error: 'Pacote inválido.' });
      return;
    }

    const order: StoredOrder = {
      orderId: crypto.randomUUID(),
      sessionId: session.sessionId,
      accessCode: session.accessCode,
      packageId: pkg.id,
      packageName: pkg.name,
      amountCents: pkg.priceCents,
      quota: pkg.photoCount,
      status: 'pending',
      paymentProvider: 'pendente',
      providerConfigured: false,
      unlockedPhotoIds: [],
      createdAt: new Date().toISOString(),
    };

    const checkout = await createCheckoutForOrder(order, pkg, getAppBaseUrl(req));
    order.paymentProvider = checkout.paymentProvider;
    order.providerConfigured = checkout.providerConfigured;
    order.checkoutUrl = checkout.checkoutUrl;
    order.pixCopyPaste = checkout.pixCopyPaste;
    order.externalPaymentId = checkout.externalPaymentId;
    order.failureReason = checkout.errorMessage;

    saveOrder(order);

    res.status(201).json({
      order: toOrderPublicView(order),
      session: buildSessionPublicView(session),
    });
  });

  // Check Order Status (Never unlocks unless order.status === 'paid' via webhook!)
  app.get('/api/orders/:orderId', (req, res) => {
    const token = getBearerOrQueryToken(req);
    const order = getOrderById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado.' });
      return;
    }
    const session = getSession(order.sessionId);
    if (!session || !token || session.sessionToken !== token) {
      res.status(401).json({ error: 'Acesso não autorizado.' });
      return;
    }
    res.json({
      order: toOrderPublicView(order),
      session: buildSessionPublicView(session),
    });
  });

  // Choose which specific photos to unlock up to exact package quota (3, 8, or 15)
  app.post('/api/orders/:orderId/select-photos', (req, res) => {
    const token = String(req.body?.token ?? getBearerOrQueryToken(req) ?? '');
    const photoIds = Array.isArray(req.body?.photoIds) ? req.body.photoIds.map(String) : [];
    const order = getOrderById(req.params.orderId);

    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado.' });
      return;
    }

    const session = getSession(order.sessionId);
    if (!session || session.sessionToken !== token) {
      res.status(401).json({ error: 'Acesso não autorizado.' });
      return;
    }

    if (order.status !== 'paid') {
      res.status(403).json({
        error: 'A seleção de fotos para desbloqueio só é permitida após confirmação do pagamento.',
      });
      return;
    }

    const validSessionPhotoIds = new Set(session.generatedPhotos.map((p) => p.photoId));
    const uniqueValid: string[] = Array.from(
      new Set<string>(photoIds.map((id: unknown) => String(id)))
    ).filter((id) => validSessionPhotoIds.has(id));

    if (uniqueValid.length > order.quota) {
      res.status(400).json({
        error: `Seu pacote libera exatamente até ${order.quota} fotos.`,
      });
      return;
    }

    const updatedOrder = updateOrder(order.orderId, (curr) => ({
      ...curr,
      unlockedPhotoIds: uniqueValid,
    }));

    res.json({
      order: toOrderPublicView(updatedOrder!),
      session: buildSessionPublicView(session),
    });
  });

  // --- Demo Payment Webhook Simulator (Active ONLY when no real PAYMENT_API_KEY is configured) ---
  app.post('/api/orders/:orderId/demo-confirm', (req, res) => {
    if (process.env.PAYMENT_API_KEY?.trim()) {
      res.status(403).json({
        error: 'Confirmação de demonstração desativada quando o gateway de pagamento real está conectado.',
      });
      return;
    }

    const token = String(req.body?.token ?? getBearerOrQueryToken(req) ?? '');
    const order = getOrderById(req.params.orderId);
    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado.' });
      return;
    }

    const session = getSession(order.sessionId);
    if (!session || session.sessionToken !== token) {
      res.status(401).json({ error: 'Sessão não autorizada.' });
      return;
    }

    const autoUnlockIds =
      order.unlockedPhotoIds.length > 0
        ? order.unlockedPhotoIds.slice(0, order.quota)
        : session.generatedPhotos.slice(0, order.quota).map((p) => p.photoId);

    const updated = updateOrder(order.orderId, (curr) => ({
      ...curr,
      status: 'paid',
      paymentProvider: 'modo_demonstrativo',
      paidAt: curr.paidAt ?? new Date().toISOString(),
      unlockedPhotoIds: autoUnlockIds,
    }));

    res.json({
      ok: true,
      order: toOrderPublicView(updated!),
      session: buildSessionPublicView(getSession(session.sessionId)!),
    });
  });

  // --- Payment Provider Confirmation Webhook ---
  app.post('/api/webhooks/payment', (req, res) => {
    const providedSecret = req.header('x-webhook-secret');
    if (!verifyWebhookSignature(providedSecret)) {
      res.status(401).json({ error: 'Assinatura de webhook inválida ou não configurada.' });
      return;
    }

    const orderId = String(
      req.body?.orderId ?? req.body?.external_reference ?? req.body?.data?.object?.client_reference_id ?? ''
    );
    const eventStatus = String(req.body?.status ?? 'paid').toLowerCase();

    if (!orderId) {
      res.status(400).json({ error: 'orderId ausente no webhook.' });
      return;
    }

    const order = getOrderById(orderId);
    if (!order) {
      res.status(404).json({ error: 'Pedido não encontrado.' });
      return;
    }

    const session = getSession(order.sessionId);
    if (!session) {
      res.status(404).json({ error: 'Sessão vinculada não encontrada.' });
      return;
    }

    if (eventStatus === 'paid' || eventStatus === 'approved') {
      const autoUnlockIds =
        order.unlockedPhotoIds.length > 0
          ? order.unlockedPhotoIds.slice(0, order.quota)
          : session.generatedPhotos.slice(0, order.quota).map((p) => p.photoId);

      const updated = updateOrder(order.orderId, (curr) => ({
        ...curr,
        status: 'paid',
        paidAt: curr.paidAt ?? new Date().toISOString(),
        externalPaymentId:
          String(req.body?.externalPaymentId ?? curr.externalPaymentId ?? '') || undefined,
        unlockedPhotoIds: autoUnlockIds,
      }));

      res.json({ ok: true, order: toOrderPublicView(updated!) });
      return;
    }

    if (eventStatus === 'failed' || eventStatus === 'rejected') {
      const updated = updateOrder(order.orderId, (curr) => ({
        ...curr,
        status: 'failed',
        failureReason: String(req.body?.reason ?? 'Pagamento recusado pelo provedor.'),
      }));
      res.json({ ok: true, order: toOrderPublicView(updated!) });
      return;
    }

    res.json({ ok: true, status: order.status });
  });

  // --- Permanent Media Deletion (Child Privacy Protection) ---
  app.delete('/api/sessions/:sessionId/media', (req, res) => {
    const token = getBearerOrQueryToken(req);
    const session = getSession(req.params.sessionId);
    if (!session || !token || session.sessionToken !== token) {
      res.status(401).json({ error: 'Sessão não autorizada.' });
      return;
    }

    const reason =
      typeof req.query.reason === 'string'
        ? req.query.reason
        : 'Exclusão solicitada pelo responsável legal';
    const deletion = deleteSessionMediaFiles(session.sessionId, reason);
    const refreshed = getSession(session.sessionId);

    res.json({
      ok: true,
      deletion,
      session: refreshed ? buildSessionPublicView(refreshed) : null,
    });
  });

  // --- Protected Admin Endpoints ---
  app.get('/api/admin/status', (_req, res) => {
    res.json({ initialized: isAdminInitialized() });
  });

  app.post('/api/admin/setup', (req, res) => {
    const pin = String(req.body?.pin ?? '').trim();
    if (pin.length < 4) {
      res.status(400).json({ error: 'Defina um código administrativo de pelo menos 4 caracteres.' });
      return;
    }
    try {
      const token = setupAdminPin(pin);
      res.json({ token });
    } catch {
      res.status(409).json({ error: 'O código administrativo já foi configurado.' });
    }
  });

  app.post('/api/admin/login', (req, res) => {
    const pin = String(req.body?.pin ?? '').trim();
    const token = loginAdminPin(pin);
    if (!token) {
      res.status(401).json({ error: 'Código administrativo inválido.' });
      return;
    }
    res.json({ token });
  });

  app.get('/api/admin/dashboard', (req, res) => {
    const token = getBearerOrQueryToken(req);
    if (!verifyAdminToken(token)) {
      res.status(401).json({ error: 'Acesso administrativo não autenticado.' });
      return;
    }
    res.json(getAdminDashboardData());
  });

  app.patch('/api/admin/config', (req, res) => {
    const token = getBearerOrQueryToken(req);
    if (!verifyAdminToken(token)) {
      res.status(401).json({ error: 'Acesso administrativo não autenticado.' });
      return;
    }

    const body = req.body ?? {};
    const retentionRaw = Number(body.retentionHours);
    updateRuntimeConfig({
      ...(typeof body.aiProvider === 'string' ? { aiProvider: body.aiProvider.trim() } : {}),
      ...(typeof body.aiModel === 'string' ? { aiModel: body.aiModel.trim() } : {}),
      ...(typeof body.cloudflareModel === 'string'
        ? { cloudflareModel: body.cloudflareModel.trim() }
        : {}),
      ...(typeof body.paymentProvider === 'string'
        ? { paymentProvider: body.paymentProvider.trim() }
        : {}),
      ...(typeof body.webhookUrl === 'string' ? { webhookUrl: body.webhookUrl.trim() } : {}),
      ...(typeof body.databaseDriver === 'string'
        ? { databaseDriver: body.databaseDriver.trim() }
        : {}),
      ...(typeof body.storageDriver === 'string'
        ? { storageDriver: body.storageDriver.trim() }
        : {}),
      ...(typeof body.storageBucket === 'string'
        ? { storageBucket: body.storageBucket.trim() }
        : {}),
      ...(Number.isFinite(retentionRaw) && retentionRaw >= 1
        ? { retentionHours: retentionRaw }
        : {}),
    });

    res.json({
      ok: true,
      integrations: getIntegrationStatus(),
    });
  });

  // Note: Log server startup readiness cleanly without leaking secrets
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Rota de API não encontrada.' });
  });

  // Suppress unused import warning if any
  void appendGenerationLog;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Meu Bebê em um Sonho server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
