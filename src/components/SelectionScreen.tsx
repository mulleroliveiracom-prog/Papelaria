import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFighterStore } from '../store/useFighterStore';
import { FighterSprite } from './FighterSprite';
import {
  Swords,
  Shield,
  Zap,
  Flame,
  Heart,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  AlertCircle,
  PlusCircle,
  Bot,
  User,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export const SelectionScreen: React.FC = () => {
  const {
    fighters,
    player1Id,
    player2Id,
    isMuted,
    p2AiEnabled,
    selectPlayer1,
    selectPlayer2,
    startMatch,
    setScreen,
    toggleMute,
    toggleP2Ai,
  } = useFighterStore();

  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
  const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

  const handleSelectFighter = (fighterId: string) => {
    soundManager.playPunch('light');
    if (activeSlot === 1) {
      selectPlayer1(fighterId);
      // Se selecionou o mesmo lutador pro P2, alterna P2 pro próximo
      if (player2Id === fighterId) {
        const nextOpponent = fighters.find((f) => f.id !== fighterId);
        if (nextOpponent) selectPlayer2(nextOpponent.id);
      }
    } else {
      selectPlayer2(fighterId);
    }
  };

  const handleStartBattle = () => {
    soundManager.playSpecial();
    startMatch();
  };

  return (
    <div className="h-full overflow-y-auto bg-radial from-slate-900 via-zinc-950 to-black text-white flex flex-col justify-between p-2 sm:p-4 select-none">
      
      {/* Top Navigation & App Title */}
      <header className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 via-yellow-200 to-emerald-400 bg-clip-text text-transparent leading-tight">
              BATALHA PRESIDENCIAL
            </h1>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-medium tracking-wide flex items-center gap-1.5">
              <span>Debate & Combate Arcade</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-400 font-bold">Ao Vivo</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Botão IA Toggle */}
          <button
            onClick={toggleP2Ai}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
              p2AiEnabled
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/30'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400'
            }`}
            title="Jogador 2 Luta Sozinho com IA"
          >
            <Bot className={`w-3.5 h-3.5 ${p2AiEnabled ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
            <span className="text-[11px] font-bold hidden xs:inline">{p2AiEnabled ? 'IA P2: ON' : 'IA P2: OFF'}</span>
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 cursor-pointer active:scale-95"
            title={isMuted ? 'Ativar Sons' : 'Mutar Sons'}
            aria-label="Som"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-zinc-300 cursor-pointer active:scale-95"
            title="Aviso de Paródia"
          >
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => setScreen('admin')}
            className="px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </header>

      {/* Parody Disclaimer Banner if toggled */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-4xl w-full mx-auto my-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-[11px] text-amber-200/90 leading-relaxed shrink-0"
          >
            <p className="font-bold flex items-center gap-1.5 mb-0.5 text-amber-300 text-xs">
              <AlertCircle className="w-3.5 h-3.5" /> AVISO DE SÁTIRA & PARÓDIA FICTÍCIA
            </p>
            Batalha Presidencial é uma obra caricatural, satírica e puramente fictícia de humor e entretenimento. Os personagens são avatares cartunescos inspirados em figuras públicas e não representam declarações reais, fatos ou ofensas.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Selection Area */}
      <main className="max-w-5xl w-full mx-auto my-2 flex-1 flex flex-col justify-start">
        
        {/* DUEL SHOWCASE COMPACTO (Perfeito para celular Android) */}
        <div className="bg-zinc-900/70 backdrop-blur-md rounded-2xl p-2.5 sm:p-4 border border-zinc-800 shadow-xl relative overflow-hidden shrink-0">
          
          {/* Seletor de Slot para Mobile: [1P: Seu Lutador] vs [2P: Oponente/IA] */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setActiveSlot(1)}
              className={`py-2 px-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSlot === 1
                  ? 'bg-blue-950/60 border-blue-500 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  1P
                </span>
                <div className="truncate">
                  <span className="text-[10px] text-blue-400 uppercase font-black block">Você</span>
                  <span className="text-xs sm:text-sm font-black text-white uppercase truncate block">
                    {p1.name}
                  </span>
                </div>
              </div>
              {activeSlot === 1 && (
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
              )}
            </button>

            <button
              onClick={() => setActiveSlot(2)}
              className={`py-2 px-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSlot === 2
                  ? 'bg-red-950/60 border-red-500 text-white shadow-md shadow-red-500/20 ring-2 ring-red-500/30'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-red-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  2P
                </span>
                <div className="truncate">
                  <span className="text-[10px] text-red-400 uppercase font-black block">
                    {p2AiEnabled ? '🤖 IA Oponente' : 'Jogador 2'}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-white uppercase truncate block">
                    {p2.name}
                  </span>
                </div>
              </div>
              {activeSlot === 2 && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping shrink-0" />
              )}
            </button>
          </div>

          {/* PREVIEW DO LUTADOR ATIVO (ESCOLHIDO) */}
          {(() => {
            const currentFighter = activeSlot === 1 ? p1 : p2;
            const slotColor = activeSlot === 1 ? 'blue' : 'red';

            return (
              <div className="flex items-center gap-3 bg-zinc-950/70 rounded-xl p-2 sm:p-3 border border-zinc-800/80">
                <div className="w-20 h-28 sm:w-28 sm:h-36 shrink-0 flex items-center justify-center bg-zinc-900/60 rounded-xl border border-zinc-800 p-1">
                  <div className="scale-75 sm:scale-95 origin-center">
                    <FighterSprite
                      fighter={currentFighter}
                      state="idle"
                      facing={activeSlot === 1 ? 'right' : 'left'}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-base sm:text-xl font-black text-white uppercase truncate">
                      {currentFighter.name}
                    </h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 shrink-0">
                      {currentFighter.style}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 italic line-clamp-1 mt-0.5">
                    "{currentFighter.tagline}"
                  </p>

                  {/* Barras de Estatísticas Rápidas */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px] font-bold">
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-0.5">
                        <span className="flex items-center gap-1 text-emerald-400"><Heart className="w-2.5 h-2.5" /> HP</span>
                        <span>{currentFighter.stats.hp}</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(currentFighter.stats.hp / 1300) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-400 mb-0.5">
                        <span className="flex items-center gap-1 text-rose-400"><Flame className="w-2.5 h-2.5" /> ATAQUE</span>
                        <span>{currentFighter.stats.attack}</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${currentFighter.stats.attack}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-400 mb-0.5">
                        <span className="flex items-center gap-1 text-blue-400"><Shield className="w-2.5 h-2.5" /> DEFESA</span>
                        <span>{currentFighter.stats.defense}</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${currentFighter.stats.defense}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-400 mb-0.5">
                        <span className="flex items-center gap-1 text-amber-400"><Zap className="w-2.5 h-2.5" /> VELÔ</span>
                        <span>{currentFighter.stats.speed}</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${currentFighter.stats.speed}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Golpe Especial */}
                  <div className="mt-2 text-[10px] bg-amber-500/10 rounded px-2 py-0.5 border border-amber-500/20 truncate">
                    <span className="text-amber-400 font-extrabold uppercase">ESPECIAL: </span>
                    <span className="text-white font-bold">{currentFighter.moves.special.name}</span>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

        {/* GRADE DE LUTADORES DISPONÍVEIS (ROSTER) */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <span>Lutadores Disponíveis</span>
              <span className="text-[10px] text-amber-400 font-medium">
                (Escolhendo {activeSlot === 1 ? 'Jogador 1' : 'Jogador 2'})
              </span>
            </h4>
            <span className="text-[10px] text-zinc-500 font-bold">
              {fighters.length} Candidatos
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {fighters.map((fighter) => {
              const isP1Selected = fighter.id === player1Id;
              const isP2Selected = fighter.id === player2Id;

              return (
                <button
                  key={fighter.id}
                  onClick={() => handleSelectFighter(fighter.id)}
                  className={`relative p-2 rounded-xl border-2 transition-all flex flex-col items-center justify-between text-center group cursor-pointer active:scale-95 ${
                    isP1Selected
                      ? 'bg-blue-950/70 border-blue-500 shadow-md shadow-blue-500/30'
                      : isP2Selected
                      ? 'bg-red-950/70 border-red-500 shadow-md shadow-red-500/30'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Badges P1 e P2 */}
                  {isP1Selected && (
                    <span className="absolute -top-1.5 -left-1 px-1.5 py-0.2 rounded bg-blue-600 text-[9px] font-black uppercase text-white shadow-sm z-10">
                      1P
                    </span>
                  )}
                  {isP2Selected && (
                    <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded bg-red-600 text-[9px] font-black uppercase text-white shadow-sm z-10">
                      2P
                    </span>
                  )}

                  {/* Avatar Miniatura */}
                  <div className="w-16 h-20 my-0.5 flex items-center justify-center overflow-hidden">
                    <div className="scale-65 origin-center">
                      <FighterSprite fighter={fighter} state="idle" size="sm" showShadow={false} />
                    </div>
                  </div>

                  {/* Nome e Estilo */}
                  <div className="w-full mt-0.5">
                    <span className="block text-xs font-black uppercase text-white truncate">
                      {fighter.name}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-zinc-400 block truncate">
                      {fighter.style}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Adicionar Novo Lutador Card */}
            <button
              onClick={() => setScreen('admin')}
              className="p-2 rounded-xl border-2 border-dashed border-zinc-800 hover:border-amber-400/60 bg-zinc-900/40 transition-all flex flex-col items-center justify-center text-center group cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-6 h-6 text-zinc-500 group-hover:text-amber-400 transition-colors mb-1" />
              <span className="text-[11px] font-black uppercase text-zinc-400 group-hover:text-amber-300">
                + Criar
              </span>
              <span className="text-[9px] text-zinc-500">
                Novo Lutador
              </span>
            </button>
          </div>
        </div>

      </main>

      {/* BOTÃO PRINCIPAL INICIAR COMBATE (STICKY BOTTOM PARA ACESSO IMEDIATO NO CELULAR) */}
      <div className="sticky bottom-2 z-30 max-w-5xl w-full mx-auto pt-2 shrink-0">
        <button
          onClick={handleStartBattle}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-emerald-500/40 border-2 border-emerald-300 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Swords className="w-5 h-5 animate-bounce" />
          <span>ENTRAR NA BATALHA: {p1.name} VS {p2.name}</span>
          {p2AiEnabled && <span className="text-[10px] bg-zinc-950 text-emerald-400 px-1.5 py-0.5 rounded font-black">🤖 IA</span>}
        </button>
      </div>

    </div>
  );
};
