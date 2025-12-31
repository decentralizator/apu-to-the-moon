import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create sprite with physics
        this.sprite = scene.physics.add.sprite(x, y, 'apu');
        this.sprite.setBounce(GAME_CONFIG.PLAYER.BOUNCE);
        this.sprite.setCollideWorldBounds(false);
        this.sprite.setSize(28, 28);
        this.sprite.setOffset(2, 4);

        // Player properties
        this.speed = GAME_CONFIG.PLAYER.SPEED;
        this.jumpForce = GAME_CONFIG.PLAYER.JUMP_FORCE;
        this.isAlive = true;
        this.isInvincible = false;
        this.isRidingBull = false;
        this.bullTimer = null;
        this.canJump = true;
        this.jumpCooldown = 150;

        // Create keyboard controls
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        // Invincibility flash tween
        this.flashTween = null;

        // Reference for collision
        this.sprite.player = this;
    }

    update() {
        if (!this.isAlive) return;

        const onGround = this.sprite.body.blocked.down || this.sprite.body.touching.down;
        const currentSpeed = this.isRidingBull ? this.speed * GAME_CONFIG.BULL.SPEED_MULTIPLIER : this.speed;

        // Get mobile controls state
        const mobile = window.MobileControls || { left: false, right: false, jump: false };

        // Horizontal movement (keyboard OR touch)
        const leftPressed = this.cursors.left.isDown || this.wasd.left.isDown || mobile.left;
        const rightPressed = this.cursors.right.isDown || this.wasd.right.isDown || mobile.right;

        if (leftPressed) {
            this.sprite.setVelocityX(-currentSpeed);
            this.sprite.setFlipX(true);
        } else if (rightPressed) {
            this.sprite.setVelocityX(currentSpeed);
            this.sprite.setFlipX(false);
        } else {
            this.sprite.setVelocityX(0);
        }

        // Jump (keyboard OR touch)
        const jumpPressed = this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.space.isDown || this.cursors.space.isDown || mobile.jump;

        if (jumpPressed && onGround && this.canJump) {
            this.sprite.setVelocityY(this.jumpForce);
            this.canJump = false;

            // Jump cooldown to prevent double jumps
            this.scene.time.delayedCall(this.jumpCooldown, () => {
                this.canJump = true;
            });
        }

        // Update texture based on state
        if (!onGround) {
            this.sprite.setTexture('apu_jump');
        } else {
            this.sprite.setTexture('apu');
        }

        // Check if fell off the world
        if (this.sprite.y > this.scene.physics.world.bounds.height + 100) {
            this.die();
        }
    }

    bounce() {
        // Small bounce when stomping enemy
        this.sprite.setVelocityY(this.jumpForce * 0.6);
    }

    die() {
        if (!this.isAlive || this.isInvincible) return;

        this.isAlive = false;

        // Death animation
        this.sprite.setVelocityY(-300);
        this.sprite.setTint(0xFF0000);

        this.scene.time.delayedCall(1000, () => {
            this.scene.events.emit('playerDied');
        });
    }

    respawn(x, y) {
        this.sprite.setPosition(x, y);
        this.sprite.setVelocity(0, 0);
        this.sprite.clearTint();
        this.isAlive = true;

        // Brief invincibility after respawn
        this.setInvincible(2000);
    }

    setInvincible(duration) {
        this.isInvincible = true;

        // Flash effect
        this.flashTween = this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: Math.floor(duration / 200)
        });

        this.scene.time.delayedCall(duration, () => {
            this.isInvincible = false;
            this.sprite.setAlpha(1);
            if (this.flashTween) {
                this.flashTween.stop();
            }
        });
    }

    mountBull() {
        if (this.isRidingBull) return;

        this.isRidingBull = true;
        this.isInvincible = true;

        // Visual effect - golden tint
        this.sprite.setTint(0xFFD700);

        // Emit event for UI
        this.scene.events.emit('bullMounted');

        // Timer for bull ride
        this.bullTimer = this.scene.time.delayedCall(GAME_CONFIG.BULL.DURATION, () => {
            this.dismountBull();
        });
    }

    dismountBull() {
        this.isRidingBull = false;
        this.isInvincible = false;
        this.sprite.clearTint();
        this.scene.events.emit('bullDismounted');
    }

    destroy() {
        if (this.bullTimer) {
            this.bullTimer.remove();
        }
        if (this.flashTween) {
            this.flashTween.stop();
        }
        this.sprite.destroy();
    }
}
