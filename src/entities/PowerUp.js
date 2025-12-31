import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class PowerUp {
    constructor(scene, x, y, type = 'bull') {
        this.scene = scene;
        this.type = type;

        // Create sprite with physics
        this.sprite = scene.physics.add.sprite(x, y, 'bull');
        this.sprite.body.setAllowGravity(true);
        this.sprite.setBounce(0);
        this.sprite.setSize(44, 28);

        // Idle animation - slight movement
        this.idleTween = scene.tweens.add({
            targets: this.sprite,
            y: y - 5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Golden glow effect
        this.glowGraphics = scene.add.graphics();
        this.updateGlow();

        // Reference for collision
        this.sprite.powerUp = this;
        this.isCollected = false;
    }

    updateGlow() {
        if (!this.sprite || this.isCollected) return;

        this.glowGraphics.clear();
        this.glowGraphics.fillStyle(0xFFD700, 0.3);
        this.glowGraphics.fillCircle(this.sprite.x, this.sprite.y, 35);
    }

    update() {
        if (!this.isCollected) {
            this.updateGlow();
        }
    }

    collect(player) {
        if (this.isCollected) return;
        this.isCollected = true;

        // Stop tweens
        if (this.idleTween) this.idleTween.stop();

        // Collection animation
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            duration: 300,
            onComplete: () => {
                this.destroy();
            }
        });

        // Apply power-up to player
        player.mountBull();

        // Show power-up message
        this.scene.showPowerUpMessage('BULL RUN!');

        return true;
    }

    destroy() {
        if (this.idleTween) this.idleTween.stop();
        if (this.glowGraphics) {
            this.glowGraphics.destroy();
        }
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}
