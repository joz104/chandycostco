/**
 * Helper utilities
 */

import * as THREE from 'three';

/**
 * Create a canvas texture with text
 */
export function createTextTexture(text, color, bgColor, font = 'bold 60px Arial') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
}

/**
 * Create Costco menu texture
 */
export function createCostcoMenuTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(0, 0, 1024, 256);

    ctx.fillStyle = '#e31837';
    ctx.fillRect(0, 0, 1024, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.fillText("COSTCO FOOD COURT", 20, 35);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.fillText("HOT DOG COMBO", 50, 120);

    ctx.fillStyle = '#e31837';
    ctx.fillText("$1.50", 50, 170);

    ctx.fillStyle = '#555555';
    ctx.font = '20px Arial';
    ctx.fillText("1/4 lb beef + 20oz soda", 50, 200);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.fillText("PIZZA SLICE", 400, 120);

    ctx.fillStyle = '#e31837';
    ctx.fillText("$1.99", 400, 170);

    ctx.fillStyle = '#555555';
    ctx.font = '20px Arial';
    ctx.fillText("Cheese, Pepperoni, or Combo", 400, 200);

    return new THREE.CanvasTexture(canvas);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Random float between min and max
 */
export function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Random int between min and max (inclusive)
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Choose random element from array
 */
export function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export default {
    createTextTexture,
    createCostcoMenuTexture,
    clamp,
    lerp,
    randomFloat,
    randomInt,
    randomChoice
};
