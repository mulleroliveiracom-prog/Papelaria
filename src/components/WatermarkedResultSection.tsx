import { Lock } from 'lucide-react';
import type { SessionPublicView } from '../types/studio';

interface WatermarkedResultSectionProps {
  session: SessionPublicView | null;
  onScrollToPackages: () => void;
}

export function WatermarkedResultSection({
  session,
  onScrollToPackages,
}: WatermarkedResultSectionProps) {
  if (!session || session.generatedPhotos.length === 0) {
    return null;
  }

  return (
    <section
      id="resultado-previas"
      className="py-14 sm:py-20 bg-white border-t border-[#8C7165]/15"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs sm:text-sm font-medium text-[#8C7165] mb-2">
            Prévia gratuita protegida por marca-d&apos;água
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#51433E] mb-3">
            Olha que lindo ficou! ❤️
          </h2>
          <p className="text-sm sm:text-base text-[#6B584F]">
            Preparamos suas recordações especiais. Agora você pode escolher quais imagens deseja
            guardar em alta qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {session.generatedPhotos.map((photo) => {
            const previewUrl =
              photo.previewDataUrl ??
              `/api/media/preview/${session.sessionId}/${photo.photoId}?token=${encodeURIComponent(
                session.sessionToken
              )}`;
            return (
              <article
                key={photo.photoId}
                className="rounded-2xl bg-[#F5EFE8]/60 border border-[#8C7165]/15 overflow-hidden flex flex-col"
              >
                <div
                  className="relative aspect-[3/4] w-full bg-[#EDE4DA] select-none"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src={previewUrl}
                    alt={`Prévia gratuita com marca-d'água: ${photo.scenarioTitle}`}
                    draggable={false}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#51433E]/85 text-[#F5EFE8] text-xs font-medium">
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Prévia gratuita</span>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#51433E]">
                      {photo.scenarioTitle}
                    </h3>
                    <p className="text-xs text-[#8C7165]">
                      Imagem protegida · Alta resolução bloqueada
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="rounded-2xl bg-[#F5EFE8] border border-[#C6A477]/40 p-6 text-center max-w-2xl mx-auto">
          <p className="text-sm sm:text-base text-[#51433E] mb-4">
            Estas são suas prévias gratuitas. Para receber as imagens em alta resolução, sem
            marca-d&apos;água, escolha seu pacote.
          </p>
          <button
            type="button"
            onClick={onScrollToPackages}
            className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl transition-colors cursor-pointer min-h-[44px]"
          >
            Ver pacotes de desbloqueio
          </button>
        </div>
      </div>
    </section>
  );
}
