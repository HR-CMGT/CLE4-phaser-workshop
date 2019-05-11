# Workshop notes

## Connecting a gamepad

You can connect a PS4 or XBox gamepad via USB and [read the controller input](https://github.com/HR-CMGT/arcade-game)

## Sprite size and hitbox

Enable debug in `app.ts` to show hitboxes.

```
arcade: {
    debug: true
}
```
A sprite can scale and have a hitbox that is different from the sprite size. 

```typescript
export class Bomb extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x,y) {
        // show sprite twice as big as the image
        this.setScale(2)

        // set the size and the offset of the hitbox in pixels
        this.setSize(100,100)
        this.setOffset(10,10)
    }
}
```

## Scrolling background

A `tileSprite` gets repeated, when the size is larger than the loaded image. By updating the tile position, the image can scroll indefinitely. Note that tile sprites images need to be square and have a size of 8x8 pixels, or a power thereof (16x16, 32x32, etc.)
```typescript
create(){
    this.bgtile = this.add.tileSprite(0, 0, 1800, 600, 'background')
    this.bgtile.setOrigin(0,0)
}
update() {
    this.bgtile.tilePositionX += 3
}
```

## Spritesheet animation

In the `boot-scene` we load an image that has multiple frames, and specify the frame size
```typescript
preload() {
    this.load.spritesheet('jake', require('../assets/jake_animated.png'), { frameWidth: 37, frameHeight: 56 });
}
```

Then, in `player.ts` we create animations by using the frames from the image:
```typescript
export class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
        super(scene, 100, 450, "bmo")

        // an animation with 8 frames
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('jake', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        })
        // idle and jump only use 1 frame
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
}
```
Finally, we can play these animations whenever we want, in this case we trigger them when pressing the cursor keys:
```typescript
export class Player extends Phaser.Physics.Arcade.Sprite {

    public update(): void {
        // if the player has vertical velocity, show the falling animation
        // else, show the walking animation when the cursor keys are pressed
        // else, show the idle animation
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
```
## Get game size

```typescript
console.log(this.game.config.width + "," + this.game.config.height)
```

## Tweens

A tween is used to animate non-physics objects, such as background items and menu items. Tweens don't work well with physics bodies, because a tween overwrites x and y positions.

```typescript
let go: Phaser.GameObjects.Text = this.add.text(400, 420, 'CLICK TO PLAY AGAIN ', { fontFamily: 'Arial', fontSize: 22, color: '#ff3434' }).setOrigin(0.5)

this.tweens.add({
    targets: go,
    alpha: 0.8,
    scaleX: 1.2,
    scaleY: 1.2,
    ease: 'Cubic.easeInOut',
    duration: 650,
    yoyo:true,
    repeat:-1
})
```

## Particles

Use the particle system for super cool effects. This is a smoke trail that follows a bullet.

Take care to destroy the particle system when the parent object is destroyed. You can do that by adding an `onBeforeDestroy` listener.

```typescript
export class Bullet extends Phaser.Physics.Arcade.Sprite {

    private particles

    constructor(scene: Phaser.Scene, x:number, y:number) {
        super(scene, x, y, "bullet")       
        
        this.addParticles()
        this.on('destroy', this.onBeforeDestroy)
    }

    private addParticles() {
        this.particles = this.scene.add.particles('pixel')   // image used for particle

        let emitter = this.particles.createEmitter({
            lifespan: 200,
            speed: -100,
            tint: 0xFFFFFF,
            maxParticles: 25,
            scale: { start: 1, end: 0 },
            blendMode: 0  // blendmode 0 is normal, 1 will multiply the colors
        });

        emitter.startFollow(this)
    }

    private onBeforeDestroy() {
        this.particles.destroy();
    }
}

```

Particles [config](https://photonstorm.github.io/phaser3-docs/global.html#ParticleEmitterConfig) and [examples](http://labs.phaser.io/index.html?dir=game%20objects/particle%20emitter/)

## Collision

```typescript
// enable collision between objects or groups to cause objects to bounce off each other in the physics simulation 
this.physics.add.collider(this.ship, this.enemyGroup) 

// you can add a callback to execute your own code after a collision happens
this.physics.add.collider(this.ship, this.enemyGroup, callback, null, this) 

// use overlap instead of collision if you just want to know if objects hit each other, without causing a physics response.
this.physics.add.overlap(ship, enemy, callback, null, this)

callback(ship, enemy){
    console.log("ship hit an enemy!")
}
```

## Responding to collision

```typescript
onCollide(player, enemy) {
    // temporarily disable from the game, but keep object for later use
    enemy.disableBody(true, true)

    // just reset the enemy position, best for performance (create a resetPosition function on the enemy)
    enemy.resetPosition()

    // if the object was in a group, you can remove and destroy it in one line of code
    this.group.remove(enemy, true, true)

    // completely destroy
    enemy.destroy()

    // if you keep track of the enemy in your own array, remove it from there too
    this.enemies = this.enemies.filter(item => item !== enemy)
}
```

## Collision without physics

Without physics, you can still check if two objects overlap. You can check the bounding boxes with the intersects function:

```typescript
if (Phaser.Geom.Intersects.RectangleToRectangle(this.enemy.getBounds(), this.ship.getBounds())) {
    console.log("ship hit an enemy!")
}
```

## Notes on groups

Groups can be of different types:

```typescript
export class BootScene extends Phaser.Scene { 
    // a regular group
    private bombs: Phaser.GameObjects.Group
    // physics group members have dynamic Arcade Physics bodies
    private stars: Phaser.Physics.Arcade.Group
    // static physics group members have static Arcade Physics bodies -> no gravity or velocity
    private platforms: Phaser.Physics.Arcade.StaticGroup

    create(){
        this.bombs = this.add.group()
        this.stars = this.physics.add.group()
        this.platforms = this.physics.add.staticGroup()
    }
}
```
You can add sprites to groups using `add` or `create`. You can set properties for all group members using `setAll`

```typescript
// adding a sprite to a group
var sprite = this.add.sprite(400, 300, 'phaser');
group.add(sprite);

// this is a shortcut for the same code
group.create(400, 300, 'phaser');

//  extra properties when using group.create
var bomb = bombs.create(x, 16, 'bomb');
bomb.setBounce(1);
bomb.setCollideWorldBounds(true);
bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
bomb.setAngularVelocity(360);
bomb.allowGravity = false;

// adding properties to all items in a group
this.platforms = this.add.physicsGroup()
this.platforms.setAll('body.allowGravity', false)
this.platforms.setAll('body.immovable', true)
this.platforms.setAll('body.velocity.x', 100)
```
When your group members have lots of settings or code, you can create a class, and then add class instances to your groups. By setting runChildUpdate to true, the update function in your custom class will be called automatically.

```typescript
this.platforms = this.add.group({ runChildUpdate: true })
this.platforms.addMultiple([
    new Platform(this, 800, 574, "ground"),
    new Platform(this, 50, 250, "platform"),
    new Platform(this, 110, 410, "platform"),
    new Platform(this, 700, 260, "ice"),
    new MovingPlatform(this, 450, 410, "platform")
], true)
```

## Friction

Friction means how much (0 to 1) of a platform's velocity is transferred to an object riding it.
Drag causes velocity of a gameobject to drop down every frame (air resistance of the world).

```typescript
body.setFriction(1, 0)   // applies to touching gameobjects
body.setDrag(x, y)       // reduces own velocity
```

## Camera 
[Follow sprite example](http://labs.phaser.io/edit.html?src=src\camera\follow%20sprite.js)

```typescript
// viewport
this.cameras.main.setViewport(200, 150, 400, 300);

// main camera
this.cameras.main.setSize(400, 300);

// create extra camera
var camera1 = this.cameras.add(0, 0, 400, 300).setZoom(0.5);

// world bounds larger than screen
this.physics.world.bounds.width = 1600
this.physics.world.bounds.height = 600

// set camera bounds to follow the player, but stop at the edges
this.cameras.main.setBounds(0, 0, 1920, 1440);

// making the camera follow the player
this.cameras.main.startFollow(this.hero);

```

## Multiple scenes at once

When the camera follows the player, we need the UI to stay in the same place. We can create a separate UI scene for this and add this on top of the active scene. In this example you can see a UI added to the gamescene. Bear in mind that you need to remove the UI when you leave the scene. You have to add the scene to `app.ts`.

```typescript
export class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: "GameScene" })
    }

    init() {
        this.scene.add("UIScene", new UIScene("UIScene"), true)
    }

    gameOver() {
        this.scene.remove("UIScene")
        this.scene.start('EndScene')
    }
}

export class UIScene extends Phaser.Scene {

    private scoreField: Phaser.GameObjects.Text

    constructor(key:string) {
        super(key)
    }

    create() {
        this.scoreField = this.add.text(660, 20, 'Score : 0', { fontFamily: 'Arial Black', fontSize: 18, color: '#FFF' })
    }

    update(){
        this.scoreField.text = 'Score : ' + this.registry.values.score
    }
}
```

 - [example of HUD scene on top of regular scene](https://labs.phaser.io/edit.html?src=src%5Cscenes%5Cui%20scene%20es6.js)
- [dev log about scenes](https://phaser.io/phaser3/devlog/121)

## Events

To transfer data between objects (different scenes, or parent and child objects), we can use [Events and EventListeners](https://labs.phaser.io/edit.html?src=src%5Cscenes%5Cui%20scene%20es6.js)

```typescript
// game scene emits an event
class GameScene extends Phaser.Scene {
    hitBomb(){
        this.events.emit('addScore')
    }
}

// ui scene listens for score updates
class UIScene extends Phaser.Scene {
    create () {
        let ourGame = this.scene.get('GameScene')
        ourGame.events.on('addScore', () => {
            console.log("there was a score in the game scene!")
        })
    }
}
```

## Google fonts

You can load google fonts with some extra effort. See the [ruimtegruis boot scene](https://github.com/KokoDoko/ruimtegruis/blob/master/src/scenes/boot-scene.ts) for an example.

## Config file

 - [all settings](https://photonstorm.github.io/phaser3-docs/Phaser.Core.Config.html)
- [arcade physics settings](https://photonstorm.github.io/phaser3-docs/global.html#PhysicsConfig)
