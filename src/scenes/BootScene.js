import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load minimal assets for loading screen
        this.load.on('complete', () => {
            this.scene.start('PreloadScene');
        });
    }

    create() {
        // Set up game settings
        this.scale.refresh();

        // Go to preload scene
        this.scene.start('PreloadScene');
    }
}
