export type FighterStyle = 'ESTRATEGISTA' | 'GUERREIRO' | 'LÍDER' | 'DEFENSOR' | 'FORÇA' | 'ATAQUE' | 'DIPLOMATA' | 'POPULISTA' | 'TÉCNICO';

export type AnimationState = 'idle' | 'attack' | 'hit' | 'special' | 'victory' | 'defeat';

export type HitEffectType = 'fire' | 'lightning' | 'crowd' | 'parliament' | 'speed' | 'explosion' | 'shield' | 'rose' | 'coffee';

export interface FighterVisual {
  hairStyle: 'short_neat' | 'grey_pompadour' | 'grey_beard' | 'short_dark' | 'buzz' | 'receding_side' | 'long_curly' | 'bald';
  hairColor: string;
  skinTone: string;
  suitColor: string;
  tieColor: string;
  shirtColor: string;
  facialHair?: 'none' | 'grey_beard' | 'light_stubble' | 'mustache';
  glasses?: boolean;
  accessory?: 'sash' | 'pin' | 'pen' | 'watch' | 'mic';
}

export interface FighterStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  energy: number;
  maxEnergy: number;
}

export interface MoveDefinition {
  name: string;
  damage: number;
  hits: number;
  effect: HitEffectType;
  quote?: string;
  description?: string;
}

export interface GiftMoveConfig {
  attackName: string;
  damage: number;
  hits: number;
  effect: HitEffectType;
}

export interface GiftItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  defaultDamage: number;
  defaultEffect: HitEffectType;
  description: string;
}

export interface Fighter {
  id: string;
  name: string;
  nickname: string;
  tagline: string;
  style: FighterStyle;
  primaryColor: string;
  secondaryColor: string;
  visual: FighterVisual;
  stats: FighterStats;
  moves: {
    move1: MoveDefinition;
    move2: MoveDefinition;
    move3: MoveDefinition;
    special: MoveDefinition;
  };
  giftMoves: Record<string, GiftMoveConfig>;
  dialogues: {
    entry: string;
    victory: string;
    defeat: string;
    specialQuote: string;
  };
}

export interface DamageNumber {
  id: string;
  value: number;
  x: number;
  y: number;
  isCrit?: boolean;
  color?: string;
}

export interface GiftAlert {
  id: string;
  sender: string;
  giftName: string;
  giftIcon: string;
  fighterName: string;
  attackName: string;
  damage: number;
  hits: number;
  timestamp: number;
}

export interface CombatLog {
  id: string;
  text: string;
  type: 'attack' | 'gift' | 'special' | 'ko' | 'system';
  timestamp: number;
}
