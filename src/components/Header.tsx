import React, { useState } from 'react';
import { Menu, X, ShoppingBag, Flame, Sparkles, Shield, Heart, HelpCircle, ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Menu Icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -ml-2 rounded-xl text-zinc-700 hover:text-pink-600 hover:bg-pink-50 transition-colors flex items-center gap-1.5 focus:outline-none"
            aria-label="Abrir Menu"
          >
            <Menu className="w-6 h-6" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-zinc-500">Menu</span>
          </button>

          {/* Center: Brand Logo */}
          <button 
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-1.5 focus:outline-none group"
          >
            <div className="relative flex items-center">
              <span className="text-xl md:text-2xl font-black tracking-tight text-zinc-950 font-serif">
                ELZA
              </span>
              <span className="ml-1 text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                VIP
              </span>
              <span className="inline-block ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                ★
              </span>
            </div>
          </button>

          {/* Right: VIP / Cart Button */}
          <button
            onClick={() => handleNavClick('planos')}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold text-xs md:text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">ASSINAR AGORA</span>
            <span className="sm:hidden">VIP</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          </button>

        </div>
      </header>

      {/* Slide-out Mobile & Desktop Drawer Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-pink-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-pink-600 flex items-center justify-center text-white font-black text-sm">
                    E
                  </div>
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-base leading-tight">Elza Damasceno</h3>
                    <p className="text-[11px] font-semibold text-pink-600 uppercase tracking-wider">Acesso VIP Oficial</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 space-y-1.5">
                <button
                  onClick={() => handleNavClick('inicio')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-800 hover:bg-pink-50 hover:text-pink-600 transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  Início
                </button>
                <button
                  onClick={() => handleNavClick('conteudo')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-800 hover:bg-pink-50 hover:text-pink-600 transition-colors text-left"
                >
                  <Flame className="w-4 h-4 text-rose-500" />
                  Conteúdo VIP
                </button>
                <button
                  onClick={() => handleNavClick('galeria')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-800 hover:bg-pink-50 hover:text-pink-600 transition-colors text-left"
                >
                  <Heart className="w-4 h-4 text-pink-500" />
                  Galeria de Fotos
                </button>
                <button
                  onClick={() => handleNavClick('planos')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-800 hover:bg-pink-50 hover:text-pink-600 transition-colors text-left"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                  Planos de Assinatura
                </button>
                <button
                  onClick={() => handleNavClick('perfil')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-800 hover:bg-pink-50 hover:text-pink-600 transition-colors text-left"
                >
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Sobre a Elza
                </button>
                <a
                  href={SITE_CONFIG.socialLinks.support}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-zinc-800 hover:bg-pink-50 hover:text-pink-600 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    Suporte & Dúvidas
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </nav>
            </div>

            {/* Bottom CTA in Drawer */}
            <div className="pt-4 border-t border-zinc-100">
              <button
                onClick={() => handleNavClick('planos')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-extrabold text-xs uppercase tracking-wider text-center shadow-lg shadow-pink-500/20 active:scale-98 transition-transform"
              >
                🔥 Assinar a partir de R$ 19,90
              </button>
              <p className="text-[10px] text-zinc-400 text-center mt-2 font-medium">
                Liberação instantânea via PIX
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
