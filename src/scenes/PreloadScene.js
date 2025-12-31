import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'LOADING...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Progress bar background
        const progressBarBg = this.add.rectangle(width / 2, height / 2, 400, 30, 0x222222);

        // Progress bar fill
        const progressBar = this.add.rectangle(width / 2 - 198, height / 2, 0, 26, GAME_CONFIG.COLORS.SATOSHI_GOLD);
        progressBar.setOrigin(0, 0.5);

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.width = 396 * value;
        });

        // Generate placeholder graphics as textures
        this.createPlaceholderAssets();
    }

    createPlaceholderAssets() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // ============================================
        // APU (Player) - Cute frog like Pepe/Apu
        // ============================================
        graphics.clear();
        // Body (rounded frog shape)
        graphics.fillStyle(0x4CAF50); // Main green
        graphics.fillCircle(16, 20, 14); // Body
        graphics.fillCircle(16, 12, 10); // Head
        // Lighter belly
        graphics.fillStyle(0x81C784);
        graphics.fillCircle(16, 22, 8);
        // Big white eyes (Apu style)
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(10, 10, 6);
        graphics.fillCircle(22, 10, 6);
        // Pupils
        graphics.fillStyle(0x000000);
        graphics.fillCircle(11, 10, 3);
        graphics.fillCircle(23, 10, 3);
        // Eye shine
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(9, 8, 1);
        graphics.fillCircle(21, 8, 1);
        // Mouth (slight smile)
        graphics.lineStyle(2, 0x2E7D32);
        graphics.beginPath();
        graphics.arc(16, 16, 5, 0.2, Math.PI - 0.2);
        graphics.strokePath();
        // Feet
        graphics.fillStyle(0x388E3C);
        graphics.fillCircle(10, 30, 4);
        graphics.fillCircle(22, 30, 4);
        graphics.generateTexture('apu', 32, 32);

        // APU jumping (stretched pose)
        graphics.clear();
        graphics.fillStyle(0x4CAF50);
        graphics.fillCircle(16, 14, 12); // Body compressed
        graphics.fillCircle(16, 8, 9); // Head
        graphics.fillStyle(0x81C784);
        graphics.fillCircle(16, 16, 7);
        // Eyes looking up
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(10, 6, 5);
        graphics.fillCircle(22, 6, 5);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(10, 5, 2);
        graphics.fillCircle(22, 5, 2);
        // Arms up
        graphics.fillStyle(0x4CAF50);
        graphics.fillCircle(6, 12, 4);
        graphics.fillCircle(26, 12, 4);
        // Legs stretched
        graphics.fillStyle(0x388E3C);
        graphics.fillCircle(10, 28, 4);
        graphics.fillCircle(22, 28, 4);
        graphics.generateTexture('apu_jump', 32, 32);

        // ============================================
        // Bear (Enemy) - Angry red bear
        // ============================================
        graphics.clear();
        // Body
        graphics.fillStyle(0xB71C1C); // Dark red
        graphics.fillCircle(16, 20, 12); // Body
        graphics.fillCircle(16, 10, 10); // Head
        // Ears
        graphics.fillStyle(0xD32F2F);
        graphics.fillCircle(6, 4, 5);
        graphics.fillCircle(26, 4, 5);
        // Inner ears
        graphics.fillStyle(0xFFCDD2);
        graphics.fillCircle(6, 4, 2);
        graphics.fillCircle(26, 4, 2);
        // Snout
        graphics.fillStyle(0xE57373);
        graphics.fillCircle(16, 14, 5);
        // Nose
        graphics.fillStyle(0x000000);
        graphics.fillCircle(16, 12, 2);
        // Angry eyes
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(10, 8, 4);
        graphics.fillCircle(22, 8, 4);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(11, 8, 2);
        graphics.fillCircle(23, 8, 2);
        // Angry eyebrows
        graphics.lineStyle(2, 0x000000);
        graphics.beginPath();
        graphics.moveTo(6, 4);
        graphics.lineTo(13, 6);
        graphics.strokePath();
        graphics.beginPath();
        graphics.moveTo(26, 4);
        graphics.lineTo(19, 6);
        graphics.strokePath();
        // Legs
        graphics.fillStyle(0xB71C1C);
        graphics.fillCircle(10, 30, 4);
        graphics.fillCircle(22, 30, 4);
        graphics.generateTexture('bear', 32, 32);

        // ============================================
        // Mega Bear (Boss) - Giant angry bear
        // ============================================
        graphics.clear();
        // Body
        graphics.fillStyle(0x8B0000);
        graphics.fillCircle(48, 60, 38); // Big body
        graphics.fillCircle(48, 30, 28); // Head
        // Ears
        graphics.fillStyle(0xB71C1C);
        graphics.fillCircle(20, 10, 12);
        graphics.fillCircle(76, 10, 12);
        graphics.fillStyle(0xFFCDD2);
        graphics.fillCircle(20, 10, 5);
        graphics.fillCircle(76, 10, 5);
        // Snout
        graphics.fillStyle(0xE57373);
        graphics.fillCircle(48, 38, 12);
        // Nose
        graphics.fillStyle(0x000000);
        graphics.fillCircle(48, 34, 5);
        // Glowing angry eyes
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(34, 24, 10);
        graphics.fillCircle(62, 24, 10);
        graphics.fillStyle(0xFFFF00);
        graphics.fillCircle(34, 24, 5);
        graphics.fillCircle(62, 24, 5);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(34, 24, 2);
        graphics.fillCircle(62, 24, 2);
        // Angry eyebrows
        graphics.lineStyle(4, 0x000000);
        graphics.beginPath();
        graphics.moveTo(20, 12);
        graphics.lineTo(40, 18);
        graphics.strokePath();
        graphics.beginPath();
        graphics.moveTo(76, 12);
        graphics.lineTo(56, 18);
        graphics.strokePath();
        // Scary mouth
        graphics.fillStyle(0x000000);
        graphics.fillRect(38, 44, 20, 6);
        // Teeth
        graphics.fillStyle(0xFFFFFF);
        graphics.fillTriangle(40, 44, 44, 50, 48, 44);
        graphics.fillTriangle(48, 44, 52, 50, 56, 44);
        // Claws/Feet
        graphics.fillStyle(0x8B0000);
        graphics.fillCircle(25, 88, 10);
        graphics.fillCircle(71, 88, 10);
        graphics.generateTexture('megabear', 96, 96);

        // ============================================
        // Bull (Power-up) - Strong green bull
        // ============================================
        graphics.clear();
        // Body (oval made of circles)
        graphics.fillStyle(0x2E7D32); // Green
        graphics.fillCircle(24, 18, 14); // Main body
        graphics.fillCircle(34, 18, 10); // Back
        graphics.fillCircle(12, 16, 10); // Head
        // Horns
        graphics.fillStyle(0xFFD700); // Golden horns
        graphics.fillTriangle(6, 8, 2, 0, 10, 6);
        graphics.fillTriangle(18, 8, 14, 0, 22, 6);
        // Eyes
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(10, 14, 3);
        graphics.fillCircle(16, 14, 3);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(10, 14, 1);
        graphics.fillCircle(16, 14, 1);
        // Nose ring (arc)
        graphics.lineStyle(2, 0xFFD700);
        graphics.beginPath();
        graphics.arc(13, 22, 3, 0.5, Math.PI - 0.5);
        graphics.strokePath();
        // Nostrils
        graphics.fillStyle(0x1B5E20);
        graphics.fillCircle(11, 20, 1);
        graphics.fillCircle(15, 20, 1);
        // Legs
        graphics.fillStyle(0x2E7D32);
        graphics.fillRect(14, 26, 4, 6);
        graphics.fillRect(24, 26, 4, 6);
        graphics.fillRect(34, 26, 4, 6);
        // Hooves
        graphics.fillStyle(0x5D4037);
        graphics.fillRect(13, 30, 6, 2);
        graphics.fillRect(23, 30, 6, 2);
        graphics.fillRect(33, 30, 6, 2);
        // Tail
        graphics.lineStyle(3, 0x2E7D32);
        graphics.beginPath();
        graphics.moveTo(44, 16);
        graphics.lineTo(48, 12);
        graphics.strokePath();
        graphics.generateTexture('bull', 48, 32);

        // ============================================
        // Satoshi (BTC coin) - Golden Bitcoin
        // ============================================
        graphics.clear();
        // Outer ring
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(8, 8, 8);
        // Inner circle
        graphics.fillStyle(0xFFA000);
        graphics.fillCircle(8, 8, 6);
        // Bitcoin B symbol (simplified)
        graphics.fillStyle(0xFFD700);
        graphics.fillRect(6, 3, 2, 10); // Vertical line
        graphics.fillRect(6, 4, 4, 2);  // Top bar
        graphics.fillRect(6, 7, 4, 2);  // Middle bar
        graphics.fillRect(6, 10, 4, 2); // Bottom bar
        // Shine
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(5, 5, 2);
        graphics.generateTexture('satoshi', 16, 16);

        // ============================================
        // Shitcoin - Gray dubious coin
        // ============================================
        graphics.clear();
        // Outer ring
        graphics.fillStyle(0x757575);
        graphics.fillCircle(8, 8, 8);
        // Inner circle
        graphics.fillStyle(0x616161);
        graphics.fillCircle(8, 8, 6);
        // Question mark (simplified)
        graphics.fillStyle(0x9E9E9E);
        graphics.fillRect(7, 4, 3, 2);
        graphics.fillRect(8, 5, 2, 3);
        graphics.fillRect(7, 7, 2, 2);
        graphics.fillRect(7, 10, 2, 2);
        graphics.generateTexture('shitcoin', 16, 16);

        // ============================================
        // Moon Token (Rainbow legendary coin)
        // ============================================
        graphics.clear();
        // Rainbow rings
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(10, 10, 10);
        graphics.fillStyle(0xFF7F00);
        graphics.fillCircle(10, 10, 8);
        graphics.fillStyle(0xFFFF00);
        graphics.fillCircle(10, 10, 6);
        graphics.fillStyle(0x00FF00);
        graphics.fillCircle(10, 10, 4);
        graphics.fillStyle(0x00FFFF);
        graphics.fillCircle(10, 10, 2);
        // Center
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(10, 10, 1);
        // Sparkles (small circles)
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(3, 3, 1);
        graphics.fillCircle(17, 4, 1);
        graphics.fillCircle(4, 16, 1);
        graphics.fillCircle(16, 16, 1);
        graphics.generateTexture('moontoken', 20, 20);

        // ============================================
        // Platform tile
        // ============================================
        graphics.clear();
        graphics.fillStyle(GAME_CONFIG.COLORS.PLATFORM_METAL);
        graphics.fillRect(0, 0, 32, 32);
        // Highlight
        graphics.fillStyle(0x78909C);
        graphics.fillRect(2, 2, 28, 4);
        // Shadow
        graphics.fillStyle(0x455A64);
        graphics.fillRect(0, 28, 32, 4);
        // Rivets
        graphics.fillStyle(0x37474F);
        graphics.fillCircle(4, 16, 2);
        graphics.fillCircle(28, 16, 2);
        graphics.generateTexture('platform', 32, 32);

        // ============================================
        // Ground platform
        // ============================================
        graphics.clear();
        graphics.fillStyle(GAME_CONFIG.COLORS.PLATFORM_BROWN);
        graphics.fillRect(0, 0, 32, 32);
        // Top grass
        graphics.fillStyle(0x4CAF50);
        graphics.fillRect(0, 0, 32, 6);
        // Dirt texture
        graphics.fillStyle(0x3E2723);
        graphics.fillRect(4, 12, 4, 4);
        graphics.fillRect(16, 20, 6, 4);
        graphics.fillRect(24, 10, 4, 3);
        graphics.generateTexture('ground', 32, 32);

        // ============================================
        // Star background
        // ============================================
        graphics.clear();
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(2, 2, 2);
        graphics.generateTexture('star', 4, 4);

        // ============================================
        // Rocket decoration
        // ============================================
        graphics.clear();
        // Body
        graphics.fillStyle(0xE0E0E0);
        graphics.fillRect(10, 10, 12, 40);
        // Nose cone
        graphics.fillStyle(0xF44336);
        graphics.fillTriangle(16, 0, 10, 15, 22, 15);
        // Fins
        graphics.fillRect(4, 38, 8, 12);
        graphics.fillRect(20, 38, 8, 12);
        // Window
        graphics.fillStyle(0x2196F3);
        graphics.fillCircle(16, 25, 4);
        graphics.fillStyle(0x64B5F6);
        graphics.fillCircle(15, 24, 2);
        // Flames
        graphics.fillStyle(0xFFA000);
        graphics.fillTriangle(10, 50, 16, 62, 16, 50);
        graphics.fillTriangle(22, 50, 16, 62, 16, 50);
        graphics.fillStyle(0xFFEB3B);
        graphics.fillTriangle(12, 50, 16, 58, 20, 50);
        graphics.generateTexture('rocket', 32, 64);

        // ============================================
        // Heart (life icon)
        // ============================================
        graphics.clear();
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(6, 6, 6);
        graphics.fillCircle(18, 6, 6);
        graphics.fillTriangle(0, 8, 24, 8, 12, 22);
        // Shine
        graphics.fillStyle(0xFF6666);
        graphics.fillCircle(5, 4, 2);
        graphics.generateTexture('heart', 24, 24);

        // ============================================
        // Button
        // ============================================
        graphics.clear();
        graphics.fillStyle(0x4CAF50);
        graphics.fillRoundedRect(0, 0, 200, 50, 10);
        graphics.fillStyle(0x388E3C);
        graphics.fillRoundedRect(0, 45, 200, 5, { bl: 10, br: 10 });
        graphics.generateTexture('button', 200, 50);

        // Button hover
        graphics.clear();
        graphics.fillStyle(0x66BB6A);
        graphics.fillRoundedRect(0, 0, 200, 50, 10);
        graphics.fillStyle(0x4CAF50);
        graphics.fillRoundedRect(0, 45, 200, 5, { bl: 10, br: 10 });
        graphics.generateTexture('button_hover', 200, 50);

        graphics.destroy();
    }

    create() {
        this.scene.start('MenuScene');
    }
}
