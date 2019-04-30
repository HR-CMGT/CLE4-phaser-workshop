import "phaser";
import { BootScene } from "./scenes/boot-scene"
import { StartScene } from "./scenes/start-scene"
import { GameScene } from "./scenes/game-scene"
import { EndScene } from "./scenes/end-scene"

const config: GameConfig = {
    width: 800,
    height: 600,
    parent: "game",
    resolution: window.devicePixelRatio,
    scene: [BootScene, StartScene, GameScene, EndScene],
    input: {
        keyboard: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false, 
            gravity: { y: 400 }
        }
    },
    render: { pixelArt: true }
};

export class Game extends Phaser.Game {
    constructor(config: GameConfig) {
        super(config)
    }
}

window.addEventListener("load", () => new Game(config))

