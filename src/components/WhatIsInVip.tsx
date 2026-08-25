import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  Smile, 
  Camera, 
  Video, 
  Gift, 
  ShieldAlert, 
  Check, 
  Lock
} from 'lucide-react';
import { SITE_CONFIG } from '../config';

const ICONS_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6 text-amber-500" />,
  Flame: <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />,
  Heart: <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />,
  Smile: <Smile className="w-6 h-6 text-purple-500" />,
  Camera: <Camera className="w-6 h-6 text-pink-600" />,
  Video: <Video className="w-6 h-6 text-rose-600" />,
  Gift: <Gift className="w-6 h-6 text-amber-500" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6 text-emerald-600" />
};

interface WhatIsInVipProps {
  onGoToPlans: () => void;
}

export const WhatIsInVip: React.FC<WhatIsInVipProps> = ({ onGoToPlans }) => {
  return (
    <section id="conteudo" className="py-14 sm:py-20 px-4 bg-gradient-to-b from-white via-pink-50/40 to-white">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-rose-700 text-xs font-black uppercase tracking-wider mb-3">
          <Flame className="w-3.5 h-3.5 fill-rose-600" />
          BENEFÍCIOS EXCLUSIVOS
        </div>

        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 tracking-tight font-serif uppercase leading-tight">
          🔥 TUDO QUE VOCÊ ENCONTRA NO MEU VIP 🔥
        </h2>
        <p className="text-zinc-600 font-medium text-sm sm:text-base mt-2 max-w-lg mx-auto">
          Tenha acesso instantâneo ao acervo completo sem censura, atualizado frequentemente para você.
        </p>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-10 text-left">
          {SITE_CONFIG.vipBenefits.map((benefit, index) => {
            const icon = ICONS_MAP[benefit.icon] || <Sparkles className="w-6 h-6 text-pink-500" />;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative p-4 sm:p-5 rounded-2xl bg-white border border-pink-100/80 hover:border-pink-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
              >
                {/* Icon Container with subtle glow */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-900 tracking-tight leading-tight">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-snug">
                    {benefit.desc}
                  </p>
                </div>

                <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 self-center">
                  <Check className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Button below benefits */}
        <div className="mt-10">
          <button
            onClick={onGoToPlans}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-lg shadow-pink-500/25 active:scale-98 transition-all cursor-pointer"
          >
            <span>QUERO TER ACESSO A TUDO ISSO</span>
            <Flame className="w-5 h-5 fill-amber-300 text-amber-300" />
          </button>
          <p className="text-xs text-zinc-400 mt-2 font-medium">
            Planos acessíveis a partir de R$ 19,90 • Acesso imediato
          </p>
        </div>

      </div>
    </section>
  );
};
