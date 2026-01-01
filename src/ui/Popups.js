/**
 * Popups - Floating text notifications
 */

/**
 * Show a popup message
 * @param {string} text - The text to display
 * @param {string} color - CSS color for the text
 * @param {number} x - X position (defaults to center)
 * @param {number} y - Y position (defaults to center)
 */
export function showPopup(text, color = '#ffffff', x = null, y = null) {
    const popup = document.createElement('div');
    popup.className = 'popup-text';
    popup.style.color = color;
    popup.style.left = (x !== null ? x : window.innerWidth / 2) + 'px';
    popup.style.top = (y !== null ? y : window.innerHeight / 2) + 'px';
    popup.innerText = text;

    document.body.appendChild(popup);

    // Remove after animation completes
    popup.addEventListener('animationend', () => {
        popup.remove();
    });
}

/**
 * Show damage popup
 */
export function showDamage() {
    showPopup('OUCH!', '#ff4444');
}

/**
 * Show bonus popup
 */
export function showBonus(text, points) {
    showPopup(`${text} +${points}`, '#00ff00');
}

/**
 * Show combo popup
 */
export function showCombo(combo) {
    showPopup(`CLOSE! x${combo}`, '#ffff00');
}

/**
 * Show life gained popup
 */
export function showLifeGained() {
    showPopup('+1 LIFE!', '#ff69b4');
}

/**
 * Show invincibility popup
 */
export function showInvincibility() {
    showPopup('FUEGO MODE!', '#ff6600');
}

/**
 * Show coin collected popup
 */
export function showCoinCollected(value) {
    showPopup(`+${value}¢`, '#ffd700');
}

/**
 * Show level complete popup
 */
export function showLevelComplete(levelName) {
    showPopup(`${levelName} COMPLETE!`, '#00ffff');
}

export default {
    showPopup,
    showDamage,
    showBonus,
    showCombo,
    showLifeGained,
    showInvincibility,
    showCoinCollected,
    showLevelComplete
};
