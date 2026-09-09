import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFighterStore } from '../store/useFighterStore';
import { FighterSprite } from './FighterSprite';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  MessageSquare,
  Trophy,
  ArrowLeft,
  Zap,
  Flame,
  Shield,
  Settings,
  X,
  Heart,
  Smartphone,
  Check,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const BattleArena: React.FC = () => {
  const {
    fighters,
    gifts,
    player1Id,
    player2Id,
    p1Hp,
    p1MaxHp,
    p1Energy,
    p1State,
    p2Hp,
    p2MaxHp,
    p2Energy,
    p2State,
    roundWinner,
    comboCount,
    damageNumbers,
    currentGiftAlert,
    combatLogs,
    isMuted,
    autoLiveSimulator,
    rosesToStart,
    setRosesToStart,
    executeAttack,
    sendGift,
    restartMatch,
    returnToSelection,
    toggleAutoLive,
    toggleMute,
    setScreen,
  } = useFighterStore();

  const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
  const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

  const [giftTarget, setGiftTarget] = useState<1 | 2>(1);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissPortraitWarning, setDismissPortraitWarning] = useState(false);

  // Monitorar se a tela está em orientação vertical (retrato) para sugerir virar para horizontal
  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window !== 'undefined') {
        setIsPortrait(window.innerHeight > window.innerWidth);
      }
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Simulação de live com presentes da audiência (opcional, acionado no botão Play/Pause)
  useEffect(() => {
    if (!autoLiveSimulator || roundWinner !== null) return;

    const interval = setInterval(() => {
      // Dar preferência para a Rosa (mais comum na live)
      const isRose = Math.random() < 0.55;
      const chosenGift = isRose ? gifts.find((g) => g.id === 'rosa') || gifts[0] : gifts[Math.floor(Math.random() * gifts.length)];
      const randomTarget: 1 | 2 = Math.random() > 0.5 ? 1 : 2;
      const fakeUsers = [
        '@marcos_brasil',
        '@ana_eleitora',
        '@patriota_sp',
        '@povo_nordeste',
        '@felipecorrea',
        '@debatedor_top',
        '@maria_silva',
        '@gabriel_gamer',
        '@camila_live',
        '@voto_consciente',
      ];
      const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
      sendGift(randomTarget, chosenGift.id, randomUser);
    }, 2800);

    return () => clearInterval(interval);
  }, [autoLiveSimulator, roundWinner, gifts, sendGift]);

  // Porcentagens de HP
  const p1HpPercent = Math.max(0, Math.min(100, (p1Hp / p1MaxHp) * 100));
  const p2HpPercent = Math.max(0, Math.min(100, (p2Hp / p2MaxHp) * 100));

  const getHpColor = (percent: number) => {
    if (percent > 50) return 'from-emerald-500 via-teal-400 to-emerald-400';
    if (percent > 25) return 'from-amber-500 via-yellow-400 to-amber-400';
    return 'from-rose-600 via-red-500 to-rose-500 animate-pulse';
  };

  const roseGift = gifts.find((g) => g.id === 'rosa') || gifts[0];

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-zinc-950 text-white flex flex-col justify-between select-none overflow-hidden relative">
      
      {/* ARENA BACKGROUND COM ILUMINAÇÃO DE TRANSMISSÃO EM HORIZONTAL */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[110px]" />
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-red-600/15 rounded-full blur-[110px]" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-zinc-900 via-zinc-950/95 to-transparent" />
        <div className="absolute bottom-28 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      </div>

      {/* AVISO DISCRETO CASO DISPOSITIVO ESTEJA EM RETRATO (VERTICAL) */}
      {isPortrait && !dismissPortraitWarning && (
        <div className="relative z-50 bg-gradient-to-r from-amber-950 via-yellow-900/90 to-amber-950 text-amber-200 border-b border-amber-600 px-3 py-1.5 flex items-center justify-between text-xs font-bold shrink-0 shadow-lg">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>📱 <strong>Melhor em LIVE:</strong> Gire o aparelho para o lado (Horizontal 16:9) para ver toda a arena sem cortes!</span>
          </div>
          <button
            onClick={() => setDismissPortraitWarning(true)}
            className="p-1 rounded hover:bg-amber-800 text-amber-300 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOPO DA ARENA: HUD DE JOGO DE LUTA PROFISSIONAL PARA TRANSMISSÃO EM LIVE */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full px-2 pt-1.5 sm:px-6 sm:pt-2 max-w-7xl mx-auto shrink-0">
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center bg-zinc-900/90 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-zinc-800 shadow-2xl">
          
          {/* LADO ESQUERDO: HUD DO JOGADOR 1 (RENAN) */}
          <div className="col-span-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-600 text-[10px] sm:text-xs font-black flex items-center justify-center text-white shrink-0 shadow-sm">
                  1P
                </span>
                <h3 className="text-xs sm:text-base font-black uppercase tracking-tight text-white truncate drop-shadow-sm">
                  {p1.name}
                </h3>
                <span className="text-[9px] sm:text-[10px] text-blue-400 font-bold uppercase hidden lg:inline">
                  • {p1.nickname}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] sm:text-sm font-black font-mono text-emerald-400 shrink-0">
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-emerald-500" />
                <span>{p1Hp}</span>
                <span className="text-zinc-500 text-[10px]">/{p1MaxHp}</span>
              </div>
            </div>

            {/* Barra de Vida HP P1 */}
            <div className="w-full h-3 sm:h-4 bg-zinc-950 rounded-full overflow-hidden border border-zinc-700/80 p-0.5 shadow-inner">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${getHpColor(p1HpPercent)} shadow-md`}
                initial={{ width: '100%' }}
                animate={{ width: `${p1HpPercent}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>

            {/* Barra de Especial / Energia P1 */}
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-amber-400 shrink-0">
                SPECIAL
              </span>
              <div className="flex-1 h-1.5 sm:h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    p1Energy >= 100
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse shadow-sm shadow-amber-400/80'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${p1Energy}%` }}
                />
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono font-black text-zinc-400">
                {p1Energy}%
              </span>
            </div>
          </div>

          {/* CENTRO DO PLACAR: ROUND 1, VS E CONTROLE DA TRANSMISSÃO */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-red-400">
                LIVE
              </span>
            </div>

            {/* Emblema Central VS & ROUND */}
            <div className="flex items-center gap-1.5">
              <div className="px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-700 text-amber-400 font-black text-[10px] sm:text-xs tracking-wider">
                ROUND 1
              </div>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 active:scale-95 cursor-pointer"
                title="Configurações e Controles da Arena"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>

            {comboCount > 1 && (
              <span className="text-[9px] sm:text-[10px] font-black text-amber-300 uppercase tracking-widest animate-bounce mt-0.5">
                🔥 COMBO x{comboCount}!
              </span>
            )}
          </div>

          {/* LADO DIREITO: HUD DO JOGADOR 2 (CIRO) */}
          <div className="col-span-5 flex flex-col gap-1">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-1.5 min-w-0 flex-row-reverse">
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-red-600 text-[10px] sm:text-xs font-black flex items-center justify-center text-white shrink-0 shadow-sm">
                  2P
                </span>
                <h3 className="text-xs sm:text-base font-black uppercase tracking-tight text-white truncate drop-shadow-sm">
                  {p2.name}
                </h3>
                <span className="text-[9px] sm:text-[10px] text-red-400 font-bold uppercase hidden lg:inline">
                  • {p2.nickname}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] sm:text-sm font-black font-mono text-emerald-400 shrink-0">
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-emerald-500" />
                <span>{p2Hp}</span>
                <span className="text-zinc-500 text-[10px]">/{p2MaxHp}</span>
              </div>
            </div>

            {/* Barra de Vida HP P2 */}
            <div className="w-full h-3 sm:h-4 bg-zinc-950 rounded-full overflow-hidden border border-zinc-700/80 p-0.5 shadow-inner">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${getHpColor(p2HpPercent)} shadow-md ml-auto`}
                initial={{ width: '100%' }}
                animate={{ width: `${p2HpPercent}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>

            {/* Barra de Especial / Energia P2 */}
            <div className="flex items-center gap-1.5 flex-row-reverse">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-amber-400 shrink-0">
                SPECIAL
              </span>
              <div className="flex-1 h-1.5 sm:h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ml-auto ${
                    p2Energy >= 100
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 animate-pulse shadow-sm shadow-amber-400/80'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${p2Energy}%` }}
                />
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono font-black text-zinc-400">
                {p2Energy}%
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ÁREA CENTRAL: A ARENA MAIOR (OS DOIS LUTADORES APARECEM 100% INTEIROS) */}
      {/* ========================================================================= */}
      <main className="flex-1 min-h-0 relative flex items-end justify-between px-4 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full pb-1 sm:pb-2">
        
        {/* NOTIFICAÇÃO DE IMPACTO DE PRESENTE NA LIVE (SEÇÃO 8) */}
        <AnimatePresence>
          {currentGiftAlert && (
            <motion.div
              initial={{ scale: 0.7, y: -25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 14 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-rose-950 via-zinc-900 to-rose-950 text-white border-2 border-pink-500 px-4 py-2 rounded-2xl shadow-2xl shadow-rose-900/60 flex items-center gap-3 backdrop-blur-md min-w-[280px] max-w-md justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-3xl animate-bounce">{currentGiftAlert.giftIcon}</span>
                <div className="text-left">
                  <p className="text-xs font-black text-pink-300 leading-tight">
                    {currentGiftAlert.sender} enviou <strong className="text-yellow-300">{currentGiftAlert.giftName}</strong>!
                  </p>
                  <p className="text-[11px] font-bold text-white uppercase mt-0.5">
                    {currentGiftAlert.fighterName} ATACA COM {currentGiftAlert.attackName}!
                  </p>
                </div>
              </div>
              <span className="text-sm font-black text-pink-400 font-mono bg-pink-950/80 px-2.5 py-1 rounded-xl border border-pink-600 shrink-0">
                💥 -{currentGiftAlert.damage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NÚMEROS DE DANO FLUTUANTES (FLOATING COMBAT TEXT) */}
        {damageNumbers.map((dmg) => (
          <motion.div
            key={dmg.id}
            initial={{ opacity: 1, y: 0, scale: dmg.isCrit ? 1.4 : 1 }}
            animate={{ opacity: 0, y: -70, scale: dmg.isCrit ? 1.8 : 1.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ left: `${dmg.x}%`, top: `${dmg.y}%` }}
            className="absolute pointer-events-none z-30 font-black font-mono text-xl sm:text-3xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            <span style={{ color: dmg.color }}>
              {dmg.isCrit ? `💥 -${dmg.value}!` : `-${dmg.value}`}
            </span>
            {dmg.isCrit && (
              <span className="block text-[10px] font-sans font-black text-amber-300 uppercase tracking-widest text-center">
                CRÍTICO!
              </span>
            )}
          </motion.div>
        ))}

        {/* LUTADOR 1 (RENAN - LADO ESQUERDO DA ARENA - 100% INTEIRO) */}
        <div className="flex flex-col items-center relative shrink-0 z-20">
          {/* Balão de Fala do Especial */}
          {p1State === 'special' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute -top-14 sm:-top-16 bg-white text-zinc-950 font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-xl shadow-2xl border-2 border-zinc-900 z-30 whitespace-nowrap max-w-[180px] truncate"
            >
              🗣️ {p1.dialogues.specialQuote}
            </motion.div>
          )}

          {/* Sprite de Renan completo com cabeça, corpo, braços, pernas e pés */}
          <div className="transform scale-80 sm:scale-95 lg:scale-105 origin-bottom">
            <FighterSprite
              fighter={p1}
              state={p1State}
              facing="right"
              size="lg"
            />
          </div>

          <span className="text-[10px] sm:text-xs font-black tracking-wider text-blue-300 uppercase bg-blue-950/90 px-3 py-0.5 rounded-lg border border-blue-700/70 shadow-lg mt-1">
            {p1.name}
          </span>
        </div>

        {/* CENTRO DA ARENA: PODIUM / MARCADOR DE DEBATE */}
        <div className="flex flex-col items-center justify-center opacity-40 pointer-events-none mb-4 shrink-0">
          <div className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-xs font-black text-zinc-500 font-mono">
            VS
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mt-1">
            PALCO DO DEBATE
          </span>
        </div>

        {/* LUTADOR 2 (CIRO - LADO DIREITO DA ARENA - 100% INTEIRO SEM NENHUM CORTE) */}
        <div className="flex flex-col items-center relative shrink-0 z-20">
          {/* Balão de Fala do Especial */}
          {p2State === 'special' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute -top-14 sm:-top-16 bg-white text-zinc-950 font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-xl shadow-2xl border-2 border-zinc-900 z-30 whitespace-nowrap max-w-[180px] truncate"
            >
              🗣️ {p2.dialogues.specialQuote}
            </motion.div>
          )}

          {/* Sprite de Ciro completo com cabeça, corpo, braços, pernas e pés */}
          <div className="transform scale-80 sm:scale-95 lg:scale-105 origin-bottom">
            <FighterSprite
              fighter={p2}
              state={p2State}
              facing="left"
              size="lg"
            />
          </div>

          <span className="text-[10px] sm:text-xs font-black tracking-wider text-red-300 uppercase bg-red-950/90 px-3 py-0.5 rounded-lg border border-red-700/70 shadow-lg mt-1">
            {p2.name}
          </span>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. PARTE INFERIOR: COMANDOS DOS DOIS JOGADORES LADO A LADO + ÁREA DE PRESENTES */}
      {/* ========================================================================= */}
      <footer className="relative z-30 w-full px-2 pb-2 sm:px-6 sm:pb-3 max-w-7xl mx-auto shrink-0 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        
        {/* BANNER CENTRAL DE PARTICIPAÇÃO DA AUDIÊNCIA (SEÇÃO 5 E 6) */}
        <div className="mb-1.5 bg-gradient-to-r from-pink-950/40 via-zinc-900/90 to-pink-950/40 border border-pink-500/40 rounded-xl p-1.5 flex items-center justify-between gap-2 shadow-lg">
          
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl sm:text-2xl animate-pulse">🎁</span>
            <div className="truncate">
              <span className="text-[11px] sm:text-xs font-black uppercase text-pink-300 tracking-wide block truncate">
                MANDE PRESENTES PARA PARTICIPAR DA LUTA!
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-300 flex items-center gap-1">
                <span>🌹 MANDE ROSAS PARA ATACAR!</span>
              </span>
            </div>
          </div>

          {/* Destaque Gigante da ROSA (Seção 6) */}
          <button
            onClick={() => sendGift(giftTarget, roseGift.id, '@apoiador_live')}
            disabled={roundWinner !== null}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-600/40 active:scale-95 cursor-pointer shrink-0 border border-pink-300"
            title="Enviar Rosa (-70 Dano)"
          >
            <span className="text-base">🌹</span>
            <span>ROSA (-70)</span>
          </button>

          {/* Seletor Rápido de Quem Recebe o Presente */}
          <button
            onClick={() => setGiftTarget(giftTarget === 1 ? 2 : 1)}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shrink-0 border border-zinc-600 text-[10px] font-black active:scale-95 cursor-pointer"
            title="Alternar quem recebe o presente"
          >
            Alvo: <strong className={giftTarget === 1 ? 'text-blue-400' : 'text-red-400'}>{giftTarget === 1 ? '1P' : '2P'}</strong>
          </button>
        </div>

        {/* CARROSSEL RÁPIDO DE TODOS OS PRESENTES COM DANO CLARO (SEÇÃO 5) */}
        <div className="mb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {gifts.map((g) => (
            <button
              key={g.id}
              onClick={() => sendGift(giftTarget, g.id, '@espectador')}
              disabled={roundWinner !== null}
              className={`px-2 py-1 rounded-lg border text-left transition-all active:scale-90 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm ${
                g.id === 'rosa'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
              }`}
              title={`${g.name}: ${g.description}`}
            >
              <span className="text-sm">{g.icon}</span>
              <span className="text-[10px] font-bold text-zinc-200">{g.name}</span>
              <span className="text-[9px] font-mono text-pink-400 font-black">-{g.defaultDamage}</span>
            </button>
          ))}
        </div>

        {/* ===================================================================== */}
        {/* SEÇÃO 4: COMANDOS DOS DOIS PERSONAGENS NA MESMA TELA (LADO A LADO)    */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          
          {/* LADO ESQUERDO: PAINEL DE COMANDOS DE RENAN (P1) */}
          <div className="bg-blue-950/40 p-2 sm:p-2.5 rounded-2xl border border-blue-600/50 shadow-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>COMANDOS DE {p1.name} (P1)</span>
              </span>
              <span className="text-[9px] font-mono text-blue-400 font-bold hidden sm:inline">
                ENERGIA: {p1Energy}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {/* Golpe 1 */}
              <button
                onClick={() => executeAttack(1, 'move1')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-xl bg-zinc-900/90 hover:bg-blue-900/70 active:bg-blue-600 border border-zinc-700 hover:border-blue-500 text-left transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <p className="text-[10px] sm:text-xs font-black text-white truncate">
                  {p1.moves.move1.name}
                </p>
                <span className="text-[9px] font-mono text-amber-400 font-bold">
                  💥 {p1.moves.move1.damage} Dano
                </span>
              </button>

              {/* Golpe 2 */}
              <button
                onClick={() => executeAttack(1, 'move2')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-xl bg-zinc-900/90 hover:bg-blue-900/70 active:bg-blue-600 border border-zinc-700 hover:border-blue-500 text-left transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <p className="text-[10px] sm:text-xs font-black text-white truncate">
                  {p1.moves.move2.name}
                </p>
                <span className="text-[9px] font-mono text-amber-400 font-bold">
                  💥 {p1.moves.move2.damage} Dano
                </span>
              </button>

              {/* Golpe 3 */}
              <button
                onClick={() => executeAttack(1, 'move3')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-xl bg-zinc-900/90 hover:bg-blue-900/70 active:bg-blue-600 border border-zinc-700 hover:border-blue-500 text-left transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <p className="text-[10px] sm:text-xs font-black text-white truncate">
                  {p1.moves.move3.name}
                </p>
                <span className="text-[9px] font-mono text-amber-400 font-bold">
                  💥 {p1.moves.move3.damage} Dano
                </span>
              </button>

              {/* Especial */}
              <button
                onClick={() => executeAttack(1, 'special')}
                disabled={roundWinner !== null || p1Energy < 100}
                className={`py-1.5 px-2 rounded-xl border text-left transition-all active:scale-95 cursor-pointer shadow-md ${
                  p1Energy >= 100
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 border-amber-300 text-zinc-950 font-black shadow-amber-500/40 animate-pulse'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 opacity-60'
                }`}
              >
                <p className="text-[10px] sm:text-xs font-black truncate">
                  ⭐ {p1.moves.special.name}
                </p>
                <span className="text-[9px] font-mono font-bold">
                  {p1Energy >= 100 ? `💥 ${p1.moves.special.damage} Dano!` : 'Precisa 100%'}
                </span>
              </button>
            </div>
          </div>

          {/* LADO DIREITO: PAINEL DE COMANDOS DE CIRO (P2) */}
          <div className="bg-red-950/40 p-2 sm:p-2.5 rounded-2xl border border-red-600/50 shadow-xl">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-red-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>COMANDOS DE {p2.name} (P2)</span>
              </span>
              <span className="text-[9px] font-mono text-red-400 font-bold hidden sm:inline">
                ENERGIA: {p2Energy}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {/* Golpe 1 */}
              <button
                onClick={() => executeAttack(2, 'move1')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-xl bg-zinc-900/90 hover:bg-red-900/70 active:bg-red-600 border border-zinc-700 hover:border-red-500 text-left transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <p className="text-[10px] sm:text-xs font-black text-white truncate">
                  {p2.moves.move1.name}
                </p>
                <span className="text-[9px] font-mono text-amber-400 font-bold">
                  💥 {p2.moves.move1.damage} Dano
                </span>
              </button>

              {/* Golpe 2 */}
              <button
                onClick={() => executeAttack(2, 'move2')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-xl bg-zinc-900/90 hover:bg-red-900/70 active:bg-red-600 border border-zinc-700 hover:border-red-500 text-left transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <p className="text-[10px] sm:text-xs font-black text-white truncate">
                  {p2.moves.move2.name}
                </p>
                <span className="text-[9px] font-mono text-amber-400 font-bold">
                  💥 {p2.moves.move2.damage} Dano
                </span>
              </button>

              {/* Golpe 3 */}
              <button
                onClick={() => executeAttack(2, 'move3')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-xl bg-zinc-900/90 hover:bg-red-900/70 active:bg-red-600 border border-zinc-700 hover:border-red-500 text-left transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <p className="text-[10px] sm:text-xs font-black text-white truncate">
                  {p2.moves.move3.name}
                </p>
                <span className="text-[9px] font-mono text-amber-400 font-bold">
                  💥 {p2.moves.move3.damage} Dano
                </span>
              </button>

              {/* Especial */}
              <button
                onClick={() => executeAttack(2, 'special')}
                disabled={roundWinner !== null || p2Energy < 100}
                className={`py-1.5 px-2 rounded-xl border text-left transition-all active:scale-95 cursor-pointer shadow-md ${
                  p2Energy >= 100
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 border-amber-300 text-zinc-950 font-black shadow-amber-500/40 animate-pulse'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-500 opacity-60'
                }`}
              >
                <p className="text-[10px] sm:text-xs font-black truncate">
                  ⭐ {p2.moves.special.name}
                </p>
                <span className="text-[9px] font-mono font-bold">
                  {p2Energy >= 100 ? `💥 ${p2.moves.special.damage} Dano!` : 'Precisa 100%'}
                </span>
              </button>
            </div>
          </div>

        </div>

      </footer>

      {/* ========================================================================= */}
      {/* 4. MODAIS E OVERLAYS: CONFIGURAÇÕES E HISTÓRICO                            */}
      {/* ========================================================================= */}

      {/* MODAL DE VITÓRIA / KO */}
      <AnimatePresence>
        {roundWinner !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border-2 border-amber-500 rounded-3xl p-6 max-w-md w-full shadow-2xl shadow-amber-500/20"
            >
              <span className="text-5xl mb-2 block">🏆</span>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                BATALHA PRESIDENCIAL FINALIZADA
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mt-1 mb-2">
                {roundWinner === 1 ? p1.name : p2.name} VENCEU!
              </h2>
              <p className="text-xs text-zinc-300 font-bold mb-6 italic">
                "{roundWinner === 1 ? p1.dialogues.victory : p2.dialogues.victory}"
              </p>

              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={restartMatch}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Revanche</span>
                </button>

                <button
                  onClick={returnToSelection}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-zinc-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Outros Lutadores</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIGURAÇÕES (SEÇÃO 11) */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl p-5 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black uppercase text-white">
                    ⚙️ Configurações da Batalha
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                
                {/* Simulador de Live */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <p className="font-black text-white">Simulador de Live (TikTok/Kwai)</p>
                    <p className="text-[10px] text-zinc-400">Envia presentes de espectadores automaticamente</p>
                  </div>
                  <button
                    onClick={toggleAutoLive}
                    className={`px-3 py-1.5 rounded-lg font-black text-[11px] cursor-pointer active:scale-95 ${
                      autoLiveSimulator
                        ? 'bg-rose-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {autoLiveSimulator ? 'Ligada 🔴' : 'Desligada'}
                  </button>
                </div>

                {/* Sons e Efeitos */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <p className="font-black text-white">Áudio e Sons</p>
                    <p className="text-[10px] text-zinc-400">Efeitos de socos, especiais e presentes</p>
                  </div>
                  <button
                    onClick={toggleMute}
                    className={`px-3 py-1.5 rounded-lg font-black text-[11px] cursor-pointer active:scale-95 ${
                      !isMuted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {!isMuted ? 'Ligado 🔊' : 'Mutado 🔇'}
                  </button>
                </div>

                {/* Meta de Rosas da Pré-Luta */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div>
                    <p className="font-black text-white">Rosas Para Iniciar Luta</p>
                    <p className="text-[10px] text-zinc-400">Quantidade mínima de rosas na pré-luta</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setRosesToStart(Math.max(1, rosesToStart - 5))}
                      className="w-7 h-7 rounded-lg bg-zinc-800 text-white font-black text-xs hover:bg-zinc-700 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-sm text-yellow-300 w-8 text-center">
                      {rosesToStart}
                    </span>
                    <button
                      onClick={() => setRosesToStart(rosesToStart + 5)}
                      className="w-7 h-7 rounded-lg bg-zinc-800 text-white font-black text-xs hover:bg-zinc-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      restartMatch();
                    }}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reiniciar Luta</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      setShowLogsModal(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ver Logs</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      returnToSelection();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-900/60 hover:bg-blue-800 border border-blue-600 text-blue-200 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Selecionar Lutadores</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      setScreen('admin');
                    }}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-black text-xs cursor-pointer active:scale-95"
                  >
                    Painel Admin 🛠️
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE HISTÓRICO DE GOLPES */}
      <AnimatePresence>
        {showLogsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-3xl p-5 max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black uppercase text-white">Histórico de Combate</h3>
                </div>
                <button
                  onClick={() => setShowLogsModal(false)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
                {combatLogs.length === 0 ? (
                  <p className="text-zinc-500 text-center py-6">Nenhum golpe desferido ainda.</p>
                ) : (
                  combatLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2 rounded-xl border text-left ${
                        log.type === 'ko'
                          ? 'bg-amber-950/70 border-amber-500 text-amber-200 font-black'
                          : log.type === 'special'
                          ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                          : log.type === 'gift'
                          ? 'bg-pink-950/60 border-pink-500 text-pink-200'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {log.text}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
