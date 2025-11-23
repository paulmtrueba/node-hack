import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Coordinate, coordToKey, Program } from '../types/GameTypes';
import { Cpu } from 'lucide-react';
export function GameBoard() {
  const {
    gameState,
    handleNodeClick,
    handleProgramClick,
    mode,
    connectionStart,
    destroyConnection
  } = useGame();
  const {
    gridSize,
    nodes,
    connections,
    selectedProgram
  } = gameState;
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const cellSize = 80;
  const gap = 36;
  const totalSize = gridSize * cellSize + (gridSize - 1) * gap;
  const getNodeColor = (owner: string) => {
    if (owner === 'playerA') return 'from-cyan-500 to-blue-600';
    if (owner === 'playerB') return 'from-red-500 to-orange-600';
    return 'from-gray-700 to-gray-800';
  };
  const getProgramIcon = (program: Program) => {
    const icons = {
      offensive: '⚔️',
      defensive: '🛡️',
      trace: '🦋'
    };
    return icons[program.type];
  };
  const isCPUNode = (row: number, col: number) => {
    return row === 0 && col === 0 || row === gridSize - 1 && col === gridSize - 1;
  };
  // Check if a node is highlighted for connection creation
  const isConnectionHighlighted = (position: Coordinate) => {
    if (mode !== 'create_connection' || !connectionStart) return false;
    return coordToKey(position) === coordToKey(connectionStart);
  };
  // Get all connections that can be destroyed from the selected program's position
  const getDestroyableConnections = () => {
    if (mode !== 'destroy_connection' || !selectedProgram) return [];
    const program = gameState.programs.get(selectedProgram);
    if (!program || program.type !== 'offensive') return [];
    const programPos = program.position;
    // Find all connections adjacent to the program's position
    return connections.filter(conn => {
      const adjacentToFrom = Math.abs(programPos[0] - conn.from[0]) + Math.abs(programPos[1] - conn.from[1]) === 1;
      const adjacentToTo = Math.abs(programPos[0] - conn.to[0]) + Math.abs(programPos[1] - conn.to[1]) === 1;
      return adjacentToFrom || adjacentToTo;
    });
  };
  // Get connections that would be destroyed if clicking a specific node
  const getConnectionsToNode = (nodePos: Coordinate) => {
    if (mode !== 'destroy_connection' || !selectedProgram) return [];
    const program = gameState.programs.get(selectedProgram);
    if (!program || program.type !== 'offensive') return [];
    const programPos = program.position;
    const destroyableConns = getDestroyableConnections();
    // Find connections that connect program's node to the target node
    return destroyableConns.filter(conn => {
      const connectsToProgramAndNode = coordToKey(conn.from) === coordToKey(programPos) && coordToKey(conn.to) === coordToKey(nodePos) || coordToKey(conn.to) === coordToKey(programPos) && coordToKey(conn.from) === coordToKey(nodePos);
      return connectsToProgramAndNode;
    });
  };
  // Check if a node is a valid destroy target
  const isNodeDestroyTarget = (position: Coordinate) => {
    return getConnectionsToNode(position).length > 0;
  };
  // Handle node click in destroy mode
  const handleNodeClickInDestroyMode = (position: Coordinate) => {
    if (mode !== 'destroy_connection' || !selectedProgram) return;
    const connectionsToDestroy = getConnectionsToNode(position);
    if (connectionsToDestroy.length > 0) {
      // Destroy the first connection (there should only be one direct connection)
      destroyConnection(selectedProgram, connectionsToDestroy[0]);
    }
  };
  const renderConnections = () => {
    const destroyableConns = getDestroyableConnections();
    const hoveredNodePos = hoveredNode ? keyToCoord(hoveredNode) : null;
    const hoveredConnections = hoveredNodePos ? getConnectionsToNode(hoveredNodePos) : [];
    return connections.map((conn, idx) => {
      const [fromRow, fromCol] = conn.from;
      const [toRow, toCol] = conn.to;
      const x1 = fromCol * (cellSize + gap) + cellSize / 2;
      const y1 = fromRow * (cellSize + gap) + cellSize / 2;
      const x2 = toCol * (cellSize + gap) + cellSize / 2;
      const y2 = toRow * (cellSize + gap) + cellSize / 2;
      const isDestroyable = destroyableConns.some(c => coordToKey(c.from) === coordToKey(conn.from) && coordToKey(c.to) === coordToKey(conn.to));
      const isHovered = hoveredConnections.some(c => coordToKey(c.from) === coordToKey(conn.from) && coordToKey(c.to) === coordToKey(conn.to));
      const isDestroyMode = mode === 'destroy_connection';
      // Determine connection color and style
      let strokeColor = '#00ff00'; // Default green
      let strokeWidth = 3;
      let opacity = 0.6;
      let glowColor = '#00ff00';
      if (isDestroyMode) {
        if (isDestroyable) {
          if (isHovered) {
            // Hovered destroyable connection - bright red with pulse
            strokeColor = '#ff0000';
            strokeWidth = 5;
            opacity = 1;
            glowColor = '#ff0000';
          } else {
            // Destroyable but not hovered - red
            strokeColor = '#ff3333';
            strokeWidth = 4;
            opacity = 0.8;
            glowColor = '#ff0000';
          }
        } else {
          // Not destroyable in destroy mode - dimmed
          opacity = 0.3;
        }
      }
      return <g key={idx}>
          {/* Visible connection line */}
          <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} initial={{
          pathLength: 0,
          opacity: 0
        }} animate={{
          pathLength: 1,
          opacity: opacity,
          strokeWidth: strokeWidth
        }} transition={{
          duration: 0.5,
          delay: idx * 0.01,
          strokeWidth: {
            duration: 0.2
          },
          opacity: {
            duration: 0.2
          }
        }} style={{
          filter: `drop-shadow(0 0 ${isHovered ? 12 : isDestroyable ? 8 : 4}px ${glowColor})`,
          pointerEvents: 'none'
        }} />

          {/* Pulsing glow effect on hover */}
          {isHovered && isDestroyable && <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth + 4} opacity={0.3} initial={{
          opacity: 0.3
        }} animate={{
          opacity: [0.3, 0.6, 0.3]
        }} transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut'
        }} style={{
          filter: 'blur(4px)',
          pointerEvents: 'none'
        }} />}
        </g>;
    });
  };
  // Helper to convert key back to coordinate
  const keyToCoord = (key: string): Coordinate => {
    const [row, col] = key.split(',').map(Number);
    return [row, col];
  };
  return <div className="flex items-center justify-center w-full">
      <div className="relative" style={{
      width: totalSize,
      height: totalSize
    }}>
        {/* Connection layer */}
        <svg className="absolute inset-0" style={{
        width: totalSize,
        height: totalSize
      }}>
          {renderConnections()}
        </svg>

        {/* Nodes grid */}
        <div className="grid relative" style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gap: `${gap}px`,
        width: totalSize,
        height: totalSize
      }}>
          {Array.from({
          length: gridSize * gridSize
        }).map((_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          const position: Coordinate = [row, col];
          const node = nodes.get(coordToKey(position));
          const program = node?.program;
          const isCPU = isCPUNode(row, col);
          const isHighlighted = isConnectionHighlighted(position);
          const isDestroyTarget = isNodeDestroyTarget(position);
          const nodeKey = coordToKey(position);
          const cpuLabel = row === 0 && col === 0 ? 'CPU A' : row === gridSize - 1 && col === gridSize - 1 ? 'CPU B' : '';
          return <motion.div key={nodeKey} initial={{
            scale: 0,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            delay: index * 0.02
          }} onMouseEnter={() => isDestroyTarget && setHoveredNode(nodeKey)} onMouseLeave={() => setHoveredNode(null)} onClick={() => {
            if (mode === 'destroy_connection' && isDestroyTarget) {
              handleNodeClickInDestroyMode(position);
            } else {
              handleNodeClick(position);
            }
          }} className={`
                  relative rounded-lg flex items-center justify-center
                  ${isCPU ? 'cursor-default' : isDestroyTarget ? 'cursor-pointer' : 'cursor-pointer'}
                  transition-all
                  bg-gradient-to-br ${getNodeColor(node?.owner || 'neutral')}
                  ${isCPU ? 'ring-4 ring-[#00ff00] shadow-[0_0_20px_#00ff00]' : 'ring-2 ring-[#00ff00] shadow-[0_0_10px_#00ff0040]'}
                  ${!isCPU && !isDestroyTarget && 'hover:ring-[#00ff00] hover:shadow-[0_0_15px_#00ff00] active:scale-95'}
                  ${isHighlighted && 'ring-4 ring-yellow-400 shadow-[0_0_20px_#ffff00]'}
                  ${isDestroyTarget && hoveredNode === nodeKey && 'ring-4 ring-red-500 shadow-[0_0_20px_#ff0000] scale-105'}
                  ${isDestroyTarget && hoveredNode !== nodeKey && 'ring-4 ring-red-400 shadow-[0_0_15px_#ff0000]'}
                `} style={{
            width: cellSize,
            height: cellSize
          }}>
                {isCPU && <>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-[#00ff00] 
                                bg-black/80 px-2 py-1 rounded border border-[#00ff00] whitespace-nowrap
                                shadow-[0_0_10px_#00ff00]">
                      {cpuLabel}
                    </div>

                    <motion.div initial={{
                scale: 0,
                rotate: -180
              }} animate={{
                scale: 1,
                rotate: 0
              }} transition={{
                delay: 0.3
              }} className="text-[#00ff00]" style={{
                filter: 'drop-shadow(0 0 8px #00ff00)'
              }}>
                      <Cpu size={40} strokeWidth={2} />
                    </motion.div>
                  </>}

                {program && !isCPU && <motion.div initial={{
              scale: 0,
              rotate: -180
            }} animate={{
              scale: 1,
              rotate: 0
            }} onClick={e => {
              e.stopPropagation();
              handleProgramClick(program.id);
            }} className={`
                      text-4xl cursor-pointer transition-transform 
                      hover:scale-110 active:scale-90
                      ${selectedProgram === program.id ? 'ring-4 ring-white rounded-full shadow-[0_0_20px_white]' : ''}
                    `} style={{
              filter: selectedProgram === program.id ? 'drop-shadow(0 0 8px white)' : 'none'
            }}>
                    {getProgramIcon(program)}
                  </motion.div>}

                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#00ff00] 
                            bg-black/60 px-1 rounded font-mono">
                  [{row},{col}]
                </div>

                {isHighlighted && <div className="absolute top-1 right-1 text-xs bg-yellow-400 text-black px-1 rounded font-mono font-bold">
                    START
                  </div>}

                {/* Destroy indicator on target nodes */}
                {isDestroyTarget && <motion.div initial={{
              opacity: 0,
              scale: 0
            }} animate={{
              opacity: 1,
              scale: 1
            }} className="absolute top-1 left-1">
                    <motion.div animate={hoveredNode === nodeKey ? {
                scale: [1, 1.2, 1]
              } : {}} transition={{
                duration: 0.5,
                repeat: hoveredNode === nodeKey ? Infinity : 0
              }} className={`
                        w-6 h-6 rounded-full flex items-center justify-center
                        ${hoveredNode === nodeKey ? 'bg-red-500' : 'bg-red-400'}
                        border-2 border-white
                        shadow-[0_0_8px_#ff0000]
                      `}>
                      <span className="text-white text-xs font-bold">✕</span>
                    </motion.div>
                  </motion.div>}
              </motion.div>;
        })}
        </div>
      </div>
    </div>;
}