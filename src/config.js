// Game configuration constants
export const GAME_CONFIG = {
    // Display
    WIDTH: 800,
    HEIGHT: 600,

    // Physics
    GRAVITY: 800,

    // Player settings
    PLAYER: {
        SPEED: 250,
        JUMP_FORCE: -450,
        BOUNCE: 0.1
    },

    // Enemy settings
    ENEMY: {
        SPEED: 80,
        POINTS: 50
    },

    // Collectibles
    SATOSHI: {
        POINTS: 100
    },
    SHITCOIN: {
        POINTS: 10
    },
    MOON_TOKEN: {
        POINTS: 500
    },

    // Power-ups
    BULL: {
        DURATION: 10000, // 10 seconds
        SPEED_MULTIPLIER: 2
    },

    // Boss
    BOSS: {
        HEALTH: 5,
        POINTS: 1000
    },

    // Lives
    STARTING_LIVES: 3,
    SATOSHIS_FOR_EXTRA_LIFE: 100,

    // Colors (for placeholder graphics)
    COLORS: {
        APU_GREEN: 0x4CAF50,
        BEAR_RED: 0xD32F2F,
        BULL_GREEN: 0x2E7D32,
        SATOSHI_GOLD: 0xFFD700,
        SHITCOIN_GRAY: 0x9E9E9E,
        PLATFORM_BROWN: 0x5D4037,
        PLATFORM_METAL: 0x607D8B,
        SPACE_BG: 0x0a0a2e
    }
};
