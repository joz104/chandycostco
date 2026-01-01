# Dialogue Variations System - Integration Guide

## Overview

The dialogue variation system has been created in `/src/data/dialogueVariations.js` and provides multiple dialogue options for enhanced replayability.

## Features

### 1. **NPC Character Variations** (3 variations each)

#### COYOTE (Level 2)
- **Variation A**: Standard threatening coyote (original)
- **Variation B**: Menacing ("bones of travelers litter this desert...")
- **Variation C**: Mystical fortune-teller ("I have seen your future in the stars...")

#### ALLIGATOR (Level 3)
- **Variation A**: Chicken nugget toll (original)
- **Variation B**: Riddle challenge ("Answer my riddle or become lunch!")
- **Variation C**: Greedy gator ("I'll take your shoes, your shirt, AND your dreams!")

#### AGENT (Level 4)
- **Variation A**: Standard aggressive agent (original)
- **Variation B**: Robotic/drone-like ("SCANNING... UNAUTHORIZED ENTITY DETECTED...")
- **Variation C**: Sympathetic human ("Kid, turn back. It's not worth it. Trust me.")

#### INTRO & PHONE CALL (Levels 1 & 5)
- Each has 3 variations with different emotional tones and humor

### 2. **Coin-Based Ending Variations** (7 different endings!)

| Coins | Money | Ending Type | Description |
|-------|-------|-------------|-------------|
| 0 | $0.00 | BROKE | Empty pockets, maximum desperation |
| 1-2 | $0.25-$0.50 | DESPERATE | Only quarters, begging cashier |
| 3-5 | $0.75-$1.25 | CLOSE | So close but 25 cents short! |
| 6 | $1.50 | EXACT | Perfect! Exact change! |
| 7-9 | $1.75-$2.25 | TIP | Generous tip, extra napkins! |
| 10-14 | $2.50-$3.50 | RICH | Big spender, extra churros! |
| 15+ | $3.75+ | LEGEND | Costco legend, free membership! |

## How to Integrate

### Step 1: Update `dialogue.js`

Replace static dialogue exports with variation-based imports:

```javascript
// In /src/data/dialogue.js
import { getDialogueVariation, getEndingVariation } from './dialogueVariations.js';

// Export functions instead of constants
export function getIntroDialogue(context) {
    return getDialogueVariation('intro', context);
}

export function getL2Dialogue(context) {
    return getDialogueVariation('L2', context);
}

export function getL3Dialogue(context) {
    return getDialogueVariation('L3', context);
}

export function getL4Dialogue(context) {
    return getDialogueVariation('L4', context);
}

export function getL5Dialogue(context) {
    return getDialogueVariation('L5', context);
}

export function getEndingDialogue(coins) {
    return getEndingVariation(coins);
}

// Keep backward compatibility with existing imports
export const DIALOGUE_INTRO = getIntroDialogue();
export const DIALOGUE_L2 = getL2Dialogue();
export const DIALOGUE_L3 = getL3Dialogue();
export const DIALOGUE_L4 = getL4Dialogue();
export const DIALOGUE_L5 = getL5Dialogue();
export const DIALOGUE_ENDING = getEndingVariation(0);
export const DIALOGUE_ENDING_HAPPY = getEndingVariation(6);
```

### Step 2: Update `levels.js`

Modify level definitions to use dynamic dialogue:

```javascript
// In /src/data/levels.js
import { getDialogueVariation } from './dialogueVariations.js';

export const LEVELS = [
    {
        id: 0,
        name: "HOME",
        length: 1000,
        color: 0x87CEEB,
        fog: 0xB0E0E6,
        speed: 18,
        groundColor: 0xC19A6B,
        cutscene: () => getDialogueVariation('intro'), // Function instead of constant
        npc: "mom",
        // ... rest of config
    },
    // ... other levels
];
```

### Step 3: Update `main.js` - Key Changes

#### A. Add coin tracking to State

```javascript
// Initialize coin counter
State.set('coins', 0);
```

#### B. Update coin collection logic

```javascript
// In updateGameplay() when collecting coins
if (col.userData.type === 'coin') {
    State.increment('coins');
    HUD.updateCoins(); // Add this to HUD
    AudioSystem.playSound('coin');
    Popups.showPopup('+$0.25', '#FFD700');
    // ... rest of collection logic
}
```

#### C. Update cutscene start to use variations

```javascript
// In startCutscene()
function startCutscene(dialogueGetter, npcType) {
    // Get dialogue based on current context
    const context = {
        playCount: SaveSystem.getGamesPlayed(),
        coins: State.get('coins'),
        difficulty: currentDifficulty
    };

    const dialogueQueue = typeof dialogueGetter === 'function'
        ? dialogueGetter(context)
        : dialogueGetter;

    State.set('currentDialogueQueue', dialogueQueue);
    // ... rest of cutscene setup
}
```

#### D. Update ending dialogue selection

```javascript
// In handleInteraction() at Costco
function handleInteraction() {
    if (State.get('waitingForOrder')) {
        const coins = State.get('coins');

        // Use variation system for ending
        const dialogue = getEndingVariation(coins);
        startEndingDialogue(dialogue);
    }
}
```

### Step 4: Update HUD to show coins

```javascript
// In /src/ui/HUD.js
export function updateCoins() {
    const coins = State.get('coins');
    const money = (coins * 0.25).toFixed(2);
    document.getElementById('coin-display').textContent = `$${money}`;
}
```

Add to your HTML:
```html
<div id="coin-display" class="hud-item">$0.00</div>
```

## Testing the System

### Console Commands for Testing

```javascript
// Preview all variations for a dialogue
import { previewAllVariations } from './src/data/dialogueVariations.js';
previewAllVariations('L2');
previewAllVariations('ending');

// Test specific variation
import { getSpecificVariation } from './src/data/dialogueVariations.js';
const coyoteB = getSpecificVariation('L2', 1);

// Test random variation
import { getRandomVariation } from './src/data/dialogueVariations.js';
const randomIntro = getRandomVariation('intro');

// Test ending with specific coin count
import { getEndingVariation } from './src/data/dialogueVariations.js';
const richEnding = getEndingVariation(12);
```

### Dev Menu Addition

Add variation selector to dev menu:

```javascript
// In setupDevMenu()
const variationButtons = [
    { label: 'Variation A', index: 0 },
    { label: 'Variation B', index: 1 },
    { label: 'Variation C', index: 2 }
];

variationButtons.forEach(btn => {
    // Create button to force specific variation
    // Useful for testing all dialogue options
});
```

## Variation Selection Logic

### How Variations are Chosen

The system automatically cycles through variations based on **play count**:

- **Plays 0-2**: Variation A (original dialogue)
- **Plays 3-5**: Variation B (alternate personality)
- **Plays 6-8**: Variation C (third personality)
- **Plays 9+**: Cycles back to A, then B, then C...

This ensures players see different dialogue on subsequent playthroughs!

### Ending Selection

Endings are **always** based on coins collected, not play count. This creates a dynamic ending system where:

- Players who collect few coins get the sad endings
- Players who collect all coins get rewarded with epic endings
- There's motivation to replay and collect ALL coins

## Benefits

1. **Replayability**: Players experience new dialogue each playthrough
2. **Coin Incentive**: 7 different endings motivate collecting coins
3. **Character Depth**: NPCs have multiple personalities (threatening, mystical, sympathetic)
4. **Humor Variety**: Different jokes and references keep things fresh
5. **Progressive Rewards**: More coins = funnier, more satisfying endings

## Future Expansion Ideas

- Add variations based on difficulty level
- Special dialogue if player takes no damage
- Speed-run specific dialogue for fast completions
- Holiday-themed dialogue variations
- Unlock secret variations at high player levels

## File Locations

- **Variation System**: `/src/data/dialogueVariations.js`
- **Integration Points**: `/src/main.js`, `/src/data/dialogue.js`, `/src/data/levels.js`
- **This Guide**: `/DIALOGUE_VARIATIONS_INTEGRATION.md`

---

**Created**: 2025-12-23
**System**: Dialogue Variations v1.0
**Status**: Ready for integration
