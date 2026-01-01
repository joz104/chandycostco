/**
 * Level 1: Home Town
 * The starting village with Mama's farewell
 */

import * as THREE from 'three';

// ============================================
// LEVEL CONFIGURATION
// ============================================

export const config = {
    id: 1,
    name: "HOME TOWN",
    length: 1000,
    color: 0xD2B48C,
    fog: 0xD2B48C,
    speed: 16,
    groundColor: 0xE3C988,
    npc: 'mom',
    // Difficulty settings
    minObstacleGap: 20,
    maxObstacleGap: 35,
    collectibleGap: 60
};

// ============================================
// DIALOGUE
// ============================================

export const dialogue = [
    { speaker: "Chandler", text: "Mama... I have to go. The village has no hotdogs left.", delay: 3000 },
    { speaker: "Mama", text: "Oh, mi hijo. You go to the North? To the land of Costco?", delay: 3000 },
    { speaker: "Chandler", text: "Si. I dream of the Freedom Glizzy. $1.50 with a soda.", delay: 3500 },
    { speaker: "Mama", text: "It is dangerous! The Wall... The ICE... The heat!", delay: 3000 },
    { speaker: "Chandler", text: "I am fast, Mama. Like the wind.", delay: 2500, sound: "footsteps" },
    { speaker: "Mama", text: "Take these flip-flops. And do not forget who you are.", delay: 3500 },
    { speaker: "Chandler", text: "Adios, Mama. I will bring you back a churro.", delay: 2000 }
];

// ============================================
// CUTSCENE ENVIRONMENT
// ============================================

/**
 * Create the Home Town cutscene environment
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {THREE.Group} - The environment group
 */
export function createCutsceneEnvironment(scene) {
    const group = new THREE.Group();

    // Warm sunset gradient background plane
    const bgGeo = new THREE.PlaneGeometry(60, 30);
    const bgMat = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0xFF6B35) },    // Orange
            bottomColor: { value: new THREE.Color(0xFFD93D) }  // Yellow
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            varying vec2 vUv;
            void main() {
                gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
            }
        `,
        side: THREE.DoubleSide
    });
    const background = new THREE.Mesh(bgGeo, bgMat);
    background.position.set(0, 8, -15);
    group.add(background);

    // Adobe/stucco house
    const houseMat = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 1.0 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9 });

    const house = new THREE.Group();

    // Main walls
    const walls = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 6), houseMat);
    walls.position.y = 2.5;
    walls.castShadow = true;
    house.add(walls);

    // Flat roof with slight overhang
    const roof = new THREE.Mesh(new THREE.BoxGeometry(9, 0.4, 7), roofMat);
    roof.position.y = 5.2;
    house.add(roof);

    // Door
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x6B4423 });
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 0.2), doorMat);
    door.position.set(0, 1.25, 3.1);
    house.add(door);

    // Windows (simple rectangles)
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x4A90E2, roughness: 0.1 });
    const window1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.1), windowMat);
    window1.position.set(-2, 2.5, 3.05);
    house.add(window1);

    const window2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.1), windowMat);
    window2.position.set(2, 2.5, 3.05);
    house.add(window2);

    house.position.set(5, 0, 0);
    group.add(house);

    // Cacti decorations
    const cactusMat = new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 1.0 });

    // Cactus 1
    const cactus1 = createCactus(cactusMat, 2.5);
    cactus1.position.set(-8, 0, 2);
    cactus1.castShadow = true;
    group.add(cactus1);

    // Cactus 2
    const cactus2 = createCactus(cactusMat, 1.8);
    cactus2.position.set(-6, 0, -3);
    cactus2.castShadow = true;
    group.add(cactus2);

    group.position.z = 0;
    return group;
}

// ============================================
// GAMEPLAY DECORATIONS
// ============================================

/**
 * Spawn a decoration for this level during gameplay
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} zPos - Z position for the decoration
 * @returns {THREE.Object3D|null} - The decoration or null
 */
export function spawnDecoration(scene, zPos) {
    // Cactus for home/desert
    const h = Math.random() * 2 + 1;
    const cactusGeo = new THREE.BoxGeometry(0.5, h, 0.5);
    const cactusMat = new THREE.MeshStandardMaterial({ color: 0x2E8B57 });
    const cactus = new THREE.Mesh(cactusGeo, cactusMat);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.4), cactusMat);
    arm.position.y = h * 0.3;
    cactus.add(arm);

    cactus.position.set(
        (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 8),
        h / 2,
        zPos + Math.random() * 10 - 5
    );
    cactus.castShadow = true;

    return cactus;
}

// ============================================
// HELPERS
// ============================================

function createCactus(material, height) {
    const cactus = new THREE.Group();

    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.5, height, 0.5), material);
    trunk.position.y = height / 2;
    cactus.add(trunk);

    if (height > 2) {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.4), material);
        arm.position.y = height * 0.6;
        cactus.add(arm);
    }

    return cactus;
}

// ============================================
// ANIMATED ELEMENTS (for cutscene)
// ============================================

export function getAnimatedElements() {
    // No animated elements for this level
    return [];
}

export default {
    config,
    dialogue,
    createCutsceneEnvironment,
    spawnDecoration,
    getAnimatedElements
};
