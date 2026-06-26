import React from 'react';
import { motion } from 'motion/react';
import { useGameStore, Skin } from '../../store/useGameStore';
import { ChevronLeft, Lock } from 'lucide-react';

const SKINS_DATA: { id: Skin; name: string; price: number; description: string; color: string }[] = [
  { id: 'cria', name: 'Urubu Cria', price: 0, description: 'O clássico da rodoviária.', color: '#1a1a1a' },
  { id: 'motoboy', name: 'Urubu Motoboy', price: 500, description: 'Lanche entregue (ou não).', color: '#ff4444' },
  { id: 'funkeiro', name: 'Urubu Funkeiro', price: 1000, description: 'Som de paredão.', color: '#d946ef' },
  { id: 'politico', name: 'Urubu Político', price: 5000, description: 'Promessa de lixo para todos.', color: '#3b82f6' },
  { id: 'milionario', name: 'Urubu Milionário', price: 10000, description: 'Frequenta apenas Alphaville.', color: '#fbbf24' },
  { id: 'tatico', name: 'Urubu Tático', price: 15000, description: 'Elite da carniça.', color: '#14532d' },
];

export const SkinsMenu = () => {
  const { setGameState, scraps, unlockedSkins, unlockSkin, setSkin, activeSkin } = useGameStore();

  return (
    <div className="fixed inset-0 bg-[#0a0502]/95 backdrop-blur-3xl z-50 flex flex-col p-8">
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => setGameState('start')}
          className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10"
        >
          <ChevronLeft className="text-white" />
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">COLEÇÃO DE ELITE</h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Escolha sua identidade urbana</p>
        </div>
        <div className="bg-yellow-400 text-brand-navy px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="font-black text-xs uppercase tracking-widest">{scraps}</span>
          <span className="text-[10px] font-bold">RP</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto pb-20">
        {SKINS_DATA.map((skin) => {
          const isUnlocked = unlockedSkins.includes(skin.id);
          const isActive = activeSkin === skin.id;

          return (
            <motion.button
              key={skin.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isUnlocked) {
                  setSkin(skin.id);
                } else if (scraps >= skin.price) {
                  // In a real game we'd deduct scraps and unlock
                  // unlockSkin(skin.id);
                }
              }}
              className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 relative group ${
                isActive ? 'border-yellow-400 bg-white/5' : isUnlocked ? 'border-white/10 bg-white/2' : 'border-white/5 bg-black/40 opacity-60'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute top-4 right-4">
                  <Lock size={14} className="text-white/40" />
                </div>
              )}
              
              <div 
                className="w-24 h-24 rounded-full shadow-2xl relative flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: skin.color }}
              >
                 <div className="w-16 h-8 bg-black/40 rounded-full blur-xl" />
              </div>

              <div className="text-center">
                <h3 className="text-sm font-black italic text-white uppercase tracking-wider">{skin.name}</h3>
                <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mt-1">{skin.description}</p>
              </div>

              <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-yellow-400 text-brand-navy' : 'bg-white/10 text-white/60'}`}>
                {isActive ? 'SELECIONADO' : isUnlocked ? 'EQUIPAR' : `${skin.price} RP`}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">Novas skins em breve no Lixão Municipal</p>
      </div>
    </div>
  );
};
