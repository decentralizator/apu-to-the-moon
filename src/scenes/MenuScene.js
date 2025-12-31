import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.cameras.main.setBackgroundColor(GAME_CONFIG.COLORS.SPACE_BG);

        // Add stars
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const star = this.add.image(x, y, 'star');
            star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            star.setScale(Phaser.Math.FloatBetween(0.5, 1.5));

            // Twinkle animation
            this.tweens.add({
                targets: star,
                alpha: { from: star.alpha, to: 0.2 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1
            });
        }

        // Title
        const titleText = this.add.text(width / 2, 120, 'APU TO THE MOON', {
            fontFamily: 'Arial Black, Arial',
            fontSize: '48px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Title animation
        this.tweens.add({
            targets: titleText,
            y: 130,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        this.add.text(width / 2, 180, '"Apu believes. Do you?"', {
            fontFamily: 'Arial',
            fontSize: '18px',
            fill: '#AAAAAA',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Apu character
        const apu = this.add.image(width / 2, height / 2 - 20, 'apu');
        apu.setScale(4);

        // Apu bounce animation
        this.tweens.add({
            targets: apu,
            y: apu.y - 20,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Floating satoshis around Apu
        const satoshiPositions = [
            { x: width / 2 - 100, y: height / 2 - 50 },
            { x: width / 2 + 100, y: height / 2 - 30 },
            { x: width / 2 - 80, y: height / 2 + 40 },
            { x: width / 2 + 80, y: height / 2 + 60 }
        ];

        satoshiPositions.forEach((pos, index) => {
            const satoshi = this.add.image(pos.x, pos.y, 'satoshi');
            satoshi.setScale(2);

            this.tweens.add({
                targets: satoshi,
                y: pos.y - 10,
                angle: 360,
                duration: 2000 + index * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Start button
        const startButton = this.add.image(width / 2, height - 150, 'button');
        const startText = this.add.text(width / 2, height - 150, 'START GAME', {
            fontFamily: 'Arial Black, Arial',
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        startButton.setInteractive({ useHandCursor: true });

        startButton.on('pointerover', () => {
            startButton.setTexture('button_hover');
            startButton.setScale(1.05);
            startText.setScale(1.05);
        });

        startButton.on('pointerout', () => {
            startButton.setTexture('button');
            startButton.setScale(1);
            startText.setScale(1);
        });

        startButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });

        // Instructions
        this.add.text(width / 2, height - 80, 'Controls: Arrow Keys / WASD to move, SPACE to jump', {
            fontFamily: 'Arial',
            fontSize: '14px',
            fill: '#888888'
        }).setOrigin(0.5);

        this.add.text(width / 2, height - 60, 'Collect Satoshis, avoid Bears, ride Bulls!', {
            fontFamily: 'Arial',
            fontSize: '14px',
            fill: '#888888'
        }).setOrigin(0.5);

        // Keyboard start
        this.input.keyboard.once('keydown-SPACE', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });

        this.input.keyboard.once('keydown-ENTER', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });

        // Fade in
        this.cameras.main.fadeIn(500);
    }
}
