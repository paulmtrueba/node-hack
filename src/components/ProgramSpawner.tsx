import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { ProgramTemplate } from '../types/GameTypes';
import { Plus, Zap } from 'lucide-react';
import { ProgramTemplateCreator } from './ProgramTemplateCreator';
interface ProgramSpawnerProps {
  onSelect?: () => void;
}
export function ProgramSpawner({
  onSelect
}: ProgramSpawnerProps) {
  const {
    gameState,
    setMode,
    setSpawnTemplate,
    selectProgram,
    createProgramTemplate,
    updateProgramTemplate
  } = useGame();
  const [showCreator, setShowCreator] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProgramTemplate | undefined>();
  const disabled = gameState.currentPlayer !== 'playerA' || gameState.phase === 'gameOver';
  const playerTemplates = gameState.programTemplates.filter(t => t.owner === 'playerA');
  const getIcon = (type: string) => {
    const icons = {
      offensive: '⚔️',
      defensive: '🛡️',
      trace: '🦋'
    };
    return icons[type as keyof typeof icons];
  };
  const handleSpawn = (template: ProgramTemplate) => {
    setSpawnTemplate(template);
    setMode('spawn');
    selectProgram(null);
    onSelect?.(); // Close mobile menu
  };
  const handleCreateNew = () => {
    setEditingTemplate(undefined);
    setShowCreator(true);
  };
  const handleVersionTemplate = (template: ProgramTemplate) => {
    setEditingTemplate(template);
    setShowCreator(true);
  };
  const handleSaveTemplate = (template: Omit<ProgramTemplate, 'id' | 'owner' | 'createdAt'>) => {
    if (editingTemplate) {
      updateProgramTemplate(editingTemplate.id, template);
    } else {
      createProgramTemplate(template);
    }
    setShowCreator(false);
    setEditingTemplate(undefined);
  };
  const getModifiedStats = (template: ProgramTemplate) => {
    let stats = {
      ...template.baseStats
    };
    template.functions.forEach(func => {
      if (func.effect.type === 'stat_boost' && func.effect.stat && func.effect.value) {
        stats[func.effect.stat] += func.effect.value;
      }
    });
    return stats;
  };
  return <>
      <div className="bg-black/60 p-3 rounded-lg border-2 border-[#00ff00] shadow-[0_0_20px_#00ff0040]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-[#00ff00] font-mono">SPAWN</h3>
          <button onClick={handleCreateNew} disabled={disabled} className="flex items-center gap-1 px-2 py-1 bg-[#00ff00] text-black hover:bg-[#00cc00] disabled:bg-gray-700 disabled:text-gray-500 disabled:opacity-50 rounded font-bold text-xs transition-colors font-mono">
            <Plus size={12} />
            ADD
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {playerTemplates.map(template => {
          const stats = getModifiedStats(template);
          return <motion.div key={template.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className="relative group">
                <button onClick={() => handleSpawn(template)} disabled={disabled} className="w-full p-2 bg-black/60 hover:bg-[#00ff00]/10 disabled:bg-gray-900 disabled:opacity-50 
                           rounded border border-[#00ff00] text-left transition-all">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{getIcon(template.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#00ff00] font-mono truncate mb-1">
                        {template.name}
                      </div>

                      <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                        <div className="text-[#00ff00]/60">
                          E:{stats.energy}
                        </div>
                        <div className="text-[#00ff00]/60">
                          A:{stats.attack}
                        </div>
                        <div className="text-[#00ff00]/60">
                          D:{stats.defense}
                        </div>
                        <div className="text-[#00ff00]/60">
                          M:{stats.movement}
                        </div>
                      </div>

                      {template.functions.length > 0 && <div className="flex items-center gap-1 mt-1">
                          <Zap size={10} className="text-[#00ff00]/60" />
                          <span className="text-[10px] text-[#00ff00]/60 font-mono">
                            {template.functions.length}fn
                          </span>
                        </div>}
                    </div>
                  </div>
                </button>

                <button onClick={() => handleVersionTemplate(template)} disabled={disabled} className="absolute top-1 right-1 px-1.5 py-0.5 bg-purple-900/60 hover:bg-purple-900/80 text-purple-300 rounded text-[10px] font-mono transition-colors opacity-0 group-hover:opacity-100">
                  VER
                </button>
              </motion.div>;
        })}
        </div>
      </div>

      <AnimatePresence>
        {showCreator && <ProgramTemplateCreator baseTemplate={editingTemplate} existingTemplates={gameState.programTemplates} onSave={handleSaveTemplate} onClose={() => {
        setShowCreator(false);
        setEditingTemplate(undefined);
      }} />}
      </AnimatePresence>
    </>;
}