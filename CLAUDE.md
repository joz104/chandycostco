# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Chandler's Freedom Glizzy Run** is an endless runner game built with Three.js. The game follows Chandler through 5 progressively challenging levels to reach Costco for a "Freedom Glizzy" (hot dog).

**Architecture:** Single-file HTML game (1,325 lines) - no build process required.

## File Structure

```
chandycostco/
├── index.html          # Complete game (HTML + CSS + JavaScript)
├── CLAUDE.md           # This file
└── node_modules/       # Dependencies (vite, vitest, three) - currently unused
```

## How to Run

Open `index.html` directly in a modern web browser (Chrome, Firefox, Edge, Safari). No build process or server required.

The game requires:
- WebGL support
- JavaScript enabled
- Three.js r128 (loaded from CDN)
- "Press Start 2P" font (loaded from Google Fonts)

## Code Architecture

### High-Level Structure

The entire game is contained in `index.html`:

1. **HTML** (lines 1-100): UI elements, HUD, modal screens
2. **CSS** (lines 7-55): Embedded styling with pixel-art aesthetic
3. **JavaScript** (lines 101-1325): Game logic wrapped in IIFE

### Core Game Systems

**Player System** - Character model built from Three.js primitives (boxes, spheres, cylinders):
- Lane-based movement (3 lanes: left -6, center 0, right 6)
- Jump mechanic with double-jump support
- Slide mechanic for ducking under obstacles
- Simple animations via rotation/position tweening

**Level System** - 5 progressive chapters:
- Each level has unique theme, speed, length, and obstacles
- Cutscenes with dialogue between levels
- Dynamic environment changes (fog color, ground color, theme)
- Level data stored in `LEVELS` array (~line 630)

**Obstacle System** - Procedurally spawned based on current level:
- Different obstacle types per level (walls, cacti, cars, etc.)
- AABB collision detection
- Obstacles removed when `position.z > 20` to prevent memory leaks

**Cutscene System** - Story-driven narrative:
- Dialogue arrays for each cutscene (intro, levels 1-5, ending)
- NPC characters: Mom, Coyote, Alligator, Border Agent
- Auto-advancing with tap-to-speed-up functionality

**State Management:**
- `currentLevel`: Active level (1-5)
- `lives`: Player health (starts at 3)
- `score`: Distance traveled in meters
- `gameState`: Flow control (start → playing → cutscene → game over/victory)
- `isInvincible`: Temporary invincibility after taking damage (1.5s)

### Key Functions

- `init()`: Initializes Three.js scene, camera, renderer, lighting (~line 770)
- `startGame()`: Resets state and begins gameplay
- `update(dt)`: Main game loop - player movement, obstacle spawning, collision
- `animate()`: RequestAnimationFrame loop that calls update() and renders
- `createPlayer()`: Builds player character from primitives (~line 420)
- `spawnObstacle()`: Generates obstacles based on current level
- `startCutscene(dialogue)`: Triggers story sequences

### Three.js Usage

- **Materials:** Pre-defined constants (e.g., `MAT_ROAD_YELLOW`, `MAT_HOUSE_WALL_1`)
- **Geometry:** BoxGeometry, SphereGeometry, ConeGeometry, CylinderGeometry
- **Groups:** Entities organized in THREE.Group for hierarchical transformations
- **Lighting:** HemisphereLight + DirectionalLight with shadow mapping (2048x2048)
- **Camera:** PerspectiveCamera positioned behind player with smooth following

## Development Features

### Dev Menu

In-game developer menu (top-right corner) allows:
- Jumping to any level
- Jumping directly to ending sequence
- Quick testing without playing through entire game

Access via the "🛠️ DEV MENU" button in the top-right corner.

### Console Debugging

Browser console variables for testing:
```javascript
currentLevel = 3;      // Jump to specific level
isInvincible = true;   // Toggle invincibility
lives = 10;            // Modify health
score = 4500;          // Fast-forward progress
```

Three.js debugging:
```javascript
scene.children         // Inspect all game objects
obstacles             // View active obstacles array
player.position       // Track player location
```

## Game Balance Constants

- **Lives:** 3 hearts (1 lost per collision, 1.5s invincibility after hit)
- **Speed:** 18 → 30 (increases each level)
- **Level Lengths:** 1000m → 5000m (progressively longer)
- **Lane System:** 3 lanes at x positions: -6, 0, 6
- **Jump Velocity:** 14 units (allows double jump)
- **Slide Duration:** 0.5 seconds

## Naming Conventions

- **Constants:** `UPPER_SNAKE_CASE` (e.g., `DIALOGUE_INTRO`, `LEVELS`)
- **Variables:** `camelCase` (e.g., `playerMeshGroup`, `currentLevel`)
- **Functions:** `camelCase` (e.g., `createPlayer`, `spawnObstacle`)
- **Materials:** `MAT_` prefix (e.g., `MAT_ROAD_YELLOW`)

## Common Modifications

### Adding New Levels

Edit the `LEVELS` array (~line 630):

```javascript
{
  id: 6,
  name: "NEW LEVEL",
  length: 6000,           // Distance to complete
  color: 0xHEXCODE,       // Sky color
  fog: 0xHEXCODE,         // Fog color
  speed: 35,              // Game speed
  groundColor: 0xHEXCODE, // Ground color
  cutscene: DIALOGUE_L6,  // Define dialogue array first
  npc: "character_name"   // NPC to display
}
```

### Adding New Obstacles

Modify `spawnObstacle()` function:

```javascript
const obstacleGeo = new THREE.BoxGeometry(width, height, depth);
const obstacle = new THREE.Mesh(obstacleGeo, someMaterial);
obstacle.position.set(lane, yPosition, -50);
obstacle.castShadow = true;
scene.add(obstacle);
obstacles.push(obstacle);
```

### Adjusting Difficulty

- Obstacle spawn rate: Controlled by `Math.random()` checks in `update()`
- Speed per level: `LEVELS[n].speed`
- Level length: `LEVELS[n].length`
- Initial lives: Set in `startGame()` function

## Performance Considerations

- **Object Pooling:** Obstacles removed at `z > 20` to prevent memory leaks
- **Shadow Mapping:** 2048x2048 shadow map, optimized for performance
- **Geometry Reuse:** Materials defined once and reused
- **Simple Primitives:** Basic geometries maintain 60fps target

## Mobile Support

The game includes mobile-specific features:
- Responsive viewport configuration
- Touch event handlers for lane switching
- Tap-to-start and tap-to-continue
- On-screen control hints
- User-select disabled to prevent text selection

## Browser Compatibility

- Requires WebGL support
- Uses Three.js r128 from CDN
- ES5 JavaScript for broad compatibility
- Tested on Chrome, Firefox, Edge, Safari (desktop and mobile)

## Special Visual Effects

- **Fuego Effect:** Red pulsing border during invincibility
- **Damage Overlay:** Red flash when taking damage
- **Speech Bubbles:** HTML-based dialogue overlays above NPCs
- **Popup Text:** Animated floating text for events (+1 LIFE, etc.)
- **City Lights:** Particle system using THREE.Points in suburbia level
- **Progress Bar:** Real-time visual progress through current level
