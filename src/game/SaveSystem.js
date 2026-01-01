/**
 * SaveSystem - LocalStorage persistence for game data
 */

import State from './StateManager.js';

const STORAGE_KEY = 'chandlers_glizzy_run_save';

// XP required for each player level (cumulative)
const XP_PER_LEVEL = [
    0,      // Level 1 (starting)
    500,    // Level 2
    1500,   // Level 3
    3000,   // Level 4
    5000,   // Level 5
    8000,   // Level 6
    12000,  // Level 7
    17000,  // Level 8
    23000,  // Level 9
    30000,  // Level 10 (max)
];

// Default save data
const DEFAULT_SAVE = {
    highScore: 0,
    totalDistance: 0,
    totalDeaths: 0,
    totalCollectibles: 0,
    gamesPlayed: 0,
    gameBeaten: false,
    levelsUnlocked: 1,
    achievements: [],
    // Player progression
    playerXP: 0,
    playerLevel: 1,
    settings: {
        musicVolume: 0.7,
        sfxVolume: 1.0,
        muted: false
    }
};

// Current save data
let saveData = { ...DEFAULT_SAVE };

/**
 * Initialize save system - load existing data
 */
export function init() {
    load();

    // Apply saved settings to state
    State.set('settings.musicVolume', saveData.settings.musicVolume);
    State.set('settings.sfxVolume', saveData.settings.sfxVolume);
    State.set('settings.muted', saveData.settings.muted);
    State.set('highScore', saveData.highScore);
    State.set('playerLevel', saveData.playerLevel);
    State.set('playerXP', saveData.playerXP);

    // Subscribe to state changes to auto-save settings
    State.subscribe('settings.musicVolume', (v) => {
        saveData.settings.musicVolume = v;
        save();
    });
    State.subscribe('settings.sfxVolume', (v) => {
        saveData.settings.sfxVolume = v;
        save();
    });
    State.subscribe('settings.muted', (v) => {
        saveData.settings.muted = v;
        save();
    });
}

/**
 * Load save data from localStorage
 */
export function load() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            saveData = { ...DEFAULT_SAVE, ...parsed };
        }
    } catch (error) {
        console.warn('Failed to load save data:', error);
        saveData = { ...DEFAULT_SAVE };
    }
}

/**
 * Save data to localStorage
 */
export function save() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    } catch (error) {
        console.warn('Failed to save data:', error);
    }
}

/**
 * Update high score if new score is higher
 * @returns {boolean} True if new high score
 */
export function updateHighScore(score) {
    if (score > saveData.highScore) {
        saveData.highScore = score;
        State.set('highScore', score);
        save();
        return true;
    }
    return false;
}

/**
 * Get high score
 */
export function getHighScore() {
    return saveData.highScore;
}

/**
 * Record a death
 */
export function recordDeath() {
    saveData.totalDeaths++;
    save();
}

/**
 * Record distance traveled
 */
export function recordDistance(distance) {
    saveData.totalDistance += distance;
    save();
}

/**
 * Record collectible gathered
 */
export function recordCollectible() {
    saveData.totalCollectibles++;
    save();
}

/**
 * Record game played
 */
export function recordGamePlayed() {
    saveData.gamesPlayed++;
    save();
}

/**
 * Mark game as beaten
 */
export function markGameBeaten() {
    if (!saveData.gameBeaten) {
        saveData.gameBeaten = true;
        save();
    }
}

/**
 * Unlock a level
 */
export function unlockLevel(levelNum) {
    if (levelNum > saveData.levelsUnlocked) {
        saveData.levelsUnlocked = levelNum;
        save();
    }
}

/**
 * Get unlocked levels count
 */
export function getUnlockedLevels() {
    return saveData.levelsUnlocked;
}

/**
 * Check if game has been beaten
 */
export function hasBeatenGame() {
    return saveData.gameBeaten;
}

/**
 * Add achievement
 */
export function addAchievement(id) {
    if (!saveData.achievements.includes(id)) {
        saveData.achievements.push(id);
        save();
        return true;
    }
    return false;
}

/**
 * Check if achievement is unlocked
 */
export function hasAchievement(id) {
    return saveData.achievements.includes(id);
}

/**
 * Get all achievements
 */
export function getAchievements() {
    return [...saveData.achievements];
}

/**
 * Get stats for display
 */
export function getStats() {
    return {
        highScore: saveData.highScore,
        totalDistance: Math.floor(saveData.totalDistance),
        totalDeaths: saveData.totalDeaths,
        totalCollectibles: saveData.totalCollectibles,
        gamesPlayed: saveData.gamesPlayed,
        gameBeaten: saveData.gameBeaten,
        playerLevel: saveData.playerLevel,
        playerXP: saveData.playerXP
    };
}

/**
 * Add XP and check for level up
 * @returns {boolean} True if leveled up
 */
export function addXP(amount) {
    saveData.playerXP += amount;
    State.set('playerXP', saveData.playerXP);

    // Check for level up
    const maxLevel = XP_PER_LEVEL.length;
    let leveledUp = false;

    while (saveData.playerLevel < maxLevel &&
           saveData.playerXP >= XP_PER_LEVEL[saveData.playerLevel]) {
        saveData.playerLevel++;
        leveledUp = true;
    }

    if (leveledUp) {
        State.set('playerLevel', saveData.playerLevel);
    }

    save();
    return leveledUp;
}

/**
 * Get player level
 */
export function getPlayerLevel() {
    return saveData.playerLevel;
}

/**
 * Get player XP
 */
export function getPlayerXP() {
    return saveData.playerXP;
}

/**
 * Get XP needed for next level
 */
export function getXPForNextLevel() {
    if (saveData.playerLevel >= XP_PER_LEVEL.length) {
        return null; // Max level
    }
    return XP_PER_LEVEL[saveData.playerLevel];
}

/**
 * Get XP progress to next level (0-1)
 */
export function getXPProgress() {
    const currentLevelXP = XP_PER_LEVEL[saveData.playerLevel - 1] || 0;
    const nextLevelXP = XP_PER_LEVEL[saveData.playerLevel];

    if (!nextLevelXP) return 1; // Max level

    const xpInCurrentLevel = saveData.playerXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;

    return xpInCurrentLevel / xpNeededForLevel;
}

/**
 * Reset all save data
 */
export function resetAll() {
    saveData = { ...DEFAULT_SAVE };
    save();
    State.set('highScore', 0);
    State.set('playerLevel', 1);
    State.set('playerXP', 0);
}

export default {
    init,
    load,
    save,
    updateHighScore,
    getHighScore,
    recordDeath,
    recordDistance,
    recordCollectible,
    recordGamePlayed,
    markGameBeaten,
    unlockLevel,
    getUnlockedLevels,
    hasBeatenGame,
    addAchievement,
    hasAchievement,
    getAchievements,
    getStats,
    addXP,
    getPlayerLevel,
    getPlayerXP,
    getXPForNextLevel,
    getXPProgress,
    resetAll
};
