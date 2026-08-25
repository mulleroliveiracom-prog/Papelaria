import React from 'react';
import { motion } from 'motion/react';
import { Flame, Check, ShieldCheck, Sparkles, Crown, Zap, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SITE_CONFIG, PlanConfig } from '../config';

export const PlansSection: React.FC = () => {
  const handlePlanClick = (plan: PlanConfig) => {
    // Fire festive celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#f43f5e', '#f59e0b', '#fbbf24']
    });

    // Open checkout securely
    window.open(plan.checkoutUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="planos" className="py-16 sm:py-24 px-4 bg-gradient-to-b from-pink-50/50 via-rose-50/30 to-pink-50/60 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-pink-200/30 via-rose-200/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center">
        
        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider mb-3 shadow-md shadow-rose-500/20 animate-pulse">
          <Zap className="w-3.5 h-3.5 fill-white" />
          OFERTA ESPECIAL POR TEMPO LIMITADO
        </div>

        {/* Section Headings */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight font-serif uppercase">
          ASSINE AGORA 🔥
        </h2>
        <p className="text-zinc-600 font-medium text-base sm:text-lg mt-2 max-w-xl mx-auto">
          {SITE_CONFIG.model.name ? `Escolha o melhor plano para você e entre para o VIP da ${SITE_CONFIG.model.name}. ❤️` : ''}
        </p>

        {/* 3 Plans Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 items-stretch">
          {SITE_CONFIG.plans.map((plan, index) => {
            const isHighlighted = plan.highlighted;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between ${
                  isHighlighted
                    ? 'bg-white border-2 border-pink-500 shadow-2xl shadow-pink-500/20 lg:-translate-y-3 z-10'
                    : 'bg-white/95 border border-pink-100 shadow-lg hover:shadow-xl hover:border-pink-300'
                }`}
              >
                {/* Popular / Best Value Top Badge */}
                {isHighlighted && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="px-5 py-1 rounded-full bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white text-xs font-black uppercase tracking-widest shadow-md flex items-center gap-1.5 animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      {plan.badge || '🔥 MAIS POPULAR 🔥'}
                    </span>
                  </div>
                )}

                {!isHighlighted && plan.badge && (
                  <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                    <span className="px-3.5 py-0.5 rounded-full bg-zinc-900 text-amber-400 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                      {plan.id === 'vitalicio' && <Crown className="w-3 h-3 text-amber-400" />}
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Content */}
                <div className="p-6 sm:p-8 text-left">
                  
                  {/* Plan Name & Tag */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight">
                      {plan.name}
                    </h3>
                    {isHighlighted && (
                      <span className="p-1 rounded-full bg-pink-100 text-pink-600">
                        <Sparkles className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-500">
                      {plan.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal min-h-[40px]">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <div className="mt-6 pt-6 border-t border-pink-50 space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-pink-700">
                      O que está incluso:
                    </p>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700">
                        <div className={`mt-0.5 p-0.5 rounded-full ${isHighlighted ? 'bg-pink-100 text-pink-600' : 'bg-emerald-100 text-emerald-600'} shrink-0`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Button / Action */}
                <div className="p-6 sm:p-8 pt-0">
                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider shadow-md active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white shadow-rose-500/30'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-zinc-400 text-center mt-2.5 font-semibold flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Liberação Imediata no PIX & Cartão
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
