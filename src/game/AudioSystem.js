/**
 * AudioSystem - Sound effects and music management
 */

import State from './StateManager.js';

// Audio context
let audioContext = null;

// Sound effect buffers
const sfxBuffers = new Map();

// Music elements
const musicTracks = new Map();
let currentMusic = null;

// Volume settings
let sfxVolume = 1.0;
let musicVolume = 0.7;
let isMuted = false;

// Sound effect definitions
const SFX = {
    JUMP: 'jump',
    LAND: 'land',
    SLIDE: 'slide',
    HIT: 'hit',
    COLLECT_WATER: 'collect_water',
    COLLECT_CHILI: 'collect_chili',
    COLLECT_COIN: 'collect_coin',
    SMASH: 'smash',
    LEVEL_COMPLETE: 'level_complete',
    GAME_OVER: 'game_over',
    NEAR_MISS: 'near_miss'
};

// Music track definitions
const MUSIC = {
    VILLAGE: 'village',
    DESERT: 'desert',
    RIVER: 'river',
    WALL: 'wall',
    SUBURBIA: 'suburbia',
    COSTCO: 'costco',
    MENU: 'menu'
};

/**
 * Initialize audio system
 */
export async function init() {
    // Create audio context on user interaction
    const initContext = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        document.removeEventListener('click', initContext);
        document.removeEventListener('keydown', initContext);
        document.removeEventListener('touchstart', initContext);
    };

    document.addEventListener('click', initContext);
    document.addEventListener('keydown', initContext);
    document.addEventListener('touchstart', initContext);

    // Load settings from state
    sfxVolume = State.get('settings.sfxVolume');
    musicVolume = State.get('settings.musicVolume');
    isMuted = State.get('settings.muted');

    // Subscribe to settings changes
    State.subscribe('settings.sfxVolume', (v) => { sfxVolume = v; });
    State.subscribe('settings.musicVolume', (v) => {
        musicVolume = v;
        if (currentMusic) {
            currentMusic.volume = isMuted ? 0 : musicVolume;
        }
    });
    State.subscribe('settings.muted', (v) => {
        isMuted = v;
        if (currentMusic) {
            currentMusic.volume = isMuted ? 0 : musicVolume;
        }
    });
}

/**
 * Load a sound effect
 * @param {string} name - Sound name
 * @param {string} url - URL to audio file
 */
export async function loadSFX(name, url) {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        sfxBuffers.set(name, audioBuffer);
    } catch (error) {
        console.warn(`Failed to load SFX: ${name}`, error);
    }
}

/**
 * Play a sound effect
 * @param {string} name - Sound name
 * @param {number} volume - Volume override (0-1)
 */
export function playSFX(name, volume = 1.0) {
    if (isMuted || !audioContext || !sfxBuffers.has(name)) {
        return;
    }

    try {
        const source = audioContext.createBufferSource();
        source.buffer = sfxBuffers.get(name);

        const gainNode = audioContext.createGain();
        gainNode.gain.value = sfxVolume * volume;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start(0);
    } catch (error) {
        console.warn(`Failed to play SFX: ${name}`, error);
    }
}

/**
 * Load a music track
 * @param {string} name - Track name
 * @param {string} url - URL to audio file
 */
export function loadMusic(name, url) {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = isMuted ? 0 : musicVolume;
    musicTracks.set(name, audio);
}

/**
 * Play a music track
 * @param {string} name - Track name
 * @param {boolean} fadeIn - Whether to fade in
 */
export function playMusic(name, fadeIn = true) {
    // Stop current music
    if (currentMusic) {
        stopMusic(true);
    }

    const track = musicTracks.get(name);
    if (!track) {
        console.warn(`Music track not found: ${name}`);
        return;
    }

    currentMusic = track;
    currentMusic.currentTime = 0;

    if (fadeIn) {
        currentMusic.volume = 0;
        currentMusic.play().catch(() => {});
        fadeAudio(currentMusic, 0, isMuted ? 0 : musicVolume, 1000);
    } else {
        currentMusic.volume = isMuted ? 0 : musicVolume;
        currentMusic.play().catch(() => {});
    }
}

/**
 * Stop current music
 * @param {boolean} fadeOut - Whether to fade out
 */
export function stopMusic(fadeOut = true) {
    if (!currentMusic) return;

    if (fadeOut) {
        fadeAudio(currentMusic, currentMusic.volume, 0, 500, () => {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        });
    } else {
        currentMusic.pause();
        currentMusic.currentTime = 0;
    }
}

/**
 * Pause current music
 */
export function pauseMusic() {
    if (currentMusic) {
        currentMusic.pause();
    }
}

/**
 * Resume current music
 */
export function resumeMusic() {
    if (currentMusic) {
        currentMusic.play().catch(() => {});
    }
}

/**
 * Fade audio volume
 */
function fadeAudio(audio, fromVolume, toVolume, duration, callback) {
    const startTime = Date.now();
    const volumeDiff = toVolume - fromVolume;

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        audio.volume = fromVolume + volumeDiff * progress;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else if (callback) {
            callback();
        }
    }

    update();
}

/**
 * Set SFX volume
 */
export function setSFXVolume(volume) {
    State.set('settings.sfxVolume', Math.max(0, Math.min(1, volume)));
}

/**
 * Set music volume
 */
export function setMusicVolume(volume) {
    State.set('settings.musicVolume', Math.max(0, Math.min(1, volume)));
}

/**
 * Toggle mute
 */
export function toggleMute() {
    State.set('settings.muted', !isMuted);
}

/**
 * Check if muted
 */
export function getMuted() {
    return isMuted;
}

// Export constants
export { SFX, MUSIC };

export default {
    init,
    loadSFX,
    playSFX,
    loadMusic,
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    setSFXVolume,
    setMusicVolume,
    toggleMute,
    getMuted,
    SFX,
    MUSIC
};
