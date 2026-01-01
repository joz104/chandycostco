/**
 * Level configuration data
 * Each level defines visual theme, speed, length, and associated cutscene
 */

import {
    DIALOGUE_INTRO,
    DIALOGUE_L2,
    DIALOGUE_L3,
    DIALOGUE_L4,
    DIALOGUE_L5
} from './dialogue.js';

export const LEVELS = [
    {
        id: 1,
        name: "HOME TOWN",
        length: 1000,
        color: 0xD2B48C,
        fog: 0xD2B48C,
        speed: 16,
        groundColor: 0xE3C988,
        cutscene: DIALOGUE_INTRO,
        npc: 'mom',
        // Difficulty settings - easy but still engaging
        minObstacleGap: 20,
        maxObstacleGap: 35,
        collectibleGap: 60
    },
    {
        id: 2,
        name: "THE DESERT",
        length: 1500,
        color: 0xFF8C00,
        fog: 0xFF8C00,
        speed: 20,
        groundColor: 0xCD853F,
        cutscene: DIALOGUE_L2,
        npc: 'coyote',
        minObstacleGap: 18,
        maxObstacleGap: 30,
        collectibleGap: 55
    },
    {
        id: 3,
        name: "RIO GRANDE",
        length: 2000,
        color: 0x4682B4,
        fog: 0x4682B4,
        speed: 24,
        groundColor: 0x2F4F4F,
        cutscene: DIALOGUE_L3,
        npc: 'alligator',
        minObstacleGap: 15,
        maxObstacleGap: 28,
        collectibleGap: 50
    },
    {
        id: 4,
        name: "THE WALL",
        length: 2500,
        color: 0x101030,
        fog: 0x101030,
        speed: 28,
        groundColor: 0x5d4037,
        cutscene: DIALOGUE_L4,
        npc: 'agent',
        minObstacleGap: 12,
        maxObstacleGap: 25,
        collectibleGap: 45
    },
    {
        id: 5,
        name: "SUBURBIA",
        length: 3000,
        color: 0x87CEEB,
        fog: 0xFFFFFF,
        speed: 32,
        groundColor: 0x333333,
        cutscene: DIALOGUE_L5,
        npc: null,  // Mom is on the phone, not physically present
        minObstacleGap: 10,
        maxObstacleGap: 22,
        collectibleGap: 40
    }
];

/**
 * Get level by index (0-based)
 */
export function getLevel(index) {
    return LEVELS[index] || null;
}

/**
 * Get total number of levels
 */
export function getLevelCount() {
    return LEVELS.length;
}
