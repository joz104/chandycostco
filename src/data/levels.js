/**
 * Level configuration data
 *
 * DEPRECATED: This file now re-exports from the modular level system.
 * Please import from '../levels/index.js' for new code.
 *
 * Maintained for backwards compatibility.
 */

// Re-export everything from the new modular level system
export {
    LEVELS,
    getLevel,
    getLevelCount,
    DIALOGUE_INTRO,
    DIALOGUE_L2,
    DIALOGUE_L3,
    DIALOGUE_L4,
    DIALOGUE_L5
} from '../levels/index.js';
