import { Player } from "../objects/player"
import { Platform } from "../objects/platform"
import { MovingPlatform } from "../objects/movingplatform"

export class GameScene extends Phaser.Scene {

    private player : Player
    private platforms: Phaser.GameObjects.Group
    private stars: Phaser.Physics.Arcade.Group

    constructor() {
        super({ key: "GameScene" })
    }

    init(): void {

    }

    create(): void {
        this.add.image(0, 0, 'sky').setOrigin(0, 0)      
    
        // 11 STARS
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 30, stepX: 70 },
        })

        // TODO add player
        this.player = new Player(this)

        //this.platforms = this.add.group({ runChildUpdate: true })
        //this.platforms.addMultiple([], true)
        
        // define collisions for bouncing, and overlaps for pickups
        // this.physics.add.collider(this.stars, this.platforms)
        // this.physics.add.collider(this.player, this.platforms)
        
        // this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
    }

    private collectStar(player : Player , star) : void {
        this.stars.remove(star, true, true)
        this.registry.values.score++

        // TO DO check if we have all the stars, then go to the end scene
    
    }

    update(){
        this.player.update()
    }

}
