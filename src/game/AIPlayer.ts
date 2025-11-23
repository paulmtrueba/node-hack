import { GameState, Program, ProgramType, ProgramTemplate, Coordinate, coordToKey } from '../types/GameTypes';
import { canSpawnProgramFromTemplate, spawnProgramFromTemplate, canMoveProgram, moveProgram, attackProgram, endTurn, getAdjacentPositions } from './GameLogic';
export class AIPlayer {
  private owner: 'playerA' | 'playerB';
  constructor(owner: 'playerA' | 'playerB') {
    this.owner = owner;
  }
  makeMove(state: GameState): GameState {
    console.log('=== AI TURN START ===');
    console.log('AI Owner:', this.owner);
    console.log('Current Player:', state.currentPlayer);
    console.log('Turn Number:', state.turnNumber);
    let newState = {
      ...state
    };

    // AI strategy: spawn programs if possible, move toward objectives, attack enemies
    const cpu = this.owner === 'playerA' ? newState.cpuA : newState.cpuB;
    console.log('AI CPU State:', {
      energy: cpu.energy,
      actionPoints: cpu.actionPoints,
      usedProcessor: cpu.usedProcessor,
      processorSpeed: cpu.processorSpeed
    });

    // Get AI's available templates
    const myTemplates = newState.programTemplates.filter(t => t.owner === this.owner);
    console.log('AI Templates Available:', myTemplates.length);

    // 1. Try to spawn programs if we have resources
    if (cpu.actionPoints > 0 && cpu.energy > 5 && myTemplates.length > 0) {
      console.log('AI attempting to spawn program...');
      const spawned = this.trySpawnProgram(newState);
      if (spawned !== newState) {
        console.log('AI successfully spawned program');
        newState = spawned;
      }
    }

    // 2. Move and attack with existing programs
    const myPrograms = Array.from(newState.programs.values()).filter(p => p.owner === this.owner && p.mode !== 'mine');
    console.log('AI Programs on Board:', myPrograms.length);
    for (const program of myPrograms) {
      if (program.actionPoints > 0) {
        console.log(`AI processing program ${program.id} with ${program.actionPoints} AP`);

        // Try to attack adjacent enemies first
        const attacked = this.tryAttack(newState, program.id);
        if (attacked) {
          console.log('AI attacked with program', program.id);
          newState = attacked;
          continue;
        }

        // Otherwise try to move toward objectives
        const moved = this.tryMoveTowardObjective(newState, program.id);
        if (moved) {
          console.log('AI moved program', program.id);
          newState = moved;
        }
      }
    }

    // 3. End turn
    console.log('AI ending turn');
    console.log('=== AI TURN END ===');
    return endTurn(newState);
  }
  private trySpawnProgram(state: GameState): GameState {
    const ownedNodes = Array.from(state.nodes.values()).filter(n => n.owner === this.owner && !n.program);
    console.log('AI owned nodes available for spawn:', ownedNodes.length);
    if (ownedNodes.length === 0) {
      console.log('AI has no available nodes to spawn on');
      return state;
    }

    // Get AI's templates
    const myTemplates = state.programTemplates.filter(t => t.owner === this.owner);
    if (myTemplates.length === 0) {
      console.log('AI has no templates available');
      return state;
    }

    // Prefer spawning trace for expansion, then offensive, then defensive
    const preferredOrder: ProgramType[] = ['trace', 'offensive', 'defensive'];
    for (const type of preferredOrder) {
      // Find templates of this type
      const templatesOfType = myTemplates.filter(t => t.type === type);
      for (const template of templatesOfType) {
        for (const node of ownedNodes) {
          const check = canSpawnProgramFromTemplate(state, template, node.position, this.owner);
          if (check.canSpawn) {
            console.log(`AI spawning ${template.name} v${template.version} at [${node.position}]`);
            return spawnProgramFromTemplate(state, template, node.position, this.owner);
          } else {
            console.log(`AI cannot spawn ${template.name}: ${check.reason}`);
          }
        }
      }
    }
    console.log('AI could not spawn any programs');
    return state;
  }
  private tryAttack(state: GameState, programId: string): GameState | null {
    const program = state.programs.get(programId);
    if (!program) {
      console.log('AI program not found:', programId);
      return null;
    }
    const adjacent = getAdjacentPositions(program.position, state.gridSize);
    for (const pos of adjacent) {
      const node = state.nodes.get(coordToKey(pos));
      if (node?.program && node.program.owner !== this.owner) {
        console.log(`AI attacking at [${pos}]`);
        return attackProgram(state, programId, node.program.id);
      }
    }
    return null;
  }
  private tryMoveTowardObjective(state: GameState, programId: string): GameState | null {
    const program = state.programs.get(programId);
    if (!program) {
      console.log('AI program not found for move:', programId);
      return null;
    }

    // Find nearest neutral or enemy node
    const targetNodes = Array.from(state.nodes.values()).filter(n => n.owner !== this.owner && !n.program);
    if (targetNodes.length === 0) {
      console.log('AI has no target nodes to move toward');
      return null;
    }

    // Simple heuristic: move toward closest target
    let bestMove: Coordinate | null = null;
    let bestDistance = Infinity;
    const adjacent = getAdjacentPositions(program.position, state.gridSize);
    for (const pos of adjacent) {
      const check = canMoveProgram(state, programId, pos);
      if (!check.canMove) {
        console.log(`AI cannot move to [${pos}]: ${check.reason}`);
        continue;
      }

      // Calculate distance to nearest target
      for (const target of targetNodes) {
        const distance = Math.abs(pos[0] - target.position[0]) + Math.abs(pos[1] - target.position[1]);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMove = pos;
        }
      }
    }
    if (bestMove) {
      console.log(`AI moving to [${bestMove}]`);
      return moveProgram(state, programId, bestMove);
    }
    console.log('AI found no valid moves');
    return null;
  }
}