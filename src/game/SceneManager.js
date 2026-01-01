/**
 * SceneManager - Three.js scene, camera, renderer, and lighting management
 */

import * as THREE from 'three';
import { CAMERA_OFFSET, CAMERA_LOOK_AT } from '../data/constants.js';

// Three.js core objects
let scene = null;
let camera = null;
let renderer = null;

// Lighting
let hemisphereLight = null;
let directionalLight = null;
let sun = null;
let cityLights = null;

// Screen shake
let shakeIntensity = 0;
let shakeDuration = 0;
let shakeOffset = { x: 0, y: 0 };

// Materials (shared across the game)
export const Materials = {
    ROAD_YELLOW: null,
    ROAD_SIDEWALK: null,
    HOUSE_WALL_1: null,
    HOUSE_WALL_2: null,
    HOUSE_ROOF: null,
    HOUSE_DOOR: null,
    TREE_TRUNK: null,
    TREE_LEAVES: null
};

/**
 * Initialize the Three.js scene
 */
export function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.02);

    // Create camera
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    camera.position.set(CAMERA_OFFSET.x, CAMERA_OFFSET.y, CAMERA_OFFSET.z);
    camera.lookAt(CAMERA_LOOK_AT.x, CAMERA_LOOK_AT.y, CAMERA_LOOK_AT.z);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Setup lighting
    setupLighting();

    // Create shared materials
    createMaterials();

    // Create city lights particle system
    createCityLights();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Remove loading screen
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.remove();

    // Expose globals for debugging/screenshots
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;

    return { scene, camera, renderer };
}

/**
 * Setup scene lighting
 */
function setupLighting() {
    // Hemisphere light (sky/ground ambient)
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    hemisphereLight.position.set(0, 200, 0);
    scene.add(hemisphereLight);

    // Directional light (sun)
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);

    // Sun visual
    const sunGeo = new THREE.SphereGeometry(5, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.copy(directionalLight.position);
    scene.add(sun);
}

/**
 * Create shared materials
 */
function createMaterials() {
    Materials.ROAD_YELLOW = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    Materials.ROAD_SIDEWALK = new THREE.MeshLambertMaterial({ color: 0x999999 });
    Materials.HOUSE_WALL_1 = new THREE.MeshStandardMaterial({ color: 0xffffcc });
    Materials.HOUSE_WALL_2 = new THREE.MeshStandardMaterial({ color: 0xffcccc });
    Materials.HOUSE_ROOF = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    Materials.HOUSE_DOOR = new THREE.MeshStandardMaterial({ color: 0x444444 });
    Materials.TREE_TRUNK = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    Materials.TREE_LEAVES = new THREE.MeshStandardMaterial({ color: 0x006400 });
}

/**
 * Create city lights particle system (for night levels)
 */
function createCityLights() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < 500; i++) {
        positions.push(
            (Math.random() - 0.5) * 200,
            Math.random() * 50 + 5,
            (Math.random() - 0.5) * 200 - 50
        );

        // Random warm colors
        const color = new THREE.Color();
        color.setHSL(0.1 + Math.random() * 0.1, 1, 0.5 + Math.random() * 0.5);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    cityLights = new THREE.Points(geometry, material);
    cityLights.visible = false;
    scene.add(cityLights);
}

/**
 * Handle window resize
 */
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

/**
 * Set scene colors (background and fog)
 */
export function setSceneColors(backgroundColor, fogColor) {
    scene.background.setHex(backgroundColor);
    scene.fog.color.setHex(fogColor);
}

/**
 * Show/hide city lights
 */
export function setCityLightsVisible(visible) {
    if (cityLights) {
        cityLights.visible = visible;
    }
}

/**
 * Trigger screen shake
 * @param {number} intensity - Shake intensity (0-1)
 * @param {number} duration - Shake duration in seconds
 */
export function shake(intensity, duration) {
    shakeIntensity = intensity;
    shakeDuration = duration;
}

/**
 * Update screen shake (call each frame)
 */
export function updateShake(dt) {
    if (shakeDuration > 0) {
        shakeDuration -= dt;
        const decay = shakeDuration > 0 ? 1 : 0;
        shakeOffset.x = (Math.random() - 0.5) * shakeIntensity * 10 * decay;
        shakeOffset.y = (Math.random() - 0.5) * shakeIntensity * 5 * decay;
    } else {
        shakeOffset.x = 0;
        shakeOffset.y = 0;
    }
    return shakeOffset;
}

/**
 * Set camera position with optional shake offset (Y only for shake, X stays fixed)
 */
export function setCameraPosition(x, y, z) {
    camera.position.set(
        x,  // No X shake - keeps camera centered
        y + shakeOffset.y,
        z
    );
}

/**
 * Set camera look-at target
 */
export function setCameraLookAt(x, y, z) {
    camera.lookAt(x, y, z);
}

/**
 * Clear all objects from scene (except lights and camera)
 */
export function clearScene() {
    const objectsToRemove = [];

    scene.traverse((object) => {
        if (object.isMesh || object.isGroup || object.isPoints) {
            if (object !== sun && object !== cityLights) {
                objectsToRemove.push(object);
            }
        }
    });

    objectsToRemove.forEach((obj) => {
        if (obj.parent) {
            obj.parent.remove(obj);
        }
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose());
            } else {
                obj.material.dispose();
            }
        }
    });
}

/**
 * Render the scene
 */
export function render() {
    renderer.render(scene, camera);
}

/**
 * Get Three.js objects
 */
export function getScene() { return scene; }
export function getCamera() { return camera; }
export function getRenderer() { return renderer; }

// Export default object
export default {
    init,
    render,
    getScene,
    getCamera,
    getRenderer,
    setSceneColors,
    setCityLightsVisible,
    shake,
    updateShake,
    setCameraPosition,
    setCameraLookAt,
    clearScene,
    Materials
};
