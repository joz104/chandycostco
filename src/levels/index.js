/**
 * Level System - Central export for all game levels
 *
 * Each level module contains:
 * - config: Level settings (speed, length, colors, etc.)
 * - dialogue: Cutscene dialogue array
 * - createCutsceneEnvironment(): Creates the cutscene 3D environment
 * - spawnDecoration(): Creates gameplay decorations
 * - updateAnimations(): Updates animated elements (water, lights, etc.)
 */

import Level1_HomeTown from './Level1_HomeTown.js';
import Level2_Desert from './Level2_Desert.js';
import Level3_RioGrande from './Level3_RioGrande.js';
import Level4_TheWall from './Level4_TheWall.js';
import Level5_Suburbia from './Level5_Suburbia.js';
import LevelCostco from './LevelCostco.js';

// ============================================
// LEVEL REGISTRY
// ============================================

const LEVEL_MODULES = [
    Level1_HomeTown,
    Level2_Desert,
    Level3_RioGrande,
    Level4_TheWall,
    Level5_Suburbia
];

// ============================================
// PUBLIC API
// ============================================

/**
 * Get level configuration by index (0-based)
 * @param {number} index - Level index
 * @returns {Object|null} - Level config or null
 */
export function getLevel(index) {
    const module = LEVEL_MODULES[index];
    if (!module) return null;

    return {
        ...module.config,
        cutscene: module.dialogue
    };
}

/**
 * Get total number of levels
 * @returns {number}
 */
export function getLevelCount() {
    return LEVEL_MODULES.length;
}

/**
 * Get level module by index (includes all functions)
 * @param {number} index - Level index
 * @returns {Object|null} - Full level module or null
 */
export function getLevelModule(index) {
    return LEVEL_MODULES[index] || null;
}

/**
 * Create cutscene environment for a level
 * @param {number} levelIndex - Level index (or 'costco'/'costco-exterior')
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {{ group: THREE.Group, animatedElements: Array }}
 */
export function createCutsceneEnvironment(levelIndex, scene) {
    // Handle Costco special cases
    if (levelIndex === 'costco') {
        return LevelCostco.createInteriorEnvironment(scene);
    }
    if (levelIndex === 'costco-exterior') {
        return LevelCostco.createExteriorEnvironment(scene);
    }

    const module = LEVEL_MODULES[levelIndex];
    if (!module) {
        console.warn(`No level module for index ${levelIndex}`);
        return { group: null, animatedElements: [] };
    }

    const result = module.createCutsceneEnvironment(scene);

    // Normalize return format (some levels return just a group)
    if (result instanceof Object && result.group) {
        return result;
    }

    return { group: result, animatedElements: [] };
}

/**
 * Spawn a decoration for the current level
 * @param {number} levelIndex - Level index
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} zPos - Z position for the decoration
 * @param {Object} Materials - Optional material references
 * @returns {THREE.Object3D|null}
 */
export function spawnDecoration(levelIndex, scene, zPos, Materials) {
    const module = LEVEL_MODULES[levelIndex];
    if (!module || !module.spawnDecoration) {
        return null;
    }

    return module.spawnDecoration(scene, zPos, Materials);
}

/**
 * Update animated elements for a level's cutscene
 * @param {number} levelIndex - Level index
 * @param {Array} animatedElements - Array of animated elements
 * @param {number} deltaTime - Time since last frame
 */
export function updateAnimations(levelIndex, animatedElements, deltaTime) {
    const module = LEVEL_MODULES[levelIndex];
    if (!module || !module.updateAnimations) {
        return;
    }

    module.updateAnimations(animatedElements, deltaTime);
}

/**
 * Get dialogue for a level
 * @param {number} levelIndex - Level index
 * @returns {Array} - Dialogue array
 */
export function getDialogue(levelIndex) {
    const module = LEVEL_MODULES[levelIndex];
    return module ? module.dialogue : [];
}

// ============================================
// COSTCO ENDING EXPORTS
// ============================================

export const DIALOGUE_ENDING = LevelCostco.dialogueEnding;
export const DIALOGUE_ENDING_HAPPY = LevelCostco.dialogueEndingHappy;

// ============================================
// LEGACY EXPORTS (for backwards compatibility)
// ============================================

// Build LEVELS array from modules for backwards compatibility
export const LEVELS = LEVEL_MODULES.map(module => ({
    ...module.config,
    cutscene: module.dialogue
}));

// Re-export individual dialogues
export const DIALOGUE_INTRO = Level1_HomeTown.dialogue;
export const DIALOGUE_L2 = Level2_Desert.dialogue;
export const DIALOGUE_L3 = Level3_RioGrande.dialogue;
export const DIALOGUE_L4 = Level4_TheWall.dialogue;
export const DIALOGUE_L5 = Level5_Suburbia.dialogue;

// ============================================
// DEFAULT EXPORT
// ============================================

export default {
    getLevel,
    getLevelCount,
    getLevelModule,
    createCutsceneEnvironment,
    spawnDecoration,
    updateAnimations,
    getDialogue,
    LEVELS,
    DIALOGUE_ENDING,
    DIALOGUE_ENDING_HAPPY
};
