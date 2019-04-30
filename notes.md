# Workshop notes

## Spritesheet animation

Load an image that has multiple frames, and specify the frame size
```typescript
preload() {
    this.load.spritesheet('dude', require('assets/dude.png'), { frameWidth: 32, frameHeight: 48 })
}
```

Add the sprite to the scene, and then create *animation states*, specify a set of frames and a speed for each direction of movement.
```typescript
create() {
    player = this.physics.add.sprite(100, 450, 'dude');
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    })
}
```

Now, you can play the different animations when you want, for example when the cursor keys are pressed
```typescript
function update () {
    if (cursors.left.isDown) {
        player.setVelocityX(-160)
        player.anims.play('left', true)
    } else if (cursors.right.isDown) {
        player.setVelocityX(160)
        player.anims.play('right', true)
    } else {
        player.setVelocityX(0)
        player.anims.play('idle')
    }
}
```

## Get game size

```typescript
this.game.config.width + "," + this.game.config.height

// this.sys.canvas.height uses pixelAspectRatio, so may be bigger than game height
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
```

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
## Collision without physics

Without physics, you can still check if two objects overlap. You can check the bounding boxes with the intersects function:

```typescript
if (Phaser.Geom.Intersects.RectangleToRectangle(this.enemy.getBounds(), this.ship.getBounds())) {
    console.log("ship hit an enemy!")
}
```

## Notes on groups

- Game Objects created by `Phaser.Physics.Arcade.StaticGroup.create()` will automatically be given static Arcade Physics bodies.
- Game Objects created by `Phaser.Physics.Arcade.Group.create()` will automatically be given dynamic Arcade Physics bodies.

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

// adding multiple existing sprite classes to a group
// this way you can have more complicated sprite code in the sprite class instead of in the scene class
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

## Scrolling background

When using a tiled image, we can scroll it indefinitely.
```typescript
this.bgtile = this.add.tileSprite(0, 0, 800, 600, 'bg')
this.bgtile.setOrigin(0,0)

// scroll the background - place in the update function
this.bgtile.tilePositionX += 3
```

## Multiple scenes at once

When the camera follows the player, we need the HUD to stay in the same place. We can create a separate HUD scene for this and add this on top of the active scene.

```typescript
export class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: "GameScene" })
    }

    init() {
        this.scene.add("UIScene", new UIScene("UIScene"), true)
    }

    hitBomb() {
        this.scene.remove("UIScene")
        this.scene.start('EndScene')
    }
}
```

example of HUD scene on top of regular scene 
https://labs.phaser.io/edit.html?src=src%5Cscenes%5Cui%20scene%20es6.js

dev log about scenes
https://phaser.io/phaser3/devlog/121

## Events

To transfer data between scenes, we can use Events and EventListeners. [Example](https://labs.phaser.io/edit.html?src=src%5Cscenes%5Cui%20scene%20es6.js)

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

all settings
https://photonstorm.github.io/phaser3-docs/Phaser.Core.Config.html

arcade physics settings
https://photonstorm.github.io/phaser3-docs/global.html#PhysicsConfig