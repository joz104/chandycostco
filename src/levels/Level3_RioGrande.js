/**
 * Level 3: Rio Grande
 * Crossing the dangerous river, meeting the Alligator
 */

import * as THREE from 'three';

// ============================================
// LEVEL CONFIGURATION
// ============================================

export const config = {
    id: 3,
    name: "RIO GRANDE",
    length: 2000,
    color: 0x4682B4,
    fog: 0x4682B4,
    speed: 24,
    groundColor: 0x2F4F4F,
    npc: 'alligator',
    // Difficulty settings
    minObstacleGap: 15,
    maxObstacleGap: 28,
    collectibleGap: 50
};

// ============================================
// DIALOGUE
// ============================================

export const dialogue = [
    { speaker: "Chandler", text: "The River! I must cross before...", delay: 2500, sound: "water_flow" },
    { speaker: "Alligator", text: "SNAP SNAP. Tasty toes.", delay: 3000, action: "gator_snap", sound: "jaw_snap" },
    { speaker: "Chandler", text: "Please Mr. Gator, I am just passing through!", delay: 3000 },
    { speaker: "Alligator", text: "The toll is one leg. Or a chicken nugget.", delay: 3000, sound: "gator_hiss" },
    { speaker: "Chandler", text: "I have flip-flops from my Mama! Brand new!", delay: 3000 },
    { speaker: "Alligator", text: "Bah! I have no feet. Give me your quarters instead!", delay: 3000 },
    { speaker: "Chandler", text: "Not my quarters! See ya later alligator!", delay: 2000, sound: "splash" }
];

// ============================================
// CUTSCENE ENVIRONMENT
// ============================================

/**
 * Create the Rio Grande cutscene environment
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {{ group: THREE.Group, animatedElements: Array }}
 */
export function createCutsceneEnvironment(scene) {
    const group = new THREE.Group();
    const animatedElements = [];

    // Dark ominous sky with dusk tones
    const bgGeo = new THREE.PlaneGeometry(60, 30);
    const bgMat = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x1a2a3a) },    // Dark blue-gray
            bottomColor: { value: new THREE.Color(0x4a3a2a) }  // Murky brown-orange (dusk)
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

    // Dark murky water with choppy ripples
    const waterGeo = new THREE.PlaneGeometry(40, 30, 40, 30);
    const waterMat = new THREE.MeshStandardMaterial({
        color: 0x1C3030,        // Dark murky green-brown
        roughness: 0.5,
        metalness: 0.2,
        transparent: true,
        opacity: 0.92           // More opaque = murkier
    });

    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.5, 0);
    water.receiveShadow = true;

    // Store original positions for animation
    water.userData.originalPositions = new Float32Array(waterGeo.attributes.position.array);

    group.add(water);
    animatedElements.push({ type: 'water', mesh: water });

    // Weathered dark reeds on riverbank
    const reedMat = new THREE.MeshStandardMaterial({ color: 0x3a4a2a, roughness: 1.0 });
    const reedTopMat = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.9 });

    // Left bank reeds
    for (let i = 0; i < 12; i++) {
        const reed = new THREE.Group();

        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.08, 2.5, 6),
            reedMat
        );
        stem.position.y = 1.25;
        reed.add(stem);

        const top = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.1, 0.5, 8),
            reedTopMat
        );
        top.position.y = 2.75;
        reed.add(top);

        reed.position.set(
            -8 + Math.random() * 2,
            0,
            -5 + i * 1.5 + Math.random()
        );
        reed.castShadow = true;

        group.add(reed);
        animatedElements.push({ type: 'reed', mesh: reed, offset: i * 0.5 });
    }

    // Right bank reeds
    for (let i = 0; i < 12; i++) {
        const reed = new THREE.Group();

        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.08, 2.5, 6),
            reedMat
        );
        stem.position.y = 1.25;
        reed.add(stem);

        const top = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.1, 0.5, 8),
            reedTopMat
        );
        top.position.y = 2.75;
        reed.add(top);

        reed.position.set(
            8 - Math.random() * 2,
            0,
            -5 + i * 1.5 + Math.random()
        );
        reed.castShadow = true;

        group.add(reed);
        animatedElements.push({ type: 'reed', mesh: reed, offset: i * 0.5 + Math.PI });
    }

    // Floating log
    const logMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.9 });
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), logMat);
    log.rotation.z = Math.PI / 2;
    log.position.set(-2, 0, -8);
    log.castShadow = true;
    group.add(log);

    // Warning sign - "PELIGRO" on wooden post
    const signGroup = new THREE.Group();
    const postMat = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 1.0 });
    const signPost = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 3, 6), postMat);
    signPost.position.y = 1.5;
    signGroup.add(signPost);

    // Sign board (weathered red/orange)
    const signBoardMat = new THREE.MeshStandardMaterial({ color: 0x8B2500, roughness: 0.8 });
    const signBoard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.1), signBoardMat);
    signBoard.position.set(0, 2.8, 0);
    signBoard.rotation.y = 0.3;
    signGroup.add(signBoard);

    // Skull symbol on sign
    const skullMat = new THREE.MeshStandardMaterial({ color: 0xE0D8C0 });
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), skullMat);
    skull.position.set(0, 2.85, 0.08);
    skull.scale.y = 0.9;
    signGroup.add(skull);

    signGroup.position.set(-6, 0, -2);
    signGroup.rotation.y = 0.4;
    group.add(signGroup);

    // Floating debris
    const debrisMat = new THREE.MeshStandardMaterial({ color: 0x2a2015, roughness: 1.0 });

    const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 1.5, 5), debrisMat);
    branch1.rotation.set(0.2, 0.5, Math.PI / 2);
    branch1.position.set(3, 0.1, -5);
    group.add(branch1);

    const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 1.2, 5), debrisMat);
    branch2.rotation.set(-0.1, 0.8, Math.PI / 2 + 0.3);
    branch2.position.set(1, 0.05, -3);
    group.add(branch2);

    // Old tire floating
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.15, 8, 12), tireMat);
    tire.rotation.x = Math.PI / 2 + 0.3;
    tire.position.set(4, 0.1, -7);
    group.add(tire);

    // Dead tree silhouettes
    const deadTreeMat = new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 1.0 });

    // Dead tree 1
    const deadTree1 = new THREE.Group();
    const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 4, 6), deadTreeMat);
    trunk1.position.y = 2;
    deadTree1.add(trunk1);
    const branch1a = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 1.5, 5), deadTreeMat);
    branch1a.position.set(-0.5, 3.2, 0);
    branch1a.rotation.z = Math.PI / 4;
    deadTree1.add(branch1a);
    const branch1b = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.07, 1.2, 5), deadTreeMat);
    branch1b.position.set(0.4, 3.5, 0);
    branch1b.rotation.z = -Math.PI / 5;
    deadTree1.add(branch1b);
    deadTree1.position.set(-10, 0, -4);
    deadTree1.castShadow = true;
    group.add(deadTree1);

    // Dead tree 2
    const deadTree2 = new THREE.Group();
    const trunk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 2.5, 6), deadTreeMat);
    trunk2.position.y = 1.25;
    deadTree2.add(trunk2);
    const branch2a = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.06, 1, 5), deadTreeMat);
    branch2a.position.set(0.3, 2.3, 0);
    branch2a.rotation.z = -Math.PI / 3;
    deadTree2.add(branch2a);
    deadTree2.position.set(10, 0, -6);
    deadTree2.rotation.y = 0.5;
    deadTree2.castShadow = true;
    group.add(deadTree2);

    // Fog/mist layer
    const fogMat = new THREE.MeshBasicMaterial({
        color: 0x3a4a4a,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    const fogPlane = new THREE.Mesh(new THREE.PlaneGeometry(35, 15), fogMat);
    fogPlane.rotation.x = -Math.PI / 2;
    fogPlane.position.set(0, 0.8, -5);
    group.add(fogPlane);

    return { group, animatedElements };
}

// ============================================
// GAMEPLAY DECORATIONS
// ============================================

export function spawnDecoration(scene, zPos) {
    // No decorations for river level during gameplay
    return null;
}

// ============================================
// ANIMATED ELEMENTS
// ============================================

export function updateAnimations(animatedElements, deltaTime) {
    const time = Date.now() * 0.001;

    animatedElements.forEach(element => {
        if (element.type === 'water') {
            updateWaterRipples(element.mesh, time);
        } else if (element.type === 'reed') {
            element.mesh.rotation.z = Math.sin(time * 1.5 + element.offset) * 0.15;
        }
    });
}

function updateWaterRipples(waterMesh, time) {
    const geometry = waterMesh.geometry;
    const positions = geometry.attributes.position;
    const originalPositions = waterMesh.userData.originalPositions;

    for (let i = 0; i < positions.count; i++) {
        const x = originalPositions[i * 3];
        const y = originalPositions[i * 3 + 1];

        // Choppier, more turbulent waves
        const wave1 = Math.sin(x * 0.5 + time * 1.5) * 0.25;
        const wave2 = Math.sin(y * 0.6 + time * 1.8) * 0.18;
        const wave3 = Math.sin((x + y) * 0.4 + time * 1.2) * 0.2;

        positions.setZ(i, wave1 + wave2 + wave3);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
}

export default {
    config,
    dialogue,
    createCutsceneEnvironment,
    spawnDecoration,
    updateAnimations
};
