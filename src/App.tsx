import React from 'react';
import { GameProvider } from './context/GameContext';
import { GameBoard } from './components/GameBoard';
import { GridBackground } from './components/GridBackground';
import { SideMenu } from './components/SideMenu';
import { GameLog } from './components/GameLog';
import { GridSizeSelector } from './components/GridSizeSelector';
import { useGame } from './context/GameContext';
function GameContent() {
  const {
    gameState,
    endTurn,
    restartGame,
    isAIThinking,
    gridSize,
    setGridSize
  } = useGame();
  const disabled = gameState.currentPlayer !== 'playerA' || gameState.phase === 'gameOver';
  return <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <GridBackground />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left Column - Player Controls (Collapsible on mobile) */}
        <SideMenu />

        {/* Center Column - Game Board + Controls */}
        <div className="flex-1 flex flex-col items-center justify-start p-4 lg:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl space-y-6">
            {/* Grid Size Selector */}
            <GridSizeSelector currentSize={gridSize} onSizeChange={setGridSize} disabled={gameState.phase === 'gameOver'} show={gameState.turnNumber === 1 && gameState.currentPlayer === 'playerA'} />

            {/* Game Board */}
            <div className="flex items-center justify-center">
              <GameBoard />
            </div>

            {/* Game Controls - Below Board */}
            <div className="w-full max-w-2xl mx-auto space-y-4">
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={endTurn} disabled={disabled || isAIThinking} className="py-3 bg-[#00ff00] text-black hover:bg-[#00cc00] disabled:bg-gray-700 disabled:text-gray-500 disabled:opacity-50 
                           rounded-lg font-bold transition-colors font-mono shadow-[0_0_20px_#00ff00] disabled:shadow-none text-sm lg:text-base">
                  {isAIThinking ? 'AI_THINKING...' : 'END_TURN'}
                </button>
                <button onClick={() => restartGame()} className="py-3 bg-black border-2 border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00]/20 
                           rounded-lg font-bold transition-colors font-mono text-sm lg:text-base">
                  RESTART_GAME
                </button>
              </div>

              {/* Game Status */}
              {gameState.winner && <div className="p-4 bg-[#00ff00]/20 border-2 border-[#00ff00] rounded-lg text-center">
                  <p className="text-xl font-bold text-[#00ff00] font-mono">
                    {gameState.winner === 'playerA' ? 'VICTORY!' : gameState.winner === 'playerB' ? 'DEFEAT!' : 'DRAW!'}
                  </p>
                </div>}

              {/* Game Log */}
              <div className="bg-black/60 p-4 rounded-lg border-2 border-[#00ff00] shadow-[0_0_20px_#00ff0040]">
                <h3 className="text-sm font-bold text-[#00ff00] mb-2 font-mono">
                  SYSTEM_LOG
                </h3>
                <GameLog />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export function App() {
  return <GameProvider>
      <GameContent />
    </GameProvider>;
}