import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';

export class Boss {
    constructor(scene, x, y) {
        this.scene = scene;

        // Create sprite with physics
        this.sprite = scene.physics.add.sprite(x, y, 'megabear');
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setSize(90, 90);
        this.sprite.setOffset(3, 6);
        this.sprite.setScale(1);

        // Boss properties
        this.health = GAME_CONFIG.BOSS.HEALTH;
        this.maxHealth = GAME_CONFIG.BOSS.HEALTH;
        this.isAlive = true;
        this.isVulnerable = true;
        this.phase = 1;
        this.isAttacking = false;

        // Movement
        this.speed = 100;
        this.chargeSpeed = 300;
        this.direction = -1;

        // Attack patterns
        this.attackTimer = null;
        this.startAttackPattern();

        // Reference for collision
        this.sprite.boss = this;

        // Create health bar
        this.createHealthBar();
    }

    createHealthBar() {
        // Fixed position at top center of screen
        const x = 400;
        const y = 50;

        // Background bar
        this.healthBarBg = this.scene.add.rectangle(x, y, 300, 25, 0x333333);
        this.healthBarBg.setScrollFactor(0);
        this.healthBarBg.setDepth(100);
        this.healthBarBg.setStrokeStyle(2, 0x000000);

        // Health bar fill
        this.healthBar = this.scene.add.rectangle(x - 147, y, 294, 21, 0xFF0000);
        this.healthBar.setScrollFactor(0);
        this.healthBar.setOrigin(0, 0.5);
        this.healthBar.setDepth(101);

        // Boss name
        this.healthText = this.scene.add.text(x, y - 30, 'MEGA BEAR', {
            fontFamily: 'Arial Black',
            fontSize: '20px',
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        // Health text (shows HP)
        this.healthValueText = this.scene.add.text(x, y, `${this.health}/${this.maxHealth}`, {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            fill: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(102);
    }

    updateHealthBar() {
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.width = 294 * healthPercent;

        // Update health text
        if (this.healthValueText) {
            this.healthValueText.setText(`${this.health}/${this.maxHealth}`);
        }

        // Change color based on health
        if (healthPercent <= 0.3) {
            this.healthBar.setFillStyle(0xFF0000); // Red
        } else if (healthPercent <= 0.6) {
            this.healthBar.setFillStyle(0xFFA500); // Orange
        } else {
            this.healthBar.setFillStyle(0x00FF00); // Green
        }
    }

    startAttackPattern() {
        this.attackTimer = this.scene.time.addEvent({
            delay: 3000,
            callback: this.executeAttack,
            callbackScope: this,
            loop: true
        });
    }

    executeAttack() {
        if (!this.isAlive || this.isAttacking) return;

        const attackType = Phaser.Math.Between(1, 3);

        switch (this.phase) {
            case 1:
                this.chargeAttack();
                break;
            case 2:
                if (attackType <= 2) {
                    this.chargeAttack();
                } else {
                    this.jumpAttack();
                }
                break;
            case 3:
                if (attackType === 1) {
                    this.chargeAttack();
                } else if (attackType === 2) {
                    this.jumpAttack();
                } else {
                    this.summonMinions();
                }
                break;
        }
    }

    chargeAttack() {
        this.isAttacking = true;
        this.isVulnerable = false;

        // Flash red before charging
        this.sprite.setTint(0xFF0000);

        this.scene.time.delayedCall(500, () => {
            if (!this.isAlive) return;

            // Get player position
            const player = this.scene.player;
            if (!player) return;

            const direction = player.sprite.x < this.sprite.x ? -1 : 1;

            // Charge towards player
            this.sprite.setVelocityX(this.chargeSpeed * direction);

            this.scene.time.delayedCall(1500, () => {
                if (!this.isAlive) return;
                this.sprite.setVelocityX(0);
                this.sprite.clearTint();
                this.isAttacking = false;
                this.isVulnerable = true;
            });
        });
    }

    jumpAttack() {
        this.isAttacking = true;

        // Jump high
        this.sprite.setVelocityY(-600);

        // Create shockwave when landing
        const checkLanding = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                if (this.sprite.body.blocked.down) {
                    checkLanding.remove();
                    this.createShockwave();
                    this.isAttacking = false;
                }
            },
            loop: true
        });
    }

    createShockwave() {
        // Visual shockwave effect
        const shockwave = this.scene.add.circle(this.sprite.x, this.sprite.y + 40, 10, 0xFF6600, 0.5);

        this.scene.tweens.add({
            targets: shockwave,
            scaleX: 15,
            scaleY: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                shockwave.destroy();
            }
        });

        // Check if player is on ground nearby
        const player = this.scene.player;
        if (player && player.isAlive) {
            const distance = Math.abs(player.sprite.x - this.sprite.x);
            const playerOnGround = player.sprite.body.blocked.down;

            if (distance < 200 && playerOnGround) {
                player.die();
            }
        }
    }

    summonMinions() {
        this.isAttacking = true;

        // Roar animation
        this.sprite.setTint(0xFF6600);

        this.scene.time.delayedCall(500, () => {
            if (!this.isAlive) return;

            // Spawn 2 mini bears
            const leftBear = this.scene.spawnEnemy(
                this.sprite.x - 100,
                this.sprite.y,
                this.sprite.x - 200,
                this.sprite.x - 50
            );

            const rightBear = this.scene.spawnEnemy(
                this.sprite.x + 100,
                this.sprite.y,
                this.sprite.x + 50,
                this.sprite.x + 200
            );

            this.sprite.clearTint();
            this.isAttacking = false;
        });
    }

    update() {
        if (!this.isAlive) return;

        // Update phase based on health
        if (this.health <= 2 && this.phase < 3) {
            this.phase = 3;
            this.speed = 150;
        } else if (this.health <= 4 && this.phase < 2) {
            this.phase = 2;
            this.speed = 120;
        }

        // Basic patrol when not attacking
        if (!this.isAttacking) {
            if (this.sprite.x <= this.scene.bossArena.left + 50) {
                this.direction = 1;
            } else if (this.sprite.x >= this.scene.bossArena.right - 50) {
                this.direction = -1;
            }
            this.sprite.setVelocityX(this.speed * this.direction);
            this.sprite.setFlipX(this.direction === -1);
        }
    }

    takeDamage() {
        if (!this.isAlive || !this.isVulnerable) return false;

        this.health--;
        this.updateHealthBar();

        // Temporary invulnerability
        this.isVulnerable = false;

        // Flash white then red
        this.sprite.setTint(0xFFFFFF);

        // Knockback
        this.sprite.setVelocityY(-200);

        // Flash animation
        let flashCount = 0;
        const flashTimer = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                flashCount++;
                if (flashCount % 2 === 0) {
                    this.sprite.setTint(0xFFFFFF);
                } else {
                    this.sprite.setTint(0xFF0000);
                }
                if (flashCount >= 10) {
                    flashTimer.remove();
                    if (this.isAlive) {
                        this.sprite.clearTint();
                        this.isVulnerable = true;
                    }
                }
            },
            loop: true
        });

        // Check if dead
        if (this.health <= 0) {
            this.die();
        }

        return true;
    }

    die() {
        if (!this.isAlive) return;

        this.isAlive = false;

        if (this.attackTimer) {
            this.attackTimer.remove();
        }

        // Add score
        this.scene.addScore(GAME_CONFIG.BOSS.POINTS);

        // Hide health bar
        this.healthBarBg.setVisible(false);
        this.healthBar.setVisible(false);
        this.healthText.setVisible(false);
        if (this.healthValueText) this.healthValueText.setVisible(false);

        // ====== EPIC DEATH ANIMATION ======

        // Stop all movement
        this.sprite.setVelocity(0, 0);
        this.sprite.body.setAllowGravity(false);

        // Flash rapidly red/white
        let flashCount = 0;
        const deathFlash = this.scene.time.addEvent({
            delay: 80,
            callback: () => {
                flashCount++;
                if (flashCount % 2 === 0) {
                    this.sprite.setTint(0xFFFFFF);
                } else {
                    this.sprite.setTint(0xFF0000);
                }
                if (flashCount >= 10) {
                    deathFlash.remove();
                }
            },
            loop: true
        });

        // Screen shake
        this.scene.cameras.main.shake(500, 0.02);

        // After flashing, do the fall
        this.scene.time.delayedCall(800, () => {
            // Enable gravity for fall
            this.sprite.body.setAllowGravity(true);

            // Spin while falling
            this.scene.tweens.add({
                targets: this.sprite,
                angle: 180,
                duration: 800,
                ease: 'Power2'
            });

            // Wait for landing
            const checkLanding = this.scene.time.addEvent({
                delay: 50,
                callback: () => {
                    if (this.sprite.body.blocked.down || this.sprite.y > 550) {
                        checkLanding.remove();
                        this.onBossLanded();
                    }
                },
                loop: true
            });
        });
    }

    onBossLanded() {
        // Stop movement
        this.sprite.setVelocity(0, 0);
        this.sprite.body.setAllowGravity(false);

        // Flatten effect (squish on impact)
        this.scene.tweens.add({
            targets: this.sprite,
            scaleY: 0.3,
            scaleX: 1.5,
            duration: 200,
            ease: 'Bounce'
        });

        // Ground impact shake
        this.scene.cameras.main.shake(200, 0.03);

        // Gray out (defeated look)
        this.sprite.setTint(0x444444);

        // Create dust particles
        for (let i = 0; i < 8; i++) {
            const dust = this.scene.add.circle(
                this.sprite.x + Phaser.Math.Between(-50, 50),
                this.sprite.y + 30,
                Phaser.Math.Between(5, 15),
                0x8B7355,
                0.7
            );
            this.scene.tweens.add({
                targets: dust,
                y: dust.y - Phaser.Math.Between(20, 50),
                alpha: 0,
                scale: 0,
                duration: 600,
                onComplete: () => dust.destroy()
            });
        }

        // Show "DEFEATED!" text
        const defeatedText = this.scene.add.text(this.sprite.x, this.sprite.y - 80, 'DEFEATED!', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: defeatedText,
            y: defeatedText.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => defeatedText.destroy()
        });

        // Fade out boss after a moment
        this.scene.time.delayedCall(1500, () => {
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0,
                duration: 1000
            });
        });

        // Victory after delay
        this.scene.time.delayedCall(3000, () => {
            this.scene.bossDefeated();
        });
    }

    destroy() {
        if (this.attackTimer) {
            this.attackTimer.remove();
        }
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthText) this.healthText.destroy();
        if (this.healthValueText) this.healthValueText.destroy();
        if (this.sprite) this.sprite.destroy();
    }
}
