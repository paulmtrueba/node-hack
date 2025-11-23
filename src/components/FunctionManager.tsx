import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameFunction, AVAILABLE_FUNCTIONS, Program } from '../types/GameTypes';
import { X, Plus, Zap } from 'lucide-react';
interface FunctionManagerProps {
  program: Program;
  onAddFunction: (programId: string, functionId: string) => void;
  onClose: () => void;
}
export function FunctionManager({
  program,
  onAddFunction,
  onClose
}: FunctionManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'generic' | 'attack' | 'defense' | 'trace'>('all');
  const availableFunctions = AVAILABLE_FUNCTIONS.filter(func => {
    if (selectedCategory === 'all') return true;
    return func.category === selectedCategory;
  });
  const canAddFunction = program.functions.length < program.maxFunctions;
  const handleAddFunction = (func: GameFunction) => {
    if (canAddFunction) {
      onAddFunction(program.id, func.id);
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} exit={{
      scale: 0.9,
      opacity: 0
    }} onClick={e => e.stopPropagation()} className="bg-black border-4 border-[#00ff00] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_0_40px_#00ff00]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#00ff00] font-mono">
            FUNCTION_LIBRARY
          </h2>
          <button onClick={onClose} className="text-[#00ff00] hover:text-white p-2 hover:bg-[#00ff00]/20 rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-[#00ff00]/10 border border-[#00ff00] rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-mono text-[#00ff00]">
              PROGRAM: {program.type.toUpperCase()} (LVL {program.level})
            </span>
            <span className="text-sm font-mono text-[#00ff00]">
              SLOTS: {program.functions.length} / {program.maxFunctions}
            </span>
          </div>
          {!canAddFunction && <p className="text-xs text-red-400 font-mono">
              ⚠️ FUNCTION SLOTS FULL - LEVEL UP TO ADD MORE
            </p>}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'generic', 'attack', 'defense', 'trace'].map(cat => <button key={cat} onClick={() => setSelectedCategory(cat as any)} className={`px-3 py-1 rounded font-mono text-sm transition-all ${selectedCategory === cat ? 'bg-[#00ff00] text-black shadow-[0_0_10px_#00ff00]' : 'bg-black/60 text-[#00ff00] border border-[#00ff00] hover:bg-[#00ff00]/20'}`}>
              {cat.toUpperCase()}
            </button>)}
        </div>

        {/* Function List */}
        <div className="space-y-2">
          {availableFunctions.map(func => {
          const alreadyHas = program.functions.some(f => f.id === func.id);
          return <motion.div key={func.id} initial={{
            opacity: 0,
            x: -20
          }} animate={{
            opacity: 1,
            x: 0
          }} className={`p-3 rounded border-2 transition-all ${alreadyHas ? 'bg-[#00ff00]/20 border-[#00ff00] opacity-50' : 'bg-black/60 border-[#00ff00] hover:bg-[#00ff00]/10'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={16} className="text-[#00ff00]" />
                      <h3 className="font-bold text-[#00ff00] font-mono">
                        {func.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 bg-[#00ff00]/20 text-[#00ff00] rounded font-mono">
                        {func.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-[#00ff00]/80 font-mono mb-2">
                      {func.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-[#00ff00]/60">
                        COST:{' '}
                        <span className="text-[#00ff00]">
                          {func.energyCost} ENERGY
                        </span>
                      </span>
                      {func.effect.type === 'stat_boost' && <span className="text-[#00ff00]/60">
                          EFFECT:{' '}
                          <span className="text-[#00ff00]">
                            {func.effect.stat?.toUpperCase()} +
                            {func.effect.value}
                          </span>
                        </span>}
                    </div>
                  </div>
                  <button onClick={() => handleAddFunction(func)} disabled={!canAddFunction || alreadyHas} className="ml-3 p-2 bg-[#00ff00] text-black hover:bg-[#00cc00] disabled:bg-gray-700 disabled:text-gray-500 disabled:opacity-50 rounded transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </motion.div>;
        })}
        </div>
      </motion.div>
    </motion.div>;
}