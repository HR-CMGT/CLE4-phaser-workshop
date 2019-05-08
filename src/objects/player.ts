export class Player extends Phaser.Physics.Arcade.Sprite {

    private cursors: Phaser.Input.Keyboard.CursorKeys

    constructor(scene) {
        super(scene, 100, 450, "bmo")

        this.cursors = this.scene.input.keyboard.createCursorKeys()
        
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setSize(40, 56).setOffset(0,-1)
        this.setBounce(0.2)
        this.setCollideWorldBounds(true)
        this.setDragX(600)
        this.createAnimations()
    }

    private createAnimations(){
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('jake', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'jake', frame: 8 }],
            frameRate: 20
        })
        this.scene.anims.create({
            key: 'jump',
            frames: [{ key: 'jake', frame: 9 }],
            frameRate: 20
        })
    }

    public update(): void {
        if (this.cursors.left.isDown) {
            this.setVelocityX(-200)
            this.flipX = true
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(200)
            this.flipX = false
        } 

        // jump when the body is touching the floor
        let grounded = this.body.touching.down 
        if (this.cursors.up.isDown && grounded) {
            this.setVelocityY(-400)
        }

        // decide which sprite animation to play
        if (this.body.velocity.y > 2 || this.body.velocity.y < -4) {
            this.anims.play('jump', true)
        } else if (this.cursors.left.isDown) {
            this.anims.play('walk', true)
        } else if (this.cursors.right.isDown) {
            this.anims.play('walk', true)
        } else {
            this.anims.play('idle')
        }
    }
}
