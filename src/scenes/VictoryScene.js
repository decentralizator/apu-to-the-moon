import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.satoshisCollected = data.satoshis || 0;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background - celebratory space
        this.cameras.main.setBackgroundColor(0x0a0a2e);

        // Stars
        for (let i = 0; i < 150; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const star = this.add.image(x, y, 'star');
            star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
            star.setScale(Phaser.Math.FloatBetween(0.5, 2));

            this.tweens.add({
                targets: star,
                alpha: { from: star.alpha, to: 0.1 },
                duration: Phaser.Math.Between(500, 1500),
                yoyo: true,
                repeat: -1
            });
        }

        // Falling satoshis celebration
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(50, width - 50);
            const coin = this.add.image(x, -50, 'satoshi');
            coin.setScale(Phaser.Math.FloatBetween(1, 2));

            this.tweens.add({
                targets: coin,
                y: height + 50,
                rotation: Phaser.Math.FloatBetween(2, 6),
                duration: Phaser.Math.Between(2000, 4000),
                delay: Phaser.Math.Between(0, 3000),
                repeat: -1
            });
        }

        // Moon (destination reached!)
        const moon = this.add.circle(width / 2, 100, 60, 0xFFFFCC);
        moon.setAlpha(0.9);

        // Moon glow
        const moonGlow = this.add.circle(width / 2, 100, 80, 0xFFFFCC, 0.2);

        this.tweens.add({
            targets: moonGlow,
            scale: 1.2,
            alpha: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Victory text
        const victoryText = this.add.text(width / 2, 200, 'TO THE MOON!', {
            fontFamily: 'Arial Black',
            fontSize: '52px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Rainbow animation
        const colors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x8B00FF];
        let colorIndex = 0;

        this.time.addEvent({
            delay: 200,
            callback: () => {
                victoryText.setTint(colors[colorIndex]);
                colorIndex = (colorIndex + 1) % colors.length;
            },
            loop: true
        });

        // Bounce animation
        this.tweens.add({
            targets: victoryText,
            y: 210,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Apu on the moon
        const apu = this.add.image(width / 2, 100, 'apu');
        apu.setScale(2);

        // Flag planting animation
        this.tweens.add({
            targets: apu,
            y: 90,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Stats container
        const statsY = 320;

        this.add.text(width / 2, statsY, 'MISSION COMPLETE', {
            fontFamily: 'Arial',
            fontSize: '18px',
            fill: '#AAAAAA'
        }).setOrigin(0.5);

        // Final score
        this.add.text(width / 2 - 100, statsY + 40, 'SCORE:', {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            fill: '#FFFFFF'
        }).setOrigin(0, 0.5);

        const scoreText = this.add.text(width / 2 + 100, statsY + 40, '0', {
            fontFamily: 'Arial Black',
            fontSize: '28px',
            fill: '#FFD700'
        }).setOrigin(1, 0.5);

        // Satoshis collected
        this.add.text(width / 2 - 100, statsY + 80, 'SATOSHIS:', {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            fill: '#FFFFFF'
        }).setOrigin(0, 0.5);

        const satoshiText = this.add.text(width / 2 + 100, statsY + 80, '0', {
            fontFamily: 'Arial Black',
            fontSize: '28px',
            fill: '#FFD700'
        }).setOrigin(1, 0.5);

        // Count up animation for score
        let displayScore = 0;
        let displaySatoshis = 0;
        const scoreIncrement = Math.ceil(this.finalScore / 60);
        const satoshiIncrement = Math.ceil(this.satoshisCollected / 60);

        const countUp = this.time.addEvent({
            delay: 25,
            callback: () => {
                displayScore = Math.min(displayScore + scoreIncrement, this.finalScore);
                displaySatoshis = Math.min(displaySatoshis + satoshiIncrement, this.satoshisCollected);
                scoreText.setText(displayScore.toString());
                satoshiText.setText(displaySatoshis.toString());

                if (displayScore >= this.finalScore && displaySatoshis >= this.satoshisCollected) {
                    countUp.remove();
                }
            },
            loop: true
        });

        // Play Again button
        const playButton = this.add.image(width / 2, 480, 'button');
        const playText = this.add.text(width / 2, 480, 'PLAY AGAIN', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        playButton.setInteractive({ useHandCursor: true });

        playButton.on('pointerover', () => {
            playButton.setTexture('button_hover');
            playButton.setScale(1.05);
            playText.setScale(1.05);
        });

        playButton.on('pointerout', () => {
            playButton.setTexture('button');
            playButton.setScale(1);
            playText.setScale(1);
        });

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Menu button
        const menuButton = this.add.image(width / 2, 550, 'button');
        const menuText = this.add.text(width / 2, 550, 'MAIN MENU', {
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

        // Achievement text
        this.add.text(width / 2, height - 30, 'Diamond Hands! You made it!', {
            fontFamily: 'Arial',
            fontSize: '14px',
            fill: '#888888',
            fontStyle: 'italic'
        }).setOrigin(0.5);

        // Keyboard shortcuts
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });

        // Confetti effect
        this.createConfetti();
    }

    createConfetti() {
        const width = this.cameras.main.width;
        const colors = [0xFF0000, 0xFF7F00, 0xFFFF00, 0x00FF00, 0x0000FF, 0x8B00FF, 0xFFD700];

        for (let i = 0; i < 30; i++) {
            this.time.delayedCall(i * 100, () => {
                const x = Phaser.Math.Between(0, width);
                const confetti = this.add.rectangle(
                    x, -10,
                    Phaser.Math.Between(5, 15),
                    Phaser.Math.Between(5, 15),
                    Phaser.Utils.Array.GetRandom(colors)
                );

                this.tweens.add({
                    targets: confetti,
                    y: 650,
                    x: x + Phaser.Math.Between(-100, 100),
                    rotation: Phaser.Math.FloatBetween(2, 8),
                    duration: Phaser.Math.Between(2000, 4000),
                    onComplete: () => confetti.destroy()
                });
            });
        }
    }
}
