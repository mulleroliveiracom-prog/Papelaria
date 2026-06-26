import { create } from 'zustand';

export type Skin = 'cria' | 'motoboy' | 'funkeiro' | 'politico' | 'milionario' | 'tatico' | 'pastor' | 'craque' | 'carnaval' | 'dourado';

interface GameState {
  gameState: 'start' | 'playing' | 'gameover' | 'skins' | 'upgrades';
  energy: number;
  scraps: number;
  reputation: number;
  activeSkin: Skin;
  unlockedSkins: Skin[];
  chaosMode: boolean;
  chaosMeter: number;
  
  // Actions
  startGame: () => void;
  endGame: () => void;
  setGameState: (state: GameState['gameState']) => void;
  addScraps: (amount: number) => void;
  updateEnergy: (amount: number) => void;
  activateChaos: () => void;
  unlockSkin: (skin: Skin) => void;
  setSkin: (skin: Skin) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameState: 'start',
  energy: 100,
  scraps: 0,
  reputation: 0,
  activeSkin: 'cria',
  unlockedSkins: ['cria'],
  chaosMode: false,
  chaosMeter: 0,

  startGame: () => set({ gameState: 'playing', energy: 100, chaosMeter: 0, chaosMode: false }),
  endGame: () => set({ gameState: 'gameover' }),
  setGameState: (state) => set({ gameState: state }),
  addScraps: (amount) => set((state) => ({ scraps: state.scraps + amount })),
  updateEnergy: (amount) => set((state) => ({ energy: Math.min(100, Math.max(0, state.energy + amount)) })),
  activateChaos: () => set({ chaosMode: true, chaosMeter: 100 }),
  unlockSkin: (skin) => set((state) => ({ unlockedSkins: [...state.unlockedSkins, skin] })),
  setSkin: (skin) => set({ activeSkin: skin }),
  resetGame: () => set({ gameState: 'start', energy: 100, scraps: 0, chaosMeter: 0, chaosMode: false }),
}));
