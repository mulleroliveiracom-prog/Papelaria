import React from 'react';
import { useFighterStore } from './store/useFighterStore';
import { SelectionScreen } from './components/SelectionScreen';
import { BattlePresentation } from './components/BattlePresentation';
import { BattleArena } from './components/BattleArena';
import { AdminPanel } from './components/AdminPanel';
import { Smartphone, Monitor } from 'lucide-react';

export function App() {
  const { screen, screenMode, toggleScreenMode } = useFighterStore();
  const isFightScreen = screen === 'battle' || screen === 'announcement' || screen === 'countdown';

  const renderScreen = () => {
    switch (screen) {
      case 'admin':
        return <AdminPanel />;
      case 'announcement':
      case 'countdown':
        return <BattlePresentation />;
      case 'battle':
        return <BattleArena />;
      case 'selection':
      default:
        return <SelectionScreen />;
    }
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* SELETOR DE MODO (visível apenas fora da batalha em telas maiores para alternar entre Android e Tela Cheia) */}
      {!isFightScreen && (
        <div className="hidden md:flex absolute top-2 right-3 z-50 items-center gap-1 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-full p-1 shadow-lg">
          <button
            onClick={toggleScreenMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              screenMode === 'mobile'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Tamanho ideal para celular Android"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Celular Android</span>
          </button>

          <button
            onClick={toggleScreenMode}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              screenMode === 'fullscreen'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Modo Tela Cheia"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>🖥️ Tela Cheia</span>
          </button>
        </div>
      )}

      {/* CONTÊINER DO JOGO: HORIZONTAL / LANDSCAPE 16:9 AUTOMÁTICO DURANTE A LUTA */}
      <div
        className={`w-full h-full flex flex-col transition-all duration-300 overflow-hidden ${
          isFightScreen
            ? 'w-full h-full max-w-[1920px] max-h-[1080px] mx-auto aspect-[16/9] shadow-2xl relative bg-zinc-950'
            : screenMode === 'mobile'
            ? 'md:max-w-[430px] md:max-h-[920px] md:h-[96vh] md:rounded-[40px] md:border-[8px] md:border-zinc-800 md:shadow-[0_0_50px_rgba(0,0,0,0.8)] md:relative'
            : 'max-w-none'
        }`}
      >
        {/* Notch sutil simulado apenas no modo celular fora da batalha */}
        {screenMode === 'mobile' && !isFightScreen && (
          <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-900 rounded-full z-50 pointer-events-none" />
        )}

        {/* Conteúdo da Tela Atual */}
        <div className="w-full h-full flex flex-col flex-1 overflow-hidden">
          {renderScreen()}
        </div>
      </div>

    </div>
  );
}

export default App;
