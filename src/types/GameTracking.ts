// Comprehensive game tracking and replay system
// Designed to support current features + future expansions (hyperloop, new programs)

export type ActionType = 'spawn' | 'move' | 'attack' | 'destroy_connection' | 'create_connection' | 'create_mine' | 'identify' | 'despawn' | 'capture_node' | 'end_turn' | 'freeze_decay'
// FUTURE: Hyperloop expansion actions
| 'enter_hyperloop' | 'exit_hyperloop' | 'hyperloop_move' | 'hyperloop_ambush';
export interface BaseAction {
  type: ActionType;
  timestamp: number;
  turnNumber: number;
  player: 'playerA' | 'playerB';
  programId?: string;
}
export interface SpawnAction extends BaseAction {
  type: 'spawn';
  programId: string;
  templateId: string;
  templateVersion: string;
  position: [number, number];
  energyCost: number;
}
export interface MoveAction extends BaseAction {
  type: 'move';
  programId: string;
  from: [number, number];
  to: [number, number];
  // FUTURE: Support hyperloop movement
  // fromLocation?: { type: 'node' | 'hyperloop'; position: [number, number] | { lane: string; index: number } }
  // toLocation?: { type: 'node' | 'hyperloop'; position: [number, number] | { lane: string; index: number } }
}
export interface AttackAction extends BaseAction {
  type: 'attack';
  programId: string;
  attackerId: string;
  defenderId: string;
  attackerDamage: number;
  defenderDamage: number;
  attackerDestroyed: boolean;
  defenderDestroyed: boolean;
  mineTriggered?: boolean;
}
export interface DestroyConnectionAction extends BaseAction {
  type: 'destroy_connection';
  programId: string;
  connection: {
    from: [number, number];
    to: [number, number];
  };
  programDespawned: boolean;
}
export interface CreateConnectionAction extends BaseAction {
  type: 'create_connection';
  programId: string;
  connection: {
    from: [number, number];
    to: [number, number];
  };
}
export interface CreateMineAction extends BaseAction {
  type: 'create_mine';
  programId: string;
  position: [number, number];
  mineDamage: number;
}
export interface IdentifyAction extends BaseAction {
  type: 'identify';
  programId: string;
  targetId: string;
  functionsRevealed: string[];
  programDespawned: boolean;
}
export interface DespawnAction extends BaseAction {
  type: 'despawn';
  programId: string;
  position: [number, number];
  energyRefunded: number;
}
export interface CaptureNodeAction extends BaseAction {
  type: 'capture_node';
  programId: string;
  position: [number, number];
  previousOwner: 'neutral' | 'playerA' | 'playerB';
  newOwner: 'playerA' | 'playerB';
}
export interface EndTurnAction extends BaseAction {
  type: 'end_turn';
  nextPlayer: 'playerA' | 'playerB';
}
export interface FreezeDecayAction extends BaseAction {
  type: 'freeze_decay';
  playerADecay: number;
  playerBDecay: number;
  playerAEnergy: number;
  playerBEnergy: number;
}

// FUTURE: Hyperloop expansion actions
// export interface EnterHyperloopAction extends BaseAction {
//   type: 'enter_hyperloop'
//   programId: string
//   fromNode: [number, number]
//   toLane: 'top' | 'right' | 'bottom' | 'left'
//   laneIndex: number
// }
//
// export interface ExitHyperloopAction extends BaseAction {
//   type: 'exit_hyperloop'
//   programId: string
//   fromLane: 'top' | 'right' | 'bottom' | 'left'
//   fromIndex: number
//   toNode: [number, number]
// }
//
// export interface HyperloopMoveAction extends BaseAction {
//   type: 'hyperloop_move'
//   programId: string
//   lane: 'top' | 'right' | 'bottom' | 'left'
//   fromIndex: number
//   toIndex: number
//   distance: number
// }
//
// export interface HyperloopAmbushAction extends BaseAction {
//   type: 'hyperloop_ambush'
//   programId: string
//   targetId: string
//   targetNode: [number, number]
//   exitedToNode: [number, number]
// }

export type GameAction = SpawnAction | MoveAction | AttackAction | DestroyConnectionAction | CreateConnectionAction | CreateMineAction | IdentifyAction | DespawnAction | CaptureNodeAction | EndTurnAction | FreezeDecayAction;
// FUTURE: Add hyperloop actions
// | EnterHyperloopAction
// | ExitHyperloopAction
// | HyperloopMoveAction
// | HyperloopAmbushAction

export interface GameSnapshot {
  turnNumber: number;
  timestamp: number;
  gridSize: number;
  phase: 'setup' | 'playing' | 'freeze' | 'gameOver';
  cpuAEnergy: number;
  cpuBEnergy: number;
  programCount: {
    playerA: number;
    playerB: number;
  };
  nodeOwnership: {
    playerA: number;
    playerB: number;
    neutral: number;
  };
  connectionCount: number;
  // FUTURE: Hyperloop state
  // hyperloopOccupancy?: {
  //   top: number
  //   right: number
  //   bottom: number
  //   left: number
  // }
}
export interface GameReplay {
  gameId: string;
  startTime: number;
  endTime?: number;
  initialGridSize: number;
  actions: GameAction[];
  snapshots: GameSnapshot[]; // Periodic snapshots for fast-forward
  winner?: 'playerA' | 'playerB' | 'draw';
  metadata: {
    version: string; // Game version for compatibility
    expansions: string[]; // e.g., ['hyperloop', 'new_programs']
  };
}

// Helper to create action records
export function createSpawnAction(turnNumber: number, player: 'playerA' | 'playerB', programId: string, templateId: string, templateVersion: string, position: [number, number], energyCost: number): SpawnAction {
  return {
    type: 'spawn',
    timestamp: Date.now(),
    turnNumber,
    player,
    programId,
    templateId,
    templateVersion,
    position,
    energyCost
  };
}
export function createMoveAction(turnNumber: number, player: 'playerA' | 'playerB', programId: string, from: [number, number], to: [number, number]): MoveAction {
  return {
    type: 'move',
    timestamp: Date.now(),
    turnNumber,
    player,
    programId,
    from,
    to
  };
}
export function createAttackAction(turnNumber: number, player: 'playerA' | 'playerB', attackerId: string, defenderId: string, attackerDamage: number, defenderDamage: number, attackerDestroyed: boolean, defenderDestroyed: boolean, mineTriggered?: boolean): AttackAction {
  return {
    type: 'attack',
    timestamp: Date.now(),
    turnNumber,
    player,
    programId: attackerId,
    attackerId,
    defenderId,
    attackerDamage,
    defenderDamage,
    attackerDestroyed,
    defenderDestroyed,
    mineTriggered
  };
}

// Helper to create game snapshot
export function createSnapshot(turnNumber: number, gridSize: number, phase: 'setup' | 'playing' | 'freeze' | 'gameOver', cpuAEnergy: number, cpuBEnergy: number, programCount: {
  playerA: number;
  playerB: number;
}, nodeOwnership: {
  playerA: number;
  playerB: number;
  neutral: number;
}, connectionCount: number): GameSnapshot {
  return {
    turnNumber,
    timestamp: Date.now(),
    gridSize,
    phase,
    cpuAEnergy,
    cpuBEnergy,
    programCount,
    nodeOwnership,
    connectionCount
  };
}

// Helper to initialize replay
export function createGameReplay(gameId: string, gridSize: number, expansions: string[] = []): GameReplay {
  return {
    gameId,
    startTime: Date.now(),
    initialGridSize: gridSize,
    actions: [],
    snapshots: [],
    metadata: {
      version: '1.0.0',
      expansions
    }
  };
}

// FUTURE: Hyperloop helper functions (commented for future use)
//
// export function createEnterHyperloopAction(
//   turnNumber: number,
//   player: 'playerA' | 'playerB',
//   programId: string,
//   fromNode: [number, number],
//   toLane: 'top' | 'right' | 'bottom' | 'left',
//   laneIndex: number,
// ): EnterHyperloopAction {
//   return {
//     type: 'enter_hyperloop',
//     timestamp: Date.now(),
//     turnNumber,
//     player,
//     programId,
//     fromNode,
//     toLane,
//     laneIndex,
//   }
// }
//
// export function createHyperloopMoveAction(
//   turnNumber: number,
//   player: 'playerA' | 'playerB',
//   programId: string,
//   lane: 'top' | 'right' | 'bottom' | 'left',
//   fromIndex: number,
//   toIndex: number,
//   distance: number,
// ): HyperloopMoveAction {
//   return {
//     type: 'hyperloop_move',
//     timestamp: Date.now(),
//     turnNumber,
//     player,
//     programId,
//     lane,
//     fromIndex,
//     toIndex,
//     distance,
//   }
// }