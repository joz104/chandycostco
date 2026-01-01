/**
 * Level 5: Suburbia
 * The American dream - so close to Costco!
 */

import * as THREE from 'three';

// ============================================
// LEVEL CONFIGURATION
// ============================================

export const config = {
    id: 5,
    name: "SUBURBIA",
    length: 3000,
    color: 0x87CEEB,
    fog: 0xFFFFFF,
    speed: 32,
    groundColor: 0x333333,
    npc: null,  // Mom is on the phone, not physically present
    // Difficulty settings
    minObstacleGap: 10,
    maxObstacleGap: 22,
    collectibleGap: 40
};

// ============================================
// DIALOGUE
// ============================================

export const dialogue = [
    { speaker: "Chandler", text: "I made it! The street... it is so grey!", delay: 3000, action: "phone_call", sound: "phone_ring" },
    { speaker: "Mama", text: "Mijo! Can you see it? The Costco sign!", delay: 3000 },
    { speaker: "Chandler", text: "Mama? Is that you?", delay: 2500, action: "phone_call" },
    { speaker: "Mama", text: "I am with you in spirit. Run to the Glizzy!", delay: 3000 },
    { speaker: "Chandler", text: "I CAN TASTE THE RELISH!", delay: 2000, action: "phone_call" }
];

// ============================================
// CUTSCENE ENVIRONMENT
// ============================================

/**
 * Create the Suburbia cutscene environment
 * @param {THREE.Scene} scene - The Three.js scene
 * @returns {{ group: THREE.Group, animatedElements: Array }}
 */
export function createCutsceneEnvironment(scene) {
    const group = new THREE.Group();
    const animatedElements = [];

    // Bright optimistic sky with subtle clouds
    const bgGeo = new THREE.PlaneGeometry(60, 30);
    const bgMat = new THREE.ShaderMaterial({
        uniforms: {
            topColor: { value: new THREE.Color(0x87CEEB) },    // Sky blue
            bottomColor: { value: new THREE.Color(0xB0E0FF) }  // Lighter blue near horizon
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

    // Fluffy clouds
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.9 });
    const cloud1 = new THREE.Group();
    cloud1.add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 6), cloudMat));
    const c1b = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 6), cloudMat);
    c1b.position.set(1.3, -0.2, 0);
    cloud1.add(c1b);
    const c1c = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), cloudMat);
    c1c.position.set(-1.2, -0.3, 0);
    cloud1.add(c1c);
    cloud1.position.set(-8, 12, -18);
    group.add(cloud1);

    const cloud2 = cloud1.clone();
    cloud2.position.set(10, 10, -17);
    cloud2.scale.setScalar(0.7);
    group.add(cloud2);

    // Street with lane markings
    const streetMat = new THREE.MeshStandardMaterial({ color: 0x404040, roughness: 0.9 });
    const street = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.set(0, 0, -5);
    street.receiveShadow = true;
    group.add(street);

    // Yellow center line
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
    for (let i = 0; i < 6; i++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(2, 0.02, 0.15), lineMat);
        line.position.set(-10 + i * 4, 0.01, -5);
        group.add(line);
    }

    // Sidewalk
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, roughness: 0.8 });
    const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(40, 0.1, 2), sidewalkMat);
    sidewalk.position.set(0, 0.05, -12);
    group.add(sidewalk);

    // Houses (4 houses in a row)
    const houseColors = [0xFFE4B5, 0xB8D4E8, 0xF5DEB3, 0xE8D8C8];
    const roofColors = [0x8B4513, 0x696969, 0x8B0000, 0x4a4a4a];

    for (let i = 0; i < 4; i++) {
        const houseGroup = new THREE.Group();

        const houseMat = new THREE.MeshStandardMaterial({ color: houseColors[i], roughness: 0.8 });
        const houseBody = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.8, 3), houseMat);
        houseBody.position.y = 1.4;
        houseBody.castShadow = true;
        houseGroup.add(houseBody);

        const roofMat = new THREE.MeshStandardMaterial({ color: roofColors[i], roughness: 0.9 });
        const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.8, 4), roofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.y = 3.7;
        houseGroup.add(roof);

        const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a3020 });
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 0.1), doorMat);
        door.position.set(0, 0.7, 1.55);
        houseGroup.add(door);

        const windowMat = new THREE.MeshStandardMaterial({ color: 0x87CEEB, roughness: 0.1 });
        const win1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.1), windowMat);
        win1.position.set(-0.9, 1.8, 1.55);
        houseGroup.add(win1);
        const win2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.1), windowMat);
        win2.position.set(0.9, 1.8, 1.55);
        houseGroup.add(win2);

        houseGroup.position.set(-12 + i * 7, 0, -14);
        group.add(houseGroup);
    }

    // Street lights
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.5 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xFFFACD });

    for (let i = 0; i < 3; i++) {
        const lampGroup = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4, 8), poleMat);
        pole.position.y = 2;
        lampGroup.add(pole);

        const arm = new THREE.Mesh(new THREE.BoxGeometry(1, 0.08, 0.08), poleMat);
        arm.position.set(0.5, 3.9, 0);
        lampGroup.add(arm);

        const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.3), lampMat);
        lampHead.position.set(1, 3.75, 0);
        lampGroup.add(lampHead);

        lampGroup.position.set(-10 + i * 10, 0, -1);
        lampGroup.castShadow = true;
        group.add(lampGroup);
    }

    // Parked cars
    const carColors = [0x1E90FF, 0xDC143C];
    for (let c = 0; c < 2; c++) {
        const carGroup = new THREE.Group();
        const carMat = new THREE.MeshStandardMaterial({ color: carColors[c], metalness: 0.4, roughness: 0.3 });

        const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 1.2), carMat);
        body.position.y = 0.5;
        carGroup.add(body);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.1), carMat);
        cabin.position.set(0.2, 1.0, 0);
        carGroup.add(cabin);

        const glassmat = new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.1 });
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 1), glassmat);
        windshield.position.set(-0.4, 1.0, 0);
        carGroup.add(windshield);

        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
        const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 12);
        const positions = [[-0.7, 0.25, 0.6], [-0.7, 0.25, -0.6], [0.7, 0.25, 0.6], [0.7, 0.25, -0.6]];
        positions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(...pos);
            carGroup.add(wheel);
        });

        carGroup.position.set(-6 + c * 12, 0, -3);
        carGroup.rotation.y = c === 0 ? 0.1 : -0.05;
        carGroup.castShadow = true;
        group.add(carGroup);
    }

    // Mailboxes
    const mailboxMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const mailboxFlagMat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });

    for (let m = 0; m < 3; m++) {
        const mbGroup = new THREE.Group();
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.1), mailboxMat);
        post.position.y = 0.6;
        mbGroup.add(post);

        const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.25), mailboxMat);
        box.position.set(0, 1.25, 0);
        mbGroup.add(box);

        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.1), mailboxFlagMat);
        flag.position.set(0.27, 1.35, 0);
        mbGroup.add(flag);

        mbGroup.position.set(-9 + m * 7, 0, -10);
        group.add(mbGroup);
    }

    // Yard trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });

    for (let t = 0; t < 4; t++) {
        const treeGroup = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8), trunkMat);
        trunk.position.y = 0.75;
        treeGroup.add(trunk);

        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 8), leavesMat);
        leaves.position.y = 2.2;
        treeGroup.add(leaves);

        treeGroup.position.set(-11 + t * 7 + 2, 0, -11);
        treeGroup.castShadow = true;
        group.add(treeGroup);
    }

    // Fire hydrant
    const hydrantMat = new THREE.MeshStandardMaterial({ color: 0xFF4500 });
    const hydrant = new THREE.Group();
    const hydrantBody = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.6, 8), hydrantMat);
    hydrantBody.position.y = 0.3;
    hydrant.add(hydrantBody);
    const hydrantTop = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.15, 8), hydrantMat);
    hydrantTop.position.y = 0.65;
    hydrant.add(hydrantTop);
    hydrant.position.set(5, 0, -1);
    group.add(hydrant);

    // White picket fence
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.6 });
    for (let i = 0; i < 12; i++) {
        const picket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), fenceMat);
        picket.position.set(-8 + i * 1.2, 0.45, -9);
        group.add(picket);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(14, 0.06, 0.06), fenceMat);
    rail.position.set(-1.4, 0.75, -9);
    group.add(rail);
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.06, 0.06), fenceMat);
    rail2.position.set(-1.4, 0.25, -9);
    group.add(rail2);

    return { group, animatedElements };
}

// ============================================
// GAMEPLAY DECORATIONS
// ============================================

/**
 * Spawn a decoration for this level during gameplay
 * @param {THREE.Scene} scene - The Three.js scene
 * @param {number} zPos - Z position for the decoration
 * @param {Object} Materials - Material references from SceneManager
 * @returns {THREE.Object3D|null} - The decoration or null
 */
export function spawnDecoration(scene, zPos, Materials) {
    // Houses for suburbia
    const houseGroup = new THREE.Group();

    const wallMat = Materials?.HOUSE_WALL_1 || new THREE.MeshStandardMaterial({ color: 0xFFE4B5 });
    const walls = new THREE.Mesh(
        new THREE.BoxGeometry(6, 4, 6),
        Math.random() > 0.5 ? wallMat : (Materials?.HOUSE_WALL_2 || new THREE.MeshStandardMaterial({ color: 0xB8D4E8 }))
    );
    walls.position.y = 2.1;
    houseGroup.add(walls);

    const roofMat = Materials?.HOUSE_ROOF || new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 2, 4), roofMat);
    roof.position.y = 5;
    roof.rotation.y = Math.PI / 4;
    houseGroup.add(roof);

    const doorMat = Materials?.HOUSE_DOOR || new THREE.MeshStandardMaterial({ color: 0x4a3020 });
    const door = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.2), doorMat);
    door.position.set(0, 1, 3);
    houseGroup.add(door);

    const side = Math.random() > 0.5 ? 1 : -1;
    houseGroup.position.set(side * (18 + Math.random() * 2), 0, zPos);
    houseGroup.rotation.y = side === 1 ? -Math.PI / 2 : Math.PI / 2;

    return houseGroup;
}

// ============================================
// ANIMATED ELEMENTS
// ============================================

export function updateAnimations(animatedElements, deltaTime) {
    // No animated elements for this level
}

export default {
    config,
    dialogue,
    createCutsceneEnvironment,
    spawnDecoration,
    updateAnimations
};
