// Core type definitions for Node Hack

export type Coordinate = [number, number];
export type NodeOwner = 'neutral' | 'playerA' | 'playerB';
export type ProgramType = 'offensive' | 'defensive' | 'trace';
export type ProgramMode = 'normal' | 'mine';

// FUTURE: Hyperloop expansion types (commented for future use)
// export type ProgramLocation =
//   | { type: 'node'; position: Coordinate }
//   | { type: 'hyperloop'; lane: 'top' | 'right' | 'bottom' | 'left'; index: number }
//
// export interface HyperloopState {
//   enabled: boolean;
//   lanes: {
//     top: (Program | null)[];
//     right: (Program | null)[];
//     bottom: (Program | null)[];
//     left: (Program | null)[];
//   };
// }

export interface GameFunction {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  category: 'generic' | 'attack' | 'defense' | 'trace';
  effect: FunctionEffect;
}
export interface FunctionEffect {
  type: 'stat_boost' | 'stat_penalty' | 'special_ability' | 'energy_transfer' | 'action_point';
  stat?: 'attack' | 'defense' | 'movement' | 'energy';
  value?: number;
  ability?: string;
  targetStat?: 'attack' | 'defense'; // For dual-stat effects
  penaltyValue?: number;
}
export interface ProgramTemplate {
  id: string;
  name: string;
  type: ProgramType;
  version: string; // Semantic versioning: major.minor.patch
  baseStats: {
    energy: number;
    attack: number;
    defense: number;
    movement: number;
  };
  functions: GameFunction[];
  owner: 'playerA' | 'playerB';
  createdAt: number;
}
export interface ProgramStats {
  type: ProgramType;
  energy: number;
  attack: number;
  defense: number;
  movement: number;
  level: number;
  processorCost: number;
}
export interface Program extends ProgramStats {
  id: string;
  owner: 'playerA' | 'playerB';
  position: Coordinate;
  actionPoints: number;
  hasMovedThisTurn: boolean;
  turnsOnNode: number;
  mode: ProgramMode;
  functions: GameFunction[];
  maxFunctions: number;
  templateId?: string; // Reference to template used
  version?: string; // Version from template
  identifiedBy: ('playerA' | 'playerB')[]; // Which players have identified this program

  // FUTURE: Hyperloop expansion (commented for future use)
  // location: ProgramLocation; // Replaces position for hyperloop-capable programs
  // canUseHyperloop?: boolean; // Specialty programs only
}
export interface Node {
  position: Coordinate;
  owner: NodeOwner;
  program: Program | null;
}
export interface Connection {
  from: Coordinate;
  to: Coordinate;
}

// FUTURE: Map-based connections for 8x8+ grids (PERFORMANCE OPTIMIZATION)
// Uncomment and migrate when implementing larger grids
//
// export type ConnectionMap = Map<string, Set<string>>;
//
// To migrate from Connection[] to ConnectionMap:
//
// 1. Change GameState.connections type:
//    connections: ConnectionMap
//
// 2. Update createInitialGameState() in GameLogic.ts:
//    const connections = new Map<string, Set<string>>();
//    // Instead of: connections.push({ from, to })
//    // Use: addConnectionToMap(connections, from, to)
//
// 3. Replace connection checks:
//    // Old: connections.some(conn => ...)
//    // New: areConnectedMap(connections, from, to)
//
// 4. For rendering, convert to array:
//    const connectionArray = getConnectionArray(connections);
//
// Helper functions:
//
// export function addConnectionToMap(
//   map: ConnectionMap,
//   from: Coordinate,
//   to: Coordinate
// ): void {
//   const fromKey = coordToKey(from);
//   const toKey = coordToKey(to);
//   if (!map.has(fromKey)) map.set(fromKey, new Set());
//   if (!map.has(toKey)) map.set(toKey, new Set());
//   map.get(fromKey)!.add(toKey);
//   map.get(toKey)!.add(fromKey);
// }
//
// export function areConnectedMap(
//   map: ConnectionMap,
//   from: Coordinate,
//   to: Coordinate
// ): boolean {
//   return map.get(coordToKey(from))?.has(coordToKey(to)) ?? false;
// }
//
// export function removeConnectionFromMap(
//   map: ConnectionMap,
//   from: Coordinate,
//   to: Coordinate
// ): void {
//   const fromKey = coordToKey(from);
//   const toKey = coordToKey(to);
//   map.get(fromKey)?.delete(toKey);
//   map.get(toKey)?.delete(fromKey);
// }
//
// export function getConnectionArray(map: ConnectionMap): Connection[] {
//   const result: Connection[] = [];
//   const seen = new Set<string>();
//   map.forEach((neighbors, fromKey) => {
//     const from = keyToCoord(fromKey);
//     neighbors.forEach(toKey => {
//       const pairKey = [fromKey, toKey].sort().join('->');
//       if (!seen.has(pairKey)) {
//         seen.add(pairKey);
//         result.push({ from, to: keyToCoord(toKey) });
//       }
//     });
//   });
//   return result;
// }
//
// Performance: O(1) connection checks vs O(n) with array
// Trade-off: Slightly more memory, more complex iteration
// Recommended for: 8x8+ grids with 100+ connections

export interface CPU {
  owner: 'playerA' | 'playerB';
  energy: number;
  maxEnergy: number;
  processorSpeed: number;
  usedProcessor: number;
  memory: number;
  actionPoints: number;
  maxActionPoints: number;
}
export interface GameState {
  gridSize: number;
  nodes: Map<string, Node>;
  connections: Connection[];
  programs: Map<string, Program>;
  programTemplates: ProgramTemplate[]; // Player's custom templates
  cpuA: CPU;
  cpuB: CPU;
  currentPlayer: 'playerA' | 'playerB';
  phase: 'setup' | 'playing' | 'freeze' | 'gameOver';
  turnNumber: number;
  freezeTurnCount: number;
  selectedProgram: string | null;
  selectedEnemyProgram: string | null; // For viewing enemy program info
  gameLog: string[];
  winner: 'playerA' | 'playerB' | 'draw' | null;

  // FUTURE: Hyperloop expansion (commented for future use)
  // hyperloop?: HyperloopState;
}
export const PROGRAM_BASE_STATS: Record<ProgramType, Omit<ProgramStats, 'level' | 'processorCost'>> = {
  offensive: {
    type: 'offensive',
    energy: 4,
    attack: 3,
    defense: 1,
    movement: 1
  },
  defensive: {
    type: 'defensive',
    energy: 4,
    attack: 1,
    defense: 3,
    movement: 1
  },
  trace: {
    type: 'trace',
    energy: 3,
    attack: 2,
    defense: 1,
    movement: 2
  }
  // FUTURE: Expansion program types (add as needed)
  // interceptor: { type: 'interceptor', energy: 2, attack: 2, defense: 1, movement: 3 },
  // sentinel: { type: 'sentinel', energy: 5, attack: 2, defense: 4, movement: 0 },
  // scout: { type: 'scout', energy: 2, attack: 1, defense: 1, movement: 3 },
  // carrier: { type: 'carrier', energy: 6, attack: 1, defense: 2, movement: 1 },
};

// Available functions library - v1.1 Canonical List
export const AVAILABLE_FUNCTIONS: GameFunction[] = [
// Generic Functions
{
  id: 'attack_plus_1',
  name: 'Attack +1',
  description: 'Increase attack by 1',
  energyCost: 1,
  category: 'generic',
  effect: {
    type: 'stat_boost',
    stat: 'attack',
    value: 1
  }
}, {
  id: 'defense_plus_1',
  name: 'Defense +1',
  description: 'Increase defense by 1',
  energyCost: 1,
  category: 'generic',
  effect: {
    type: 'stat_boost',
    stat: 'defense',
    value: 1
  }
}, {
  id: 'movement_plus_1',
  name: 'Movement +1',
  description: 'Increase movement by 1',
  energyCost: 1,
  category: 'generic',
  effect: {
    type: 'stat_boost',
    stat: 'movement',
    value: 1
  }
}, {
  id: 'energy_plus_1',
  name: 'Energy +1',
  description: 'Increase energy by 1 (immediate top-up)',
  energyCost: 0,
  category: 'generic',
  effect: {
    type: 'stat_boost',
    stat: 'energy',
    value: 1
  }
}, {
  id: 'energy_transfer_adjacent',
  name: 'Energy +1 to Adjacent Friendly',
  description: 'Transfer 1 energy to adjacent friendly program',
  energyCost: 1,
  category: 'generic',
  effect: {
    type: 'energy_transfer',
    value: 1
  }
},
// Attack Functions
{
  id: 'attack_plus_2',
  name: 'Attack +2',
  description: 'Increase attack by 2',
  energyCost: 1,
  category: 'attack',
  effect: {
    type: 'stat_boost',
    stat: 'attack',
    value: 2
  }
}, {
  id: 'attack_plus_1_defense_dmg_minus_1',
  name: 'Attack +1 Defense Dmg -1',
  description: 'Increase attack by 1, reduce defense damage taken by 1',
  energyCost: 1,
  category: 'attack',
  effect: {
    type: 'stat_boost',
    stat: 'attack',
    value: 1,
    targetStat: 'defense',
    penaltyValue: -1
  }
}, {
  id: 'destroy_2_connections',
  name: 'Destroy 2 Connections',
  description: 'Destroy 2 connections before despawn (secondary action)',
  energyCost: 1,
  category: 'attack',
  effect: {
    type: 'special_ability',
    ability: 'destroy_2_connections'
  }
}, {
  id: 'action_point_plus_1',
  name: '+1 Action Point',
  description: 'Gain 1 additional action point',
  energyCost: 1,
  category: 'attack',
  effect: {
    type: 'action_point',
    value: 1
  }
},
// Defense Functions
{
  id: 'defense_plus_2',
  name: 'Defense +2',
  description: 'Increase defense by 2',
  energyCost: 1,
  category: 'defense',
  effect: {
    type: 'stat_boost',
    stat: 'defense',
    value: 2
  }
}, {
  id: 'defense_plus_1_attack_dmg_minus_1',
  name: 'Defense +1 Attack Dmg -1',
  description: 'Increase defense by 1, reduce attack damage taken by 1',
  energyCost: 1,
  category: 'defense',
  effect: {
    type: 'stat_boost',
    stat: 'defense',
    value: 1,
    targetStat: 'attack',
    penaltyValue: -1
  }
}, {
  id: 'return_to_primary',
  name: 'Return to Primary',
  description: 'Return to primary functionality (undo mine mode)',
  energyCost: 1,
  category: 'defense',
  effect: {
    type: 'special_ability',
    ability: 'return_to_primary'
  }
}, {
  id: 'drain_action_point',
  name: 'Drain Action Point',
  description: 'Drain 1 action point from attacker',
  energyCost: 1,
  category: 'defense',
  effect: {
    type: 'special_ability',
    ability: 'drain_action_point'
  }
},
// Trace Functions
{
  id: 'movement_plus_2',
  name: 'Movement +2',
  description: 'Increase movement by 2',
  energyCost: 1,
  category: 'trace',
  effect: {
    type: 'stat_boost',
    stat: 'movement',
    value: 2
  }
}, {
  id: 'reduce_damage_taken',
  name: 'Defense Dmg -1 or Attack Dmg -1',
  description: 'Reduce either defense or attack damage taken by 1',
  energyCost: 1,
  category: 'trace',
  effect: {
    type: 'stat_penalty',
    value: -1
  }
}, {
  id: 'move_unconnected',
  name: 'Move to Unconnected Node',
  description: 'Move to unconnected node within 2 nodes',
  energyCost: 2,
  category: 'trace',
  effect: {
    type: 'special_ability',
    ability: 'move_unconnected'
  }
}, {
  id: 'instant_capture',
  name: 'Capture Node Instantly',
  description: 'Capture current node instantly',
  energyCost: 2,
  category: 'trace',
  effect: {
    type: 'special_ability',
    ability: 'instant_capture'
  }
}

// FUTURE: Expansion functions (add as needed with unique IDs)
// {
//   id: 'hyperloop_entry',
//   name: 'Enter Hyperloop',
//   description: 'Enter hyperloop lane for rapid movement',
//   energyCost: 2,
//   category: 'trace',
//   effect: { type: 'special_ability', ability: 'enter_hyperloop' },
// },
];

// Helper to calculate next version
export function getNextVersion(currentVersion: string, changeType: 'major' | 'minor' | 'patch'): string {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  switch (changeType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

// Helper to create default templates
export function createDefaultTemplates(owner: 'playerA' | 'playerB'): ProgramTemplate[] {
  return [{
    id: `${owner}-offensive-default`,
    name: 'Offensive',
    type: 'offensive',
    version: '1.0.0',
    baseStats: PROGRAM_BASE_STATS.offensive,
    functions: [],
    owner,
    createdAt: Date.now()
  }, {
    id: `${owner}-defensive-default`,
    name: 'Defensive',
    type: 'defensive',
    version: '1.0.0',
    baseStats: PROGRAM_BASE_STATS.defensive,
    functions: [],
    owner,
    createdAt: Date.now()
  }, {
    id: `${owner}-trace-default`,
    name: 'Trace',
    type: 'trace',
    version: '1.0.0',
    baseStats: PROGRAM_BASE_STATS.trace,
    functions: [],
    owner,
    createdAt: Date.now()
  }];
}
export function coordToKey(coord: Coordinate): string {
  return `${coord[0]},${coord[1]}`;
}
export function keyToCoord(key: string): Coordinate {
  const parts = key.split(',');
  return [parseInt(parts[0]), parseInt(parts[1])];
}