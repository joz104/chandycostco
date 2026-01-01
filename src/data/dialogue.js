/**
 * Dialogue data for all cutscenes in the game
 *
 * DEPRECATED: This file now re-exports from the modular level system.
 * Please import from '../levels/index.js' for new code.
 *
 * Maintained for backwards compatibility.
 */

// Re-export all dialogues from the new modular level system
export {
    DIALOGUE_INTRO,
    DIALOGUE_L2,
    DIALOGUE_L3,
    DIALOGUE_L4,
    DIALOGUE_L5,
    DIALOGUE_ENDING,
    DIALOGUE_ENDING_HAPPY
} from '../levels/index.js';
