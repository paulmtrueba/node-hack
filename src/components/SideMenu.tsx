import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { CPUPanel } from './CPUPanel';
import { ProgramSpawner } from './ProgramSpawner';
import { ProgramInfo } from './ProgramInfo';
import { EnemyProgramInfo } from './EnemyProgramInfo';
import { Menu, X } from 'lucide-react';
export function SideMenu() {
  const {
    gameState
  } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  // Auto-close menu after selecting a spawn template or action
  const handleClose = () => {
    setIsOpen(false);
  };
  return <>
      {/* Mobile Menu Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#00ff00] text-black hover:bg-[#00cc00] rounded-lg 
                   border-2 border-[#00ff00] transition-colors shadow-[0_0_20px_#00ff00]" aria-label="Toggle menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:block w-96 bg-black/80 border-r-4 border-[#00ff00] p-6 overflow-y-auto space-y-6 shadow-[0_0_40px_#00ff0020]">
        <CPUPanel cpu={gameState.cpuA} label="YOUR_CPU" />
        <ProgramSpawner onSelect={handleClose} />
        <ProgramInfo onActionSelect={handleClose} />
        <EnemyProgramInfo />
      </div>

      {/* Mobile Sliding Menu */}
      <AnimatePresence>
        {isOpen && <>
            {/* Backdrop */}
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} onClick={handleClose} className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

            {/* Sliding Panel */}
            <motion.div initial={{
          x: '-100%'
        }} animate={{
          x: 0
        }} exit={{
          x: '-100%'
        }} transition={{
          type: 'spring',
          damping: 25,
          stiffness: 200
        }} className="lg:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-black/95 
                       border-r-4 border-[#00ff00] z-40 overflow-y-auto shadow-[0_0_40px_#00ff0040]">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#00ff00] font-mono">
                    CONTROLS
                  </h2>
                  <button onClick={handleClose} className="p-2 text-[#00ff00] hover:bg-[#00ff00]/20 rounded transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <CPUPanel cpu={gameState.cpuA} label="YOUR_CPU" />
                <ProgramSpawner onSelect={handleClose} />
                <ProgramInfo onActionSelect={handleClose} />
                <EnemyProgramInfo />
              </div>
            </motion.div>
          </>}
      </AnimatePresence>
    </>;
}