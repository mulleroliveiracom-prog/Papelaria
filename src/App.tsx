import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ExternalLink, ShieldCheck, Flame } from 'lucide-react';

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-zinc-900 to-black text-zinc-100 font-sans flex flex-col items-center justify-between p-6 overflow-hidden select-none">
      
      {/* Background grids & radial glow for high-end aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[400px] bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.08)_0%,_transparent_65%)] pointer-events-none z-0" />
      
      {/* Fine-line grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* Top spacing bar / safe area */}
      <div className="w-full max-w-md h-4 z-10" />

      {/* Main Content Area */}
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center py-8 z-10 space-y-8">
        
        {/* Profile Details (SEM FOTO) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          {/* Subtle online badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/40 border border-zinc-700/30 rounded-full backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">ONLINE AGORA</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight pt-1">
            @elzadias
          </h1>
          <p className="text-sm font-semibold text-zinc-400 tracking-wide">
            Criadora de conteúdo | 20 aninhos ✨
          </p>
        </motion.div>

        {/* Buttons Links List */}
        <div className="w-full space-y-4">
          
          {/* Link 1: Acesso VIP (Main product, high prominence, slow pulse) */}
          <motion.a
            href="https://elza-omega.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="block"
          >
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 p-[1px] shadow-xl shadow-purple-950/20 active:scale-[0.98] transition-transform duration-200">
              {/* Pulsing glow background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative bg-zinc-950/20 rounded-[15px] py-4 px-6 flex items-center justify-between text-center font-bold text-white transition-colors animate-pulse">
                <span className="w-5" /> {/* Spacer to align title */}
                <span className="text-base font-extrabold tracking-wide uppercase flex items-center gap-2">
                  🔥 ACESSO VIP COMPLETO <span className="text-xs bg-black/40 text-emerald-300 py-1 px-2.5 rounded-full font-black border border-emerald-500/20">R$ 9,99</span>
                </span>
                <ExternalLink className="w-5 h-5 text-zinc-300/80 group-hover:text-white transition-colors" strokeWidth={1.8} />
              </div>
            </div>
          </motion.a>

          {/* Link 2: Ver Prévias Gratuitas (Translucid) */}
          <motion.a
            href="https://t.me/Julia38bot"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="block"
          >
            <div className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-zinc-800/60 p-[1px] active:scale-[0.98] transition-all duration-200 shadow-lg">
              <div className="py-4 px-6 flex items-center justify-between font-bold text-white">
                <span className="w-5" /> {/* Spacer */}
                <span className="text-base font-bold tracking-wide flex items-center gap-2 text-zinc-100">
                  😈 Ver Prévias Gratuitas
                </span>
                <ExternalLink className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" strokeWidth={1.8} />
              </div>
            </div>
          </motion.a>

          {/* Link 3: Grupo Secreto Zangi (Sigilo Total) */}
          <motion.a
            href="https://serverflow.dad/c/zangi-4fc2"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="block"
          >
            <div className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-zinc-800/60 p-[1px] active:scale-[0.98] transition-all duration-200 shadow-lg">
              <div className="py-4 px-6 flex items-center justify-between font-bold text-white">
                <span className="w-5" /> {/* Spacer */}
                <span className="text-base font-bold tracking-wide flex items-center gap-2 text-zinc-100">
                  💬 Grupo Secreto no Zangi (Sigilo Total)
                </span>
                <ExternalLink className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" strokeWidth={1.8} />
              </div>
            </div>
          </motion.a>

        </div>

        {/* Safe Badge Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-2 text-zinc-500 text-xs px-4 py-2 bg-zinc-950/40 rounded-full border border-zinc-900"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold tracking-wider text-[10px] uppercase">Acesso 100% Blindado & Seguro</span>
        </motion.div>

      </div>

      {/* Footer Info */}
      <footer className="w-full max-w-md text-center py-6 z-10 border-t border-zinc-900/50">
        <p className="text-[10px] text-zinc-600 font-medium tracking-wider">
          © 2026 @elzadias. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default App;

