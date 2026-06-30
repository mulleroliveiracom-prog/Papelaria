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
          
          {/* Link: Ver Prévias Gratuitas (Premium High-Conversion Destaque) */}
          <motion.a
            href="https://t.me/Julia38bot"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="block w-full"
          >
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 p-[1.5px] shadow-2xl shadow-pink-500/30 active:scale-[0.98] transition-all duration-300">
              {/* Pulsing neon glow behind the button */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-violet-600 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity animate-pulse" />
              
              <div className="relative bg-zinc-950/85 hover:bg-zinc-950/60 rounded-[14px] py-5 px-6 flex items-center justify-between text-center font-bold text-white transition-all">
                {/* Live pinging dot indicator inside the button */}
                <span className="relative flex h-3.5 w-3.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500"></span>
                </span>
                
                <span className="text-base md:text-lg font-black tracking-wide uppercase flex items-center gap-2">
                  😈 Ver Prévias Gratuitas
                  <span className="text-[9px] bg-gradient-to-r from-amber-400 to-pink-500 text-white font-black py-0.5 px-2 rounded-full uppercase tracking-widest shadow-md">
                    Liberado
                  </span>
                </span>
                
                <ExternalLink className="w-5 h-5 text-pink-400 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" strokeWidth={2.2} />
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

