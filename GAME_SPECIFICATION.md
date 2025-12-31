# APU TO THE MOON - Game Design Document

## Overview

**Title**: Apu To The Moon
**Genre**: 2D Platformer (Mario Bros style)
**Theme**: Crypto / Meme Coins / Trading
**Platform**: Web Browser + Telegram Mini Apps
**Framework**: Phaser 3
**Visual Style**: 16-bit Pixel Art

---

## Game Concept

Apu, Pepe's adorable little brother, embarks on an epic mission to the Moon. His goal: collect as many Satoshis as possible while avoiding the Bears who want to crash his portfolio. By riding Bulls during bullish phases, Apu can become temporarily invincible!

**Tagline**: *"Apu believes. Do you?"*

---

## Characters

### Hero: Apu
- **Description**: Green frog meme style, younger and cuter version of Pepe
- **Appearance**: 32x32 pixels, big innocent eyes, determined expression
- **Animations**:
  - Idle
  - Walk left/right
  - Jump
  - Fall
  - Victory
  - Death
  - Riding Bull

### Enemies

#### Bear
- **Description**: Red bear representing the bear market
- **Behavior**: Horizontal patrol between two points
- **Size**: 32x32 pixels
- **Defeat**: Jump on its head (Mario style)
- **Points**: +50 per eliminated bear

#### Mega Bear (Boss)
- **Description**: Giant red bear with glowing eyes
- **Size**: 96x96 pixels
- **Behavior**:
  - Phase 1: Horizontal charge
  - Phase 2: Jumps and creates shockwave
  - Phase 3: Summons mini-bears
- **Health**: 5 hits on the head
- **Points**: +1000

### Allies

#### Bull
- **Description**: Green bull representing the bull market
- **Function**: Rideable power-up
- **Effect**: Invincibility + 2x speed for 10 seconds
- **Appearance**: Golden aura when active

---

## Collectibles

### Satoshi (BTC)
- **Appearance**: Golden coin with Bitcoin logo
- **Size**: 16x16 pixels
- **Points**: +100
- **Animation**: Rotation + slight floating
- **Sound**: Satisfying "cha-ching"

### Shitcoin
- **Appearance**: Gray/dull coin with "?"
- **Size**: 16x16 pixels
- **Points**: +10 only
- **Optional effect**: Slight confusion (inverted controls for 2 sec)

### Secret Moon Token
- **Appearance**: Rainbow hidden coin
- **Points**: +500
- **Location**: Secret areas only

---

## Game Mechanics

### Controls
| Action | Keyboard | Mobile/Touch |
|--------|----------|--------------|
| Left | ← or A | Left joystick |
| Right | → or D | Right joystick |
| Jump | ↑ or W or SPACE | Jump button |
| Pause | ESC or P | Pause button |

### Physics
- **Gravity**: 300 (Phaser units)
- **Walk speed**: 200 px/s
- **Run speed (Bull)**: 400 px/s
- **Jump force**: -400 (Y velocity)
- **Bounce**: 0.1

### Lives System
- Apu starts with 3 lives
- Life lost: enemy contact or falling into void
- Extra life: collect 100 Satoshis

### Score System
```
Score = Satoshis × 100 + Shitcoins × 10 + Bears × 50 + Boss × 1000 + Time bonus
```

---

## Level Design - Level 1: "Launch Pad"

### Level Structure
```
Length: 4000 pixels (5 screens)
Height: 600 pixels
Estimated duration: 2-3 minutes
```

### Sections

#### Section 1: Tutorial Zone (0-800px)
- Simple platforms to learn controls
- 5 easy-to-collect Satoshis
- 1 slow Bear as first enemy
- Decorative "HODL!" sign

#### Section 2: Rising Market (800-1600px)
- Ascending platforms
- First technical jumps
- 10 Satoshis
- 2 Bears
- First Bull power-up

#### Section 3: Volatility Zone (1600-2400px)
- Moving platforms (up/down)
- Mix of Satoshis and Shitcoins
- 3 Bears
- Hidden secret area with Moon Token

#### Section 4: Bear Territory (2400-3200px)
- Increased enemy density
- 4 Bears in varied patterns
- More spaced platforms
- 8 Satoshis

#### Section 5: Final Push (3200-4000px)
- Race to boss arena
- Last Bull power-up before boss
- Mega Bear Arena
- Victory rocket at the end

### Visual Environment
- **Background Layer 1**: Twinkling stars (slow parallax)
- **Background Layer 2**: Distant planets, visible Earth
- **Background Layer 3**: Colorful nebulas
- **Foreground**: Metallic space station style platforms
- **Decorations**: Rockets, satellites, "TO THE MOON" signs, trading charts

---

## User Interface (UI)

### HUD (Heads-Up Display)
```
┌─────────────────────────────────────────────┐
│ [APU x3]          SCORE: 00000    [BTC] 000 │
│                                              │
│                                              │
│                                              │
│                    [GAME AREA]               │
│                                              │
│                                              │
│                                              │
└─────────────────────────────────────────────┘
```

### Screens
1. **Title Screen**: "APU TO THE MOON" logo + Press Start
2. **Game Over**: Final score + Retry/Menu
3. **Victory**: Apu on the Moon animation + Score
4. **Pause**: Resume/Restart/Menu

---

## Audio

### Music
- **Menu**: Calm chiptune, space ambiance
- **Level**: Energetic chiptune, motivating rhythm
- **Boss**: Intense chiptune, dramatic tension
- **Victory**: Triumphant fanfare

### Sound Effects
- Jump: Short "boing"
- Collect Satoshi: Satisfying "cha-ching"
- Collect Shitcoin: Disappointing "blop"
- Enemy death: Comic "pop"
- Player death: Sad "womp womp"
- Bull power-up: "moo" + acceleration sound
- Boss hit: Heavy impact

---

## Technical Architecture

### File Structure
```
apu-to-the-moon/
├── index.html
├── package.json
├── src/
│   ├── main.js              # Phaser entry point
│   ├── config.js            # Game configuration
│   ├── scenes/
│   │   ├── BootScene.js     # Initial loading
│   │   ├── PreloadScene.js  # Asset loading
│   │   ├── MenuScene.js     # Main menu
│   │   ├── GameScene.js     # Main game
│   │   ├── UIScene.js       # HUD overlay
│   │   ├── PauseScene.js    # Pause menu
│   │   └── GameOverScene.js # End screen
│   ├── entities/
│   │   ├── Player.js        # Apu class
│   │   ├── Enemy.js         # Bear class
│   │   ├── Boss.js          # Mega Bear class
│   │   ├── Collectible.js   # Satoshi/Shitcoin
│   │   └── PowerUp.js       # Bull
│   └── utils/
│       ├── Controls.js      # Input management
│       └── AudioManager.js  # Sound management
├── assets/
│   ├── images/
│   │   ├── sprites/         # Character spritesheets
│   │   ├── tiles/           # Platform tilesets
│   │   ├── backgrounds/     # Parallax backgrounds
│   │   └── ui/              # Interface elements
│   ├── audio/
│   │   ├── music/           # Music tracks
│   │   └── sfx/             # Sound effects
│   └── tilemaps/
│       └── level1.json      # Tiled map
└── dist/                    # Production build
```

### Phaser Configuration
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
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, PreloadScene, MenuScene, GameScene, UIScene, PauseScene, GameOverScene]
};
```

### Telegram Mini Apps Compatibility
- Responsive design (FIT mode)
- Touch controls with virtual joystick
- Telegram WebApp SDK integration
- Safe area handling for notch/navigation

---

## Assets to Create

### Sprites (16-bit Pixel Art)
- [ ] Apu spritesheet (idle, walk, jump, fall, death, victory) - 6 animations
- [ ] Bear spritesheet (walk, death) - 2 animations
- [ ] Mega Bear spritesheet (idle, charge, jump, summon, death) - 5 animations
- [ ] Bull spritesheet (idle, run) - 2 animations
- [ ] Satoshi coin (rotation) - 1 animation
- [ ] Shitcoin (rotation) - 1 animation
- [ ] Moon Token (sparkle) - 1 animation

### Tilesets
- [ ] Space platforms (floor, corners, variations)
- [ ] Decorations (rockets, satellites, signs)

### Backgrounds
- [ ] Stars (parallax layer 1)
- [ ] Planets/Earth (parallax layer 2)
- [ ] Nebulas (parallax layer 3)

### UI
- [ ] Title logo
- [ ] Buttons (Start, Retry, Menu)
- [ ] HUD icons (life, BTC)
- [ ] Mobile virtual joystick

### Audio
- [ ] 3 music tracks (menu, level, boss)
- [ ] ~10 sound effects

---

## MVP Roadmap

### Phase 1: Core Mechanics
1. Setup Phaser 3 project
2. Basic player movement
3. Physics and collisions
4. Camera system

### Phase 2: Gameplay
1. Collectibles (Satoshi)
2. Enemies (Bear) with patrol AI
3. Life and score system
4. Bull power-up

### Phase 3: Level Design
1. Create level 1 tilemap
2. Place enemies and collectibles
3. Secret areas
4. Mega Bear boss

### Phase 4: Polish
1. Complete UI/HUD
2. Audio integration
3. Menu/gameover/victory screens
4. Animations and juice

### Phase 5: Deployment
1. Optimized build
2. Browser testing
3. Telegram Mini Apps integration
4. Publication

---

## Implementation Notes

### Priorities
1. **Gameplay first**: The game must be fun before being pretty
2. **Placeholder assets**: Use colored rectangles initially
3. **Rapid iteration**: Test often, adjust parameters

### Key Points
- Jump physics must feel "satisfying" (adjust gravity/jump force)
- Timing to kill Bears must be precise but not frustrating
- Bull power-up must give a feeling of power

### Placeholder Resources
- OpenGameArt.org for temporary assets
- BFXR/SFXR for placeholder sounds
- Piskel for quick sprite creation

---

## Crypto Glossary (for consistency)

| Term | Meaning | In-game Usage |
|------|---------|---------------|
| Satoshi | Smallest Bitcoin unit | Main collectible |
| HODL | Hold On for Dear Life | Decoration/message |
| Bear | Bear market | Enemies |
| Bull | Bull market | Ally/Power-up |
| To The Moon | Price skyrocketing | Level theme |
| Rug Pull | Crypto scam | Potential trap |
| Whale | Large investor | Future alt boss |
| FOMO | Fear Of Missing Out | UI message |
| Diamond Hands | Never sell | Future achievement |

---

*Document created for the Apu To The Moon project*
*Version 1.0 - MVP Specification*
