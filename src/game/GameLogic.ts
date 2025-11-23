import { GameState, CPU, Program, Node, Connection, Coordinate, ProgramType, ProgramTemplate, PROGRAM_BASE_STATS, coordToKey, keyToCoord, NodeOwner, createDefaultTemplates } from '../types/GameTypes';

// Helper function to check if a position is a CPU node
function isCPUNode(position: Coordinate, gridSize: number): boolean {
  const [row, col] = position;
  return row === 0 && col === 0 || row === gridSize - 1 && col === gridSize - 1;
}

// Helper function to get center nodes
function getCenterNodes(gridSize: number): Coordinate[] {
  const isEven = gridSize % 2 === 0;
  const center = Math.floor(gridSize / 2);
  if (isEven) {
    // For even grids, return the central 4 nodes
    return [[center - 1, center - 1], [center - 1, center], [center, center - 1], [center, center]];
  } else {
    // For odd grids, return the single center node
    return [[center, center]];
  }
}

// Helper function to mirror a coordinate across the grid
function mirrorCoordinate(coord: Coordinate, gridSize: number): Coordinate {
  const [row, col] = coord;
  return [gridSize - 1 - row, gridSize - 1 - col];
}

// Helper function to connect the central 4 nodes (for even grids)
function connectCentralNodes(gridSize: number): Connection[] {
  const connections: Connection[] = [];
  const isEven = gridSize % 2 === 0;
  if (!isEven) return connections;
  const center = Math.floor(gridSize / 2);
  const centralNodes: Coordinate[] = [[center - 1, center - 1],
  // Top-left
  [center - 1, center],
  // Top-right
  [center, center - 1],
  // Bottom-left
  [center, center] // Bottom-right
  ];

  // Connect all 4 central nodes in a square pattern
  // Top-left to top-right
  connections.push({
    from: centralNodes[0],
    to: centralNodes[1]
  });
  // Top-left to bottom-left
  connections.push({
    from: centralNodes[0],
    to: centralNodes[2]
  });
  // Top-right to bottom-right
  connections.push({
    from: centralNodes[1],
    to: centralNodes[3]
  });
  // Bottom-left to bottom-right
  connections.push({
    from: centralNodes[2],
    to: centralNodes[3]
  });
  return connections;
}

// Create a random path from start to one of the center nodes
function createRandomPathToCenter(start: Coordinate, centerNodes: Coordinate[], gridSize: number): Coordinate[] {
  const path: Coordinate[] = [start];
  let current = start;

  // Keep moving until we reach a center node
  while (!centerNodes.some(center => coordToKey(center) === coordToKey(current))) {
    const [row, col] = current;
    const possibleMoves: Coordinate[] = [];

    // Calculate direction to nearest center node
    const nearestCenter = centerNodes[0]; // Use first center as target
    const [targetRow, targetCol] = nearestCenter;

    // Prefer moves that get us closer to center
    if (row < targetRow) possibleMoves.push([row + 1, col]); // Move down
    if (row > targetRow) possibleMoves.push([row - 1, col]); // Move up
    if (col < targetCol) possibleMoves.push([row, col + 1]); // Move right
    if (col > targetCol) possibleMoves.push([row, col - 1]); // Move left

    // Filter out invalid moves and already visited nodes
    const validMoves = possibleMoves.filter(move => {
      const [r, c] = move;
      return r >= 0 && r < gridSize && c >= 0 && c < gridSize && !path.some(p => coordToKey(p) === coordToKey(move));
    });
    if (validMoves.length === 0) {
      // If stuck, just move toward center
      if (row < Math.floor(gridSize / 2)) {
        current = [row + 1, col];
      } else if (row > Math.floor(gridSize / 2)) {
        current = [row - 1, col];
      } else if (col < Math.floor(gridSize / 2)) {
        current = [row, col + 1];
      } else {
        current = [row, col - 1];
      }
    } else {
      // Randomly decide whether to make this connection (70% chance to continue)
      if (Math.random() > 0.3) {
        current = validMoves[Math.floor(Math.random() * validMoves.length)];
      } else {
        // 30% chance to force connection - ensures we reach center
        current = validMoves[0]; // Take most direct route
      }
    }
    path.push(current);

    // Safety check to prevent infinite loops
    if (path.length > gridSize * 2) {
      // Force move to center if path is too long
      current = centerNodes[0];
      path.push(current);
      break;
    }
  }
  return path;
}

// Helper function to create mirrored path connections
function createMirroredPathConnections(gridSize: number): Connection[] {
  const connections: Connection[] = [];
  const cpuAPos: Coordinate = [0, 0];
  const cpuBPos: Coordinate = [gridSize - 1, gridSize - 1];
  const centerNodes = getCenterNodes(gridSize);

  // IMPORTANT: For even grids, connect the central 4 nodes first
  if (gridSize % 2 === 0) {
    connections.push(...connectCentralNodes(gridSize));
  }

  // Get adjacent nodes to CPU A
  const adjacentToCpuA = getAdjacentPositions(cpuAPos, gridSize);

  // Connect CPU A to its adjacent nodes
  adjacentToCpuA.forEach(pos => {
    connections.push({
      from: cpuAPos,
      to: pos
    });
  });

  // For each adjacent node, create a random path to center
  adjacentToCpuA.forEach(startNode => {
    const path = createRandomPathToCenter(startNode, centerNodes, gridSize);

    // Add connections for this path
    for (let i = 0; i < path.length - 1; i++) {
      connections.push({
        from: path[i],
        to: path[i + 1]
      });
    }

    // Mirror this entire path for CPU B
    const mirroredPath = path.map(coord => mirrorCoordinate(coord, gridSize));
    for (let i = 0; i < mirroredPath.length - 1; i++) {
      connections.push({
        from: mirroredPath[i],
        to: mirroredPath[i + 1]
      });
    }
  });

  // Connect CPU B to its adjacent nodes (mirrored)
  const adjacentToCpuB = getAdjacentPositions(cpuBPos, gridSize);
  adjacentToCpuB.forEach(pos => {
    connections.push({
      from: cpuBPos,
      to: pos
    });
  });
  return connections;
}
export function createInitialGameState(gridSize: number = 5): GameState {
  const nodes = new Map<string, Node>();

  // Initialize all nodes as neutral
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const position: Coordinate = [row, col];
      nodes.set(coordToKey(position), {
        position,
        owner: 'neutral',
        program: null
      });
    }
  }

  // Set CPU starting positions (opposite corners)
  const cpuAPos: Coordinate = [0, 0];
  const cpuBPos: Coordinate = [gridSize - 1, gridSize - 1];
  nodes.get(coordToKey(cpuAPos))!.owner = 'playerA';
  nodes.get(coordToKey(cpuBPos))!.owner = 'playerB';

  // Create mirrored path connections from CPUs to center
  const connections = createMirroredPathConnections(gridSize);

  // Mark starting nodes as owned (CPU position + adjacent nodes)
  const adjacentToCpuA = getAdjacentPositions(cpuAPos, gridSize);
  adjacentToCpuA.forEach(pos => {
    nodes.get(coordToKey(pos))!.owner = 'playerA';
  });
  const adjacentToCpuB = getAdjacentPositions(cpuBPos, gridSize);
  adjacentToCpuB.forEach(pos => {
    nodes.get(coordToKey(pos))!.owner = 'playerB';
  });

  // Create default program templates for both players
  const programTemplates = [...createDefaultTemplates('playerA'), ...createDefaultTemplates('playerB')];
  return {
    gridSize,
    nodes,
    connections,
    programs: new Map(),
    programTemplates,
    cpuA: createCPU('playerA'),
    cpuB: createCPU('playerB'),
    currentPlayer: 'playerA',
    phase: 'playing',
    turnNumber: 1,
    freezeTurnCount: 0,
    selectedProgram: null,
    selectedEnemyProgram: null,
    gameLog: ['Game started. Mirrored paths created. Player A begins.'],
    winner: null
  };
}
function createCPU(owner: 'playerA' | 'playerB'): CPU {
  return {
    owner,
    energy: 50,
    maxEnergy: 50,
    processorSpeed: 6,
    usedProcessor: 0,
    memory: 4,
    actionPoints: 3,
    maxActionPoints: 3
  };
}
export function canSpawnProgramFromTemplate(state: GameState, template: ProgramTemplate, position: Coordinate, owner: 'playerA' | 'playerB'): {
  canSpawn: boolean;
  reason?: string;
} {
  const cpu = owner === 'playerA' ? state.cpuA : state.cpuB;
  const node = state.nodes.get(coordToKey(position));
  if (!node) {
    return {
      canSpawn: false,
      reason: 'Invalid position'
    };
  }

  // Check if trying to spawn on CPU node
  if (isCPUNode(position, state.gridSize)) {
    return {
      canSpawn: false,
      reason: 'Cannot spawn on CPU node'
    };
  }
  if (node.owner !== owner) {
    return {
      canSpawn: false,
      reason: 'Must spawn on owned node'
    };
  }
  if (node.program) {
    return {
      canSpawn: false,
      reason: 'Node occupied'
    };
  }

  // Calculate total energy cost (base + functions)
  const totalEnergy = template.baseStats.energy + template.functions.reduce((sum, f) => sum + f.energyCost, 0);
  if (cpu.energy < totalEnergy) {
    return {
      canSpawn: false,
      reason: `Insufficient energy (need ${totalEnergy})`
    };
  }
  if (cpu.usedProcessor + 1 > cpu.processorSpeed) {
    return {
      canSpawn: false,
      reason: 'Insufficient processor speed'
    };
  }
  if (cpu.actionPoints < 1) {
    return {
      canSpawn: false,
      reason: 'No action points'
    };
  }
  return {
    canSpawn: true
  };
}
export function spawnProgramFromTemplate(state: GameState, template: ProgramTemplate, position: Coordinate, owner: 'playerA' | 'playerB'): GameState {
  const check = canSpawnProgramFromTemplate(state, template, position, owner);
  if (!check.canSpawn) {
    return state;
  }

  // Calculate modified stats from functions
  let stats = {
    ...template.baseStats
  };
  template.functions.forEach(func => {
    if (func.effect.type === 'stat_boost' && func.effect.stat && func.effect.value) {
      stats[func.effect.stat] += func.effect.value;
    }
  });
  const program: Program = {
    ...stats,
    type: template.type,
    id: `${owner}-${template.type}-${Date.now()}`,
    owner,
    position,
    level: 1,
    processorCost: 1,
    actionPoints: 2,
    hasMovedThisTurn: false,
    turnsOnNode: 0,
    mode: 'normal',
    functions: template.functions,
    maxFunctions: 1 + template.functions.length,
    templateId: template.id,
    version: template.version,
    identifiedBy: [] // Start unidentified
  };
  const newState = {
    ...state
  };
  const cpu = owner === 'playerA' ? newState.cpuA : newState.cpuB;
  const totalEnergy = template.baseStats.energy + template.functions.reduce((sum, f) => sum + f.energyCost, 0);
  cpu.energy -= totalEnergy;
  cpu.usedProcessor += 1;
  cpu.actionPoints -= 1;
  newState.programs.set(program.id, program);
  const node = newState.nodes.get(coordToKey(position))!;
  node.program = program;
  newState.gameLog = [...state.gameLog, `${owner} spawned ${template.name} v${template.version} at [${position[0]},${position[1]}] (-${totalEnergy} energy)`];
  return newState;
}

// Keep old spawn function for backward compatibility
export function canSpawnProgram(state: GameState, type: ProgramType, position: Coordinate, owner: 'playerA' | 'playerB'): {
  canSpawn: boolean;
  reason?: string;
} {
  // Find default template for this type
  const template = state.programTemplates.find(t => t.type === type && t.owner === owner && t.version === '1.0.0');
  if (!template) {
    return {
      canSpawn: false,
      reason: 'Template not found'
    };
  }
  return canSpawnProgramFromTemplate(state, template, position, owner);
}
export function spawnProgram(state: GameState, type: ProgramType, position: Coordinate, owner: 'playerA' | 'playerB'): GameState {
  const template = state.programTemplates.find(t => t.type === type && t.owner === owner && t.version === '1.0.0');
  if (!template) {
    return state;
  }
  return spawnProgramFromTemplate(state, template, position, owner);
}

// PRIMARY ACTIONS

export function attackProgram(state: GameState, attackerId: string, defenderId: string): GameState {
  const attacker = state.programs.get(attackerId);
  const defender = state.programs.get(defenderId);
  if (!attacker || !defender) {
    return state;
  }
  if (attacker.actionPoints < 1) {
    return state;
  }

  // Check if adjacent
  const distance = Math.abs(attacker.position[0] - defender.position[0]) + Math.abs(attacker.position[1] - defender.position[1]);
  if (distance !== 1) {
    return state;
  }
  const newState = {
    ...state
  };
  const newAttacker = {
    ...attacker
  };
  const newDefender = {
    ...defender
  };
  const log: string[] = [...state.gameLog];

  // Check if defender is a mine
  if (newDefender.mode === 'mine') {
    const mineDamage = newDefender.energy + newDefender.defense;
    newAttacker.energy -= mineDamage;
    log.push(`${attacker.owner} ${attacker.type} triggered mine! Took ${mineDamage} damage!`);
    removeProgram(newState, defenderId);
    if (newAttacker.energy <= 0) {
      log.push(`${attacker.owner} ${attacker.type} destroyed by mine`);
      removeProgram(newState, attackerId);
    } else {
      newAttacker.actionPoints -= 1;
      newState.programs.set(attackerId, newAttacker);
    }
    newState.gameLog = log;
    return newState;
  }

  // Simultaneous combat
  newAttacker.energy -= defender.attack;
  newDefender.energy -= attacker.attack;
  newAttacker.actionPoints -= 1;
  log.push(`Combat: ${attacker.owner} ${attacker.type} [${attacker.attack} ATK] vs ${defender.owner} ${defender.type} [${defender.attack} ATK]`);

  // Defensive program primary action: counter-attack damage
  if (defender.type === 'defensive') {
    newAttacker.energy -= defender.defense;
    log.push(`${defender.owner} defensive counter-attacked for ${defender.defense} damage`);
  }

  // Handle destruction
  if (newAttacker.energy <= 0 && newDefender.energy <= 0) {
    log.push('Mutual destruction!');
    removeProgram(newState, attackerId);
    removeProgram(newState, defenderId);
  } else if (newAttacker.energy <= 0) {
    log.push(`${attacker.owner} ${attacker.type} destroyed`);
    removeProgram(newState, attackerId);
    newState.programs.set(defenderId, newDefender);
  } else if (newDefender.energy <= 0) {
    log.push(`${defender.owner} ${defender.type} destroyed`);
    removeProgram(newState, defenderId);
    newState.programs.set(attackerId, newAttacker);
  } else {
    newState.programs.set(attackerId, newAttacker);
    newState.programs.set(defenderId, newDefender);
  }
  newState.gameLog = log;
  return newState;
}

// SECONDARY ACTIONS

export function destroyConnection(state: GameState, programId: string, connection: {
  from: Coordinate;
  to: Coordinate;
}): GameState {
  const program = state.programs.get(programId);
  if (!program || program.type !== 'offensive') {
    return state;
  }
  if (program.actionPoints < 1) {
    return state;
  }
  const newState = {
    ...state
  };

  // Remove the connection
  newState.connections = newState.connections.filter(conn => !(coordToKey(conn.from) === coordToKey(connection.from) && coordToKey(conn.to) === coordToKey(connection.to) || coordToKey(conn.from) === coordToKey(connection.to) && coordToKey(conn.to) === coordToKey(connection.from)));
  newState.gameLog = [...state.gameLog, `${program.owner} offensive destroyed connection [${connection.from}]-[${connection.to}]`];

  // Despawn program after secondary action
  removeProgram(newState, programId);
  newState.gameLog.push(`${program.owner} ${program.type} despawned after secondary action`);
  return newState;
}
export function createMine(state: GameState, programId: string): GameState {
  const program = state.programs.get(programId);
  if (!program || program.type !== 'defensive') {
    return state;
  }
  if (program.actionPoints < 1) {
    return state;
  }
  const newState = {
    ...state
  };
  const newProgram = {
    ...program,
    mode: 'mine' as const,
    actionPoints: 0
  };
  newState.programs.set(programId, newProgram);
  const node = newState.nodes.get(coordToKey(program.position))!;
  node.program = newProgram;
  newState.gameLog = [...state.gameLog, `${program.owner} defensive became a mine at [${program.position}] (${program.energy + program.defense} damage)`];
  return newState;
}
export function createConnection(state: GameState, programId: string, from: Coordinate, to: Coordinate): GameState {
  const program = state.programs.get(programId);
  if (!program || program.type !== 'trace') {
    return state;
  }
  if (program.actionPoints < 1) {
    return state;
  }

  // Check if nodes are adjacent
  const distance = Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
  if (distance !== 1) {
    return state;
  }

  // Check if connection already exists
  const exists = state.connections.some(conn => coordToKey(conn.from) === coordToKey(from) && coordToKey(conn.to) === coordToKey(to) || coordToKey(conn.from) === coordToKey(to) && coordToKey(conn.to) === coordToKey(from));
  if (exists) {
    return state;
  }
  const newState = {
    ...state
  };
  newState.connections = [...newState.connections, {
    from,
    to
  }];
  const newProgram = {
    ...program,
    actionPoints: program.actionPoints - 1
  };
  newState.programs.set(programId, newProgram);
  newState.gameLog = [...state.gameLog, `${program.owner} trace created connection [${from}]-[${to}]`];
  return newState;
}
export function identifyFunctions(state: GameState, programId: string, targetId: string): GameState {
  const program = state.programs.get(programId);
  const target = state.programs.get(targetId);
  if (!program || !target || program.type !== 'trace') {
    return state;
  }
  if (program.actionPoints < 1) {
    return state;
  }

  // Check if within range (2 nodes)
  const distance = Math.abs(program.position[0] - target.position[0]) + Math.abs(program.position[1] - target.position[1]);
  if (distance > 2) {
    return state;
  }
  const newState = {
    ...state
  };

  // Mark target as identified by this player
  const newTarget = {
    ...target
  };
  if (!newTarget.identifiedBy.includes(program.owner)) {
    newTarget.identifiedBy = [...newTarget.identifiedBy, program.owner];
  }
  newState.programs.set(targetId, newTarget);

  // Update node reference
  const node = newState.nodes.get(coordToKey(newTarget.position));
  if (node) {
    node.program = newTarget;
  }
  const functionList = target.functions.length > 0 ? target.functions.map(f => f.name).join(', ') : 'No functions';
  newState.gameLog = [...state.gameLog, `${program.owner} trace identified ${target.owner} ${target.type} functions: ${functionList}`];

  // Despawn program after secondary action
  removeProgram(newState, programId);
  newState.gameLog.push(`${program.owner} ${program.type} despawned after secondary action`);
  return newState;
}
export function despawnProgram(state: GameState, programId: string): GameState {
  const program = state.programs.get(programId);
  if (!program) {
    return state;
  }
  const newState = {
    ...state
  };
  const node = newState.nodes.get(coordToKey(program.position));

  // Check if program is on owned node for energy refund
  const isOnOwnedNode = node?.owner === program.owner;
  const energyRefund = isOnOwnedNode ? program.energy : 0;

  // Refund energy if on owned node
  if (energyRefund > 0) {
    const cpu = program.owner === 'playerA' ? newState.cpuA : newState.cpuB;
    cpu.energy = Math.min(cpu.energy + energyRefund, cpu.maxEnergy);
  }

  // Remove program
  removeProgram(newState, programId);

  // Log the despawn
  const refundText = energyRefund > 0 ? ` (+${energyRefund} energy refunded)` : '';
  newState.gameLog = [...state.gameLog, `${program.owner} despawned ${program.type} at [${program.position[0]},${program.position[1]}]${refundText}`];
  return newState;
}

// MOVEMENT

export function canMoveProgram(state: GameState, programId: string, to: Coordinate): {
  canMove: boolean;
  reason?: string;
} {
  const program = state.programs.get(programId);
  if (!program) {
    return {
      canMove: false,
      reason: 'Program not found'
    };
  }
  if (program.mode === 'mine') {
    return {
      canMove: false,
      reason: 'Mines cannot move'
    };
  }
  if (program.actionPoints < 1) {
    return {
      canMove: false,
      reason: 'No action points'
    };
  }
  const distance = Math.abs(program.position[0] - to[0]) + Math.abs(program.position[1] - to[1]);
  if (distance > program.movement) {
    return {
      canMove: false,
      reason: 'Out of movement range'
    };
  }
  const targetNode = state.nodes.get(coordToKey(to));
  if (!targetNode) {
    return {
      canMove: false,
      reason: 'Invalid position'
    };
  }

  // Check if trying to move to CPU node
  if (isCPUNode(to, state.gridSize)) {
    return {
      canMove: false,
      reason: 'Cannot move to CPU node'
    };
  }
  if (targetNode.program) {
    return {
      canMove: false,
      reason: 'Node occupied'
    };
  }

  // Check if connected
  if (!areNodesConnected(state, program.position, to)) {
    return {
      canMove: false,
      reason: 'Nodes not connected'
    };
  }
  return {
    canMove: true
  };
}
export function moveProgram(state: GameState, programId: string, to: Coordinate): GameState {
  const check = canMoveProgram(state, programId, to);
  if (!check.canMove) {
    return state;
  }
  const newState = {
    ...state
  };
  const program = {
    ...newState.programs.get(programId)!
  };
  const oldPos = program.position;

  // Clear old position
  const oldNode = newState.nodes.get(coordToKey(oldPos))!;
  oldNode.program = null;

  // Update program
  program.position = to;
  program.actionPoints -= 1;
  program.hasMovedThisTurn = true;
  program.turnsOnNode = 0; // Reset capture progress

  // Set new position
  const newNode = newState.nodes.get(coordToKey(to))!;
  newNode.program = program;
  newState.programs.set(programId, program);
  newState.gameLog = [...state.gameLog, `${program.owner} moved ${program.type} from [${oldPos[0]},${oldPos[1]}] to [${to[0]},${to[1]}]`];
  return newState;
}
function removeProgram(state: GameState, programId: string): void {
  const program = state.programs.get(programId);
  if (!program) return;
  const cpu = program.owner === 'playerA' ? state.cpuA : state.cpuB;
  cpu.usedProcessor -= program.processorCost;
  const node = state.nodes.get(coordToKey(program.position));
  if (node) {
    node.program = null;
  }
  state.programs.delete(programId);
}
export function endTurn(state: GameState): GameState {
  const newState = {
    ...state
  };

  // Update capture progress for stationary programs
  newState.programs.forEach(program => {
    if (!program.hasMovedThisTurn && program.mode !== 'mine') {
      const node = newState.nodes.get(coordToKey(program.position))!;
      if (node.owner === 'neutral' || node.owner !== program.owner) {
        program.turnsOnNode += 1;
        if (program.turnsOnNode >= 1) {
          node.owner = program.owner;
          newState.gameLog.push(`${program.owner} captured node [${program.position[0]},${program.position[1]}]`);
        }
      }
    }
  });

  // Reset program action points and movement flags
  newState.programs.forEach(program => {
    if (program.mode !== 'mine') {
      program.actionPoints = 2;
      program.hasMovedThisTurn = false;
    }
  });

  // Switch player
  newState.currentPlayer = state.currentPlayer === 'playerA' ? 'playerB' : 'playerA';

  // Reset CPU action points if switching back to playerA (new round)
  if (newState.currentPlayer === 'playerA') {
    newState.cpuA.actionPoints = newState.cpuA.maxActionPoints;
    newState.cpuB.actionPoints = newState.cpuB.maxActionPoints;
    newState.turnNumber += 1;
  }

  // Check for freeze mode
  if (!arePlayersConnected(newState)) {
    if (newState.phase !== 'freeze') {
      newState.phase = 'freeze';
      newState.freezeTurnCount = 0;
      newState.gameLog.push('FREEZE MODE ACTIVATED - Network severed!');
    }
  } else if (newState.phase === 'freeze') {
    newState.phase = 'playing';
    newState.gameLog.push('Network reconnected - Freeze mode ended');
  }

  // Apply freeze decay if in freeze mode and round complete
  if (newState.phase === 'freeze' && newState.currentPlayer === 'playerA') {
    applyFreezeDecay(newState);
  }

  // Check victory
  checkVictory(newState);
  return newState;
}
function applyFreezeDecay(state: GameState): void {
  const calcDecay = (cpu: CPU, programs: Program[]) => {
    const activeCount = programs.length;
    const highLevelCount = programs.filter(p => p.level >= 2).length;
    return 2 + activeCount + highLevelCount;
  };
  const playerAPrograms = Array.from(state.programs.values()).filter(p => p.owner === 'playerA');
  const playerBPrograms = Array.from(state.programs.values()).filter(p => p.owner === 'playerB');
  const decayA = calcDecay(state.cpuA, playerAPrograms);
  const decayB = calcDecay(state.cpuB, playerBPrograms);
  state.cpuA.energy -= decayA;
  state.cpuB.energy -= decayB;
  state.gameLog.push(`Freeze decay: Player A -${decayA}, Player B -${decayB}`);
  state.freezeTurnCount += 1;
}
function checkVictory(state: GameState): void {
  if (state.cpuA.energy <= 0 && state.cpuB.energy <= 0) {
    const countA = Array.from(state.nodes.values()).filter(n => n.owner === 'playerA').length;
    const countB = Array.from(state.nodes.values()).filter(n => n.owner === 'playerB').length;
    if (countA > countB) {
      state.winner = 'playerA';
      state.gameLog.push('Player A wins by node count!');
    } else if (countB > countA) {
      state.winner = 'playerB';
      state.gameLog.push('Player B wins by node count!');
    } else {
      state.winner = 'draw';
      state.gameLog.push('Mutual collapse - Draw!');
    }
    state.phase = 'gameOver';
  } else if (state.cpuA.energy <= 0) {
    state.winner = 'playerB';
    state.gameLog.push('Player B wins - Player A CPU destroyed!');
    state.phase = 'gameOver';
  } else if (state.cpuB.energy <= 0) {
    state.winner = 'playerA';
    state.gameLog.push('Player A wins - Player B CPU destroyed!');
    state.phase = 'gameOver';
  }
}
function areNodesConnected(state: GameState, from: Coordinate, to: Coordinate): boolean {
  return state.connections.some(conn => coordToKey(conn.from) === coordToKey(from) && coordToKey(conn.to) === coordToKey(to) || coordToKey(conn.from) === coordToKey(to) && coordToKey(conn.to) === coordToKey(from));
}
function arePlayersConnected(state: GameState): boolean {
  const cpuAPos: Coordinate = [0, 0];
  const cpuBPos: Coordinate = [state.gridSize - 1, state.gridSize - 1];
  const visited = new Set<string>();
  const queue: Coordinate[] = [cpuAPos];
  visited.add(coordToKey(cpuAPos));
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (coordToKey(current) === coordToKey(cpuBPos)) {
      return true;
    }

    // Find connected nodes
    state.connections.forEach(conn => {
      let next: Coordinate | null = null;
      if (coordToKey(conn.from) === coordToKey(current)) {
        next = conn.to;
      } else if (coordToKey(conn.to) === coordToKey(current)) {
        next = conn.from;
      }
      if (next && !visited.has(coordToKey(next))) {
        visited.add(coordToKey(next));
        queue.push(next);
      }
    });
  }
  return false;
}
export function getAdjacentPositions(pos: Coordinate, gridSize: number): Coordinate[] {
  const adjacent: Coordinate[] = [];
  const [row, col] = pos;
  if (row > 0) adjacent.push([row - 1, col]);
  if (row < gridSize - 1) adjacent.push([row + 1, col]);
  if (col > 0) adjacent.push([row, col - 1]);
  if (col < gridSize - 1) adjacent.push([row, col + 1]);
  return adjacent;
}