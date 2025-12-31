import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Get reference to game scene
        this.gameScene = this.scene.get('GameScene');

        // Create HUD container
        this.createHUD();

        // Listen for events from game scene
        this.gameScene.events.on('scoreChanged', this.updateScore, this);
        this.gameScene.events.on('livesChanged', this.updateLives, this);
        this.gameScene.events.on('satoshiCollected', this.updateSatoshis, this);
        this.gameScene.events.on('bullMounted', this.showBullTimer, this);
        this.gameScene.events.on('bullDismounted', this.hideBullTimer, this);

        // Cleanup when scene stops
        this.events.on('shutdown', this.shutdown, this);
    }

    createHUD() {
        const padding = 20;

        // Lives display (left side)
        this.livesContainer = this.add.container(padding, padding);

        this.livesIcon = this.add.image(0, 0, 'apu');
        this.livesIcon.setScale(0.8);

        this.livesText = this.add.text(25, -8, `x ${GAME_CONFIG.STARTING_LIVES}`, {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        });

        this.livesContainer.add([this.livesIcon, this.livesText]);

        // Score display (center-right)
        this.scoreText = this.add.text(GAME_CONFIG.WIDTH - padding, padding, 'SCORE: 0', {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0);

        // Satoshi counter (below score)
        this.satoshiContainer = this.add.container(GAME_CONFIG.WIDTH - padding, padding + 30);

        this.satoshiIcon = this.add.image(-60, 0, 'satoshi');
        this.satoshiIcon.setScale(1.5);

        this.satoshiText = this.add.text(-40, -10, '0', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        });

        this.satoshiContainer.add([this.satoshiIcon, this.satoshiText]);

        // Bull timer (hidden by default)
        this.bullTimerContainer = this.add.container(GAME_CONFIG.WIDTH / 2, 50);
        this.bullTimerContainer.setVisible(false);

        this.bullTimerBg = this.add.rectangle(0, 0, 200, 25, 0x000000, 0.5);

        this.bullTimerBar = this.add.rectangle(-98, 0, 196, 21, 0x4CAF50);
        this.bullTimerBar.setOrigin(0, 0.5);

        this.bullTimerText = this.add.text(0, -25, 'BULL RUN!', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            fill: '#4CAF50',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.bullTimerContainer.add([this.bullTimerBg, this.bullTimerBar, this.bullTimerText]);
    }

    updateScore(score) {
        this.scoreText.setText(`SCORE: ${score}`);

        // Pulse animation
        this.tweens.add({
            targets: this.scoreText,
            scale: 1.2,
            duration: 100,
            yoyo: true
        });
    }

    updateLives(lives) {
        this.livesText.setText(`x ${lives}`);

        // Flash animation
        this.tweens.add({
            targets: this.livesContainer,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 2
        });
    }

    updateSatoshis(count) {
        this.satoshiText.setText(`${count}`);

        // Coin flip animation
        this.tweens.add({
            targets: this.satoshiIcon,
            scaleX: 0.3,
            duration: 100,
            yoyo: true
        });
    }

    showBullTimer() {
        this.bullTimerContainer.setVisible(true);
        this.bullTimerBar.width = 196;

        // Animate the timer bar
        this.bullTween = this.tweens.add({
            targets: this.bullTimerBar,
            width: 0,
            duration: GAME_CONFIG.BULL.DURATION,
            onComplete: () => {
                this.hideBullTimer();
            }
        });

        // Pulsing glow effect
        this.bullGlowTween = this.tweens.add({
            targets: this.bullTimerText,
            alpha: 0.5,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }

    hideBullTimer() {
        this.bullTimerContainer.setVisible(false);

        if (this.bullTween) {
            this.bullTween.stop();
        }
        if (this.bullGlowTween) {
            this.bullGlowTween.stop();
        }
    }

    shutdown() {
        // Remove event listeners
        this.gameScene.events.off('scoreChanged', this.updateScore, this);
        this.gameScene.events.off('livesChanged', this.updateLives, this);
        this.gameScene.events.off('satoshiCollected', this.updateSatoshis, this);
        this.gameScene.events.off('bullMounted', this.showBullTimer, this);
        this.gameScene.events.off('bullDismounted', this.hideBullTimer, this);
    }
}
