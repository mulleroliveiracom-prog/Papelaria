import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ExampleGallerySection } from './components/ExampleGallerySection';
import { StudioWorkflow } from './components/StudioWorkflow';
import { WatermarkedResultSection } from './components/WatermarkedResultSection';
import { PricingPackagesSection } from './components/PricingPackagesSection';
import { SuccessGallerySection } from './components/SuccessGallerySection';
import { FaqAndFooter } from './components/FaqAndFooter';
import { AdminPanelModal } from './components/AdminPanelModal';
import type { OrderPublicView, PackageId, SessionPublicView } from './types/studio';

const SESSION_STORAGE_KEY = 'meu_bebe_em_um_sonho_session_v1';

interface SavedSessionCredentials {
  sessionId: string;
  sessionToken: string;
}

function mergeSessionPreviews(
  prev: SessionPublicView | null,
  next: SessionPublicView
): SessionPublicView {
  if (!prev || prev.generatedPhotos.length === 0) {
    return next;
  }
  const prevPreviewById = new Map<string, string>();
  for (const photo of prev.generatedPhotos) {
    if (photo.previewDataUrl) {
      prevPreviewById.set(photo.photoId, photo.previewDataUrl);
    }
  }
  if (prevPreviewById.size === 0) {
    return next;
  }
  return {
    ...next,
    generatedPhotos: next.generatedPhotos.map((photo) => ({
      ...photo,
      previewDataUrl: photo.previewDataUrl ?? prevPreviewById.get(photo.photoId),
    })),
  };
}

export function App() {
  const [session, setSession] = useState<SessionPublicView | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(true);
  const [retentionHours, setRetentionHours] = useState(168);
  const [activeImageProvider, setActiveImageProvider] = useState<
    'cloudflare-workers-ai' | 'google-genai' | 'unconfigured'
  >('unconfigured');

  // Stateless browser memory for uploaded photo (base64) and selected scenarios (essential for Vercel serverless)
  const [uploadedPhotoBase64, setUploadedPhotoBase64] = useState<string | null>(null);
  const [uploadedConsent, setUploadedConsent] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([
    'ursinho-dos-sonhos',
    'nuvem-de-algodao',
  ]);

  const [creatingOrderPackageId, setCreatingOrderPackageId] = useState<PackageId | null>(null);
  const [checkingOrder, setCheckingOrder] = useState(false);

  const [recoverModalOpen, setRecoverModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const persistCredentials = (s: SessionPublicView) => {
    try {
      const creds: SavedSessionCredentials = {
        sessionId: s.sessionId,
        sessionToken: s.sessionToken,
      };
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(creds));
    } catch {
      // ignore storage errors
    }
  };

  const createFreshSession = useCallback(async (): Promise<SessionPublicView | null> => {
    setIsCreatingSession(true);
    try {
      const res = await fetch('/api/sessions', { method: 'POST' });
      if (!res.ok) return null;
      const created = (await res.json()) as SessionPublicView;
      setSession((prev) => mergeSessionPreviews(prev, created));
      persistCredentials(created);
      return created;
    } catch {
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  }, []);

  // Restore saved session on reload so parents never lose progress
  useEffect(() => {
    let cancelled = false;

    fetch('/api/health')
      .then((r) => r.json())
      .then(
        (d: {
          retentionHours?: number;
          activeImageProvider?: 'cloudflare-workers-ai' | 'google-genai' | 'unconfigured';
        }) => {
          if (!cancelled) {
            if (d.retentionHours) setRetentionHours(d.retentionHours);
            if (d.activeImageProvider) setActiveImageProvider(d.activeImageProvider);
          }
        }
      )
      .catch(() => undefined);

    const bootstrap = async () => {
      try {
        const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
        if (raw) {
          const creds = JSON.parse(raw) as SavedSessionCredentials;
          if (creds.sessionId && creds.sessionToken) {
            const res = await fetch(
              `/api/sessions/${creds.sessionId}?token=${encodeURIComponent(creds.sessionToken)}`
            );
            if (res.ok) {
              const restored = (await res.json()) as SessionPublicView;
              if (!cancelled) {
                setSession(restored);
                if (restored.selectedScenarioIds?.length) {
                  setSelectedScenarios(restored.selectedScenarioIds);
                }
                setIsCreatingSession(false);
              }
              return;
            }
          }
        }
      } catch {
        // fall through to new session
      }

      if (!cancelled) {
        await createFreshSession();
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [createFreshSession]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUploadPhoto = useCallback(
    async (consentAccepted: boolean, imageBase64: string) => {
      // Always store in browser memory so stateless /generate works even across Vercel Lambda cold starts
      setUploadedPhotoBase64(imageBase64);
      setUploadedConsent(consentAccepted);

      const activeSession = session ?? (await createFreshSession());
      if (!activeSession) {
        // Still allow proceeding statelessly via /api/sessions/stateless/generate
        return;
      }

      const res = await fetch(`/api/sessions/${activeSession.sessionId}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: activeSession.sessionToken,
          consentAccepted,
          imageBase64,
        }),
      });

      const data = (await res.json()) as SessionPublicView & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? 'Erro ao enviar fotografia.');
      }
      setSession((prev) => mergeSessionPreviews(prev, data));
      persistCredentials(data);
    },
    [session, createFreshSession]
  );

  const handleGeneratePhotos = useCallback(
    async (scenarioIds: string[]): Promise<{ ok: boolean; error?: string }> => {
      setSelectedScenarios(scenarioIds);

      let activeSession = session;
      if (!activeSession && !uploadedPhotoBase64) {
        activeSession = await createFreshSession();
        if (!activeSession) {
          return { ok: false, error: 'Sessão não encontrada. Selecione a foto novamente.' };
        }
      }

      const targetSessionId = activeSession?.sessionId ?? 'stateless';
      const targetToken = activeSession?.sessionToken ?? '';

      const res = await fetch(`/api/sessions/${targetSessionId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: targetToken,
          scenarioIds,
          ...(uploadedPhotoBase64
            ? {
                imageBase64: uploadedPhotoBase64,
                consentAccepted: uploadedConsent || Boolean(activeSession?.consentAccepted),
              }
            : {}),
        }),
      });

      const data = (await res.json()) as
        | SessionPublicView
        | { error?: string; session?: SessionPublicView };

      if (!res.ok) {
        const errObj = data as { error?: string; session?: SessionPublicView };
        if (errObj.session) {
          const recovered = errObj.session;
          setSession((prev) => mergeSessionPreviews(prev, recovered));
          persistCredentials(recovered);
        }
        return {
          ok: false,
          error: errObj.error ?? 'Erro ao processar as imagens.',
        };
      }

      const updated = data as SessionPublicView;
      setSession((prev) => mergeSessionPreviews(prev, updated));
      persistCredentials(updated);
      setTimeout(() => scrollToSection('resultado-previas'), 150);
      return { ok: true };
    },
    [session, uploadedPhotoBase64, uploadedConsent, createFreshSession]
  );

  const handleRecoverSession = useCallback(
    async (accessCode: string): Promise<{ ok: boolean; error?: string }> => {
      const res = await fetch('/api/sessions/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      });

      const data = (await res.json()) as SessionPublicView & { error?: string };
      if (!res.ok) {
        return { ok: false, error: data.error ?? 'Código não localizado.' };
      }

      setSession(data);
      persistCredentials(data);
      return { ok: true };
    },
    []
  );

  const handleDeleteSessionMedia = useCallback(async () => {
    setUploadedPhotoBase64(null);
    setUploadedConsent(false);
    if (!session) return;
    const res = await fetch(
      `/api/sessions/${session.sessionId}/media?token=${encodeURIComponent(session.sessionToken)}`,
      { method: 'DELETE' }
    );
    if (res.ok) {
      const data = (await res.json()) as { session?: SessionPublicView };
      if (data.session) {
        setSession(data.session);
      }
    } else {
      setSession((prev) =>
        prev
          ? {
              ...prev,
              hasUploadedPhoto: false,
              generatedPhotos: [],
            }
          : null
      );
    }
  }, [session]);

  const handleSelectPackage = useCallback(
    async (packageId: PackageId) => {
      if (!session) return;
      setCreatingOrderPackageId(packageId);
      try {
        const generatedMetaOnly = session.generatedPhotos.map(
          ({ previewDataUrl: _omit, ...meta }) => meta
        );
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.sessionId,
            token: session.sessionToken,
            packageId,
            generatedPhotos: generatedMetaOnly,
          }),
        });
        const data = (await res.json()) as {
          order?: OrderPublicView;
          session?: SessionPublicView;
        };
        if (res.ok && data.session) {
          const updatedSession = data.session;
          setSession((prev) => mergeSessionPreviews(prev, updatedSession));
        }
      } finally {
        setCreatingOrderPackageId(null);
      }
    },
    [session]
  );

  const handleRefreshOrderStatus = useCallback(
    async (orderId: string) => {
      if (!session) return;
      setCheckingOrder(true);
      try {
        const res = await fetch(
          `/api/orders/${orderId}?token=${encodeURIComponent(session.sessionToken)}`
        );
        if (res.ok) {
          const data = (await res.json()) as { session?: SessionPublicView };
          if (data.session) {
            const updatedSession = data.session;
            setSession((prev) => mergeSessionPreviews(prev, updatedSession));
            if (updatedSession.activeOrder?.status === 'paid') {
              setTimeout(() => scrollToSection('ensaio-pronto'), 150);
            }
          }
        }
      } finally {
        setCheckingOrder(false);
      }
    },
    [session]
  );

  const handleDemoConfirmOrder = useCallback(
    async (orderId: string) => {
      if (!session) return;
      setCheckingOrder(true);
      try {
        const res = await fetch(`/api/orders/${orderId}/demo-confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: session.sessionToken,
            sessionId: session.sessionId,
            packageId: session.activeOrder?.packageId,
            selectedPhotoIds: session.generatedPhotos.map((p) => p.photoId),
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { session?: SessionPublicView };
          if (data.session) {
            const updatedSession = data.session;
            setSession((prev) => mergeSessionPreviews(prev, updatedSession));
            setTimeout(() => scrollToSection('ensaio-pronto'), 150);
          }
        }
      } finally {
        setCheckingOrder(false);
      }
    },
    [session]
  );

  const handleUpdateUnlockedSelection = useCallback(
    async (orderId: string, photoIds: string[]) => {
      if (!session) return;
      const res = await fetch(`/api/orders/${orderId}/select-photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: session.sessionToken,
          photoIds,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { session?: SessionPublicView };
        if (data.session) {
          const updatedSession = data.session;
          setSession((prev) => mergeSessionPreviews(prev, updatedSession));
        }
      }
    },
    [session]
  );

  const hasSessionMedia = Boolean(
    uploadedPhotoBase64 ||
      (session && (session.hasUploadedPhoto || session.generatedPhotos.length > 0))
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFE8] text-[#51433E]">
      <Navbar onStartCreation={() => scrollToSection('criar-ensaio')} />

      <main className="flex-1">
        <HeroSection
          onStartCreation={() => scrollToSection('criar-ensaio')}
          onRecoverSessionClick={() => setRecoverModalOpen(true)}
        />

        <ExampleGallerySection onStartCreation={() => scrollToSection('criar-ensaio')} />

        <StudioWorkflow
          session={session}
          isCreatingSession={isCreatingSession}
          activeImageProvider={activeImageProvider}
          uploadedPhotoBase64={uploadedPhotoBase64}
          selectedScenariosState={selectedScenarios}
          onSelectedScenariosChange={setSelectedScenarios}
          onUploadPhoto={handleUploadPhoto}
          onGeneratePhotos={handleGeneratePhotos}
          onRecoverSession={handleRecoverSession}
          onDeleteSessionMedia={handleDeleteSessionMedia}
          recoverModalOpen={recoverModalOpen}
          onCloseRecoverModal={() => setRecoverModalOpen(false)}
          onOpenRecoverModal={() => setRecoverModalOpen(true)}
        />

        {session?.activeOrder?.status !== 'paid' && (
          <WatermarkedResultSection
            session={session}
            onScrollToPackages={() => scrollToSection('pacotes')}
          />
        )}

        <PricingPackagesSection
          session={session}
          creatingOrderPackageId={creatingOrderPackageId}
          checkingOrder={checkingOrder}
          onSelectPackage={handleSelectPackage}
          onRefreshOrderStatus={handleRefreshOrderStatus}
          onDemoConfirmOrder={handleDemoConfirmOrder}
        />

        <SuccessGallerySection
          session={session}
          onUpdateUnlockedSelection={handleUpdateUnlockedSelection}
        />
      </main>

      <FaqAndFooter
        hasSessionMedia={hasSessionMedia}
        retentionHours={retentionHours}
        onDeleteMedia={handleDeleteSessionMedia}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      <AdminPanelModal open={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </div>
  );
}

export default App;
