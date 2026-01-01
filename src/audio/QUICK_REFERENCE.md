# SoundManager Quick Reference Card

## Import & Initialize

```javascript
import SoundManager from './audio/SoundManager.js';
await SoundManager.init();
```

---

## Play Cutscene Audio

```javascript
// Automatically plays ambient + music for a cutscene
SoundManager.playCutsceneAudio('intro');      // Intro scene
SoundManager.playCutsceneAudio('level2');     // Desert/Coyote
SoundManager.playCutsceneAudio('level3');     // River/Alligator
SoundManager.playCutsceneAudio('level4');     // Wall/Agent
SoundManager.playCutsceneAudio('level5');     // Suburbia/Mama
SoundManager.playCutsceneAudio('ending_bad'); // Bad ending
SoundManager.playCutsceneAudio('ending_good');// Good ending
```

---

## Play Individual Sounds

```javascript
// Ambient (loops)
SoundManager.playAmbient('village_morning');
SoundManager.playAmbient('desert_wind');
SoundManager.playAmbient('river_water');
SoundManager.playAmbient('night_tension');
SoundManager.playAmbient('suburban_quiet');
SoundManager.playAmbient('costco_interior');

// Music (loops)
SoundManager.playMusic('emotional_departure');
SoundManager.playMusic('desert_heat');
SoundManager.playMusic('tension_river');
SoundManager.playMusic('border_patrol');
SoundManager.playMusic('final_stretch');
SoundManager.playMusic('sad_ending');
SoundManager.playMusic('victory_theme');

// Effects (one-shot)
SoundManager.playEffect('jaw_snap');
SoundManager.playEffect('scanner_beep');
SoundManager.playEffect('drone_launch');
SoundManager.playEffect('phone_ring');
SoundManager.playEffect('coins_jingle');
SoundManager.playEffect('victory_jingle');
SoundManager.playEffect('security_whistle');
SoundManager.playEffect('dramatic_sting');
SoundManager.playEffect('coyote_howl');
SoundManager.playEffect('water_flow');
SoundManager.playEffect('gator_hiss');
SoundManager.playEffect('splash');
SoundManager.playEffect('walkie_talkie');
SoundManager.playEffect('cash_register');
SoundManager.playEffect('glizzy_bite');
SoundManager.playEffect('crowd_cheer');
```

---

## Play Action Sounds

```javascript
// From dialogue actions - automatically mapped
SoundManager.playActionSound('gator_snap');
SoundManager.playActionSound('agent_scan');
SoundManager.playActionSound('deploy_drones');
SoundManager.playActionSound('phone_call');
SoundManager.playActionSound('check_pockets');
SoundManager.playActionSound('victory');
SoundManager.playActionSound('call_security');
SoundManager.playActionSound('shock');
```

---

## Volume Control

```javascript
import { SOUND_CATEGORIES } from './audio/SoundManager.js';

// Set volume (0.0 to 1.0)
SoundManager.setVolume(SOUND_CATEGORIES.AMBIENT, 0.3);
SoundManager.setVolume(SOUND_CATEGORIES.MUSIC, 0.5);
SoundManager.setVolume(SOUND_CATEGORIES.EFFECTS, 0.7);
SoundManager.setVolume(SOUND_CATEGORIES.VOICE, 1.0);

// Get volume
const vol = SoundManager.getVolume(SOUND_CATEGORIES.MUSIC);

// Mute/unmute
SoundManager.setMuted(true);  // Mute all
SoundManager.setMuted(false); // Unmute all

// Check mute status
const isMuted = SoundManager.isMuted();
```

---

## Stop Sounds

```javascript
// Stop everything (with 500ms fade out)
SoundManager.stopAll(500);

// Stop specific categories
SoundManager.stopAmbient(1000);  // 1 second fade
SoundManager.stopMusic(2000);    // 2 second fade
```

---

## Advanced Effects

```javascript
// Custom volume for single effect
SoundManager.playEffect('jaw_snap', 0.5); // 50% volume

// Pitch variation
SoundManager.playEffect('coyote_howl', null, 0.2);  // Higher pitch
SoundManager.playEffect('coyote_howl', null, -0.3); // Lower pitch

// Both volume and pitch
SoundManager.playEffect('footsteps', 0.3, -0.1);
```

---

## Debugging

```javascript
// Check what's playing
console.log(SoundManager.getActiveSounds());

// Output:
// {
//   ambient: { name: 'desert_wind', type: 'ambient', timestamp: 123456 },
//   music: { name: 'desert_heat', type: 'music', loop: true },
//   effectsCount: 2
// }

// Check initialization
console.log(SoundManager.initialized); // true/false
```

---

## Integration Example

```javascript
// In main.js - showNextDialogueLine()

function showNextDialogueLine() {
    // ... existing code ...

    const line = dialogueQueue[dialogueIndex];

    // Add these lines:
    if (line.sound) {
        SoundManager.playEffect(line.sound);
    }
    if (line.action) {
        SoundManager.playActionSound(line.action);
    }

    // ... rest of code ...
}
```

---

## Dialogue Sound Property

```javascript
// In dialogue.js files
{
    speaker: "Alligator",
    text: "SNAP SNAP. Tasty toes.",
    delay: 3000,
    action: "gator_snap",
    sound: "jaw_snap"  // Triggers sound effect
}
```

---

## Default Volumes

- Ambient: 30% (0.3)
- Music: 50% (0.5)
- Effects: 70% (0.7)
- Voice: 100% (1.0)

---

## Fade Times

- Ambient: 1000ms default
- Music: 2000ms default
- Effects: No fade (instant)
- Stop All: 500ms default

---

## Sound Categories

```javascript
SOUND_CATEGORIES.AMBIENT  // Background loops
SOUND_CATEGORIES.MUSIC    // Music tracks
SOUND_CATEGORIES.EFFECTS  // Sound effects
SOUND_CATEGORIES.VOICE    // Voice/dialogue (future)
```

---

## Common Patterns

### Starting a Cutscene
```javascript
SoundManager.playCutsceneAudio('level3');
```

### Transitioning Between Cutscenes
```javascript
SoundManager.stopAll(500);
setTimeout(() => {
    SoundManager.playCutsceneAudio('level4');
}, 600);
```

### Playing Effect on Dialogue
```javascript
if (line.sound) SoundManager.playEffect(line.sound);
```

### Volume Slider Handler
```javascript
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    SoundManager.setVolume(SOUND_CATEGORIES.MUSIC, volume);
});
```

### Mute Toggle Button
```javascript
muteButton.addEventListener('click', () => {
    const currentlyMuted = SoundManager.isMuted();
    SoundManager.setMuted(!currentlyMuted);
});
```

---

## File Paths (Future)

When adding audio files, use this structure:

```
src/assets/audio/
├── ambient/
│   └── village_morning.mp3
├── music/
│   └── emotional_departure.mp3
└── effects/
    └── jaw_snap.mp3
```

---

## Browser Compatibility

Works with:
- Chrome/Edge (Web Audio API)
- Firefox (Web Audio API)
- Safari (Web Audio API)
- Mobile browsers (requires user interaction)

Note: Most browsers require user interaction before playing audio. SoundManager handles this automatically when properly integrated.

---

## Error Handling

```javascript
try {
    await SoundManager.init();
    SoundManager.playEffect('jaw_snap');
} catch (error) {
    console.error('Audio error:', error);
    // Gracefully degrade - game still works without audio
}
```

---

## Placeholder Mode

Currently, SoundManager operates in "placeholder mode":
- All functions work and log to console
- No actual audio playback (until files added)
- No errors or crashes
- Perfect for testing game flow
- Ready for audio file integration

---

## Need Help?

- Full documentation: `INTEGRATION_GUIDE.md`
- Sound design: `SOUND_DESIGN.md`
- Overview: `README.md`
- Summary: `SUMMARY.md`
