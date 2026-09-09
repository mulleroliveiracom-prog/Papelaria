import React, { useState, useEffect, useRef } from 'react';
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
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Maximize2,
  Minimize2,
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
    executeAttack,
    sendGift,
    restartMatch,
    returnToSelection,
    toggleAutoLive,
    toggleMute,
  } = useFighterStore();

  const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
  const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

  const arenaScrollRef = useRef<HTMLDivElement>(null);
  const [cameraPosition, setCameraPosition] = useState<'both' | 'p1' | 'p2'>('both');
  const [giftTarget, setGiftTarget] = useState<1 | 2>(1);
  const [controlMode, setControlMode] = useState<'p1' | 'p2' | 'split'>('p1');
  const [showLogs, setShowLogs] = useState(false);
  const [fitBothMode, setFitBothMode] = useState(false);

  // Função para deslizar a arena suavemente para o lado (1P, Centro/Ambos ou 2P)
  const slideArenaTo = (target: 'p1' | 'both' | 'p2') => {
    setCameraPosition(target);
    if (!arenaScrollRef.current) return;
    const el = arenaScrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    if (target === 'p1') {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (target === 'p2') {
      el.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      el.scrollTo({ left: maxScroll / 2, behavior: 'smooth' });
    }
  };

  // Atualiza indicador da câmera quando o usuário arrasta/desliza a tela manualmente
  const handleArenaScroll = () => {
    if (!arenaScrollRef.current) return;
    const el = arenaScrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 15) return;
    const ratio = el.scrollLeft / maxScroll;
    if (ratio < 0.25) {
      if (cameraPosition !== 'p1') setCameraPosition('p1');
    } else if (ratio > 0.75) {
      if (cameraPosition !== 'p2') setCameraPosition('p2');
    } else {
      if (cameraPosition !== 'both') setCameraPosition('both');
    }
  };

  // Ajusta o modo de controle e opcionalmente desliza a visão para o lutador ativo
  const handleControlModeChange = (mode: 'p1' | 'p2' | 'split') => {
    setControlMode(mode);
    if (mode === 'p1') {
      slideArenaTo('p1');
    } else if (mode === 'p2') {
      slideArenaTo('p2');
    } else {
      slideArenaTo('both');
    }
  };

  // Centralizar a arena ao iniciar
  useEffect(() => {
    const timer = setTimeout(() => {
      slideArenaTo('both');
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  // Simulação de live com presentes da audiência (opcional, acionado no botão Play/Pause)
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

  // Lutador e energia controlados no modo de aba individual
  const activeFighter = controlMode === 'p2' ? p2 : p1;
  const activeSlot: 1 | 2 = controlMode === 'p2' ? 2 : 1;
  const activeEnergy = controlMode === 'p2' ? p2Energy : p1Energy;

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-zinc-950 text-white flex flex-col justify-between select-none overflow-hidden relative">
      
      {/* ARENA BACKGROUND COM ILUMINAÇÃO DE PLENÁRIO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[90px]" />
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-red-600/15 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-44 bg-gradient-to-t from-zinc-900 via-zinc-950/90 to-transparent" />
        <div className="absolute bottom-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      </div>

      {/* TOP HEADER & FIGHTING GAME HEALTH BARS (PROPORCIONAL AO ANDROID) */}
      <header className="relative z-20 w-full px-2 pt-2 pb-1 sm:px-4 sm:pt-3 max-w-4xl mx-auto shrink-0">
        
        {/* Barra de Ações Rápidas do Topo */}
        <div className="flex items-center justify-between gap-1 mb-1 text-xs">
          <button
            onClick={returnToSelection}
            className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            title="Voltar para seleção de lutadores"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Lutadores</span>
          </button>

          {/* Emblema do modo 2 Jogadores Manual */}
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-[10px] font-black text-amber-300">
            <Users className="w-3 h-3 text-amber-400" />
            <span>2 JOGADORES</span>
          </div>

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
        <div className="grid grid-cols-12 gap-1.5 items-center bg-zinc-900/90 backdrop-blur-md rounded-xl p-1.5 sm:p-2 border border-zinc-800 shadow-xl">
          
          {/* PLAYER 1 HUD */}
          <div className="col-span-5 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-4 h-4 rounded bg-blue-600 text-[10px] font-black flex items-center justify-center text-white shrink-0">
                  1P
                </span>
                <span className="text-xs font-black uppercase tracking-tight text-white truncate">
                  {p1.name}
                </span>
              </div>
              <span className="text-[10px] font-black font-mono text-emerald-400 shrink-0 ml-1">
                {p1Hp}
              </span>
            </div>

            {/* Barra de HP P1 */}
            <div className="w-full bg-zinc-950 h-3 sm:h-3.5 rounded-md p-0.5 border border-zinc-700/80 overflow-hidden relative shadow-inner">
              <div
                className={`h-full rounded-sm bg-gradient-to-r ${getHpColor(p1HpPercent)} transition-all duration-300 ease-out shadow-sm`}
                style={{ width: `${p1HpPercent}%` }}
              />
            </div>

            {/* Barra de Especial P1 */}
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[8px] font-black text-amber-400 tracking-wider">ESP</span>
              <div className="flex-1 bg-zinc-950 h-1 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-300"
                  style={{ width: `${p1Energy}%` }}
                />
              </div>
              <span className="text-[8px] font-mono font-bold text-zinc-400">{p1Energy}%</span>
            </div>
          </div>

          {/* VS CENTER */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center font-black text-[10px] text-zinc-950 border-2 border-zinc-950 shadow-md shadow-rose-600/30">
              VS
            </div>
            <span className="text-[7px] font-black uppercase tracking-wider text-amber-400">
              ROUND 1
            </span>
          </div>

          {/* PLAYER 2 HUD */}
          <div className="col-span-5 flex flex-col gap-0.5 text-right">
            <div className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-1.5 flex-row-reverse min-w-0">
                <span className="w-4 h-4 rounded bg-red-600 text-[10px] font-black flex items-center justify-center text-white shrink-0">
                  2P
                </span>
                <span className="text-xs font-black uppercase tracking-tight text-white truncate">
                  {p2.name}
                </span>
              </div>
              <span className="text-[10px] font-black font-mono text-emerald-400 shrink-0 mr-1">
                {p2Hp}
              </span>
            </div>

            {/* Barra de HP P2 */}
            <div className="w-full bg-zinc-950 h-3 sm:h-3.5 rounded-md p-0.5 border border-zinc-700/80 overflow-hidden relative shadow-inner flex justify-end">
              <div
                className={`h-full rounded-sm bg-gradient-to-l ${getHpColor(p2HpPercent)} transition-all duration-300 ease-out shadow-sm`}
                style={{ width: `${p2HpPercent}%` }}
              />
            </div>

            {/* Barra de Especial P2 */}
            <div className="flex items-center gap-1 mt-0.5 flex-row-reverse">
              <span className="text-[8px] font-black text-amber-400 tracking-wider">ESP</span>
              <div className="flex-1 bg-zinc-950 h-1 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-l from-amber-500 to-yellow-300 rounded-full transition-all duration-300"
                  style={{ width: `${p2Energy}%` }}
                />
              </div>
              <span className="text-[8px] font-mono font-bold text-zinc-400">{p2Energy}%</span>
            </div>
          </div>

        </div>

        {/* ALERTA DE PRESENTE DE LIVE FLUTUANTE */}
        <AnimatePresence>
          {currentGiftAlert && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-1.5 py-1 px-3 rounded-xl bg-gradient-to-r from-pink-600/95 via-purple-600/95 to-pink-600/95 text-white flex items-center justify-between gap-2 shadow-lg border border-pink-400/50 z-30"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base animate-bounce">{currentGiftAlert.giftIcon}</span>
                <div className="text-[10px] leading-tight">
                  <span className="font-bold text-pink-200">{currentGiftAlert.sender}</span> enviou{' '}
                  <strong className="text-yellow-300">{currentGiftAlert.giftName}</strong> para{' '}
                  <strong className="text-white uppercase">{currentGiftAlert.fighterName}</strong>!
                </div>
              </div>
              <span className="text-[10px] font-black bg-pink-950/80 px-2 py-0.5 rounded-full text-pink-200 border border-pink-700/60 shrink-0">
                +{currentGiftAlert.damage} DANO
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* BARRA DE CÂMERA & DESLIZAR O RINGUE (MOSTRAR OS 2 PERSONAGENS) */}
      <div className="relative z-20 px-2 py-0.5 max-w-4xl mx-auto w-full flex items-center justify-between gap-1.5 shrink-0">
        <div className="flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md px-1.5 py-1 rounded-xl border border-zinc-800 shadow-md w-full justify-between">
          
          {/* Botão Deslizar para 1P */}
          <button
            onClick={() => slideArenaTo('p1')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
              cameraPosition === 'p1'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                : 'text-zinc-400 hover:text-white bg-zinc-800/60'
            }`}
            title={`Deslizar a câmera para ver ${p1.name} (1P)`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="truncate max-w-[80px] xs:max-w-none">1P: {p1.name}</span>
          </button>

          {/* Botão Centralizar / Ver Ambos */}
          <button
            onClick={() => slideArenaTo('both')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
              cameraPosition === 'both'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/40'
                : 'text-zinc-300 hover:text-white bg-zinc-800/60'
            }`}
            title="Deslizar para o centro para ver os 2 personagens lado a lado"
          >
            <MoveHorizontal className="w-3.5 h-3.5" />
            <span>Ver Ambos</span>
          </button>

          {/* Botão Deslizar para 2P */}
          <button
            onClick={() => slideArenaTo('p2')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
              cameraPosition === 'p2'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                : 'text-zinc-400 hover:text-white bg-zinc-800/60'
            }`}
            title={`Deslizar a câmera para ver ${p2.name} (2P)`}
          >
            <span className="truncate max-w-[80px] xs:max-w-none">2P: {p2.name}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Toggle de Encaixar Tudo na Tela sem deslizar */}
          <button
            onClick={() => setFitBothMode(!fitBothMode)}
            className={`p-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer active:scale-95 shrink-0 ${
              fitBothMode
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-zinc-200'
            }`}
            title={fitBothMode ? 'Modo Zoom Panorâmico' : 'Encaixar Ambos na Tela'}
          >
            {fitBothMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ÁREA CENTRAL: RINGUE DE COMBATE COM DESLIZAR PARA O LADO E TOQUE PANORÂMICO */}
      <div className="flex-1 min-h-0 relative w-full overflow-hidden flex flex-col justify-end">
        
        {/* BOTÃO FLUTUANTE ESQUERDO: DESLIZAR PARA 1P */}
        <button
          onClick={() => slideArenaTo(cameraPosition === 'p2' ? 'both' : 'p1')}
          className="absolute left-1 bottom-10 z-30 w-7 h-11 bg-zinc-900/85 hover:bg-zinc-800 active:bg-blue-600 border border-zinc-700/90 rounded-r-xl flex items-center justify-center text-zinc-300 active:text-white shadow-xl backdrop-blur-md cursor-pointer transition-all active:scale-90"
          title="Deslizar para a esquerda"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* BOTÃO FLUTUANTE DIREITO: DESLIZAR PARA 2P */}
        <button
          onClick={() => slideArenaTo(cameraPosition === 'p1' ? 'both' : 'p2')}
          className="absolute right-1 bottom-10 z-30 w-7 h-11 bg-zinc-900/85 hover:bg-zinc-800 active:bg-red-600 border border-zinc-700/90 rounded-l-xl flex items-center justify-center text-zinc-300 active:text-white shadow-xl backdrop-blur-md cursor-pointer transition-all active:scale-90"
          title="Deslizar para a direita"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* PISTA DESLIZÁVEL DO COMBATE */}
        <main
          ref={arenaScrollRef}
          onScroll={handleArenaScroll}
          className="w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth touch-pan-x no-scrollbar pb-2 relative flex items-end select-none"
        >
          <div
            className={`h-full relative flex items-end justify-between px-6 sm:px-12 mx-auto transition-all duration-300 ${
              fitBothMode
                ? 'w-full min-w-full'
                : 'min-w-[480px] xs:min-w-[520px] sm:min-w-full'
            }`}
          >
            {/* NÚMEROS DE DANO FLUTUANTES (FLOATING COMBAT TEXT) */}
            {damageNumbers.map((dmg) => (
              <motion.div
                key={dmg.id}
                initial={{ opacity: 1, y: 0, scale: dmg.isCrit ? 1.4 : 1 }}
                animate={{ opacity: 0, y: -60, scale: dmg.isCrit ? 1.8 : 1.2 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ left: `${dmg.x}%`, top: `${dmg.y}%` }}
                className="absolute pointer-events-none z-30 font-black font-mono text-xl sm:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
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

            {/* LUTADOR 1 (JOGADOR 1) */}
            <div className="flex flex-col items-center relative shrink-0 snap-start pl-2">
              {/* Balão de Fala do Especial */}
              {p1State === 'special' && (
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="absolute -top-12 sm:-top-16 bg-white text-zinc-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-xl border-2 border-zinc-900 z-20 whitespace-nowrap max-w-[150px] truncate"
                >
                  🗣️ {p1.dialogues.specialQuote}
                </motion.div>
              )}

              {/* Sprite adaptado para proporção de celular sem cortes */}
              <div className={`transform origin-bottom ${fitBothMode ? 'scale-70 sm:scale-90' : 'scale-85 sm:scale-100'}`}>
                <FighterSprite
                  fighter={p1}
                  state={p1State}
                  facing="right"
                  size={fitBothMode ? 'sm' : 'md'}
                />
              </div>

              <span className="text-[10px] font-black tracking-wider text-blue-300 uppercase bg-blue-950/90 px-2.5 py-0.5 rounded-md border border-blue-700/60 shadow-md">
                1P: {p1.name}
              </span>
            </div>

            {/* CENTRO: Ícone decorativo e indicador de deslizar */}
            <div className="flex flex-col items-center shrink-0 snap-center px-2 pointer-events-none opacity-50">
              <span className="text-[7px] font-black uppercase tracking-widest text-amber-400 bg-zinc-900/80 px-2 py-0.5 rounded-full border border-zinc-800">
                DEBATE
              </span>
              <span className="text-[8px] text-zinc-400 font-mono mt-0.5">VS</span>
            </div>

            {/* LUTADOR 2 (JOGADOR 2 - CIRO / NUNCA CORTADO) */}
            <div className="flex flex-col items-center relative shrink-0 snap-end pr-3">
              {/* Balão de Fala do Especial */}
              {p2State === 'special' && (
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="absolute -top-12 sm:-top-16 bg-white text-zinc-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-xl border-2 border-zinc-900 z-20 whitespace-nowrap max-w-[150px] truncate"
                >
                  🗣️ {p2.dialogues.specialQuote}
                </motion.div>
              )}

              {/* Sprite adaptado para proporção de celular sem cortes */}
              <div className={`transform origin-bottom ${fitBothMode ? 'scale-70 sm:scale-90' : 'scale-85 sm:scale-100'}`}>
                <FighterSprite
                  fighter={p2}
                  state={p2State}
                  facing="left"
                  size={fitBothMode ? 'sm' : 'md'}
                />
              </div>

              <span className="text-[10px] font-black tracking-wider text-red-300 uppercase bg-red-950/90 px-2.5 py-0.5 rounded-md border border-red-700/60 shadow-md">
                2P: {p2.name}
              </span>
            </div>

          </div>
        </main>

        {/* Dica visual discreta de deslizar para o lado */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none pb-0.5 text-center">
          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950/70 px-2 py-0.5 rounded-full border border-zinc-800/60">
            ↔️ Deslize para o lado para navegar
          </span>
        </div>

      </div>

      {/* ÁREA INFERIOR: CONTROLES DE COMBATE ERGONÔMICOS PARA CELULAR ANDROID */}
      <footer className="relative z-20 w-full px-2 pb-2 pt-1 sm:px-4 sm:pb-3 max-w-4xl mx-auto shrink-0 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
        
        {/* BARRA HORIZONTAL COMPACTA DE PRESENTES DE LIVE (TIKTOK/KWAI) */}
        <div className="mb-1.5 bg-zinc-900/80 backdrop-blur-md rounded-xl p-1.5 border border-zinc-800 flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
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
                onClick={() => sendGift(giftTarget, g.id, '@apoiador')}
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
            className="text-[9px] font-black px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 shrink-0 border border-zinc-700 active:scale-95 cursor-pointer"
            title="Alternar quem recebe o presente"
          >
            Alvo: <strong className={giftTarget === 1 ? 'text-blue-400 font-black' : 'text-red-400 font-black'}>{giftTarget === 1 ? '1P' : '2P'}</strong>
          </button>
        </div>

        {/* SELETOR DE CONTROLE: 1P, 2P OU MODO DUPLO SIMULTÂNEO */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
          <button
            onClick={() => handleControlModeChange('p1')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              controlMode === 'p1'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="truncate">1P: {p1.name}</span>
          </button>

          <button
            onClick={() => handleControlModeChange('split')}
            className={`py-1 px-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              controlMode === 'split'
                ? 'bg-amber-500 text-zinc-950 font-black shadow-md shadow-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Dois jogadores lutando juntos na mesma tela"
          >
            <Users className="w-3 h-3" />
            <span>2P Juntos</span>
          </button>

          <button
            onClick={() => handleControlModeChange('p2')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              controlMode === 'p2'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="truncate">2P: {p2.name}</span>
          </button>
        </div>

        {/* CONTROLES DE COMBATE: MODO DUPLO (DIVIDIDO) OU MODO COMPLETO */}
        {controlMode === 'split' ? (
          /* MODO 2P SIMULTÂNEO: P1 NA ESQUERDA, P2 NA DIREITA */
          <div className="grid grid-cols-2 gap-2">
            
            {/* COLUNA P1 (AZUL) */}
            <div className="flex flex-col gap-1 bg-blue-950/30 p-1.5 rounded-xl border border-blue-900/50">
              <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider text-center">
                1P: {p1.name}
              </span>
              <button
                onClick={() => executeAttack(1, 'move1')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-lg bg-zinc-900/90 hover:bg-blue-900/60 border border-blue-700/60 text-left active:scale-95 transition-all text-xs font-bold text-white flex justify-between items-center cursor-pointer"
              >
                <span className="truncate">🥊 {p1.moves.move1.name}</span>
                <span className="text-[10px] text-blue-400 font-mono font-bold ml-1">{p1.moves.move1.damage}</span>
              </button>
              <button
                onClick={() => executeAttack(1, 'move2')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-lg bg-zinc-900/90 hover:bg-blue-900/60 border border-blue-700/60 text-left active:scale-95 transition-all text-xs font-bold text-white flex justify-between items-center cursor-pointer"
              >
                <span className="truncate">⚡ {p1.moves.move2.name}</span>
                <span className="text-[10px] text-blue-400 font-mono font-bold ml-1">{p1.moves.move2.damage}</span>
              </button>
              <button
                onClick={() => executeAttack(1, 'move3')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-lg bg-zinc-900/90 hover:bg-blue-900/60 border border-blue-700/60 text-left active:scale-95 transition-all text-xs font-bold text-white flex justify-between items-center cursor-pointer"
              >
                <span className="truncate">💥 {p1.moves.move3.name}</span>
                <span className="text-[10px] text-blue-400 font-mono font-bold ml-1">{p1.moves.move3.damage}</span>
              </button>
              <button
                onClick={() => executeAttack(1, 'special')}
                disabled={roundWinner !== null || p1Energy < 100}
                className={`py-1.5 px-2 rounded-lg border text-left active:scale-95 transition-all text-xs font-black flex justify-between items-center cursor-pointer ${
                  p1Energy >= 100
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 border-white shadow-md shadow-amber-500/40 animate-pulse'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span className="truncate">⭐ {p1.moves.special.name}</span>
                <span className="text-[9px] font-mono">{p1Energy >= 100 ? 'PRONTO' : `${p1Energy}%`}</span>
              </button>
            </div>

            {/* COLUNA P2 (VERMELHO) */}
            <div className="flex flex-col gap-1 bg-red-950/30 p-1.5 rounded-xl border border-red-900/50">
              <span className="text-[9px] font-black uppercase text-red-400 tracking-wider text-center">
                2P: {p2.name}
              </span>
              <button
                onClick={() => executeAttack(2, 'move1')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-lg bg-zinc-900/90 hover:bg-red-900/60 border border-red-700/60 text-left active:scale-95 transition-all text-xs font-bold text-white flex justify-between items-center cursor-pointer"
              >
                <span className="truncate">🥊 {p2.moves.move1.name}</span>
                <span className="text-[10px] text-red-400 font-mono font-bold ml-1">{p2.moves.move1.damage}</span>
              </button>
              <button
                onClick={() => executeAttack(2, 'move2')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-lg bg-zinc-900/90 hover:bg-red-900/60 border border-red-700/60 text-left active:scale-95 transition-all text-xs font-bold text-white flex justify-between items-center cursor-pointer"
              >
                <span className="truncate">⚡ {p2.moves.move2.name}</span>
                <span className="text-[10px] text-red-400 font-mono font-bold ml-1">{p2.moves.move2.damage}</span>
              </button>
              <button
                onClick={() => executeAttack(2, 'move3')}
                disabled={roundWinner !== null}
                className="py-1.5 px-2 rounded-lg bg-zinc-900/90 hover:bg-red-900/60 border border-red-700/60 text-left active:scale-95 transition-all text-xs font-bold text-white flex justify-between items-center cursor-pointer"
              >
                <span className="truncate">💥 {p2.moves.move3.name}</span>
                <span className="text-[10px] text-red-400 font-mono font-bold ml-1">{p2.moves.move3.damage}</span>
              </button>
              <button
                onClick={() => executeAttack(2, 'special')}
                disabled={roundWinner !== null || p2Energy < 100}
                className={`py-1.5 px-2 rounded-lg border text-left active:scale-95 transition-all text-xs font-black flex justify-between items-center cursor-pointer ${
                  p2Energy >= 100
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 border-white shadow-md shadow-amber-500/40 animate-pulse'
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span className="truncate">⭐ {p2.moves.special.name}</span>
                <span className="text-[9px] font-mono">{p2Energy >= 100 ? 'PRONTO' : `${p2Energy}%`}</span>
              </button>
            </div>

          </div>
        ) : (
          /* MODO INDIVIDUAL 4 BOTÕES GRANDES TÁTEIS */
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            
            {/* GOLPE 1 */}
            <button
              onClick={() => executeAttack(activeSlot, 'move1')}
              disabled={roundWinner !== null}
              className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/95 hover:bg-zinc-850 active:bg-zinc-800 border border-zinc-700/90 active:border-amber-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-md flex flex-col justify-between min-h-[50px]"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black text-white truncate max-w-[120px] sm:max-w-none">
                  🥊 {activeFighter.moves.move1.name}
                </span>
                <span className={`text-[10px] font-mono font-black ${activeSlot === 1 ? 'text-blue-400' : 'text-red-400'}`}>
                  {activeFighter.moves.move1.damage}
                </span>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                Ataque Rápido
              </span>
            </button>

            {/* GOLPE 2 */}
            <button
              onClick={() => executeAttack(activeSlot, 'move2')}
              disabled={roundWinner !== null}
              className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/95 hover:bg-zinc-850 active:bg-zinc-800 border border-zinc-700/90 active:border-amber-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-md flex flex-col justify-between min-h-[50px]"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black text-white truncate max-w-[120px] sm:max-w-none">
                  ⚡ {activeFighter.moves.move2.name}
                </span>
                <span className={`text-[10px] font-mono font-black ${activeSlot === 1 ? 'text-blue-400' : 'text-red-400'}`}>
                  {activeFighter.moves.move2.damage}
                </span>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                Golpe Médio
              </span>
            </button>

            {/* GOLPE 3 */}
            <button
              onClick={() => executeAttack(activeSlot, 'move3')}
              disabled={roundWinner !== null}
              className="p-2 sm:p-2.5 rounded-xl bg-zinc-900/95 hover:bg-zinc-850 active:bg-zinc-800 border border-zinc-700/90 active:border-amber-500 text-left transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-md flex flex-col justify-between min-h-[50px]"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black text-white truncate max-w-[120px] sm:max-w-none">
                  💥 {activeFighter.moves.move3.name}
                </span>
                <span className={`text-[10px] font-mono font-black ${activeSlot === 1 ? 'text-blue-400' : 'text-red-400'}`}>
                  {activeFighter.moves.move3.damage}
                </span>
              </div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                Investida Forte
              </span>
            </button>

            {/* ULTRA ESPECIAL */}
            <button
              onClick={() => executeAttack(activeSlot, 'special')}
              disabled={roundWinner !== null || activeEnergy < 100}
              className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer shadow-md flex flex-col justify-between min-h-[50px] ${
                activeEnergy >= 100
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-white text-zinc-950 font-black shadow-lg shadow-amber-500/50 animate-pulse'
                  : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-black truncate max-w-[120px] sm:max-w-none">
                  ⭐ {activeFighter.moves.special.name}
                </span>
                <span className="text-[10px] font-mono font-black">
                  {activeEnergy >= 100 ? '280+' : `${activeEnergy}%`}
                </span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider truncate">
                {activeEnergy >= 100 ? '🔥 DISPARAR ESPECIAL!' : 'ENERGIA 100%'}
              </span>
            </button>

          </div>
        )}

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
