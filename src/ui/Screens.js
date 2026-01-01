/**
 * Screens - Modal screen management (start, game over, victory, pause, settings)
 */

// DOM Elements
let startScreen = null;
let gameOverScreen = null;
let victoryScreen = null;
let pauseScreen = null;
let settingsScreen = null;
let finalReason = null;

// Callbacks
let onStartGame = null;
let onRestart = null;
let onResume = null;
let onQuit = null;

/**
 * Initialize screens
 */
export function init(callbacks = {}) {
    // Store callbacks
    onStartGame = callbacks.onStartGame || (() => {});
    onRestart = callbacks.onRestart || (() => location.reload());
    onResume = callbacks.onResume || (() => {});
    onQuit = callbacks.onQuit || (() => location.reload());

    // Get DOM elements
    startScreen = document.getElementById('start-screen');
    gameOverScreen = document.getElementById('game-over-screen');
    victoryScreen = document.getElementById('victory-screen');
    pauseScreen = document.getElementById('pause-screen');
    settingsScreen = document.getElementById('settings-screen');
    finalReason = document.getElementById('final-reason');

    // Setup button listeners
    setupListeners();
}

/**
 * Setup button click listeners
 */
function setupListeners() {
    // Start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            hideAll();
            onStartGame();
        });
    }

    // Restart buttons
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', onRestart);
    }

    const restartVictoryBtn = document.getElementById('restart-victory-btn');
    if (restartVictoryBtn) {
        restartVictoryBtn.addEventListener('click', onRestart);
    }

    // Pause menu buttons
    const resumeBtn = document.getElementById('resume-btn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            hidePause();
            onResume();
        });
    }

    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            hidePause();
            showSettings();
        });
    }

    const quitBtn = document.getElementById('quit-btn');
    if (quitBtn) {
        quitBtn.addEventListener('click', onQuit);
    }

    // Settings back button
    const settingsBackBtn = document.getElementById('settings-back-btn');
    if (settingsBackBtn) {
        settingsBackBtn.addEventListener('click', () => {
            hideSettings();
            showPause();
        });
    }
}

/**
 * Hide all screens
 */
export function hideAll() {
    if (startScreen) startScreen.classList.add('hidden');
    if (gameOverScreen) gameOverScreen.classList.add('hidden');
    if (victoryScreen) victoryScreen.classList.add('hidden');
    if (pauseScreen) pauseScreen.classList.add('hidden');
    if (settingsScreen) settingsScreen.classList.add('hidden');
}

/**
 * Show start screen
 */
export function showStart() {
    hideAll();
    if (startScreen) startScreen.classList.remove('hidden');
}

/**
 * Show game over screen
 */
export function showGameOver(reason = "You ran out of lives.") {
    hideAll();
    if (finalReason) finalReason.innerText = reason;
    if (gameOverScreen) gameOverScreen.classList.remove('hidden');
}

/**
 * Show victory screen
 */
export function showVictory() {
    hideAll();
    if (victoryScreen) victoryScreen.classList.remove('hidden');
}

/**
 * Show pause screen
 */
export function showPause() {
    hideAll();
    if (pauseScreen) pauseScreen.classList.remove('hidden');
}

/**
 * Hide pause screen
 */
export function hidePause() {
    if (pauseScreen) pauseScreen.classList.add('hidden');
}

/**
 * Show settings screen
 */
export function showSettings() {
    hideAll();
    if (settingsScreen) settingsScreen.classList.remove('hidden');
}

/**
 * Hide settings screen
 */
export function hideSettings() {
    if (settingsScreen) settingsScreen.classList.add('hidden');
}

/**
 * Check if any modal is visible
 */
export function isAnyVisible() {
    return (
        (startScreen && !startScreen.classList.contains('hidden')) ||
        (gameOverScreen && !gameOverScreen.classList.contains('hidden')) ||
        (victoryScreen && !victoryScreen.classList.contains('hidden')) ||
        (pauseScreen && !pauseScreen.classList.contains('hidden')) ||
        (settingsScreen && !settingsScreen.classList.contains('hidden'))
    );
}

export default {
    init,
    hideAll,
    showStart,
    showGameOver,
    showVictory,
    showPause,
    hidePause,
    showSettings,
    hideSettings,
    isAnyVisible
};
