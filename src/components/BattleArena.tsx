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
  Bot,
  Zap,
  Flame,
  Shield,
  User,
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
    p2AiEnabled,
    executeAttack,
    sendGift,
    restartMatch,
    returnToSelection,
    toggleAutoLive,
    toggleMute,
    toggleP2Ai,
  } = useFighterStore();

  const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
  const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

  const [giftTarget, setGiftTarget] = useState<1 | 2>(1);
  const [activeManualPlayer, setActiveManualPlayer] = useState<1 | 2>(1);
  const [showLogs, setShowLogs] = useState(false);
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  const [aiThinkingState, setAiThinkingState] = useState<'idle' | 'attacking' | 'special'>('idle');

  // MINI IA DO JOGADOR 2: LUTA SOZINHO CONTRA O JOGADOR 1
  useEffect(() => {
    if (!p2AiEnabled || roundWinner !== null) return;

    // Intervalo de ataque inteligente baseado na velocidade do lutador (entre 1.3s e 2.2s)
    const baseSpeed = p2.stats.speed || 50;
    const intervalMs = Math.max(1200, 2300 - baseSpeed * 10);

    const aiTimer = setInterval(() => {
      if (roundWinner !== null) return;

      // 1. Se a energia estiver cheia (>= 100), 80% de chance de disparar o Golpe Especial!
      if (p2Energy >= 100 && Math.random() < 0.8) {
        setAiThinkingState('special');
        executeAttack(2, 'special');
        setTimeout(() => setAiThinkingState('idle'), 600);
        return;
      }

      // 2. Se a vida do P2 estiver baixa (< 35%), IA fica agressiva e usa golpes mais fortes
      const isLowHp = p2Hp < p2MaxHp * 0.35;
      const roll = Math.random();

      setAiThinkingState('attacking');
      if (isLowHp) {
        if (roll < 0.45) {
          executeAttack(2, 'move3');
        } else if (roll < 0.8) {
          executeAttack(2, 'move2');
        } else {
          executeAttack(2, 'move1');
        }
      } else {
        if (roll < 0.45) {
          executeAttack(2, 'move1');
        } else if (roll < 0.8) {
          executeAttack(2, 'move2');
        } else {
          executeAttack(2, 'move3');
        }
      }
      setTimeout(() => setAiThinkingState('idle'), 500);

      // 3. Pequena chance (12%) da torcida do P2 mandar um presente espontâneo
      if (Math.random() < 0.12 && gifts.length > 0) {
        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
        sendGift(2, randomGift.id, '@torcida_adversaria');
      }
    }, intervalMs);

    return () => clearInterval(aiTimer);
  }, [p2AiEnabled, roundWinner, p2Energy, p2Hp, p2MaxHp, p2.stats.speed, executeAttack, gifts, sendGift]);

  // Reação de contra-ataque rápido da IA quando atacada
  useEffect(() => {
    if (!p2AiEnabled || roundWinner !== null) return;
    if (p1State === 'attack' || p1State === 'special') {
      // 35% de chance de contra-atacar em 650ms
      const counterTimeout = setTimeout(() => {
        if (roundWinner === null && Math.random() < 0.35) {
          executeAttack(2, Math.random() > 0.5 ? 'move1' : 'move2');
        }
      }, 650);
      return () => clearTimeout(counterTimeout);
    }
  }, [p1State, p2AiEnabled, roundWinner, executeAttack]);

  // Simulação de live com presentes da audiência
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

  // Porcentagens de HP
  const p1HpPercent = Math.max(0, Math.min(100, (p1Hp / p1MaxHp) * 100));
  const p2HpPercent = Math.max(0, Math.min(100, (p2Hp / p2MaxHp) * 100));

  const getHpColor = (percent: number) => {
    if (percent > 50) return 'from-emerald-500 to-teal-400';
    if (percent > 25) return 'from-amber-500 to-yellow-400';
    return 'from-rose-600 to-red-500 animate-pulse';
  };

  const controlledFighter = activeManualPlayer === 1 ? p1 : p2;
  const controlledSlot = activeManualPlayer;
  const controlledEnergy = activeManualPlayer === 1 ? p1Energy : p2Energy;

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-zinc-950 text-white flex flex-col justify-between select-none overflow-hidden relative">
      
      {/* ARENA BACKGROUND COM ILUMINAÇÃO DE PLENÁRIO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-t from-zinc-900 via-zinc-950/90 to-transparent" />
        <div className="absolute bottom-24 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>

      {/* TOP HEADER & FIGHTING GAME HEALTH BARS (HUD COMPACTO PARA CELULAR ANDROID) */}
      <header className="relative z-20 w-full px-2 pt-2 pb-1 sm:px-4 sm:pt-3 max-w-4xl mx-auto shrink-0">
        
        {/* Barra de Ações Rápidas do Topo */}
        <div className="flex items-center justify-between gap-1 mb-1.5 text-xs">
          <button
            onClick={returnToSelection}
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            title="Voltar para seleção de lutadores"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Lutadores</span>
          </button>

          {/* Toggle Mini IA do Jogador 2 */}
          <button
            onClick={toggleP2Ai}
            className={`px-2.5 py-1 rounded-lg border font-black text-[11px] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              p2AiEnabled
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : 'bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
            title="Ativar/Desativar IA no Jogador 2"
          >
            <Bot className={`w-3.5 h-3.5 ${p2AiEnabled ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
            <span>{p2AiEnabled ? 'IA P2: LIGADA' : 'IA P2: MANUAL'}</span>
          </button>

          <div className="flex items-center gap-1">
            {/* Toggle Live Automática */}
            <button
              onClick={toggleAutoLive}
              className={`p-1.5 rounded-lg border cursor-pointer active:scale-95 transition-all ${
                autoLiveSimulator
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-sm shadow-rose-900/40'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title={autoLiveSimulator ? 'Live Simulada Ligada' : 'Ligar Live Simulada'}
            >
              {autoLiveSimulator ? <Pause className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* Histórico */}
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-amber-400 cursor-pointer active:scale-95 transition-all"
              title="Histórico de Golpes"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>

            {/* Mute */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 cursor-pointer active:scale-95 transition-all"
              title={isMuted ? 'Ativar Som' : 'Mutar'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            {/* Reiniciar */}
            <button
              onClick={restartMatch}
              className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-blue-400 cursor-pointer active:scale-95 transition-all"
              title="Reiniciar Round"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BARRAS DE VIDA ESTILO ARCADE (FIGHTING HUD) */}
        <div className="grid grid-cols-12 gap-1.5 items-center bg-zinc-900/90 backdrop-blur-md rounded-xl p-2 border border-zinc-800 shadow-xl">
          
          {/* PLAYER 1 HUD */}
          <div className="col-span-5 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-4 h-4 rounded bg-blue-600 text-[10px] font-black flex items-center justify-center text-white shrink-0">
                  1P
                </span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-white truncate">
                  {p1.name}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-black font-mono text-emerald-400 shrink-0 ml-1">
                {p1Hp}
              </span>
            </div>

            {/* Barra de HP */}
            <div className="w-full bg-zinc-950 h-3.5 sm:h-4 rounded-md p-0.5 border border-zinc-700/80 overflow-hidden relative shadow-inner">
              <div
                className={`h-full rounded-sm bg-gradient-to-r ${getHpColor(p1HpPercent)} transition-all duration-300 ease-out shadow-sm`}
                style={{ width: `${p1HpPercent}%` }}
              />
            </div>

            {/* Barra de Especial */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] font-black text-amber-400 tracking-wider">ESP</span>
              <div className="flex-1 bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-300"
                  style={{ width: `${p1Energy}%` }}
                />
              </div>
              <span className="text-[9px] font-mono font-bold text-zinc-400">{p1Energy}%</span>
            </div>
          </div>

          {/* VS CENTER */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center font-black text-[11px] sm:text-xs text-zinc-950 border-2 border-zinc-950 shadow-md shadow-rose-600/30">
              VS
            </div>
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-400">
              R1
            </span>
          </div>

          {/* PLAYER 2 HUD */}
          <div className="col-span-5 flex flex-col gap-0.5 text-right">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-1.5 flex-row-reverse min-w-0">
                <span className="w-4 h-4 rounded bg-red-600 text-[10px] font-black flex items-center justify-center text-white shrink-0">
                  2P
                </span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-white truncate">
                  {p2.name}
                </span>
                {p2AiEnabled && (
                  <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 rounded font-black border border-emerald-700/60 shrink-0">
                    IA
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-black font-mono text-emerald-400 shrink-0 mr-1">
                {p2Hp}
              </span>
            </div>

            {/* Barra de HP P2 */}
            <div className="w-full bg-zinc-950 h-3.5 sm:h-4 rounded-md p-0.5 border border-zinc-700/80 overflow-hidden relative shadow-inner flex justify-end">
              <div
                className={`h-full rounded-sm bg-gradient-to-l ${getHpColor(p2HpPercent)} transition-all duration-300 ease-out shadow-sm`}
                style={{ width: `${p2HpPercent}%` }}
              />
            </div>

            {/* Barra de Especial P2 */}
            <div className="flex items-center gap-1 mt-0.5 justify-end">
              <span className="text-[9px] font-mono font-bold text-zinc-400">{p2Energy}%</span>
              <div className="flex-1 bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-l from-amber-500 to-yellow-300 rounded-full transition-all duration-300 ml-auto"
                  style={{ width: `${p2Energy}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-amber-400 tracking-wider">ESP</span>
            </div>
          </div>

        </div>

        {/* ALERTA DE PRESENTE EM TEMPO REAL */}
        <AnimatePresence>
          {currentGiftAlert && (
            <motion.div
              key={currentGiftAlert.id}
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="mt-1.5 w-full rounded-xl bg-gradient-to-r from-rose-950/90 via-pink-950/90 to-amber-950/90 border border-pink-400/80 p-2 flex items-center gap-2 shadow-lg backdrop-blur-md"
            >
              <div className="text-2xl shrink-0 animate-bounce">
                {currentGiftAlert.giftIcon}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black text-amber-300 truncate">
                    {currentGiftAlert.sender}
                  </span>
                  <span className="text-[9px] text-zinc-300">
                    enviou <strong className="text-white">{currentGiftAlert.giftName}</strong>!
                  </span>
                </div>
                <p className="text-[10px] font-bold text-white truncate">
                  👉 {currentGiftAlert.fighterName}: <span className="text-yellow-300 font-extrabold">{currentGiftAlert.attackName}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-black text-rose-300 font-mono">
                  -{currentGiftAlert.damage}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PALCO CENTRAL DA LUTA: SPRITES DIMENSIONADOS PARA CABER 100% NO CELULAR ANDROID */}
      <main className="relative z-10 flex-1 flex items-center justify-around px-2 py-0 overflow-hidden min-h-0">
        
        {/* Danos Flutuantes Dinâmicos */}
        {damageNumbers.map((dmg) => (
          <motion.div
            key={dmg.id}
            initial={{ opacity: 1, scale: 0.6, x: `${dmg.x}%`, y: `${dmg.y}%` }}
            animate={{ opacity: 0, scale: dmg.isCrit ? 1.6 : 1.2, y: `${dmg.y - 20}%` }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute pointer-events-none z-30 font-black font-mono text-2xl sm:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            style={{ color: dmg.color || '#fbbf24' }}
          >
            -{dmg.value}
            {dmg.isCrit && (
              <span className="block text-[10px] uppercase tracking-wider text-red-500 font-sans font-black">
                CRÍTICO!
              </span>
            )}
          </motion.div>
        ))}

        {/* LUTADOR 1 (JOGADOR 1) */}
        <div className="flex flex-col items-center relative shrink-0">
          {/* Balão de Fala do Especial */}
          {p1State === 'special' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute -top-12 sm:-top-16 bg-white text-zinc-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-xl border-2 border-zinc-900 z-20 whitespace-nowrap max-w-[160px] truncate"
            >
              🗣️ {p1.dialogues.specialQuote}
            </motion.div>
          )}

          {/* Sprite adaptado para celular sem cortar */}
          <div className="transform scale-90 sm:scale-100 origin-bottom">
            <FighterSprite
              fighter={p1}
              state={p1State}
              facing="right"
              size="md"
            />
          </div>

          <span className="text-[10px] font-black tracking-wider text-blue-300 uppercase bg-blue-950/90 px-2 py-0.5 rounded-md border border-blue-700/60 shadow-md">
            {p1.name}
          </span>
        </div>

        {/* CENTRO: Ícone decorativo sutil */}
        <div className="flex flex-col items-center opacity-30 pointer-events-none shrink-0">
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
            DEBATE
          </span>
        </div>

        {/* LUTADOR 2 (P2 COM MINI IA OU MANUAL) */}
        <div className="flex flex-col items-center relative shrink-0">
          {/* Balão de Fala do Especial */}
          {p2State === 'special' && (
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="absolute -top-12 sm:-top-16 bg-white text-zinc-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-xl border-2 border-zinc-900 z-20 whitespace-nowrap max-w-[160px] truncate"
            >
              🗣️ {p2.dialogues.specialQuote}
            </motion.div>
          )}

          {/* Indicador de IA em tempo real */}
          {p2AiEnabled && (
            <div className="absolute -top-6 flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/60 px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-300 shadow-sm z-10 animate-pulse">
              <Bot className="w-3 h-3 text-emerald-400" />
              <span>{aiThinkingState === 'special' ? '⚡ ESPECIAL!' : aiThinkingState === 'attacking' ? '💥 GOLPEANDO!' : 'IA LUTANDO'}</span>
            </div>
          )}

          {/* Sprite adaptado para celular sem cortar */}
          <div className="transform scale-90 sm:scale-100 origin-bottom">
            <FighterSprite
              fighter={p2}
              state={p2State}
              facing="left"
              size="md"
            />
          </div>

          <span className="text-[10px] font-black tracking-wider text-red-300 uppercase bg-red-950/90 px-2 py-0.5 rounded-md border border-red-700/60 shadow-md">
            {p2.name}
          </span>
        </div>

      </main>

      {/* ÁREA INFERIOR: CONTROLES DE COMBATE ERGONÔMICOS PARA CELULAR ANDROID */}
      <footer className="relative z-20 w-full px-2 pb-2 pt-1 sm:px-4 sm:pb-3 max-w-4xl mx-auto shrink-0 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        
        {/* BARRA HORIZONTAL COMPACTA DE PRESENTES DE LIVE (TIKTOK/KWAI) */}
        <div className="mb-2 bg-zinc-900/80 backdrop-blur-md rounded-xl p-1.5 border border-zinc-800 flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-[10px] font-black uppercase text-pink-300 tracking-wider hidden xs:inline">
              Presentes:
            </span>
          </div>

          {/* Botões Rápidos de Presentes de Live */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            {gifts.map((g) => (
              <button
                key={g.id}
                onClick={() => sendGift(1, g.id, '@meu_apoio')}
                disabled={roundWinner !== null}
                className="px-2 py-1 rounded-lg bg-zinc-800/90 hover:bg-pink-900/60 border border-zinc-700 hover:border-pink-500 text-left transition-all active:scale-90 flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                title={`${g.name}: ${g.description}`}
              >
                <span className="text-sm">{g.icon}</span>
                <span className="text-[10px] font-bold text-zinc-200 hidden sm:inline">{g.name}</span>
                <span className="text-[9px] font-mono text-pink-400 font-bold">+{g.defaultDamage}</span>
              </button>
            ))}
          </div>

          {/* Botão seletor de quem recebe o presente */}
          <button
            onClick={() => setGiftTarget(giftTarget === 1 ? 2 : 1)}
            className="text-[9px] font-black px-1.5 py-1 rounded bg-zinc-800 text-zinc-300 shrink-0 border border-zinc-700"
            title="Mudar alvo do presente"
          >
            Alvo: <strong className={giftTarget === 1 ? 'text-blue-400' : 'text-red-400'}>{giftTarget === 1 ? 'P1' : 'P2'}</strong>
          </button>
        </div>

        {/* SELETOR DE JOGADOR MANUAL SE A IA ESTIVER DESLIGADA */}
        {!p2AiEnabled && (
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-zinc-400">Controlar:</span>
            <button
              onClick={() => setActiveManualPlayer(1)}
              className={`px-3 py-0.5 rounded-full text-[11px] font-black transition-all ${
                activeManualPlayer === 1 ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              1P ({p1.name})
            </button>
            <button
              onClick={() => setActiveManualPlayer(2)}
              className={`px-3 py-0.5 rounded-full text-[11px] font-black transition-all ${
                activeManualPlayer === 2 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              2P ({p2.name})
            </button>
          </div>
        )}

        {/* 4 BOTÕES PRINCIPAIS DE COMBATE: ERGONÔMICOS, GRANDES E TÁTEIS PARA POLEGARES */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          
          {/* GOLPE 1 */}
          <button
            onClick={() => executeAttack(controlledSlot, 'move1')}
            disabled={roundWinner !== null}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/95 hover:bg-blue-950/80 active:bg-blue-900 border border-zinc-700/90 active:border-blue-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-md flex flex-col justify-between min-h-[52px]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-white truncate max-w-[120px] sm:max-w-none">
                🥊 {controlledFighter.moves.move1.name}
              </span>
              <span className="text-[10px] text-blue-400 font-mono font-black">
                {controlledFighter.moves.move1.damage}
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
              Ataque Rápido
            </span>
          </button>

          {/* GOLPE 2 */}
          <button
            onClick={() => executeAttack(controlledSlot, 'move2')}
            disabled={roundWinner !== null}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/95 hover:bg-blue-950/80 active:bg-blue-900 border border-zinc-700/90 active:border-blue-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-md flex flex-col justify-between min-h-[52px]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-white truncate max-w-[120px] sm:max-w-none">
                ⚡ {controlledFighter.moves.move2.name}
              </span>
              <span className="text-[10px] text-blue-400 font-mono font-black">
                {controlledFighter.moves.move2.damage}
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
              Golpe Médio
            </span>
          </button>

          {/* GOLPE 3 */}
          <button
            onClick={() => executeAttack(controlledSlot, 'move3')}
            disabled={roundWinner !== null}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/95 hover:bg-blue-950/80 active:bg-blue-900 border border-zinc-700/90 active:border-blue-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-md flex flex-col justify-between min-h-[52px]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-white truncate max-w-[120px] sm:max-w-none">
                💥 {controlledFighter.moves.move3.name}
              </span>
              <span className="text-[10px] text-blue-400 font-mono font-black">
                {controlledFighter.moves.move3.damage}
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
              Investida Forte
            </span>
          </button>

          {/* ULTRA ESPECIAL */}
          <button
            onClick={() => executeAttack(controlledSlot, 'special')}
            disabled={roundWinner !== null || controlledEnergy < 100}
            className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer shadow-md flex flex-col justify-between min-h-[52px] ${
              controlledEnergy >= 100
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-white text-zinc-950 font-black shadow-lg shadow-amber-500/50 animate-pulse'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black truncate max-w-[120px] sm:max-w-none">
                ⭐ {controlledFighter.moves.special.name}
              </span>
              <span className="text-[10px] font-mono font-black">
                {controlledEnergy >= 100 ? '280+' : `${controlledEnergy}%`}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider truncate">
              {controlledEnergy >= 100 ? '🔥 DISPARAR ESPECIAL!' : 'ENERGIA 100%'}
            </span>
          </button>

        </div>

      </footer>

      {/* HISTÓRICO DE GOLPES (MODAL RETRÁTIL) */}
      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-2 bottom-16 sm:inset-auto sm:bottom-20 sm:right-4 z-40 sm:w-96 max-h-80 bg-zinc-900/95 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-2xl p-3 flex flex-col"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
              <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Histórico do Combate
              </h4>
              <button
                onClick={() => setShowLogs(false)}
                className="text-xs text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800"
              >
                ✕ Fechar
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1 py-1.5 text-xs font-mono">
              {combatLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-1.5 rounded-lg text-[10px] ${
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

      {/* OVERLAY DE KNOCKOUT / VENCEDOR DO ROUND */}
      <AnimatePresence>
        {roundWinner !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="max-w-sm w-full bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl border-2 border-amber-500/60 p-5 text-center shadow-2xl shadow-amber-500/30"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center mb-3 shadow-xl shadow-amber-500/40">
                <Trophy className="w-8 h-8 text-zinc-950" />
              </div>

              <span className="px-3 py-0.5 rounded-full bg-rose-600 text-white font-black text-xs uppercase tracking-widest inline-block mb-1.5 animate-bounce">
                K.O.!
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {roundWinner === 1 ? p1.name : p2.name} VENCEU!
              </h3>

              <p className="text-xs font-bold text-amber-300 italic mt-1.5">
                "{roundWinner === 1 ? p1.dialogues.victory : p2.dialogues.victory}"
              </p>

              <div className="my-3 py-2 bg-zinc-950/70 rounded-xl border border-zinc-800 text-[11px] text-zinc-400">
                Golpes Acertados na Batalha: <strong className="text-white">{comboCount}</strong>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={restartMatch}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  Jogar Novamente
                </button>

                <button
                  onClick={returnToSelection}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-wider border border-zinc-700 transition-all active:scale-95 cursor-pointer"
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
