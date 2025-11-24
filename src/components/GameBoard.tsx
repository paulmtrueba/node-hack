import React, { useEffect, useState } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [availableHeight, setAvailableHeight] = useState(0);
  const [availableWidth, setAvailableWidth] = useState(0);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const updateAvailableDimensions = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const isMobileView = viewportWidth < 768;
      // Calculate available height
      if (isMobileView) {
        // Mobile: header (64px) + CPU panels (~120px) + controls (~150px) + padding
        const reservedSpace = 64 + 120 + 150 + 80;
        setAvailableHeight(Math.max(viewportHeight - reservedSpace, 300));
      } else {
        // Desktop: header (72px) + controls (~150px) + padding
        const reservedSpace = 72 + 150 + 120;
        setAvailableHeight(Math.max(viewportHeight - reservedSpace, 400));
      }
      // Calculate available width
      if (isMobileView) {
        // Mobile: use most of viewport width with padding, accounting for borders
        setAvailableWidth(Math.max(viewportWidth - 32, 300));
      } else {
        // Desktop: calculate based on sidebar width (320px + gap + padding)
        const reservedWidth = 320 + 48 + 48; // sidebar + gap + padding
        setAvailableWidth(Math.max(viewportWidth - reservedWidth - 32, 400));
      }
    };
    checkMobile();
    updateAvailableDimensions();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', updateAvailableDimensions);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', updateAvailableDimensions);
    };
  }, []);
  // Calculate responsive cell sizing based on available dimensions
  const calculateCellSize = () => {
    if (availableHeight === 0 || availableWidth === 0) {
      return {
        cellSize: 80,
        gap: 36
      };
    }
    const gapRatio = 0.45; // Gap is 45% of cell size
    const borderBuffer = 16; // Extra space for node borders (ring-2 = 2px * 2 sides + some breathing room)
    // Calculate based on height
    const cellSizeFromHeight = availableHeight / (gridSize + gapRatio * (gridSize - 1));
    // Calculate based on width (accounting for border buffer)
    const cellSizeFromWidth = (availableWidth - borderBuffer) / (gridSize + gapRatio * (gridSize - 1));
    // Use the smaller of the two to ensure it fits both dimensions
    const cellSize = Math.min(cellSizeFromHeight, cellSizeFromWidth);
    const gap = cellSize * gapRatio;
    // Set reasonable min/max bounds
    const boundedCellSize = Math.max(40, Math.min(cellSize, isMobile ? 80 : 100));
    const boundedGap = boundedCellSize * gapRatio;
    return {
      cellSize: Math.floor(boundedCellSize),
      gap: Math.floor(boundedGap)
    };
  };
  const {
    cellSize,
    gap
  } = calculateCellSize();
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
  const isConnectionHighlighted = (position: Coordinate) => {
    if (mode !== 'create_connection' || !connectionStart) return false;
    return coordToKey(position) === coordToKey(connectionStart);
  };
  const getDestroyableConnections = () => {
    if (mode !== 'destroy_connection' || !selectedProgram) return [];
    const program = gameState.programs.get(selectedProgram);
    if (!program || program.type !== 'offensive') return [];
    const programPos = program.position;
    return connections.filter(conn => {
      const adjacentToFrom = Math.abs(programPos[0] - conn.from[0]) + Math.abs(programPos[1] - conn.from[1]) === 1;
      const adjacentToTo = Math.abs(programPos[0] - conn.to[0]) + Math.abs(programPos[1] - conn.to[1]) === 1;
      return adjacentToFrom || adjacentToTo;
    });
  };
  const getConnectionsToNode = (nodePos: Coordinate) => {
    if (mode !== 'destroy_connection' || !selectedProgram) return [];
    const program = gameState.programs.get(selectedProgram);
    if (!program || program.type !== 'offensive') return [];
    const programPos = program.position;
    const destroyableConns = getDestroyableConnections();
    return destroyableConns.filter(conn => {
      const connectsToProgramAndNode = coordToKey(conn.from) === coordToKey(programPos) && coordToKey(conn.to) === coordToKey(nodePos) || coordToKey(conn.to) === coordToKey(programPos) && coordToKey(conn.from) === coordToKey(nodePos);
      return connectsToProgramAndNode;
    });
  };
  const isNodeDestroyTarget = (position: Coordinate) => {
    return getConnectionsToNode(position).length > 0;
  };
  const handleNodeClickInDestroyMode = (position: Coordinate) => {
    if (mode !== 'destroy_connection' || !selectedProgram) return;
    const connectionsToDestroy = getConnectionsToNode(position);
    if (connectionsToDestroy.length > 0) {
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
      // Responsive stroke width
      const baseStrokeWidth = Math.max(2, Math.floor(cellSize / 30));
      let strokeColor = '#00ff00';
      let strokeWidth = baseStrokeWidth;
      let opacity = 0.6;
      let glowColor = '#00ff00';
      if (isDestroyMode) {
        if (isDestroyable) {
          if (isHovered) {
            strokeColor = '#ff0000';
            strokeWidth = baseStrokeWidth + 2;
            opacity = 1;
            glowColor = '#ff0000';
          } else {
            strokeColor = '#ff3333';
            strokeWidth = baseStrokeWidth + 1;
            opacity = 0.8;
            glowColor = '#ff0000';
          }
        } else {
          opacity = 0.3;
        }
      }
      return <g key={idx}>
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
          filter: `drop-shadow(0 0 ${isHovered ? 8 : isDestroyable ? 6 : 4}px ${glowColor})`,
          pointerEvents: 'none'
        }} />

          {isHovered && isDestroyable && !isMobile && <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth + 3} opacity={0.3} initial={{
          opacity: 0.3
        }} animate={{
          opacity: [0.3, 0.6, 0.3]
        }} transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut'
        }} style={{
          filter: 'blur(3px)',
          pointerEvents: 'none'
        }} />}
        </g>;
    });
  };
  const keyToCoord = (key: string): Coordinate => {
    const [row, col] = key.split(',').map(Number);
    return [row, col];
  };
  // Responsive icon and text sizes
  const cpuIconSize = Math.max(20, Math.floor(cellSize / 3));
  const programIconSize = Math.max(24, Math.floor(cellSize / 2.5));
  const badgeSize = Math.max(20, Math.floor(cellSize / 4));
  const fontSize = Math.max(8, Math.floor(cellSize / 10));
  return <div className="flex items-center justify-center w-full px-2">
      <div className="relative" style={{
      width: totalSize,
      height: totalSize
    }}>
        <svg className="absolute inset-0" style={{
        width: totalSize,
        height: totalSize
      }}>
          {renderConnections()}
        </svg>

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
          }} onMouseEnter={() => !isMobile && isDestroyTarget && setHoveredNode(nodeKey)} onMouseLeave={() => setHoveredNode(null)} onTouchStart={() => isDestroyTarget && setHoveredNode(nodeKey)} onTouchEnd={() => setHoveredNode(null)} onClick={() => {
            if (mode === 'destroy_connection' && isDestroyTarget) {
              handleNodeClickInDestroyMode(position);
            } else {
              handleNodeClick(position);
            }
          }} className={`
                  relative rounded-lg flex items-center justify-center
                  cursor-pointer transition-all
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
                    <div className="absolute left-1/2 -translate-x-1/2 font-bold text-[#00ff00] 
                                bg-black/80 px-2 py-1 rounded border border-[#00ff00] whitespace-nowrap
                                shadow-[0_0_10px_#00ff00]" style={{
                top: `-${Math.floor(cellSize / 3)}px`,
                fontSize: `${fontSize}px`
              }}>
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
                      <Cpu size={cpuIconSize} strokeWidth={2} />
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
                      cursor-pointer transition-transform 
                      hover:scale-110 active:scale-90
                      ${selectedProgram === program.id ? 'ring-4 ring-white rounded-full shadow-[0_0_20px_white]' : ''}
                    `} style={{
              fontSize: `${programIconSize}px`,
              filter: selectedProgram === program.id ? 'drop-shadow(0 0 8px white)' : 'none'
            }}>
                    {getProgramIcon(program)}
                  </motion.div>}

                <div className="absolute left-1/2 -translate-x-1/2 text-[#00ff00] 
                            bg-black/60 px-1 rounded font-mono" style={{
              bottom: `-${Math.floor(cellSize / 4)}px`,
              fontSize: `${Math.max(7, fontSize - 2)}px`
            }}>
                  [{row},{col}]
                </div>

                {isHighlighted && <div className="absolute top-1 right-1 bg-yellow-400 text-black px-1 rounded font-mono font-bold" style={{
              fontSize: `${Math.max(8, fontSize)}px`
            }}>
                    START
                  </div>}

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
                        rounded-full flex items-center justify-center
                        ${hoveredNode === nodeKey ? 'bg-red-500' : 'bg-red-400'}
                        border-2 border-white
                        shadow-[0_0_8px_#ff0000]
                      `} style={{
                width: `${badgeSize}px`,
                height: `${badgeSize}px`,
                fontSize: `${Math.max(10, fontSize)}px`
              }}>
                      <span className="text-white font-bold">✕</span>
                    </motion.div>
                  </motion.div>}
              </motion.div>;
        })}
        </div>
      </div>
    </div>;
}