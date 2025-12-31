import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.cameras.main.setBackgroundColor(0x1a0000);

        // Add falling bears animation
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(50, width - 50);
            const bear = this.add.image(x, -50, 'bear');
            bear.setScale(Phaser.Math.FloatBetween(0.5, 1.5));
            bear.setAlpha(0.3);

            this.tweens.add({
                targets: bear,
                y: height + 50,
                rotation: Phaser.Math.FloatBetween(-2, 2),
                duration: Phaser.Math.Between(3000, 6000),
                delay: Phaser.Math.Between(0, 2000),
                repeat: -1
            });
        }

        // Game Over text
        const gameOverText = this.add.text(width / 2, 120, 'GAME OVER', {
            fontFamily: 'Arial Black',
            fontSize: '56px',
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Shake animation
        this.tweens.add({
            targets: gameOverText,
            x: width / 2 + 5,
            duration: 50,
            yoyo: true,
            repeat: 5
        });

        // Sad Apu
        const apu = this.add.image(width / 2, 220, 'apu');
        apu.setScale(3);
        apu.setTint(0x888888);

        // Rotation animation (falling)
        this.tweens.add({
            targets: apu,
            rotation: 0.3,
            y: 230,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Score display
        this.add.text(width / 2, 320, 'FINAL SCORE', {
            fontFamily: 'Arial',
            fontSize: '20px',
            fill: '#AAAAAA'
        }).setOrigin(0.5);

        const scoreText = this.add.text(width / 2, 360, this.finalScore.toString(), {
            fontFamily: 'Arial Black',
            fontSize: '48px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Count up animation
        let displayScore = 0;
        const scoreIncrement = Math.ceil(this.finalScore / 50);

        const countUp = this.time.addEvent({
            delay: 30,
            callback: () => {
                displayScore = Math.min(displayScore + scoreIncrement, this.finalScore);
                scoreText.setText(displayScore.toString());
                if (displayScore >= this.finalScore) {
                    countUp.remove();
                }
            },
            loop: true
        });

        // Retry button
        const retryButton = this.add.image(width / 2, 450, 'button');
        const retryText = this.add.text(width / 2, 450, 'TRY AGAIN', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        retryButton.setInteractive({ useHandCursor: true });

        retryButton.on('pointerover', () => {
            retryButton.setTexture('button_hover');
            retryButton.setScale(1.05);
            retryText.setScale(1.05);
        });

        retryButton.on('pointerout', () => {
            retryButton.setTexture('button');
            retryButton.setScale(1);
            retryText.setScale(1);
        });

        retryButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Menu button
        const menuButton = this.add.image(width / 2, 520, 'button');
        const menuText = this.add.text(width / 2, 520, 'MAIN MENU', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        menuButton.setInteractive({ useHandCursor: true });

        menuButton.on('pointerover', () => {
            menuButton.setTexture('button_hover');
            menuButton.setScale(1.05);
            menuText.setScale(1.05);
        });

        menuButton.on('pointerout', () => {
            menuButton.setTexture('button');
            menuButton.setScale(1);
            menuText.setScale(1);
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });

        // Keyboard shortcuts
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });

        // Motivational text
        this.add.text(width / 2, height - 30, 'HODL and try again!', {
            fontFamily: 'Arial',
            fontSize: '14px',
            fill: '#666666',
            fontStyle: 'italic'
        }).setOrigin(0.5);
    }
}
