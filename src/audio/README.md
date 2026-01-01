# Audio System

Sound design framework for Chandler's Freedom Glizzy Run cutscenes.

## Overview

The SoundManager provides a complete audio system for managing cutscene sounds, including:
- **Ambient loops** - Environmental background sounds
- **Music tracks** - Emotional musical scores
- **Sound effects** - One-shot effects triggered by dialogue actions
- **Volume control** - Per-category volume management
- **Fade transitions** - Smooth audio crossfading

## Files

- **SoundManager.js** - Main audio management class (singleton)
- **INTEGRATION_GUIDE.md** - Detailed integration instructions
- **README.md** - This file

## Key Features

### 1. Cutscene Sound Mappings

Each cutscene has predefined audio that automatically plays:

```javascript
CUTSCENE_SOUNDS = {
    intro: { ambient, music, effects },
    level2: { ambient, music, effects },
    level3: { ambient, music, effects },
    level4: { ambient, music, effects },
    level5: { ambient, music, effects },
    ending_bad: { ambient, music, effects },
    ending_good: { ambient, music, effects }
}
```

### 2. Action-Triggered Effects

Dialogue actions automatically trigger sound effects:

```javascript
ACTION_SOUNDS = {
    'gator_snap' -> 'jaw_snap',
    'agent_scan' -> 'scanner_beep',
    'deploy_drones' -> 'drone_launch',
    'phone_call' -> 'phone_ring',
    'check_pockets' -> 'coins_jingle',
    'victory' -> 'victory_jingle',
    // ... and more
}
```

### 3. Volume Categories

Independent volume control for different audio types:

- **AMBIENT** - Background environmental sounds (default: 0.3)
- **MUSIC** - Musical scores (default: 0.5)
- **EFFECTS** - Sound effects (default: 0.7)
- **VOICE** - Voice/dialogue (default: 1.0)

## Quick Usage

```javascript
import SoundManager from './audio/SoundManager.js';

// Initialize
await SoundManager.init();

// Play cutscene audio
SoundManager.playCutsceneAudio('level3');

// Play individual sounds
SoundManager.playAmbient('river_water');
SoundManager.playMusic('tension_river');
SoundManager.playEffect('jaw_snap');

// Play action sound
SoundManager.playActionSound('gator_snap');

// Volume control
SoundManager.setVolume('effects', 0.5);

// Stop sounds
SoundManager.stopAll();
```

## Dialogue Integration

Dialogue lines can include `sound` properties to trigger effects:

```javascript
{
    speaker: "Alligator",
    text: "SNAP SNAP. Tasty toes.",
    delay: 3000,
    action: "gator_snap",
    sound: "jaw_snap"  // This triggers the sound effect
}
```

## Current Status

The SoundManager is currently in **placeholder mode**:
- All functions work and log to console
- No actual audio playback (until audio files are added)
- Full API is ready for integration
- Perfect for testing dialogue and cutscene flow

## Next Steps

To add actual audio:

1. Create audio assets (see INTEGRATION_GUIDE.md)
2. Update SoundManager with Web Audio API implementation
3. Add audio file loading logic
4. Implement actual playback, fading, and effects
5. Test across different browsers and devices

## Sound Design Guidelines

### Ambient Sounds
- **Duration**: Loop seamlessly (30-60 seconds)
- **Volume**: Subtle, non-intrusive
- **Examples**: Desert wind, river flowing, city sounds

### Music Tracks
- **Duration**: 2-4 minutes with loop points
- **Style**: Emotional, matches scene tone
- **Examples**: Emotional departure, tension, victory

### Sound Effects
- **Duration**: Short (0.1-2 seconds)
- **Volume**: Clear and impactful
- **Examples**: Jaw snap, scanner beep, coins

## API Reference

See **INTEGRATION_GUIDE.md** for complete API documentation and integration examples.

## Testing

Test the SoundManager without audio files:

```javascript
// Check initialization
console.log(SoundManager.initialized); // true

// View active sounds
console.log(SoundManager.getActiveSounds());

// Test muting
SoundManager.setMuted(true);
console.log(SoundManager.isMuted()); // true
```

## Browser Compatibility

The SoundManager is designed to work with:
- Chrome/Edge (Web Audio API)
- Firefox (Web Audio API)
- Safari (Web Audio API with quirks)
- Mobile browsers (with user interaction requirement)

Note: Most browsers require user interaction before playing audio. The SoundManager handles this automatically when integrated properly.
