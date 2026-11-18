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

export function App() {
  const [session, setSession] = useState<SessionPublicView | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(true);
  const [retentionHours, setRetentionHours] = useState(168);
  const [activeImageProvider, setActiveImageProvider] = useState<
    'cloudflare-workers-ai' | 'google-genai' | 'unconfigured'
  >('unconfigured');

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
      setSession(created);
      persistCredentials(created);
      return created;
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
      const activeSession = session ?? (await createFreshSession());
      if (!activeSession) {
        throw new Error('Não foi possível iniciar sua sessão.');
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
      setSession(data);
      persistCredentials(data);
    },
    [session, createFreshSession]
  );

  const handleGeneratePhotos = useCallback(
    async (scenarioIds: string[]): Promise<{ ok: boolean; error?: string }> => {
      if (!session) {
        return { ok: false, error: 'Sessão não encontrada.' };
      }

      const res = await fetch(`/api/sessions/${session.sessionId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: session.sessionToken,
          scenarioIds,
        }),
      });

      const data = (await res.json()) as
        | SessionPublicView
        | { error?: string; session?: SessionPublicView };

      if (!res.ok) {
        const errObj = data as { error?: string; session?: SessionPublicView };
        if (errObj.session) {
          setSession(errObj.session);
        }
        return {
          ok: false,
          error: errObj.error ?? 'Erro ao processar as imagens.',
        };
      }

      const updated = data as SessionPublicView;
      setSession(updated);
      persistCredentials(updated);
      setTimeout(() => scrollToSection('resultado-previas'), 150);
      return { ok: true };
    },
    [session]
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
    }
  }, [session]);

  const handleSelectPackage = useCallback(
    async (packageId: PackageId) => {
      if (!session) return;
      setCreatingOrderPackageId(packageId);
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.sessionId,
            token: session.sessionToken,
            packageId,
          }),
        });
        const data = (await res.json()) as {
          order?: OrderPublicView;
          session?: SessionPublicView;
        };
        if (res.ok && data.session) {
          setSession(data.session);
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
            setSession(data.session);
            if (data.session.activeOrder?.status === 'paid') {
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
          body: JSON.stringify({ token: session.sessionToken }),
        });
        if (res.ok) {
          const data = (await res.json()) as { session?: SessionPublicView };
          if (data.session) {
            setSession(data.session);
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
          setSession(data.session);
        }
      }
    },
    [session]
  );

  const hasSessionMedia = Boolean(
    session && (session.hasUploadedPhoto || session.generatedPhotos.length > 0)
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
