/**
 * HUD - Heads-up display management
 */

import State from '../game/StateManager.js';
import SaveSystem from '../game/SaveSystem.js';
import { LEVELS } from '../data/levels.js';
import { MAX_LIVES } from '../data/constants.js';

// DOM Elements
let uiLayer = null;
let scoreDisplay = null;
let levelDisplay = null;
let livesDisplay = null;
let progressFill = null;
let comboDisplay = null;
let playerLevelDisplay = null;

/**
 * Initialize HUD
 */
export function init() {
    uiLayer = document.getElementById('ui-layer');
    scoreDisplay = document.getElementById('score-display');
    levelDisplay = document.getElementById('level-display');
    livesDisplay = document.getElementById('lives-display');
    progressFill = document.getElementById('progress-fill');

    // Create combo display if it doesn't exist
    comboDisplay = document.getElementById('combo-display');
    if (!comboDisplay) {
        comboDisplay = document.createElement('div');
        comboDisplay.id = 'combo-display';
        document.body.appendChild(comboDisplay);
    }

    // Create player level display if it doesn't exist
    playerLevelDisplay = document.getElementById('player-level-display');
    if (!playerLevelDisplay) {
        playerLevelDisplay = document.createElement('div');
        playerLevelDisplay.id = 'player-level-display';
        playerLevelDisplay.style.cssText = 'position:absolute;top:10px;left:10px;color:#FFD700;font-size:12px;text-shadow:2px 2px 0 #000;z-index:20;';
        document.body.appendChild(playerLevelDisplay);
    }
    updatePlayerLevelDisplay();

    // Subscribe to state changes
    State.subscribe('lives', updateLivesDisplay);
    State.subscribe('score', updateScoreDisplay);
    State.subscribe('currentLevelIdx', updateLevelDisplay);
    State.subscribe('combo', updateComboDisplay);
    State.subscribe('playerLevel', updatePlayerLevelDisplay);
}

/**
 * Show HUD
 */
export function show() {
    if (uiLayer) {
        uiLayer.classList.remove('hidden');
    }
}

/**
 * Hide HUD
 */
export function hide() {
    if (uiLayer) {
        uiLayer.classList.add('hidden');
    }
}

/**
 * Update lives display
 */
export function updateLivesDisplay(lives = State.get('lives')) {
    if (!livesDisplay) return;

    let hearts = '';
    for (let i = 0; i < MAX_LIVES; i++) {
        hearts += i < lives ? '❤️' : '🖤';
    }
    livesDisplay.innerText = hearts;
}

/**
 * Update score display
 */
export function updateScoreDisplay(score = State.get('score')) {
    if (!scoreDisplay) return;
    scoreDisplay.innerText = Math.floor(score) + 'm';
}

/**
 * Update level display
 */
export function updateLevelDisplay(levelIdx = State.get('currentLevelIdx')) {
    if (!levelDisplay) return;

    const level = LEVELS[levelIdx];
    if (level) {
        levelDisplay.innerText = `${level.id}: ${level.name}`;
    }
}

/**
 * Update progress bar
 */
export function updateProgress(progress) {
    if (!progressFill) return;
    progressFill.style.width = Math.min(100, progress) + '%';
}

/**
 * Update combo display
 */
export function updateComboDisplay(combo = State.get('combo')) {
    if (!comboDisplay) return;

    if (combo > 1) {
        comboDisplay.innerText = `x${combo}`;
        comboDisplay.classList.add('active');
    } else {
        comboDisplay.classList.remove('active');
    }
}

/**
 * Update player level display
 */
export function updatePlayerLevelDisplay() {
    if (!playerLevelDisplay) return;

    const level = SaveSystem.getPlayerLevel();
    const progress = SaveSystem.getXPProgress();
    const xp = SaveSystem.getPlayerXP();
    const nextXP = SaveSystem.getXPForNextLevel();

    let text = `LVL ${level}`;
    if (nextXP) {
        text += ` (${xp}/${nextXP} XP)`;
    } else {
        text += ` MAX`;
    }

    playerLevelDisplay.innerText = text;
}

/**
 * Flash combo for near-miss
 */
export function flashCombo() {
    if (!comboDisplay) return;

    comboDisplay.classList.remove('active');
    // Force reflow
    void comboDisplay.offsetWidth;
    comboDisplay.classList.add('active');
}

/**
 * Update all HUD elements
 */
export function updateAll() {
    updateLivesDisplay();
    updateScoreDisplay();
    updateLevelDisplay();
    updateComboDisplay();
    updatePlayerLevelDisplay();
}

export default {
    init,
    show,
    hide,
    updateLivesDisplay,
    updateScoreDisplay,
    updateLevelDisplay,
    updateProgress,
    updateComboDisplay,
    updatePlayerLevelDisplay,
    flashCombo,
    updateAll
};
