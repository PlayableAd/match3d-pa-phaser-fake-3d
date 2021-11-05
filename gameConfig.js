var game;

var config = {
    type: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? Phaser.CANVAS : Phaser.AUTO,
    backgroundColor: "black",
    physics: {
        default: "matter",
        matter: {
            gravity: { x: 0, y: 1 },
            debug: true,
        },
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Preload, Scene1PlayGame],
    audio: {
        disableWebAudio: true,
    },
    input: {
        activePointers: 3,
    },
    roundPixels: false,
    pixelArt: true,
};
game = new Phaser.Game(config);

