import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { GameBoard } from './components/GameBoard';
import { ProgramInfo } from './components/ProgramInfo';
import { CPUPanel } from './components/CPUPanel';
import { GameLog } from './components/GameLog';
import { ProgramSpawner } from './components/ProgramSpawner';
import { GridBackground } from './components/GridBackground';
import { EnemyProgramInfo } from './components/EnemyProgramInfo';
import { InstructionsModal } from './components/InstructionsModal';
import { Menu, X, HelpCircle } from 'lucide-react';
function GameContent() {
  const {
    gameState,
    endTurn,
    restartGame,
    isAIThinking
  } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const disabled = gameState.currentPlayer !== 'playerA' || gameState.phase === 'gameOver';
  const handleActionSelect = () => {
    if (isMobile) {
      setMenuOpen(false);
    }
  };
  return <>
      <GridBackground />
      <div className="min-h-screen text-white font-mono relative overflow-hidden">
        {/* Mobile Fixed Header */}
        {isMobile && <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b-2 border-[#00ff00]/30">
            <div className="flex items-center justify-between px-4 py-3">
              {/* Game Info */}
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-[#00ff00]">NODE HACK</h1>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#00ff00]/60">TURN:</span>
                  <span className="font-bold text-[#00ff00]">
                    {gameState.turnNumber}
                  </span>
                </div>
                {gameState.phase === 'freeze' && <div className="px-2 py-0.5 bg-red-900/60 border border-red-500 rounded">
                    <span className="text-red-400 text-[10px] font-bold">
                      FREEZE
                    </span>
                  </div>}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2">
                {/* Instructions Button */}
                <button onClick={() => setInstructionsOpen(true)} className="p-2 bg-black/90 border-2 border-[#00ff00] rounded-lg 
                           text-[#00ff00] hover:bg-[#00ff00]/20 transition-colors shadow-[0_0_20px_#00ff0040]" aria-label="Instructions">
                  <HelpCircle size={20} />
                </button>

                {/* Hamburger Menu Button */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 bg-black/90 border-2 border-[#00ff00] rounded-lg 
                           text-[#00ff00] hover:bg-[#00ff00]/20 transition-colors shadow-[0_0_20px_#00ff0040]" aria-label="Toggle menu">
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>}

        {/* Desktop Header */}
        {!isMobile && <div className="fixed top-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-sm border-b border-[#00ff00]/30">
            <div className="max-w-[1800px] mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#00ff00] tracking-wider">
                  NODE HACK
                </h1>
                <div className="flex items-center gap-6">
                  {/* Game Info */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00ff00]/60">TURN:</span>
                      <span className="font-bold text-[#00ff00]">
                        {gameState.turnNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00ff00]/60">PHASE:</span>
                      <span className="font-bold text-[#00ff00] uppercase">
                        {gameState.phase === 'freeze' ? 'FREEZE' : 'ACTIVE'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00ff00]/60">PLAYER:</span>
                      <span className="font-bold text-[#00ff00]">
                        {gameState.currentPlayer === 'playerA' ? 'A' : 'B'}
                      </span>
                    </div>
                  </div>

                  {/* Instructions Button */}
                  <button onClick={() => setInstructionsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black/90 border-2 border-[#00ff00] 
                             text-[#00ff00] hover:bg-[#00ff00]/20 rounded-lg font-bold transition-colors 
                             shadow-[0_0_20px_#00ff0040] text-sm">
                    <HelpCircle size={18} />
                    INSTRUCTIONS
                  </button>
                </div>
              </div>
            </div>
          </div>}

        {/* Instructions Modal */}
        <InstructionsModal isOpen={instructionsOpen} onClose={() => setInstructionsOpen(false)} />

        {/* Mobile Slide-out Menu */}
        {isMobile && <div className={`
              fixed inset-y-0 right-0 z-40 w-[85vw] max-w-[400px]
              bg-black/95 backdrop-blur-sm border-l-2 border-[#00ff00]/30
              transform transition-transform duration-300 ease-out
              ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
              overflow-y-auto
            `}>
            <div className="p-4 space-y-4 mt-16">
              {/* Header */}
              <div className="pb-3 border-b border-[#00ff00]/30">
                <h2 className="text-lg font-bold text-[#00ff00]">CONTROLS</h2>
              </div>

              {/* Spawn Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#00ff00] uppercase tracking-wider">
                  Spawn Programs
                </h3>
                <ProgramSpawner onSelect={handleActionSelect} />
              </div>

              {/* Selected Program Section */}
              <div className="space-y-2 pt-3 border-t border-[#00ff00]/30">
                <h3 className="text-sm font-bold text-[#00ff00] uppercase tracking-wider">
                  Selected Program
                </h3>
                <ProgramInfo onActionSelect={handleActionSelect} />
              </div>

              {/* Enemy Program Section */}
              <div className="space-y-2 pt-3 border-t border-[#00ff00]/30">
                <h3 className="text-sm font-bold text-[#00ff00] uppercase tracking-wider">
                  Enemy Program
                </h3>
                <EnemyProgramInfo />
              </div>

              {/* Game Log Section */}
              <div className="space-y-2 pt-3 border-t border-[#00ff00]/30">
                <h3 className="text-sm font-bold text-[#00ff00] uppercase tracking-wider">
                  Game Log
                </h3>
                <div className="max-h-[200px]">
                  <GameLog />
                </div>
              </div>
            </div>
          </div>}

        {/* Backdrop for mobile menu */}
        {isMobile && menuOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />}

        {/* Main Layout - Optimized for no scrolling */}
        <div className={`${isMobile ? 'pt-20' : 'pt-20'} pb-2 px-2 md:px-6 h-screen flex flex-col`}>
          <div className="max-w-[1800px] mx-auto flex-1 flex flex-col overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-3 md:gap-6 flex-1 overflow-hidden">
              {/* Desktop Left Sidebar - Scrollable only if needed */}
              {!isMobile && <div className="space-y-3 md:space-y-4 overflow-y-auto pr-2">
                  {/* Player A CPU */}
                  <CPUPanel cpu={gameState.cpuA} label="PLAYER_A" />

                  {/* Spawn Section */}
                  <div className="bg-black/60 p-3 rounded-lg border-2 border-[#00ff00]/30">
                    <h3 className="text-sm font-bold text-[#00ff00] mb-2 uppercase tracking-wider">
                      Spawn Programs
                    </h3>
                    <ProgramSpawner onSelect={handleActionSelect} />
                  </div>

                  {/* Selected Program */}
                  <ProgramInfo onActionSelect={handleActionSelect} />

                  {/* Enemy Program */}
                  <EnemyProgramInfo />

                  {/* Player B CPU */}
                  <CPUPanel cpu={gameState.cpuB} label="PLAYER_B" isOpponent />

                  {/* Game Log */}
                  <div className="max-h-[300px]">
                    <GameLog />
                  </div>
                </div>}

              {/* Game Area - No scrolling, fits viewport */}
              <div className="flex flex-col items-center justify-center space-y-3 overflow-hidden">
                {/* CPU Panels - Mobile Only */}
                {isMobile && <div className="w-full grid grid-cols-2 gap-2 max-w-2xl flex-shrink-0">
                    <CPUPanel cpu={gameState.cpuA} label="PLAYER_A" />
                    <CPUPanel cpu={gameState.cpuB} label="PLAYER_B" isOpponent />
                  </div>}

                {/* Game Board - Dynamically sized to fit viewport */}
                <div className="w-full flex items-center justify-center flex-1 min-h-0">
                  <GameBoard />
                </div>

                {/* Game Controls - Compact */}
                <div className="w-full max-w-2xl space-y-2 flex-shrink-0">
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={endTurn} disabled={disabled || isAIThinking} className="py-2 bg-[#00ff00] text-black hover:bg-[#00cc00] disabled:bg-gray-700 disabled:text-gray-500 disabled:opacity-50 
                               rounded-lg font-bold transition-colors font-mono shadow-[0_0_20px_#00ff00] disabled:shadow-none text-sm">
                      {isAIThinking ? 'AI_THINKING...' : 'END_TURN'}
                    </button>
                    <button onClick={() => restartGame()} className="py-2 bg-black border-2 border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00]/20 
                               rounded-lg font-bold transition-colors font-mono text-sm">
                      RESTART
                    </button>
                  </div>

                  {/* Game Status */}
                  {gameState.winner && <div className="p-3 bg-[#00ff00]/20 border-2 border-[#00ff00] rounded-lg text-center">
                      <p className="text-lg font-bold text-[#00ff00] font-mono">
                        {gameState.winner === 'playerA' ? 'VICTORY!' : gameState.winner === 'playerB' ? 'DEFEAT!' : 'DRAW!'}
                      </p>
                    </div>}

                  {/* Freeze Mode Warning */}
                  {gameState.phase === 'freeze' && <div className="p-2 bg-red-900/40 border-2 border-red-500 rounded-lg text-center">
                      <p className="text-red-400 font-bold text-xs font-mono">
                        ⚠️ FREEZE MODE - RECONNECT NETWORK!
                      </p>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>;
}
export function App() {
  return <GameProvider>
      <GameContent />
    </GameProvider>;
}