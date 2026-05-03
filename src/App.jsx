import { useGameState } from './useGameState';
import AnimalSelect from './components/AnimalSelect';
import GameScreen from './components/GameScreen';

export default function App() {
  const gameState = useGameState();

  if (gameState.screen === 'select') {
    return <AnimalSelect onSelect={gameState.selectAnimal} />;
  }

  return <GameScreen {...gameState} onReset={gameState.resetGame} />;
}
