import { Player } from "../objects/player"
import { Bomb } from "../objects/bomb"
import { Platform } from "../objects/platform"
import { MovingPlatform } from "../objects/movingplatform"
import { UIScene } from "./ui-scene";

export class GameScene extends Phaser.Scene {

    private player : Player
    private platforms: Phaser.GameObjects.Group
    private bombs: Phaser.GameObjects.Group
    private stars: Phaser.Physics.Arcade.Group

    constructor() {
        super({ key: "GameScene" })
    }

    init(): void {
        this.registry.set("score", 0)
        this.registry.set("life", 200)

        this.physics.world.bounds.width = 1600
        this.physics.world.bounds.height = 600

        // add the ui as a separate scene so the game-scene camera has no effect on it
        this.scene.add("UIScene", new UIScene("UIScene"), true)
    }

    create(): void {
        this.add.image(0, 0, 'sky').setOrigin(0, 0)
        
        this.platforms = this.add.group({ runChildUpdate: true })
        this.platforms.addMultiple([
            new Platform(this, 800, 574, "ground"),
            new Platform(this, 50, 250, "platform"),
            new Platform(this, 110, 410, "platform"),
            new Platform(this, 700, 260, "ice"),
            new MovingPlatform(this, 450, 410, "platform")
        ], true)
    
        // stars group heeft alleen plaatjes. physics group zorgt dat ze vallen...?
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 30, stepX: 70 },
        })

        // bombs
        this.bombs = this.add.group()
        this.bombs.add(new Bomb(this, 100, 16), true)

        // player
        this.player = new Player(this)
        
        // define collisions for bouncing, and overlaps for pickups
        this.physics.add.collider(this.stars, this.platforms)
        this.physics.add.collider(this.bombs, this.platforms)
        this.physics.add.collider(this.player, this.platforms)
        
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this)
        this.physics.add.overlap(this.player, this.bombs, this.hitBomb, null, this)
    
        // camera
        this.cameras.main.setSize(800, 600)          // canvas size
        this.cameras.main.setBounds(0, 0, 1600, 600) // world size
        this.cameras.main.startFollow(this.player)
    }

    private collectStar(player : Player , star) : void {
        this.stars.remove(star, true, true)
        this.registry.values.score++
    }

    private hitBomb(player : Player, bomb) : void {
        this.bombs.remove(bomb, true, true)
        this.registry.values.life -= 15
        this.scene.remove("UIScene")
        this.scene.start('EndScene')
    }

    update(){
        this.player.update()
    }

}
