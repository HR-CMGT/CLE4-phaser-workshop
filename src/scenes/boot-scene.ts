export class BootScene extends Phaser.Scene {

    private graphics: Phaser.GameObjects.Graphics

    constructor() {
        super({ key: "BootScene" })
    }

    init(){
        //
    }

    preload(): void {
        this.load.image('sky', require('../assets/background.png'))
        this.load.image('star', require('../assets/star.png'))
        this.load.image('bomb', require('../assets/bomb.png'))
        this.load.image('bmo', require('../assets/bmo.png'))
        this.load.image('ice', require('../assets/platform_ice.png'))
        this.load.image('platform', require('../assets/platform_grass.png'))
        this.load.image('ground', require('../assets/platform_ground.png'))

        this.add.text(400, 300, 'BMO CAN JUMP?', { fontFamily: 'Arial Black', fontSize: 70, color: '#2ac9be' }).setOrigin(0.5).setStroke('#7df2ea', 16)
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xFFFFFF }, fillStyle: { color: 0xCCCCCC } })

        this.load.on('progress', (value: number) => {
            this.graphics.clear()
            this.graphics.fillRectShape(new Phaser.Geom.Rectangle(200, 500, 400 * value, 20))
            this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(200, 500, 400, 20))
        })

        this.load.on('complete', () => {
            this.scene.start('StartScene')
        })
    }
}