import React from 'react';
import { useGame } from '../context/GameContext';
import { Eye, EyeOff } from 'lucide-react';
export function EnemyProgramInfo() {
  const {
    gameState,
    selectEnemyProgram
  } = useGame();
  const enemyProgram = gameState.selectedEnemyProgram ? gameState.programs.get(gameState.selectedEnemyProgram) || null : null;
  if (!enemyProgram) {
    return <div className="bg-black/60 p-4 rounded-lg border-2 border-red-500 shadow-[0_0_20px_#ff000040]">
        <p className="text-red-500/60 text-sm font-mono">NO_ENEMY_SELECTED</p>
      </div>;
  }
  const getIcon = (type: string) => {
    const icons = {
      offensive: '⚔️',
      defensive: '🛡️',
      trace: '🦋'
    };
    return icons[type as keyof typeof icons];
  };
  // Check if this program has been identified by the current player
  const isIdentified = enemyProgram.identifiedBy.includes('playerA');
  return <div className="bg-black/60 p-4 rounded-lg border-2 border-red-500 shadow-[0_0_20px_#ff000040]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{getIcon(enemyProgram.type)}</span>
          <div>
            <h3 className="text-lg font-bold text-red-500 capitalize font-mono">
              {enemyProgram.type}
            </h3>
            <p className="text-xs text-red-500/60 font-mono">
              {enemyProgram.owner}
            </p>
          </div>
        </div>
        <button onClick={() => selectEnemyProgram(null)} className="text-red-500 hover:text-white text-sm px-2 py-1 rounded hover:bg-red-500/20 transition-colors">
          ✕
        </button>
      </div>

      {enemyProgram.mode === 'mine' && <div className="mb-3 p-2 bg-red-900/40 border border-red-500 rounded text-center">
          <p className="text-red-400 font-bold text-sm font-mono">
            ⚠️ MINE MODE ⚠️
          </p>
          <p className="text-xs text-red-300 font-mono">
            Damage:{' '}
            {isIdentified ? `${enemyProgram.energy + enemyProgram.defense}` : '???'}
          </p>
        </div>}

      {/* Identification Status */}
      <div className="mb-3 p-2 bg-red-900/20 border border-red-500/50 rounded flex items-center gap-2">
        {isIdentified ? <>
            <Eye size={16} className="text-green-400" />
            <span className="text-xs text-green-400 font-mono">IDENTIFIED</span>
          </> : <>
            <EyeOff size={16} className="text-red-500/60" />
            <span className="text-xs text-red-500/60 font-mono">
              UNIDENTIFIED
            </span>
          </>}
      </div>

      <div className="space-y-2 text-sm mb-4 font-mono">
        <div className="flex justify-between">
          <span className="text-red-500/70">ENERGY:</span>
          <span className="font-bold text-red-500">
            {isIdentified ? enemyProgram.energy : '???'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-500/70">ATTACK:</span>
          <span className="font-bold text-red-500">
            {isIdentified ? enemyProgram.attack : '???'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-500/70">DEFENSE:</span>
          <span className="font-bold text-red-500">
            {isIdentified ? enemyProgram.defense : '???'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-500/70">MOVEMENT:</span>
          <span className="font-bold text-red-500">
            {isIdentified ? enemyProgram.movement : '???'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-red-500/70">POSITION:</span>
          <span className="font-bold text-red-500">
            [{enemyProgram.position[0]}, {enemyProgram.position[1]}]
          </span>
        </div>
        {isIdentified && enemyProgram.version && <div className="flex justify-between">
            <span className="text-red-500/70">VERSION:</span>
            <span className="font-bold text-red-500">
              {enemyProgram.version}
            </span>
          </div>}
      </div>

      {isIdentified && enemyProgram.functions.length > 0 && <div className="border-t border-red-500/30 pt-3">
          <h4 className="text-xs font-bold text-red-500 mb-2 font-mono">
            FUNCTIONS:
          </h4>
          <div className="space-y-1">
            {enemyProgram.functions.map(func => <div key={func.id} className="text-xs text-red-500/80 font-mono bg-red-500/10 p-2 rounded">
                • {func.name}
              </div>)}
          </div>
        </div>}

      {!isIdentified && <div className="border-t border-red-500/30 pt-3">
          <p className="text-xs text-red-500/60 font-mono text-center italic">
            Use a Trace program's IDENTIFY action to reveal this program's
            details
          </p>
        </div>}
    </div>;
}