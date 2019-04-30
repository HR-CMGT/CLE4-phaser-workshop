export class Bomb extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y) {
        super(scene, x, y, "bomb")

        this.scene.physics.add.existing(this)

        this.setBounce(0.6)
        this.setCollideWorldBounds(true)

        this.setVelocity(Phaser.Math.Between(-200, 200), 30);
        this.setAngularVelocity(30);
    }
}
