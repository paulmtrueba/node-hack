import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sword, Shield, Link, Zap, Bomb, Search, Trash2 } from 'lucide-react';
interface ProgramInfoProps {
  onActionSelect?: () => void;
}
export function ProgramInfo({
  onActionSelect
}: ProgramInfoProps) {
  const {
    gameState,
    setMode,
    selectProgram,
    createMine,
    despawnProgram
  } = useGame();
  const program = gameState.selectedProgram ? gameState.programs.get(gameState.selectedProgram) || null : null;
  if (!program) {
    return <div className="bg-black/60 p-3 rounded-lg border-2 border-[#00ff00] shadow-[0_0_20px_#00ff0040]">
        <p className="text-[#00ff00]/60 text-xs font-mono">NO_PROGRAM</p>
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
  const node = Array.from(gameState.nodes.values()).find(n => n.program?.id === program.id);
  const isOnOwnedNode = node?.owner === program.owner;
  const energyRefund = isOnOwnedNode ? program.energy : 0;
  const handleDespawn = () => {
    const confirmMessage = energyRefund > 0 ? `Despawn? Refund ${energyRefund} energy.` : 'Despawn? No refund.';
    if (window.confirm(confirmMessage)) {
      despawnProgram(program.id);
      onActionSelect?.();
    }
  };
  const getPrimaryAction = () => {
    switch (program.type) {
      case 'offensive':
        return {
          name: 'ATTACK',
          icon: Sword,
          mode: 'attack' as const
        };
      case 'defensive':
        return {
          name: 'COUNTER',
          icon: Shield,
          mode: null
        };
      case 'trace':
        return {
          name: 'CONNECT',
          icon: Link,
          mode: 'create_connection' as const
        };
    }
  };
  const getSecondaryAction = () => {
    switch (program.type) {
      case 'offensive':
        return {
          name: 'DESTROY',
          icon: Zap,
          mode: 'destroy_connection' as const
        };
      case 'defensive':
        return {
          name: 'MINE',
          icon: Bomb,
          mode: null
        };
      case 'trace':
        return {
          name: 'IDENTIFY',
          icon: Search,
          mode: 'identify' as const
        };
    }
  };
  const primary = getPrimaryAction();
  const secondary = getSecondaryAction();
  const handlePrimaryAction = () => {
    if (primary.mode) {
      setMode(primary.mode);
      onActionSelect?.();
    }
  };
  const handleSecondaryAction = () => {
    if (program.type === 'defensive') {
      if (program.actionPoints >= 1) {
        createMine(program.id);
        onActionSelect?.();
      }
    } else if (secondary.mode) {
      setMode(secondary.mode);
      onActionSelect?.();
    }
  };
  const handleMove = () => {
    setMode('move');
    onActionSelect?.();
  };
  return <div className="bg-black/60 p-3 rounded-lg border-2 border-[#00ff00] shadow-[0_0_20px_#00ff0040]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getIcon(program.type)}</span>
          <div>
            <h3 className="text-sm font-bold text-[#00ff00] capitalize font-mono">
              {program.type}
            </h3>
            {program.version && <p className="text-[10px] text-[#00ff00]/60 font-mono">
                v{program.version}
              </p>}
          </div>
        </div>
        <button onClick={() => selectProgram(null)} className="text-[#00ff00] hover:text-white text-xs px-1 py-0.5 rounded hover:bg-[#00ff00]/20 transition-colors">
          ✕
        </button>
      </div>

      {program.mode === 'mine' && <div className="mb-2 p-2 bg-red-900/40 border border-red-500 rounded text-center">
          <p className="text-red-400 font-bold text-xs font-mono">
            ⚠️ MINE: {program.energy + program.defense}dmg
          </p>
        </div>}

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-2 font-mono">
        <div className="flex justify-between">
          <span className="text-[#00ff00]/70">EN:</span>
          <span className="font-bold text-[#00ff00]">{program.energy}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]/70">ATK:</span>
          <span className="font-bold text-[#00ff00]">{program.attack}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]/70">DEF:</span>
          <span className="font-bold text-[#00ff00]">{program.defense}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]/70">MOV:</span>
          <span className="font-bold text-[#00ff00]">{program.movement}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]/70">AP:</span>
          <span className="font-bold text-[#00ff00]">
            {program.actionPoints}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#00ff00]/70">POS:</span>
          <span className="font-bold text-[#00ff00]">
            [{program.position[0]},{program.position[1]}]
          </span>
        </div>
      </div>

      {program.functions.length > 0 && <div className="border-t border-[#00ff00]/30 pt-2 mb-2">
          <h4 className="text-[10px] font-bold text-[#00ff00] mb-1 font-mono">
            FUNCTIONS ({program.functions.length})
          </h4>
          <div className="space-y-1">
            {program.functions.map(func => <div key={func.id} className="text-[10px] text-[#00ff00]/80 font-mono bg-[#00ff00]/10 px-2 py-1 rounded">
                • {func.name}
              </div>)}
          </div>
        </div>}

      {program.mode !== 'mine' && <div className="space-y-1.5">
          <button onClick={handleMove} disabled={program.actionPoints < 1} className="w-full py-1.5 bg-[#00ff00]/20 hover:bg-[#00ff00]/30 disabled:bg-gray-700 disabled:opacity-30 
                     rounded font-bold text-[#00ff00] transition-colors border border-[#00ff00] font-mono text-xs">
            MOVE
          </button>

          <button onClick={handlePrimaryAction} disabled={program.actionPoints < 1 || program.type === 'defensive'} className="w-full py-1.5 bg-cyan-900/40 hover:bg-cyan-900/60 disabled:bg-gray-700 disabled:opacity-30 
                     rounded font-bold text-cyan-400 transition-colors border border-cyan-500 font-mono text-xs
                     flex items-center justify-center gap-1">
            <primary.icon size={12} />
            {primary.name}
          </button>

          <button onClick={handleSecondaryAction} disabled={program.actionPoints < 1} className="w-full py-1.5 bg-red-900/40 hover:bg-red-900/60 disabled:bg-gray-700 disabled:opacity-30 
                     rounded font-bold text-red-400 transition-colors border border-red-500 font-mono text-xs
                     flex items-center justify-center gap-1">
            <secondary.icon size={12} />
            {secondary.name}
          </button>
          <p className="text-[9px] text-red-400 text-center font-mono">
            ⚠️ DESPAWNS
          </p>

          <button onClick={handleDespawn} className="w-full py-1.5 bg-red-900/60 hover:bg-red-900/80 text-red-300 border border-red-500 
                     rounded font-bold transition-colors font-mono text-xs flex items-center justify-center gap-1">
            <Trash2 size={12} />
            DESPAWN
          </button>
          <p className="text-[9px] text-center font-mono">
            {energyRefund > 0 ? <span className="text-green-400">+{energyRefund} EN</span> : <span className="text-red-400">NO REFUND</span>}
          </p>
        </div>}
    </div>;
}