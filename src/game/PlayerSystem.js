/**
 * PlayerSystem - Player character, physics, and movement
 */

import * as THREE from 'three';
import SceneManager from './SceneManager.js';
import State from './StateManager.js';
import Effects from './EffectsSystem.js';
import Audio, { SFX } from './AudioSystem.js';
import Popups from '../ui/Popups.js';
import {
    LANE_WIDTH,
    GRAVITY,
    JUMP_VELOCITY,
    MAX_JUMPS,
    SLIDE_DURATION,
    PLAYER_MOVE_SPEED,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_HEIGHT_SLIDING,
    DAMAGE_COOLDOWN,
    INVINCIBILITY_DURATION,
    NEAR_MISS_THRESHOLD,
    SHAKE_INTENSITY,
    SHAKE_DURATION
} from '../data/constants.js';

// Player mesh and group
let player = null;
let playerMeshGroup = null;

// Body parts for animation
let legL = null;
let legR = null;
let armL = null;
let armR = null;
let head = null;

/**
 * Initialize player
 */
export function init() {
    const scene = SceneManager.getScene();
    createPlayer(scene);
}

/**
 * Create player mesh
 */
function createPlayer(scene) {
    player = new THREE.Group();
    playerMeshGroup = new THREE.Group();
    player.add(playerMeshGroup);

    const matSkin = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.8 });
    const matPoncho = new THREE.MeshStandardMaterial({ color: 0xB22222, roughness: 0.9 });
    const matPants = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const matHat = new THREE.MeshStandardMaterial({ color: 0xF4A460, roughness: 1.0 });

    // Head
    head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), matSkin);
    head.position.y = 2.8;
    head.castShadow = true;
    playerMeshGroup.add(head);
    player.userData.head = head;

    // Hat
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.1, 16), matHat);
    hatBrim.position.y = 3.2;
    playerMeshGroup.add(hatBrim);

    const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.6, 16), matHat);
    hatTop.position.y = 3.5;
    playerMeshGroup.add(hatTop);

    // Poncho
    const poncho = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.0, 1.4, 4), matPoncho);
    poncho.position.y = 1.8;
    poncho.rotation.y = Math.PI / 4;
    poncho.castShadow = true;
    playerMeshGroup.add(poncho);
    player.userData.poncho = poncho;

    // Legs
    legL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), matPants);
    legL.position.set(-0.25, 1.2, 0);
    legL.geometry.translate(0, -0.6, 0);
    legL.castShadow = true;
    playerMeshGroup.add(legL);
    player.userData.legL = legL;

    legR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), matPants);
    legR.position.set(0.25, 1.2, 0);
    legR.geometry.translate(0, -0.6, 0);
    legR.castShadow = true;
    playerMeshGroup.add(legR);
    player.userData.legR = legR;

    // Left arm (at shoulder, natural position)
    armL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 0.25), matSkin);
    armL.position.set(-0.55, 2.1, 0);
    armL.geometry.translate(0, -0.35, 0);
    armL.castShadow = true;
    playerMeshGroup.add(armL);
    player.userData.armL = armL;

    // Right arm (at shoulder, natural position)
    armR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.7, 0.25), matSkin);
    armR.position.set(0.55, 2.1, 0);
    armR.geometry.translate(0, -0.35, 0);
    armR.castShadow = true;
    playerMeshGroup.add(armR);
    player.userData.armR = armR;

    // Initialize physics
    player.userData.velocity = new THREE.Vector3();
    player.userData.isGrounded = true;
    player.userData.jumpCount = 0;
    player.userData.isSliding = false;
    player.userData.slideTimer = 0;

    scene.add(player);
}

/**
 * Get player mesh
 */
export function getPlayer() {
    return player;
}

/**
 * Get player mesh group
 */
export function getMeshGroup() {
    return playerMeshGroup;
}

/**
 * Jump action
 */
export function jump() {
    if (!player) return;

    const isGrounded = player.userData.isGrounded;
    const jumpCount = player.userData.jumpCount;

    if (isGrounded) {
        player.userData.velocity.y = JUMP_VELOCITY;
        player.userData.jumpCount = 1;
        player.userData.isGrounded = false;
        Effects.spawnDust(player.position.x, 0, player.position.z);
        Audio.playSFX(SFX.JUMP);
    } else if (jumpCount < MAX_JUMPS) {
        player.userData.velocity.y = JUMP_VELOCITY;
        player.userData.jumpCount = 2;
        Audio.playSFX(SFX.JUMP);
    }
}

/**
 * Slide action
 */
export function slide() {
    if (!player) return;

    if (player.userData.isGrounded && !player.userData.isSliding) {
        player.userData.isSliding = true;
        player.userData.slideTimer = SLIDE_DURATION;
        Effects.spawnDust(player.position.x, 0, player.position.z);
        Audio.playSFX(SFX.SLIDE);
    }
}

/**
 * Change lane
 */
export function changeLane(direction) {
    const targetLane = State.get('targetLane');
    const newLane = Math.max(-1, Math.min(1, targetLane + direction));
    State.set('targetLane', newLane);
}

/**
 * Take damage
 */
export function takeDamage() {
    const damageCooldown = State.get('damageCooldown');

    // Still in cooldown - no damage taken, but player is alive
    if (damageCooldown > 0) return true;

    State.decrement('lives');
    State.set('combo', 0); // Reset combo
    State.set('damageCooldown', DAMAGE_COOLDOWN);

    // Visual feedback
    SceneManager.shake(SHAKE_INTENSITY.MEDIUM, SHAKE_DURATION.MEDIUM);
    Popups.showDamage();
    Audio.playSFX(SFX.HIT);

    // Damage overlay
    const damageOverlay = document.getElementById('damage-overlay');
    if (damageOverlay) {
        damageOverlay.classList.add('damage-active');
        setTimeout(() => damageOverlay.classList.remove('damage-active'), 200);
    }

    // Check current lives AFTER decrementing
    const currentLives = State.get('lives');
    if (currentLives <= 0) {
        // Game over will be handled by GameLoop
        return false;
    }
    return true;
}

/**
 * Set invincibility
 */
export function setInvincible(duration = INVINCIBILITY_DURATION) {
    State.set('isInvincible', true);
    State.set('invincibilityTimer', duration);

    const fuegoOverlay = document.getElementById('fuego-overlay');
    if (fuegoOverlay) {
        fuegoOverlay.classList.add('fuego-active');
    }

    Popups.showInvincibility();
    Audio.playSFX(SFX.COLLECT_CHILI);
}

/**
 * Get collision box
 */
export function getCollisionBox() {
    if (!player) return null;

    const isSliding = player.userData.isSliding;
    const height = isSliding ? PLAYER_HEIGHT_SLIDING : PLAYER_HEIGHT;

    return new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(player.position.x, player.position.y + height / 2, player.position.z),
        new THREE.Vector3(PLAYER_WIDTH, height, PLAYER_WIDTH)
    );
}

/**
 * Update player physics and animation
 */
export function update(dt) {
    if (!player) return;

    const targetLane = State.get('targetLane');
    const isInvincible = State.get('isInvincible');
    const invincibilityTimer = State.get('invincibilityTimer');
    const damageCooldown = State.get('damageCooldown');

    // Lane movement (interpolation)
    const targetX = targetLane * LANE_WIDTH;
    player.position.x += (targetX - player.position.x) * PLAYER_MOVE_SPEED * dt;

    // Gravity
    player.userData.velocity.y += GRAVITY * dt;
    player.position.y += player.userData.velocity.y * dt;

    // Ground collision
    if (player.position.y <= 0) {
        player.position.y = 0;
        if (!player.userData.isGrounded) {
            player.userData.isGrounded = true;
            player.userData.jumpCount = 0;
            Effects.spawnDust(player.position.x, 0, player.position.z);
            Audio.playSFX(SFX.LAND);
        }
        player.userData.velocity.y = 0;
    }

    // Sliding
    if (player.userData.isSliding) {
        player.userData.slideTimer -= dt;
        playerMeshGroup.scale.y = 0.5;
        playerMeshGroup.position.y = -0.7;

        if (player.userData.slideTimer <= 0) {
            player.userData.isSliding = false;
            playerMeshGroup.scale.y = 1;
            playerMeshGroup.position.y = 0;
        }
    }

    // Leg animation (running)
    if (player.userData.isGrounded && !player.userData.isSliding) {
        const time = Date.now() * 0.02;
        legL.rotation.x = Math.sin(time) * 1.2;
        legR.rotation.x = Math.sin(time + Math.PI) * 1.2;

        // Arm swing (both arms, opposite phase)
        if (armL) {
            armL.rotation.x = Math.sin(time) * 0.5;
        }
        if (armR) {
            armR.rotation.x = Math.sin(time + Math.PI) * 0.5;
        }

        // Head bob (new animation)
        if (head) {
            head.position.y = 2.8 + Math.abs(Math.sin(time * 2)) * 0.05;
        }
    }

    // Invincibility timer
    if (isInvincible) {
        State.set('invincibilityTimer', invincibilityTimer - dt);

        // Sparkle effect
        if (Math.random() < 0.3) {
            Effects.spawnSparkle(player.position.x, player.position.y + 2, player.position.z);
        }

        if (invincibilityTimer - dt <= 0) {
            State.set('isInvincible', false);
            const fuegoOverlay = document.getElementById('fuego-overlay');
            if (fuegoOverlay) {
                fuegoOverlay.classList.remove('fuego-active');
            }
        }
    }

    // Damage cooldown
    if (damageCooldown > 0) {
        State.set('damageCooldown', damageCooldown - dt);
    }
}

/**
 * Reset player state
 */
export function reset() {
    if (!player) return;

    player.position.set(0, 0, 0);
    player.rotation.set(0, 0, 0);
    player.userData.velocity.set(0, 0, 0);
    player.userData.isGrounded = true;
    player.userData.jumpCount = 0;
    player.userData.isSliding = false;
    player.userData.slideTimer = 0;

    playerMeshGroup.scale.y = 1;
    playerMeshGroup.position.y = 0;
    playerMeshGroup.rotation.set(0, 0, 0);

    State.set('targetLane', 0);
    State.set('isInvincible', false);
    State.set('invincibilityTimer', 0);
    State.set('damageCooldown', 0);

    const fuegoOverlay = document.getElementById('fuego-overlay');
    if (fuegoOverlay) {
        fuegoOverlay.classList.remove('fuego-active');
    }
}

/**
 * Set player position
 */
export function setPosition(x, y, z) {
    if (player) {
        player.position.set(x, y, z);
    }
}

/**
 * Set player rotation
 */
export function setRotation(x, y, z) {
    if (player) {
        player.rotation.set(x, y, z);
    }
}

export default {
    init,
    getPlayer,
    getMeshGroup,
    jump,
    slide,
    changeLane,
    takeDamage,
    setInvincible,
    getCollisionBox,
    update,
    reset,
    setPosition,
    setRotation
};
