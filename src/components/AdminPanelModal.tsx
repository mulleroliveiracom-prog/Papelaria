import { useEffect, useState } from 'react';
import { Lock, RefreshCw, Save, Server, X } from 'lucide-react';
import type { AdminDashboardPayload } from '../types/studio';

interface AdminPanelModalProps {
  open: boolean;
  onClose: () => void;
}

export function AdminPanelModal({ open, onClose }: AdminPanelModalProps) {
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const [adminToken, setAdminToken] = useState<string>(() => {
    try {
      return window.sessionStorage.getItem('sonho_admin_token') ?? '';
    } catch {
      return '';
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboardPayload | null>(null);
  const [loading, setLoading] = useState(false);

  // Config draft fields (strictly non-secret configuration values)
  const [aiProvider, setAiProvider] = useState('auto');
  const [aiModel, setAiModel] = useState('gemini-3.1-flash-lite-image');
  const [cloudflareModel, setCloudflareModel] = useState('@cf/black-forest-labs/flux-2-klein-4b');
  const [paymentProvider, setPaymentProvider] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('/api/webhooks/payment');
  const [databaseDriver, setDatabaseDriver] = useState('local_persistent_json');
  const [storageDriver, setStorageDriver] = useState('local_private_fs');
  const [storageBucket, setStorageBucket] = useState('private-studio-media');
  const [retentionHours, setRetentionHours] = useState('168');
  const [configSavedMsg, setConfigSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch('/api/admin/status')
      .then((r) => r.json())
      .then((d: { initialized: boolean }) => setInitialized(d.initialized))
      .catch(() => setInitialized(true));
  }, [open]);

  const loadDashboard = async (tokenToUse: string) => {
    if (!tokenToUse) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      if (res.status === 401) {
        setAdminToken('');
        window.sessionStorage.removeItem('sonho_admin_token');
        setDashboard(null);
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as AdminDashboardPayload;
        setDashboard(data);
        setAiProvider(data.integrations.aiProvider);
        setAiModel(data.integrations.aiModel);
        setCloudflareModel(data.integrations.cloudflareModel);
        setPaymentProvider(
          data.integrations.paymentProvider === 'Não conectado'
            ? ''
            : data.integrations.paymentProvider
        );
        setWebhookUrl(data.integrations.webhookUrl);
        setDatabaseDriver(data.integrations.databaseDriver);
        setStorageDriver(data.integrations.storageDriver);
        setStorageBucket(data.integrations.storageBucket);
        setRetentionHours(String(data.integrations.retentionHours));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && adminToken) {
      loadDashboard(adminToken);
    }
  }, [open, adminToken]);

  if (!open) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const endpoint = initialized === false ? '/api/admin/setup' : '/api/admin/login';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pinInput }),
    });
    const data = (await res.json()) as { token?: string; error?: string };
    if (!res.ok || !data.token) {
      setAuthError(data.error ?? 'Falha na autenticação.');
      return;
    }
    setAdminToken(data.token);
    window.sessionStorage.setItem('sonho_admin_token', data.token);
    setPinInput('');
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSavedMsg(null);
    const res = await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        aiProvider,
        aiModel,
        cloudflareModel,
        paymentProvider,
        webhookUrl,
        databaseDriver,
        storageDriver,
        storageBucket,
        retentionHours: Number(retentionHours) || 168,
      }),
    });
    if (res.ok) {
      setConfigSavedMsg('Configuração estrutural salva no servidor.');
      loadDashboard(adminToken);
      setTimeout(() => setConfigSavedMsg(null), 3000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#3A2E2A]/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#F5EFE8] text-[#51433E] border border-[#8C7165]/25 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 sm:px-7 py-4 bg-[#F5EFE8]/95 backdrop-blur-sm border-b border-[#8C7165]/15">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#8C7165]" aria-hidden="true" />
            <h2 id="admin-modal-title" className="font-serif text-xl sm:text-2xl font-semibold">
              Painel Administrativo · Meu Bebê em um Sonho
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {adminToken && (
              <button
                type="button"
                onClick={() => loadDashboard(adminToken)}
                className="p-2 rounded-xl hover:bg-white cursor-pointer"
                aria-label="Atualizar dados"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar painel administrativo"
              className="p-2 rounded-xl hover:bg-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          {!adminToken ? (
            <form
              onSubmit={handleAuthSubmit}
              className="max-w-md mx-auto my-6 rounded-2xl bg-white border border-[#8C7165]/15 p-6 space-y-4"
            >
              <h3 className="font-serif text-2xl font-semibold text-[#51433E]">
                {initialized === false
                  ? 'Definir código de acesso do administrador'
                  : 'Entrar no painel protegido'}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B584F]">
                {initialized === false
                  ? 'Crie um código seguro (mínimo 4 caracteres) para proteger as métricas, pedidos e configurações do estúdio.'
                  : 'Digite o código administrativo configurado no servidor (ou via variável ADMIN_ACCESS_CODE).'}
              </p>

              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Código administrativo"
                className="w-full px-4 py-3 text-sm bg-[#F5EFE8] border border-[#8C7165]/25 rounded-xl"
              />

              {authError && (
                <p className="text-xs text-[#7A352E] bg-[#FBECEB] px-3 py-2 rounded-lg" role="alert">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl cursor-pointer"
              >
                {initialized === false ? 'Criar acesso administrativo' : 'Acessar painel'}
              </button>
            </form>
          ) : !dashboard ? (
            <p className="py-12 text-center text-sm text-[#6B584F]">
              Carregando métricas reais do servidor...
            </p>
          ) : (
            <div className="space-y-8">
              {/* Métricas Reais do Banco de Dados */}
              <div>
                <h3 className="font-serif text-xl font-semibold mb-3">
                  Indicadores reais da operação
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {[
                    { label: 'Pedidos criados', value: dashboard.metrics.totalOrders },
                    { label: 'Ensaios / fotos geradas', value: dashboard.metrics.totalGeneratedPhotos },
                    { label: 'Vendas confirmadas', value: dashboard.metrics.confirmedSales },
                    {
                      label: 'Faturamento confirmado',
                      value: `R$ ${(dashboard.metrics.totalRevenueCents / 100)
                        .toFixed(2)
                        .replace('.', ',')}`,
                    },
                    { label: 'Sessões criadas', value: dashboard.metrics.totalSessions },
                    { label: 'Erros de geração', value: dashboard.metrics.generationErrorsCount },
                    {
                      label: 'Pedidos de exclusão',
                      value: dashboard.metrics.deletionRequestsCount,
                    },
                    {
                      label: 'Pacote líder',
                      value:
                        [...dashboard.popularPackages].sort((a, b) => b.paidCount - a.paidCount)[0]
                          ?.paidCount > 0
                          ? [...dashboard.popularPackages].sort(
                              (a, b) => b.paidCount - a.paidCount
                            )[0].packageName
                          : 'Sem vendas ainda',
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl bg-white border border-[#8C7165]/15 p-4"
                    >
                      <p className="text-xs text-[#8C7165] mb-1">{m.label}</p>
                      <p className="font-serif text-xl sm:text-2xl font-semibold text-[#51433E] tabular-nums">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Campos Estruturais das Integrações (Sem Chaves Secretas no Navegador) */}
              <div className="rounded-2xl bg-white border border-[#8C7165]/15 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-[#8C7165]" aria-hidden="true" />
                  <h3 className="font-serif text-xl font-semibold">
                    Integrações de Produção e Segurança
                  </h3>
                </div>
                <p className="text-xs text-[#6B584F] mb-5">
                  As chaves secretas (API de IA, provedor de pagamento e segredo de webhook) são
                  lidas exclusivamente no servidor via variáveis de ambiente (nunca expostas no
                  navegador).
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 text-xs">
                  <div className="p-3 rounded-xl bg-[#F5EFE8]">
                    <p className="font-semibold text-[#51433E]">
                      Cloudflare Workers AI (Camada Gratuita)
                    </p>
                    <p className="text-[#6B584F] mt-0.5">
                      {dashboard.integrations.cloudflareConfigured
                        ? 'Conectado (10.000 Neurons/dia)'
                        : 'Aguardando CLOUDFLARE_ACCOUNT_ID e CLOUDFLARE_API_TOKEN'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5EFE8]">
                    <p className="font-semibold text-[#51433E]">Google GenAI (GEMINI_API_KEY)</p>
                    <p className="text-[#6B584F] mt-0.5">
                      {dashboard.integrations.aiConfigured
                        ? 'Conectada (imagem requer faturamento ativo)'
                        : 'Aguardando configuração no servidor'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5EFE8]">
                    <p className="font-semibold text-[#51433E]">Pagamento (PAYMENT_API_KEY)</p>
                    <p className="text-[#6B584F] mt-0.5">
                      {dashboard.integrations.paymentConfigured
                        ? `Ativo (${dashboard.integrations.paymentProvider})`
                        : 'Aguardando provedor e chave no servidor'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5EFE8]">
                    <p className="font-semibold text-[#51433E]">Armazenamento Privado</p>
                    <p className="text-[#6B584F] mt-0.5">
                      {dashboard.integrations.storageDriver} · {dashboard.integrations.retentionHours}h
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveConfig} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      Provedor de imagem
                    </label>
                    <select
                      value={aiProvider}
                      onChange={(e) => setAiProvider(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    >
                      <option value="auto">auto (Cloudflare → Google GenAI)</option>
                      <option value="cloudflare-workers-ai">cloudflare-workers-ai (FLUX.2)</option>
                      <option value="google-genai">google-genai (Nano Banana)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      Modelo Cloudflare FLUX.2
                    </label>
                    <input
                      type="text"
                      value={cloudflareModel}
                      onChange={(e) => setCloudflareModel(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      Modelo Google GenAI
                    </label>
                    <input
                      type="text"
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      Provedor de pagamento
                    </label>
                    <input
                      type="text"
                      value={paymentProvider}
                      onChange={(e) => setPaymentProvider(e.target.value)}
                      placeholder="mercadopago ou stripe"
                      className="w-full px-3 py-2 text-xs bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      URL do Webhook
                    </label>
                    <input
                      type="text"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      Driver do banco de dados
                    </label>
                    <input
                      type="text"
                      value={databaseDriver}
                      onChange={(e) => setDatabaseDriver(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      Serviço de armazenamento
                    </label>
                    <input
                      type="text"
                      value={storageDriver}
                      onChange={(e) => setStorageDriver(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      Bucket privado
                    </label>
                    <input
                      type="text"
                      value={storageBucket}
                      onChange={(e) => setStorageBucket(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B584F] mb-1">
                      Retenção automática (horas)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={retentionHours}
                      onChange={(e) => setRetentionHours(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono bg-[#F5EFE8] border border-[#8C7165]/20 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Salvar parâmetros</span>
                    </button>
                    {configSavedMsg && (
                      <span className="text-xs font-medium text-[#51433E]">{configSavedMsg}</span>
                    )}
                  </div>
                </form>
              </div>

              {/* Pedidos Recentes & Erros & Exclusões */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white border border-[#8C7165]/15 p-5">
                  <h3 className="font-serif text-lg font-semibold mb-3">
                    Pedidos e status de pagamento
                  </h3>
                  {dashboard.recentOrders.length === 0 ? (
                    <p className="text-xs text-[#8C7165]">Nenhum pedido registrado até o momento.</p>
                  ) : (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      {dashboard.recentOrders.map((o) => (
                        <div
                          key={o.orderId}
                          className="flex items-center justify-between gap-3 py-2 border-b border-[#8C7165]/10 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-[#51433E]">{o.packageName}</p>
                            <p className="font-mono text-[11px] text-[#8C7165]">
                              {o.orderId.slice(0, 8)} · {o.quota} fotos
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-medium tabular-nums">
                              R$ {(o.amountCents / 100).toFixed(2).replace('.', ',')}
                            </p>
                            <p className="text-[11px] text-[#8C7165]">{o.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-white border border-[#8C7165]/15 p-5 space-y-5">
                  <div>
                    <h3 className="font-serif text-lg font-semibold mb-2">
                      Logs recentes de erro na IA
                    </h3>
                    {dashboard.recentErrors.length === 0 ? (
                      <p className="text-xs text-[#8C7165]">Nenhum erro de geração registrado.</p>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {dashboard.recentErrors.map((err) => (
                          <div
                            key={err.id}
                            className="p-2.5 rounded-xl bg-[#FBECEB] text-[11px] text-[#7A352E]"
                          >
                            <span className="font-mono font-semibold">{err.errorCode}</span> ·{' '}
                            {err.scenarioTitle}: {err.errorMessage}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#8C7165]/12">
                    <h3 className="font-serif text-lg font-semibold mb-2">
                      Solicitações de exclusão de imagens
                    </h3>
                    {dashboard.deletionRequests.length === 0 ? (
                      <p className="text-xs text-[#8C7165]">
                        Nenhuma solicitação de exclusão registrada.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-28 overflow-y-auto">
                        {dashboard.deletionRequests.map((del) => (
                          <div
                            key={del.id}
                            className="flex items-center justify-between text-xs py-1.5 border-b border-[#8C7165]/10"
                          >
                            <span className="font-mono">{del.accessCode}</span>
                            <span className="text-[#6B584F]">{del.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
