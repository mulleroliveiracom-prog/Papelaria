import { DEMO_GALLERY_ITEMS } from '../data/demoShowcase';

interface ExampleGallerySectionProps {
  onStartCreation: () => void;
}

export function ExampleGallerySection({ onStartCreation }: ExampleGallerySectionProps) {
  return (
    <section id="exemplos" className="py-14 sm:py-20 bg-white border-y border-[#8C7165]/12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-[#8C7165] mb-2">
              Exemplos demonstrativos criados por IA
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#51433E] tracking-tight mb-2.5">
              Cenários pensados como um estúdio newborn de verdade
            </h2>
            <p className="text-sm sm:text-base text-[#6B584F]">
              Todas as imagens abaixo são exemplos sintéticos ilustrativos — nunca publicamos
              fotografias de clientes.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartCreation}
            className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-[#51433E] bg-[#F5EFE8] hover:bg-[#EBCFD1]/45 border border-[#8C7165]/20 rounded-xl transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap min-h-[44px]"
          >
            Testar com a foto do meu bebê
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_GALLERY_ITEMS.map((item, idx) => (
            <article
              key={item.id}
              className="rounded-2xl bg-[#F5EFE8]/60 border border-[#8C7165]/15 overflow-hidden flex flex-col"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-[#EDE4DA]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="font-mono text-xs text-[#8C7165] tabular-nums mb-1">
                  {String(idx + 1).padStart(2, '0')} · Cenário demonstrativo
                </p>
                <h3 className="font-serif text-xl font-semibold text-[#51433E] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B584F] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
