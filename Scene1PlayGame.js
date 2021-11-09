var background, clock, backgroundClock, timeLabel, deadzone1, deadzone2, plate;
var width = window.innerWidth, height = window.innerHeight;
var scaleDeadzoneSize = 1.5;
let halfHeightDeadZone, halfWidthDeadZone;
let moreBoundsDeadZone = 90;
let checkGroup;
let timeOut;
class Scene1PlayGame extends Phaser.Scene {
    constructor() {
        super({ key: "Scene1PlayGame" });
    }

    preload() {
        this.load.json('Key_physicsLine', physicsLine);
    }
    create() {
        this.matter.world.setBounds(0, 0, width, height);
        var shapes = this.cache.json.get('Key_physicsLine');

        background = this.add.image(0, 0, KEY_BACKGROUND).setOrigin(0);
        clock = this.add.image(0, 0, KEY_CLOCK).setScale(0.7).setDepth(10).setOrigin(0).setPosition(width / 2 - 100, 100);
        timeLabel = this.add.text(width / 2, 100, "59", { fontFamily: "Righteous, cursive", fontSize: '70px', fill: '#fff' }).setOrigin(0).setDepth(10).setPosition(clock.x + 120, clock.y + 10);
        backgroundClock = this.add.image(0, 0, KEY_BACKGROUND_CLOCK).setOrigin(0).setScale(0.8).setDepth(9).setPosition(clock.x - 40, clock.y - 20);
        deadzone1 = this.add.image(0, 0, KEY_DEADZONE).setScale(scaleDeadzoneSize).setInteractive();
        deadzone1.setPosition((width / 2 - deadzone1.width / scaleDeadzoneSize), 3 / 4 * height);
        deadzone2 = this.add.image(0, 0, KEY_DEADZONE).setScale(scaleDeadzoneSize).setInteractive();
        deadzone2.setPosition(deadzone1.x + deadzone1.width * scaleDeadzoneSize, 3 / 4 * height)

        let objLength = 10;

        for (let i = 0; i < objLength; i++) {
            var object = this.add.image(0, 0, KEY_STAR);
            var shadow = this.add.image(object.x + 10, object.y + 10, KEY_STAR);
            shadow.setTint(0x000000).setAlpha(0.6);
            var container = this.add.container(200, 200, [shadow, object], {
                immovable: true,
                allowGravity: false
            });
            container.setSize(object.width, object.height);
            container.setPosition(this.randomIntFromInterval(30, width - 30), this.randomIntFromInterval(250, height / 2 + 300));
            container.setInteractive();
            this.input.setDraggable(container);
            this.matter.add.gameObject(container, { shape: shapes.Icon_Star })
        }
        deadzone1.on('pointerover', function () {
            console.log('deadzone1 hover');
        });
        deadzone2.on('pointerover', function () {
            console.log('deadzone2 hover');
        });

        let this2 = this;
        checkGroup = this.add.group();

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setCollisionCategory(null);
            gameObject.setDepth(3);
            let shadowobj = gameObject.first;
            this.scene.tweens.add({
                targets: gameObject,
                scaleX: '1.2',
                scaleY: '1.2',
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
            this.scene.tweens.add({
                targets: shadowobj,
                x: shadowobj.x + 20,
                y: shadowobj.y + 20,
                scale: '1.2',
                alpha: 0.3,
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
        }).on('dragend', function (pointer, gameObject) {
            gameObject.setCollisionCategory(1);
            gameObject.setDepth(2);
            let shadowobj = gameObject.first;
            this2.tweens.add({
                targets: gameObject,
                scaleX: '1',
                scaleY: '1',
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            })
            this.scene.tweens.add({
                targets: shadowobj,
                x: shadowobj.x - 20,
                y: shadowobj.y - 20,
                scale: '1',
                alpha: 0.6,
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
            let touchDeadZone = this2.handleDeadZone(pointer);
            if (touchDeadZone == "touchDeadZone1") {
                // this2.playSound("hitSound");
                gameObject.disableInteractive();
                this2.tweens.add({
                    targets: gameObject,
                    x: deadzone1.x,
                    y: deadzone1.y,
                    scaleX: '1',
                    scaleY: '1',
                    ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 100,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                })
                if (checkGroup.getLength() < 2) {
                    checkGroup.add(gameObject);
                }
            } else if (touchDeadZone == "touchDeadZone2") {
                gameObject.disableInteractive();
                this2.tweens.add({
                    targets: gameObject,
                    x: deadzone2.x,
                    y: deadzone2.y,
                    scaleX: '1',
                    scaleY: '1',
                    ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 100,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                })
                checkGroup.add(gameObject);
            }
            // console.log(checkGroup.getChildren()[0].body.label);
            let checkGroupList = checkGroup.getChildren();

            if (checkGroupList.length == 2) {
                if (checkGroupList[0]?.label === checkGroupList[1]?.label) {
                    gameObject.setCollisionCategory(null);
                    checkGroupList.map(function (child) {
                        this2.tweens.add({
                            targets: [child],
                            x: deadzone1.x + halfWidthDeadZone,
                            scale: 0,
                            ease: 'Cubic.In',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                            delay: 200,
                            duration: 400,
                            repeat: 0,            // -1: infinity
                            yoyo: false,
                            onComplete: function () {
                                this2.time.addEvent({
                                    delay: 300,                // ms
                                    callback: function () {
                                        // child.destroy();
                                        checkGroup = this.add.group();
                                        child.y = -10000;
                                    },
                                    //args: [],
                                    callbackScope: this2,
                                    loop: false
                                });
                            }
                        })
                    })
                }
            }
        }).on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;

        });
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

        let topHeight = deadzone1.y + halfHeightDeadZone + moreBoundsDeadZone;
        let bottomHeight = deadzone1.y - halfHeightDeadZone - moreBoundsDeadZone;

        let leftWidth1 = deadzone1.x - halfWidthDeadZone - moreBoundsDeadZone;

        let rightWidth2 = deadzone2.x + halfWidthDeadZone + moreBoundsDeadZone;

        if (pointer.y <= topHeight && pointer.y >= bottomHeight) {
            if ((pointer.x >= leftWidth1 && pointer.x <= rightWidth2) && checkGroup.getChildren().length == 0) {
                return "touchDeadZone1";
            } else if ((pointer.x >= leftWidth1 && pointer.x <= rightWidth2) && checkGroup.getChildren().length == 1) {
                return "touchDeadZone2";
            }
        }
    }
    resize(gameSize) {
        width = gameSize?.width || window.innerWidth;
        height = gameSize?.height || window.innerHeight;
        this.matter.world.setBounds(0, 0, width, height);
        background.displayWidth = width;
        background.displayHeight = height;
        deadzone1.setPosition((width / 2 - deadzone1.width / scaleDeadzoneSize), 3 / 4 * height);
        deadzone2.setPosition(deadzone1.x + deadzone1.width * scaleDeadzoneSize, 3 / 4 * height);
        clock.setPosition(width / 2 - 100, 100);
        timeLabel.setPosition(clock.x + 120, clock.y + 10);
        backgroundClock.setPosition(clock.x - 40, clock.y - 20);



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
    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    update() {
        // this.shadow.x = this.object.x - 20;
        // this.shadow.y = this.object.y - 20;
    }
}
function gameClose() { }
