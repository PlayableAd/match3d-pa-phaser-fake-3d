var background, deadzone1, deadzone2, plate;
var width = window.innerWidth, height = window.innerHeight;
var scaleDeadzoneSize = 1.5;
class Scene1PlayGame extends Phaser.Scene {
    constructor() {
        super({ key: "Scene1PlayGame" });
    }
    preload() {
        this.load.json('shapes', physicsLine);
    }
    create() {
        this.matter.world.setBounds(0, 0, width, height);
        var shapes = this.cache.json.get('shapes');

        background = this.add.image(0, 0, KEY_BACKGROUND).setOrigin(0);
        deadzone1 = this.add.image(0, 0, KEY_DEADZONE).setScale(scaleDeadzoneSize).setInteractive();
        deadzone1.setPosition((width / 2 - deadzone1.width / scaleDeadzoneSize), 3 / 4 * height);
        deadzone2 = this.add.image(0, 0, KEY_DEADZONE).setScale(scaleDeadzoneSize).setInteractive();
        deadzone2.setPosition(deadzone1.x + deadzone1.width * scaleDeadzoneSize, 3 / 4 * height)

        this.object = this.matter.add.sprite(100, 50, KEY_STAR, 0, { shape: shapes.Icon_Star }).setDepth(2).setInteractive();
        this.input.setDraggable(this.object);
        this.shadow = this.add.sprite(200 - 20, 50 - 20, KEY_STAR).setOrigin(0.5).setDepth(1).setScale();
        this.shadow.tint = 0x999999;
        this.shadow.alpha = 0.3;

        deadzone1.on('pointerover', function () {
            console.log('deadzone1 hover');
        });
        deadzone2.on('pointerover', function () {
            console.log('deadzone2 hover');
        });
        this.input.on('dragstart', function (pointer) {
            this.scene.object.setCollisionCategory(null);
            this.scene.tweens.add({
                targets: [this.scene.object, this.scene.shadow],
                scaleX: '1.2',
                scaleY: '1.2',
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
        }).on('dragend', function (pointer) {
            this.scene.object.setCollisionCategory(1);
            this.scene.tweens.add({
                targets: [this.scene.object, this.scene.shadow],
                scaleX: '1',
                scaleY: '1',
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
        });
        let this2 = this
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this2.handleDeadZone(pointer)
        });
        this.resize();

        this.scale.on("resize", this.resize, this);
    }
    handleDeadZone(pointer) {
        console.log((deadzone1.y + (deadzone1.height / 2)));
        console.log((deadzone2.y - (deadzone2.height / 2)));
        if (pointer.y <= (deadzone1.y + (deadzone1.height / 2)) && pointer.y >= (deadzone2.y - (deadzone2.height / 2))) {
            console.log("touch");
        }
    }
    resize(gameSize) {
        width = gameSize?.width || window.innerWidth;
        height = gameSize?.height || window.innerHeight;
        this.matter.world.setBounds(0, 0, width, height);
        background.displayWidth = width
        background.displayHeight = height;
        // plate.displayWidth = width;
        // plate.displayHeight = 3/4*height;
        deadzone1.setPosition((width / 2 - deadzone1.width / scaleDeadzoneSize), 3 / 4 * height);
        deadzone2.setPosition(deadzone1.x + deadzone1.width * scaleDeadzoneSize, 3 / 4 * height)
        // deadzone2.setPosition(deadzone1.x + deadzone1.width / 2, 3 / 4 * height)


    }

    handleLoseFocus() {
        if (this.scene.isActive("paused")) {
            return;
        }
        Sounds["bgSound"].pause();

        this.scene.run("paused", {
            onResume: () => {
                this.scene.stop("paused");
                Sounds["bgSound"].resume();
            },
        });
    }

    playSound(name) {
        Sounds[name].currentTime = 0;
        Sounds[name].play();
    }

    getPropertiesObject(objectData, varTexture, defaultValue = null) {
        var data;
        for (var properties of objectData) {
            data = properties;
            for (var key in varTexture) {
                if (properties[key] !== varTexture[key]) {
                    data = null;
                }
            }
            if (data === null) continue;
            else break;
        }
        if (data === null) return defaultValue;
        else return data;
    }

    update() {
        this.shadow.x = this.object.x - 20;
        this.shadow.y = this.object.y - 20;
    }
}
function gameClose() { }
