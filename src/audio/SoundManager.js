/**
 * Sound Manager for Cutscenes
 * Handles audio playback for dialogue scenes, ambient sounds, and effects
 */

/**
 * Cutscene sound mappings
 * Maps each cutscene to ambient sounds, music tracks, and effects
 */
export const CUTSCENE_SOUNDS = {
    intro: {
        ambient: 'village_morning',
        music: 'emotional_departure',
        effects: ['birds_chirping', 'distant_rooster']
    },
    level2: {
        ambient: 'desert_wind',
        music: 'desert_heat',
        effects: ['coyote_howl', 'tumbleweeds', 'heat_shimmer']
    },
    level3: {
        ambient: 'river_water',
        music: 'tension_river',
        effects: ['jaw_snap', 'splash', 'water_flow', 'gator_hiss']
    },
    level4: {
        ambient: 'night_tension',
        music: 'border_patrol',
        effects: ['drone_hum', 'alarm', 'searchlight', 'scanner_beep', 'drone_launch', 'walkie_talkie']
    },
    level5: {
        ambient: 'suburban_quiet',
        music: 'final_stretch',
        effects: ['phone_ring', 'phone_dial', 'car_pass', 'city_ambience']
    },
    ending_bad: {
        ambient: 'costco_interior',
        music: 'sad_ending',
        effects: ['cash_register', 'buzzer', 'security_whistle', 'coins_jingle', 'crowd_murmur']
    },
    ending_good: {
        ambient: 'costco_interior',
        music: 'victory_theme',
        effects: ['cash_register', 'victory_jingle', 'crowd_cheer', 'coins_jingle', 'glizzy_bite']
    }
};

/**
 * Action-triggered sound mappings
 * Maps dialogue actions to specific sound effects
 */
export const ACTION_SOUNDS = {
    // Level 3: Alligator
    'gator_snap': 'jaw_snap',
    'gator_hiss': 'gator_hiss',

    // Level 4: Border Agent
    'agent_scan': 'scanner_beep',
    'deploy_drones': 'drone_launch',

    // Level 5: Phone calls
    'phone_call': 'phone_ring',
    'phone_dial': 'phone_dial',

    // Ending: Costco
    'check_pockets': 'coins_jingle',
    'victory': 'victory_jingle',
    'call_security': 'security_whistle',
    'shock': 'dramatic_sting',

    // General
    'footsteps': 'running_steps',
    'heartbeat': 'heartbeat_slow'
};

/**
 * Sound categories for volume control
 */
export const SOUND_CATEGORIES = {
    AMBIENT: 'ambient',
    MUSIC: 'music',
    EFFECTS: 'effects',
    VOICE: 'voice'
};

/**
 * Default volume levels (0.0 to 1.0)
 */
const DEFAULT_VOLUMES = {
    [SOUND_CATEGORIES.AMBIENT]: 0.3,
    [SOUND_CATEGORIES.MUSIC]: 0.5,
    [SOUND_CATEGORIES.EFFECTS]: 0.7,
    [SOUND_CATEGORIES.VOICE]: 1.0
};

/**
 * Sound Manager Class
 * Manages all audio playback for the game
 */
class SoundManager {
    constructor() {
        this.volumes = { ...DEFAULT_VOLUMES };
        this.activeSounds = {
            ambient: null,
            music: null,
            effects: []
        };
        this.muted = false;
        this.initialized = false;
    }

    /**
     * Initialize the sound manager
     * @returns {Promise<void>}
     */
    async init() {
        console.log('[SoundManager] Initializing...');

        // Future: Load audio assets, setup Web Audio API context, etc.
        // For now, this is a placeholder for when actual audio files are added

        this.initialized = true;
        console.log('[SoundManager] Ready (placeholder mode)');
        return Promise.resolve();
    }

    /**
     * Play ambient sound loop
     * @param {string} soundName - Name of ambient sound to play
     * @param {number} fadeInDuration - Fade in duration in milliseconds
     */
    playAmbient(soundName, fadeInDuration = 1000) {
        console.log(`[SoundManager] Playing ambient: ${soundName} (fade in: ${fadeInDuration}ms)`);

        // Future implementation:
        // - Stop current ambient sound with fade out
        // - Load and play new ambient sound
        // - Apply fade in effect
        // - Set volume from this.volumes[SOUND_CATEGORIES.AMBIENT]
        // - Store reference in this.activeSounds.ambient

        if (!this.muted) {
            // Placeholder for actual audio playback
            this.activeSounds.ambient = {
                name: soundName,
                type: 'ambient',
                timestamp: Date.now()
            };
        }
    }

    /**
     * Play music track
     * @param {string} trackName - Name of music track to play
     * @param {boolean} loop - Whether to loop the track
     * @param {number} fadeInDuration - Fade in duration in milliseconds
     */
    playMusic(trackName, loop = true, fadeInDuration = 2000) {
        console.log(`[SoundManager] Playing music: ${trackName} (loop: ${loop}, fade in: ${fadeInDuration}ms)`);

        // Future implementation:
        // - Stop current music with fade out
        // - Load and play new music track
        // - Set loop property
        // - Apply fade in effect
        // - Set volume from this.volumes[SOUND_CATEGORIES.MUSIC]
        // - Store reference in this.activeSounds.music

        if (!this.muted) {
            this.activeSounds.music = {
                name: trackName,
                type: 'music',
                loop: loop,
                timestamp: Date.now()
            };
        }
    }

    /**
     * Play sound effect
     * @param {string} effectName - Name of sound effect to play
     * @param {number} volume - Volume override (0.0 to 1.0), uses default if not specified
     * @param {number} pitch - Pitch variation (-1.0 to 1.0), 0 is normal
     * @returns {object} Reference to the playing sound (for stopping/controlling)
     */
    playEffect(effectName, volume = null, pitch = 0) {
        const finalVolume = volume !== null ? volume : this.volumes[SOUND_CATEGORIES.EFFECTS];
        console.log(`[SoundManager] Playing effect: ${effectName} (volume: ${finalVolume}, pitch: ${pitch})`);

        // Future implementation:
        // - Load sound effect audio file
        // - Apply volume and pitch adjustments
        // - Play the effect (non-looping)
        // - Add to this.activeSounds.effects array
        // - Auto-remove when playback completes

        if (!this.muted) {
            const sound = {
                name: effectName,
                type: 'effect',
                volume: finalVolume,
                pitch: pitch,
                timestamp: Date.now()
            };

            this.activeSounds.effects.push(sound);

            // Simulate sound completion and cleanup
            setTimeout(() => {
                const index = this.activeSounds.effects.indexOf(sound);
                if (index > -1) {
                    this.activeSounds.effects.splice(index, 1);
                }
            }, 2000); // Placeholder duration

            return sound;
        }

        return null;
    }

    /**
     * Stop all currently playing sounds
     * @param {number} fadeOutDuration - Fade out duration in milliseconds
     */
    stopAll(fadeOutDuration = 500) {
        console.log(`[SoundManager] Stopping all sounds (fade out: ${fadeOutDuration}ms)`);

        // Future implementation:
        // - Fade out and stop ambient sound
        // - Fade out and stop music
        // - Stop all active sound effects
        // - Clear this.activeSounds

        this.activeSounds = {
            ambient: null,
            music: null,
            effects: []
        };
    }

    /**
     * Stop ambient sound
     * @param {number} fadeOutDuration - Fade out duration in milliseconds
     */
    stopAmbient(fadeOutDuration = 1000) {
        console.log(`[SoundManager] Stopping ambient (fade out: ${fadeOutDuration}ms)`);

        if (this.activeSounds.ambient) {
            // Future: Apply fade out and stop
            this.activeSounds.ambient = null;
        }
    }

    /**
     * Stop music
     * @param {number} fadeOutDuration - Fade out duration in milliseconds
     */
    stopMusic(fadeOutDuration = 2000) {
        console.log(`[SoundManager] Stopping music (fade out: ${fadeOutDuration}ms)`);

        if (this.activeSounds.music) {
            // Future: Apply fade out and stop
            this.activeSounds.music = null;
        }
    }

    /**
     * Set volume for a sound category
     * @param {string} category - Sound category (from SOUND_CATEGORIES)
     * @param {number} level - Volume level (0.0 to 1.0)
     */
    setVolume(category, level) {
        const clampedLevel = Math.max(0, Math.min(1, level));
        console.log(`[SoundManager] Setting ${category} volume to ${clampedLevel}`);

        this.volumes[category] = clampedLevel;

        // Future implementation:
        // - Update volume of all currently playing sounds in this category
        // - Apply the new volume immediately
    }

    /**
     * Get current volume for a category
     * @param {string} category - Sound category
     * @returns {number} Current volume level
     */
    getVolume(category) {
        return this.volumes[category] || 0;
    }

    /**
     * Mute/unmute all sounds
     * @param {boolean} mute - True to mute, false to unmute
     */
    setMuted(mute) {
        console.log(`[SoundManager] ${mute ? 'Muting' : 'Unmuting'} all sounds`);
        this.muted = mute;

        // Future implementation:
        // - If muting: pause all active sounds
        // - If unmuting: resume all active sounds
    }

    /**
     * Check if sounds are muted
     * @returns {boolean}
     */
    isMuted() {
        return this.muted;
    }

    /**
     * Play sounds for a cutscene
     * @param {string} cutsceneKey - Key from CUTSCENE_SOUNDS
     */
    playCutsceneAudio(cutsceneKey) {
        const cutsceneAudio = CUTSCENE_SOUNDS[cutsceneKey];

        if (!cutsceneAudio) {
            console.warn(`[SoundManager] No audio defined for cutscene: ${cutsceneKey}`);
            return;
        }

        console.log(`[SoundManager] Starting cutscene audio: ${cutsceneKey}`);

        // Play ambient sound if defined
        if (cutsceneAudio.ambient) {
            this.playAmbient(cutsceneAudio.ambient);
        }

        // Play music if defined
        if (cutsceneAudio.music) {
            this.playMusic(cutsceneAudio.music);
        }

        // Play initial effects if defined
        if (cutsceneAudio.effects && cutsceneAudio.effects.length > 0) {
            // Play first effect immediately, others randomly during cutscene
            this.playEffect(cutsceneAudio.effects[0]);
        }
    }

    /**
     * Play sound for a dialogue action
     * @param {string} action - Action name from dialogue line
     */
    playActionSound(action) {
        const soundEffect = ACTION_SOUNDS[action];

        if (!soundEffect) {
            console.log(`[SoundManager] No sound mapped for action: ${action}`);
            return;
        }

        console.log(`[SoundManager] Playing action sound: ${action} -> ${soundEffect}`);
        this.playEffect(soundEffect);
    }

    /**
     * Get all active sounds (for debugging)
     * @returns {object} Currently active sounds
     */
    getActiveSounds() {
        return {
            ...this.activeSounds,
            effectsCount: this.activeSounds.effects.length
        };
    }

    /**
     * Clean up resources
     */
    dispose() {
        console.log('[SoundManager] Disposing...');
        this.stopAll(0);

        // Future implementation:
        // - Dispose all audio buffers
        // - Close Web Audio API context
        // - Clear all references

        this.initialized = false;
    }
}

// Create singleton instance
const soundManager = new SoundManager();

// Export singleton instance
export default soundManager;
