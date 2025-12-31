import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';

// ============================================
// Telegram Web App Integration
// ============================================
const TelegramManager = {
    isInTelegram: false,
    user: null,

    init() {
        // Check if running inside Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            this.isInTelegram = true;
            const tg = window.Telegram.WebApp;

            // Tell Telegram the app is ready
            tg.ready();

            // Expand to full screen
            tg.expand();

            // Get user info if available
            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                this.user = tg.initDataUnsafe.user;
                console.log('Telegram user:', this.user.first_name);
            }

            // Set header color to match game
            tg.setHeaderColor('#0a0a1a');
            tg.setBackgroundColor('#0a0a1a');

            // Handle back button
            tg.BackButton.onClick(() => {
                // Could return to menu or close app
                tg.close();
            });

            console.log('Running inside Telegram Mini App');
        } else {
            console.log('Running in browser');
        }
    },

    // Show back button (call when in game)
    showBackButton() {
        if (this.isInTelegram) {
            window.Telegram.WebApp.BackButton.show();
        }
    },

    // Hide back button (call in menu)
    hideBackButton() {
        if (this.isInTelegram) {
            window.Telegram.WebApp.BackButton.hide();
        }
    },

    // Close the mini app
    close() {
        if (this.isInTelegram) {
            window.Telegram.WebApp.close();
        }
    },

    // Get username for leaderboard
    getUsername() {
        if (this.user) {
            return this.user.first_name || this.user.username || 'Player';
        }
        return 'Player';
    }
};

// Initialize Telegram
TelegramManager.init();

// Make it globally accessible
window.TelegramManager = TelegramManager;

// ============================================
// Mobile Touch Controls
// ============================================
const MobileControls = {
    left: false,
    right: false,
    jump: false,

    init() {
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');

        if (!btnLeft || !btnRight || !btnJump) return;

        // Left button
        btnLeft.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.left = true;
        });
        btnLeft.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.left = false;
        });

        // Right button
        btnRight.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.right = true;
        });
        btnRight.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.right = false;
        });

        // Jump button
        btnJump.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.jump = true;
        });
        btnJump.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.jump = false;
        });

        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        console.log('Mobile controls initialized');
    }
};

// Initialize mobile controls after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobileControls.init());
} else {
    MobileControls.init();
}

// Make it globally accessible
window.MobileControls = MobileControls;

// ============================================
// Phaser Game Configuration
// ============================================
const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GAME_CONFIG.GRAVITY },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        activePointers: 3 // Support multi-touch
    },
    scene: [
        BootScene,
        PreloadScene,
        MenuScene,
        GameScene,
        UIScene,
        PauseScene,
        GameOverScene,
        VictoryScene
    ]
};

const game = new Phaser.Game(config);

export default game;
