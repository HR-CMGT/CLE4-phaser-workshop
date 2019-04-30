export class MovingPlatform extends Phaser.Physics.Arcade.Sprite {

    private startPosition:number

    constructor(scene, x: number, y: number, texture:string, friction:number = 1) {
        super(scene, x, y, texture)

        this.scene.physics.add.existing(this)
        
        let body = this.body as Phaser.Physics.Arcade.Body
        body.setAllowGravity(false)
        this.setGravity(0) 
        this.setImmovable(true)

        // moving platform
        this.setVelocityX(30)

        // friction 0 to 1 (ice has low friction) // no effect?
        // this.setFrictionX(friction)

        this.startPosition = x
    }

    public update(): void {

        if (this.x>= this.startPosition + 150) {
            this.setVelocityX(-50)
        }
        else if (this.x <= this.startPosition - 150) {
            this.setVelocityX(50)
        }
    }
}
