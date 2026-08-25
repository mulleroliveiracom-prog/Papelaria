import React from 'react';
import { motion } from 'motion/react';
import { Camera, Lock, Zap, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface GalleryProps {
  onGoToPlans: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onGoToPlans }) => {
  const checkout1Url = SITE_CONFIG.plans[0]?.checkoutUrl || 'https://paylume.fans/c/pack-100';

  const handleUnlockRedirect = () => {
    window.open(checkout1Url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="galeria" className="py-14 sm:py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        
        {/* Section Header */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100/70 border border-pink-200 text-pink-700 text-xs font-black uppercase tracking-wider mb-3">
          <Camera className="w-3.5 h-3.5" />
          PRÉVIAS DO ACERVO VIP 🔞
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight font-serif uppercase">
          📸 ENSAIOS E VÍDEOS PRIVADOS
        </h2>
        <p className="text-zinc-600 font-medium text-sm sm:text-base mt-2 max-w-lg mx-auto">
          Conteúdos exclusivos e ensaios censurados. Toque no cadeado para liberar o acervo completo agora mesmo.
        </p>

        {/* Gallery Grid (2 columns on mobile, 4 columns on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8">
          {SITE_CONFIG.gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
              onClick={handleUnlockRedirect}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-pink-300 via-rose-300 to-amber-200 shadow-md cursor-pointer border border-pink-200 hover:border-rose-500 transition-all duration-300 flex items-center justify-center"
            >
              {/* Sensual Pink Skin Tone Layers */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 via-pink-300 to-amber-100 opacity-90" />
              <div className="absolute -top-6 -left-6 w-36 h-36 bg-pink-400/80 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-rose-400/80 rounded-full blur-2xl" />

              {/* Heavily Blurred Photo in Pink Skin Hues */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center blur-2xl scale-130 opacity-75 group-hover:scale-140 group-hover:opacity-85 transition-all duration-700 select-none pointer-events-none mix-blend-soft-light"
                loading="lazy"
              />

              {/* Warm Sensual Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-rose-900/25 to-black/20 group-hover:via-rose-900/10 transition-all duration-300 pointer-events-none" />

              {/* Top Censored/VIP Badge */}
              <div className="absolute top-2.5 right-2.5">
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600/95 backdrop-blur-md text-white text-[10px] font-black shadow-md border border-white/20">
                  <Lock className="w-2.5 h-2.5" /> 18+ VIP
                </span>
              </div>

              {/* Center Padlock & Blinking "LIBERAR AGORA" */}
              <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
                {/* Glowing Lock Icon */}
                <div className="relative mb-2">
                  <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 to-amber-400 rounded-full blur-md opacity-80 group-hover:opacity-100 transition-opacity animate-pulse" />
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-950/80 backdrop-blur-md border border-amber-300 shadow-xl flex items-center justify-center text-amber-300 group-hover:scale-110 group-active:scale-95 transition-transform">
                    <Lock className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400/20 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                  </div>
                </div>

                {/* Animated Blinking / Pulsing "LIBERAR AGORA" Pill */}
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white font-black text-[11px] uppercase tracking-wider shadow-lg shadow-rose-600/50 border border-white/80 animate-pulse group-hover:from-rose-500 group-hover:to-amber-400">
                  <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>LIBERAR AGORA</span>
                </div>
              </div>

              {/* Photo Caption at bottom */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left pointer-events-none">
                <p className="text-[9px] font-bold text-pink-300 uppercase tracking-wider truncate">
                  {item.category}
                </p>
                <h3 className="text-xs font-black text-white truncate drop-shadow-xs">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery Footer Note */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border border-pink-100 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-xs text-zinc-700 font-semibold">
              Mais de <strong>1.450+</strong> fotos e <strong>380+</strong> vídeos completos esperando por você.
            </p>
          </div>
          <button
            onClick={handleUnlockRedirect}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md shadow-pink-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Desbloquear Tudo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};

