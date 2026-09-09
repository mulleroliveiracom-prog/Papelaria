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
        <div className="relative w-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center min-h-[500px]">
          
          {/* Main Title Badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black text-sm sm:text-base uppercase tracking-widest shadow-2xl shadow-amber-500/40 border-2 border-white mb-6"
          >
            <Zap className="w-5 h-5 fill-zinc-950" />
            <span>⚡ BATALHA PRESIDENCIAL ⚡</span>
            <Zap className="w-5 h-5 fill-zinc-950" />
          </motion.div>

          {/* Opponents Banner Split */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
            
            {/* P1 Entrance Slide */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex flex-col items-center md:items-end text-center md:text-right relative"
            >
              <div className="flex items-center gap-4">
                <div className="order-2 md:order-1">
                  <span className="text-xs font-black tracking-widest text-blue-400 uppercase bg-blue-950/80 px-3 py-1 rounded-full border border-blue-700/60">
                    JOGADOR 1
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mt-2">
                    {p1.name}
                  </h2>
                  <p className="text-sm font-bold text-amber-300 mt-1 uppercase tracking-wider">
                    {p1.dialogues.entry}
                  </p>
                  <p className="text-xs text-zinc-400 italic mt-0.5">
                    "{p1.tagline}"
                  </p>
                </div>
                <div className="order-1 md:order-2 w-44 h-56 flex items-center justify-center">
                  <FighterSprite fighter={p1} state="attack" facing="right" size="lg" />
                </div>
              </div>
            </motion.div>

            {/* VS Symbol Center */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', damping: 10 }}
              className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 border-4 border-zinc-950 items-center justify-center text-3xl font-black text-white shadow-2xl shadow-rose-600/50 z-20"
            >
              VS
            </motion.div>

            {/* P2 Entrance Slide */}
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="flex flex-col items-center md:items-start text-center md:text-left relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-44 h-56 flex items-center justify-center">
                  <FighterSprite fighter={p2} state="attack" facing="left" size="lg" />
                </div>
                <div>
                  <span className="text-xs font-black tracking-widest text-red-400 uppercase bg-red-950/80 px-3 py-1 rounded-full border border-red-700/60">
                    JOGADOR 2
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase mt-2">
                    {p2.name}
                  </h2>
                  <p className="text-sm font-bold text-amber-300 mt-1 uppercase tracking-wider">
                    {p2.dialogues.entry}
                  </p>
                  <p className="text-xs text-zinc-400 italic mt-0.5">
                    "{p2.tagline}"
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Arena Staging Announcement text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-xs sm:text-sm text-zinc-400 uppercase tracking-widest font-bold">
              ARENA NACIONAL DE DEBATES • HORÁRIO NOBRE
            </p>
          </motion.div>

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
