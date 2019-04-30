export class UIScene extends Phaser.Scene {

    private scoreField: Phaser.GameObjects.Text
    private graphics: Phaser.GameObjects.Graphics

    constructor(key:string) {
        super(key)
    }

    create() {
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xFFFFFF }, fillStyle: { color: 0x00AA00 } })
        this.scoreField = this.add.text(660, 20, 'Score : 0', { fontFamily: 'Arial Black', fontSize: 18, color: '#FFF' })
    }

    update(){
        this.scoreField.text = 'Score : ' + this.registry.values.score
        this.graphics.clear()
        this.graphics.fillRectShape(new Phaser.Geom.Rectangle(20, 20, this.registry.values.life, 20))
        this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(20, 20, 200, 20))
    }
}