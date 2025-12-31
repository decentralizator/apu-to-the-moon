import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class Enemy {
    constructor(scene, x, y, patrolLeft, patrolRight) {
        this.scene = scene;

        // Create sprite with physics
        this.sprite = scene.physics.add.sprite(x, y, 'bear');
        this.sprite.setBounce(0);
        this.sprite.setCollideWorldBounds(false);
        this.sprite.setSize(28, 28);
        this.sprite.setOffset(2, 4);

        // Patrol settings
        this.patrolLeft = patrolLeft;
        this.patrolRight = patrolRight;
        this.speed = GAME_CONFIG.ENEMY.SPEED;
        this.direction = 1; // 1 = right, -1 = left

        // State
        this.isAlive = true;

        // Reference for collision
        this.sprite.enemy = this;

        // Start moving
        this.sprite.setVelocityX(this.speed * this.direction);
    }

    update() {
        if (!this.isAlive) return;

        // Patrol logic
        if (this.sprite.x <= this.patrolLeft) {
            this.direction = 1;
            this.sprite.setFlipX(false);
        } else if (this.sprite.x >= this.patrolRight) {
            this.direction = -1;
            this.sprite.setFlipX(true);
        }

        this.sprite.setVelocityX(this.speed * this.direction);

        // Check if fell off the world
        if (this.sprite.y > this.scene.physics.world.bounds.height + 100) {
            this.destroy();
        }
    }

    die() {
        if (!this.isAlive) return;

        this.isAlive = false;
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(-200);
        this.sprite.setTint(0x000000);

        // Add score
        this.scene.addScore(GAME_CONFIG.ENEMY.POINTS);

        // Destroy after animation
        this.scene.time.delayedCall(500, () => {
            this.destroy();
        });
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }
}
