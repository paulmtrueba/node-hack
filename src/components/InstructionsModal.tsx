import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function InstructionsModal({
  isOpen,
  onClose
}: InstructionsModalProps) {
  return <AnimatePresence>
      {isOpen && <>
          {/* Backdrop */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            {/* Modal */}
            <motion.div initial={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 0.95,
          y: 20
        }} transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1]
        }} onClick={e => e.stopPropagation()} className="w-full max-w-3xl max-h-[85vh]
                       bg-black/95 backdrop-blur-md
                       border-2 border-[#00ff00]
                       rounded-lg shadow-[0_0_40px_#00ff0060]
                       overflow-hidden z-[101]
                       flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#00ff00]/30 flex-shrink-0">
                <h2 className="text-xl md:text-2xl font-bold text-[#00ff00] font-mono">
                  INSTRUCTIONS
                </h2>
                <button onClick={onClose} className="p-2 text-[#00ff00] hover:bg-[#00ff00]/20 rounded-lg transition-colors" aria-label="Close instructions">
                  <X size={24} />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="space-y-6 text-[#00ff00]/90 font-mono">
                  {/* Add your instructions content here */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#00ff00]">
                      Getting Started
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Welcome to NODE HACK! This is a turn-based strategy game
                      where you compete against an AI opponent to control the
                      network grid and destroy the enemy CPU.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#00ff00]">
                      Objective
                    </h3>
                    <p className="text-sm leading-relaxed">
                      Destroy the enemy CPU (located at the bottom-right corner)
                      while protecting your own CPU (located at the top-left
                      corner).
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#00ff00]">
                      How to Play
                    </h3>
                    <ul className="text-sm space-y-2 list-disc list-inside">
                      <li>
                        Spawn programs on the grid by clicking the ADD button
                      </li>
                      <li>Select programs by clicking on them</li>
                      <li>Move programs to adjacent nodes</li>
                      <li>
                        Create connections between nodes to expand your network
                      </li>
                      <li>Attack enemy programs with offensive programs</li>
                      <li>End your turn when ready</li>
                    </ul>
                  </div>

                  {/* Placeholder for more content */}
                  <div className="h-px bg-[#00ff00]/30 my-6"></div>

                  <p className="text-xs text-[#00ff00]/60 italic">
                    More detailed instructions coming soon...
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-4 md:p-6 border-t border-[#00ff00]/30 flex-shrink-0">
                <button onClick={onClose} className="px-6 py-2 bg-[#00ff00] text-black hover:bg-[#00cc00] 
                           rounded-lg font-bold transition-colors font-mono text-sm
                           shadow-[0_0_20px_#00ff00]">
                  GOT IT
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>}
    </AnimatePresence>;
}