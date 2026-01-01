/**
 * CutsceneEnvironment - Creates themed background scenery for each cutscene
 * Uses Three.js primitives to maintain the game's low-poly aesthetic
 */

import * as THREE from 'three';

// Storage for active environment objects
let activeEnvironmentObjects = [];
let animatedElements = [];

/**
 * Create cutscene environment based on level ID
 * @param {number} levelId - The level ID (1-5, or 'intro'/'costco')
 * @param {THREE.Scene} scene - The Three.js scene
 */
export function createCutsceneEnvironment(levelId, scene) {
    // Clear any existing environment
    removeCutsceneEnvironment(scene);

    switch (levelId) {
        case 0:
            createHomeTownEnvironment(scene);
            break;
        case 1:
            createDesertEnvironment(scene);
            break;
        case 2:
            createRioGrandeEnvironment(scene);
            break;
        case 3:
            createWallEnvironment(scene);
            break;
        case 4:
            createSuburbiaEnvironment(scene);
            break;
        case 'costco':
            createCostcoEnvironment(scene);
            break;
        case 'costco-exterior':
            createCostcoExteriorEnvironment(scene);
            break;
        default:
            console.warn(`No environment defined for level ${levelId}`);
    }
}

/**
 * Remove all active cutscene environment objects
 * @param {THREE.Scene} scene - The Three.js scene
 */
export function removeCutsceneEnvironment(scene) {
    activeEnvironmentObjects.forEach(obj => {
        scene.remove(obj);
        obj.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    });

    activeEnvironmentObjects = [];
    animatedElements = [];
}

/**
 * Update animated environment elements
 * @param {number} deltaTime - Time elapsed since last frame in seconds
 */
export function updateCutsceneEnvironment(deltaTime) {
    const time = Date.now() * 0.001; // Convert to seconds

    animatedElements.forEach(element => {
        if (element.type === 'water') {
            // Animate water ripples
            updateWaterRipples(element.mesh, time);
        } else if (element.type === 'searchlight') {
            // Rotate searchlight beams (use custom speed if available)
            const speed = element.speed || 0.3;
            element.mesh.rotation.y += deltaTime * speed;
        } else if (element.type === 'heatWave') {
            // Heat shimmer effect
            element.mesh.position.y = Math.sin(time * 2 + element.offset) * 0.3;
            element.mesh.material.opacity = 0.1 + Math.sin(time * 3 + element.offset) * 0.05;
        } else if (element.type === 'reed') {
            // Sway reeds
            element.mesh.rotation.z = Math.sin(time * 1.5 + element.offset) * 0.15;
        } else if (element.type === 'warningLight') {
            // Pulsing red warning light
            const pulse = (Math.sin(time * 4) + 1) / 2;
            element.mesh.material.opacity = 0.5 + pulse * 0.5;
            element.mesh.scale.setScalar(0.8 + pulse * 0.4);
        }
    });
}

/**
 * HOME TOWN (Intro, Level 1) - Adobe house with warm sunset
 */
function createHomeTownEnvironment(scene) {
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
    scene.add(group);
    activeEnvironmentObjects.push(group);
}

/**
 * DESERT (Level 2) - Simple desert with cactus silhouette
 */
function createDesertEnvironment(scene) {
    const group = new THREE.Group();

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

    scene.add(group);
    activeEnvironmentObjects.push(group);
}

/**
 * RIO GRANDE (Level 3) - Animated water with reeds
 */
function createRioGrandeEnvironment(scene) {
    const group = new THREE.Group();

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
    const reedMat = new THREE.MeshStandardMaterial({ color: 0x3a4a2a, roughness: 1.0 });      // Darker green
    const reedTopMat = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.9 });   // Dark brown

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

    // === DANGER ELEMENTS ===

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

    // Skull symbol on sign (simple white sphere + jaw)
    const skullMat = new THREE.MeshStandardMaterial({ color: 0xE0D8C0 });
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), skullMat);
    skull.position.set(0, 2.85, 0.08);
    skull.scale.y = 0.9;
    signGroup.add(skull);

    signGroup.position.set(-6, 0, -2);
    signGroup.rotation.y = 0.4;
    group.add(signGroup);

    // Floating debris - branches
    const debrisMat = new THREE.MeshStandardMaterial({ color: 0x2a2015, roughness: 1.0 });

    // Branch 1 - floating
    const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 1.5, 5), debrisMat);
    branch1.rotation.set(0.2, 0.5, Math.PI / 2);
    branch1.position.set(3, 0.1, -5);
    group.add(branch1);

    // Branch 2 - floating
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

    // Dead tree silhouettes on banks
    const deadTreeMat = new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 1.0 });

    // Dead tree 1 - left bank
    const deadTree1 = new THREE.Group();
    const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 4, 6), deadTreeMat);
    trunk1.position.y = 2;
    deadTree1.add(trunk1);
    // Bare branches
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

    // Dead tree 2 - right bank (shorter, broken)
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

    // Fog/mist layer near water surface (subtle)
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

    scene.add(group);
    activeEnvironmentObjects.push(group);
}

/**
 * THE WALL (Level 4) - Minimal dark border scene
 */
function createWallEnvironment(scene) {
    const group = new THREE.Group();

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

    scene.add(group);
    activeEnvironmentObjects.push(group);
}

/**
 * SUBURBIA (Level 5) - Busy American neighborhood - the promised land!
 */
function createSuburbiaEnvironment(scene) {
    const group = new THREE.Group();

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

    // === HOUSES (4 houses in a row) ===
    const houseColors = [0xFFE4B5, 0xB8D4E8, 0xF5DEB3, 0xE8D8C8];  // Beige, light blue, wheat, cream
    const roofColors = [0x8B4513, 0x696969, 0x8B0000, 0x4a4a4a];    // Brown, gray, dark red, charcoal

    for (let i = 0; i < 4; i++) {
        const houseGroup = new THREE.Group();

        // House body
        const houseMat = new THREE.MeshStandardMaterial({ color: houseColors[i], roughness: 0.8 });
        const houseBody = new THREE.Mesh(new THREE.BoxGeometry(3.5, 2.8, 3), houseMat);
        houseBody.position.y = 1.4;
        houseBody.castShadow = true;
        houseGroup.add(houseBody);

        // Roof
        const roofMat = new THREE.MeshStandardMaterial({ color: roofColors[i], roughness: 0.9 });
        const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.8, 4), roofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.y = 3.7;
        houseGroup.add(roof);

        // Door
        const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a3020 });
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 0.1), doorMat);
        door.position.set(0, 0.7, 1.55);
        houseGroup.add(door);

        // Windows (2 per house)
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

    // === STREET LIGHTS (3 lamps) ===
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.5 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xFFFACD });  // Light yellow glow

    for (let i = 0; i < 3; i++) {
        const lampGroup = new THREE.Group();

        // Pole
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4, 8), poleMat);
        pole.position.y = 2;
        lampGroup.add(pole);

        // Lamp arm
        const arm = new THREE.Mesh(new THREE.BoxGeometry(1, 0.08, 0.08), poleMat);
        arm.position.set(0.5, 3.9, 0);
        lampGroup.add(arm);

        // Lamp head
        const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.3), lampMat);
        lampHead.position.set(1, 3.75, 0);
        lampGroup.add(lampHead);

        lampGroup.position.set(-10 + i * 10, 0, -1);
        lampGroup.castShadow = true;
        group.add(lampGroup);
    }

    // === PARKED CARS (2 cars) ===
    const carColors = [0x1E90FF, 0xDC143C];  // Blue, Red

    for (let c = 0; c < 2; c++) {
        const carGroup = new THREE.Group();
        const carMat = new THREE.MeshStandardMaterial({ color: carColors[c], metalness: 0.4, roughness: 0.3 });

        // Car body
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 1.2), carMat);
        body.position.y = 0.5;
        carGroup.add(body);

        // Car cabin
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.1), carMat);
        cabin.position.set(0.2, 1.0, 0);
        carGroup.add(cabin);

        // Windows (dark)
        const glassmat = new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.1 });
        const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 1), glassmat);
        windshield.position.set(-0.4, 1.0, 0);
        carGroup.add(windshield);

        // Wheels
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

    // === MAILBOXES (3 mailboxes) ===
    const mailboxMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const mailboxFlagMat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });

    for (let m = 0; m < 3; m++) {
        const mbGroup = new THREE.Group();

        // Post
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 0.1), mailboxMat);
        post.position.y = 0.6;
        mbGroup.add(post);

        // Box
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.25), mailboxMat);
        box.position.set(0, 1.25, 0);
        mbGroup.add(box);

        // Red flag
        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.1), mailboxFlagMat);
        flag.position.set(0.27, 1.35, 0);
        mbGroup.add(flag);

        mbGroup.position.set(-9 + m * 7, 0, -10);
        group.add(mbGroup);
    }

    // === YARD TREES (4 trees) ===
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

    // === FIRE HYDRANT ===
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

    // === EXTENDED PICKET FENCE ===
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.6 });
    for (let i = 0; i < 12; i++) {
        const picket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), fenceMat);
        picket.position.set(-8 + i * 1.2, 0.45, -9);
        group.add(picket);
    }
    // Top rail
    const rail = new THREE.Mesh(new THREE.BoxGeometry(14, 0.06, 0.06), fenceMat);
    rail.position.set(-1.4, 0.75, -9);
    group.add(rail);
    // Bottom rail
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.06, 0.06), fenceMat);
    rail2.position.set(-1.4, 0.25, -9);
    group.add(rail2);

    scene.add(group);
    activeEnvironmentObjects.push(group);
}

/**
 * COSTCO EXTERIOR - Parking lot and building approach
 */
function createCostcoExteriorEnvironment(scene) {
    const group = new THREE.Group();

    // Day sky
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 20, 200);

    // Parking Lot Ground
    const lotGeo = new THREE.PlaneGeometry(60, 150);
    const lotMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const lot = new THREE.Mesh(lotGeo, lotMat);
    lot.rotation.x = -Math.PI / 2;
    lot.position.z = -40;
    lot.receiveShadow = true;
    group.add(lot);

    // Parking lines
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    for (let i = -4; i <= 4; i++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 8), lineMat);
        line.position.set(i * 5, 0.01, -20);
        group.add(line);
    }

    // The Costco Building
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE });
    const building = new THREE.Mesh(new THREE.BoxGeometry(40, 18, 8), buildingMat);
    building.position.set(0, 9, -70);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);

    // Red stripe at top
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xE31837 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(40, 3, 8.1), stripeMat);
    stripe.position.set(0, 15, -70);
    group.add(stripe);

    // COSTCO sign
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const ctx = signCanvas.getContext('2d');
    ctx.fillStyle = '#EEEEEE';
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = '#E31837';
    ctx.font = 'bold 80px Arial';
    ctx.fillText('COSTCO', 80, 90);
    const signTexture = new THREE.CanvasTexture(signCanvas);
    const signMat = new THREE.MeshBasicMaterial({ map: signTexture, transparent: true });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(20, 5), signMat);
    sign.position.set(0, 14, -65.9);
    group.add(sign);

    // Entrance doors (dark glass)
    const doorMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(4, 7, 0.2), doorMat);
    doorL.position.set(-3, 3.5, -65.9);
    group.add(doorL);
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(4, 7, 0.2), doorMat);
    doorR.position.set(3, 3.5, -65.9);
    group.add(doorR);

    // Shopping carts near entrance
    const cartMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.5 });
    for (let i = 0; i < 3; i++) {
        const cart = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.2), cartMat);
        cart.position.set(-12 + i * 1.2, 0.4, -60);
        group.add(cart);
    }

    // Parked cars in lot
    const carColors = [0x2F4F4F, 0x8B0000, 0x4169E1, 0x228B22];
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
            const carGroup = new THREE.Group();
            const carBody = new THREE.Mesh(
                new THREE.BoxGeometry(2, 1, 4),
                new THREE.MeshStandardMaterial({ color: carColors[(row + col) % carColors.length] })
            );
            carBody.position.y = 0.5;
            carGroup.add(carBody);
            const carTop = new THREE.Mesh(
                new THREE.BoxGeometry(1.6, 0.8, 2),
                new THREE.MeshStandardMaterial({ color: carColors[(row + col) % carColors.length] })
            );
            carTop.position.y = 1.4;
            carGroup.add(carTop);
            carGroup.position.set(-12 + col * 8, 0, -30 - row * 12);
            group.add(carGroup);
        }
    }

    scene.add(group);
    activeEnvironmentObjects.push(group);
}

/**
 * COSTCO (Ending) - Full Food Court Interior
 */
function createCostcoEnvironment(scene) {
    const group = new THREE.Group();

    // Set warehouse interior atmosphere
    scene.background = new THREE.Color(0xEEEEEE);
    scene.fog = new THREE.FogExp2(0xEEEEEE, 0.015);

    // Polished Concrete Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.4,
        metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Warehouse walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.8 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(60, 15, 1), wallMat);
    backWall.position.set(0, 7.5, -25);
    backWall.receiveShadow = true;
    group.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 50), wallMat);
    leftWall.position.set(-30, 7.5, 0);
    group.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 15, 50), wallMat);
    rightWall.position.set(30, 7.5, 0);
    group.add(rightWall);

    // Costco red accent stripe
    const redStripeMat = new THREE.MeshStandardMaterial({ color: 0xE31837 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(60, 2, 0.5), redStripeMat);
    stripe.position.set(0, 12, -24.8);
    group.add(stripe);

    // === FOOD COURT COUNTER ===
    const counterGroup = new THREE.Group();
    counterGroup.position.set(0, 0, -10);
    group.add(counterGroup);

    // Main Counter (Costco Red)
    const counter = new THREE.Mesh(
        new THREE.BoxGeometry(14, 1.2, 2),
        new THREE.MeshStandardMaterial({ color: 0xD32F2F })
    );
    counter.position.y = 0.6;
    counter.castShadow = true;
    counter.receiveShadow = true;
    counterGroup.add(counter);

    // Cash Registers
    const regMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    for (let i = -1; i <= 1; i += 2) {
        const reg = new THREE.Group();
        reg.position.set(i * 4, 1.2, 0.5);
        const base = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 1), regMat);
        base.position.y = 0.4;
        const screen = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.1), regMat);
        screen.position.set(0, 1.0, -0.4);
        screen.rotation.x = -0.3;
        const display = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), screenMat);
        display.position.set(0, 1.0, -0.34);
        display.rotation.x = -0.3;
        reg.add(base, screen, display);
        counterGroup.add(reg);
    }

    // === SODA FOUNTAIN ===
    const sodaMachine = new THREE.Group();
    sodaMachine.position.set(9, 0, -9);
    const smBody = new THREE.Mesh(
        new THREE.BoxGeometry(3, 4, 1.5),
        new THREE.MeshStandardMaterial({ color: 0xCCCCCC })
    );
    smBody.position.y = 2;
    sodaMachine.add(smBody);
    for (let i = 0; i < 4; i++) {
        const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        nozzle.rotation.x = Math.PI / 2;
        nozzle.position.set(-1 + i * 0.66, 2.5, 0.8);
        sodaMachine.add(nozzle);
    }
    group.add(sodaMachine);

    // === MENU BOARD with Food Court Sign ===
    const menuTexture = createFoodCourtSignTexture();
    const menuMat = new THREE.MeshStandardMaterial({
        map: menuTexture,
        emissive: 0xFFFFFF,
        emissiveMap: menuTexture,
        emissiveIntensity: 0.5
    });
    const menuBoard = new THREE.Mesh(new THREE.BoxGeometry(12, 3, 0.2), menuMat);
    menuBoard.position.set(0, 5, -12);
    group.add(menuBoard);

    // === PICNIC TABLES WITH EATERS ===
    function createPicnicTable(x, z) {
        const tGroup = new THREE.Group();
        const woodMat = new THREE.MeshStandardMaterial({ color: 0xD32F2F, roughness: 0.6 });
        const metalMat = new THREE.MeshStandardMaterial({ color: 0xAAAAAA });

        // Table Top
        const top = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 1.5), woodMat);
        top.position.y = 1.2;
        top.castShadow = true;

        // Benches
        const benchL = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 0.8), woodMat);
        benchL.position.set(0, 0.6, 1.2);
        benchL.castShadow = true;
        const benchR = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 0.8), woodMat);
        benchR.position.set(0, 0.6, -1.2);
        benchR.castShadow = true;

        // Frame legs
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.2);
        const leg1 = new THREE.Mesh(legGeo, metalMat);
        leg1.position.set(-1, 0.6, 0);
        const leg2 = new THREE.Mesh(legGeo, metalMat);
        leg2.position.set(1, 0.6, 0);

        tGroup.add(top, benchL, benchR, leg1, leg2);

        // Add an Eater (person sitting and eating)
        const eaterGroup = new THREE.Group();
        const shirtColors = [0x4169E1, 0x32CD32, 0xFF6347, 0x9370DB, 0xFFD700];
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.35, 0.8, 8),
            new THREE.MeshStandardMaterial({ color: shirtColors[Math.floor(Math.random() * shirtColors.length)] })
        );
        body.position.y = 0.4;
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0xffccaa })
        );
        head.position.y = 0.95;
        eaterGroup.add(body, head);
        eaterGroup.position.set(0, 0.7, 1.2);
        tGroup.add(eaterGroup);

        tGroup.position.set(x, 0, z);
        return tGroup;
    }

    group.add(createPicnicTable(-5, -3));
    group.add(createPicnicTable(5, -3));
    group.add(createPicnicTable(-5, 3));
    group.add(createPicnicTable(5, 3));

    // === PALLET RACKS (Warehouse style) ===
    function createPalletRack(x, z) {
        const rackGroup = new THREE.Group();
        const orangeMat = new THREE.MeshStandardMaterial({ color: 0xFF6F00 });
        const boxMat = new THREE.MeshStandardMaterial({ color: 0xC19A6B }); // Cardboard

        // Uprights
        for (let i = -1; i <= 1; i += 2) {
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8, 0.3), orangeMat);
            post.position.set(i * 2, 4, 0);
            rackGroup.add(post);
            const postBack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8, 0.3), orangeMat);
            postBack.position.set(i * 2, 4, -2);
            rackGroup.add(postBack);
        }

        // Beams & Shelves with boxes
        for (let y = 2; y <= 6; y += 2) {
            const beamFront = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.2, 0.1), orangeMat);
            beamFront.position.set(0, y, 0.15);
            rackGroup.add(beamFront);
            const beamBack = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.2, 0.1), orangeMat);
            beamBack.position.set(0, y, -2.15);
            rackGroup.add(beamBack);

            // Add Pallets of boxes
            const pallet = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.5, 1.8), boxMat);
            pallet.position.set(0, y + 0.85, -1);
            pallet.castShadow = true;
            rackGroup.add(pallet);
        }
        rackGroup.position.set(x, 0, z);
        return rackGroup;
    }

    group.add(createPalletRack(-10, -18));
    group.add(createPalletRack(10, -18));
    group.add(createPalletRack(-10, -22));
    group.add(createPalletRack(10, -22));

    // === CEILING LIGHTS ===
    const ceilingLightMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    for (let z = -20; z <= 0; z += 10) {
        const cl = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 1), ceilingLightMat);
        cl.position.set(0, 12, z);
        group.add(cl);
    }

    // Add warm point lights for interior lighting
    const lightColor = 0xFFFCE0; // Warm fluorescent
    const pointLight1 = new THREE.PointLight(lightColor, 0.8, 30, 2);
    pointLight1.position.set(0, 10, -5);
    group.add(pointLight1);

    const pointLight2 = new THREE.PointLight(lightColor, 0.8, 30, 2);
    pointLight2.position.set(-10, 10, -15);
    group.add(pointLight2);

    const pointLight3 = new THREE.PointLight(lightColor, 0.8, 30, 2);
    pointLight3.position.set(10, 10, -15);
    group.add(pointLight3);

    scene.add(group);
    activeEnvironmentObjects.push(group);
}

/**
 * Helper: Create Food Court Sign Texture
 */
function createFoodCourtSignTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(0, 0, 1024, 256);

    // Red header bar
    ctx.fillStyle = '#e31837';
    ctx.fillRect(0, 0, 1024, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px Arial';
    ctx.fillText('COSTCO FOOD COURT', 20, 35);

    // Hot Dog Combo
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('HOT DOG COMBO', 50, 120);
    ctx.fillStyle = '#e31837';
    ctx.fillText('$1.50', 50, 170);
    ctx.fillStyle = '#555555';
    ctx.font = '20px Arial';
    ctx.fillText('1/4 lb beef + 20oz soda', 50, 200);

    // Pizza Slice
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('PIZZA SLICE', 400, 120);
    ctx.fillStyle = '#e31837';
    ctx.fillText('$1.99', 400, 170);
    ctx.fillStyle = '#555555';
    ctx.font = '20px Arial';
    ctx.fillText('Cheese, Pepperoni, or Combo', 400, 200);

    // Chicken Bake
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('CHICKEN BAKE', 750, 120);
    ctx.fillStyle = '#e31837';
    ctx.fillText('$3.99', 750, 170);
    ctx.fillStyle = '#555555';
    ctx.font = '20px Arial';
    ctx.fillText('Chicken, bacon, caesar dressing', 750, 200);

    return new THREE.CanvasTexture(canvas);
}

/**
 * Helper: Create a cactus
 */
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

/**
 * Helper: Update water ripples
 */
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
    createCutsceneEnvironment,
    removeCutsceneEnvironment,
    updateCutsceneEnvironment
};
