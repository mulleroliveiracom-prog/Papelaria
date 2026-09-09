import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFighterStore } from '../store/useFighterStore';
import { FighterSprite } from './FighterSprite';
import { soundManager } from '../utils/audio';
import { Zap, Flame, Sparkles, Heart, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';

export const BattlePresentation: React.FC = () => {
  const {
    fighters,
    player1Id,
    player2Id,
    rosesToStart,
    currentRosesCount,
    addPreFightRose,
    finishCountdown,
    isMuted,
    toggleMute,
    autoLiveSimulator,
  } = useFighterStore();

  const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
  const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

  const [phase, setPhase] = useState<'prefight' | 'starting' | 'countdown'>('prefight');
  const [countdownNum, setCountdownNum] = useState<number | 'LUTE!'>(3);

  // Se simulador de live estiver ligado, enviar rosas automaticamente na pré-luta
  useEffect(() => {
    if (!autoLiveSimulator || phase !== 'prefight') return;
    const interval = setInterval(() => {
      addPreFightRose(Math.random() > 0.5 ? 1 : 2, 1);
    }, 1800);
    return () => clearInterval(interval);
  }, [autoLiveSimulator, phase, addPreFightRose]);

  // Se atingir a meta de rosas na pré-luta, iniciar transição
  useEffect(() => {
    if (phase === 'prefight' && currentRosesCount >= rosesToStart) {
      triggerCountdown();
    }
  }, [currentRosesCount, rosesToStart, phase]);

  const triggerCountdown = () => {
    setPhase('starting');
    soundManager.playSpecial();

    setTimeout(() => {
      setPhase('countdown');
      
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

      // Entrar na Arena de Combate Horizontal
      setTimeout(() => {
        finishCountdown();
      }, 3600);

    }, 1200);
  };

  const progressPercent = Math.min(100, Math.round((currentRosesCount / rosesToStart) * 100));

  return (
    <div className="w-full h-full min-h-[100dvh] max-h-[100dvh] bg-black text-white flex flex-col justify-between overflow-hidden select-none relative p-3 sm:p-6">
      
      {/* Background Cinematográfico de Estádio de Debate */}
      <div className="absolute inset-0 bg-radial from-blue-950/40 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between w-full max-w-6xl mx-auto shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 border border-amber-300">
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>⚔️ BATALHA PRESIDENCIAL ⚔️</span>
          </div>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 hidden md:inline">
            • TRANSMISSÃO AO VIVO (16:9)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer active:scale-95"
            title={isMuted ? 'Desmutar' : 'Mutar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={triggerCountdown}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-amber-500/30 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>Começar Luta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Conteúdo Principal: Pré-Luta Horizontal OU Contagem */}
      {phase !== 'countdown' ? (
        <main className="flex-1 min-h-0 relative flex flex-col justify-center items-center max-w-6xl mx-auto w-full px-2 sm:px-6">
          
          {/* Status Principal Chamativo da Live */}
          <div className="text-center mb-2 sm:mb-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-xs font-bold mb-1 shadow-md"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>⚔️ A BATALHA AINDA NÃO COMEÇOU</span>
            </motion.div>

            <motion.h1
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 drop-shadow-[0_2px_10px_rgba(244,63,94,0.5)]"
            >
              🌹 MANDE ROSAS PARA INICIAR A LUTA! 🌹
            </motion.h1>
          </div>

          {/* PALCO CENTRAL HORIZONTAL: OS DOIS LUTADORES INTEIROS + VS + META DE ROSAS */}
          <div className="w-full grid grid-cols-12 items-center justify-between gap-2 sm:gap-4 my-auto">
            
            {/* LUTADOR 1 (ESQUERDA - 100% INTEIRO) */}
            <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-center">
              <div className="w-full max-w-[240px] text-center mb-1">
                <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-700/60 shadow-md">
                  1P • {p1.nickname}
                </span>
                <h2 className="text-lg sm:text-3xl font-black text-white uppercase truncate tracking-wide mt-0.5">
                  {p1.name}
                </h2>
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-mono font-black text-xs sm:text-sm">
                  <Heart className="w-3.5 h-3.5 fill-emerald-500" />
                  <span>❤️ {p1.stats.hp} HP</span>
                </div>
              </div>

              {/* Sprite Inteiro (Cabeça, Corpo, Braços, Pernas, Pés) */}
              <div className="transform scale-85 sm:scale-100 md:scale-110 origin-bottom">
                <FighterSprite
                  fighter={p1}
                  state="idle"
                  facing="right"
                  size="md"
                />
              </div>

              {/* Botão de Enviar Rosa para P1 */}
              <button
                onClick={() => addPreFightRose(1, 1)}
                className="mt-2 px-3 py-1.5 rounded-xl bg-blue-900/70 hover:bg-blue-800 border border-blue-500/80 text-blue-200 text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span>🌹 +1 Rosa p/ {p1.name}</span>
              </button>
            </div>

            {/* CENTRO: VS + CONTADOR E BARRA DE ROSAS DA LIVE */}
            <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-center text-center px-1">
              
              {/* Círculo VS */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 border-2 border-white flex items-center justify-center text-base sm:text-2xl font-black text-white shadow-xl shadow-rose-600/50 mb-3">
                VS
              </div>

              {/* Box de Meta de Rosas */}
              <div className="w-full max-w-[280px] bg-zinc-900/90 backdrop-blur-md p-3 rounded-2xl border-2 border-rose-500/80 shadow-2xl shadow-rose-950/80">
                <div className="flex items-center justify-between text-xs font-black text-zinc-300 mb-1">
                  <span className="flex items-center gap-1 text-rose-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ROSAS RECEBIDAS:</span>
                  </span>
                  <span className="font-mono text-sm text-yellow-300 font-black">
                    {currentRosesCount} / {rosesToStart}
                  </span>
                </div>

                {/* Barra de Progresso de Rosas */}
                <div className="w-full h-3.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-rose-600 via-pink-500 to-yellow-400 rounded-full shadow-md"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <p className="text-[10px] text-zinc-400 font-bold mt-1.5 text-center">
                  Faltam <strong className="text-rose-400">{Math.max(0, rosesToStart - currentRosesCount)}</strong> rosas para o gongo soar!
                </p>

                {/* Botões Rápidos de Ação da Audiência */}
                <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                  <button
                    onClick={() => addPreFightRose(1, 1)}
                    className="py-1.5 px-2 rounded-lg bg-pink-950/80 hover:bg-pink-900 border border-pink-600 text-[11px] font-black text-pink-200 cursor-pointer active:scale-95"
                  >
                    🌹 Enviar 1 Rosa
                  </button>
                  <button
                    onClick={() => addPreFightRose(2, 5)}
                    className="py-1.5 px-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-600 text-[11px] font-black text-amber-200 cursor-pointer active:scale-95"
                  >
                    🚀 Enviar 5 Rosas
                  </button>
                </div>
              </div>

            </div>

            {/* LUTADOR 2 (DIREITA - 100% INTEIRO) */}
            <div className="col-span-4 sm:col-span-4 flex flex-col items-center justify-center">
              <div className="w-full max-w-[240px] text-center mb-1">
                <span className="text-[10px] font-black uppercase text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-700/60 shadow-md">
                  2P • {p2.nickname}
                </span>
                <h2 className="text-lg sm:text-3xl font-black text-white uppercase truncate tracking-wide mt-0.5">
                  {p2.name}
                </h2>
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-mono font-black text-xs sm:text-sm">
                  <Heart className="w-3.5 h-3.5 fill-emerald-500" />
                  <span>❤️ {p2.stats.hp} HP</span>
                </div>
              </div>

              {/* Sprite Inteiro (Cabeça, Corpo, Braços, Pernas, Pés) */}
              <div className="transform scale-85 sm:scale-100 md:scale-110 origin-bottom">
                <FighterSprite
                  fighter={p2}
                  state="idle"
                  facing="left"
                  size="md"
                />
              </div>

              {/* Botão de Enviar Rosa para P2 */}
              <button
                onClick={() => addPreFightRose(2, 1)}
                className="mt-2 px-3 py-1.5 rounded-xl bg-red-900/70 hover:bg-red-800 border border-red-500/80 text-red-200 text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span>🌹 +1 Rosa p/ {p2.name}</span>
              </button>
            </div>

          </div>

          {/* Dica da Live Inferior */}
          <div className="mt-2 text-center">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">
              ⚡ LIVE INTERATIVA: Cada presente enviado ativa combos reais nos debatedores!
            </span>
          </div>

        </main>
      ) : (
        /* CONTAGEM EXPLOSIVA: 3... 2... 1... LUTE! */
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative">
          <motion.div
            key={`pulse-${countdownNum}`}
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute w-72 h-72 rounded-full border-4 border-amber-400 pointer-events-none"
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
                className={`font-black tracking-tighter drop-shadow-[0_0_45px_rgba(251,191,36,0.95)] ${
                  countdownNum === 'LUTE!'
                    ? 'text-8xl sm:text-9xl md:text-[14rem] bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent'
                    : 'text-9xl sm:text-[12rem] md:text-[15rem] text-white'
                }`}
              >
                {countdownNum}
              </span>

              {countdownNum === 'LUTE!' && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-black text-amber-300 tracking-widest uppercase mt-2"
                >
                  DEBATAM COM FORÇA TOTAL!
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Footer com botão de pular e dica */}
      <footer className="relative z-20 flex items-center justify-between w-full max-w-6xl mx-auto text-[10px] sm:text-xs text-zinc-500 shrink-0">
        <span>Transmissão em Alta Definição • Layout 16:9</span>
        <button
          onClick={() => finishCountdown()}
          className="text-zinc-400 hover:text-amber-300 font-bold uppercase cursor-pointer"
        >
          Pular Pré-Luta Direto Para o Combate ⏩
        </button>
      </footer>

    </div>
  );
};
