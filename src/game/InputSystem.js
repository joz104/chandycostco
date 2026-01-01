/**
 * InputSystem - Keyboard and touch input handling
 */

import State from './StateManager.js';

// Callbacks for different actions
let callbacks = {
    onMoveLeft: () => {},
    onMoveRight: () => {},
    onJump: () => {},
    onSlide: () => {},
    onPause: () => {},
    onInteract: () => {},
    onAdvanceDialogue: () => {}
};

// Touch tracking
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

/**
 * Initialize input system
 * @param {Object} inputCallbacks - Object with callback functions
 */
export function init(inputCallbacks = {}) {
    callbacks = { ...callbacks, ...inputCallbacks };

    // Keyboard input
    document.addEventListener('keydown', handleKeyDown);

    // Touch input
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse click (for cutscene advancement)
    document.addEventListener('mousedown', handleMouseDown);
}

/**
 * Handle keyboard input
 */
function handleKeyDown(e) {
    // Prevent default for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE', 'Escape'].includes(e.code)) {
        e.preventDefault();
    }

    // Cutscene mode - advance dialogue
    if (State.get('isCutscene') && !State.get('isExitingCutscene')) {
        callbacks.onAdvanceDialogue();
        return;
    }

    // Costco ending - order interaction
    if (State.get('waitingForOrder') && e.code === 'KeyE') {
        callbacks.onInteract();
        return;
    }

    // Pause toggle
    if (e.code === 'Escape') {
        callbacks.onPause();
        return;
    }

    // Gameplay controls
    if (State.get('isPlaying') && !State.get('isPaused')) {
        switch (e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                callbacks.onMoveLeft();
                break;
            case 'ArrowRight':
            case 'KeyD':
                callbacks.onMoveRight();
                break;
            case 'ArrowUp':
            case 'KeyW':
            case 'Space':
                callbacks.onJump();
                break;
            case 'ArrowDown':
            case 'KeyS':
                callbacks.onSlide();
                break;
        }
    }
}

/**
 * Handle touch start
 */
function handleTouchStart(e) {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }
}

/**
 * Handle touch end
 */
function handleTouchEnd(e) {
    if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        const dt = Date.now() - touchStartTime;

        // Check if it's a tap (short duration, small movement)
        const isTap = dt < 300 && Math.abs(dx) < 30 && Math.abs(dy) < 30;

        if (isTap) {
            // Cutscene - advance dialogue
            if (State.get('isCutscene')) {
                callbacks.onAdvanceDialogue();
                return;
            }

            // Gameplay - tap to jump
            if (State.get('isPlaying') && !State.get('isPaused')) {
                callbacks.onJump();
            }
        } else {
            // Swipe detection
            handleSwipe(dx, dy);
        }
    }
}

/**
 * Handle swipe gestures
 */
function handleSwipe(dx, dy) {
    // Only handle in gameplay
    if (!State.get('isPlaying') || State.get('isPaused') || State.get('isCutscene')) {
        return;
    }

    const minSwipeDistance = 50;

    // Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > minSwipeDistance) {
            callbacks.onMoveRight();
        } else if (dx < -minSwipeDistance) {
            callbacks.onMoveLeft();
        }
    } else {
        // Vertical swipe
        if (dy < -minSwipeDistance) {
            callbacks.onJump();
        } else if (dy > minSwipeDistance) {
            callbacks.onSlide();
        }
    }
}

/**
 * Handle mouse click (for cutscene advancement)
 */
function handleMouseDown(e) {
    if (State.get('isCutscene') && !State.get('isExitingCutscene')) {
        callbacks.onAdvanceDialogue();
    }
}

/**
 * Cleanup event listeners
 */
export function cleanup() {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('mousedown', handleMouseDown);
}

export default {
    init,
    cleanup
};
