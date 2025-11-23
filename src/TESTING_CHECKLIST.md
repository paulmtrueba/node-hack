
# Node Hack - Complete Action Testing Checklist

## 🎮 Testing Guide

This document provides a comprehensive checklist for testing all program actions, including primary actions, secondary actions, movement, and function-based abilities.

---

## ✅ OFFENSIVE PROGRAM TESTING

### **Primary Action: ATTACK**
- [ ] Spawn offensive program on owned node
- [ ] Move adjacent to enemy program
- [ ] Click offensive program to select it
- [ ] Click "ATTACK" button
- [ ] Click enemy program
- [ ] **Expected:** Both programs take damage simultaneously
- [ ] **Expected:** Attacker loses 1 action point
- [ ] **Expected:** Game log shows combat details
- [ ] **Test mutual destruction:** Attack when both have low HP
- [ ] **Test destruction:** Attack when enemy has low HP
- [ ] **Test survival:** Attack when both have high HP

### **Secondary Action: DESTROY CONNECTION**
- [ ] Spawn offensive program on owned node
- [ ] Move adjacent to a connection
- [ ] Click offensive program to select it
- [ ] Click "DESTROY" button
- [ ] **Expected:** Connections turn RED if clickable
- [ ] Click a RED connection
- [ ] **Expected:** Connection disappears
- [ ] **Expected:** Program despawns after action
- [ ] **Expected:** Game log shows connection destroyed
- [ ] **Test freeze mode:** Destroy connection between CPUs

### **Movement**
- [ ] Spawn offensive program
- [ ] Click program to select it
- [ ] Click "MOVE" button
- [ ] Click adjacent connected node
- [ ] **Expected:** Program moves (movement range = 1)
- [ ] **Expected:** Program loses 1 action point
- [ ] **Test:** Try moving to unconnected node (should fail)
- [ ] **Test:** Try moving 2 nodes away (should fail)

### **With Functions**
- [ ] Create offensive program with "Attack +1" function
- [ ] Spawn and verify attack stat increased
- [ ] Attack enemy program
- [ ] **Expected:** Damage reflects boosted attack stat
- [ ] Create offensive program with "+1 Action Point" function
- [ ] Spawn and verify starts with 3 action points
- [ ] **Expected:** Can perform 3 actions instead of 2

---

## ✅ DEFENSIVE PROGRAM TESTING

### **Primary Action: COUNTER (Passive)**
- [ ] Spawn defensive program on owned node
- [ ] Have enemy offensive program attack it
- [ ] **Expected:** Defensive deals attack damage PLUS defense damage
- [ ] **Expected:** Game log shows "counter-attacked for X damage"
- [ ] **Test:** Verify counter damage = defense stat value

### **Secondary Action: CREATE MINE**
- [ ] Spawn defensive program on owned node
- [ ] Click program to select it
- [ ] Click "MINE" button
- [ ] **Expected:** Program shows "⚠️ MINE" warning
- [ ] **Expected:** Mine damage = energy + defense
- [ ] **Expected:** Program action points set to 0
- [ ] **Expected:** Program cannot move anymore
- [ ] Have enemy program attack the mine
- [ ] **Expected:** Attacker takes mine damage
- [ ] **Expected:** Mine is destroyed
- [ ] **Expected:** Attacker is destroyed if HP <= mine damage
- [ ] **Expected:** Game log shows "triggered mine!"

### **Movement**
- [ ] Spawn defensive program
- [ ] Click program to select it
- [ ] Click "MOVE" button
- [ ] Click adjacent connected node
- [ ] **Expected:** Program moves (movement range = 1)
- [ ] **Test:** Verify cannot move after becoming mine

### **With Functions**
- [ ] Create defensive program with "Defense +1" function
- [ ] Spawn and verify defense stat increased
- [ ] Create mine
- [ ] **Expected:** Mine damage includes boosted defense
- [ ] Create defensive program with "Defense +2" function
- [ ] Spawn and verify defense stat increased by 2
- [ ] Test counter-attack damage
- [ ] **Expected:** Counter damage reflects boosted defense

---

## ✅ TRACE PROGRAM TESTING

### **Primary Action: CREATE CONNECTION**
- [ ] Spawn trace program on owned node
- [ ] Click program to select it
- [ ] Click "CONNECT" button
- [ ] **Expected:** Mode changes to create_connection
- [ ] Click first node
- [ ] **Expected:** Node highlights YELLOW with "START" badge
- [ ] Click adjacent node
- [ ] **Expected:** New GREEN connection appears
- [ ] **Expected:** Program loses 1 action point
- [ ] **Expected:** Game log shows "created connection"
- [ ] **Test:** Try creating duplicate connection (should fail)
- [ ] **Test:** Try connecting non-adjacent nodes (should fail)

### **Secondary Action: IDENTIFY FUNCTIONS**
- [ ] Spawn trace program on owned node
- [ ] Spawn enemy program with functions within 2 nodes
- [ ] Click trace program to select it
- [ ] Click "IDENTIFY" button
- [ ] **Expected:** Mode changes to identify
- [ ] Click enemy program
- [ ] **Expected:** Enemy program marked as identified
- [ ] **Expected:** Trace program despawns
- [ ] **Expected:** Game log shows functions revealed
- [ ] Click enemy program again
- [ ] **Expected:** EnemyProgramInfo shows "IDENTIFIED" status
- [ ] **Expected:** All stats visible (not "???")
- [ ] **Expected:** Functions list visible
- [ ] **Test:** Try identifying program >2 nodes away (should fail)

### **Movement**
- [ ] Spawn trace program
- [ ] Click program to select it
- [ ] Click "MOVE" button
- [ ] Click node 2 spaces away (connected)
- [ ] **Expected:** Program moves (movement range = 2)
- [ ] **Test:** Verify can move 2 nodes in one action
- [ ] **Test:** Try moving 3 nodes away (should fail)

### **With Functions**
- [ ] Create trace program with "Movement +1" function
- [ ] Spawn and verify movement stat = 3
- [ ] Test movement range
- [ ] **Expected:** Can move 3 nodes in one action
- [ ] Create trace program with "Movement +2" function
- [ ] Spawn and verify movement stat = 4
- [ ] **Expected:** Can move 4 nodes in one action

---

## ✅ GENERAL MECHANICS TESTING

### **Spawning**
- [ ] Select program template from SPAWN panel
- [ ] Click owned node
- [ ] **Expected:** Program appears on node
- [ ] **Expected:** CPU energy decreases
- [ ] **Expected:** CPU processor usage increases
- [ ] **Expected:** CPU action points decrease
- [ ] **Test:** Try spawning on enemy node (should fail)
- [ ] **Test:** Try spawning on occupied node (should fail)
- [ ] **Test:** Try spawning on CPU node (should fail)
- [ ] **Test:** Try spawning with insufficient energy (should fail)

### **Node Capture**
- [ ] Spawn program on owned node
- [ ] Move to neutral node
- [ ] End turn without moving
- [ ] **Expected:** Node becomes owned after 1 turn
- [ ] **Expected:** Game log shows "captured node"
- [ ] Move to enemy node
- [ ] End turn without moving
- [ ] **Expected:** Node becomes owned after 1 turn

### **Despawn**
- [ ] Spawn program on owned node
- [ ] Click program to select it
- [ ] Click "DESPAWN" button
- [ ] **Expected:** Confirmation dialog appears
- [ ] Confirm despawn
- [ ] **Expected:** Program removed
- [ ] **Expected:** Energy refunded (if on owned node)
- [ ] **Expected:** Processor usage decreases
- [ ] **Expected:** Game log shows despawn + refund
- [ ] **Test:** Despawn on neutral node (no refund)
- [ ] **Test:** Despawn on enemy node (no refund)

### **End Turn**
- [ ] Perform actions with programs
- [ ] Click "END_TURN" button
- [ ] **Expected:** Current player switches to playerB
- [ ] **Expected:** AI takes turn automatically
- [ ] **Expected:** Program action points reset to 2
- [ ] **Expected:** CPU action points reset (new round)
- [ ] **Expected:** Turn number increases

### **Freeze Mode**
- [ ] Destroy all connections between CPUs
- [ ] End turn
- [ ] **Expected:** "FREEZE MODE ACTIVATED" in game log
- [ ] **Expected:** Phase changes to 'freeze'
- [ ] Complete full round (both players)
- [ ] **Expected:** Freeze decay applied
- [ ] **Expected:** Both CPUs lose energy
- [ ] **Expected:** Game log shows decay amounts
- [ ] Reconnect CPUs with trace program
- [ ] End turn
- [ ] **Expected:** "Network reconnected" in game log
- [ ] **Expected:** Phase changes back to 'playing'

### **Victory Conditions**
- [ ] Reduce enemy CPU energy to 0
- [ ] **Expected:** "Player A wins - Player B CPU destroyed!"
- [ ] **Expected:** Phase changes to 'gameOver'
- [ ] **Expected:** Winner displayed
- [ ] **Test:** Mutual CPU destruction (should show node count winner)
- [ ] **Test:** Draw scenario (equal nodes, both CPUs at 0)

---

## ✅ FUNCTION-SPECIFIC TESTING

### **Generic Functions**
- [ ] **Attack +1:** Verify attack stat increases by 1
- [ ] **Defense +1:** Verify defense stat increases by 1
- [ ] **Movement +1:** Verify movement stat increases by 1
- [ ] **Energy +1:** Verify energy stat increases by 1 (free)

### **Attack Functions**
- [ ] **Attack +2:** Verify attack stat increases by 2
- [ ] **Attack +1 Defense Dmg -1:** Verify both effects apply
- [ ] **+1 Action Point:** Verify starts with 3 action points

### **Defense Functions**
- [ ] **Defense +2:** Verify defense stat increases by 2
- [ ] **Defense +1 Attack Dmg -1:** Verify both effects apply

### **Trace Functions**
- [ ] **Movement +2:** Verify movement stat increases by 2
- [ ] **Reduce Damage Taken:** (Not yet implemented - future)

---

## ✅ UI/UX TESTING

### **Visual Feedback**
- [ ] Selected program has WHITE ring
- [ ] Connection start node has YELLOW ring + "START" badge
- [ ] Clickable connections turn RED in destroy mode
- [ ] Mine programs show "⚠️ MINE" warning
- [ ] Identified enemy programs show green "IDENTIFIED" status
- [ ] Unidentified enemy programs show "UNIDENTIFIED" status
- [ ] CPU nodes have green glow
- [ ] Owned nodes show correct color (cyan/red/gray)

### **Mobile Responsiveness**
- [ ] Hamburger menu appears on mobile
- [ ] Side menu slides in from left
- [ ] Menu closes after selecting spawn template
- [ ] Menu closes after selecting action
- [ ] Game board scales properly
- [ ] All buttons accessible on mobile

### **Error Handling**
- [ ] Alert shows when trying invalid move
- [ ] Alert shows when trying invalid spawn
- [ ] Alert shows when trying invalid attack
- [ ] No crashes on invalid actions
- [ ] Game log shows error messages

---

## 🐛 Known Issues to Test

### **Fixed Issues:**
- [x] Even grids starting in freeze mode (FIXED)
- [x] Trace connection creation not working (FIXED)
- [x] Enemy program info not showing (FIXED)

### **Potential Issues:**
- [ ] Destroy connection UI - verify clickable connections work
- [ ] Identify mode - verify clicking enemy programs works
- [ ] Mine triggering - verify damage calculation correct
- [ ] Function stat boosts - verify all apply correctly
- [ ] AI respecting new connection system

---

## 📝 Testing Notes

**Test Environment:**
- Grid sizes: 4x4, 5x5, 6x6, 7x7, 8x8
- Browser: Chrome, Firefox, Safari
- Device: Desktop, Tablet, Mobile

**Test Scenarios:**
1. **Quick Game:** Spawn, move, attack, win
2. **Freeze Mode:** Sever network, survive decay
3. **Complex Strategy:** Use all program types, create custom templates
4. **Edge Cases:** Mutual destruction, simultaneous actions, boundary conditions

**Success Criteria:**
- All actions work as expected
- No console errors
- Game log accurate
- UI responsive and clear
- Mobile experience smooth
- AI plays intelligently

---

## ✅ Sign-Off Checklist

- [ ] All offensive actions tested
- [ ] All defensive actions tested
- [ ] All trace actions tested
- [ ] All movement tested
- [ ] All functions tested
- [ ] Freeze mode tested
- [ ] Victory conditions tested
- [ ] UI/UX tested
- [ ] Mobile tested
- [ ] No critical bugs found

**Tested By:** _________________  
**Date:** _________________  
**Version:** v1.0.0  
**Notes:** _________________
