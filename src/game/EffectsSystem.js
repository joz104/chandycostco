/**
 * EffectsSystem - Particle effects, dust, and visual feedback
 */

import * as THREE from 'three';
import SceneManager from './SceneManager.js';

// Active particles
const particles = [];

/**
 * Spawn dust particles (for jumping/landing)
 */
export function spawnDust(x, y, z) {
    const scene = SceneManager.getScene();

    for (let i = 0; i < 5; i++) {
        const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xDEB887,
            transparent: true,
            opacity: 0.6
        });
        const particle = new THREE.Mesh(geo, mat);

        particle.position.set(
            x + (Math.random() - 0.5),
            y,
            z + (Math.random() - 0.5)
        );

        scene.add(particle);
        particles.push({
            mesh: particle,
            vy: Math.random() * 0.1,
            vx: (Math.random() - 0.5) * 0.1,
            vz: (Math.random() - 0.5) * 0.1,
            life: 1.0
        });
    }
}

/**
 * Spawn smash effect (for invincible obstacle destruction)
 */
export function spawnSmashEffect(x, y, z) {
    const scene = SceneManager.getScene();

    for (let i = 0; i < 10; i++) {
        const geo = new THREE.BoxGeometry(0.4, 0.1, 0.4);
        const mat = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
        const particle = new THREE.Mesh(geo, mat);

        particle.position.set(
            x + (Math.random() - 0.5),
            y + Math.random(),
            z
        );

        scene.add(particle);
        particles.push({
            mesh: particle,
            vy: Math.random() * 0.2 + 0.1,
            vx: (Math.random() - 0.5) * 0.3,
            vz: 0.5 + Math.random(),
            life: 1.0
        });
    }
}

/**
 * Spawn water splash particles
 */
export function spawnWaterSplash(x, y, z) {
    const scene = SceneManager.getScene();

    for (let i = 0; i < 8; i++) {
        const geo = new THREE.SphereGeometry(0.15, 8, 8);
        const mat = new THREE.MeshBasicMaterial({
            color: 0x4682B4,
            transparent: true,
            opacity: 0.7
        });
        const particle = new THREE.Mesh(geo, mat);

        particle.position.set(
            x + (Math.random() - 0.5) * 0.5,
            y,
            z + (Math.random() - 0.5) * 0.5
        );

        scene.add(particle);
        particles.push({
            mesh: particle,
            vy: Math.random() * 0.15 + 0.1,
            vx: (Math.random() - 0.5) * 0.15,
            vz: (Math.random() - 0.5) * 0.15,
            life: 0.8
        });
    }
}

/**
 * Spawn invincibility sparkles
 */
export function spawnSparkle(x, y, z) {
    const scene = SceneManager.getScene();

    const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const colors = [0xFF0000, 0xFF6600, 0xFFFF00];
    const mat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 1
    });
    const particle = new THREE.Mesh(geo, mat);

    particle.position.set(
        x + (Math.random() - 0.5) * 2,
        y + Math.random() * 3,
        z + (Math.random() - 0.5)
    );

    scene.add(particle);
    particles.push({
        mesh: particle,
        vy: Math.random() * 0.05,
        vx: (Math.random() - 0.5) * 0.05,
        vz: 0.1,
        life: 0.5
    });
}

/**
 * Update all particles
 */
export function update(dt) {
    const scene = SceneManager.getScene();

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update position
        p.mesh.position.x += p.vx;
        p.mesh.position.y += p.vy;
        p.mesh.position.z += p.vz;

        // Apply gravity to dust/smash particles
        p.vy -= 0.01;

        // Decay life
        p.life -= dt * 2;

        // Update opacity
        if (p.mesh.material.transparent) {
            p.mesh.material.opacity = Math.max(0, p.life);
        }

        // Remove dead particles
        if (p.life <= 0) {
            scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
            particles.splice(i, 1);
        }
    }
}

/**
 * Clear all particles
 */
export function clear() {
    const scene = SceneManager.getScene();

    for (const p of particles) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
    }
    particles.length = 0;
}

/**
 * Get particle count (for debugging)
 */
export function getCount() {
    return particles.length;
}

export default {
    spawnDust,
    spawnSmashEffect,
    spawnWaterSplash,
    spawnSparkle,
    update,
    clear,
    getCount
};
