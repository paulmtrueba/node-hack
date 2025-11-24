
# Final Testing Checklist - NODE HACK

## 🎮 Core Game Functionality

### Program Management
- [ ] **Spawn Programs**: Click "ADD" button, create program template, spawn on valid node
- [ ] **Select Programs**: Click on program emoji on board, verify selection (white ring)
- [ ] **Move Programs**: Select program, click adjacent node, verify movement
- [ ] **Program Actions**: Select program, verify action buttons appear in sidebar/menu
- [ ] **Program Stats**: Verify energy, attack, defense, movement display correctly

### Combat & Connections
- [ ] **Create Connections**: Select program, click "CONNECT", select start node, select end node
- [ ] **Destroy Connections**: Select offensive program, click "DESTROY", click adjacent connection
- [ ] **Attack Programs**: Select offensive program, click "ATTACK", target adjacent enemy program
- [ ] **Defend**: Select defensive program, verify defense bonus applies
- [ ] **Trace Programs**: Select trace program, verify special abilities work

### Turn Management
- [ ] **End Turn**: Click "END_TURN", verify turn advances
- [ ] **AI Turn**: Verify AI takes turn automatically after player
- [ ] **Turn Counter**: Verify turn number increments in header
- [ ] **Phase Display**: Verify ACTIVE/FREEZE phase shows correctly

### Win Conditions
- [ ] **CPU Destruction**: Destroy enemy CPU, verify "VICTORY!" message
- [ ] **Player Loss**: Let AI destroy your CPU, verify "DEFEAT!" message
- [ ] **Restart Game**: Click "RESTART", verify game resets properly

---

## 📱 Mobile UX (< 768px)

### Layout & Navigation
- [ ] **Fixed Header**: Verify header stays at top when scrolling menu
- [ ] **Header Content**: Verify "NODE HACK", turn counter, freeze badge visible
- [ ] **Hamburger Menu**: Click menu button (top-right), verify slide-out opens
- [ ] **Menu Close**: Click hamburger again, verify menu closes smoothly
- [ ] **Backdrop**: Click backdrop, verify menu closes
- [ ] **Auto-close**: Spawn program or select action, verify menu closes automatically

### CPU Panels
- [ ] **Visibility**: Verify both CPU panels visible above game board
- [ ] **Side-by-side**: Verify 2-column grid layout
- [ ] **No Overlap**: Verify no overlap with header or game board
- [ ] **Health Display**: Verify CPU health bars update correctly

### Game Board
- [ ] **Scaling**: Verify board scales to fit viewport without scrolling
- [ ] **No Cutoff**: Verify all node borders fully visible (no left/right cutoff)
- [ ] **Touch Controls**: Tap nodes, programs, verify selection works
- [ ] **Coordinates**: Verify [row,col] labels don't overlap with elements
- [ ] **CPU Labels**: Verify "CPU A" and "CPU B" labels visible and positioned correctly

### Mobile Menu Content
- [ ] **Spawn Section**: Verify program spawner visible with templates
- [ ] **Selected Program**: Verify selected program info and actions
- [ ] **Enemy Program**: Verify enemy program details when selected
- [ ] **Game Log**: Verify log scrolls independently (max 200px)
- [ ] **Section Headers**: Verify all section headers visible and styled

### Responsive Behavior
- [ ] **Portrait Mode**: Test in portrait orientation
- [ ] **Landscape Mode**: Test in landscape orientation
- [ ] **Small Screens**: Test on 375px width (iPhone SE)
- [ ] **Large Phones**: Test on 430px width (iPhone 14 Pro Max)

---

## 💻 Desktop UX (≥ 768px)

### Layout & Structure
- [ ] **Fixed Header**: Verify header at top with game info
- [ ] **Header Info**: Verify TURN, PHASE, PLAYER display correctly
- [ ] **Sidebar**: Verify left sidebar (320px) with all sections
- [ ] **No Scrolling**: Verify main game area fits viewport without scrolling
- [ ] **Sidebar Scroll**: Verify sidebar scrolls only if content exceeds height

### Game Board
- [ ] **Centering**: Verify board centered in available space
- [ ] **Scaling**: Verify board scales to fit viewport height
- [ ] **No Cutoff**: Verify all borders visible (no cutoff)
- [ ] **Hover Effects**: Verify hover effects on nodes and programs
- [ ] **Connection Highlights**: Verify connections highlight in destroy mode

### Sidebar Sections
- [ ] **Player A CPU**: Verify CPU panel at top
- [ ] **Spawn Section**: Verify program spawner with templates
- [ ] **Selected Program**: Verify program info and actions
- [ ] **Enemy Program**: Verify enemy program details
- [ ] **Player B CPU**: Verify opponent CPU panel
- [ ] **Game Log**: Verify log scrolls (max 300px)

### Responsive Behavior
- [ ] **1024px Width**: Test at minimum desktop width
- [ ] **1440px Width**: Test at standard laptop width
- [ ] **1920px Width**: Test at full HD width
- [ ] **4K Displays**: Test at 2560px+ width
- [ ] **Vertical Space**: Test at 768px, 1080px, 1440px heights

---

## 🎨 Visual & Animation

### Grid Background
- [ ] **Black Background**: Verify solid black background
- [ ] **Green Grid**: Verify 3 layers of green grid lines
- [ ] **Animated Orbs**: Verify green data packets moving along grid
- [ ] **Parallax Motion**: Verify grid layers move at different speeds
- [ ] **Vignette**: Verify dark vignette at edges
- [ ] **Corner Glows**: Verify green glowing orbs in corners

### Node Styling
- [ ] **Node Colors**: Verify cyan (player), red (enemy), gray (neutral)
- [ ] **Green Rings**: Verify all nodes have green ring borders
- [ ] **CPU Nodes**: Verify CPU nodes have thicker rings (ring-4)
- [ ] **Hover States**: Verify hover effects on interactive nodes
- [ ] **Selected State**: Verify selected programs have white ring

### Animations
- [ ] **Node Spawn**: Verify nodes scale in with stagger
- [ ] **Program Spawn**: Verify programs rotate in
- [ ] **Connection Draw**: Verify connections animate from start to end
- [ ] **Destroy Mode**: Verify red pulsing on destroyable connections
- [ ] **Menu Slide**: Verify smooth 300ms slide animation (mobile)

---

## ♿ Accessibility

### Keyboard Navigation
- [ ] **Tab Order**: Tab through interactive elements in logical order
- [ ] **Focus Indicators**: Verify visible focus rings on all interactive elements
- [ ] **Enter/Space**: Verify buttons activate with Enter/Space keys
- [ ] **Escape**: Verify Escape closes mobile menu

### Screen Reader
- [ ] **Aria Labels**: Verify "Toggle menu" label on hamburger
- [ ] **Semantic HTML**: Verify proper heading hierarchy (h1, h2, h3)
- [ ] **Button Labels**: Verify all buttons have descriptive text
- [ ] **Game State**: Verify game state changes announced

### Visual
- [ ] **Color Contrast**: Verify green text on black meets WCAG AA (4.5:1)
- [ ] **Text Size**: Verify minimum 12px font size (mobile)
- [ ] **Touch Targets**: Verify minimum 44px touch targets (mobile)
- [ ] **Hover vs Touch**: Verify touch interactions don't require hover

---

## 🔄 State Management

### Game State
- [ ] **Program Selection**: Select program, verify state updates
- [ ] **Mode Changes**: Switch modes (spawn/move/connect/destroy), verify UI updates
- [ ] **Turn Changes**: End turn, verify current player switches
- [ ] **Phase Changes**: Trigger freeze mode, verify UI updates

### UI State
- [ ] **Menu State**: Open/close menu, verify state persists correctly
- [ ] **Selection Persistence**: Select program, open menu, verify selection maintained
- [ ] **Responsive State**: Resize window, verify mobile/desktop state switches
- [ ] **Scroll Position**: Scroll sidebar/menu, resize, verify position maintained

---

## 🐛 Edge Cases

### Boundary Conditions
- [ ] **Empty Grid**: Start game, verify empty nodes render correctly
- [ ] **Full Grid**: Fill grid with programs, verify all render
- [ ] **Max Connections**: Create many connections, verify all render
- [ ] **No Programs**: Clear all programs, verify UI handles gracefully

### Viewport Extremes
- [ ] **Very Small**: Test at 320px width (smallest mobile)
- [ ] **Very Large**: Test at 3840px width (4K)
- [ ] **Short Height**: Test at 600px height
- [ ] **Tall Height**: Test at 2160px height (4K vertical)

### Interaction Edge Cases
- [ ] **Rapid Clicks**: Click rapidly, verify no double-actions
- [ ] **Menu Spam**: Open/close menu rapidly, verify smooth behavior
- [ ] **Resize During Action**: Resize while performing action, verify graceful handling
- [ ] **AI Thinking**: Verify UI disabled during AI turn

---

## 📊 Performance

### Rendering
- [ ] **Initial Load**: Verify < 2s to interactive
- [ ] **Animation FPS**: Verify smooth 60fps animations
- [ ] **Grid Background**: Verify no lag with animated orbs
- [ ] **Large Grids**: Test with 7x7 grid, verify performance

### Interactions
- [ ] **Click Response**: Verify < 100ms response to clicks
- [ ] **Menu Animation**: Verify smooth 300ms slide (no jank)
- [ ] **Resize**: Verify smooth recalculation on resize
- [ ] **Scroll**: Verify smooth scrolling in sidebar/menu

---

## ✅ Final Checks

### Cross-Browser (Desktop)
- [ ] **Chrome**: Test all functionality
- [ ] **Firefox**: Test all functionality
- [ ] **Safari**: Test all functionality
- [ ] **Edge**: Test all functionality

### Cross-Browser (Mobile)
- [ ] **iOS Safari**: Test on iPhone
- [ ] **Chrome Mobile**: Test on Android
- [ ] **Firefox Mobile**: Test on Android
- [ ] **Samsung Internet**: Test on Samsung device

### User Flows
- [ ] **New Player**: Complete full game as new player
- [ ] **Quick Game**: Play 5-turn game, verify smooth experience
- [ ] **Mobile Game**: Complete game entirely on mobile
- [ ] **Desktop Game**: Complete game entirely on desktop

---

## 🎯 Success Criteria

### Must Pass
- ✅ All core game functionality works
- ✅ Mobile menu opens/closes smoothly
- ✅ Game board fits viewport without scrolling
- ✅ No visual cutoffs or overlaps
- ✅ Responsive on all screen sizes

### Should Pass
- ✅ Smooth 60fps animations
- ✅ Keyboard navigation works
- ✅ Touch targets are 44px minimum
- ✅ Color contrast meets WCAG AA

### Nice to Have
- ✅ Parallax grid motion
- ✅ Staggered node animations
- ✅ Smooth connection drawing
- ✅ Polished hover states

---

## 📝 Testing Notes

**Date**: ___________
**Tester**: ___________
**Device**: ___________
**Browser**: ___________

### Issues Found:
1. 
2. 
3. 

### Recommendations:
1. 
2. 
3. 

### Overall Assessment:
- [ ] Ready to ship
- [ ] Minor issues (non-blocking)
- [ ] Major issues (blocking)
