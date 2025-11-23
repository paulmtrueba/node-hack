import React from 'react';
import { useGame } from '../context/GameContext';
export function GameLog() {
  const {
    gameState
  } = useGame();
  return <div className="max-h-48 overflow-y-auto space-y-1">
      {gameState.gameLog.slice(-10).reverse().map((log, index) => <div key={index} className="text-xs text-[#00ff00]/80 font-mono bg-black/40 px-2 py-1 rounded">
            {log}
          </div>)}
    </div>;
}