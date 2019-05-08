export class EndScene extends Phaser.Scene {

    constructor() {
        super({key: "EndScene"})
    }

    init(): void {
    }

    preload(): void {
    }

    create(): void {
        this.add.image(0, 0, 'bg').setOrigin(0, 0)

        this.animateText()

        this.input.once('pointerdown', (pointer) => {
             this.scene.start('GameScene')
        })
    }

    private animateText(){
        this.add.text(400, 300, 'GAME OVER', { fontFamily: 'Arial Black', fontSize: 60, color: '#2ac9be' }).setOrigin(0.5).setStroke('#7df2ea', 16)
        let start = this.add.text(400, 400, 'PLAY AGAIN', { fontFamily: 'Arial Black', fontSize: 30, color: '#ff3434' }).setOrigin(0.5).setStroke('#7df2ea', 9)
        this.tweens.add({
            targets: start,
            alpha: 0.8,
            scaleX: 1.2,
            scaleY: 1.2,
            ease: 'Cubic.easeInOut',
            duration: 650,
            yoyo: true,
            repeat: -1
        })
    }
}
