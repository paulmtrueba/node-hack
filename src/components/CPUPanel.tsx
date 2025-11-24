import React, { memo } from 'react';
import { useGame } from '../context/GameContext';
import { Cpu, Zap, HardDrive, Activity } from 'lucide-react';
import { CPU } from '../types/GameTypes';
interface CPUPanelProps {
  cpu: CPU;
  label: string;
  isOpponent?: boolean;
}
export function CPUPanel({
  cpu,
  label,
  isOpponent
}: CPUPanelProps) {
  const borderColor = isOpponent ? 'border-red-500' : 'border-[#00ff00]';
  const textColor = isOpponent ? 'text-red-500' : 'text-[#00ff00]';
  const shadowColor = isOpponent ? 'shadow-[0_0_20px_#ff000040]' : 'shadow-[0_0_20px_#00ff0040]';
  const getEnergyBarColor = () => {
    const percentage = cpu.energy / cpu.maxEnergy * 100;
    if (percentage > 60) return isOpponent ? 'bg-red-500' : 'bg-[#00ff00]';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-600';
  };
  return <div className={`bg-black/60 p-3 rounded-lg border-2 ${borderColor} ${shadowColor}`}>
      <h3 className={`text-sm font-bold ${textColor} mb-2 font-mono`}>
        {label}
      </h3>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className={`${textColor}/70`}>ENERGY</span>
            <span className={`font-bold ${textColor}`}>
              {cpu.energy}/{cpu.maxEnergy}
            </span>
          </div>
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-gray-700">
            <div className={`h-full ${getEnergyBarColor()} transition-all duration-300`} style={{
            width: `${cpu.energy / cpu.maxEnergy * 100}%`
          }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className={`${textColor}/70`}>AP:</span>
            <span className={`font-bold ${textColor}`}>
              {cpu.actionPoints}/{cpu.maxActionPoints}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`${textColor}/70`}>CPU:</span>
            <span className={`font-bold ${textColor}`}>
              {cpu.usedProcessor}/{cpu.processorSpeed}
            </span>
          </div>
        </div>
      </div>
    </div>;
}