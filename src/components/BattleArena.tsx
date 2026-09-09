import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFighterStore } from '../store/useFighterStore';
import { FighterSprite } from './FighterSprite';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Users,
  Swords,
  Heart,
  Zap,
  Sparkles,
  Play,
  Pause,
  MessageSquare,
  Trophy,
  ArrowLeft,
  Flame,
  Shield,
} from 'lucide-react';
import { HitEffectType } from '../types/fighter';

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
    executeAttack,
    sendGift,
    restartMatch,
    returnToSelection,
    toggleAutoLive,
    toggleMute,
  } = useFighterStore();

  const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
  const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

  const [giftTarget, setGiftTarget] = useState<1 | 2>(1);
  const [donorName, setDonorName] = useState<string>('@espectador_vip');
  const [showLogs, setShowLogs] = useState(false);

  // Auto live audience simulation effect
  useEffect(() => {
    if (!autoLiveSimulator || roundWinner !== null) return;

    const interval = setInterval(() => {
      const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
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
      ];
      const randomUser = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];

      sendGift(randomTarget, randomGift.id, randomUser);
    }, 3200);

    return () => clearInterval(interval);
  }, [autoLiveSimulator, roundWinner, gifts, sendGift]);

  // HP Percentages
  const p1HpPercent = Math.max(0, Math.min(100, (p1Hp / p1MaxHp) * 100));
  const p2HpPercent = Math.max(0, Math.min(100, (p2Hp / p2MaxHp) * 100));

  // Health bar color helper
  const getHpColor = (percent: number) => {
    if (percent > 50) return 'from-emerald-500 to-teal-400';
    if (percent > 25) return 'from-amber-500 to-yellow-400';
    return 'from-rose-600 to-red-500 animate-pulse';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between select-none overflow-x-hidden relative">
      
      {/* ARENA BACKGROUND: Palácio / Plenário de Debates */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Presidential arena spotlight gradients */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-80 bg-gradient-to-t from-zinc-900 via-zinc-950/80 to-transparent" />
        
        {/* Subtle Debate Hall Stage Architecture lines */}
        <div className="absolute bottom-28 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-zinc-900/60 border-t border-zinc-800/80 backdrop-blur-xs flex items-center justify-around px-8 opacity-40">
          <div className="w-28 h-20 border-t-2 border-x-2 border-zinc-700 rounded-t-xl bg-zinc-950/80" />
          <div className="w-36 h-24 border-t-2 border-x-2 border-amber-600/50 rounded-t-xl bg-zinc-950/80" />
          <div className="w-28 h-20 border-t-2 border-x-2 border-zinc-700 rounded-t-xl bg-zinc-950/80" />
        </div>
      </div>

      {/* TOP HEADER & FIGHTING GAME HEALTH BARS (HUD) */}
      <header className="relative z-20 max-w-7xl w-full mx-auto p-3 sm:p-4">
        
        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            onClick={returnToSelection}
            className="px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Selecionar Lutadores</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Auto Live audience toggle */}
            <button
              onClick={toggleAutoLive}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                autoLiveSimulator
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-md shadow-rose-900/30'
                  : 'bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              {autoLiveSimulator ? <Pause className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{autoLiveSimulator ? 'Live Simulada: LIGADA' : 'Simular Live'}</span>
            </button>

            <button
              onClick={() => setShowLogs(!showLogs)}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Histórico de Golpes"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
              title={isMuted ? 'Ativar Sons' : 'Mutar Sons'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={restartMatch}
              className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="Reiniciar Round"
            >
              <RotateCcw className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>

        {/* DUAL HEALTH HUD */}
        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center bg-zinc-900/85 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-zinc-800 shadow-2xl">
          
          {/* PLAYER 1 HUD (Left) */}
          <div className="col-span-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-[11px] font-black flex items-center justify-center text-white">
                  1P
                </span>
                <span className="text-base sm:text-2xl font-black uppercase tracking-tight text-white truncate">
                  {p1.name}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">
                {p1Hp} / {p1MaxHp}
              </span>
            </div>

            {/* HP Bar */}
            <div className="w-full bg-zinc-950 h-5 sm:h-6 rounded-lg p-0.5 border border-zinc-700/80 overflow-hidden relative shadow-inner">
              <div
                className={`h-full rounded-md bg-gradient-to-r ${getHpColor(p1HpPercent)} transition-all duration-300 ease-out shadow-sm`}
                style={{ width: `${p1HpPercent}%` }}
              />
            </div>

            {/* Energy Bar (for special) */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-black text-amber-400 tracking-wider">SPECIAL</span>
              <div className="flex-1 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-300"
                  style={{ width: `${p1Energy}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-400">{p1Energy}%</span>
            </div>
          </div>

          {/* CENTER VS TIMER */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center font-black text-sm sm:text-lg text-zinc-950 border-2 border-zinc-950 shadow-lg shadow-rose-600/30">
              VS
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mt-1">
              ROUND 1
            </span>
          </div>

          {/* PLAYER 2 HUD (Right) */}
          <div className="col-span-5 flex flex-col gap-1 text-right">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-2 flex-row-reverse">
                <span className="w-6 h-6 rounded-lg bg-red-600 text-[11px] font-black flex items-center justify-center text-white">
                  2P
                </span>
                <span className="text-base sm:text-2xl font-black uppercase tracking-tight text-white truncate">
                  {p2.name}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">
                {p2Hp} / {p2MaxHp}
              </span>
            </div>

            {/* HP Bar */}
            <div className="w-full bg-zinc-950 h-5 sm:h-6 rounded-lg p-0.5 border border-zinc-700/80 overflow-hidden relative shadow-inner flex justify-end">
              <div
                className={`h-full rounded-md bg-gradient-to-l ${getHpColor(p2HpPercent)} transition-all duration-300 ease-out shadow-sm`}
                style={{ width: `${p2HpPercent}%` }}
              />
            </div>

            {/* Energy Bar */}
            <div className="flex items-center gap-1.5 mt-0.5 justify-end">
              <span className="text-[10px] font-mono font-bold text-zinc-400">{p2Energy}%</span>
              <div className="flex-1 bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-l from-amber-500 to-yellow-300 rounded-full transition-all duration-300 ml-auto"
                  style={{ width: `${p2Energy}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-amber-400 tracking-wider">SPECIAL</span>
            </div>
          </div>

        </div>

        {/* GIFT POPUP NOTIFICATION (TikTok/Live style) */}
        <AnimatePresence>
          {currentGiftAlert && (
            <motion.div
              key={currentGiftAlert.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="mt-2 max-w-xl mx-auto rounded-2xl bg-gradient-to-r from-rose-900/90 via-pink-900/90 to-amber-900/90 border-2 border-pink-400/80 p-3 flex items-center gap-3 shadow-2xl shadow-pink-500/30 backdrop-blur-md"
            >
              <div className="text-3xl animate-bounce shrink-0">
                {currentGiftAlert.giftIcon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-300 truncate">
                    {currentGiftAlert.sender}
                  </span>
                  <span className="text-[11px] text-zinc-200">
                    enviou <strong className="text-white">{currentGiftAlert.giftName}</strong>!
                  </span>
                </div>
                <p className="text-xs font-black text-white mt-0.5">
                  👉 {currentGiftAlert.fighterName} atacou com <span className="text-yellow-300">[{currentGiftAlert.attackName}]</span>!
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-black text-rose-300 font-mono">
                  -{currentGiftAlert.damage}
                </span>
                <span className="block text-[9px] uppercase font-bold text-zinc-300">
                  {currentGiftAlert.hits}x golpe
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* COMBAT STAGE: FIGHTERS IN ARENA */}
      <main className="relative z-10 flex-1 flex items-center justify-around px-4 sm:px-12 py-4 min-h-[320px] sm:min-h-[380px]">
        
        {/* Dynamic Damage Floating Numbers */}
        {damageNumbers.map((dmg) => (
          <motion.div
            key={dmg.id}
            initial={{ opacity: 1, scale: 0.5, x: `${dmg.x}%`, y: `${dmg.y}%` }}
            animate={{ opacity: 0, scale: dmg.isCrit ? 1.8 : 1.3, y: `${dmg.y - 18}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute pointer-events-none z-30 font-black font-mono text-2xl sm:text-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
            style={{ color: dmg.color || '#fbbf24' }}
          >
            -{dmg.value}
            {dmg.isCrit && (
              <span className="block text-xs uppercase tracking-wider text-red-500 font-sans">
                CRÍTICO!
              </span>
            )}
          </motion.div>
        ))}

        {/* PLAYER 1 SPRITE */}
        <div className="flex flex-col items-center relative">
          {/* Active Speech / Quote bubble on Special */}
          {p1State === 'special' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute -top-16 bg-white text-zinc-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl shadow-xl border-2 border-zinc-900 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white z-20 whitespace-nowrap"
            >
              🗣️ {p1.dialogues.specialQuote}
            </motion.div>
          )}

          <FighterSprite
            fighter={p1}
            state={p1State}
            facing="right"
            size="lg"
          />

          <span className="mt-2 text-xs font-black tracking-widest text-blue-400 uppercase bg-blue-950/80 px-3 py-0.5 rounded-full border border-blue-700/60 shadow-md">
            {p1.name}
          </span>
        </div>

        {/* CENTER ARENA BADGE */}
        <div className="hidden md:flex flex-col items-center opacity-40 pointer-events-none">
          <div className="w-24 h-24 rounded-full border-4 border-dashed border-zinc-700 flex items-center justify-center">
            <Swords className="w-10 h-10 text-zinc-600" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600 mt-2">
            PALÁCIO DO DEBATE
          </span>
        </div>

        {/* PLAYER 2 SPRITE */}
        <div className="flex flex-col items-center relative">
          {/* Active Speech / Quote bubble on Special */}
          {p2State === 'special' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute -top-16 bg-white text-zinc-950 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl shadow-xl border-2 border-zinc-900 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white z-20 whitespace-nowrap"
            >
              🗣️ {p2.dialogues.specialQuote}
            </motion.div>
          )}

          <FighterSprite
            fighter={p2}
            state={p2State}
            facing="left"
            size="lg"
          />

          <span className="mt-2 text-xs font-black tracking-widest text-red-400 uppercase bg-red-950/80 px-3 py-0.5 rounded-full border border-red-700/60 shadow-md">
            {p2.name}
          </span>
        </div>

      </main>

      {/* COMBAT ACTIONS & INTERACTIVE LIVE GIFTS BAR */}
      <footer className="relative z-20 max-w-7xl w-full mx-auto p-3 sm:p-4 space-y-3">
        
        {/* ACTION BUTTONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          {/* P1 ATTACK CONTROLS */}
          <div className="lg:col-span-4 bg-blue-950/40 rounded-2xl p-3 border border-blue-800/60 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-blue-400 tracking-wider">
                Comandos de {p1.name} (P1)
              </span>
              <span className="text-[10px] text-zinc-400">Clique para golpear</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => executeAttack(1, 'move1')}
                disabled={roundWinner !== null}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-blue-900/80 border border-zinc-700 hover:border-blue-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span className="block text-xs font-extrabold text-white truncate">{p1.moves.move1.name}</span>
                <span className="text-[10px] text-blue-400 font-mono font-bold">💥 {p1.moves.move1.damage} Dano</span>
              </button>

              <button
                onClick={() => executeAttack(1, 'move2')}
                disabled={roundWinner !== null}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-blue-900/80 border border-zinc-700 hover:border-blue-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span className="block text-xs font-extrabold text-white truncate">{p1.moves.move2.name}</span>
                <span className="text-[10px] text-blue-400 font-mono font-bold">💥 {p1.moves.move2.damage} Dano</span>
              </button>

              <button
                onClick={() => executeAttack(1, 'move3')}
                disabled={roundWinner !== null}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-blue-900/80 border border-zinc-700 hover:border-blue-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span className="block text-xs font-extrabold text-white truncate">{p1.moves.move3.name}</span>
                <span className="text-[10px] text-blue-400 font-mono font-bold">💥 {p1.moves.move3.damage} Dano</span>
              </button>

              {/* Ultra Special Button */}
              <button
                onClick={() => executeAttack(1, 'special')}
                disabled={roundWinner !== null || p1Energy < 100}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                  p1Energy >= 100
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 border-white text-zinc-950 font-black shadow-lg shadow-amber-500/40 animate-pulse'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black truncate">⭐ {p1.moves.special.name}</span>
                  <span className="text-[10px] font-mono font-bold">260+</span>
                </div>
                <span className="text-[9px] block uppercase tracking-wider">
                  {p1Energy >= 100 ? 'PRONTO! DISPARAR!' : 'ENERGIA 100%'}
                </span>
              </button>
            </div>
          </div>

          {/* 21. SISTEMA DE PRESENTES DE LIVE (CENTER INTERACTION) */}
          <div className="lg:col-span-4 bg-zinc-900/90 backdrop-blur-md rounded-2xl p-3 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-pink-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Presentes de Live (TikTok/Kwai)
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <span>Alvo:</span>
                <button
                  onClick={() => setGiftTarget(1)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black cursor-pointer ${
                    giftTarget === 1 ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {p1.name} (P1)
                </button>
                <button
                  onClick={() => setGiftTarget(2)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black cursor-pointer ${
                    giftTarget === 2 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {p2.name} (P2)
                </button>
              </div>
            </div>

            {/* Quick Gifts Selector */}
            <div className="grid grid-cols-4 gap-1.5">
              {gifts.map((gift) => {
                const targetFighter = giftTarget === 1 ? p1 : p2;
                const customMove = targetFighter.giftMoves[gift.id];
                const displayDmg = customMove ? customMove.damage : gift.defaultDamage;

                return (
                  <button
                    key={gift.id}
                    onClick={() => sendGift(giftTarget, gift.id, donorName)}
                    disabled={roundWinner !== null}
                    className="p-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/80 hover:border-pink-500/80 text-center transition-all active:scale-90 group cursor-pointer"
                    title={`${gift.name}: ${customMove?.attackName || gift.name} (-${displayDmg} dano)`}
                  >
                    <span className="text-xl sm:text-2xl block group-hover:scale-125 transition-transform">
                      {gift.icon}
                    </span>
                    <span className="block text-[10px] font-black text-zinc-300 truncate">
                      {gift.name}
                    </span>
                    <span className="block text-[9px] font-mono font-bold text-pink-400">
                      -{displayDmg}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Donor handle quick input */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-[10px] text-zinc-400">Remetente:</span>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-0.5 text-xs text-amber-300 font-mono focus:outline-hidden focus:border-pink-500"
                placeholder="@seu_usuario"
              />
            </div>
          </div>

          {/* P2 ATTACK CONTROLS */}
          <div className="lg:col-span-4 bg-red-950/40 rounded-2xl p-3 border border-red-800/60 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-red-400 tracking-wider">
                Comandos de {p2.name} (P2)
              </span>
              <span className="text-[10px] text-zinc-400">Clique para golpear</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => executeAttack(2, 'move1')}
                disabled={roundWinner !== null}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-red-900/80 border border-zinc-700 hover:border-red-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span className="block text-xs font-extrabold text-white truncate">{p2.moves.move1.name}</span>
                <span className="text-[10px] text-red-400 font-mono font-bold">💥 {p2.moves.move1.damage} Dano</span>
              </button>

              <button
                onClick={() => executeAttack(2, 'move2')}
                disabled={roundWinner !== null}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-red-900/80 border border-zinc-700 hover:border-red-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span className="block text-xs font-extrabold text-white truncate">{p2.moves.move2.name}</span>
                <span className="text-[10px] text-red-400 font-mono font-bold">💥 {p2.moves.move2.damage} Dano</span>
              </button>

              <button
                onClick={() => executeAttack(2, 'move3')}
                disabled={roundWinner !== null}
                className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-red-900/80 border border-zinc-700 hover:border-red-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                <span className="block text-xs font-extrabold text-white truncate">{p2.moves.move3.name}</span>
                <span className="text-[10px] text-red-400 font-mono font-bold">💥 {p2.moves.move3.damage} Dano</span>
              </button>

              {/* Ultra Special Button */}
              <button
                onClick={() => executeAttack(2, 'special')}
                disabled={roundWinner !== null || p2Energy < 100}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                  p2Energy >= 100
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 border-white text-zinc-950 font-black shadow-lg shadow-amber-500/40 animate-pulse'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black truncate">⭐ {p2.moves.special.name}</span>
                  <span className="text-[10px] font-mono font-bold">280+</span>
                </div>
                <span className="text-[9px] block uppercase tracking-wider">
                  {p2Energy >= 100 ? 'PRONTO! DISPARAR!' : 'ENERGIA 100%'}
                </span>
              </button>
            </div>
          </div>

        </div>

      </footer>

      {/* COMBAT LOG DRAWER / MODAL */}
      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-4 z-40 w-80 sm:w-96 max-h-96 bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-2xl p-4 flex flex-col"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Histórico de Golpes & Presentes
              </h4>
              <button
                onClick={() => setShowLogs(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 py-2 text-xs font-mono">
              {combatLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-1.5 rounded-lg text-[11px] ${
                    log.type === 'special'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : log.type === 'gift'
                      ? 'bg-pink-950/60 text-pink-200 border border-pink-800/50'
                      : log.type === 'ko'
                      ? 'bg-rose-900 text-white font-black'
                      : 'text-zinc-300 bg-zinc-950/50'
                  }`}
                >
                  {log.text}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KNOCKOUT / ROUND WINNER OVERLAY */}
      <AnimatePresence>
        {roundWinner !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.7, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="max-w-md w-full bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl border-2 border-amber-500/60 p-6 text-center shadow-2xl shadow-amber-500/20"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mb-4 shadow-xl shadow-amber-500/40">
                <Trophy className="w-10 h-10 text-zinc-950" />
              </div>

              <span className="px-4 py-1 rounded-full bg-rose-600 text-white font-black text-sm uppercase tracking-widest inline-block mb-2 animate-bounce">
                K.O.!
              </span>

              <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                {roundWinner === 1 ? p1.name : p2.name} VENCEU!
              </h3>

              <p className="text-sm font-bold text-amber-300 italic mt-2">
                "{roundWinner === 1 ? p1.dialogues.victory : p2.dialogues.victory}"
              </p>

              <div className="my-4 py-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs text-zinc-400">
                Total de Golpes Desferidos na Arena: <strong className="text-white">{comboCount}</strong>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={restartMatch}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  Jogar Novamente
                </button>

                <button
                  onClick={returnToSelection}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider border border-zinc-700 transition-all active:scale-95 cursor-pointer"
                >
                  Mudar Lutadores
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
