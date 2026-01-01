# SoundManager Integration Guide

This guide shows how to integrate the SoundManager into the game's cutscene system.

## Quick Start

### 1. Import the SoundManager

In `main.js`, add the import:

```javascript
import SoundManager from './audio/SoundManager.js';
```

### 2. Initialize in `init()` function

```javascript
async function init() {
    console.log("Initializing Chandler's Freedom Glizzy Run...");

    // Initialize systems
    SceneManager.init();
    SaveSystem.init();
    await AudioSystem.init();
    await SoundManager.init(); // Add this line

    // ... rest of initialization
}
```

### 3. Integrate with Cutscene System

Modify the `startCutscene()` function to play audio:

```javascript
function startCutscene(dialogueQueue, npcType) {
    State.set('isCutscene', true);
    State.set('isExitingCutscene', false);
    State.set('currentDialogueQueue', dialogueQueue);
    State.set('currentDialogueIndex', 0);

    // Determine which cutscene this is and play appropriate audio
    const levelIdx = State.get('currentLevelIdx');
    let cutsceneKey = 'intro';

    if (levelIdx === 0) cutsceneKey = 'intro';
    else if (levelIdx === 1) cutsceneKey = 'level2';
    else if (levelIdx === 2) cutsceneKey = 'level3';
    else if (levelIdx === 3) cutsceneKey = 'level4';
    else if (levelIdx === 4) cutsceneKey = 'level5';

    // Play cutscene ambient and music
    SoundManager.playCutsceneAudio(cutsceneKey);

    // Hide HUD during cutscene
    HUD.hide();

    // ... rest of function
}
```

### 4. Play Dialogue Sounds

Modify `showNextDialogueLine()` to trigger sound effects:

```javascript
function showNextDialogueLine() {
    const dialogueQueue = State.get('currentDialogueQueue');
    const dialogueIndex = State.get('currentDialogueIndex');

    const container = document.getElementById('bubble-container');
    container.innerHTML = '';

    if (dialogueIndex >= dialogueQueue.length) {
        startExitRun();
        return;
    }

    const line = dialogueQueue[dialogueIndex];
    State.set('autoAdvanceTimer', line.delay);

    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.innerText = line.text;
    bubble.style.display = 'block';
    container.appendChild(bubble);

    // Play sound effect if defined
    if (line.sound) {
        SoundManager.playEffect(line.sound);
    }

    // Play action sound if defined
    if (line.action) {
        SoundManager.playActionSound(line.action);
    }

    State.set('activeBubble', { speaker: line.speaker, action: line.action });
}
```

### 5. Handle Ending Cutscenes

Modify `startEndingDialogue()`:

```javascript
function startEndingDialogue(dialogue) {
    State.set('waitingForOrder', false);
    document.getElementById('interaction-prompt').style.display = 'none';

    State.set('isCutscene', true);
    State.set('currentDialogueQueue', dialogue);
    State.set('currentDialogueIndex', 0);

    // Determine ending type and play appropriate audio
    const coins = State.get('coins');
    const hasEnoughMoney = coins * COIN_VALUE >= GLIZZY_PRICE;
    const cutsceneKey = hasEnoughMoney ? 'ending_good' : 'ending_bad';

    SoundManager.playCutsceneAudio(cutsceneKey);

    // Show cashier
    CharacterSystem.show('cashier');
    CharacterSystem.setPosition('cashier', 0, 0, -5);
    CharacterSystem.setRotation('cashier', 0);

    document.getElementById('cutscene-ui').classList.remove('hidden');
    showNextDialogueLine();
}
```

### 6. Cleanup on Cutscene End

Modify `endCutscene()` to stop cutscene audio:

```javascript
function endCutscene() {
    State.set('isCutscene', false);
    State.set('isExitingCutscene', false);

    // Stop cutscene audio
    SoundManager.stopAmbient();
    SoundManager.stopMusic();

    // Clear dialogue
    document.getElementById('bubble-container').innerHTML = '';
    document.getElementById('cutscene-ui').classList.add('hidden');

    // ... rest of function
}
```

## Sound Effect Reference

### Cutscene Ambient Sounds
- `village_morning` - Intro scene (birds chirping, village sounds)
- `desert_wind` - Level 2 (wind, desert ambience)
- `river_water` - Level 3 (flowing water, river sounds)
- `night_tension` - Level 4 (ominous night sounds)
- `suburban_quiet` - Level 5 (light city ambience)
- `costco_interior` - Ending scenes (store ambience)

### Music Tracks
- `emotional_departure` - Intro scene
- `desert_heat` - Level 2
- `tension_river` - Level 3
- `border_patrol` - Level 4
- `final_stretch` - Level 5
- `sad_ending` - Bad ending
- `victory_theme` - Good ending

### Action Sound Effects
- `jaw_snap` - Alligator snapping jaws
- `scanner_beep` - Border agent scanning
- `drone_launch` - Drones being deployed
- `phone_ring` - Phone call sounds
- `coins_jingle` - Checking pockets/receiving coins
- `victory_jingle` - Victory celebration
- `security_whistle` - Security being called
- `dramatic_sting` - Shock/realization moment
- `coyote_howl` - Coyote howling
- `water_flow` - River flowing
- `gator_hiss` - Alligator hissing
- `walkie_talkie` - Agent radio
- `cash_register` - Register ding
- `glizzy_bite` - Eating the hot dog
- `crowd_cheer` - Celebration
- `splash` - Water splash

## Volume Control

Control volumes for different sound categories:

```javascript
import SoundManager, { SOUND_CATEGORIES } from './audio/SoundManager.js';

// Set volumes (0.0 to 1.0)
SoundManager.setVolume(SOUND_CATEGORIES.AMBIENT, 0.3);
SoundManager.setVolume(SOUND_CATEGORIES.MUSIC, 0.5);
SoundManager.setVolume(SOUND_CATEGORIES.EFFECTS, 0.7);
SoundManager.setVolume(SOUND_CATEGORIES.VOICE, 1.0);

// Get current volume
const musicVolume = SoundManager.getVolume(SOUND_CATEGORIES.MUSIC);

// Mute/unmute
SoundManager.setMuted(true);  // Mute all
SoundManager.setMuted(false); // Unmute all
```

## Advanced Usage

### Playing Effects with Custom Volume and Pitch

```javascript
// Play effect at 50% volume
SoundManager.playEffect('jaw_snap', 0.5);

// Play effect with pitch variation (-1.0 to 1.0)
SoundManager.playEffect('coyote_howl', null, 0.2); // Slightly higher pitch

// Play effect quietly with lower pitch
SoundManager.playEffect('footsteps', 0.3, -0.3);
```

### Controlling Fade Times

```javascript
// Play ambient with 2 second fade in
SoundManager.playAmbient('desert_wind', 2000);

// Play music with 3 second fade in
SoundManager.playMusic('border_patrol', true, 3000);

// Stop ambient with 1 second fade out
SoundManager.stopAmbient(1000);

// Stop all with 0.5 second fade out
SoundManager.stopAll(500);
```

### Debugging Active Sounds

```javascript
// Check what's currently playing
const activeSounds = SoundManager.getActiveSounds();
console.log(activeSounds);
// Output:
// {
//   ambient: { name: 'desert_wind', type: 'ambient', timestamp: 1234567890 },
//   music: { name: 'desert_heat', type: 'music', loop: true, timestamp: 1234567890 },
//   effectsCount: 2
// }
```

## Future Audio Implementation

When actual audio files are added to the project:

1. **Audio Asset Structure**:
```
src/assets/audio/
├── ambient/
│   ├── village_morning.mp3
│   ├── desert_wind.mp3
│   └── ...
├── music/
│   ├── emotional_departure.mp3
│   ├── desert_heat.mp3
│   └── ...
└── effects/
    ├── jaw_snap.mp3
    ├── scanner_beep.mp3
    └── ...
```

2. **Update SoundManager Implementation**:
   - Use Web Audio API for advanced control
   - Implement actual audio loading and playback
   - Add fade in/out using gain nodes
   - Implement pitch shifting with detune
   - Add audio sprite support for efficiency
   - Implement spatial audio for 3D positioning

3. **Performance Optimization**:
   - Use audio sprites to combine small effects
   - Lazy load audio assets
   - Implement audio pooling for frequently used effects
   - Use compressed formats (MP3/OGG) for size
   - Preload critical sounds during initialization

## Testing Without Audio Files

The SoundManager works in "placeholder mode" when no audio files are present:
- All function calls work and log to console
- No errors are thrown
- Can test integration logic before adding actual audio
- Perfect for prototyping and development
