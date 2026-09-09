import React, { useState } from 'react';
import { useFighterStore } from '../store/useFighterStore';
import { Fighter, GiftMoveConfig, HitEffectType, FighterStyle } from '../types/fighter';
import { FighterSprite } from './FighterSprite';
import {
  Settings,
  ArrowLeft,
  Gift,
  Users,
  PlusCircle,
  RotateCcw,
  Save,
  Trash2,
  Check,
  Shield,
  Zap,
  Flame,
  Heart,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    fighters,
    gifts,
    setScreen,
    updateFighter,
    addFighter,
    deleteFighter,
    updateGiftMove,
    resetToDefaults,
  } = useFighterStore();

  const [activeTab, setActiveTab] = useState<'gifts' | 'stats' | 'create' | 'backup'>('gifts');

  // Gift Config state
  const [selectedFighterId, setSelectedFighterId] = useState<string>(fighters[0]?.id || 'renan');
  const [selectedGiftId, setSelectedGiftId] = useState<string>(gifts[0]?.id || 'rosa');
  const [giftForm, setGiftForm] = useState<GiftMoveConfig>({
    attackName: '',
    damage: 70,
    hits: 1,
    effect: 'rose',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync gift form when fighter or gift changes
  React.useEffect(() => {
    const fighter = fighters.find((f) => f.id === selectedFighterId);
    if (!fighter) return;
    const currentConfig = fighter.giftMoves[selectedGiftId] || {
      attackName: `${selectedGiftId} de Ataque`,
      damage: 70,
      hits: 1,
      effect: 'rose',
    };
    setGiftForm(currentConfig);
  }, [selectedFighterId, selectedGiftId, fighters]);

  // Edit fighter stats state
  const [statFighterId, setStatFighterId] = useState<string>(fighters[0]?.id || 'renan');
  const statFighter = fighters.find((f) => f.id === statFighterId) || fighters[0];

  // New Fighter Form State
  const [newFighterName, setNewFighterName] = useState('');
  const [newFighterNickname, setNewFighterNickname] = useState('');
  const [newFighterTagline, setNewFighterTagline] = useState('');
  const [newFighterStyle, setNewFighterStyle] = useState<FighterStyle>('ESTRATEGISTA');
  const [newFighterHp, setNewFighterHp] = useState(1050);
  const [newFighterAttack, setNewFighterAttack] = useState(80);
  const [newFighterDefense, setNewFighterDefense] = useState(70);
  const [newFighterSpeed, setNewFighterSpeed] = useState(75);
  const [newFighterPrimaryColor, setNewFighterPrimaryColor] = useState('#2563eb');
  const [newFighterSecondaryColor, setNewFighterSecondaryColor] = useState('#ffffff');
  const [newSpecialName, setNewSpecialName] = useState('SUPER PROPOSTA DE LEI');
  const [newSpecialQuote, setNewSpecialQuote] = useState('Pelo progresso do nosso país!');
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleSaveGiftConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateGiftMove(selectedFighterId, selectedGiftId, giftForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCreateFighter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFighterName.trim()) return;

    const id = newFighterName.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString().slice(-4);
    const newFighter: Fighter = {
      id,
      name: newFighterName.toUpperCase(),
      nickname: newFighterNickname || 'O Novo Candidato',
      tagline: newFighterTagline || 'Pronto para debater na arena presidencial!',
      style: newFighterStyle,
      primaryColor: newFighterPrimaryColor,
      secondaryColor: newFighterSecondaryColor,
      visual: {
        hairStyle: 'short_neat',
        hairColor: '#1f2937',
        skinTone: '#f8d2b2',
        suitColor: '#1e293b',
        tieColor: newFighterPrimaryColor,
        shirtColor: '#ffffff',
        facialHair: 'none',
        accessory: 'pin',
      },
      stats: {
        hp: Number(newFighterHp),
        maxHp: Number(newFighterHp),
        attack: Number(newFighterAttack),
        defense: Number(newFighterDefense),
        speed: Number(newFighterSpeed),
        energy: 100,
        maxEnergy: 100,
      },
      moves: {
        move1: {
          name: 'Discurso de Campanha',
          damage: Math.round(newFighterAttack * 0.9),
          hits: 1,
          effect: 'speed',
          description: 'Apresentação contundente na tribuna.',
        },
        move2: {
          name: 'Ataque Programático',
          damage: Math.round(newFighterAttack * 1.05),
          hits: 2,
          effect: 'parliament',
          description: 'Confronto direto com propostas.',
        },
        move3: {
          name: 'Investida Popular',
          damage: Math.round(newFighterAttack * 1.2),
          hits: 3,
          effect: 'crowd',
          description: 'Mobilização dos apoiadores para o ataque.',
        },
        special: {
          name: newSpecialName || 'SUPER PROPOSTA DE LEI',
          damage: Math.round(newFighterAttack * 3.2),
          hits: 5,
          effect: 'explosion',
          quote: newSpecialQuote,
          description: 'Apresenta a medida máxima que sela o debate.',
        },
      },
      giftMoves: {
        rosa: { attackName: 'Discurso de Rosa', damage: 70, hits: 1, effect: 'rose' },
        cafezinho: { attackName: 'Pausa do Cafezinho', damage: 95, hits: 2, effect: 'coffee' },
        foguete: { attackName: 'Decolagem Eleitoral', damage: 150, hits: 3, effect: 'explosion' },
        coroa: { attackName: 'Coroa da Vitória', damage: 250, hits: 5, effect: 'lightning' },
      },
      dialogues: {
        entry: `${newFighterName.toUpperCase()} ENTRA NA ARENA!`,
        victory: 'A vitória do nosso projeto é incontestável!',
        defeat: 'A democracia nos reserva o próximo pleito!',
        specialQuote: newSpecialQuote,
      },
    };

    addFighter(newFighter);
    setCreateSuccess(true);
    setNewFighterName('');
    setNewFighterNickname('');
    setNewFighterTagline('');
    setTimeout(() => {
      setCreateSuccess(false);
      setActiveTab('stats');
      setStatFighterId(id);
    }, 1500);
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(fighters, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batalha_presidencial_lutadores_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-6 select-none">
      
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('selection')}
            className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Voltar ao Jogo"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Painel Administrativo do Jogo
            </h1>
            <p className="text-xs text-zinc-400">
              Personalize atributos de combate, presentes de live e adicione novos lutadores
            </p>
          </div>
        </div>

        <button
          onClick={() => setScreen('selection')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
        >
          Voltar à Arena
        </button>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl w-full mx-auto my-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('gifts')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'gifts'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Configuração de Presentes (Item 21)</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'stats'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Atributos dos Lutadores (Item 20)</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'create'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Adicionar Novo Lutador (Item 24)</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'backup'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Dados & Backup</span>
        </button>
      </div>

      {/* TAB 1: GIFTS CONFIGURATION (REQUIREMENT 21) */}
      {activeTab === 'gifts' && (
        <div className="max-w-6xl w-full mx-auto bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800 shadow-xl">
          <div className="mb-6">
            <span className="text-xs font-black uppercase text-amber-400 tracking-widest block mb-1">
              REGRA 21: MATRIZ DE PRESENTES E GOLPES
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              Vincular Presente ao Golpe do Personagem
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              "O administrador deve conseguir escolher: PERSONAGEM ➔ PRESENTE ➔ ATAQUE ➔ DANO ➔ NÚMERO DE GOLPES ➔ EFEITO"
            </p>
          </div>

          <form onSubmit={handleSaveGiftConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Step 1 & 2: Select Fighter & Gift */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                  1. Selecione o Personagem
                </label>
                <select
                  value={selectedFighterId}
                  onChange={(e) => setSelectedFighterId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-hidden focus:border-amber-400"
                >
                  {fighters.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.style})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                  2. Selecione o Presente da Live
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {gifts.map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setSelectedGiftId(g.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedGiftId === g.id
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl block">{g.icon}</span>
                      <span className="text-[11px] font-bold block truncate">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fighter Preview Card */}
              {(() => {
                const currentFighter = fighters.find((f) => f.id === selectedFighterId);
                if (!currentFighter) return null;
                return (
                  <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-4">
                    <div className="w-24 h-28 shrink-0 flex items-center justify-center">
                      <FighterSprite fighter={currentFighter} state="attack" size="sm" showShadow={false} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black uppercase text-white">{currentFighter.name}</h4>
                      <p className="text-xs text-zinc-400 italic">"{currentFighter.tagline}"</p>
                      <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                        Estilo: {currentFighter.style}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Step 3, 4, 5, 6: Attack Name, Damage, Hits, Effect */}
            <div className="space-y-4 bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                  3. Nome do Ataque Desferido
                </label>
                <input
                  type="text"
                  value={giftForm.attackName}
                  onChange={(e) => setGiftForm({ ...giftForm, attackName: e.target.value })}
                  placeholder="Ex: Discurso Rápido / Investida"
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                    4. Dano (HP)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="600"
                    value={giftForm.damage}
                    onChange={(e) => setGiftForm({ ...giftForm, damage: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-amber-300 focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                    5. Número de Golpes (Hits)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={giftForm.hits}
                    onChange={(e) => setGiftForm({ ...giftForm, hits: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                  6. Tipo de Efeito Visual
                </label>
                <select
                  value={giftForm.effect}
                  onChange={(e) => setGiftForm({ ...giftForm, effect: e.target.value as HitEffectType })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="rose">🌹 Pétalas de Rosa (Clássico)</option>
                  <option value="fire">🔥 Chamas / Fogo Oratório</option>
                  <option value="lightning">⚡ Raio / Choque Eletrizante</option>
                  <option value="crowd">👥 Onda de Multidão / Comício</option>
                  <option value="parliament">🏛️ Livros / Regimento Parlamentar</option>
                  <option value="speed">💨 Rastreio de Alta Velocidade</option>
                  <option value="explosion">💥 Explosão de Decolagem</option>
                  <option value="shield">🛡️ Impacto Blindado / Defesa</option>
                  <option value="coffee">☕ Cafeína / Vigor Matinal</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saveSuccess ? <Check className="w-4 h-4 text-emerald-900" /> : <Save className="w-4 h-4" />}
                  <span>{saveSuccess ? 'CONFIGURAÇÃO SALVA COM SUCESSO!' : 'SALVAR REGRA DO PRESENTE'}</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: FIGHTER ATTRIBUTES (REQUIREMENT 20) */}
      {activeTab === 'stats' && (
        <div className="max-w-6xl w-full mx-auto bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black uppercase text-amber-400 tracking-widest block mb-1">
                REGRA 20: AJUSTE DE BALANCEAMENTO
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
                Editar Atributos de Combate
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-zinc-400">Escolher Lutador:</label>
              <select
                value={statFighterId}
                onChange={(e) => setStatFighterId(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-hidden focus:border-amber-400"
              >
                {fighters.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Visual preview */}
            <div className="bg-zinc-950/80 rounded-2xl p-6 border border-zinc-800 flex flex-col items-center justify-center">
              <FighterSprite fighter={statFighter} state="idle" size="lg" />
              <h3 className="text-2xl font-black uppercase mt-3">{statFighter.name}</h3>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                ESTILO: {statFighter.style}
              </span>
              <p className="text-xs text-zinc-400 italic mt-1 text-center max-w-sm">
                "{statFighter.tagline}"
              </p>
              
              {/* Delete Fighter Button */}
              {fighters.length > 2 && (
                <button
                  type="button"
                  onClick={() => deleteFighter(statFighter.id)}
                  className="mt-4 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Lutador</span>
                </button>
              )}
            </div>

            {/* Editable Stats Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <span className="flex items-center gap-1 text-emerald-400"><Heart className="w-3.5 h-3.5" /> Pontos de Vida (HP Máximo)</span>
                  <span className="font-mono text-white">{statFighter.stats.hp}</span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2000"
                  step="50"
                  value={statFighter.stats.hp}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateFighter(statFighter.id, {
                      stats: { ...statFighter.stats, hp: val, maxHp: val },
                    });
                  }}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <span className="flex items-center gap-1 text-rose-400"><Flame className="w-3.5 h-3.5" /> Poder de Ataque</span>
                  <span className="font-mono text-white">{statFighter.stats.attack}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="130"
                  step="5"
                  value={statFighter.stats.attack}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateFighter(statFighter.id, {
                      stats: { ...statFighter.stats, attack: val },
                    });
                  }}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <span className="flex items-center gap-1 text-blue-400"><Shield className="w-3.5 h-3.5" /> Resistência / Defesa</span>
                  <span className="font-mono text-white">{statFighter.stats.defense}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  value={statFighter.stats.defense}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateFighter(statFighter.id, {
                      stats: { ...statFighter.stats, defense: val },
                    });
                  }}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <span className="flex items-center gap-1 text-amber-400"><Zap className="w-3.5 h-3.5" /> Velocidade de Ação</span>
                  <span className="font-mono text-white">{statFighter.stats.speed}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  value={statFighter.stats.speed}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateFighter(statFighter.id, {
                      stats: { ...statFighter.stats, speed: val },
                    });
                  }}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Special Move Rename */}
              <div className="pt-2">
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Nome do Golpe Especial
                </label>
                <input
                  type="text"
                  value={statFighter.moves.special.name}
                  onChange={(e) => {
                    updateFighter(statFighter.id, {
                      moves: {
                        ...statFighter.moves,
                        special: {
                          ...statFighter.moves.special,
                          name: e.target.value,
                        },
                      },
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Frase de Vitória
                </label>
                <input
                  type="text"
                  value={statFighter.dialogues.victory}
                  onChange={(e) => {
                    updateFighter(statFighter.id, {
                      dialogues: {
                        ...statFighter.dialogues,
                        victory: e.target.value,
                      },
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CREATE NEW FIGHTER (REQUIREMENT 24) */}
      {activeTab === 'create' && (
        <div className="max-w-4xl w-full mx-auto bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800 shadow-xl">
          <div className="mb-6">
            <span className="text-xs font-black uppercase text-amber-400 tracking-widest block mb-1">
              REGRA 24: ADIÇÃO DE NOVOS LUTADORES
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
              Cadastrar Novo Candidato na Batalha
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Crie facilmente uma nova figura política caricatural com atributos, estilo e especial personalizados.
            </p>
          </div>

          <form onSubmit={handleCreateFighter} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                  Nome do Lutador
                </label>
                <input
                  type="text"
                  value={newFighterName}
                  onChange={(e) => setNewFighterName(e.target.value)}
                  placeholder="Ex: MARINA, TEBET, DORIA, BOULOS..."
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white font-bold focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                  Apelido de Campanha
                </label>
                <input
                  type="text"
                  value={newFighterNickname}
                  onChange={(e) => setNewFighterNickname(e.target.value)}
                  placeholder="Ex: A Voz da Amazônia"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-zinc-300 mb-1.5">
                Slogan / Tagline do Personagem
              </label>
              <input
                type="text"
                value={newFighterTagline}
                onChange={(e) => setNewFighterTagline(e.target.value)}
                placeholder="Ex: Sustentabilidade e propostas afiadas na arena!"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Estilo
                </label>
                <select
                  value={newFighterStyle}
                  onChange={(e) => setNewFighterStyle(e.target.value as FighterStyle)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-hidden focus:border-amber-400"
                >
                  <option value="ESTRATEGISTA">ESTRATEGISTA</option>
                  <option value="GUERREIRO">GUERREIRO</option>
                  <option value="LÍDER">LÍDER</option>
                  <option value="DEFENSOR">DEFENSOR</option>
                  <option value="FORÇA">FORÇA</option>
                  <option value="ATAQUE">ATAQUE</option>
                  <option value="DIPLOMATA">DIPLOMATA</option>
                  <option value="TÉCNICO">TÉCNICO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  HP Inicial
                </label>
                <input
                  type="number"
                  value={newFighterHp}
                  onChange={(e) => setNewFighterHp(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Ataque
                </label>
                <input
                  type="number"
                  value={newFighterAttack}
                  onChange={(e) => setNewFighterAttack(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Velocidade
                </label>
                <input
                  type="number"
                  value={newFighterSpeed}
                  onChange={(e) => setNewFighterSpeed(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Nome do Golpe Especial
                </label>
                <input
                  type="text"
                  value={newSpecialName}
                  onChange={(e) => setNewSpecialName(e.target.value)}
                  placeholder="Ex: PACTO PELA FLORESTA"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Grito do Golpe Especial
                </label>
                <input
                  type="text"
                  value={newSpecialQuote}
                  onChange={(e) => setNewSpecialQuote(e.target.value)}
                  placeholder="Ex: Pela preservação do futuro!"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Cor Primária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newFighterPrimaryColor}
                    onChange={(e) => setNewFighterPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono">{newFighterPrimaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-300 mb-1">
                  Cor Secundária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newFighterSecondaryColor}
                    onChange={(e) => setNewFighterSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono">{newFighterSecondaryColor}</span>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {createSuccess ? <Check className="w-5 h-5 text-zinc-950" /> : <PlusCircle className="w-5 h-5" />}
                <span>{createSuccess ? 'NOVO LUTADOR CADASTRADO COM SUCESSO!' : '+ SALVAR E INSERIR NO JOGO'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: BACKUP & DATA MANAGEMENT */}
      {activeTab === 'backup' && (
        <div className="max-w-3xl w-full mx-auto bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-black uppercase text-white">
              Gerenciamento de Dados & Restauração
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Exporte seus lutadores personalizados em formato JSON ou reverta todas as alterações para a configuração padrão original.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleExportJSON}
              className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all flex items-start gap-3 cursor-pointer"
            >
              <Download className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black uppercase text-white">Exportar JSON de Lutadores</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Baixe os dados completos de estatísticas e golpes para backup.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                if (confirm('Deseja restaurar o elenco original (Renan, Ciro, Lula, Flavio, Tarcísio, Bolsonaro)?')) {
                  resetToDefaults();
                  alert('Configurações padrão restauradas com sucesso!');
                }
              }}
              className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 hover:bg-rose-900/40 text-left transition-all flex items-start gap-3 cursor-pointer"
            >
              <RotateCcw className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black uppercase text-rose-300">Restaurar Padrões de Fábrica</h4>
                <p className="text-xs text-rose-200/70 mt-1">
                  Restaura o elenco e presentes para as especificações originais.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
