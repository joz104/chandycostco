/**
 * Level 4: The Wall
 * The border crossing with the Border Agent
 */

import * as THREE from 'three';

// ============================================
// LEVEL CONFIGURATION
// ============================================

export const config = {
    id: 4,
    name: "THE WALL",
    length: 2500,
    color: 0x101030,
    fog: 0x101030,
    speed: 28,
    groundColor: 0x5d4037,
    npc: 'agent',
    // Difficulty settings
    minObstacleGap: 12,
    maxObstacleGap: 25,
    collectibleGap: 45
};

// ============================================
// DIALOGUE
// ============================================

export const dialogue = [
    { speaker: "Chandler", text: "Ay caramba! The Wall! It is huge!", delay: 3000 },
    { speaker: "Agent", text: "HALT! RESTRICTED AREA! TURN BACK!", delay: 3000, action: "agent_scan", sound: "scanner_beep" },
    { speaker: "Chandler", text: "I cannot! The coupon expires tomorrow!", delay: 3000 },
    { speaker: "Agent", text: "We've been tracking you since the river crossing, amigo.", delay: 3500, action: "agent_scan", sound: "walkie_talkie" },
    { speaker: "Agent", text: "Deploying searchlights! Release the drones!", delay: 3000, action: "deploy_drones", sound: "drone_launch" },
    { speaker: "Chandler", text: "You cannot stop the hunger of a free man!", delay: 2500 }
];

// ============================================
// CUTSCENE ENVIRONMENT
// ============================================

/**
 * Create The Wall cutscene environment
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {{ group: THREE.Group, animatedElements: Array }}
 */
export function createCutsceneEnvironment(scene) {
    const group = new THREE.Group();
    const animatedElements = [];

    // Dark gradient sky
    const bgGeo = new THREE.PlaneGeometry(60, 30);
    const bgMat = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x0a0a1a) },
            bottomColor: { value: new THREE.Color(0x1a1a2e) }
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

    // Simple dark ground
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 1.0 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -5);
    ground.receiveShadow = true;
    group.add(ground);

    // Simple tall wall silhouette in background
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 });
    const wall = new THREE.Mesh(new THREE.BoxGeometry(40, 8, 1), wallMat);
    wall.position.set(0, 4, -12);
    group.add(wall);

    // Single chain-link fence section (closer, to the side)
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.5 });
    const fencePost = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6, 8), fenceMat);
    fencePost.position.set(6, 3, -4);
    group.add(fencePost);

    // Searchlight on top of wall
    const searchlightGroup = new THREE.Group();
    const lightBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    lightBase.position.y = 8.25;
    searchlightGroup.add(lightBase);

    const lightBeam = new THREE.Mesh(
        new THREE.ConeGeometry(2, 8, 16, 1, true),
        new THREE.MeshBasicMaterial({
            color: 0xFFFF99,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        })
    );
    lightBeam.position.y = 4;
    lightBeam.rotation.x = Math.PI;
    searchlightGroup.add(lightBeam);

    searchlightGroup.position.set(-5, 0, -12);
    group.add(searchlightGroup);
    animatedElements.push({ type: 'searchlight', mesh: searchlightGroup, speed: 0.3 });

    // Second searchlight
    const searchlight2 = searchlightGroup.clone();
    searchlight2.position.set(5, 0, -12);
    group.add(searchlight2);
    animatedElements.push({ type: 'searchlight', mesh: searchlight2, speed: -0.2 });

    // Warning lights on fence
    const warningLightMat = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.8
    });
    const warningLight1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), warningLightMat);
    warningLight1.position.set(6, 6, -4);
    group.add(warningLight1);
    animatedElements.push({ type: 'warningLight', mesh: warningLight1 });

    const warningLight2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), warningLightMat.clone());
    warningLight2.position.set(-6, 6, -4);
    group.add(warningLight2);
    animatedElements.push({ type: 'warningLight', mesh: warningLight2 });

    return { group, animatedElements };
}

// ============================================
// GAMEPLAY DECORATIONS
// ============================================

export function spawnDecoration(scene, zPos) {
    // No decorations for wall level during gameplay
    return null;
}

// ============================================
// ANIMATED ELEMENTS
// ============================================

export function updateAnimations(animatedElements, deltaTime) {
    const time = Date.now() * 0.001;

    animatedElements.forEach(element => {
        if (element.type === 'searchlight') {
            const speed = element.speed || 0.3;
            element.mesh.rotation.y += deltaTime * speed;
        } else if (element.type === 'warningLight') {
            const pulse = (Math.sin(time * 4) + 1) / 2;
            element.mesh.material.opacity = 0.5 + pulse * 0.5;
            element.mesh.scale.setScalar(0.8 + pulse * 0.4);
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
