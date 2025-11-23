
# Node Hack - Expansion Planning Guide

## Current Architecture (v1.0.0)

### ✅ Extensible Systems Already in Place:

1. **Program System**
   - Type-safe program types via `ProgramType` union
   - Template-based spawning with versioning
   - Function system with unique IDs
   - Easy to add new programs: Just add to `PROGRAM_BASE_STATS`

2. **Function System**
   - Categorized by type (generic, attack, defense, trace)
   - Effect-based system supports any ability
   - Easy to add: Add to `AVAILABLE_FUNCTIONS` array with unique ID

3. **Game Tracking**
   - Comprehensive action logging system
   - Replay support with snapshots
   - Extensible action types
   - Ready for hyperloop actions (commented out)

4. **Data Structures**
   - Map-based nodes: O(1) lookups
   - Array-based connections: Simple iteration
   - Map upgrade path documented for 8x8+ grids
   - Coordinate system supports any grid size

---

## Expansion 1: New Programs (Easy - Ready Now)

### Adding 4 New Program Types:

**Implementation Steps:**

1. **Add to ProgramType union** (GameTypes.ts):
```typescript
export type ProgramType = 
  | 'offensive' 
  | 'defensive' 
  | 'trace'
  | 'interceptor'  // NEW
  | 'sentinel'     // NEW
  | 'scout'        // NEW
  | 'carrier'      // NEW
```

2. **Add base stats** (GameTypes.ts):
```typescript
export const PROGRAM_BASE_STATS = {
  // ... existing types
  interceptor: {
    type: 'interceptor',
    energy: 2,
    attack: 2,
    defense: 1,
    movement: 3,
  },
  sentinel: {
    type: 'sentinel',
    energy: 5,
    attack: 2,
    defense: 4,
    movement: 0, // Stationary
  },
  scout: {
    type: 'scout',
    energy: 2,
    attack: 1,
    defense: 1,
    movement: 3,
  },
  carrier: {
    type: 'carrier',
    energy: 6,
    attack: 1,
    defense: 2,
    movement: 1,
  },
}
```

3. **Add program icons** (GameBoard.tsx):
```typescript
const getProgramIcon = (program: Program) => {
  const icons = {
    offensive: '⚔️',
    defensive: '🛡️',
    trace: '🦋',
    interceptor: '🚀',  // NEW
    sentinel: '🗼',     // NEW
    scout: '👁️',       // NEW
    carrier: '📦',      // NEW
  }
  return icons[program.type]
}
```

4. **Add default templates** (GameTypes.ts):
```typescript
// In createDefaultTemplates(), add new types
```

**Estimated Time:** 1-2 hours
**Risk Level:** Low - No breaking changes
**Testing Focus:** UI rendering, spawning, combat

---

## Expansion 2: Hyperloop System (Complex - Plan Ahead)

### Architecture Changes Needed:

**1. Location System Upgrade**

Current:
```typescript
position: Coordinate  // [row, col]
```

Future:
```typescript
location: ProgramLocation
// where ProgramLocation = 
//   | { type: 'node'; position: Coordinate }
//   | { type: 'hyperloop'; lane: 'top' | 'right' | 'bottom' | 'left'; index: number }
```

**2. Hyperloop State**

Add to GameState:
```typescript
hyperloop: {
  enabled: boolean;
  lanes: {
    top: (Program | null)[];     // Array of slots
    right: (Program | null)[];
    bottom: (Program | null)[];
    left: (Program | null)[];
  };
}
```

**3. Movement System Changes**

Current movement:
- Check if nodes connected
- Move to adjacent node
- Capture node over time

Hyperloop movement:
- Enter from edge node
- Move along lane (fast)
- Exit to edge node (ambush)
- Cannot capture while in hyperloop

**4. Rendering Changes**

GameBoard needs:
- Render hyperloop lanes around grid
- Show programs in lanes
- Visual indicators for entry/exit points
- Animation for lane movement

**5. Action Tracking**

Already prepared in GameTracking.ts:
- `enter_hyperloop`
- `exit_hyperloop`
- `hyperloop_move`
- `hyperloop_ambush`

### Implementation Phases:

**Phase 1: Data Structure (2-3 hours)**
- Uncomment hyperloop types in GameTypes.ts
- Add hyperloop state to GameState
- Update Program interface with location

**Phase 2: Game Logic (4-6 hours)**
- Implement enter/exit hyperloop
- Implement lane movement
- Update movement validation
- Handle edge cases (combat, despawn)

**Phase 3: UI/UX (6-8 hours)**
- Design hyperloop visual representation
- Implement lane rendering
- Add entry/exit indicators
- Animate movement in lanes

**Phase 4: AI Support (3-4 hours)**
- Update AI to understand hyperloop
- Add hyperloop tactics
- Balance risk/reward

**Total Estimated Time:** 15-21 hours
**Risk Level:** Medium-High - Major feature
**Testing Focus:** Movement validation, edge cases, AI behavior

### When to Implement:

**Recommended Approach:**
1. ✅ **Now:** Keep commented code in place
2. ✅ **Now:** Design hyperloop visuals/UX
3. ⏳ **Before 7x7:** Implement Map-based connections
4. ⏳ **With 7x7:** Implement hyperloop system
5. ⏳ **After 7x7:** Balance and polish

**Why Wait:**
- Current 5x5 grid doesn't need hyperloop
- 7x7 grid makes hyperloop more valuable
- Gives time to refine design
- Can test with larger grids first

---

## Expansion 3: 7x7 & 8x8 Grids (Medium Complexity)

### Performance Optimization Needed:

**1. Connection Map Migration**

Uncomment in GameTypes.ts:
```typescript
export type ConnectionMap = Map<string, Set<string>>;
```

**Migration Steps:**
1. Change `connections: Connection[]` to `connections: ConnectionMap`
2. Update `createInitialGameState()` to use Map
3. Replace `connections.some()` with `areConnectedMap()`
4. Update rendering to use `getConnectionArray()`
5. Test thoroughly with 5x5 first
6. Deploy with 7x7 grid

**Estimated Time:** 3-4 hours
**Risk Level:** Medium - Touches core logic
**Performance Gain:** O(n) → O(1) connection checks

**2. Grid Size Selector**

Already supports 4-8:
```typescript
const sizes = [4, 5, 6, 7, 8]
```

Just needs:
- Larger canvas rendering
- Adjusted cell sizes for 8x8
- More CPU energy for larger grids

**Estimated Time:** 1-2 hours
**Risk Level:** Low

---

## New Functions (Easy - Add Anytime)

### Adding Functions:

1. **Define in AVAILABLE_FUNCTIONS** with unique ID
2. **Choose category** (generic, attack, defense, trace)
3. **Define effect** (stat_boost, special_ability, etc.)
4. **Implement special abilities** in GameLogic.ts if needed

**Example - Hyperloop Entry Function:**
```typescript
{
  id: 'hyperloop_entry',
  name: 'Enter Hyperloop',
  description: 'Enter hyperloop lane for rapid movement',
  energyCost: 2,
  category: 'trace',
  effect: { type: 'special_ability', ability: 'enter_hyperloop' },
}
```

**Estimated Time:** 30 min - 2 hours per function
**Risk Level:** Low (unless special ability is complex)

---

## Recommended Implementation Order:

### Phase 1: Current (v1.0.0) ✅
- 5x5 grid
- 3 program types
- Basic functions
- Array-based connections

### Phase 2: New Programs (v1.1.0)
**Timeline:** Next sprint
**Effort:** 1-2 hours
- Add 4 new program types
- Add program-specific functions
- Update UI icons
- Balance testing

### Phase 3: Grid Expansion (v1.2.0)
**Timeline:** 2-3 sprints out
**Effort:** 4-6 hours
- Migrate to Map-based connections
- Add 6x6, 7x7 support
- Adjust CPU energy scaling
- Performance testing

### Phase 4: Hyperloop (v2.0.0)
**Timeline:** 4-6 sprints out
**Effort:** 15-21 hours
- Implement hyperloop system
- Add 8x8 grid
- Add hyperloop-specific programs
- Major testing phase

---

## Data Structure Migration Checklist

### When Moving to Map-Based Connections (7x7+):

- [ ] Uncomment ConnectionMap types in GameTypes.ts
- [ ] Update GameState.connections type
- [ ] Migrate createInitialGameState()
- [ ] Update createMirroredPathConnections()
- [ ] Replace areNodesConnected() checks
- [ ] Update destroyConnection()
- [ ] Update createConnection()
- [ ] Update arePlayersConnected() (BFS)
- [ ] Update GameBoard rendering
- [ ] Add getConnectionArray() helper
- [ ] Test with 5x5 grid first
- [ ] Test with 7x7 grid
- [ ] Performance benchmark
- [ ] Update documentation

---

## Questions & Answers:

### Q: Can we add new programs now?
**A:** Yes! Just add to ProgramType union and PROGRAM_BASE_STATS. No breaking changes.

### Q: Can we add new functions now?
**A:** Yes! Add to AVAILABLE_FUNCTIONS with unique ID. Implement special abilities in GameLogic.ts if needed.

### Q: Should we implement hyperloop now?
**A:** No. Wait until 7x7 grid. Current architecture supports it (commented code ready), but 5x5 doesn't need it.

### Q: When should we migrate to Map-based connections?
**A:** Before implementing 7x7 grid. Test migration with 5x5 first, then deploy with 7x7.

### Q: Will game tracking handle hyperloop?
**A:** Yes! Action types already defined (commented). Just uncomment when implementing.

### Q: Can we change grid size dynamically?
**A:** Yes! GridSizeSelector already supports 4-8. Just needs connection Map migration for larger grids.

---

## Summary:

✅ **Ready Now:**
- New programs (easy)
- New functions (easy)
- Grid sizes 4-6 (current system)

⏳ **Need Migration First:**
- Grid sizes 7-8 (Map-based connections)
- Hyperloop system (location system upgrade)

🎯 **Architecture is Extensible:**
- Type-safe program system
- Function-based abilities
- Comprehensive game tracking
- Clear upgrade paths documented

**You're in great shape for expansions!** The current architecture is solid and extensible. New programs and functions can be added immediately. Hyperloop is well-planned and ready when you need it. 🚀
