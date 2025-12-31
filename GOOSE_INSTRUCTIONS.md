# Goose Agent Instructions - Apu To The Moon

## Mission

Build a complete 2D platformer game called "Apu To The Moon" using Phaser 3. The game is a Mario-style platformer with a crypto/meme coin theme.

**Reference Document**: Read `GAME_SPECIFICATION.md` for complete game design details.

---

## Project Setup

### Step 1: Initialize Project

```bash
mkdir apu-to-the-moon
cd apu-to-the-moon
npm init -y
npm install phaser
npm install --save-dev vite
```

### Step 2: Create package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 3: Create vite.config.js

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist'
  }
});
```

---

## Implementation Order

### Phase 1: Core Setup (Priority: CRITICAL)

1. **Create index.html** - Basic HTML with game container
2. **Create src/main.js** - Phaser game initialization
3. **Create src/config.js** - Game configuration (800x600, arcade physics)
4. **Create src/scenes/BootScene.js** - Loading screen
5. **Create src/scenes/PreloadScene.js** - Asset preloader

### Phase 2: Player Mechanics (Priority: HIGH)

1. **Create src/entities/Player.js**
   - Sprite with physics body
   - Keyboard controls (arrows + WASD + space)
   - Animations: idle, walk_left, walk_right, jump, fall
   - Jump only when touching ground
   - Settings: speed=200, jumpForce=-400, bounce=0.1

2. **Create src/scenes/GameScene.js**
   - Load player
   - Create test platforms (simple rectangles for now)
   - Camera follow player
   - World bounds

### Phase 3: Collectibles (Priority: HIGH)

1. **Create src/entities/Collectible.js**
   - Satoshi class: golden coin, +100 points
   - Shitcoin class: gray coin, +10 points
   - Floating animation
   - Collision detection with player
   - Destroy on collect + play sound

2. **Update GameScene.js**
   - Spawn collectibles in level
   - Score tracking
   - Display score in HUD

### Phase 4: Enemies (Priority: HIGH)

1. **Create src/entities/Enemy.js**
   - Bear class
   - Patrol AI: walk between two points
   - Player collision:
     - If player above → kill bear (+50 points)
     - If player side/below → player dies

2. **Update GameScene.js**
   - Spawn bears in level
   - Handle player death/respawn

### Phase 5: Power-ups (Priority: MEDIUM)

1. **Create src/entities/PowerUp.js**
   - Bull class
   - When touched: player mounts bull
   - Effects: invincibility, 2x speed, 10 seconds duration
   - Visual: golden aura around player

### Phase 6: Level Design (Priority: HIGH)

1. **Create actual level layout**
   - Use Phaser tilemap or procedural platforms
   - 5 sections as specified in GAME_SPECIFICATION.md
   - Place collectibles strategically
   - Place enemies with patrol paths
   - Add secret area with Moon Token

### Phase 7: Boss (Priority: MEDIUM)

1. **Create src/entities/Boss.js**
   - Mega Bear: 96x96 size
   - 3 attack phases
   - 5 HP (hits on head)
   - Victory trigger when defeated

### Phase 8: UI/Menus (Priority: MEDIUM)

1. **Create src/scenes/MenuScene.js** - Title screen with Start button
2. **Create src/scenes/UIScene.js** - HUD overlay (lives, score, BTC count)
3. **Create src/scenes/PauseScene.js** - Pause menu
4. **Create src/scenes/GameOverScene.js** - Game over + retry
5. **Create src/scenes/VictoryScene.js** - Victory screen

### Phase 9: Audio (Priority: LOW)

1. **Create src/utils/AudioManager.js**
   - Background music management
   - Sound effects trigger
2. **Add placeholder sounds** using BFXR or free sources

### Phase 10: Polish (Priority: LOW)

1. Touch controls for mobile
2. Telegram Mini Apps SDK integration
3. Performance optimization
4. Final testing

---

## Technical Specifications

### Phaser Config
```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // Set true during development
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, PreloadScene, MenuScene, GameScene, UIScene, PauseScene, GameOverScene, VictoryScene]
};
```

### Player Physics
```javascript
// In Player.js
this.speed = 200;
this.jumpForce = -400;
this.sprite.setBounce(0.1);
this.sprite.setCollideWorldBounds(true);
```

### Enemy Patrol AI
```javascript
// In Enemy.js
update() {
    if (this.sprite.x <= this.leftBound) {
        this.direction = 1;
    } else if (this.sprite.x >= this.rightBound) {
        this.direction = -1;
    }
    this.sprite.setVelocityX(this.speed * this.direction);
}
```

### Collision Detection for Stomp
```javascript
// In GameScene.js
this.physics.add.overlap(player, enemies, (player, enemy) => {
    if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
        // Player stomped enemy
        enemy.die();
        player.bounce();
    } else {
        // Enemy hit player
        player.die();
    }
});
```

---

## Placeholder Assets

Until real pixel art is created, use these placeholders:

### Colored Rectangles
- Player (Apu): Green rectangle 32x32
- Bear: Red rectangle 32x32
- Mega Bear: Dark red rectangle 96x96
- Bull: Green rectangle 48x32
- Satoshi: Yellow circle 16x16
- Shitcoin: Gray circle 16x16
- Platform: Brown rectangle variable width x 32

### Free Asset Sources
- https://opengameart.org/
- https://itch.io/game-assets/free
- https://kenney.nl/assets

### Sound Generation
- https://sfxr.me/ (BFXR web version)
- https://freesound.org/

---

## Testing Checklist

### Core Mechanics
- [ ] Player moves left/right
- [ ] Player jumps only when grounded
- [ ] Player collides with platforms
- [ ] Camera follows player

### Collectibles
- [ ] Satoshis can be collected
- [ ] Score increases correctly
- [ ] Collection sound plays

### Enemies
- [ ] Bears patrol correctly
- [ ] Stomping bears kills them
- [ ] Side contact kills player
- [ ] Player respawns after death

### Power-ups
- [ ] Bull can be mounted
- [ ] Invincibility works
- [ ] Speed boost works
- [ ] Effect ends after 10s

### Boss
- [ ] Boss has 3 phases
- [ ] Boss takes damage from stomps
- [ ] Victory triggers after boss death

### UI
- [ ] Menu works
- [ ] HUD displays correctly
- [ ] Pause works
- [ ] Game over shows score

---

## File Creation Order

Execute in this exact order:

1. `index.html`
2. `package.json`
3. `vite.config.js`
4. `src/config.js`
5. `src/main.js`
6. `src/scenes/BootScene.js`
7. `src/scenes/PreloadScene.js`
8. `src/scenes/MenuScene.js`
9. `src/scenes/GameScene.js`
10. `src/entities/Player.js`
11. `src/entities/Collectible.js`
12. `src/entities/Enemy.js`
13. `src/entities/PowerUp.js`
14. `src/entities/Boss.js`
15. `src/scenes/UIScene.js`
16. `src/scenes/PauseScene.js`
17. `src/scenes/GameOverScene.js`
18. `src/scenes/VictoryScene.js`
19. `src/utils/Controls.js`
20. `src/utils/AudioManager.js`

---

## Success Criteria

The MVP is complete when:
1. Player can complete Level 1 from start to finish
2. All collectibles work
3. All enemies work
4. Boss fight works
5. Score system works
6. Game over and victory screens work
7. Game runs smoothly in browser at 60 FPS
8. Touch controls work for mobile

---

## Notes for Goose

- **Start simple**: Get basic movement working before adding complexity
- **Test frequently**: Run `npm run dev` after each major change
- **Use debug mode**: Set `arcade.debug: true` to see physics bodies
- **Commit often**: Save progress after each phase
- **Ask for help**: If stuck on a specific feature, break it into smaller steps

Good luck! Build an awesome game!
