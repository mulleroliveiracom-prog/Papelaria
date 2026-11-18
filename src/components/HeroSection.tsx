import { Camera, Heart, Home, Image as ImageIcon } from 'lucide-react';
import { HERO_STUDIO_IMAGE } from '../data/demoShowcase';

interface HeroSectionProps {
  onStartCreation: () => void;
  onRecoverSessionClick: () => void;
}

const BENEFITS = [
  {
    icon: Home,
    label: 'Sem precisar sair de casa.',
  },
  {
    icon: ImageIcon,
    label: 'Cenários de estúdio personalizados.',
  },
  {
    icon: Camera,
    label: 'Fotos digitais em alta qualidade.',
  },
];

export function HeroSection({ onStartCreation, onRecoverSessionClick }: HeroSectionProps) {
  return (
    <section id="topo" className="pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Fotografia Newborn de Destaque (prioridade visual mobile-first) */}
          <div className="lg:col-span-6 lg:order-2 flex">
            <figure className="relative w-full aspect-[4/3] lg:aspect-auto rounded-3xl overflow-hidden border border-[#8C7165]/15 bg-white shadow-sm">
              <img
                src={HERO_STUDIO_IMAGE}
                alt="Exemplo demonstrativo sintético de ensaio fotográfico newborn em estúdio bege e rosa suave"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3A2E2A]/80 via-[#3A2E2A]/30 to-transparent p-5 sm:p-6">
                <p className="text-xs sm:text-sm text-[#F5EFE8]">
                  Cenário ilustrativo demonstrativo · Iluminação suave de estúdio newborn
                </p>
              </figcaption>
            </figure>
          </div>

          {/* Proposta de Valor e Conversão */}
          <div className="lg:col-span-6 lg:order-1 flex flex-col justify-center">
            <p className="text-xs sm:text-sm font-medium tracking-wide text-[#8C7165] mb-3">
              Estúdio newborn digital · Prévias gratuitas com IA
            </p>

            <h1 className="font-serif text-[clamp(2.15rem,4vw,3.35rem)] leading-[1.08] font-semibold text-[#51433E] tracking-tight mb-4">
              Seu bebê é único. Suas recordações também podem ser.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-[#6B584F] max-w-xl mb-6">
              Transforme uma simples foto do seu pequeno em um lindo ensaio fotográfico
              profissional, com cenários encantadores criados por inteligência artificial.
            </p>

            <ul className="space-y-2.5 mb-7">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm sm:text-base text-[#51433E]">
                  <span className="w-8 h-8 rounded-full bg-[#EBCFD1]/60 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#51433E]" aria-hidden="true" />
                  </span>
                  <span className="font-medium">{label}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <button
                type="button"
                onClick={onStartCreation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-2xl shadow-sm transition-colors cursor-pointer min-h-[52px]"
              >
                <span>Criar meu ensaio agora</span>
                <Heart className="w-4 h-4 fill-[#EBCFD1] text-[#EBCFD1]" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onRecoverSessionClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-4 text-sm font-medium text-[#51433E] bg-white hover:bg-[#EBCFD1]/25 border border-[#8C7165]/20 rounded-2xl transition-colors cursor-pointer min-h-[48px]"
              >
                Já tenho um código de ensaio
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#8C7165]">
              Faça uma prévia gratuita. Você só paga se quiser desbloquear suas fotos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
