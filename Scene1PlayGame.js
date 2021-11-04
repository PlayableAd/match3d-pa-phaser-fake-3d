var background, clock, timeLabel, deadzone1, deadzone2, plate;
var width = window.innerWidth, height = window.innerHeight;
var scaleDeadzoneSize = 1.5;
let halfHeightDeadZone, halfWidthDeadZone;
let moreBoundsDeadZone = 50;
let checkGroup;
let timeOut;
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
        clock = this.add.image(0, 0, KEY_CLOCK).setScale(0.7).setOrigin(0).setPosition(width / 2 - 100, 100);
        timeLabel = this.add.text(width / 2, 100, "59", { fontFamily: "Righteous, cursive", fontSize: '70px', fill: '#fff' }).setOrigin(0).setPosition(clock.x + 120, clock.y +10);
        deadzone1 = this.add.image(0, 0, KEY_DEADZONE).setScale(scaleDeadzoneSize).setInteractive();
        deadzone1.setPosition((width / 2 - deadzone1.width / scaleDeadzoneSize), 3 / 4 * height);
        deadzone2 = this.add.image(0, 0, KEY_DEADZONE).setScale(scaleDeadzoneSize).setInteractive();
        deadzone2.setPosition(deadzone1.x + deadzone1.width * scaleDeadzoneSize, 3 / 4 * height)

        this.object = this.matter.add.sprite(100, 50, KEY_STAR, 0, { shape: shapes.Icon_Star }).setDepth(2).setInteractive();
        this.input.setDraggable(this.object);
        this.shadow = this.add.sprite(this.object - 20, this.object - 20, KEY_STAR).setOrigin(0.5).setDepth(1);
        // this.shadow.tint = 0xffffff;
        this.shadow.alpha = 0.3;

        deadzone1.on('pointerover', function () {
            console.log('deadzone1 hover');
        });
        deadzone2.on('pointerover', function () {
            console.log('deadzone2 hover');
        });
        let this2 = this;
        this.input.on('dragstart', function (pointer, gameObject) {
            this.scene.object.setCollisionCategory(null);
            this.scene.tweens.add({
                targets: [gameObject],
                scaleX: '1.2',
                scaleY: '1.2',
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
        }).on('dragend', function (pointer, gameObject) {
            this.scene.object.setCollisionCategory(1);
            this.scene.tweens.add({
                targets: [gameObject],
                scaleX: '1',
                scaleY: '1',
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
        }).on('drag', function (pointer, gameObject, dragX, dragY) {

            let touchDeadZone = this2.handleDeadZone(pointer);
            if (touchDeadZone) {
                // this2.playSound("hitSound");
                this2.tweens.add({
                    targets: gameObject,
                    x: deadzone1.x,
                    y: deadzone1.y,
                    ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 100,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                });
            } else {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });
        checkGroup = this.add.group();
        this.resize();
        this.scale.on("resize", this.resize, this);

        timeOut = setInterval(() => {
            let currentTime = Number(timeLabel.text);
            timeLabel.text = currentTime - 1;
            if (currentTime == 1) {
                clearInterval(timeOut);
            }
        }, 1000);

        halfHeightDeadZone = deadzone1.height * scaleDeadzoneSize / 2;
        halfWidthDeadZone = deadzone1.width * scaleDeadzoneSize / 2;
    }
    handleDeadZone(pointer) {

        let topHeight1 = deadzone1.y + halfHeightDeadZone + moreBoundsDeadZone;
        let bottomHeight1 = deadzone1.y - halfHeightDeadZone - moreBoundsDeadZone;
        let leftWidth1 = deadzone1.x - halfWidthDeadZone - moreBoundsDeadZone;
        let rightWidth1 = deadzone1.x + halfWidthDeadZone + moreBoundsDeadZone;

        let topHeight2 = deadzone2.y + halfHeightDeadZone + moreBoundsDeadZone;
        let bottomHeight2 = deadzone2.y - halfHeightDeadZone - moreBoundsDeadZone;
        let leftWidth2 = deadzone2.x - halfWidthDeadZone - moreBoundsDeadZone;
        let rightWidth2 = deadzone2.x + halfWidthDeadZone + moreBoundsDeadZone;

        if (pointer.y <= topHeight1 && pointer.y >= bottomHeight1 && pointer.x >= leftWidth1 && pointer.x <= rightWidth1) {
            console.log("touchDeadZone 1");
            return true
        }
        if (pointer.y <= topHeight2 && pointer.y >= bottomHeight2 && pointer.x >= leftWidth2 && pointer.x <= rightWidth2) {
            console.log("touchDeadZone 2");
            return true
        }

    }
    resize(gameSize) {
        width = gameSize?.width || window.innerWidth;
        height = gameSize?.height || window.innerHeight;
        this.matter.world.setBounds(0, 0, width, height);
        background.displayWidth = width
        background.displayHeight = height;
        deadzone1.setPosition((width / 2 - deadzone1.width / scaleDeadzoneSize), 3 / 4 * height);
        deadzone2.setPosition(deadzone1.x + deadzone1.width * scaleDeadzoneSize, 3 / 4 * height)

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
