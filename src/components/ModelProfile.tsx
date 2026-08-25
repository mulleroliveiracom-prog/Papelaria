import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Instagram, Send, Video, Sparkles, Flame, Eye, Lock } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const ModelProfile: React.FC = () => {
  return (
    <section id="perfil" className="py-10 px-4 bg-white border-y border-pink-100">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        
        {/* Model Name & Verification Badge */}
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight font-serif uppercase">
            {SITE_CONFIG.model.name}
          </h2>
          <div className="p-0.5 rounded-full bg-blue-500 text-white shadow-xs" title="Perfil VIP Verificado">
            <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
          </div>
        </div>

        <p className="text-xs sm:text-sm font-bold text-pink-600 uppercase tracking-widest mt-1">
          Criadora de Conteúdo VIP • {SITE_CONFIG.model.age} Anos ✨
        </p>

        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <a
            href={SITE_CONFIG.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold transition-colors border border-pink-200 shadow-2xs"
            title="Instagram Oficial"
          >
            <Instagram className="w-4 h-4 text-pink-600" />
            <span>Instagram</span>
          </a>

          <a
            href={SITE_CONFIG.socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors border border-zinc-200 shadow-2xs"
            title="TikTok Oficial"
          >
            <Video className="w-4 h-4 text-zinc-800" />
            <span>TikTok</span>
          </a>

          <a
            href={SITE_CONFIG.socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors border border-sky-200 shadow-2xs"
            title="Telegram Oficial"
          >
            <Send className="w-4 h-4 text-sky-600" />
            <span>Telegram</span>
          </a>
        </div>

        {/* Presentation Bio Card */}
        <div className="relative mt-6 max-w-xl p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-pink-50/60 to-rose-50/30 border border-pink-100 shadow-xs text-center">
          <p className="text-sm sm:text-base text-zinc-700 font-medium leading-relaxed">
            {SITE_CONFIG.model.bio}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mt-6">
          <div className="bg-white border border-pink-100 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-pink-600 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-base font-black text-zinc-900">{SITE_CONFIG.model.stats.photosCount}</span>
            </div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Fotos Exclusivas</p>
          </div>

          <div className="bg-white border border-pink-100 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-rose-600 mb-1">
              <Video className="w-4 h-4" />
              <span className="text-base font-black text-zinc-900">{SITE_CONFIG.model.stats.videosCount}</span>
            </div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Vídeos Privados</p>
          </div>

          <div className="bg-white border border-pink-100 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-base font-black text-zinc-900">{SITE_CONFIG.model.stats.subscribersSatisfaction}</span>
            </div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Aprovação VIP</p>
          </div>

          <div className="bg-white border border-pink-100 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-base font-black text-zinc-900">{SITE_CONFIG.model.stats.updatesWeekly}</span>
            </div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Postagens</p>
          </div>
        </div>

      </div>
    </section>
  );
};
