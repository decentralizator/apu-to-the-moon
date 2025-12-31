import Phaser from 'phaser';
import { GAME_CONFIG } from '../config.js';
import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { Collectible } from '../entities/Collectible.js';
import { PowerUp } from '../entities/PowerUp.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.score = 0;
        this.lives = GAME_CONFIG.STARTING_LIVES;
        this.satoshisCollected = 0;
        this.totalSatoshisForLife = 0;
        this.levelComplete = false;
        this.bossSpawned = false;
        this.bossCollisionCooldown = false;
        this.boss = null;
    }

    create() {
        // World bounds - large horizontal level
        const worldWidth = 5000;
        const worldHeight = 600;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // Background
        this.createBackground(worldWidth);

        // Create platforms group
        this.platforms = this.physics.add.staticGroup();

        // Create level
        this.createLevel();

        // Create player
        this.player = new Player(this, 100, 400);

        // Setup camera
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(100, 50);

        // Create entity groups
        this.enemies = [];
        this.collectibles = [];
        this.powerUps = [];

        // Populate level
        this.populateLevel();

        // Setup collisions
        this.setupCollisions();

        // Launch UI scene
        this.scene.launch('UIScene');

        // Listen for player death
        this.events.on('playerDied', this.handlePlayerDeath, this);

        // Pause handling
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.launch('PauseScene');
            this.scene.pause();
        });

        this.input.keyboard.on('keydown-P', () => {
            this.scene.launch('PauseScene');
            this.scene.pause();
        });

        // Fade in
        this.cameras.main.fadeIn(500);
    }

    createBackground(worldWidth) {
        // Space background color
        this.cameras.main.setBackgroundColor(GAME_CONFIG.COLORS.SPACE_BG);

        // Parallax star layers
        for (let layer = 0; layer < 3; layer++) {
            const scrollFactor = 0.1 + layer * 0.1;
            const starCount = 50 - layer * 10;

            for (let i = 0; i < starCount; i++) {
                const x = Phaser.Math.Between(0, worldWidth);
                const y = Phaser.Math.Between(0, 400);
                const star = this.add.image(x, y, 'star');
                star.setScrollFactor(scrollFactor);
                star.setAlpha(Phaser.Math.FloatBetween(0.3, 0.8));
                star.setScale(Phaser.Math.FloatBetween(0.5, 1.5));

                // Twinkle
                this.tweens.add({
                    targets: star,
                    alpha: { from: star.alpha, to: 0.1 },
                    duration: Phaser.Math.Between(1500, 4000),
                    yoyo: true,
                    repeat: -1
                });
            }
        }

        // Add some rockets as decorations
        const rocketPositions = [500, 1500, 2800, 4200];
        rocketPositions.forEach(x => {
            const rocket = this.add.image(x, 520, 'rocket');
            rocket.setScrollFactor(0.5);
            rocket.setAlpha(0.5);
        });

        // "TO THE MOON" signs
        const signPositions = [300, 1200, 2500, 3800];
        signPositions.forEach(x => {
            const sign = this.add.text(x, 150, 'TO THE MOON!', {
                fontFamily: 'Arial Black',
                fontSize: '24px',
                fill: '#FFD700',
                stroke: '#000',
                strokeThickness: 3
            }).setScrollFactor(0.3).setAlpha(0.4);
        });
    }

    createLevel() {
        // Ground platforms
        this.createPlatform(0, 568, 50, 'ground'); // Starting area

        // Section 1: Tutorial Zone (0-800px)
        this.createPlatform(200, 500, 5);
        this.createPlatform(400, 450, 4);
        this.createPlatform(600, 400, 3);

        // Section 2: Rising Market (800-1600px)
        this.createPlatform(800, 520, 6);
        this.createPlatform(950, 420, 3);
        this.createPlatform(1100, 350, 4);
        this.createPlatform(1300, 300, 3);
        this.createPlatform(1450, 380, 4);

        // Section 3: Volatility Zone (1600-2400px) - Moving platforms will be added
        this.createPlatform(1600, 500, 5);
        this.createPlatform(1800, 400, 3);
        this.createPlatform(1950, 480, 4);
        this.createPlatform(2100, 350, 3);
        this.createPlatform(2250, 420, 5);

        // Secret area platform (higher up)
        this.createPlatform(2000, 200, 3);

        // Section 4: Bear Territory (2400-3200px)
        this.createPlatform(2400, 520, 6);
        this.createPlatform(2550, 440, 3);
        this.createPlatform(2700, 380, 4);
        this.createPlatform(2850, 450, 3);
        this.createPlatform(3000, 500, 5);

        // Section 5: Final Push & Boss Arena (3200-5000px)
        this.createPlatform(3200, 520, 6);
        this.createPlatform(3400, 450, 4);
        this.createPlatform(3600, 400, 3);

        // Boss arena - large flat area
        this.createPlatform(3800, 568, 35, 'ground');

        // Store boss arena bounds
        this.bossArena = {
            left: 3850,
            right: 4900,
            trigger: 3900
        };

        // Moving platforms in volatility zone
        this.createMovingPlatforms();
    }

    createPlatform(x, y, width, type = 'platform') {
        for (let i = 0; i < width; i++) {
            const tile = this.platforms.create(x + i * 32, y, type);
            tile.refreshBody();
        }
    }

    createMovingPlatforms() {
        // Store moving platforms separately for proper physics updates
        this.movingPlatforms = [];

        // Vertical moving platform - make it wider (3 tiles)
        for (let i = 0; i < 3; i++) {
            const tile = this.physics.add.image(1700 + i * 32, 450, 'platform');
            tile.setImmovable(true);
            tile.body.setAllowGravity(false);
            tile.body.checkCollision.down = false;
            tile.body.checkCollision.left = false;
            tile.body.checkCollision.right = false;
            this.movingPlatforms.push({
                sprite: tile,
                type: 'vertical',
                baseY: 450,
                minY: 350,
                maxY: 450,
                speed: 30,
                direction: -1,
                prevX: tile.x,
                prevY: tile.y
            });
        }

        // Horizontal moving platform - make it wider (3 tiles)
        for (let i = 0; i < 3; i++) {
            const tile = this.physics.add.image(2150 + i * 32, 300, 'platform');
            tile.setImmovable(true);
            tile.body.setAllowGravity(false);
            tile.body.checkCollision.down = false;
            tile.body.checkCollision.left = false;
            tile.body.checkCollision.right = false;
            this.movingPlatforms.push({
                sprite: tile,
                type: 'horizontal',
                baseX: 2150 + i * 32,
                minX: 2150 + i * 32,
                maxX: 2300 + i * 32,
                speed: 35,
                direction: 1,
                prevX: tile.x,
                prevY: tile.y
            });
        }
    }

    updateMovingPlatforms() {
        // Track which platform the player is standing on
        let playerOnPlatform = null;
        let platformDeltaX = 0;
        let platformDeltaY = 0;

        this.movingPlatforms.forEach(platform => {
            const sprite = platform.sprite;

            // Store previous position
            platform.prevX = sprite.x;
            platform.prevY = sprite.y;

            // Move platform based on type
            if (platform.type === 'vertical') {
                sprite.y += platform.speed * platform.direction * (1/60);

                if (sprite.y <= platform.minY) {
                    sprite.y = platform.minY;
                    platform.direction = 1;
                } else if (sprite.y >= platform.maxY) {
                    sprite.y = platform.maxY;
                    platform.direction = -1;
                }
            } else if (platform.type === 'horizontal') {
                sprite.x += platform.speed * platform.direction * (1/60);

                if (sprite.x >= platform.maxX) {
                    sprite.x = platform.maxX;
                    platform.direction = -1;
                } else if (sprite.x <= platform.minX) {
                    sprite.x = platform.minX;
                    platform.direction = 1;
                }
            }

            // Check if player is standing on this platform
            if (this.player && this.player.sprite && this.player.isAlive) {
                const playerSprite = this.player.sprite;
                const playerBottom = playerSprite.body.bottom;
                const platformTop = sprite.body.top;
                const playerOnGround = playerSprite.body.blocked.down || playerSprite.body.touching.down;

                // Check if player is on top of this platform
                if (playerOnGround &&
                    Math.abs(playerBottom - platformTop) < 10 &&
                    playerSprite.x > sprite.x - sprite.width/2 - 10 &&
                    playerSprite.x < sprite.x + sprite.width/2 + 10) {

                    playerOnPlatform = platform;
                    platformDeltaX = sprite.x - platform.prevX;
                    platformDeltaY = sprite.y - platform.prevY;
                }
            }
        });

        // Move player with platform
        if (playerOnPlatform && this.player && this.player.sprite) {
            this.player.sprite.x += platformDeltaX;
            this.player.sprite.y += platformDeltaY;
        }
    }

    populateLevel() {
        // Section 1: Tutorial - Easy satoshis
        this.spawnCollectible(250, 460, 'satoshi');
        this.spawnCollectible(300, 460, 'satoshi');
        this.spawnCollectible(450, 410, 'satoshi');
        this.spawnCollectible(500, 410, 'satoshi');
        this.spawnCollectible(650, 360, 'satoshi');

        // First enemy (slow)
        this.spawnEnemy(500, 420, 400, 600);

        // Section 2: Rising Market
        this.spawnCollectible(850, 480, 'satoshi');
        this.spawnCollectible(900, 480, 'satoshi');
        this.spawnCollectible(1000, 380, 'satoshi');
        this.spawnCollectible(1150, 310, 'satoshi');
        this.spawnCollectible(1200, 310, 'satoshi');
        this.spawnCollectible(1350, 260, 'satoshi');
        this.spawnCollectible(1400, 260, 'satoshi');
        this.spawnCollectible(1500, 340, 'satoshi');
        this.spawnCollectible(1550, 340, 'satoshi');
        this.spawnCollectible(1420, 200, 'satoshi'); // Bonus high jump

        // First Bull power-up - on the platform at (1100, 350)
        this.spawnPowerUp(1130, 310);

        // Enemies
        this.spawnEnemy(900, 490, 820, 950);
        this.spawnEnemy(1400, 350, 1320, 1480);

        // Section 3: Volatility Zone - Mix of coins
        this.spawnCollectible(1650, 460, 'satoshi');
        this.spawnCollectible(1700, 400, 'shitcoin');
        this.spawnCollectible(1750, 360, 'satoshi');
        this.spawnCollectible(1850, 360, 'shitcoin');
        this.spawnCollectible(2000, 440, 'satoshi');
        this.spawnCollectible(2050, 440, 'satoshi');
        this.spawnCollectible(2150, 310, 'satoshi');
        this.spawnCollectible(2300, 380, 'satoshi');

        // Secret Moon Token!
        this.spawnCollectible(2050, 160, 'moontoken');

        // Enemies
        this.spawnEnemy(1800, 370, 1750, 1900);
        this.spawnEnemy(2200, 320, 2100, 2300);
        this.spawnEnemy(2300, 390, 2270, 2380);

        // Section 4: Bear Territory
        this.spawnCollectible(2450, 480, 'satoshi');
        this.spawnCollectible(2500, 480, 'satoshi');
        this.spawnCollectible(2600, 400, 'satoshi');
        this.spawnCollectible(2650, 400, 'satoshi');
        this.spawnCollectible(2750, 340, 'satoshi');
        this.spawnCollectible(2900, 410, 'satoshi');
        this.spawnCollectible(3050, 460, 'satoshi');
        this.spawnCollectible(3100, 460, 'satoshi');

        // More enemies
        this.spawnEnemy(2500, 490, 2420, 2580);
        this.spawnEnemy(2650, 350, 2600, 2750);
        this.spawnEnemy(2900, 420, 2860, 2980);
        this.spawnEnemy(3050, 470, 3000, 3150);

        // Section 5: Final Push
        this.spawnCollectible(3250, 480, 'satoshi');
        this.spawnCollectible(3300, 480, 'satoshi');
        this.spawnCollectible(3450, 410, 'satoshi');
        this.spawnCollectible(3550, 360, 'satoshi');
        this.spawnCollectible(3650, 360, 'satoshi');

        // Bull before boss - on the platform at (3600, 400)
        this.spawnPowerUp(3620, 360);
    }

    spawnCollectible(x, y, type) {
        const collectible = new Collectible(this, x, y, type);
        this.collectibles.push(collectible);
        return collectible;
    }

    spawnEnemy(x, y, patrolLeft, patrolRight) {
        const enemy = new Enemy(this, x, y, patrolLeft, patrolRight);
        this.enemies.push(enemy);

        // Add collision with platforms
        this.physics.add.collider(enemy.sprite, this.platforms);

        // Add collision with moving platforms
        this.movingPlatforms.forEach(platform => {
            this.physics.add.collider(enemy.sprite, platform.sprite);
        });

        // Add collision with player (important for dynamically spawned enemies like boss minions)
        this.physics.add.overlap(this.player.sprite, enemy.sprite, (playerSprite, enemySprite) => {
            this.handlePlayerEnemyCollision(playerSprite, enemySprite);
        });

        return enemy;
    }

    spawnPowerUp(x, y, type = 'bull') {
        const powerUp = new PowerUp(this, x, y, type);
        this.powerUps.push(powerUp);

        // Add collision with platforms
        this.physics.add.collider(powerUp.sprite, this.platforms);

        return powerUp;
    }

    setupCollisions() {
        // Player with static platforms
        this.physics.add.collider(this.player.sprite, this.platforms);

        // Player with moving platforms
        this.movingPlatforms.forEach(platform => {
            this.physics.add.collider(this.player.sprite, platform.sprite);
        });

        // Enemies with moving platforms
        this.enemies.forEach(enemy => {
            this.movingPlatforms.forEach(platform => {
                this.physics.add.collider(enemy.sprite, platform.sprite);
            });
        });

        // Power-ups with moving platforms
        this.powerUps.forEach(powerUp => {
            this.movingPlatforms.forEach(platform => {
                this.physics.add.collider(powerUp.sprite, platform.sprite);
            });
        });

        // Player with collectibles
        this.collectibles.forEach(collectible => {
            this.physics.add.overlap(this.player.sprite, collectible.sprite, () => {
                collectible.collect();
            });
        });

        // Player with power-ups
        this.powerUps.forEach(powerUp => {
            this.physics.add.overlap(this.player.sprite, powerUp.sprite, () => {
                powerUp.collect(this.player);
            });
        });

        // Player with enemies
        this.enemies.forEach(enemy => {
            this.physics.add.overlap(this.player.sprite, enemy.sprite, (playerSprite, enemySprite) => {
                this.handlePlayerEnemyCollision(playerSprite, enemySprite);
            });
        });
    }

    handlePlayerEnemyCollision(playerSprite, enemySprite) {
        const player = playerSprite.player;
        const enemy = enemySprite.enemy;

        if (!player || !enemy || !player.isAlive || !enemy.isAlive) return;

        // Check if player is stomping (coming from above)
        const playerBottom = playerSprite.body.bottom;
        const enemyTop = enemySprite.body.top;
        const playerVelocityY = playerSprite.body.velocity.y;

        if (playerVelocityY > 0 && playerBottom < enemyTop + 20) {
            // Stomp!
            enemy.die();
            player.bounce();
        } else if (!player.isInvincible) {
            // Player hit
            player.die();
        } else if (player.isRidingBull) {
            // Bull run kills enemies
            enemy.die();
        }
    }

    update() {
        // Update moving platforms FIRST (before player)
        this.updateMovingPlatforms();

        // Update player
        if (this.player) {
            this.player.update();
        }

        // Update enemies
        this.enemies.forEach(enemy => {
            if (enemy.sprite) {
                enemy.update();
            }
        });

        // Update power-ups
        this.powerUps.forEach(powerUp => {
            if (powerUp.sprite) {
                powerUp.update();
            }
        });

        // Update boss
        if (this.boss && this.boss.isAlive) {
            this.boss.update();

            // Check boss collision with player manually for better control
            if (this.boss.sprite && this.player && this.player.sprite && this.player.isAlive) {
                const playerBounds = this.player.sprite.getBounds();
                const bossBounds = this.boss.sprite.getBounds();

                if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, bossBounds)) {
                    this.handleBossCollision();
                }
            }
        }

        // Check boss trigger
        if (!this.bossSpawned && this.player.sprite.x > this.bossArena.trigger) {
            this.spawnBoss();
        }

        // Clean up destroyed entities
        this.enemies = this.enemies.filter(e => e.sprite !== null);
        this.collectibles = this.collectibles.filter(c => c.sprite !== null);
        this.powerUps = this.powerUps.filter(p => p.sprite !== null);
    }

    spawnBoss() {
        this.bossSpawned = true;

        // Lock camera to boss arena
        this.cameras.main.stopFollow();
        this.cameras.main.pan(4350, 300, 1000);

        // Show boss intro
        const bossText = this.add.text(this.cameras.main.scrollX + 400, 200, 'MEGA BEAR', {
            fontFamily: 'Arial Black',
            fontSize: '48px',
            fill: '#FF0000',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.tweens.add({
            targets: bossText,
            alpha: 0,
            duration: 2000,
            onComplete: () => bossText.destroy()
        });

        // Spawn boss
        this.time.delayedCall(1500, () => {
            this.boss = new Boss(this, 4500, 400);
            this.physics.add.collider(this.boss.sprite, this.platforms);
        });
    }

    handleBossCollision() {
        if (!this.player || !this.player.isAlive || !this.boss || !this.boss.isAlive) return;

        // Prevent multiple collisions in same frame
        if (this.bossCollisionCooldown) return;

        const playerSprite = this.player.sprite;
        const bossSprite = this.boss.sprite;

        const playerBottom = playerSprite.body.bottom;
        const playerCenterY = playerSprite.body.center.y;
        const bossTop = bossSprite.body.top;
        const bossCenterY = bossSprite.body.center.y;
        const playerVelocityY = playerSprite.body.velocity.y;

        // More forgiving stomp detection:
        // Player must be falling (velocity > 0) AND player's center must be above boss's top
        const isStomping = playerVelocityY > 0 && playerCenterY < bossTop + 20;

        if (isStomping) {
            // Stomp on boss!
            this.bossCollisionCooldown = true;
            this.time.delayedCall(500, () => {
                this.bossCollisionCooldown = false;
            });

            this.boss.takeDamage();
            this.player.bounce();

            // Show damage feedback
            this.showPowerUpMessage(`HIT! ${this.boss.health} HP left`);

            // Screen shake
            this.cameras.main.shake(100, 0.01);

        } else if (!this.player.isInvincible) {
            // Player hit by boss
            this.bossCollisionCooldown = true;
            this.time.delayedCall(1000, () => {
                this.bossCollisionCooldown = false;
            });
            this.player.die();
        }
    }

    addScore(points) {
        this.score += points;
        this.events.emit('scoreChanged', this.score);
    }

    collectSatoshi() {
        this.satoshisCollected++;
        this.totalSatoshisForLife++;
        this.events.emit('satoshiCollected', this.satoshisCollected);

        // Extra life every 100 satoshis
        if (this.totalSatoshisForLife >= GAME_CONFIG.SATOSHIS_FOR_EXTRA_LIFE) {
            this.totalSatoshisForLife = 0;
            this.addLife();
        }
    }

    addLife() {
        this.lives++;
        this.events.emit('livesChanged', this.lives);
        this.showPowerUpMessage('EXTRA LIFE!');
    }

    handlePlayerDeath() {
        this.lives--;
        this.events.emit('livesChanged', this.lives);

        if (this.lives <= 0) {
            // Game over
            this.time.delayedCall(1000, () => {
                this.scene.stop('UIScene');
                this.scene.start('GameOverScene', { score: this.score });
            });
        } else {
            // Respawn
            this.time.delayedCall(1000, () => {
                this.player.respawn(100, 400);
                this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);

                // Reset boss if in boss fight
                if (this.bossSpawned && this.boss) {
                    this.boss.destroy();
                    this.boss = null;
                    this.bossSpawned = false;
                }
            });
        }
    }

    showPowerUpMessage(message) {
        const text = this.add.text(
            this.cameras.main.scrollX + 400,
            200,
            message,
            {
                fontFamily: 'Arial Black',
                fontSize: '36px',
                fill: '#FFD700',
                stroke: '#000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setScrollFactor(0).setDepth(100);

        this.tweens.add({
            targets: text,
            y: 150,
            alpha: 0,
            scale: 1.5,
            duration: 1500,
            onComplete: () => text.destroy()
        });
    }

    showMoonTokenEffect() {
        // Special rainbow flash effect
        this.cameras.main.flash(500, 255, 215, 0);
        this.showPowerUpMessage('MOON TOKEN!');
    }

    bossDefeated() {
        this.levelComplete = true;

        // Victory sequence
        this.showPowerUpMessage('VICTORY!');

        this.time.delayedCall(2000, () => {
            this.scene.stop('UIScene');
            this.scene.start('VictoryScene', {
                score: this.score,
                satoshis: this.satoshisCollected
            });
        });
    }

    shutdown() {
        // Clean up
        this.events.off('playerDied');
    }
}
