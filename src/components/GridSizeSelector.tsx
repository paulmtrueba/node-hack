import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface GridSizeSelectorProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
  disabled?: boolean;
  show: boolean;
}
export function GridSizeSelector({
  currentSize,
  onSizeChange,
  disabled,
  show
}: GridSizeSelectorProps) {
  const sizes = [4, 5, 6, 7, 8];
  return <AnimatePresence>
      {show && <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: -20
    }} transition={{
      duration: 0.3
    }} className="bg-black/60 border-2 border-[#00ff00] rounded-lg p-4 shadow-[0_0_20px_#00ff0040]">
          <h3 className="text-sm font-bold text-[#00ff00] mb-3 font-mono">
            GRID SIZE
          </h3>
          <div className="flex gap-2">
            {sizes.map(size => <motion.button key={size} onClick={() => onSizeChange(size)} disabled={disabled} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className={`
                  w-12 h-12 rounded border-2 font-mono font-bold text-lg
                  transition-all disabled:opacity-30 disabled:cursor-not-allowed
                  ${currentSize === size ? 'bg-[#00ff00] text-black border-[#00ff00] shadow-[0_0_15px_#00ff00]' : 'bg-black/60 text-[#00ff00] border-[#00ff00] hover:bg-[#00ff00]/20'}
                `}>
                {size}
              </motion.button>)}
          </div>
          <p className="text-xs text-[#00ff00]/60 mt-2 font-mono">
            {currentSize}x{currentSize} NODES
          </p>
        </motion.div>}
    </AnimatePresence>;
}