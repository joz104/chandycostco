/**
 * Level 2: The Desert
 * Meeting the Coyote in the scorching heat
 */

import * as THREE from 'three';

// ============================================
// LEVEL CONFIGURATION
// ============================================

export const config = {
    id: 2,
    name: "THE DESERT",
    length: 1500,
    color: 0xFF8C00,
    fog: 0xFF8C00,
    speed: 20,
    groundColor: 0xCD853F,
    npc: 'coyote',
    // Difficulty settings
    minObstacleGap: 18,
    maxObstacleGap: 30,
    collectibleGap: 55
};

// ============================================
// DIALOGUE
// ============================================

export const dialogue = [
    { speaker: "Chandler", text: "Phew! The desert. It is so quiet...", delay: 3000 },
    { speaker: "Coyote", text: "Turn back, little one. The heat takes everyone.", delay: 3000 },
    { speaker: "Chandler", text: "A talking Coyote?! Am I hallucinating?", delay: 3000 },
    { speaker: "Coyote", text: "Your mama warned you about the heat, no? She was right.", delay: 3500 },
    { speaker: "Coyote", text: "Maybe you ARE hallucinating. Or maybe I am ICE in disguise. Awoooo!", delay: 3500, sound: "coyote_howl" },
    { speaker: "Chandler", text: "I don't care! I have a coupon!", delay: 2000 }
];

// ============================================
// CUTSCENE ENVIRONMENT
// ============================================

/**
 * Create the Desert cutscene environment
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {{ group: THREE.Group, animatedElements: Array }}
 */
export function createCutsceneEnvironment(scene) {
    const group = new THREE.Group();
    const animatedElements = [];

    // Orange gradient sky - simple and clean
    const bgGeo = new THREE.PlaneGeometry(60, 30);
    const bgMat = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0xFF6B35) },    // Warm orange
            bottomColor: { value: new THREE.Color(0xFFB347) }  // Light orange
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
    background.position.set(0, 8, -20);
    group.add(background);

    // Simple sandy ground plane
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0xE8C39E,
        roughness: 1.0
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -5);
    ground.receiveShadow = true;
    group.add(ground);

    // Single stylized cactus (far right, out of the way)
    const cactusMat = new THREE.MeshStandardMaterial({ color: 0x2E8B57 });

    const cactusGroup = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3, 8), cactusMat);
    trunk.position.y = 1.5;
    cactusGroup.add(trunk);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8), cactusMat);
    armL.position.set(-0.6, 2, 0);
    armL.rotation.z = Math.PI / 3;
    cactusGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.5, 8), cactusMat);
    armR.position.set(0.7, 1.5, 0);
    armR.rotation.z = -Math.PI / 4;
    cactusGroup.add(armR);

    cactusGroup.position.set(8, 0, -3);
    cactusGroup.traverse(c => { if (c.isMesh) c.castShadow = true; });
    group.add(cactusGroup);

    // Subtle heat shimmer (just one, subtle)
    const shimmerMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
    });
    const shimmer = new THREE.Mesh(new THREE.PlaneGeometry(30, 4), shimmerMat);
    shimmer.rotation.x = -Math.PI / 2;
    shimmer.position.set(0, 0.3, -8);
    group.add(shimmer);
    animatedElements.push({ type: 'heatWave', mesh: shimmer, offset: 0 });

    return { group, animatedElements };
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
    // Cactus for desert
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
// ANIMATED ELEMENTS
// ============================================

export function updateAnimations(animatedElements, deltaTime) {
    const time = Date.now() * 0.001;

    animatedElements.forEach(element => {
        if (element.type === 'heatWave') {
            element.mesh.position.y = Math.sin(time * 2 + element.offset) * 0.3;
            element.mesh.material.opacity = 0.1 + Math.sin(time * 3 + element.offset) * 0.05;
        }
    });
}

export default {
    config,
    dialogue,
    createCutsceneEnvironment,
    spawnDecoration,
    updateAnimations
};
