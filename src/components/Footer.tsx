import React, { useState } from 'react';
import { Instagram, Send, Video, HelpCircle, Shield, Heart } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { TermsModal } from './TermsModal';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 px-4 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Brand Name */}
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black text-white font-serif tracking-wider">
            ELZA DAMASCENO
          </span>
          <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
            VIP
          </span>
        </div>

        <p className="text-xs text-zinc-400 mt-2 max-w-md font-medium">
          Plataforma oficial de assinatura exclusiva e conteúdos premium de {SITE_CONFIG.model.name}.
        </p>

        {/* Social and Support Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6">
          <a
            href={SITE_CONFIG.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-pink-400 transition-colors"
          >
            <Instagram className="w-4 h-4 text-pink-500" />
            Instagram
          </a>

          <a
            href={SITE_CONFIG.socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-pink-400 transition-colors"
          >
            <Video className="w-4 h-4 text-zinc-400" />
            TikTok
          </a>

          <a
            href={SITE_CONFIG.socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-sky-400 transition-colors"
          >
            <Send className="w-4 h-4 text-sky-400" />
            Telegram
          </a>

          <a
            href={SITE_CONFIG.socialLinks.support}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-emerald-400 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Suporte
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-zinc-900 text-xs font-medium text-zinc-400">
          <button
            onClick={() => setModalType('terms')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Termos de Uso
          </button>
          <span>•</span>
          <button
            onClick={() => setModalType('privacy')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Política de Privacidade
          </button>
        </div>

        {/* 18+ Warning & Copyright */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black text-rose-400 tracking-wider">
            🔞 CONTEÚDO RESTRITO PARA MAIORES DE 18 ANOS
          </span>

          <p className="text-[11px] text-zinc-400">
            © 2026 {SITE_CONFIG.model.title} — Todos os direitos reservados.
          </p>
        </div>

      </div>

      {/* Terms / Privacy Modal */}
      <TermsModal
        isOpen={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </footer>
  );
};
