import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFighterStore } from '../store/useFighterStore';
import { FighterSprite } from './FighterSprite';
import { soundManager } from '../utils/audio';
import { Zap, Flame, Sparkles } from 'lucide-react';

export const BattlePresentation: React.FC = () => {
  const { fighters, player1Id, player2Id, proceedToCountdown, finishCountdown, screen } = useFighterStore();

  const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
  const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

  const [phase, setPhase] = useState<'intro' | 'versus' | 'countdown'>('intro');
  const [countdownNum, setCountdownNum] = useState<number | 'LUTE!'>(3);

  useEffect(() => {
    // Phase 1: Entrances
    soundManager.playSpecial();

    const t1 = setTimeout(() => {
      setPhase('versus');
    }, 1800);

    const t2 = setTimeout(() => {
      setPhase('countdown');
      proceedToCountdown();
      
      // 3
      setCountdownNum(3);
      soundManager.playCountdown(3);

      // 2
      setTimeout(() => {
        setCountdownNum(2);
        soundManager.playCountdown(2);
      }, 900);

      // 1
      setTimeout(() => {
        setCountdownNum(1);
        soundManager.playCountdown(1);
      }, 1800);

      // LUTE!
      setTimeout(() => {
        setCountdownNum('LUTE!');
        soundManager.playCountdown(0);
      }, 2700);

      // Start actual battle
      setTimeout(() => {
        finishCountdown();
      }, 3500);

    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none">
      
      {/* Dramatic Backlight rays and radial gradient */}
      <div className="absolute inset-0 bg-radial from-blue-900/40 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* PHASE 1 & 2: INTRO AND VERSUS SHOWCASE */}
      {phase !== 'countdown' && (
        <div className="relative w-full max-w-4xl mx-auto px-3 flex flex-col items-center justify-center min-h-[90dvh] max-h-[100dvh] overflow-hidden">
          
          {/* Main Title Badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-500/30 border border-white mb-2 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>⚡ BATALHA PRESIDENCIAL ⚡</span>
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
          </motion.div>

          {/* Opponents Banner Split - Perfeito no Celular Android */}
          <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-2 sm:gap-6 items-center relative">
            
            {/* P1 Entrance Slide */}
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center justify-center md:justify-end gap-2 w-full"
            >
              <div className="text-right">
                <span className="text-[10px] font-black tracking-wider text-blue-400 uppercase bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-700/60">
                  JOGADOR 1
                </span>
                <h2 className="text-xl sm:text-4xl font-black text-white tracking-tight uppercase mt-0.5">
                  {p1.name}
                </h2>
                <p className="text-[11px] font-bold text-amber-300 line-clamp-1">
                  {p1.dialogues.entry}
                </p>
              </div>
              <div className="w-20 h-28 sm:w-36 sm:h-44 flex items-center justify-center shrink-0">
                <div className="scale-75 sm:scale-100 origin-center">
                  <FighterSprite fighter={p1} state="attack" facing="right" size="sm" />
                </div>
              </div>
            </motion.div>

            {/* VS Symbol Center */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', damping: 10 }}
              className="w-9 h-9 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 border-2 border-white flex items-center justify-center text-xs sm:text-xl font-black text-white shadow-xl shadow-rose-600/50 z-20 shrink-0 my-0.5 md:my-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            >
              VS
            </motion.div>

            {/* P2 Entrance Slide */}
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
              className="flex items-center justify-center md:justify-start gap-2 w-full"
            >
              <div className="w-20 h-28 sm:w-36 sm:h-44 flex items-center justify-center shrink-0">
                <div className="scale-75 sm:scale-100 origin-center">
                  <FighterSprite fighter={p2} state="attack" facing="left" size="sm" />
                </div>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black tracking-wider text-red-400 uppercase bg-red-950/80 px-2 py-0.5 rounded-full border border-red-700/60">
                  JOGADOR 2
                </span>
                <h2 className="text-xl sm:text-4xl font-black text-white tracking-tight uppercase mt-0.5">
                  {p2.name}
                </h2>
                <p className="text-[11px] font-bold text-amber-300 line-clamp-1">
                  {p2.dialogues.entry}
                </p>
              </div>
            </motion.div>

          </div>

          {/* Arena Staging Announcement text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-center"
          >
            <p className="text-[10px] sm:text-xs text-zinc-400 uppercase tracking-widest font-bold">
              ARENA NACIONAL DE DEBATES • HORÁRIO NOBRE
            </p>
          </motion.div>

          {/* Botão rápido para pular contagem */}
          <button
            onClick={() => finishCountdown()}
            className="mt-2.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700 text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-wider cursor-pointer active:scale-95"
          >
            Pular Introdução ⏩
          </button>

        </div>
      )}

      {/* PHASE 3: EXPLOSIVE COUNTDOWN (3... 2... 1... LUTE!) */}
      {phase === 'countdown' && (
        <div className="relative flex flex-col items-center justify-center">
          {/* Pulsing shockwave circle */}
          <motion.div
            key={`pulse-${countdownNum}`}
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full border-4 border-amber-400 pointer-events-none"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={`count-${countdownNum}`}
              initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="text-center"
            >
              <span
                className={`font-black tracking-tighter drop-shadow-[0_0_35px_rgba(251,191,36,0.9)] ${
                  countdownNum === 'LUTE!'
                    ? 'text-7xl sm:text-9xl md:text-[12rem] bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent'
                    : 'text-8xl sm:text-9xl md:text-[13rem] text-white'
                }`}
              >
                {countdownNum}
              </span>

              {countdownNum === 'LUTE!' && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl sm:text-2xl font-black text-amber-300 tracking-widest uppercase mt-2"
                >
                  DEBATAM COM FORÇA TOTAL!
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};
