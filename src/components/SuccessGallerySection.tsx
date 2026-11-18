import { useEffect, useState } from 'react';
import { Check, Download, FolderDown, Heart } from 'lucide-react';
import type { SessionPublicView } from '../types/studio';

interface SuccessGallerySectionProps {
  session: SessionPublicView | null;
  onUpdateUnlockedSelection: (orderId: string, photoIds: string[]) => Promise<void>;
}

export function SuccessGallerySection({
  session,
  onUpdateUnlockedSelection,
}: SuccessGallerySectionProps) {
  const paidOrder = session?.activeOrder?.status === 'paid' ? session.activeOrder : null;
  const [selectedIds, setSelectedIds] = useState<string[]>(paidOrder?.unlockedPhotoIds ?? []);
  const [savingSelection, setSavingSelection] = useState(false);

  useEffect(() => {
    if (paidOrder) {
      setSelectedIds(paidOrder.unlockedPhotoIds);
    }
  }, [paidOrder]);

  if (!session || !paidOrder) {
    return null;
  }

  const quota = paidOrder.quota;
  const unlockedIds = new Set(paidOrder.unlockedPhotoIds);
  const unlockedPhotos = session.generatedPhotos.filter((p) => unlockedIds.has(p.photoId));

  const togglePhotoChoice = (photoId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(photoId)) {
        return prev.filter((id) => id !== photoId);
      }
      if (prev.length >= quota) {
        return [...prev.slice(1), photoId];
      }
      return [...prev, photoId];
    });
  };

  const handleSaveSelection = async () => {
    setSavingSelection(true);
    await onUpdateUnlockedSelection(paidOrder.orderId, selectedIds.slice(0, quota));
    setSavingSelection(false);
  };

  const downloadAllUrl = `/api/orders/${paidOrder.orderId}/download-all?token=${encodeURIComponent(
    session.sessionToken
  )}`;

  return (
    <section
      id="ensaio-pronto"
      className="py-16 sm:py-24 bg-white border-t border-[#C6A477]/40"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs sm:text-sm font-medium text-[#8C7165] mb-2">
            Pagamento confirmado · Pacote {paidOrder.packageName} ({quota} fotos)
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#51433E] mb-3">
            Seu ensaio está pronto! ❤️
          </h2>
          <p className="text-base text-[#6B584F]">
            Agora suas recordações estão disponíveis em alta qualidade e sem marca-d&apos;água.
          </p>
        </div>

        {/* Caso haja mais fotos geradas do que a cota ou o usuário queira escolher suas favoritas */}
        {session.generatedPhotos.length > 0 && (
          <div className="mb-8 rounded-2xl bg-[#F5EFE8] border border-[#8C7165]/15 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-[#51433E]">
              <p className="font-semibold">
                Fotos selecionadas para desbloqueio: {selectedIds.length} de {quota}
              </p>
              <p className="text-xs text-[#6B584F]">
                Clique em qualquer imagem abaixo para alterar quais fotos fazem parte das suas{' '}
                {quota} fotos liberadas.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={savingSelection}
                onClick={handleSaveSelection}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#51433E] bg-white hover:bg-[#EBCFD1]/40 border border-[#8C7165]/20 rounded-xl cursor-pointer"
              >
                {savingSelection ? 'Salvando escolha...' : 'Confirmar fotos escolhidas'}
              </button>

              {unlockedPhotos.length > 0 && (
                <a
                  href={downloadAllUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl transition-colors"
                >
                  <FolderDown className="w-4 h-4" aria-hidden="true" />
                  <span>Baixar todas ({unlockedPhotos.length})</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Galeria em Alta Qualidade Sem Marca-d'Água */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {session.generatedPhotos.map((photo) => {
            const isUnlocked = unlockedIds.has(photo.photoId);
            const isPicked = selectedIds.includes(photo.photoId);
            const imageUrl = isUnlocked
              ? `/api/media/original/${session.sessionId}/${photo.photoId}?token=${encodeURIComponent(
                  session.sessionToken
                )}`
              : `/api/media/preview/${session.sessionId}/${photo.photoId}?token=${encodeURIComponent(
                  session.sessionToken
                )}`;
            const downloadUrl = `/api/media/original/${session.sessionId}/${photo.photoId}?token=${encodeURIComponent(
              session.sessionToken
            )}&download=1`;

            return (
              <article
                key={photo.photoId}
                className={`rounded-2xl overflow-hidden border flex flex-col ${
                  isPicked ? 'border-[#C6A477] ring-2 ring-[#C6A477]/60' : 'border-[#8C7165]/15'
                } bg-[#F5EFE8]/50`}
              >
                <button
                  type="button"
                  onClick={() => togglePhotoChoice(photo.photoId)}
                  className="relative aspect-[3/4] w-full bg-[#EDE4DA] cursor-pointer block text-left"
                >
                  <img
                    src={imageUrl}
                    alt={photo.scenarioTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${
                      isPicked ? 'bg-[#51433E] text-white' : 'bg-white/90 text-[#8C7165]'
                    }`}
                  >
                    <Check className="w-4 h-4" aria-hidden="true" />
                  </span>
                </button>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#51433E]">
                      {photo.scenarioTitle}
                    </h3>
                    <p className="text-xs text-[#8C7165]">
                      {isUnlocked ? 'Alta resolução liberada' : 'Clique para incluir no pacote'}
                    </p>
                  </div>

                  {isUnlocked && (
                    <a
                      href={downloadUrl}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Baixar</span>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center max-w-xl mx-auto pt-6 border-t border-[#8C7165]/15">
          <Heart className="w-5 h-5 text-[#C6A477] mx-auto mb-2" aria-hidden="true" />
          <p className="font-serif text-xl text-[#51433E]">
            Obrigado por confiar na Meu Bebê em um Sonho para transformar esse momento em uma
            lembrança especial.
          </p>
        </div>
      </div>
    </section>
  );
}
