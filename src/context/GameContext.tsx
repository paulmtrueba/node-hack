import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { GameState, Coordinate, ProgramType, ProgramTemplate, coordToKey } from '../types/GameTypes';
import { createInitialGameState, spawnProgramFromTemplate, canSpawnProgramFromTemplate, moveProgram as moveProgramLogic, attackProgram as attackProgramLogic, endTurn as endTurnLogic, canMoveProgram, getAdjacentPositions, destroyConnection as destroyConnectionLogic, createMine, createConnection, identifyFunctions, despawnProgram as despawnProgramLogic } from '../game/GameLogic';
import { AIPlayer } from '../game/AIPlayer';
type GameMode = 'spawn' | 'move' | 'attack' | 'idle' | 'destroy_connection' | 'create_connection' | 'identify' | 'despawn';
interface GameContextType {
  gameState: GameState;
  mode: GameMode;
  spawnTemplate: ProgramTemplate | null;
  isAIThinking: boolean;
  gridSize: number;
  connectionStart: Coordinate | null;
  // Actions
  setMode: (mode: GameMode) => void;
  setSpawnTemplate: (template: ProgramTemplate | null) => void;
  selectProgram: (programId: string | null) => void;
  selectEnemyProgram: (programId: string | null) => void;
  spawnProgram: (template: ProgramTemplate, position: Coordinate) => void;
  moveProgram: (programId: string, to: Coordinate) => void;
  attackProgram: (attackerId: string, defenderId: string) => void;
  destroyConnection: (programId: string, connection: {
    from: Coordinate;
    to: Coordinate;
  }) => void;
  createMine: (programId: string) => void;
  createConnection: (programId: string, from: Coordinate, to: Coordinate) => void;
  identifyFunctions: (programId: string, targetId: string) => void;
  despawnProgram: (programId: string) => void;
  createProgramTemplate: (template: Omit<ProgramTemplate, 'id' | 'owner' | 'createdAt'>) => void;
  updateProgramTemplate: (id: string, template: Omit<ProgramTemplate, 'id' | 'owner' | 'createdAt'>) => void;
  endTurn: () => void;
  restartGame: (newGridSize?: number) => void;
  handleNodeClick: (position: Coordinate) => void;
  handleProgramClick: (programId: string) => void;
  setGridSize: (size: number) => void;
}
const GameContext = createContext<GameContextType | undefined>(undefined);
export function GameProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [gridSize, setGridSizeState] = useState(5);
  const [gameState, setGameState] = useState<GameState>(createInitialGameState(gridSize));
  const [mode, setMode] = useState<GameMode>('idle');
  const [spawnTemplate, setSpawnTemplate] = useState<ProgramTemplate | null>(null);
  const [connectionStart, setConnectionStart] = useState<Coordinate | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const aiPlayer = useRef(new AIPlayer('playerB'));
  const processingAI = useRef(false);
  // AI turn handling - Fixed logic
  useEffect(() => {
    // Check if it's AI's turn and we're not already processing
    const shouldAIMove = gameState.currentPlayer === 'playerB' && gameState.phase === 'playing' && gameState.winner === null && !processingAI.current;
    if (shouldAIMove) {
      processingAI.current = true;
      setIsAIThinking(true);
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        try {
          const newState = aiPlayer.current.makeMove(gameState);
          setGameState(newState);
          processingAI.current = false;
          setIsAIThinking(false);
        } catch (error) {
          console.error('❌ AI MOVE FAILED:', error);
          processingAI.current = false;
          setIsAIThinking(false);
        }
      }, 800);
    }
  }, [gameState.currentPlayer, gameState.turnNumber, gameState.phase, gameState.winner]);
  const selectProgram = (programId: string | null) => {
    setGameState({
      ...gameState,
      selectedProgram: programId,
      selectedEnemyProgram: null
    });
  };
  const selectEnemyProgram = (programId: string | null) => {
    setGameState({
      ...gameState,
      selectedEnemyProgram: programId,
      selectedProgram: null
    });
  };
  const spawnProgram = (template: ProgramTemplate, position: Coordinate) => {
    const check = canSpawnProgramFromTemplate(gameState, template, position, 'playerA');
    if (check.canSpawn) {
      const newState = spawnProgramFromTemplate(gameState, template, position, 'playerA');
      setGameState(newState);
      setMode('idle');
      setSpawnTemplate(null);
    } else {
      alert(check.reason);
    }
  };
  const moveProgram = (programId: string, to: Coordinate) => {
    const check = canMoveProgram(gameState, programId, to);
    if (check.canMove) {
      const newState = moveProgramLogic(gameState, programId, to);
      setGameState({
        ...newState,
        selectedProgram: null
      });
      setMode('idle');
    } else {
      alert(check.reason);
    }
  };
  const attackProgram = (attackerId: string, defenderId: string) => {
    const newState = attackProgramLogic(gameState, attackerId, defenderId);
    setGameState({
      ...newState,
      selectedProgram: null
    });
    setMode('idle');
  };
  const destroyConnectionAction = (programId: string, connection: {
    from: Coordinate;
    to: Coordinate;
  }) => {
    const newState = destroyConnectionLogic(gameState, programId, connection);
    setGameState({
      ...newState,
      selectedProgram: null
    });
    setMode('idle');
  };
  const createMineAction = (programId: string) => {
    const newState = createMine(gameState, programId);
    setGameState({
      ...newState,
      selectedProgram: null
    });
    setMode('idle');
  };
  const createConnectionAction = (programId: string, from: Coordinate, to: Coordinate) => {
    const newState = createConnection(gameState, programId, from, to);
    setGameState(newState);
    setMode('idle');
    setConnectionStart(null);
  };
  const identifyFunctionsAction = (programId: string, targetId: string) => {
    const newState = identifyFunctions(gameState, programId, targetId);
    setGameState({
      ...newState,
      selectedProgram: null
    });
    setMode('idle');
  };
  const despawnProgramAction = (programId: string) => {
    const newState = despawnProgramLogic(gameState, programId);
    setGameState({
      ...newState,
      selectedProgram: null
    });
    setMode('idle');
  };
  const createProgramTemplate = (template: Omit<ProgramTemplate, 'id' | 'owner' | 'createdAt'>) => {
    const newTemplate: ProgramTemplate = {
      ...template,
      id: `playerA-${template.type}-${Date.now()}`,
      owner: 'playerA',
      createdAt: Date.now()
    };
    const newState = {
      ...gameState
    };
    newState.programTemplates = [...newState.programTemplates, newTemplate];
    newState.gameLog = [...gameState.gameLog, `Created program template: ${newTemplate.name} v${newTemplate.version}`];
    setGameState(newState);
  };
  const updateProgramTemplate = (id: string, template: Omit<ProgramTemplate, 'id' | 'owner' | 'createdAt'>) => {
    const newTemplate: ProgramTemplate = {
      ...template,
      id: `playerA-${template.type}-${Date.now()}`,
      owner: 'playerA',
      createdAt: Date.now()
    };
    const newState = {
      ...gameState
    };
    newState.programTemplates = [...newState.programTemplates, newTemplate];
    newState.gameLog = [...gameState.gameLog, `Created program version: ${newTemplate.name} v${newTemplate.version}`];
    setGameState(newState);
  };
  const endTurn = () => {
    const newState = endTurnLogic(gameState);
    setGameState({
      ...newState,
      selectedProgram: null
    });
    setMode('idle');
    setConnectionStart(null);
  };
  const restartGame = (newGridSize?: number) => {
    const size = newGridSize ?? gridSize;
    setGridSizeState(size);
    setGameState(createInitialGameState(size));
    setMode('idle');
    setSpawnTemplate(null);
    setConnectionStart(null);
    setIsAIThinking(false);
    processingAI.current = false;
  };
  const setGridSize = (size: number) => {
    setGridSizeState(size);
    restartGame(size);
  };
  const handleNodeClick = (position: Coordinate) => {
    if (gameState.currentPlayer !== 'playerA') return;
    if (gameState.phase === 'gameOver') return;
    if (mode === 'spawn' && spawnTemplate) {
      spawnProgram(spawnTemplate, position);
    } else if (mode === 'move' && gameState.selectedProgram) {
      moveProgram(gameState.selectedProgram, position);
    } else if (mode === 'attack' && gameState.selectedProgram) {
      const node = gameState.nodes.get(coordToKey(position));
      if (node?.program && node.program.owner !== 'playerA') {
        const attacker = gameState.programs.get(gameState.selectedProgram);
        if (attacker) {
          const adjacent = getAdjacentPositions(attacker.position, gameState.gridSize);
          const isAdjacent = adjacent.some(pos => coordToKey(pos) === coordToKey(position));
          if (isAdjacent) {
            attackProgram(gameState.selectedProgram, node.program.id);
          } else {
            alert('Target must be adjacent');
          }
        }
      }
    } else if (mode === 'create_connection' && gameState.selectedProgram) {
      const program = gameState.programs.get(gameState.selectedProgram);
      if (!program || program.type !== 'trace') return;
      if (!connectionStart) {
        // First click - set start position
        setConnectionStart(position);
      } else {
        // Second click - create connection
        createConnectionAction(gameState.selectedProgram, connectionStart, position);
      }
    }
  };
  const handleProgramClick = (programId: string) => {
    const program = gameState.programs.get(programId);
    if (!program) return;
    // If it's your program, select it for actions
    if (program.owner === 'playerA') {
      selectProgram(programId);
      setMode('idle');
      setConnectionStart(null);
    }
    // If it's enemy program and you're in attack mode, attack it
    else if (mode === 'attack' && gameState.selectedProgram) {
      const attacker = gameState.programs.get(gameState.selectedProgram);
      if (attacker) {
        const adjacent = getAdjacentPositions(attacker.position, gameState.gridSize);
        const isAdjacent = adjacent.some(pos => coordToKey(pos) === coordToKey(program.position));
        if (isAdjacent) {
          attackProgram(gameState.selectedProgram, programId);
        } else {
          alert('Target must be adjacent');
        }
      }
    }
    // If it's enemy program and you're in identify mode, identify it
    else if (mode === 'identify' && gameState.selectedProgram) {
      const identifier = gameState.programs.get(gameState.selectedProgram);
      if (identifier && identifier.type === 'trace') {
        identifyFunctionsAction(gameState.selectedProgram, programId);
      }
    }
    // Otherwise, just view enemy program info
    else if (program.owner !== 'playerA') {
      selectEnemyProgram(programId);
    }
  };
  const value: GameContextType = {
    gameState,
    mode,
    spawnTemplate,
    isAIThinking,
    gridSize,
    connectionStart,
    setMode,
    setSpawnTemplate,
    selectProgram,
    selectEnemyProgram,
    spawnProgram,
    moveProgram,
    attackProgram,
    destroyConnection: destroyConnectionAction,
    createMine: createMineAction,
    createConnection: createConnectionAction,
    identifyFunctions: identifyFunctionsAction,
    despawnProgram: despawnProgramAction,
    endTurn,
    restartGame,
    handleNodeClick,
    handleProgramClick,
    setGridSize,
    createProgramTemplate,
    updateProgramTemplate
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}