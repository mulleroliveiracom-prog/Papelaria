import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/useGameStore';
import { Zap, Trophy, Coins, Flame } from 'lucide-react';

export const HUD = () => {
  const { energy, scraps, chaosMeter, chaosMode } = useGameStore();

  return (
    <div className="fixed inset-0 pointer-events-none p-4 md:p-10 flex flex-col justify-between">
      {/* Top Stats */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          {/* Energy bar */}
          <div className="w-48 md:w-80 h-8 bg-black/60 rounded-sm border-r-4 border-emerald-500 overflow-hidden relative backdrop-blur-xl">
            <motion.div 
              className="h-full bg-linear-to-r from-emerald-600 via-green-400 to-emerald-500"
              initial={{ width: '100%' }}
              animate={{ width: `${energy}%` }}
            />
            <div className="absolute inset-0 flex items-center px-4 gap-3 bg-white/5">
              <Zap size={16} className="text-white fill-white animate-pulse" />
              <span className="text-[10px] font-black italic text-white uppercase tracking-[0.2em]">K-VALO POWER</span>
            </div>
          </div>

          {/* Chaos Meter */}
          <div className="w-32 md:w-56 h-3 bg-black/60 rounded-sm border-r-2 border-orange-500 overflow-hidden relative">
            <motion.div 
              className="h-full bg-linear-to-r from-orange-600 to-red-600"
              animate={{ width: `${chaosMeter}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-6 py-4 flex items-center gap-4 shadow-2xl">
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-brand-gold font-black uppercase tracking-[0.3em]">Carniça Score</span>
              <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none italic">{scraps.toLocaleString()}</span>
            </div>
            <Coins className="text-brand-gold drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" size={32} />
          </div>
          
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-green-500 font-black text-[10px]">FPS</div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-black text-[10px]">ULT</div>
          </div>
        </div>
      </div>

      {/* Center Alerts - Pushed to the left for landscape */}
      <div className="max-w-xs flex flex-col gap-3 mb-10">
        <MissionAlert text="RROUBE 3 COXINHAS" completed={false} />
        <MissionAlert text="CAGUE EM 5 CARROS" completed={true} />
        <MissionAlert text="PILOTAR NO MODO GAMER" completed={true} />
      </div>

      {/* Special Effects Layer */}
      {chaosMode && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 border-[20px] border-orange-500/30 pointer-events-none mix-blend-overlay"
        />
      )}
    </div>
  );
};

const MissionAlert = ({ text, completed }: { text: string; completed: boolean }) => (
  <motion.div 
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    className={`px-4 py-2 rounded-lg border-l-4 flex items-center gap-3 backdrop-blur-md ${completed ? 'bg-green-500/20 border-green-500' : 'bg-white/5 border-white/20'}`}
  >
    <div className={`w-4 h-4 rounded-full border-2 ${completed ? 'bg-green-500 border-green-400' : 'border-white/40'}`} />
    <span className={`text-[10px] font-black uppercase italic tracking-widest ${completed ? 'text-green-300 line-through' : 'text-white'}`}>
      {text}
    </span>
  </motion.div>
);
