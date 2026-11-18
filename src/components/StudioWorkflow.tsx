import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  Check,
  Copy,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import { SCENARIO_THUMBNAILS } from '../data/demoShowcase';
import { SCENARIOS, type SessionPublicView } from '../types/studio';

interface StudioWorkflowProps {
  session: SessionPublicView | null;
  isCreatingSession: boolean;
  activeImageProvider: 'cloudflare-workers-ai' | 'google-genai' | 'unconfigured';
  onUploadPhoto: (consentAccepted: boolean, imageBase64: string) => Promise<void>;
  onGeneratePhotos: (scenarioIds: string[]) => Promise<{ ok: boolean; error?: string }>;
  onRecoverSession: (accessCode: string) => Promise<{ ok: boolean; error?: string }>;
  onDeleteSessionMedia: () => Promise<void>;
  recoverModalOpen: boolean;
  onCloseRecoverModal: () => void;
  onOpenRecoverModal: () => void;
}

const PROCESSING_PHRASES = [
  'Estamos preparando algo especial...',
  'Seu pequeno está prestes a ganhar um ensaio encantador.',
  'Finalizando os detalhes do cenário...',
];

async function compressImageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Arquivo de imagem inválido'));
      img.onload = () => {
        const maxSide = 1280;
        let width = img.width;
        let height = img.height;
        if (width > maxSide || height > maxSide) {
          if (width >= height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Contexto gráfico indisponível'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function StudioWorkflow({
  session,
  isCreatingSession,
  activeImageProvider,
  onUploadPhoto,
  onGeneratePhotos,
  onRecoverSession,
  onDeleteSessionMedia,
  recoverModalOpen,
  onCloseRecoverModal,
  onOpenRecoverModal,
}: StudioWorkflowProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState<boolean>(
    Boolean(session?.consentAccepted)
  );
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(
    session?.selectedScenarioIds?.length
      ? session.selectedScenarioIds
      : ['ursinho-dos-sonhos', 'nuvem-de-algodao']
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [recoverCodeInput, setRecoverCodeInput] = useState('');
  const [recoverError, setRecoverError] = useState<string | null>(null);
  const [recovering, setRecovering] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState(false);
  const [scenarioFilter, setScenarioFilter] = useState<'all' | 'classic' | 'premium'>('all');
  const [failedThumbIds, setFailedThumbIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (session?.consentAccepted) {
      setConsentAccepted(true);
    }
    if (session?.selectedScenarioIds && session.selectedScenarioIds.length > 0) {
      setSelectedScenarios(session.selectedScenarioIds);
    }
  }, [session?.consentAccepted, session?.selectedScenarioIds]);

  useEffect(() => {
    if (!generating) return;
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % PROCESSING_PHRASES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [generating]);

  const paidOrder = session?.activeOrder?.status === 'paid' ? session.activeOrder : null;
  const maxSelectableScenarios = paidOrder ? Math.max(3, paidOrder.quota) : 3;

  const hasPhotoReady = Boolean(session?.hasUploadedPhoto || localPreview);
  const hasGenerated = Boolean(session && session.generatedPhotos.length > 0);
  const currentStep = generating ? 3 : hasGenerated ? 3 : hasPhotoReady && consentAccepted ? 2 : 1;

  const serverUploadUrl =
    session?.hasUploadedPhoto && session.sessionToken
      ? `/api/media/upload/${session.sessionId}?token=${encodeURIComponent(session.sessionToken)}&v=${encodeURIComponent(session.consentTimestamp ?? '1')}`
      : null;

  const displayPreviewSrc = localPreview ?? serverUploadUrl;

  const handleFilePicked = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (!consentAccepted) {
      setUploadError(
        'Por favor, marque a caixa de autorização do responsável legal antes de enviar a fotografia.'
      );
      return;
    }

    setUploading(true);
    try {
      const base64 = await compressImageFileToBase64(file);
      setLocalPreview(base64);
      await onUploadPhoto(true, base64);
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : 'Não foi possível carregar a foto selecionada.'
      );
    } finally {
      setUploading(false);
    }
  };

  const toggleScenario = (scenarioId: string) => {
    setGenerationError(null);
    setSelectedScenarios((prev) => {
      if (prev.includes(scenarioId)) {
        return prev.filter((id) => id !== scenarioId);
      }
      if (prev.length >= maxSelectableScenarios) {
        return [...prev.slice(1), scenarioId];
      }
      return [...prev, scenarioId];
    });
  };

  const handleStartGeneration = async () => {
    if (!hasPhotoReady || !consentAccepted) {
      setGenerationError('Envie uma foto nítida com autorização marcada na Etapa 1.');
      return;
    }
    if (selectedScenarios.length === 0) {
      setGenerationError('Escolha pelo menos 1 cenário para criar o ensaio.');
      return;
    }

    setGenerationError(null);
    setGenerating(true);
    setPhraseIndex(0);

    const res = await onGeneratePhotos(selectedScenarios);
    setGenerating(false);

    if (!res.ok) {
      setGenerationError(
        res.error ?? 'Não foi possível concluir a geração do ensaio. Tente novamente.'
      );
    }
  };

  const handleCopyAccessCode = async () => {
    if (!session?.accessCode) return;
    try {
      await navigator.clipboard.writeText(session.accessCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2400);
    } catch {
      setCopiedCode(false);
    }
  };

  const handleRecoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError(null);
    setRecovering(true);
    const res = await onRecoverSession(recoverCodeInput);
    setRecovering(false);
    if (res.ok) {
      setLocalPreview(null);
      setRecoverCodeInput('');
      onCloseRecoverModal();
    } else {
      setRecoverError(res.error ?? 'Código não encontrado.');
    }
  };

  const handleDeleteAll = async () => {
    setDeletingMedia(true);
    await onDeleteSessionMedia();
    setLocalPreview(null);
    setDeletingMedia(false);
  };

  return (
    <section id="criar-ensaio" className="py-14 sm:py-20 bg-[#F5EFE8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Barra de sessão segura e recuperação */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-white border border-[#8C7165]/15">
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-[#51433E]">
            <ShieldCheck className="w-4 h-4 text-[#8C7165] shrink-0" aria-hidden="true" />
            <span>Código do seu ensaio:</span>
            <strong className="font-mono text-[#51433E] tabular-nums">
              {isCreatingSession ? 'Gerando...' : session?.accessCode ?? '—'}
            </strong>
            {session?.accessCode && (
              <button
                type="button"
                onClick={handleCopyAccessCode}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#51433E] bg-[#F5EFE8] hover:bg-[#EBCFD1]/40 rounded-lg transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenRecoverModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#51433E] hover:bg-[#F5EFE8] rounded-lg transition-colors cursor-pointer min-h-[40px]"
            >
              <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Recuperar por código</span>
            </button>

            {(session?.hasUploadedPhoto || hasGenerated) && (
              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={deletingMedia}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#8C4A3E] hover:bg-[#FBECEB] rounded-lg transition-colors cursor-pointer min-h-[40px]"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{deletingMedia ? 'Excluindo...' : 'Excluir fotos'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Barra de Progresso das 3 Etapas */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2">
            {[
              { step: 1, label: '1. Envie uma foto' },
              { step: 2, label: '2. Escolha o cenário' },
              { step: 3, label: '3. Geração com IA' },
            ].map((item) => {
              const active = currentStep >= item.step;
              return (
                <div key={item.step} className="space-y-1.5">
                  <div
                    className={`h-2 rounded-full transition-colors ${
                      active ? 'bg-[#51433E]' : 'bg-[#8C7165]/20'
                    }`}
                  />
                  <p
                    className={`text-[11px] sm:text-xs font-medium ${
                      active ? 'text-[#51433E]' : 'text-[#8C7165]'
                    }`}
                  >
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ETAPA 1 — ENVIE UMA FOTO */}
        <div className="rounded-3xl bg-white border border-[#8C7165]/15 p-5 sm:p-8 mb-6 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#8C7165] mb-1.5">
            Etapa 1 · Fotografia de referência
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#51433E] mb-2">
            Vamos criar algo lindo para seu bebê?
          </h2>
          <p className="text-sm sm:text-base text-[#6B584F] max-w-2xl mb-6">
            Envie uma foto nítida do rostinho do seu pequeno. Nossa inteligência artificial utilizará
            a imagem como referência para criar um ensaio fotográfico personalizado.
          </p>

          {/* Caixa de Autorização do Responsável Legal */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#F5EFE8] border border-[#8C7165]/20 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => {
                setConsentAccepted(e.target.checked);
                setUploadError(null);
              }}
              className="mt-1 w-5 h-5 accent-[#51433E] rounded cursor-pointer shrink-0"
            />
            <span className="text-xs sm:text-sm text-[#51433E] leading-relaxed">
              Confirmo que sou responsável legal pelo bebê ou tenho autorização dos responsáveis para
              enviar esta fotografia e solicitar sua edição.
            </span>
          </label>

          {/* Inputs ocultos para galeria e câmera Android/iOS */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFilePicked(e.target.files?.[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => handleFilePicked(e.target.files?.[0])}
          />

          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-4 text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] disabled:opacity-60 rounded-2xl transition-colors cursor-pointer min-h-[52px]"
                >
                  <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{displayPreviewSrc ? 'Substituir foto' : 'Selecionar imagem'}</span>
                </button>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-4 text-sm font-semibold text-[#51433E] bg-[#EBCFD1]/55 hover:bg-[#EBCFD1]/80 disabled:opacity-60 rounded-2xl transition-colors cursor-pointer min-h-[52px]"
                >
                  <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Tirar foto pelo celular</span>
                </button>
              </div>

              {uploading && (
                <p className="text-xs font-medium text-[#8C7165]" role="status">
                  Preparando e protegendo a fotografia com remoção automática de metadados...
                </p>
              )}

              {uploadError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FBECEB] border border-[#C97B72]/30 text-xs sm:text-sm text-[#7A352E]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="pt-2">
                <p className="text-xs font-semibold text-[#51433E] mb-2">
                  Orientações para um resultado mais fiel:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#6B584F]">
                  <li>• Foto com o rosto visível</li>
                  <li>• Boa iluminação</li>
                  <li>• Sem filtros</li>
                  <li>• Preferencialmente sem outras pessoas na imagem</li>
                </ul>
              </div>

              <p className="text-xs text-[#8C7165] leading-relaxed">
                A foto será utilizada exclusivamente para gerar o ensaio e não será publicada nem
                utilizada para treinamento de modelos.
              </p>
            </div>

            {/* Pré-visualização da foto enviada */}
            <div className="md:col-span-5">
              <div className="aspect-square max-w-[260px] mx-auto rounded-2xl border border-dashed border-[#8C7165]/35 bg-[#F5EFE8]/70 overflow-hidden flex flex-col items-center justify-center text-center p-4">
                {displayPreviewSrc ? (
                  <img
                    src={displayPreviewSrc}
                    alt="Prévia da foto de referência enviada pelo responsável"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="space-y-2 text-[#8C7165]">
                    <Camera className="w-8 h-8 mx-auto opacity-70" aria-hidden="true" />
                    <p className="text-xs font-medium">
                      A pré-visualização da foto enviada aparecerá aqui
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ETAPA 2 — ESCOLHA O CENÁRIO */}
        <div className="rounded-3xl bg-white border border-[#8C7165]/15 p-5 sm:p-8 mb-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8C7165] mb-1.5">
                Etapa 2 · Cenários encantadores
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#51433E]">
                Qual desses sonhos você gostaria de criar?
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#8C7165] tabular-nums whitespace-nowrap shrink-0">
              {selectedScenarios.length} de {maxSelectableScenarios} cenários selecionados
            </p>
          </div>

          {/* Filtros do catálogo: Clássicos e Exclusivos */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div
              role="tablist"
              aria-label="Filtrar cenários por coleção"
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#F5EFE8] border border-[#8C7165]/15 w-fit"
            >
              {(
                [
                  { id: 'all', label: `Todos (${SCENARIOS.length})` },
                  {
                    id: 'classic',
                    label: `Clássicos (${SCENARIOS.filter((s) => !s.isPremium).length})`,
                  },
                  {
                    id: 'premium',
                    label: `Exclusivos (${SCENARIOS.filter((s) => s.isPremium).length})`,
                  },
                ] as const
              ).map((tab) => {
                const active = scenarioFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setScenarioFilter(tab.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[38px] ${
                      active
                        ? 'bg-white text-[#51433E] shadow-xs'
                        : 'text-[#6B584F] hover:text-[#51433E]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-[#8C7165]">
              Prévia gratuita com marca-d&apos;água em todos os cenários · Alta resolução nos pacotes
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
            {SCENARIOS.filter((sc) => {
              if (scenarioFilter === 'classic') return !sc.isPremium;
              if (scenarioFilter === 'premium') return Boolean(sc.isPremium);
              return true;
            }).map((sc) => {
              const selected = selectedScenarios.includes(sc.id);
              const thumb = SCENARIO_THUMBNAILS[sc.id];
              const thumbFailed = Boolean(failedThumbIds[sc.id]) || !thumb;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => toggleScenario(sc.id)}
                  aria-pressed={selected}
                  className={`group text-left rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                    selected
                      ? 'border-[#51433E] ring-2 ring-[#C6A477] bg-[#F5EFE8]'
                      : 'border-[#8C7165]/15 bg-[#F5EFE8]/45 hover:border-[#8C7165]/40'
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EDE4DA]">
                    {thumbFailed ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#F5EFE8] to-[#E6D9CC]">
                        <Camera className="w-6 h-6 text-[#8C7165] mb-2" aria-hidden="true" />
                        <span className="font-serif text-sm font-semibold text-[#51433E]">
                          {sc.title}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={thumb}
                        alt={sc.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedThumbIds((prev) => ({ ...prev, [sc.id]: true }))
                        }
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    )}

                    {sc.isPremium && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#3A2E2A]/85 border border-[#C6A477]/55 text-[10px] font-semibold uppercase tracking-wider text-[#F5EFE8]">
                        Exclusivo
                      </span>
                    )}

                    {selected && (
                      <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#51433E] text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="font-serif text-base font-semibold text-[#51433E] leading-tight mb-1">
                      {sc.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#6B584F] line-clamp-2">
                      {sc.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ETAPA 3 — GERAÇÃO REAL DAS FOTOS */}
          <div className="pt-6 border-t border-[#8C7165]/15">
            {generating ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl bg-[#F5EFE8] border border-[#C6A477]/40 p-6 sm:p-8 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#EBCFD1] text-[#51433E] flex items-center justify-center mx-auto mb-4 animate-breathe">
                  <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                </div>
                <p className="font-serif text-xl sm:text-2xl font-semibold text-[#51433E] mb-2">
                  {PROCESSING_PHRASES[phraseIndex]}
                </p>
                <p className="text-xs sm:text-sm text-[#6B584F] max-w-md mx-auto">
                  Aguardando o retorno verdadeiro da inteligência artificial no servidor e aplicando
                  proteção automática de prévia.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4">
                {activeImageProvider === 'unconfigured' && !generationError && (
                  <div className="w-full max-w-2xl text-left flex items-start gap-3 p-4 rounded-2xl bg-[#F5EFE8] border border-[#C6A477]/45 text-xs sm:text-sm text-[#51433E]">
                    <ShieldCheck className="w-5 h-5 text-[#8C7165] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="font-semibold">Ambiente em modo demonstrativo</p>
                      <p className="leading-relaxed text-[#6B584F]">
                        A geração personalizada não cria cópias nem imagens falsas sem cota ativa de
                        IA. Para habilitar edição real por instruções, conecte a camada gratuita da
                        Cloudflare Workers AI (10.000 Neurons/dia com FLUX.2) ou uma chave Gemini
                        com faturamento no servidor.
                      </p>
                    </div>
                  </div>
                )}

                {generationError && (
                  <div
                    role="alert"
                    className="w-full max-w-2xl text-left flex items-start gap-3 p-4 rounded-2xl bg-[#FBECEB] border border-[#C97B72]/35 text-sm text-[#7A352E]"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="font-semibold">Não foi possível concluir a geração</p>
                      <p className="text-xs sm:text-sm leading-relaxed">{generationError}</p>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleStartGeneration}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 text-base font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-2xl shadow-sm transition-colors cursor-pointer min-h-[54px]"
                >
                  <span>{generationError ? 'Tentar novamente' : 'Criar minhas fotos'}</span>
                </button>

                <p className="text-xs text-[#8C7165]">
                  Prévia gratuita com marca-d&apos;água · Nenhuma cobrança é feita ao gerar ou tentar novamente
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Recuperação de Sessão por Código Seguro */}
      {recoverModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="recover-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2E2A]/60 backdrop-blur-xs"
          onClick={onCloseRecoverModal}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#F5EFE8] border border-[#8C7165]/20 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="recover-modal-title" className="font-serif text-2xl font-semibold text-[#51433E] mb-2">
              Recuperar ensaio anterior
            </h2>
            <p className="text-sm text-[#6B584F] mb-5">
              Digite o código de acesso exibido quando você iniciou seu ensaio (ex: SONHO-XXXX-XXXX).
            </p>

            <form onSubmit={handleRecoverSubmit} className="space-y-4">
              <input
                type="text"
                value={recoverCodeInput}
                onChange={(e) => setRecoverCodeInput(e.target.value.toUpperCase())}
                placeholder="SONHO-XXXX-XXXX"
                aria-label="Código de acesso do ensaio"
                className="w-full px-4 py-3 text-sm font-mono uppercase bg-white border border-[#8C7165]/25 rounded-xl text-[#51433E]"
              />

              {recoverError && (
                <p className="text-xs text-[#7A352E] bg-[#FBECEB] px-3 py-2 rounded-lg" role="alert">
                  {recoverError}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onCloseRecoverModal}
                  className="flex-1 py-3 text-sm font-medium text-[#51433E] bg-white border border-[#8C7165]/20 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={recovering}
                  className="flex-1 py-3 text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl cursor-pointer"
                >
                  {recovering ? 'Buscando...' : 'Recuperar ensaio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
