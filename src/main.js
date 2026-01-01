/**
 * Chandler's Freedom Glizzy Run
 * Main entry point
 */

import * as THREE from 'three';

// Game Systems
import State from './game/StateManager.js';
import SceneManager from './game/SceneManager.js';
import PlayerSystem from './game/PlayerSystem.js';
import CharacterSystem from './game/CharacterSystem.js';
import EffectsSystem from './game/EffectsSystem.js';
import AudioSystem from './game/AudioSystem.js';
import SaveSystem from './game/SaveSystem.js';
import InputSystem from './game/InputSystem.js';

// UI
import HUD from './ui/HUD.js';
import Screens from './ui/Screens.js';
import Popups from './ui/Popups.js';

// New Enhancement Systems
import CutsceneEnvironment from './game/CutsceneEnvironment.js';
import SoundManager from './audio/SoundManager.js';

// Expose CutsceneEnvironment for debugging/screenshots
window.CutsceneEnvironment = CutsceneEnvironment;

// Data
import { LEVELS, getLevel, getLevelCount } from './data/levels.js';
import { DIALOGUE_ENDING, DIALOGUE_ENDING_HAPPY } from './data/dialogue.js';
import {
    LANE_WIDTH,
    OBSTACLE_SPAWN_Z,
    OBSTACLE_DESPAWN_Z,
    GROUND_CHUNK_SIZE,
    GROUND_CHUNK_COUNT,
    WATER_BONUS_POINTS,
    COMBO_NEAR_MISS_POINTS,
    NEAR_MISS_THRESHOLD,
    MAX_LIVES,
    INITIAL_LIVES,
    GLIZZY_PRICE,
    COIN_VALUE,
    DIFFICULTY_SETTINGS
} from './data/constants.js';

// Collections
let obstacles = [];
let collectibles = [];
let decorations = [];
let groundChunks = [];

// Animation
let animationId = null;
let lastTime = 0;

// Spawn tracking (distance-based)
let lastObstacleSpawnDist = 0;
let lastCollectibleSpawnDist = 0;

// Current difficulty setting
let currentDifficulty = 'normal';

// Track current NPC for animation
let currentNPC = null;

/**
 * Initialize the game
 */
async function init() {
    console.log("Initializing Chandler's Freedom Glizzy Run...");

    // Initialize systems
    SceneManager.init();
    SaveSystem.init();
    await AudioSystem.init();
    await SoundManager.init();

    // Initialize UI
    HUD.init();
    Screens.init({
        onStartGame: startGame,
        onRestart: () => location.reload(),
        onResume: resumeGame,
        onQuit: () => location.reload()
    });

    // Initialize characters
    CharacterSystem.init();
    PlayerSystem.init();

    // Initialize input
    InputSystem.init({
        onMoveLeft: () => PlayerSystem.changeLane(-1),
        onMoveRight: () => PlayerSystem.changeLane(1),
        onJump: () => PlayerSystem.jump(),
        onSlide: () => PlayerSystem.slide(),
        onPause: togglePause,
        onInteract: handleInteraction,
        onAdvanceDialogue: advanceDialogue
    });

    // Create initial ground
    createGround();

    // Setup dev menu
    setupDevMenu();

    // Setup difficulty selector
    setupDifficultySelector();

    // Show start screen
    Screens.showStart();

    console.log("Game initialized!");
}

/**
 * Setup difficulty selector buttons
 */
function setupDifficultySelector() {
    const buttons = document.querySelectorAll('.diff-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected from all
            buttons.forEach(b => b.classList.remove('selected'));
            // Add selected to clicked
            btn.classList.add('selected');
            // Store difficulty
            currentDifficulty = btn.dataset.difficulty;
            console.log(`Difficulty set to: ${currentDifficulty}`);
        });
    });
}

/**
 * Start a new game
 */
function startGame() {
    console.log("Starting game...");

    // Reset state
    State.reset();
    SaveSystem.recordGamePlayed();

    // Apply difficulty settings
    const diffSettings = DIFFICULTY_SETTINGS[currentDifficulty];
    const startingLives = Math.max(1, INITIAL_LIVES + diffSettings.livesBonus);
    State.set('lives', startingLives);
    State.set('difficultyMultipliers', diffSettings);

    // Reset spawn trackers
    lastObstacleSpawnDist = 0;
    lastCollectibleSpawnDist = 0;

    // Clear scene
    clearGameObjects();
    createGround();

    // Reset player
    PlayerSystem.reset();

    // Hide all NPCs
    CharacterSystem.hideAll();

    // Setup level
    const level = getLevel(0);
    applyLevelSettings(level);

    // Show HUD
    HUD.show();
    HUD.updateAll();

    // Start cutscene
    startCutscene(level.cutscene, level.npc);
}

/**
 * Apply level visual settings
 */
function applyLevelSettings(level) {
    // Apply difficulty speed multiplier
    const diffSettings = State.get('difficultyMultipliers') || DIFFICULTY_SETTINGS.normal;
    const adjustedSpeed = level.speed * diffSettings.speedMultiplier;
    State.set('currentSpeed', adjustedSpeed);
    SceneManager.setSceneColors(level.color, level.fog);
    SceneManager.setCityLightsVisible(level.id >= 4);
    HUD.updateLevelDisplay();
}

/**
 * Start a cutscene
 */
function startCutscene(dialogueQueue, npcType) {
    State.set('isCutscene', true);
    State.set('isExitingCutscene', false);
    State.set('currentDialogueQueue', dialogueQueue);
    State.set('currentDialogueIndex', 0);

    // Hide HUD during cutscene
    HUD.hide();

    // === FULL CLEANUP before starting new cutscene ===
    // Hide all existing NPCs
    CharacterSystem.hideAll();

    // Clear any existing dialogue bubbles
    const bubbleContainer = document.getElementById('bubble-container');
    if (bubbleContainer) bubbleContainer.innerHTML = '';

    // Remove any existing cutscene environment
    CutsceneEnvironment.removeCutsceneEnvironment(SceneManager.getScene());

    // Position player and NPC
    PlayerSystem.setPosition(-1.5, 0, 5);
    PlayerSystem.setRotation(0, Math.PI / 2, 0);

    // Show NPC and set current NPC for animations
    if (npcType) {
        const npcName = npcType === 'mom' ? 'mama' : npcType;
        currentNPC = npcName;
        CharacterSystem.show(npcName);
        CharacterSystem.setPosition(npcName, 2, 0, 4);

        // Set rotation based on NPC type
        if (npcType === 'alligator') {
            CharacterSystem.setRotation(npcName, -Math.PI / 1.2);
        } else if (npcType === 'coyote') {
            CharacterSystem.setRotation(npcName, -Math.PI / 1.5);
        } else if (npcType === 'agent') {
            CharacterSystem.setRotation(npcName, -Math.PI / 2);
        } else {
            CharacterSystem.setRotation(npcName, -Math.PI / 3);
        }
    } else {
        currentNPC = null;
    }

    // Set camera for cutscene
    const camera = SceneManager.getCamera();
    const aspect = window.innerWidth / window.innerHeight;
    const dist = aspect < 1 ? 16 : 11;
    const height = aspect < 1 ? 4 : 3;
    camera.position.set(0, height, dist);
    camera.lookAt(0, 1.5, 4);

    // Create cutscene environment background
    const levelIdx = State.get('currentLevelIdx');
    CutsceneEnvironment.createCutsceneEnvironment(levelIdx, SceneManager.getScene());

    // Play cutscene audio
    const cutsceneKeys = ['intro', 'level2', 'level3', 'level4', 'level5'];
    const audioKey = cutsceneKeys[levelIdx] || 'intro';
    SoundManager.playCutsceneAudio(audioKey);

    // Show cutscene UI
    document.getElementById('cutscene-ui').classList.remove('hidden');

    // Start dialogue
    showNextDialogueLine();

    // Start animation loop
    State.set('isPlaying', true);
    if (!animationId) {
        lastTime = performance.now();
        animate();
    }
}

/**
 * Show next dialogue line
 */
function showNextDialogueLine() {
    const dialogueQueue = State.get('currentDialogueQueue');
    const dialogueIndex = State.get('currentDialogueIndex');

    const container = document.getElementById('bubble-container');
    container.innerHTML = '';

    if (dialogueIndex >= dialogueQueue.length) {
        // During Costco ending, don't have player run away - security handles exit
        if (State.get('isCostcoEnding')) {
            // If security drag-out is in progress, just hide the UI
            document.getElementById('cutscene-ui').classList.add('hidden');
            return;
        }
        startExitRun();
        return;
    }

    const line = dialogueQueue[dialogueIndex];
    State.set('autoAdvanceTimer', line.delay);

    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.innerText = line.text;
    bubble.style.display = 'block';
    container.appendChild(bubble);

    // Play sound effects for this dialogue line
    if (line.sound) {
        SoundManager.playEffect(line.sound);
    }
    if (line.action) {
        SoundManager.playActionSound(line.action);
    }

    State.set('activeBubble', { speaker: line.speaker, action: line.action });
}

/**
 * Advance dialogue
 */
function advanceDialogue() {
    if (!State.get('isCutscene') || State.get('isExitingCutscene')) return;

    State.increment('currentDialogueIndex');
    showNextDialogueLine();
}

/**
 * Start exit run from cutscene
 */
function startExitRun() {
    State.set('isExitingCutscene', true);
    document.getElementById('cutscene-ui').classList.add('hidden');
    PlayerSystem.setRotation(0, Math.PI, 0);
}

/**
 * End cutscene and start gameplay
 */
function endCutscene() {
    State.set('isCutscene', false);
    State.set('isExitingCutscene', false);

    // Clear dialogue
    document.getElementById('bubble-container').innerHTML = '';
    document.getElementById('cutscene-ui').classList.add('hidden');

    // Remove cutscene environment
    CutsceneEnvironment.removeCutsceneEnvironment(SceneManager.getScene());

    // Stop cutscene audio
    SoundManager.stopAll(500);

    // Reset player position
    PlayerSystem.reset();

    // Hide NPCs
    CharacterSystem.hideAll();
    currentNPC = null;

    // Reset camera
    SceneManager.setCameraPosition(0, 6, 12);
    SceneManager.setCameraLookAt(0, 2, 0);

    // Show HUD
    HUD.show();
    HUD.updateAll();
}

/**
 * Create ground chunks
 */
function createGround() {
    const scene = SceneManager.getScene();

    for (let i = 0; i < GROUND_CHUNK_COUNT; i++) {
        spawnGroundChunk(-i * GROUND_CHUNK_SIZE);
    }
}

/**
 * Spawn a ground chunk
 */
function spawnGroundChunk(zPosition) {
    const scene = SceneManager.getScene();
    const levelIdx = State.get('currentLevelIdx');
    const level = getLevel(levelIdx);

    const geometry = new THREE.PlaneGeometry(40, GROUND_CHUNK_SIZE);
    const material = new THREE.MeshStandardMaterial({
        color: level ? level.groundColor : 0x888888,
        roughness: 1
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.z = zPosition;
    mesh.receiveShadow = true;

    scene.add(mesh);
    groundChunks.push(mesh);

    // Add road markings for suburbia
    if (levelIdx === 4) {
        const { Materials } = SceneManager;
        const lineGeo = new THREE.PlaneGeometry(0.2, GROUND_CHUNK_SIZE);

        const line1 = new THREE.Mesh(lineGeo, Materials.ROAD_YELLOW);
        line1.position.set(-0.2, 0, 0.05);
        mesh.add(line1);

        const line2 = new THREE.Mesh(lineGeo, Materials.ROAD_YELLOW);
        line2.position.set(0.2, 0, 0.05);
        mesh.add(line2);
    }

    // Spawn decorations
    if (Math.random() > 0.3) {
        spawnDecoration(zPosition, levelIdx);
    }
}

/**
 * Spawn decoration based on level
 */
function spawnDecoration(zPos, levelIdx) {
    const scene = SceneManager.getScene();
    const { Materials } = SceneManager;

    if (levelIdx < 2) {
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

        scene.add(cactus);
        decorations.push(cactus);
    } else if (levelIdx === 4) {
        // Houses for suburbia
        const houseGroup = new THREE.Group();

        const walls = new THREE.Mesh(
            new THREE.BoxGeometry(6, 4, 6),
            Math.random() > 0.5 ? Materials.HOUSE_WALL_1 : Materials.HOUSE_WALL_2
        );
        walls.position.y = 2.1;
        houseGroup.add(walls);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(5, 2, 4), Materials.HOUSE_ROOF);
        roof.position.y = 5;
        roof.rotation.y = Math.PI / 4;
        houseGroup.add(roof);

        const door = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.2), Materials.HOUSE_DOOR);
        door.position.set(0, 1, 3);
        houseGroup.add(door);

        const side = Math.random() > 0.5 ? 1 : -1;
        houseGroup.position.set(side * (18 + Math.random() * 2), 0, zPos);
        houseGroup.rotation.y = side === 1 ? -Math.PI / 2 : Math.PI / 2;

        scene.add(houseGroup);
        decorations.push(houseGroup);
    }
}

/**
 * Spawn obstacle
 */
function spawnObstacle() {
    const scene = SceneManager.getScene();
    const levelIdx = State.get('currentLevelIdx');
    const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1

    const obstacleGroup = new THREE.Group();
    const xPos = lane * LANE_WIDTH;

    // Materials for Trump wall style - grey steel and concrete for all levels
    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.9 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.2, metalness: 0.8 });

    // Use steel/concrete for all levels (Trump wall look)
    let wallMat = steelMat;
    let baseMat = concreteMat;

    // Suburbia gets white picket fence style instead
    if (levelIdx === 4) {
        wallMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5 });
        baseMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.7 });
    }

    const type = Math.random();

    if (type > 0.65) {
        // JUMP OVER: Low wall segment (jumpable, ~2 units high)
        const height = 1.8 + Math.random() * 0.4; // 1.8-2.2 height
        const width = 3;

        // Concrete base
        const base = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, 0.5), baseMat);
        base.position.y = 0.2;
        obstacleGroup.add(base);

        // Steel slats (vertical bars)
        const slatCount = 5;
        for (let i = 0; i < slatCount; i++) {
            const slat = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, height - 0.4, 0.08),
                wallMat
            );
            slat.position.set(-width/2 + 0.3 + i * (width - 0.6) / (slatCount - 1), height / 2 + 0.2, 0);
            obstacleGroup.add(slat);
        }

        // Top rail
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(width, 0.15, 0.15), wallMat);
        topRail.position.y = height + 0.1;
        obstacleGroup.add(topRail);

        obstacleGroup.userData.colliderBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(xPos, height / 2, OBSTACLE_SPAWN_Z),
            new THREE.Vector3(width - 0.5, height, 0.5)
        );
        obstacleGroup.userData.type = 'jump';

    } else if (type > 0.35) {
        // SLIDE UNDER: Elevated barrier (must duck)
        const barrierHeight = 1.2;
        const elevationHeight = 1.8; // Bottom of barrier is at 1.8, player slides under
        const width = 3.5;

        // Support posts on sides
        const postL = new THREE.Mesh(new THREE.BoxGeometry(0.3, elevationHeight + barrierHeight, 0.3), wallMat);
        postL.position.set(-width/2 + 0.15, (elevationHeight + barrierHeight) / 2, 0);
        obstacleGroup.add(postL);

        const postR = new THREE.Mesh(new THREE.BoxGeometry(0.3, elevationHeight + barrierHeight, 0.3), wallMat);
        postR.position.set(width/2 - 0.15, (elevationHeight + barrierHeight) / 2, 0);
        obstacleGroup.add(postR);

        // Elevated horizontal barrier (the part you slide under)
        const barrier = new THREE.Mesh(new THREE.BoxGeometry(width, barrierHeight, 0.4), wallMat);
        barrier.position.y = elevationHeight + barrierHeight / 2;
        obstacleGroup.add(barrier);

        // Warning stripes
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xFFCC00 });
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(width - 0.6, 0.15, 0.05), stripeMat);
        stripe.position.set(0, elevationHeight + 0.3, 0.21);
        obstacleGroup.add(stripe);

        // Collider is the elevated part only
        obstacleGroup.userData.colliderBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(xPos, elevationHeight + barrierHeight / 2, OBSTACLE_SPAWN_Z),
            new THREE.Vector3(width, barrierHeight, 0.5)
        );
        obstacleGroup.userData.type = 'slide';

    } else {
        // JUMP OVER: Concrete barrier (jersey barrier style)
        const height = 1.5;
        const width = 2.5;

        // Trapezoidal barrier shape (wider at bottom)
        const shape = new THREE.Shape();
        shape.moveTo(-width/2, 0);
        shape.lineTo(width/2, 0);
        shape.lineTo(width/2 - 0.3, height);
        shape.lineTo(-width/2 + 0.3, height);
        shape.closePath();

        const extrudeSettings = { depth: 0.8, bevelEnabled: false };
        const barrierGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        barrierGeo.translate(0, 0, -0.4);

        const barrier = new THREE.Mesh(barrierGeo, baseMat);
        obstacleGroup.add(barrier);

        // Red/white stripes on top
        const stripeRed = new THREE.Mesh(
            new THREE.BoxGeometry(width - 0.4, 0.1, 0.6),
            new THREE.MeshBasicMaterial({ color: 0xFF4444 })
        );
        stripeRed.position.y = height + 0.05;
        obstacleGroup.add(stripeRed);

        obstacleGroup.userData.colliderBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(xPos, height / 2, OBSTACLE_SPAWN_Z),
            new THREE.Vector3(width, height, 0.8)
        );
        obstacleGroup.userData.type = 'jump';
    }

    obstacleGroup.position.set(xPos, 0, OBSTACLE_SPAWN_Z);
    obstacleGroup.traverse(c => { if (c.isMesh) c.castShadow = true; });

    scene.add(obstacleGroup);
    obstacles.push(obstacleGroup);
}

/**
 * Spawn collectible
 */
function spawnCollectible() {
    const scene = SceneManager.getScene();
    const lane = Math.floor(Math.random() * 3) - 1;
    const xPos = lane * LANE_WIDTH;

    const group = new THREE.Group();
    const type = Math.random() > 0.7 ? 'chili' : 'water';

    if (type === 'water') {
        const jugMat = new THREE.MeshStandardMaterial({
            color: 0x00BFFF,
            transparent: true,
            opacity: 0.8,
            roughness: 0.1
        });
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.5), jugMat);
        body.position.y = 1.0;
        group.add(body);
        group.userData.type = 'water';
    } else {
        const chiliMat = new THREE.MeshStandardMaterial({ color: 0xFF0000, emissive: 0x550000 });
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 8), chiliMat);
        body.rotation.x = Math.PI;
        body.rotation.z = -0.5;
        body.position.y = 1.0;
        group.add(body);

        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.3),
            new THREE.MeshBasicMaterial({ color: 0x00aa00 })
        );
        stem.position.set(0.1, 1.4, 0);
        stem.rotation.z = -0.5;
        group.add(stem);
        group.userData.type = 'chili';
    }

    group.position.set(xPos, 0, OBSTACLE_SPAWN_Z);
    group.userData.bobOffset = Math.random() * Math.PI;

    scene.add(group);
    collectibles.push(group);
}

/**
 * Clear game objects
 */
function clearGameObjects() {
    const scene = SceneManager.getScene();

    // Clear obstacles
    obstacles.forEach(o => {
        scene.remove(o);
        o.traverse(c => {
            if (c.geometry) c.geometry.dispose();
            if (c.material) c.material.dispose();
        });
    });
    obstacles = [];

    // Clear collectibles
    collectibles.forEach(c => {
        scene.remove(c);
        c.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    });
    collectibles = [];

    // Clear decorations
    decorations.forEach(d => {
        scene.remove(d);
        d.traverse(c => {
            if (c.geometry) c.geometry.dispose();
            if (c.material) c.material.dispose();
        });
    });
    decorations = [];

    // Clear ground
    groundChunks.forEach(g => {
        scene.remove(g);
        g.geometry.dispose();
        g.material.dispose();
    });
    groundChunks = [];

    // Clear particles
    EffectsSystem.clear();
}

/**
 * Toggle pause
 */
function togglePause() {
    if (State.get('isCutscene')) return;
    if (!State.get('isPlaying')) return;

    const isPaused = State.get('isPaused');

    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

/**
 * Pause game
 */
function pauseGame() {
    State.set('isPaused', true);
    Screens.showPause();
    AudioSystem.pauseMusic();
}

/**
 * Resume game
 */
function resumeGame() {
    State.set('isPaused', false);
    Screens.hidePause();
    AudioSystem.resumeMusic();
}

/**
 * Handle interaction (E key at Costco)
 */
function handleInteraction() {
    if (State.get('waitingForOrder')) {
        const coins = State.get('coins');
        const hasEnoughMoney = coins * COIN_VALUE >= GLIZZY_PRICE;

        // Start appropriate ending dialogue
        const dialogue = hasEnoughMoney ? DIALOGUE_ENDING_HAPPY : DIALOGUE_ENDING;
        startEndingDialogue(dialogue);
    }
}

/**
 * Start ending dialogue at Costco
 */
function startEndingDialogue(dialogue) {
    State.set('waitingForOrder', false);
    document.getElementById('interaction-prompt').style.display = 'none';

    State.set('isCutscene', true);
    State.set('currentDialogueQueue', dialogue);
    State.set('currentDialogueIndex', 0);

    // Create Costco environment (level 5 = ending)
    CutsceneEnvironment.createCutsceneEnvironment(5, SceneManager.getScene());

    // Play ending audio based on whether player has enough money
    const coins = State.get('coins');
    const hasEnoughMoney = coins * COIN_VALUE >= GLIZZY_PRICE;
    SoundManager.playCutsceneAudio(hasEnoughMoney ? 'ending_good' : 'ending_bad');

    // Show cashier
    currentNPC = 'cashier';
    CharacterSystem.show('cashier');
    CharacterSystem.setPosition('cashier', 0, 0, -5);
    CharacterSystem.setRotation('cashier', 0);

    document.getElementById('cutscene-ui').classList.remove('hidden');
    showNextDialogueLine();
}

/**
 * Handle game over
 */
function handleGameOver() {
    State.set('isPlaying', false);
    SaveSystem.recordDeath();
    SaveSystem.updateHighScore(State.get('score'));

    // Award XP based on distance traveled (1 XP per 10 meters), multiplied by difficulty
    const diffSettings = State.get('difficultyMultipliers') || DIFFICULTY_SETTINGS.normal;
    const baseXP = Math.floor(State.get('score') / 10);
    const xpEarned = Math.floor(baseXP * diffSettings.xpMultiplier);
    const leveledUp = SaveSystem.addXP(xpEarned);

    if (leveledUp) {
        Popups.showPopup(`LEVEL UP! LVL ${SaveSystem.getPlayerLevel()}`, '#FFD700');
    }

    Screens.showGameOver();
}

/**
 * Handle level complete
 */
function handleLevelComplete() {
    const currentLevelIdx = State.get('currentLevelIdx');
    const nextLevelIdx = currentLevelIdx + 1;

    Popups.showLevelComplete(getLevel(currentLevelIdx).name);
    SaveSystem.unlockLevel(nextLevelIdx + 1);

    // Award bonus XP for completing a stage (100 XP per stage number), multiplied by difficulty
    const diffSettings = State.get('difficultyMultipliers') || DIFFICULTY_SETTINGS.normal;
    const baseBonus = (currentLevelIdx + 1) * 100;
    const stageBonus = Math.floor(baseBonus * diffSettings.xpMultiplier);
    const leveledUp = SaveSystem.addXP(stageBonus);

    if (leveledUp) {
        setTimeout(() => {
            Popups.showPopup(`LEVEL UP! LVL ${SaveSystem.getPlayerLevel()}`, '#FFD700');
        }, 1000);
    }

    if (nextLevelIdx >= getLevelCount()) {
        // Start Costco ending
        startCostcoEnding();
    } else {
        // Next level
        State.set('currentLevelIdx', nextLevelIdx);
        State.set('score', 0);

        const level = getLevel(nextLevelIdx);
        applyLevelSettings(level);

        // Clear and rebuild
        clearGameObjects();
        createGround();

        // Start cutscene
        startCutscene(level.cutscene, level.npc);
    }
}

/**
 * Start Costco approach (Phase 1 - running towards building)
 */
function startCostcoApproach() {
    State.set('isCostcoEnding', true);
    State.set('isCostcoApproach', true);
    State.set('isCutscene', false);
    State.set('isPlaying', false);

    // Hide HUD and UI
    HUD.hide();
    document.getElementById('cutscene-ui').classList.add('hidden');

    // Clear existing NPCs and environments
    CharacterSystem.hideAll();
    CutsceneEnvironment.removeCutsceneEnvironment(SceneManager.getScene());
    clearGameObjects();

    // Create Costco exterior environment
    CutsceneEnvironment.createCutsceneEnvironment('costco-exterior', SceneManager.getScene());

    // Position player at start of parking lot, facing the building
    PlayerSystem.setPosition(0, 0, 10);
    PlayerSystem.setRotation(0, Math.PI, 0);

    // Set camera behind player
    const camera = SceneManager.getCamera();
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 5, -60);
}

/**
 * Update Costco approach animation
 */
function updateCostcoApproach(dt) {
    if (!State.get('isCostcoApproach')) return false;

    const player = PlayerSystem.getPlayer();
    const meshGroup = PlayerSystem.getMeshGroup();

    // Move player towards building
    player.position.z -= 12 * dt;

    // Camera follows
    const camera = SceneManager.getCamera();
    camera.position.z = player.position.z + 10;

    // Animate legs (running animation)
    const time = Date.now() * 0.02;
    if (player.userData.legL) {
        player.userData.legL.rotation.x = Math.sin(time) * 1.2;
    }
    if (player.userData.legR) {
        player.userData.legR.rotation.x = Math.sin(time + Math.PI) * 1.2;
    }

    // When player reaches the door, transition to interior
    if (player.position.z < -55) {
        State.set('isCostcoApproach', false);
        startCostcoInterior();
    }

    return true;
}

/**
 * Start Costco interior (Phase 2 - at the counter)
 */
function startCostcoInterior() {
    State.set('isCostcoEnding', true);
    State.set('isCutscene', true);

    // Clear exterior and create interior
    CutsceneEnvironment.removeCutsceneEnvironment(SceneManager.getScene());
    CutsceneEnvironment.createCutsceneEnvironment('costco', SceneManager.getScene());

    // Position player at counter (standing in front, facing the counter)
    PlayerSystem.setPosition(-2, 0, -6);
    PlayerSystem.setRotation(0, Math.PI, 0);

    // Show cashier (behind counter, slightly to the right)
    currentNPC = 'cashier';
    CharacterSystem.show('cashier');
    CharacterSystem.setPosition('cashier', 2, 0, -11);
    CharacterSystem.setRotation('cashier', 0);

    // Set camera for Costco scene - side angle showing both player and cashier
    const camera = SceneManager.getCamera();
    camera.position.set(8, 4, -4);
    camera.lookAt(-1, 1.5, -9);

    // Start the ending dialogue (bad ending - security drags him out)
    State.set('currentDialogueQueue', DIALOGUE_ENDING);
    State.set('currentDialogueIndex', 0);

    // Clear any existing dialogue bubbles
    const bubbleContainer = document.getElementById('bubble-container');
    if (bubbleContainer) bubbleContainer.innerHTML = '';

    document.getElementById('cutscene-ui').classList.remove('hidden');
    showNextDialogueLine();
}

/**
 * Start Costco ending sequence (called from dev menu)
 */
function startCostcoEnding() {
    startCostcoApproach();
}

/**
 * Update security drag-out sequence
 */
function updateDragOut(dt) {
    if (!State.get('isDraggingOut')) return false;

    const player = PlayerSystem.getPlayer();
    const securityL = CharacterSystem.getCharacter('securityL');
    const securityR = CharacterSystem.getCharacter('securityR');

    if (!securityL || !securityR) return false;

    if (!State.get('guardsGrabbed')) {
        // Guards approaching player
        const speed = 5 * dt;
        securityL.position.lerp(new THREE.Vector3(player.position.x - 0.8, 0, player.position.z), speed);
        securityR.position.lerp(new THREE.Vector3(player.position.x + 0.8, 0, player.position.z), speed);

        // Check if guards reached player
        if (securityL.position.distanceTo(player.position) < 1.5) {
            State.set('guardsGrabbed', true);
            // Lift and tilt player
            player.position.y = 0.5;
            player.rotation.z = 0.2;
        }
    } else {
        // Dragging player out
        const dragSpeed = 4 * dt;
        player.position.z += dragSpeed;
        securityL.position.z += dragSpeed;
        securityR.position.z += dragSpeed;

        // Flailing legs animation
        const time = Date.now() * 0.02;
        if (player.userData.legL) {
            player.userData.legL.rotation.x = Math.sin(time * 2);
        }
        if (player.userData.legR) {
            player.userData.legR.rotation.x = Math.cos(time * 2);
        }

        // Camera follows the drag
        const camera = SceneManager.getCamera();
        camera.position.z = player.position.z + 8;

        // When dragged far enough, show game over/banned screen
        if (player.position.z > 15) {
            State.set('isDraggingOut', false);
            showBannedScreen();
        }
    }

    return true;
}

/**
 * Show the "Banned from Costco" screen
 */
function showBannedScreen() {
    State.set('isCostcoEnding', false);
    State.set('isCutscene', false);
    State.set('isDraggingOut', false);

    // Hide dialogue
    document.getElementById('cutscene-ui').classList.add('hidden');
    document.getElementById('bubble-container').innerHTML = '';

    // Hide security guards
    const securityL = CharacterSystem.getCharacter('securityL');
    const securityR = CharacterSystem.getCharacter('securityR');
    if (securityL) securityL.visible = false;
    if (securityR) securityR.visible = false;

    // Show game over screen with banned message
    Screens.showGameOver('BANNED FROM COSTCO\n\n"No money, no Glizzy."');
}

/**
 * Setup dev menu
 */
function setupDevMenu() {
    const toggleBtn = document.getElementById('debug-toggle-btn');
    const menuBox = document.getElementById('debug-menu-box');

    if (toggleBtn && menuBox) {
        toggleBtn.addEventListener('click', () => {
            menuBox.classList.toggle('hidden');
        });

        // Level buttons
        menuBox.querySelectorAll('.dev-btn[data-level]').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.dataset.level;

                if (level === 'ending') {
                    startCostcoEnding();
                } else {
                    const levelIdx = parseInt(level);
                    State.set('currentLevelIdx', levelIdx);
                    State.set('score', 0);

                    const levelData = getLevel(levelIdx);
                    applyLevelSettings(levelData);

                    clearGameObjects();
                    createGround();

                    startCutscene(levelData.cutscene, levelData.npc);
                }

                menuBox.classList.add('hidden');
            });
        });
    }
}

/**
 * Main animation loop
 */
function animate() {
    animationId = requestAnimationFrame(animate);

    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1); // Cap at 100ms
    lastTime = now;

    // Update screen shake
    SceneManager.updateShake(dt);

    // Update Costco approach (runs before other states)
    if (State.get('isCostcoApproach')) {
        updateCostcoApproach(dt);
    }
    // Update security drag-out sequence
    else if (State.get('isDraggingOut')) {
        updateDragOut(dt);
    }
    // Update based on game state
    else if (State.get('isCutscene')) {
        updateCutscene(dt);
    } else if (State.get('isPlaying') && !State.get('isPaused')) {
        updateGameplay(dt);
    }

    // Update effects
    EffectsSystem.update(dt);

    // Render
    SceneManager.render();
}

/**
 * Update cutscene
 */
function updateCutscene(dt) {
    const player = PlayerSystem.getPlayer();

    if (State.get('isExitingCutscene')) {
        // Player runs away
        player.position.z -= 10 * dt;

        // Leg animation
        const time = Date.now() * 0.02;
        if (player.userData.legL) player.userData.legL.rotation.x = Math.sin(time) * 1.2;
        if (player.userData.legR) player.userData.legR.rotation.x = Math.sin(time + Math.PI) * 1.2;

        if (player.position.z < -10) {
            endCutscene();
        }
        return;
    }

    // Animate current NPC if one is active
    if (currentNPC) {
        CharacterSystem.animateNPC(currentNPC, dt);
    }

    // Update cutscene environment animations (water ripples, searchlights, etc.)
    CutsceneEnvironment.updateCutsceneEnvironment(dt);

    // Auto-advance dialogue
    let autoTimer = State.get('autoAdvanceTimer');
    if (autoTimer > 0) {
        autoTimer -= dt * 1000;
        State.set('autoAdvanceTimer', autoTimer);
        if (autoTimer <= 0) {
            advanceDialogue();
        }
    }

    // Update speech bubble position
    const activeBubble = State.get('activeBubble');
    const container = document.getElementById('bubble-container');
    const bubbleEl = container.firstChild;

    if (activeBubble && bubbleEl) {
        let targetObj;
        const currentLevelIdx = State.get('currentLevelIdx');

        switch (activeBubble.speaker) {
            case 'Chandler':
                targetObj = player;
                break;
            case 'Mama':
                targetObj = currentLevelIdx === 4 ? player : CharacterSystem.getCharacter('mama');
                break;
            case 'Coyote':
                targetObj = CharacterSystem.getCharacter('coyote');
                break;
            case 'Alligator':
                targetObj = CharacterSystem.getCharacter('alligator');
                break;
            case 'Agent':
                targetObj = CharacterSystem.getCharacter('agent');
                break;
            case 'Cashier':
                targetObj = CharacterSystem.getCharacter('cashier');
                break;
        }

        if (targetObj) {
            const headPos = targetObj.position.clone();
            headPos.y = 4.2;

            headPos.project(SceneManager.getCamera());
            const x = (headPos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(headPos.y * 0.5) + 0.5) * window.innerHeight;

            bubbleEl.style.left = `${x}px`;
            bubbleEl.style.top = `${y}px`;
        }

        // Handle special actions
        if (activeBubble.action === 'gator_snap') {
            const gator = CharacterSystem.getCharacter('alligator');
            if (gator && gator.userData.jaw) {
                const time = Date.now() * 0.02;
                gator.userData.jaw.rotation.z = Math.abs(Math.sin(time)) * 0.5;
            }
        }

        if (activeBubble.action === 'shock') {
            player.rotation.z = Math.sin(Date.now() * 0.1) * 0.2;
            player.scale.y = 0.9 + Math.sin(Date.now() * 0.05) * 0.1;
        }

        if (activeBubble.action === 'check_pockets') {
            if (player.userData.armR) {
                player.userData.armR.rotation.x = Math.sin(Date.now() * 0.02) * 0.5;
            }
        }

        if (activeBubble.action === 'call_security' && !State.get('isDraggingOut')) {
            // Start the drag-out sequence
            State.set('isDraggingOut', true);
            State.set('guardsGrabbed', false);

            // Clear dialogue UI after a brief moment (let "SECURITY!" show)
            setTimeout(() => {
                document.getElementById('bubble-container').innerHTML = '';
                document.getElementById('cutscene-ui').classList.add('hidden');
            }, 500);

            // Show and position security guards
            const securityL = CharacterSystem.getCharacter('securityL');
            const securityR = CharacterSystem.getCharacter('securityR');

            if (securityL && securityR) {
                securityL.position.set(player.position.x - 6, 0, player.position.z + 3);
                securityR.position.set(player.position.x + 6, 0, player.position.z + 3);
                securityL.visible = true;
                securityR.visible = true;
                securityL.lookAt(player.position);
                securityR.lookAt(player.position);
            }
        }
    }

    // Idle bobbing
    const time = Date.now() * 0.005;
    const meshGroup = PlayerSystem.getMeshGroup();
    if (meshGroup) {
        meshGroup.position.y = Math.sin(time) * 0.1;
    }
}

/**
 * Update gameplay
 */
function updateGameplay(dt) {
    const scene = SceneManager.getScene();
    const currentSpeed = State.get('currentSpeed');
    const moveDist = currentSpeed * dt;

    // Update score (distance)
    State.increment('score', moveDist);
    HUD.updateScoreDisplay();

    // Update progress
    const level = getLevel(State.get('currentLevelIdx'));
    if (level) {
        const progress = (State.get('score') / level.length) * 100;
        HUD.updateProgress(progress);

        // Check level completion
        if (State.get('score') >= level.length) {
            handleLevelComplete();
            return;
        }
    }

    // Update player
    PlayerSystem.update(dt);

    // Distance-based obstacle spawning using level difficulty settings
    const currentDist = State.get('score');
    const diffSettings = State.get('difficultyMultipliers') || DIFFICULTY_SETTINGS.normal;
    const gapMultiplier = diffSettings.obstacleGapMultiplier;

    const minGap = (level ? level.minObstacleGap : 30) * gapMultiplier;
    const maxGap = (level ? level.maxObstacleGap : 50) * gapMultiplier;
    const obstacleGap = minGap + Math.random() * (maxGap - minGap);

    if (currentDist - lastObstacleSpawnDist > obstacleGap) {
        spawnObstacle();
        lastObstacleSpawnDist = currentDist;
    }

    // Distance-based collectible spawning using level settings
    const collectibleGap = level ? level.collectibleGap : 80;

    if (currentDist - lastCollectibleSpawnDist > collectibleGap) {
        spawnCollectible();
        lastCollectibleSpawnDist = currentDist;
    }

    // Update obstacles
    const playerBox = PlayerSystem.getCollisionBox();
    const isInvincible = State.get('isInvincible');

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.position.z += moveDist;

        // Update collider position
        if (obs.userData.colliderBox) {
            obs.userData.colliderBox.translate(new THREE.Vector3(0, 0, moveDist));
        }

        // Collision check
        if (playerBox && obs.userData.colliderBox && playerBox.intersectsBox(obs.userData.colliderBox)) {
            if (isInvincible) {
                // Smash through!
                EffectsSystem.spawnSmashEffect(obs.position.x, 2, obs.position.z);
                scene.remove(obs);
                obstacles.splice(i, 1);
                continue;
            } else {
                const alive = PlayerSystem.takeDamage();
                if (!alive) {
                    handleGameOver();
                    return;
                }
            }
        }

        // Despawn
        if (obs.position.z > OBSTACLE_DESPAWN_Z) {
            scene.remove(obs);
            obstacles.splice(i, 1);
        }
    }

    // Update collectibles
    const player = PlayerSystem.getPlayer();
    for (let i = collectibles.length - 1; i >= 0; i--) {
        const col = collectibles[i];
        col.position.z += moveDist;

        // Bobbing animation
        col.children.forEach(child => {
            child.position.y = 1.0 + Math.sin(Date.now() * 0.005 + col.userData.bobOffset) * 0.3;
        });
        col.rotation.y += dt * 2;

        // Collection check
        const dist = col.position.distanceTo(player.position);
        if (dist < 1.5) {
            if (col.userData.type === 'water') {
                // Add life (capped)
                if (State.get('lives') < MAX_LIVES) {
                    State.increment('lives');
                    Popups.showLifeGained();
                } else {
                    State.increment('score', WATER_BONUS_POINTS);
                    Popups.showBonus('WATER', WATER_BONUS_POINTS);
                }
            } else if (col.userData.type === 'chili') {
                PlayerSystem.setInvincible();
            }

            SaveSystem.recordCollectible();
            scene.remove(col);
            collectibles.splice(i, 1);
            continue;
        }

        // Despawn
        if (col.position.z > OBSTACLE_DESPAWN_Z) {
            scene.remove(col);
            collectibles.splice(i, 1);
        }
    }

    // Update ground chunks
    for (let i = groundChunks.length - 1; i >= 0; i--) {
        groundChunks[i].position.z += moveDist;

        if (groundChunks[i].position.z > GROUND_CHUNK_SIZE) {
            const chunk = groundChunks[i];
            scene.remove(chunk);
            chunk.geometry.dispose();
            chunk.material.dispose();
            groundChunks.splice(i, 1);

            // Spawn new chunk at back
            const lastZ = groundChunks.length > 0
                ? Math.min(...groundChunks.map(c => c.position.z))
                : 0;
            spawnGroundChunk(lastZ - GROUND_CHUNK_SIZE);
        }
    }

    // Update decorations
    for (let i = decorations.length - 1; i >= 0; i--) {
        decorations[i].position.z += moveDist;

        if (decorations[i].position.z > 20) {
            scene.remove(decorations[i]);
            decorations.splice(i, 1);
        }
    }

    // Update camera position - fixed, no side movement
    SceneManager.setCameraPosition(0, 6, 12);
    SceneManager.setCameraLookAt(0, 2, 0);
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// Export for debugging
window.gameState = State;
