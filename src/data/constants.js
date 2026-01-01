/**
 * Game constants and configuration
 */

// Movement
export const LANE_WIDTH = 4;
export const LANE_POSITIONS = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left, Center, Right
export const PLAYER_MOVE_SPEED = 15; // Lane change interpolation speed

// Physics
export const GRAVITY = -35;
export const JUMP_VELOCITY = 14;
export const MAX_JUMPS = 2; // Double jump

// Sliding
export const SLIDE_DURATION = 0.5; // seconds
export const SLIDE_HEIGHT_SCALE = 0.5; // Player height when sliding

// Combat
export const INITIAL_LIVES = 3;
export const MAX_LIVES = 5;
export const DAMAGE_COOLDOWN = 2.0; // seconds
export const INVINCIBILITY_DURATION = 5.0; // seconds (from chili powerup)

// Collision
export const PLAYER_WIDTH = 1.5;
export const PLAYER_HEIGHT = 3.5;
export const PLAYER_HEIGHT_SLIDING = 1.5;
export const NEAR_MISS_THRESHOLD = 2.0; // Distance for near-miss combo

// Spawning
export const OBSTACLE_SPAWN_Z = -60;
export const OBSTACLE_DESPAWN_Z = 15;
export const GROUND_CHUNK_SIZE = 20;
export const GROUND_CHUNK_COUNT = 15;

// Scoring
export const COMBO_NEAR_MISS_POINTS = 10;
export const WATER_BONUS_POINTS = 1000;

// Collectible effects
export const COLLECTIBLE_TYPES = {
    WATER: 'water',
    CHILI: 'chili',
    COIN: 'coin'
};

// Costco ending
export const GLIZZY_PRICE = 150; // In cents ($1.50)
export const COIN_VALUE = 25; // Each coin is 25 cents

// Camera
export const CAMERA_OFFSET = { x: 0, y: 6, z: 12 };
export const CAMERA_LOOK_AT = { x: 0, y: 2, z: 0 };

// Screen shake
export const SHAKE_INTENSITY = {
    LIGHT: 0.1,
    MEDIUM: 0.3,
    HEAVY: 0.5
};
export const SHAKE_DURATION = {
    SHORT: 0.15,
    MEDIUM: 0.3,
    LONG: 0.5
};

// Difficulty settings
export const DIFFICULTY_SETTINGS = {
    easy: {
        label: 'Easy',
        speedMultiplier: 0.75,       // 75% speed
        obstacleGapMultiplier: 1.5,  // 50% more space between obstacles
        livesBonus: 2,               // +2 starting lives
        xpMultiplier: 0.5            // Half XP earned
    },
    normal: {
        label: 'Normal',
        speedMultiplier: 1.0,
        obstacleGapMultiplier: 1.0,
        livesBonus: 0,
        xpMultiplier: 1.0
    },
    hard: {
        label: 'Hard',
        speedMultiplier: 1.25,       // 25% faster
        obstacleGapMultiplier: 0.75, // 25% less space
        livesBonus: -1,              // -1 starting life (2 total)
        xpMultiplier: 1.5            // 50% more XP
    },
    insane: {
        label: 'Insane',
        speedMultiplier: 1.5,        // 50% faster
        obstacleGapMultiplier: 0.5,  // Half the space
        livesBonus: -2,              // Only 1 life!
        xpMultiplier: 3.0            // Triple XP
    }
};
