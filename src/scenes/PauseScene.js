import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Semi-transparent overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);

        // Pause title
        this.add.text(width / 2, 150, 'PAUSED', {
            fontFamily: 'Arial Black',
            fontSize: '48px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Resume button
        const resumeButton = this.add.image(width / 2, 280, 'button');
        const resumeText = this.add.text(width / 2, 280, 'RESUME', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        resumeButton.setInteractive({ useHandCursor: true });

        resumeButton.on('pointerover', () => {
            resumeButton.setTexture('button_hover');
            resumeButton.setScale(1.05);
            resumeText.setScale(1.05);
        });

        resumeButton.on('pointerout', () => {
            resumeButton.setTexture('button');
            resumeButton.setScale(1);
            resumeText.setScale(1);
        });

        resumeButton.on('pointerdown', () => {
            this.resumeGame();
        });

        // Restart button
        const restartButton = this.add.image(width / 2, 360, 'button');
        const restartText = this.add.text(width / 2, 360, 'RESTART', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        restartButton.setInteractive({ useHandCursor: true });

        restartButton.on('pointerover', () => {
            restartButton.setTexture('button_hover');
            restartButton.setScale(1.05);
            restartText.setScale(1.05);
        });

        restartButton.on('pointerout', () => {
            restartButton.setTexture('button');
            restartButton.setScale(1);
            restartText.setScale(1);
        });

        restartButton.on('pointerdown', () => {
            this.scene.stop('UIScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
            this.scene.stop();
        });

        // Menu button
        const menuButton = this.add.image(width / 2, 440, 'button');
        const menuText = this.add.text(width / 2, 440, 'MAIN MENU', {
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
            this.scene.stop('UIScene');
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
            this.scene.stop();
        });

        // Keyboard resume
        this.input.keyboard.once('keydown-ESC', () => {
            this.resumeGame();
        });

        this.input.keyboard.once('keydown-P', () => {
            this.resumeGame();
        });
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.stop();
    }
}
