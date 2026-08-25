import React from 'react';
import { Flame, Sparkles, ChevronRight, ShieldCheck, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface FinalCTAProps {
  onGoToPlans: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onGoToPlans }) => {
  return (
    <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-white via-pink-100/60 to-rose-100/80 relative overflow-hidden text-center">
      
      {/* Background Decorative Rings */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight font-serif uppercase leading-tight">
          🔥 ENTRE PARA O VIP DA ELZA AGORA
        </h2>

        {/* Subtext */}
        <p className="text-sm sm:text-base text-zinc-700 font-medium mt-3 max-w-lg leading-relaxed">
          Não fique de fora. Entre agora e tenha acesso aos conteúdos exclusivos da {SITE_CONFIG.model.name}. ❤️🔥
        </p>

        {/* Big Action Button */}
        <div className="mt-8 w-full max-w-md">
          <button
            onClick={onGoToPlans}
            className="w-full relative group overflow-hidden py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-black text-base sm:text-lg tracking-wider uppercase shadow-xl shadow-rose-500/30 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
            <span>QUERO ENTRAR NO VIP 🔥</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs text-zinc-500 font-semibold mt-3 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Garantia de privacidade e acesso imediato aos vídeos e fotos.
          </p>
        </div>

      </div>
    </section>
  );
};
