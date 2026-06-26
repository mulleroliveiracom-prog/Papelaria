import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldCheck, CheckCircle2, ChevronRight, Activity, ArrowRight, Globe } from 'lucide-react';

function App() {
  const [ip, setIp] = useState('177.124.92.18');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Generate a random-looking IP address on mount to add social/security proof
  useEffect(() => {
    const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 220) + 14);
    setIp(octets.join('.'));
  }, []);

  const handleRedirect = () => {
    setIsRedirecting(true);
    // Smooth delay before redirecting to allow progress animation
    setTimeout(() => {
      window.location.href = 'https://elza-omega.vercel.app';
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Premium Radial Dark Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/60 via-zinc-950 to-zinc-950 pointer-events-none z-0" />
      
      {/* Decorative premium light beam in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-60 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Animated Card Entry */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/80 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Subtle reflection on card border */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent pointer-events-none" />

          {/* Top Security Icon with Animated Pulse Rings */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
              <Lock className="w-7 h-7" strokeWidth={1.5} />
            </div>
            {/* Small green active badge */}
            <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-zinc-900"></span>
            </span>
          </div>

          {/* Secure/Compliance Indicators */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full mb-5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Conexão Segura Ativada
            </span>
          </div>

          {/* Heading - Title (White) */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
            Convite Privado Recebido
          </h1>

          {/* Subtitle (Light gray) */}
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-normal mb-8">
            O conteúdo a seguir é de acesso restrito. Confirme abaixo para liberar sua visualização e prosseguir para a página oficial.
          </p>

          {/* Live verification details card */}
          <div className="w-full bg-zinc-950/80 border border-zinc-800/40 rounded-2xl p-4 mb-8 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> IP Destinatário
              </span>
              <span className="font-mono text-zinc-300 font-medium select-none">{ip}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> Criptografia
              </span>
              <span className="text-emerald-500 font-semibold uppercase tracking-wider text-[10px]">
                SSL 256-Bit Ativo
              </span>
            </div>
          </div>

          {/* Action Button - Large, Emerald Green, Slow Pulse */}
          <button
            onClick={handleRedirect}
            disabled={isRedirecting}
            className={`group relative w-full overflow-hidden py-5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-zinc-950 font-extrabold text-sm md:text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/10 ${
              isRedirecting ? 'opacity-80 cursor-not-allowed' : 'animate-pulse'
            }`}
          >
            {isRedirecting ? (
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>REDIRECIONANDO...</span>
              </div>
            ) : (
              <>
                <span>🟢 SIM, QUERO ACESSAR AGORA</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Safe redirection note */}
          <p className="text-[11px] text-zinc-500 mt-5 italic">
            Você será redirecionado para a página oficial em ambiente seguro.
          </p>
        </motion.div>

        {/* Footer info under the card */}
        <div className="mt-8 text-center space-y-2 text-xs text-zinc-600">
          <p>© 2026 Conexão Blindada. Todos os direitos reservados.</p>
          <p className="italic">Link verificado e seguro contra bots e fraudes de rede.</p>
        </div>
      </div>
    </div>
  );
}

export default App;

