/**
 * StateManager - Centralized game state management
 * Replaces all global variables with a single state object
 */

import { INITIAL_LIVES } from '../data/constants.js';

// Event emitter for state changes
const listeners = new Map();

// The game state object
const state = {
    // Game flow
    isPlaying: false,
    isPaused: false,
    isCutscene: false,
    isExitingCutscene: false,
    isCostcoEnding: false,
    isCostcoApproach: false,
    waitingForOrder: false,
    isDraggingOut: false,
    guardsGrabbed: false,

    // Player stats
    score: 0,
    lives: INITIAL_LIVES,
    coins: 0, // New: for alternate ending
    combo: 0, // New: for near-miss combo system
    highScore: 0,

    // Level progression
    currentLevelIdx: 0,
    currentSpeed: 18,

    // Player state
    targetLane: 0, // -1, 0, or 1
    isInvincible: false,
    invincibilityTimer: 0,
    damageCooldown: 0,

    // Dialogue state
    currentDialogueQueue: [],
    currentDialogueIndex: 0,
    activeBubble: null,
    autoAdvanceTimer: 0,

    // Timing
    lastTime: 0,
    animationId: null,

    // Settings
    settings: {
        musicVolume: 0.7,
        sfxVolume: 1.0,
        muted: false
    }
};

/**
 * Get a state value
 * @param {string} key - The state key (supports dot notation: 'settings.musicVolume')
 */
export function get(key) {
    const keys = key.split('.');
    let value = state;
    for (const k of keys) {
        value = value[k];
        if (value === undefined) return undefined;
    }
    return value;
}

/**
 * Set a state value and notify listeners
 * @param {string} key - The state key
 * @param {*} value - The new value
 */
export function set(key, value) {
    const keys = key.split('.');
    let obj = state;
    for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
    }
    const finalKey = keys[keys.length - 1];
    const oldValue = obj[finalKey];
    obj[finalKey] = value;

    // Notify listeners
    emit(key, value, oldValue);
}

/**
 * Update multiple state values at once
 * @param {Object} updates - Object with key-value pairs to update
 */
export function update(updates) {
    for (const [key, value] of Object.entries(updates)) {
        set(key, value);
    }
}

/**
 * Subscribe to state changes
 * @param {string} key - The state key to watch
 * @param {Function} callback - Called with (newValue, oldValue)
 * @returns {Function} Unsubscribe function
 */
export function subscribe(key, callback) {
    if (!listeners.has(key)) {
        listeners.set(key, new Set());
    }
    listeners.get(key).add(callback);

    return () => listeners.get(key).delete(callback);
}

/**
 * Emit a state change event
 */
function emit(key, newValue, oldValue) {
    if (listeners.has(key)) {
        for (const callback of listeners.get(key)) {
            callback(newValue, oldValue);
        }
    }
    // Also emit to wildcard listeners
    if (listeners.has('*')) {
        for (const callback of listeners.get('*')) {
            callback(key, newValue, oldValue);
        }
    }
}

/**
 * Reset game state to initial values
 */
export function reset() {
    set('isPlaying', false);
    set('isPaused', false);
    set('isCutscene', false);
    set('isExitingCutscene', false);
    set('isCostcoEnding', false);
    set('isCostcoApproach', false);
    set('waitingForOrder', false);
    set('isDraggingOut', false);
    set('guardsGrabbed', false);

    set('score', 0);
    set('lives', INITIAL_LIVES);
    set('coins', 0);
    set('combo', 0);

    set('currentLevelIdx', 0);
    set('currentSpeed', 18);

    set('targetLane', 0);
    set('isInvincible', false);
    set('invincibilityTimer', 0);
    set('damageCooldown', 0);

    set('currentDialogueQueue', []);
    set('currentDialogueIndex', 0);
    set('activeBubble', null);
    set('autoAdvanceTimer', 0);
}

/**
 * Get the entire state object (for debugging)
 */
export function getState() {
    return { ...state };
}

/**
 * Increment a numeric state value
 */
export function increment(key, amount = 1) {
    set(key, get(key) + amount);
}

/**
 * Decrement a numeric state value
 */
export function decrement(key, amount = 1) {
    set(key, get(key) - amount);
}

// Export state manager as default object
export default {
    get,
    set,
    update,
    subscribe,
    reset,
    getState,
    increment,
    decrement
};
