import React from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../../store/useGameStore';
import { Play, Palette, TrendingUp, Zap, HelpCircle } from 'lucide-react';

export const MainMenu = () => {
  const { startGame, setGameState } = useGameStore();

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background visual flair */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-[150px]" />
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center space-y-4 mb-20 md:mb-12"
      >
        <span className="text-brand-gold font-black uppercase tracking-[0.5em] text-xs italic bg-white/5 px-4 py-2">Brasil Simulator • v1.0.4 - Pro Gamer</span>
        <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black text-white italic tracking-tighter leading-[0.8] drop-shadow-[0_0_50px_rgba(251,191,36,0.3)]">
          URUBU <br />
          <span className="text-linear-to-r from-brand-gold via-white to-green-500 bg-clip-text text-transparent">SIMULATOR</span>
        </h1>
        <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px] sm:text-xs">Do lixão ao topo. A maior experiência nacional de todos os tempos.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl relative z-10 px-4">
        <MenuButton 
          icon={<Play size={32} className="fill-brand-navy" />} 
          label="INICIAR VOO" 
          primary 
          onClick={startGame}
          className="col-span-2 md:col-span-1 py-10"
        />
        <MenuButton 
          icon={<Palette size={26} />} 
          label="SKINS & DRILLS" 
          onClick={() => setGameState('skins')}
          className="py-10"
        />
        <MenuButton 
          icon={<Zap size={26} />} 
          label="TUNING" 
          onClick={() => setGameState('upgrades')}
          className="py-10"
        />
        <MenuButton 
          icon={<TrendingUp size={26} />} 
          label="HALL DA FAMA" 
          onClick={() => {}} 
          className="py-10"
        />
      </div>

      <div className="mt-12 flex items-center gap-6 opacity-30 grayscale saturate-0">
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" alt="Brazil" className="w-12 h-8 rounded shadow-lg" />
        <span className="font-black italic text-xs text-white uppercase tracking-widest tracking-widest">100% Nacional</span>
      </div>

      {/* Floating Urubu icons (Decoration) */}
      <div className="absolute top-20 right-20 animate-bounce">
         <div className="w-8 h-2 bg-black rounded-full" />
      </div>
    </div>
  );
};

const MenuButton = ({ icon, label, primary, onClick, className }: { 
  icon: React.ReactNode; 
  label: string; 
  primary?: boolean; 
  onClick: () => void;
  className?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all relative overflow-hidden group ${
      primary 
      ? 'bg-yellow-400 border-yellow-500 text-brand-navy shadow-[0_10px_30px_rgba(251,191,36,0.4)]' 
      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
    } ${className}`}
  >
    {primary && (
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    )}
    <div className={primary ? 'text-brand-navy' : 'text-white/60'}>
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
  </motion.button>
);
