import React from 'react';
import { motion } from 'motion/react';
import { Flame, ShieldCheck, Star, Sparkles, Lock, Unlock, Zap, ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface HeroProps {
  onGoToPlans: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGoToPlans }) => {
  const checkout1Url = SITE_CONFIG.plans[0]?.checkoutUrl || 'https://paylume.fans/c/pack-100';

  const handleUnlockRedirect = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(checkout1Url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="inicio" className="relative pt-24 pb-12 md:pt-28 md:pb-16 px-4 overflow-hidden">
      
      {/* Soft luxury ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-pink-200/40 via-rose-100/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200/80 shadow-xs mb-5"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-pink-700 to-rose-600 bg-clip-text text-transparent">
            CANAL VIP OFICIAL 2026
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </motion.div>

        {/* Main Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-tight uppercase font-serif"
        >
          🔥 BEM-VINDO AO VIP DA ELZA 🔥
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-zinc-600 font-medium max-w-xl leading-relaxed"
        >
          {SITE_CONFIG.model.subtitle}
        </motion.p>

        {/* Featured Blurred Photo Container with Padlock */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onClick={() => handleUnlockRedirect()}
          className="relative mt-8 w-full max-w-md mx-auto group cursor-pointer"
        >
          {/* Glowing Aura Frame */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 rounded-3xl blur-md opacity-50 group-hover:opacity-90 transition duration-500 animate-pulse" />
          
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-pink-300 via-rose-300 to-amber-200 border-2 border-white shadow-2xl aspect-[4/5] flex items-center justify-center">
            
            {/* Sensual Pink Skin Tone Base Gradient Layers (Nude / Rosa Pele) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 via-pink-300 to-amber-100 opacity-90" />
            
            {/* Abstract Organic Skin Glow and Contour Orbs for realistic body/skin blur simulation */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-pink-400/80 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -right-10 w-72 h-72 bg-rose-400/80 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-amber-200/70 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-pink-500/30 via-rose-400/40 to-rose-600/50 mix-blend-multiply" />

            {/* Heavily Blurred Background Image in Pink Skin Hues */}
            <img
              src={SITE_CONFIG.images.featured}
              alt="Conteúdo VIP Exclusivo da Elza"
              className="absolute inset-0 w-full h-full object-cover object-center blur-3xl scale-130 opacity-75 group-hover:scale-140 transition-transform duration-700 select-none pointer-events-none mix-blend-soft-light"
            />

            {/* Soft Warm Vignette & Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose-950/70 via-rose-900/20 to-black/20 pointer-events-none" />

            {/* Top Image Floating Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-rose-600/95 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-white text-[11px] font-black shadow-lg">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>CONTEÚDO 18+ PRIVADO 🔞</span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400/95 backdrop-blur-md px-2.5 py-1 rounded-full text-zinc-950 text-[11px] font-black shadow-md border border-white/30">
              <Star className="w-3 h-3 fill-zinc-950" />
              <span>TOP VIP</span>
            </div>

            {/* Center Lock & Blinking Unlock CTA */}
            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
              
              {/* Padlock Icon with pulsating glow circle */}
              <div className="relative mb-4">
                <div className="absolute -inset-3 bg-gradient-to-r from-rose-500 to-amber-400 rounded-full blur-lg opacity-90 animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-zinc-950/80 backdrop-blur-md border-2 border-amber-300 shadow-2xl flex items-center justify-center text-amber-400 group-hover:scale-110 group-active:scale-95 transition-transform duration-300">
                  <Lock className="w-10 h-10 sm:w-12 sm:h-12 fill-amber-400/20 text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-bounce" />
                </div>
              </div>

              {/* Blinking / Flashing Animated Button */}
              <div className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-rose-600/60 border-2 border-white animate-pulse active:scale-95 transition-all">
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>LIBERAR AGORA 🔥</span>
                <ChevronRight className="w-4 h-4" />
              </div>

              <p className="text-xs text-white font-black mt-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Toque no cadeado para desbloquear por apenas <span className="text-amber-300 font-black underline">R$ 19,90</span>
              </p>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
              <div className="flex items-center gap-2 text-white">
                <span className="text-base font-black drop-shadow-md">{SITE_CONFIG.model.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 border border-white/20 text-[10px] font-black uppercase tracking-wider shadow-sm">
                  CENSURADO
                </span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Big Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8 w-full max-w-md"
        >
          <button
            onClick={onGoToPlans}
            className="w-full relative group overflow-hidden py-4 sm:py-5 px-8 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-extrabold text-base sm:text-lg tracking-wide uppercase shadow-xl shadow-rose-500/30 active:scale-98 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            {/* Animated shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform" />
            
            <Flame className="w-6 h-6 fill-amber-300 text-amber-300 animate-bounce" />
            <span className="drop-shadow-sm font-black">ENTRAR PARA O VIP</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Social Proof sub-note */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-zinc-500 font-semibold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Seguro & Sigiloso
            </span>
            <span>•</span>
            <span className="text-pink-600 font-bold">
              ⚡ Liberação Imediata
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

