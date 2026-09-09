import { create } from 'zustand';
import { Fighter, GiftItem, AnimationState, DamageNumber, GiftAlert, CombatLog, GiftMoveConfig } from '../types/fighter';
import { DEFAULT_FIGHTERS, DEFAULT_GIFTS } from '../data/defaultFighters';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

const STORAGE_KEY_FIGHTERS = 'batalha_presidencial_fighters_v1';
const STORAGE_KEY_GIFTS = 'batalha_presidencial_gifts_v1';

function loadInitialFighters(): Fighter[] {
  if (typeof window === 'undefined') return DEFAULT_FIGHTERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FIGHTERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load fighters from localStorage', e);
  }
  return DEFAULT_FIGHTERS;
}

function loadInitialGifts(): GiftItem[] {
  if (typeof window === 'undefined') return DEFAULT_GIFTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GIFTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load gifts from localStorage', e);
  }
  return DEFAULT_GIFTS;
}

interface FighterStoreState {
  // Catalog data
  fighters: Fighter[];
  gifts: GiftItem[];
  
  // Selection
  player1Id: string;
  player2Id: string;
  screen: 'selection' | 'announcement' | 'countdown' | 'battle' | 'admin';
  
  // Match state
  p1Hp: number;
  p1MaxHp: number;
  p1Energy: number;
  p1State: AnimationState;
  
  p2Hp: number;
  p2MaxHp: number;
  p2Energy: number;
  p2State: AnimationState;
  
  roundWinner: 1 | 2 | null;
  comboCount: number;
  lastDamage: number;
  damageNumbers: DamageNumber[];
  currentGiftAlert: GiftAlert | null;
  combatLogs: CombatLog[];
  isMuted: boolean;
  autoLiveSimulator: boolean;
  p2AiEnabled: boolean;
  screenMode: 'mobile' | 'fullscreen';

  // Actions
  selectPlayer1: (id: string) => void;
  selectPlayer2: (id: string) => void;
  setScreen: (screen: FighterStoreState['screen']) => void;
  startMatch: () => void;
  proceedToCountdown: () => void;
  finishCountdown: () => void;
  
  // Combat mechanics
  executeAttack: (attacker: 1 | 2, moveKey: 'move1' | 'move2' | 'move3' | 'special') => void;
  sendGift: (targetAttacker: 1 | 2, giftId: string, senderName?: string) => void;
  restartMatch: () => void;
  returnToSelection: () => void;
  toggleAutoLive: () => void;
  toggleMute: () => void;
  toggleP2Ai: () => void;
  setP2AiEnabled: (enabled: boolean) => void;
  toggleScreenMode: () => void;

  // Admin and persistence methods
  updateFighter: (id: string, updates: Partial<Fighter>) => void;
  addFighter: (fighter: Fighter) => void;
  deleteFighter: (id: string) => void;
  updateGiftMove: (fighterId: string, giftId: string, config: GiftMoveConfig) => void;
  resetToDefaults: () => void;
}

export const useFighterStore = create<FighterStoreState>((set, get) => ({
  fighters: loadInitialFighters(),
  gifts: loadInitialGifts(),
  
  player1Id: 'renan',
  player2Id: 'ciro',
  screen: 'selection',

  p1Hp: 1000,
  p1MaxHp: 1000,
  p1Energy: 50,
  p1State: 'idle',

  p2Hp: 1050,
  p2MaxHp: 1050,
  p2Energy: 50,
  p2State: 'idle',

  roundWinner: null,
  comboCount: 0,
  lastDamage: 0,
  damageNumbers: [],
  currentGiftAlert: null,
  combatLogs: [],
  isMuted: false,
  autoLiveSimulator: false,
  p2AiEnabled: true,
  screenMode: 'mobile',

  selectPlayer1: (id) => set({ player1Id: id }),
  selectPlayer2: (id) => set({ player2Id: id }),
  setScreen: (screen) => set({ screen }),

  startMatch: () => {
    const { fighters, player1Id, player2Id } = get();
    const p1 = fighters.find((f) => f.id === player1Id) || fighters[0];
    const p2 = fighters.find((f) => f.id === player2Id) || fighters[1] || fighters[0];

    set({
      p1Hp: p1.stats.hp,
      p1MaxHp: p1.stats.hp,
      p1Energy: 40,
      p1State: 'idle',

      p2Hp: p2.stats.hp,
      p2MaxHp: p2.stats.hp,
      p2Energy: 40,
      p2State: 'idle',

      roundWinner: null,
      comboCount: 0,
      lastDamage: 0,
      damageNumbers: [],
      currentGiftAlert: null,
      combatLogs: [
        {
          id: `log-${Date.now()}`,
          text: `⚡ BATALHA PRESIDENCIAL: ${p1.name} VS ${p2.name}!`,
          type: 'system',
          timestamp: Date.now(),
        },
      ],
      screen: 'announcement',
    });
  },

  proceedToCountdown: () => {
    set({ screen: 'countdown' });
  },

  finishCountdown: () => {
    set({ screen: 'battle' });
  },

  executeAttack: (attacker, moveKey) => {
    const state = get();
    if (state.roundWinner !== null || state.screen !== 'battle') return;

    const p1 = state.fighters.find((f) => f.id === state.player1Id)!;
    const p2 = state.fighters.find((f) => f.id === state.player2Id)!;
    const isP1 = attacker === 1;

    const actingFighter = isP1 ? p1 : p2;
    const defendingFighter = isP1 ? p2 : p1;
    const move = actingFighter.moves[moveKey];

    // Energy requirement check for special
    if (moveKey === 'special') {
      const currentEnergy = isP1 ? state.p1Energy : state.p2Energy;
      if (currentEnergy < 100) return; // Need full energy
    }

    // Sound effect
    if (moveKey === 'special') {
      soundManager.playSpecial();
    } else {
      soundManager.playPunch(move.damage > 85 ? 'heavy' : 'light');
    }

    // Damage calculation based on attack & defense
    const baseDamage = move.damage;
    const atkFactor = actingFighter.stats.attack / 100;
    const defFactor = defendingFighter.stats.defense / 100;
    const variance = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
    const finalDamage = Math.round(Math.max(15, baseDamage * (atkFactor / Math.max(0.4, defFactor)) * variance));

    const isCrit = Math.random() > 0.8;
    const damageWithCrit = isCrit ? Math.round(finalDamage * 1.3) : finalDamage;

    // Spawn damage number
    const damageNum: DamageNumber = {
      id: `dmg-${Date.now()}-${Math.random()}`,
      value: damageWithCrit,
      x: isP1 ? 65 + (Math.random() * 10 - 5) : 35 + (Math.random() * 10 - 5),
      y: 40 + Math.random() * 10,
      isCrit,
      color: isCrit ? '#ef4444' : '#fbbf24',
    };

    // Update HP and Energy
    let nextP1Hp = state.p1Hp;
    let nextP2Hp = state.p2Hp;
    let nextP1Energy = state.p1Energy;
    let nextP2Energy = state.p2Energy;

    if (isP1) {
      nextP2Hp = Math.max(0, nextP2Hp - damageWithCrit);
      if (moveKey === 'special') {
        nextP1Energy = 0;
      } else {
        nextP1Energy = Math.min(100, nextP1Energy + 20);
      }
      nextP2Energy = Math.min(100, nextP2Energy + 15); // defender gains energy on hit
    } else {
      nextP1Hp = Math.max(0, nextP1Hp - damageWithCrit);
      if (moveKey === 'special') {
        nextP2Energy = 0;
      } else {
        nextP2Energy = Math.min(100, nextP2Energy + 20);
      }
      nextP1Energy = Math.min(100, nextP1Energy + 15);
    }

    const newCombo = state.comboCount + 1;
    const logItem: CombatLog = {
      id: `log-${Date.now()}`,
      text: `${actingFighter.name} usou [${move.name}] causando ${damageWithCrit} de dano! ${isCrit ? '💥 CRÍTICO!' : ''}`,
      type: moveKey === 'special' ? 'special' : 'attack',
      timestamp: Date.now(),
    };

    // Set animation states
    const attackerAnim: AnimationState = moveKey === 'special' ? 'special' : 'attack';
    const defenderAnim: AnimationState = 'hit';

    set({
      p1State: isP1 ? attackerAnim : defenderAnim,
      p2State: isP1 ? defenderAnim : attackerAnim,
      p1Hp: nextP1Hp,
      p2Hp: nextP2Hp,
      p1Energy: nextP1Energy,
      p2Energy: nextP2Energy,
      comboCount: newCombo,
      lastDamage: damageWithCrit,
      damageNumbers: [...state.damageNumbers.slice(-5), damageNum],
      combatLogs: [logItem, ...state.combatLogs.slice(0, 30)],
    });

    // Check Knockout
    if (nextP1Hp <= 0 || nextP2Hp <= 0) {
      const winner: 1 | 2 = nextP1Hp > 0 ? 1 : 2;
      const winnerFighter = winner === 1 ? p1 : p2;
      
      soundManager.playVictory();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      set({
        roundWinner: winner,
        p1State: winner === 1 ? 'victory' : 'defeat',
        p2State: winner === 2 ? 'victory' : 'defeat',
        combatLogs: [
          {
            id: `ko-${Date.now()}`,
            text: `🏆 K.O.! ${winnerFighter.name} VENCEU A BATALHA PRESIDENCIAL!`,
            type: 'ko',
            timestamp: Date.now(),
          },
          ...get().combatLogs,
        ],
      });
      return;
    }

    // Reset back to idle after animation delay
    const animDuration = moveKey === 'special' ? 1400 : 500;
    setTimeout(() => {
      const current = get();
      if (current.roundWinner === null) {
        set({
          p1State: 'idle',
          p2State: 'idle',
        });
      }
    }, animDuration);
  },

  sendGift: (targetAttacker, giftId, senderName = '@espectador') => {
    const state = get();
    if (state.roundWinner !== null || state.screen !== 'battle') return;

    const p1 = state.fighters.find((f) => f.id === state.player1Id)!;
    const p2 = state.fighters.find((f) => f.id === state.player2Id)!;
    const isP1 = targetAttacker === 1;

    const attackerFighter = isP1 ? p1 : p2;
    const defenderFighter = isP1 ? p2 : p1;
    const gift = state.gifts.find((g) => g.id === giftId) || state.gifts[0];

    // Fetch custom gift move for this fighter or fallback
    const customMove = attackerFighter.giftMoves[giftId] || {
      attackName: `${gift.name} de Ataque`,
      damage: gift.defaultDamage,
      hits: 1,
      effect: gift.defaultEffect,
    };

    soundManager.playGift();
    setTimeout(() => {
      soundManager.playPunch(customMove.damage > 120 ? 'heavy' : 'light');
    }, 200);

    // Calculate damage with stats
    const atkFactor = attackerFighter.stats.attack / 100;
    const defFactor = defenderFighter.stats.defense / 100;
    const finalDamage = Math.round(Math.max(20, customMove.damage * (atkFactor / Math.max(0.4, defFactor))));

    // Damage Number
    const damageNum: DamageNumber = {
      id: `dmg-${Date.now()}-${Math.random()}`,
      value: finalDamage,
      x: isP1 ? 65 : 35,
      y: 35,
      isCrit: customMove.damage >= 150,
      color: '#f43f5e',
    };

    const nextP1Hp = isP1 ? state.p1Hp : Math.max(0, state.p1Hp - finalDamage);
    const nextP2Hp = isP1 ? Math.max(0, state.p2Hp - finalDamage) : state.p2Hp;

    const nextP1Energy = isP1 ? Math.min(100, state.p1Energy + 25) : state.p1Energy;
    const nextP2Energy = isP1 ? state.p2Energy : Math.min(100, state.p2Energy + 25);

    const giftAlert: GiftAlert = {
      id: `alert-${Date.now()}`,
      sender: senderName,
      giftName: gift.name,
      giftIcon: gift.icon,
      fighterName: attackerFighter.name,
      attackName: customMove.attackName,
      damage: finalDamage,
      hits: customMove.hits,
      timestamp: Date.now(),
    };

    const newCombo = state.comboCount + 1;
    const logItem: CombatLog = {
      id: `log-${Date.now()}`,
      text: `${gift.icon} ${senderName} enviou ${gift.name} para ${attackerFighter.name}! [${customMove.attackName}] -${finalDamage}`,
      type: 'gift',
      timestamp: Date.now(),
    };

    set({
      currentGiftAlert: giftAlert,
      p1State: isP1 ? 'attack' : 'hit',
      p2State: isP1 ? 'hit' : 'attack',
      p1Hp: nextP1Hp,
      p2Hp: nextP2Hp,
      p1Energy: nextP1Energy,
      p2Energy: nextP2Energy,
      comboCount: newCombo,
      lastDamage: finalDamage,
      damageNumbers: [...state.damageNumbers.slice(-5), damageNum],
      combatLogs: [logItem, ...state.combatLogs.slice(0, 30)],
    });

    // Check KO
    if (nextP1Hp <= 0 || nextP2Hp <= 0) {
      const winner: 1 | 2 = nextP1Hp > 0 ? 1 : 2;
      const winnerFighter = winner === 1 ? p1 : p2;
      soundManager.playVictory();
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

      set({
        roundWinner: winner,
        p1State: winner === 1 ? 'victory' : 'defeat',
        p2State: winner === 2 ? 'victory' : 'defeat',
        combatLogs: [
          {
            id: `ko-${Date.now()}`,
            text: `🏆 K.O.! ${winnerFighter.name} VENCEU A BATALHA PRESIDENCIAL COM AJUDA DO PÚBLICO!`,
            type: 'ko',
            timestamp: Date.now(),
          },
          ...get().combatLogs,
        ],
      });
      return;
    }

    setTimeout(() => {
      const current = get();
      if (current.roundWinner === null) {
        set({ p1State: 'idle', p2State: 'idle' });
      }
    }, 600);
  },

  restartMatch: () => {
    get().startMatch();
  },

  returnToSelection: () => {
    set({ screen: 'selection', roundWinner: null, damageNumbers: [], currentGiftAlert: null });
  },

  toggleAutoLive: () => {
    set((s) => ({ autoLiveSimulator: !s.autoLiveSimulator }));
  },

  toggleMute: () => {
    const next = !get().isMuted;
    soundManager.enabled = !next;
    set({ isMuted: next });
  },

  toggleP2Ai: () => {
    set((s) => ({ p2AiEnabled: !s.p2AiEnabled }));
  },

  setP2AiEnabled: (enabled: boolean) => {
    set({ p2AiEnabled: enabled });
  },

  toggleScreenMode: () => {
    set((s) => ({ screenMode: s.screenMode === 'mobile' ? 'fullscreen' : 'mobile' }));
  },

  // Admin and persistence methods
  updateFighter: (id, updates) => {
    set((state) => {
      const updated = state.fighters.map((f) => (f.id === id ? { ...f, ...updates } : f));
      try {
        localStorage.setItem(STORAGE_KEY_FIGHTERS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { fighters: updated };
    });
  },

  addFighter: (newFighter) => {
    set((state) => {
      const updated = [...state.fighters, newFighter];
      try {
        localStorage.setItem(STORAGE_KEY_FIGHTERS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { fighters: updated };
    });
  },

  deleteFighter: (id) => {
    set((state) => {
      if (state.fighters.length <= 2) {
        alert('É necessário ter ao menos 2 lutadores no jogo.');
        return state;
      }
      const updated = state.fighters.filter((f) => f.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_FIGHTERS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return {
        fighters: updated,
        player1Id: state.player1Id === id ? updated[0].id : state.player1Id,
        player2Id: state.player2Id === id ? updated[1].id : state.player2Id,
      };
    });
  },

  updateGiftMove: (fighterId, giftId, config) => {
    set((state) => {
      const updated = state.fighters.map((f) => {
        if (f.id !== fighterId) return f;
        return {
          ...f,
          giftMoves: {
            ...f.giftMoves,
            [giftId]: config,
          },
        };
      });
      try {
        localStorage.setItem(STORAGE_KEY_FIGHTERS, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return { fighters: updated };
    });
  },

  resetToDefaults: () => {
    try {
      localStorage.removeItem(STORAGE_KEY_FIGHTERS);
      localStorage.removeItem(STORAGE_KEY_GIFTS);
    } catch (e) {
      console.error(e);
    }
    set({
      fighters: DEFAULT_FIGHTERS,
      gifts: DEFAULT_GIFTS,
      player1Id: 'renan',
      player2Id: 'ciro',
    });
  },
}));
