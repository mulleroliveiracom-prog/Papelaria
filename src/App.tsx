import React from 'react';
import { useFighterStore } from './store/useFighterStore';
import { SelectionScreen } from './components/SelectionScreen';
import { BattlePresentation } from './components/BattlePresentation';
import { BattleArena } from './components/BattleArena';
import { AdminPanel } from './components/AdminPanel';

export function App() {
  const { screen } = useFighterStore();

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
}
export default App;
