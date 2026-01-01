/**
 * CharacterSystem - NPC character mesh creation and management
 */

import * as THREE from 'three';
import SceneManager from './SceneManager.js';

// Character meshes
const characters = {
    mama: null,
    coyote: null,
    alligator: null,
    agent: null,
    cashier: null,
    securityL: null,
    securityR: null
};

// Mesh groups for animation
const meshGroups = {
    mama: null,
    coyote: null,
    alligator: null,
    agent: null,
    cashier: null
};

// Animation parts storage for each character
const animationParts = {
    mama: {},
    coyote: {},
    alligator: {},
    agent: {},
    cashier: {}
};

// Animation state
let animationTime = 0;

// Player equipment (attached to player, but managed here)
let chandlerPhone = null;
let mamaThoughtBubble = null;

/**
 * Initialize all NPC characters
 */
export function init() {
    const scene = SceneManager.getScene();

    createMama(scene);
    createCoyote(scene);
    createAlligator(scene);
    createAgent(scene);
    createCashier(scene);
    createSecurity(scene);
    createPlayerEquipment(scene);

    // Hide all initially
    hideAll();
}

/**
 * Create Mama character
 */
function createMama(scene) {
    const mama = new THREE.Group();
    const meshGroup = new THREE.Group();
    mama.add(meshGroup);

    const matSkin = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.8 });
    const matDress = new THREE.MeshStandardMaterial({ color: 0x800080, roughness: 1.0 });
    const matHair = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1.0 });

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), matSkin);
    head.position.y = 2.7;
    head.castShadow = true;
    meshGroup.add(head);

    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.4), matHair);
    bun.position.set(0, 3.1, -0.2);
    meshGroup.add(bun);

    const dress = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.5, 16), matDress);
    dress.position.y = 1.25;
    dress.castShadow = true;
    meshGroup.add(dress);

    // Arms - positioned at sides of dress, hands clasped in front
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.7, 8), matSkin);
    armL.position.set(-0.5, 2.0, 0.3);
    armL.rotation.x = 0.5;  // Angled forward
    armL.rotation.z = 0.3;  // Angled inward
    armL.castShadow = true;
    meshGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.7, 8), matSkin);
    armR.position.set(0.5, 2.0, 0.3);
    armR.rotation.x = 0.5;  // Angled forward
    armR.rotation.z = -0.3; // Angled inward
    armR.castShadow = true;
    meshGroup.add(armR);

    // Hands - small spheres clasped in front
    const handL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), matSkin);
    handL.position.set(-0.15, 1.7, 0.5);
    meshGroup.add(handL);

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), matSkin);
    handR.position.set(0.15, 1.7, 0.5);
    meshGroup.add(handR);

    // Store animation parts
    animationParts.mama.head = head;
    animationParts.mama.armL = armL;
    animationParts.mama.armR = armR;
    animationParts.mama.meshGroup = meshGroup;

    scene.add(mama);
    characters.mama = mama;
    meshGroups.mama = meshGroup;
}

/**
 * Create Coyote character
 */
function createCoyote(scene) {
    const coyote = new THREE.Group();
    const meshGroup = new THREE.Group();
    coyote.add(meshGroup);

    const furMat = new THREE.MeshStandardMaterial({ color: 0xC2B280, roughness: 1.0 });
    const noseMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.2, 8), furMat);
    body.rotation.z = Math.PI / 2;
    body.position.y = 0.8;
    meshGroup.add(body);

    const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35), furMat);
    head.position.set(0.7, 1.3, 0);
    meshGroup.add(head);

    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 8), furMat);
    snout.rotation.z = -Math.PI / 2;
    snout.position.set(1.0, 1.3, 0);
    meshGroup.add(snout);

    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06), noseMat);
    nose.position.set(1.2, 1.3, 0);
    meshGroup.add(nose);

    const earL = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 4), furMat);
    earL.position.set(0.65, 1.7, 0.15);
    earL.rotation.x = 0.2;
    meshGroup.add(earL);

    const earR = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 4), furMat);
    earR.position.set(0.65, 1.7, -0.15);
    earR.rotation.x = -0.2;
    meshGroup.add(earR);

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.0, 0.8), furMat);
    tail.rotation.z = -Math.PI / 4;
    tail.position.set(-0.8, 0.6, 0);
    meshGroup.add(tail);

    // Store animation parts
    animationParts.coyote.tail = tail;
    animationParts.coyote.earL = earL;
    animationParts.coyote.earR = earR;
    animationParts.coyote.meshGroup = meshGroup;

    scene.add(coyote);
    characters.coyote = coyote;
    meshGroups.coyote = meshGroup;
}

/**
 * Create Alligator character
 */
function createAlligator(scene) {
    const alligator = new THREE.Group();
    const meshGroup = new THREE.Group();
    alligator.add(meshGroup);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 0.6 });
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0x90EE90, roughness: 0.8 });
    const toothMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x000000 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.7), skinMat);
    body.position.y = 0.5;
    meshGroup.add(body);

    // Ridges
    for (let i = 0; i < 5; i++) {
        const ridge = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 4), skinMat);
        ridge.position.set(-0.5 + (i * 0.25), 0.85, 0);
        meshGroup.add(ridge);
    }

    // Tail
    const tail1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.5), skinMat);
    tail1.position.set(-1.3, 0.5, 0);
    meshGroup.add(tail1);

    const tail2 = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.0, 4), skinMat);
    tail2.rotation.z = Math.PI / 2;
    tail2.position.set(-2.1, 0.5, 0);
    meshGroup.add(tail2);

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0.9, 0.6, 0);
    meshGroup.add(headGroup);

    const upperJaw = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.5), skinMat);
    upperJaw.position.set(0.45, 0.15, 0);
    headGroup.add(upperJaw);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), skinMat);
    eyeL.position.set(0.1, 0.35, 0.15);
    headGroup.add(eyeL);

    const eyeBallL = new THREE.Mesh(new THREE.SphereGeometry(0.06), eyeMat);
    eyeBallL.position.set(0.1, 0.35, 0.22);
    headGroup.add(eyeBallL);

    const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.02), pupilMat);
    pupilL.position.set(0.12, 0.35, 0.27);
    headGroup.add(pupilL);

    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), skinMat);
    eyeR.position.set(0.1, 0.35, -0.15);
    headGroup.add(eyeR);

    const eyeBallR = new THREE.Mesh(new THREE.SphereGeometry(0.06), eyeMat);
    eyeBallR.position.set(0.1, 0.35, -0.22);
    headGroup.add(eyeBallR);

    const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.02), pupilMat);
    pupilR.position.set(0.12, 0.35, -0.27);
    headGroup.add(pupilR);

    // Jaw (for animation)
    const jawPivot = new THREE.Group();
    headGroup.add(jawPivot);

    const lowerJaw = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.45), bellyMat);
    lowerJaw.position.set(0.45, -0.1, 0);
    jawPivot.add(lowerJaw);

    const t1 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1), toothMat);
    t1.position.set(0.8, 0, 0.2);
    jawPivot.add(t1);

    const t2 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1), toothMat);
    t2.position.set(0.8, 0, -0.2);
    jawPivot.add(t2);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.3, 0.2, 0.6);
    const legFL = new THREE.Mesh(legGeo, skinMat);
    legFL.position.set(0.6, 0.3, 0.5);
    legFL.rotation.x = 0.2;
    meshGroup.add(legFL);

    const legFR = new THREE.Mesh(legGeo, skinMat);
    legFR.position.set(0.6, 0.3, -0.5);
    legFR.rotation.x = -0.2;
    meshGroup.add(legFR);

    const legBL = new THREE.Mesh(legGeo, skinMat);
    legBL.position.set(-0.6, 0.3, 0.5);
    legBL.rotation.x = 0.2;
    meshGroup.add(legBL);

    const legBR = new THREE.Mesh(legGeo, skinMat);
    legBR.position.set(-0.6, 0.3, -0.5);
    legBR.rotation.x = -0.2;
    meshGroup.add(legBR);

    // Store animation parts
    animationParts.alligator.jaw = jawPivot;
    animationParts.alligator.tail1 = tail1;
    animationParts.alligator.tail2 = tail2;
    animationParts.alligator.meshGroup = meshGroup;

    alligator.userData.jaw = jawPivot;
    scene.add(alligator);
    characters.alligator = alligator;
    meshGroups.alligator = meshGroup;
}

/**
 * Create Border Agent character
 */
function createAgent(scene) {
    const agent = new THREE.Group();
    const meshGroup = new THREE.Group();
    agent.add(meshGroup);

    const uniformMat = new THREE.MeshStandardMaterial({ color: 0x1a1a40, roughness: 0.7 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffdbac, roughness: 0.5 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.5), uniformMat);
    torso.position.y = 1.8;
    meshGroup.add(torso);

    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.05), goldMat);
    badge.position.set(0.2, 2.0, 0.26);
    meshGroup.add(badge);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.6), skinMat);
    head.position.y = 2.75;
    meshGroup.add(head);

    const hatDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        uniformMat
    );
    hatDome.position.y = 3.05;
    meshGroup.add(hatDome);

    const hatBrim = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), uniformMat);
    hatBrim.position.set(0, 3.05, 0.35);
    hatBrim.rotation.x = 0.1;
    meshGroup.add(hatBrim);

    // Sunglasses
    const glassL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.05, 8), blackMat);
    glassL.rotation.x = Math.PI / 2;
    glassL.position.set(0.15, 2.8, 0.3);
    meshGroup.add(glassL);

    const glassR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.05, 8), blackMat);
    glassR.rotation.x = Math.PI / 2;
    glassR.position.set(-0.15, 2.8, 0.3);
    meshGroup.add(glassR);

    const glassBridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.02), blackMat);
    glassBridge.position.set(0, 2.85, 0.3);
    meshGroup.add(glassBridge);

    // Arms
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9), uniformMat);
    armL.position.set(0.6, 2.1, 0);
    meshGroup.add(armL);
    agent.userData.armL = armL;

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9), uniformMat);
    armR.position.set(-0.6, 2.1, 0);
    meshGroup.add(armR);
    agent.userData.armR = armR;

    // Legs
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.3), uniformMat);
    legL.position.set(0.25, 0.65, 0);
    meshGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 1.3), uniformMat);
    legR.position.set(-0.25, 0.65, 0);
    meshGroup.add(legR);

    // Drone
    const droneGroup = new THREE.Group();
    droneGroup.visible = false;
    droneGroup.position.set(0, 2.5, 0);
    agent.add(droneGroup);
    agent.userData.drone = droneGroup;

    const droneBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.1, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    droneGroup.add(droneBody);

    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.05), rotorMat);
    r1.position.y = 0.05;
    droneGroup.add(r1);

    const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.05), rotorMat);
    r2.rotation.y = Math.PI / 2;
    r2.position.y = 0.05;
    droneGroup.add(r2);

    agent.userData.droneRotors = [r1, r2];

    // Store animation parts
    animationParts.agent.armL = armL;
    animationParts.agent.armR = armR;
    animationParts.agent.glassL = glassL;
    animationParts.agent.glassR = glassR;
    animationParts.agent.meshGroup = meshGroup;

    scene.add(agent);
    characters.agent = agent;
    meshGroups.agent = meshGroup;
}

/**
 * Create Cashier character
 */
function createCashier(scene) {
    const cashier = new THREE.Group();
    const meshGroup = new THREE.Group();
    cashier.add(meshGroup);

    const vestMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.5), vestMat);
    body.position.y = 1.7;
    meshGroup.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.6), skinMat);
    head.position.y = 2.6;
    meshGroup.add(head);

    const hat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.7), hatMat);
    hat.position.y = 3.0;
    meshGroup.add(hat);

    // Add arms for finger tapping animation
    const armMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), armMat);
    armL.position.set(0.5, 1.7, 0);
    meshGroup.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8), armMat);
    armR.position.set(-0.5, 1.7, 0);
    meshGroup.add(armR);

    // Store animation parts
    animationParts.cashier.head = head;
    animationParts.cashier.armL = armL;
    animationParts.cashier.armR = armR;
    animationParts.cashier.meshGroup = meshGroup;

    scene.add(cashier);
    characters.cashier = cashier;
    meshGroups.cashier = meshGroup;
}

/**
 * Create Security guards
 */
function createSecurity(scene) {
    function createGuardMesh() {
        const g = new THREE.Group();
        const matShirt = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const matPants = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const matSkin = new THREE.MeshStandardMaterial({ color: 0xE0AC69 });

        const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.6), matShirt);
        body.position.y = 1.8;
        g.add(body);

        const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), matSkin);
        head.position.y = 2.8;
        g.add(head);

        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 0.35), matPants);
        legL.position.set(-0.25, 0.6, 0);
        g.add(legL);

        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.2, 0.35), matPants);
        legR.position.set(0.25, 0.6, 0);
        g.add(legR);

        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.35), matShirt);
        armL.position.set(0.7, 1.8, 0);
        g.add(armL);

        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.35), matShirt);
        armR.position.set(-0.7, 1.8, 0);
        g.add(armR);

        const glasses = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.15, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x000000 })
        );
        glasses.position.set(0, 2.9, 0.35);
        g.add(glasses);

        return g;
    }

    characters.securityL = createGuardMesh();
    characters.securityR = createGuardMesh();
    scene.add(characters.securityL);
    scene.add(characters.securityR);
    characters.securityL.visible = false;
    characters.securityR.visible = false;
}

/**
 * Create player equipment (phone, thought bubble)
 */
function createPlayerEquipment(scene) {
    // Phone
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    chandlerPhone = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 0.05), phoneMat);
    chandlerPhone.visible = false;
    scene.add(chandlerPhone);

    // Mama thought bubble
    const bubbleMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.9
    });
    mamaThoughtBubble = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), bubbleMat);
    mamaThoughtBubble.visible = false;
    scene.add(mamaThoughtBubble);
}

/**
 * Animate Mama - gentle swaying with hands clasped
 */
function animateMama(dt) {
    const parts = animationParts.mama;
    if (!parts.meshGroup) return;

    const time = animationTime;

    // Gentle sway side-to-side
    parts.meshGroup.rotation.y = Math.sin(time * 0.8) * 0.1;

    // Gentle breathing motion (up and down)
    parts.meshGroup.position.y = Math.sin(time * 1.2) * 0.05;

    // Slight head tilt
    if (parts.head) {
        parts.head.rotation.z = Math.sin(time * 0.5) * 0.05;
    }
}

/**
 * Animate Coyote - tail wagging, ear twitching, pacing
 */
function animateCoyote(dt) {
    const parts = animationParts.coyote;
    if (!parts.meshGroup) return;

    const time = animationTime;

    // Tail wagging (faster, more energetic)
    if (parts.tail) {
        parts.tail.rotation.y = Math.sin(time * 4) * 0.3;
        parts.tail.rotation.x = Math.sin(time * 4) * 0.2;
    }

    // Ear twitching (occasional, random-ish)
    if (parts.earL) {
        const earTwitch = Math.sin(time * 6) > 0.9 ? Math.sin(time * 20) * 0.3 : 0;
        parts.earL.rotation.x = 0.2 + earTwitch;
    }

    if (parts.earR) {
        const earTwitch = Math.sin(time * 5.5) > 0.9 ? Math.sin(time * 18) * 0.3 : 0;
        parts.earR.rotation.x = -0.2 + earTwitch;
    }

    // Pacing side-to-side
    parts.meshGroup.position.x = Math.sin(time * 0.5) * 0.3;

    // Slight bobbing while pacing
    parts.meshGroup.position.y = Math.abs(Math.sin(time * 1.0)) * 0.1;
}

/**
 * Animate Alligator - tail swish, body bob in water
 */
function animateAlligator(dt) {
    const parts = animationParts.alligator;
    if (!parts.meshGroup) return;

    const time = animationTime;

    // Tail swishing (slow, powerful)
    if (parts.tail1) {
        parts.tail1.rotation.y = Math.sin(time * 0.8) * 0.15;
    }

    if (parts.tail2) {
        parts.tail2.rotation.y = Math.sin(time * 0.8 + 0.5) * 0.2;
    }

    // Body bobbing in water (gentle up/down)
    parts.meshGroup.position.y = Math.sin(time * 0.6) * 0.08;

    // Slight rotation like floating
    parts.meshGroup.rotation.z = Math.sin(time * 0.4) * 0.02;

    // Keep jaw snap animation if action is active (handled in main.js)
    // Just add subtle idle jaw movement
    if (parts.jaw) {
        const baseJaw = Math.sin(time * 0.3) * 0.05;
        // Only apply if not being overridden by snap animation
        if (Math.abs(parts.jaw.rotation.z) < 0.1) {
            parts.jaw.rotation.z = baseJaw;
        }
    }
}

/**
 * Animate Agent - stiff stance with occasional arm cross, sunglasses glint
 */
function animateAgent(dt) {
    const parts = animationParts.agent;
    if (!parts.meshGroup) return;

    const time = animationTime;

    // Very stiff, minimal movement
    // Occasional weight shift
    parts.meshGroup.position.x = Math.sin(time * 0.2) * 0.02;

    // Breathing (very subtle)
    parts.meshGroup.position.y = Math.sin(time * 1.5) * 0.02;

    // Arms cross animation (occasional, every ~4 seconds)
    if (parts.armL && parts.armR) {
        const crossCycle = Math.sin(time * 0.25);
        if (crossCycle > 0.7) {
            // Arms moving to crossed position
            const crossAmount = (crossCycle - 0.7) / 0.3;
            parts.armL.rotation.z = crossAmount * 0.5;
            parts.armR.rotation.z = -crossAmount * 0.5;
        } else {
            // Return to neutral
            parts.armL.rotation.z = 0;
            parts.armR.rotation.z = 0;
        }
    }

    // Sunglasses glint effect (subtle scale pulse)
    if (parts.glassL && parts.glassR) {
        const glint = Math.sin(time * 3) > 0.95 ? 1.1 : 1.0;
        parts.glassL.scale.set(glint, glint, 1);
        parts.glassR.scale.set(glint, glint, 1);
    }
}

/**
 * Animate Cashier - tapping fingers, looking around
 */
function animateCashier(dt) {
    const parts = animationParts.cashier;
    if (!parts.meshGroup) return;

    const time = animationTime;

    // Looking around (head rotation)
    if (parts.head) {
        parts.head.rotation.y = Math.sin(time * 0.4) * 0.3;
        parts.head.rotation.x = Math.sin(time * 0.6) * 0.1;
    }

    // Finger tapping (arm bounce)
    if (parts.armL) {
        parts.armL.position.y = 1.7 + Math.abs(Math.sin(time * 5)) * 0.05;
    }

    if (parts.armR) {
        parts.armR.position.y = 1.7 + Math.abs(Math.sin(time * 5 + 0.3)) * 0.05;
    }

    // Slight boredom sway
    parts.meshGroup.rotation.y = Math.sin(time * 0.3) * 0.08;
}

/**
 * Update NPC animations - internal function called with character name
 */
function updateNPCAnimations(npcName, deltaTime) {
    if (!npcName) return;

    animationTime += deltaTime;

    switch(npcName) {
        case 'mama':
            animateMama(deltaTime);
            break;
        case 'coyote':
            animateCoyote(deltaTime);
            break;
        case 'alligator':
            animateAlligator(deltaTime);
            break;
        case 'agent':
            animateAgent(deltaTime);
            break;
        case 'cashier':
            animateCashier(deltaTime);
            break;
    }
}

/**
 * Animate NPC - exported function for main.js to call during cutscenes
 * @param {string} npcName - Name of the NPC to animate (mama, coyote, alligator, agent, cashier)
 * @param {number} deltaTime - Time delta in seconds
 */
export function animateNPC(npcName, deltaTime) {
    updateNPCAnimations(npcName, deltaTime);
}

/**
 * Get a character by name
 */
export function getCharacter(name) {
    return characters[name] || null;
}

/**
 * Get a mesh group by name
 */
export function getMeshGroup(name) {
    return meshGroups[name] || null;
}

/**
 * Show a character
 */
export function show(name) {
    if (characters[name]) {
        characters[name].visible = true;
    }
}

/**
 * Hide a character
 */
export function hide(name) {
    if (characters[name]) {
        characters[name].visible = false;
    }
}

/**
 * Hide all characters
 */
export function hideAll() {
    for (const name in characters) {
        if (characters[name]) {
            characters[name].visible = false;
        }
    }
    if (chandlerPhone) chandlerPhone.visible = false;
    if (mamaThoughtBubble) mamaThoughtBubble.visible = false;
}

/**
 * Position a character
 */
export function setPosition(name, x, y, z) {
    if (characters[name]) {
        characters[name].position.set(x, y, z);
    }
}

/**
 * Rotate a character
 */
export function setRotation(name, y) {
    if (characters[name]) {
        characters[name].rotation.y = y;
    }
}

/**
 * Get phone mesh
 */
export function getPhone() {
    return chandlerPhone;
}

/**
 * Get thought bubble mesh
 */
export function getThoughtBubble() {
    return mamaThoughtBubble;
}

export default {
    init,
    getCharacter,
    getMeshGroup,
    show,
    hide,
    hideAll,
    setPosition,
    setRotation,
    getPhone,
    getThoughtBubble,
    animateNPC
};
