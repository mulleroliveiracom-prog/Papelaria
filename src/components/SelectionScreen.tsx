import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFighterStore } from '../store/useFighterStore';
import { FighterSprite } from './FighterSprite';
import { Swords, Settings, Volume2, VolumeX, Shield, Zap, Heart, Flame, Sparkles, PlusCircle, AlertCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const SelectionScreen: React.FC = () => {
  const {
    fighters,
    player1Id,
    player2Id,
    selectPlayer1,
    selectPlayer2,
    startMatch,
    setScreen,
    isMuted,
    toggleMute,
  } = useFighterStore();

  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
  const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

  const handleSelectFighter = (fighterId: string) => {
    soundManager.playPunch('light');
    if (activeSlot === 1) {
      selectPlayer1(fighterId);
      // Automatically toggle to P2 if different
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
    <div className="min-h-screen bg-radial from-slate-900 via-zinc-950 to-black text-white flex flex-col justify-between overflow-x-hidden p-3 sm:p-6 select-none">
      
      {/* Top Navigation & App Title */}
      <header className="max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Swords className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 via-yellow-200 to-emerald-400 bg-clip-text text-transparent">
              BATALHA PRESIDENCIAL
            </h1>
            <p className="text-xs text-zinc-400 font-medium tracking-wide flex items-center gap-1.5">
              <span>Simulador de Batalha & Paródia Eleitoral</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-400 font-semibold">Ao Vivo</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-200 hover:text-white transition-all shadow-sm"
            title={isMuted ? 'Ativar Sons' : 'Mutar Sons'}
            aria-label="Som"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Aviso Legal</span>
          </button>

          <button
            onClick={() => setScreen('admin')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            <span>Painel Admin</span>
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
            className="max-w-5xl w-full mx-auto my-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200/90 leading-relaxed"
          >
            <p className="font-bold flex items-center gap-2 mb-1 text-amber-300 text-sm">
              <AlertCircle className="w-4 h-4" /> AVISO DE SÁTIRA & PARÓDIA FICCTÍCIA
            </p>
            Batalha Presidencial é uma obra caricatural, satírica e puramente fictícia de humor e entretenimento. Os personagens são avatares cartunescos inspirados em figuras públicas brasileiras e não representam fatos, afirmações de combate real, ofensas ou posicionamentos partidários oficiais. Todas as estatísticas e golpes têm propósitos lúdicos para jogos no estilo arcade.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Selection Area */}
      <main className="max-w-7xl w-full mx-auto my-4 flex-1 flex flex-col justify-center">
        
        {/* Section Heading */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            19. SELEÇÃO DE PERSONAGENS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight font-serif text-white">
            ESCOLHA O SEU LUTADOR
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md mx-auto">
            Selecione o combatente do Jogador 1 e do Jogador 2 para disputar a faixa no ringue de debates!
          </p>
        </div>

        {/* Duel Showcase: P1 VS P2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-zinc-900/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-zinc-800 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Stage Lighting background */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* JOGADOR 1 BOX */}
          <div
            onClick={() => setActiveSlot(1)}
            className={`lg:col-span-5 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer border-2 relative overflow-hidden ${
              activeSlot === 1
                ? 'bg-blue-950/40 border-blue-500 shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/20'
                : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {/* Slot Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                <span>JOGADOR 1</span>
                {activeSlot === 1 && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-800/60">
                ESTILO: {p1.style}
              </span>
            </div>

            {/* Fighter Preview & Specs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-40 h-52 shrink-0 flex items-center justify-center bg-zinc-950/60 rounded-2xl border border-zinc-800/80 p-2">
                <FighterSprite fighter={p1} state="idle" facing="right" size="md" />
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                    {p1.name}
                  </h3>
                  <span className="text-xs text-zinc-400 font-medium truncate">
                    "{p1.nickname}"
                  </span>
                </div>
                <p className="text-xs text-zinc-400 italic mt-0.5 line-clamp-1">
                  {p1.tagline}
                </p>

                {/* Stat Bars */}
                <div className="space-y-2 mt-4 text-xs font-bold">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span className="flex items-center gap-1 text-emerald-400"><Heart className="w-3 h-3" /> HP</span>
                      <span>{p1.stats.hp}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(p1.stats.hp / 1300) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span className="flex items-center gap-1 text-rose-400"><Flame className="w-3 h-3" /> ATAQUE</span>
                      <span>{p1.stats.attack}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${p1.stats.attack}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span className="flex items-center gap-1 text-blue-400"><Shield className="w-3 h-3" /> DEFESA</span>
                      <span>{p1.stats.defense}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${p1.stats.defense}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span className="flex items-center gap-1 text-amber-400"><Zap className="w-3 h-3" /> VELOCIDADE</span>
                      <span>{p1.stats.speed}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${p1.stats.speed}%` }} />
                    </div>
                  </div>
                </div>

                {/* Special Move Banner */}
                <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px]">
                  <span className="text-amber-400 font-extrabold uppercase tracking-wide">ESPECIAL: </span>
                  <span className="text-white font-bold">{p1.moves.special.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* VS CENTER BADGE & START BUTTON */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center my-2 lg:my-0">
            <div className="relative mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-500 via-rose-600 to-amber-400 flex items-center justify-center font-black text-2xl sm:text-3xl text-zinc-950 shadow-xl shadow-rose-600/40 border-4 border-zinc-950 animate-pulse">
                VS
              </div>
            </div>

            <button
              onClick={handleStartBattle}
              className="w-full max-w-[200px] py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 border-2 border-emerald-300 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>COMEÇAR BATALHA</span>
            </button>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-2 font-bold">
              Modo Clássico 1v1
            </span>
          </div>

          {/* JOGADOR 2 BOX */}
          <div
            onClick={() => setActiveSlot(2)}
            className={`lg:col-span-5 rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer border-2 relative overflow-hidden ${
              activeSlot === 2
                ? 'bg-red-950/40 border-red-500 shadow-xl shadow-red-500/20 ring-4 ring-red-500/20'
                : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {/* Slot Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-md border border-red-800/60">
                ESTILO: {p2.style}
              </span>
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                <span>JOGADOR 2</span>
                {activeSlot === 2 && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
              </span>
            </div>

            {/* Fighter Preview & Specs */}
            <div className="flex flex-col sm:flex-row-reverse items-center gap-4">
              <div className="w-40 h-52 shrink-0 flex items-center justify-center bg-zinc-950/60 rounded-2xl border border-zinc-800/80 p-2">
                <FighterSprite fighter={p2} state="idle" facing="left" size="md" />
              </div>

              <div className="flex-1 w-full text-left sm:text-right">
                <div className="flex items-baseline gap-2 justify-start sm:justify-end">
                  <span className="text-xs text-zinc-400 font-medium truncate">
                    "{p2.nickname}"
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                    {p2.name}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 italic mt-0.5 line-clamp-1">
                  {p2.tagline}
                </p>

                {/* Stat Bars */}
                <div className="space-y-2 mt-4 text-xs font-bold">
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span>{p2.stats.hp}</span>
                      <span className="flex items-center gap-1 text-emerald-400"><Heart className="w-3 h-3" /> HP</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(p2.stats.hp / 1300) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span>{p2.stats.attack}</span>
                      <span className="flex items-center gap-1 text-rose-400"><Flame className="w-3 h-3" /> ATAQUE</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${p2.stats.attack}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span>{p2.stats.defense}</span>
                      <span className="flex items-center gap-1 text-blue-400"><Shield className="w-3 h-3" /> DEFESA</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${p2.stats.defense}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-300 mb-0.5">
                      <span>{p2.stats.speed}</span>
                      <span className="flex items-center gap-1 text-amber-400"><Zap className="w-3 h-3" /> VELOCIDADE</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${p2.stats.speed}%` }} />
                    </div>
                  </div>
                </div>

                {/* Special Move Banner */}
                <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px]">
                  <span className="text-amber-400 font-extrabold uppercase tracking-wide">ESPECIAL: </span>
                  <span className="text-white font-bold">{p2.moves.special.name}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 18. SELEÇÃO DE CANDIDATO - ROSTER GRID */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2">
              <span>SELECIONE SEU CANDIDATO</span>
              <span className="text-xs text-amber-400 font-medium">
                (Definindo {activeSlot === 1 ? 'Jogador 1' : 'Jogador 2'})
              </span>
            </h4>
            <span className="text-xs text-zinc-400">
              {fighters.length} lutadores disponíveis
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {fighters.map((fighter) => {
              const isP1Selected = fighter.id === player1Id;
              const isP2Selected = fighter.id === player2Id;

              return (
                <button
                  key={fighter.id}
                  onClick={() => handleSelectFighter(fighter.id)}
                  className={`relative p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-between text-center group cursor-pointer ${
                    isP1Selected
                      ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/20'
                      : isP2Selected
                      ? 'bg-red-950/60 border-red-500 shadow-lg shadow-red-500/20'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                  }`}
                >
                  {/* P1 or P2 Badge */}
                  {isP1Selected && (
                    <span className="absolute -top-2.5 left-2 px-2 py-0.5 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                      P1
                    </span>
                  )}
                  {isP2Selected && (
                    <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-red-600 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                      P2
                    </span>
                  )}

                  {/* Character Avatar / Sprite representation */}
                  <div className="w-24 h-28 my-1 flex items-center justify-center overflow-hidden">
                    <FighterSprite fighter={fighter} state="idle" size="sm" showShadow={false} />
                  </div>

                  {/* Character Name & Style */}
                  <div className="w-full mt-1">
                    <span className="block text-sm font-black uppercase text-white group-hover:text-amber-300 transition-colors">
                      {fighter.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block truncate">
                      {fighter.style}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Quick Add Fighter Card */}
            <button
              onClick={() => setScreen('admin')}
              className="p-3 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-amber-400/60 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <PlusCircle className="w-8 h-8 text-zinc-500 group-hover:text-amber-400 transition-colors mb-2" />
              <span className="text-xs font-black uppercase text-zinc-400 group-hover:text-amber-300">
                + Novo Lutador
              </span>
              <span className="text-[10px] text-zinc-400">
                Criar no Admin
              </span>
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto pt-4 border-t border-zinc-900 text-center text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          Batalha Presidencial © 2026 — Jogo fictício de paródia e sátira eleitoral.
        </p>
        <p className="text-[11px] text-zinc-400">
          Suporta transmissão em lives com presentes interativos (TikTok / Kwai / YouTube).
        </p>
      </footer>
    </div>
  );
};
