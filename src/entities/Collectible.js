import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class Collectible {
    constructor(scene, x, y, type = 'satoshi') {
        this.scene = scene;
        this.type = type;

        // Determine texture and points based on type
        let texture, points;
        switch (type) {
            case 'satoshi':
                texture = 'satoshi';
                points = GAME_CONFIG.SATOSHI.POINTS;
                break;
            case 'shitcoin':
                texture = 'shitcoin';
                points = GAME_CONFIG.SHITCOIN.POINTS;
                break;
            case 'moontoken':
                texture = 'moontoken';
                points = GAME_CONFIG.MOON_TOKEN.POINTS;
                break;
            default:
                texture = 'satoshi';
                points = GAME_CONFIG.SATOSHI.POINTS;
        }

        this.points = points;

        // Create sprite with physics
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.body.setAllowGravity(false);
        this.sprite.setSize(14, 14);

        // Float animation
        this.floatTween = scene.tweens.add({
            targets: this.sprite,
            y: y - 8,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Rotation for coins
        this.rotateTween = scene.tweens.add({
            targets: this.sprite,
            scaleX: { from: 1, to: 0.3 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Reference for collision
        this.sprite.collectible = this;
    }

    collect() {
        // Stop tweens
        if (this.floatTween) this.floatTween.stop();
        if (this.rotateTween) this.rotateTween.stop();

        // Collection animation
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 30,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            onComplete: () => {
                this.destroy();
            }
        });

        // Add points
        this.scene.addScore(this.points);

        // Track satoshi collection for extra life
        if (this.type === 'satoshi') {
            this.scene.collectSatoshi();
        }

        // Special effect for moon token
        if (this.type === 'moontoken') {
            this.scene.showMoonTokenEffect();
        }

        return this.points;
    }

    destroy() {
        if (this.floatTween) this.floatTween.stop();
        if (this.rotateTween) this.rotateTween.stop();
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}
