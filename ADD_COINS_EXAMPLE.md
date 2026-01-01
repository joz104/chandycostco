# Adding Coin Collectibles - Implementation Example

The dialogue variation system relies on coin collection. Here's how to add coins to your game.

## Step 1: Add Coin Type to spawnCollectible()

```javascript
// In /src/main.js - Update spawnCollectible() function

function spawnCollectible() {
    const scene = SceneManager.getScene();
    const lane = Math.floor(Math.random() * 3) - 1;
    const xPos = lane * LANE_WIDTH;

    const group = new THREE.Group();

    // UPDATED: New probability distribution
    // 60% coins, 25% water, 15% chili
    const rand = Math.random();
    let type;

    if (rand > 0.40) {
        type = 'coin';
    } else if (rand > 0.15) {
        type = 'water';
    } else {
        type = 'chili';
    }

    if (type === 'water') {
        // Existing water jug code
        const jugMat = new THREE.MeshStandardMaterial({
            color: 0x00BFFF,
            transparent: true,
            opacity: 0.8,
            roughness: 0.1
        });
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), jugMat);
        body.position.y = 1.0;
        group.add(body);
        group.userData.type = 'water';

    } else if (type === 'chili') {
        // Existing chili code
        const chiliMat = new THREE.MeshStandardMaterial({ color: 0xFF0000, emissive: 0x550000 });
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 8), chiliMat);
        body.rotation.x = Math.PI;
        body.rotation.z = -0.5;
        body.position.y = 1.0;
        group.add(body);

        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.3),
            new THREE.MeshBasicMaterial({ color: 0x00aa00 })
        );
        stem.position.set(0.1, 1.4, 0);
        stem.rotation.z = -0.5;
        group.add(stem);
        group.userData.type = 'chili';

    } else {
        // NEW: Coin collectible
        const coinMat = new THREE.MeshStandardMaterial({
            color: 0xFFD700,      // Gold color
            emissive: 0x443300,   // Slight glow
            metalness: 0.8,
            roughness: 0.2
        });

        // Coin disc (thin cylinder)
        const coinBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.08, 16),
            coinMat
        );
        coinBody.rotation.z = Math.PI / 2; // Rotate to face player
        coinBody.position.y = 1.0;
        group.add(coinBody);

        // Optional: Add dollar sign emblem
        const dollarMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const dollarSign = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.4, 0.02),
            dollarMat
        );
        dollarSign.position.set(0, 1.0, 0.05);
        group.add(dollarSign);

        const dollarCross = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.08, 0.02),
            dollarMat
        );
        dollarCross.position.set(0, 1.0, 0.05);
        group.add(dollarCross);

        group.userData.type = 'coin';
    }

    group.position.set(xPos, 0, OBSTACLE_SPAWN_Z);
    group.userData.bobOffset = Math.random() * Math.PI;

    scene.add(group);
    collectibles.push(group);
}
```

## Step 2: Update Collection Logic

```javascript
// In /src/main.js - Update the collectibles loop in updateGameplay()

// Update collectibles
const player = PlayerSystem.getPlayer();
for (let i = collectibles.length - 1; i >= 0; i--) {
    const col = collectibles[i];
    col.position.z += moveDist;

    // Bobbing animation
    col.children.forEach(child => {
        child.position.y = 1.0 + Math.sin(Date.now() * 0.005 + col.userData.bobOffset) * 0.3;
    });

    // Coins should spin, others should rotate slowly
    if (col.userData.type === 'coin') {
        col.rotation.y += dt * 4; // Fast spin for coins
    } else {
        col.rotation.y += dt * 2; // Slow rotation for others
    }

    // Collection check
    const dist = col.position.distanceTo(player.position);
    if (dist < 1.5) {
        if (col.userData.type === 'water') {
            // Add life (capped)
            if (State.get('lives') < MAX_LIVES) {
                State.increment('lives');
                Popups.showLifeGained();
            } else {
                State.increment('score', WATER_BONUS_POINTS);
                Popups.showBonus('WATER', WATER_BONUS_POINTS);
            }

        } else if (col.userData.type === 'chili') {
            PlayerSystem.setInvincible();

        } else if (col.userData.type === 'coin') {
            // NEW: Collect coin
            State.increment('coins');
            Popups.showPopup('+$0.25', '#FFD700');
            AudioSystem.playSound('coin'); // Add coin sound if available
            HUD.updateCoins();
        }

        SaveSystem.recordCollectible();
        scene.remove(col);
        collectibles.splice(i, 1);
        continue;
    }

    // Despawn
    if (col.position.z > OBSTACLE_DESPAWN_Z) {
        scene.remove(col);
        collectibles.splice(i, 1);
    }
}
```

## Step 3: Update HUD to Display Coins

```javascript
// In /src/ui/HUD.js

export function updateCoins() {
    const coins = State.get('coins');
    const money = (coins * 0.25).toFixed(2);
    const coinDisplay = document.getElementById('coin-display');

    if (coinDisplay) {
        coinDisplay.textContent = `$${money}`;

        // Optional: Add visual feedback when collecting
        coinDisplay.classList.add('coin-collected');
        setTimeout(() => {
            coinDisplay.classList.remove('coin-collected');
        }, 300);
    }
}

export function init() {
    // ... existing init code
    updateCoins(); // Initialize coin display
}
```

## Step 4: Add Coin Display to HTML

```html
<!-- In your index.html HUD section -->
<div id="hud" class="hidden">
    <div class="hud-top">
        <div id="lives-display" class="hud-item">
            <!-- Existing hearts display -->
        </div>

        <!-- NEW: Coin display -->
        <div id="coin-display" class="hud-item coin-hud">
            $0.00
        </div>

        <div id="score-display" class="hud-item">
            <!-- Existing score -->
        </div>
    </div>

    <!-- Rest of HUD -->
</div>
```

## Step 5: Add CSS Styling for Coins

```css
/* In your CSS */
.coin-hud {
    font-size: 1.5rem;
    color: #FFD700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.6);
    border: 2px solid #FFD700;
    border-radius: 8px;
}

.coin-collected {
    animation: coin-bounce 0.3s ease-out;
}

@keyframes coin-bounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); color: #FFED4E; }
    100% { transform: scale(1); }
}
```

## Step 6: Initialize Coin State

```javascript
// In /src/main.js - startGame() function

function startGame() {
    console.log("Starting game...");

    // Reset state
    State.reset();
    State.set('coins', 0); // NEW: Initialize coins to 0
    SaveSystem.recordGamePlayed();

    // ... rest of function
}
```

## Step 7: Update Constants (Optional)

```javascript
// In /src/data/constants.js

export const COIN_VALUE = 0.25; // Each coin is worth 25 cents
export const GLIZZY_PRICE = 1.50; // Need $1.50 for hotdog
export const COINS_NEEDED = 6; // Need 6 coins for exact change

export const COIN_SPAWN_RATE = 0.6; // 60% chance
export const WATER_SPAWN_RATE = 0.25; // 25% chance
export const CHILI_SPAWN_RATE = 0.15; // 15% chance
```

## Spawn Rate Recommendations

### Easy Difficulty
- Coins: 70% spawn rate
- More frequent spawns
- Goal: Players should easily get 10+ coins

### Normal Difficulty
- Coins: 60% spawn rate (current example)
- Balanced spawns
- Goal: Players can get 6-8 coins with attention

### Hard Difficulty
- Coins: 40% spawn rate
- Less frequent spawns
- Goal: Getting 6 exact coins is a challenge

## Visual Coin Design Alternatives

### Option 1: Quarter (Realistic)
```javascript
// Silver coin with ridged edges
const coinMat = new THREE.MeshStandardMaterial({
    color: 0xC0C0C0,
    metalness: 0.9,
    roughness: 0.1
});
```

### Option 2: Gold Coin (Fantasy)
```javascript
// Bright gold with shine (current example)
const coinMat = new THREE.MeshStandardMaterial({
    color: 0xFFD700,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x443300
});
```

### Option 3: Dollar Bill (Whimsical)
```javascript
// Green rectangular bill
const billMat = new THREE.MeshStandardMaterial({
    color: 0x85bb65,
    roughness: 0.8
});
const bill = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.3, 0.02),
    billMat
);
```

## Sound Effects (Optional)

```javascript
// Add coin collection sound
AudioSystem.playSound('coin', {
    volume: 0.5,
    pitch: 1.0 + (State.get('coins') * 0.05) // Pitch increases with each coin
});
```

Recommended sound: Classic "ding" or "ping" sound effect.

## Testing Checklist

- [ ] Coins spawn in all 3 lanes
- [ ] Coins are visible and distinct from other collectibles
- [ ] Coin counter updates on collection
- [ ] Coin counter displays correctly in HUD
- [ ] Visual feedback (animation) on coin collection
- [ ] Coin count persists through levels
- [ ] Coin count resets on new game
- [ ] All 7 endings work based on coin count (0, 2, 5, 6, 8, 12, 20)
- [ ] Coins bob and spin visually
- [ ] Coins despawn after passing player

## Advanced: Coin Trails

For extra visual flair, add a particle trail:

```javascript
// When collecting coin
EffectsSystem.spawnCoinBurst(col.position.x, col.position.y, col.position.z);
```

```javascript
// In EffectsSystem
export function spawnCoinBurst(x, y, z) {
    const particleCount = 8;
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xFFD700,
        size: 0.15,
        transparent: true,
        opacity: 1
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animate particles outward and fade
    // ... animation logic
}
```

---

## Summary

With coins implemented, players will:

1. **See coins spawn** frequently during gameplay (60% of collectibles)
2. **Collect coins** by running into them (+$0.25 each)
3. **Track progress** via HUD showing current money ($0.00 → $1.50 → $3.75+)
4. **Reach ending** and see dialogue vary based on total collected
5. **Replay** to try collecting all coins for the LEGEND ending

This creates a **skill-based progression system** where:
- Casual players: 3-5 coins (CLOSE ending)
- Skilled players: 6 coins (EXACT ending)
- Master players: 10+ coins (RICH/LEGEND endings)

Combined with the dialogue variation system, this ensures every playthrough feels fresh and rewarding!
