
class Scene1PlayGame extends Phaser.Scene {
    constructor() {
        super({ key: "Scene1PlayGame" });
    }
    preload() {
        this.load.json('shapes', example);
    }
    create() {
        this.matter.world.setBounds(0, 0, 600, 800);
        var shapes = this.cache.json.get('shapes');

        this.matter.add.sprite(100, 50, 'sprStar', 'Icon_Star', { shape: shapes.Icon_Star });
        this.object = this.matter.add.sprite(200, 50, 'sprStar', 'Icon_Star', { shape: shapes.Icon_Star }).setOrigin(0.5).setDepth(2).setScale(0.5).setInteractive();
        // this.deadzone = this.matter.add.sprite(0, 0, "sprDeadzone").setOrigin(0).setPosition(100, 100).setInteractive();
        var  zone = this.add.zone(600, 200).setSize(600, 200);
        this.physics.world.enable(zone);
        // this.deadzone.body.setAllowGravity(false);
        this.deadzone.body.moves = false;

        this.shadow = this.add.sprite(200 - 20, 50 - 20, 'sprStar_shadow').setOrigin(0.5).setDepth(1).setScale(0.5);
        this.shadow.tint = 0x999999;
        this.shadow.alpha = 0.3;
        this.shadow1 = this.add.sprite(100 - 20, 50 - 20, 'sprStar').setOrigin(0.5).setDepth(1);
        this.shadow1.tint = 0x999999;
        this.shadow1.alpha = 0.3;

        this.deadzone.on('pointerover', function () {
            console.log('over');
        });
        this.matter.overlap(this.deadzone, this.object)
        this.input.on('dragstart', function (pointer) {
            this.scene.object.setCollisionCategory(null);
            this.scene.tweens.add({
                targets: [this.scene.object, this.scene.shadow],
                scaleX: '0.8',
                scaleY: '0.8',
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
        }).on('dragend', function (pointer) {
            this.scene.object.setCollisionCategory(1);
            this.scene.tweens.add({
                targets: [this.scene.object, this.scene.shadow],
                scaleX: '0.5',
                scaleY: '0.5',
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
        });
        this.input.setDraggable(this.object);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            gameObject.x = dragX;
            gameObject.y = dragY;

        });
        this.resize()
        this.scale.on("resize", this.resize, this);
    }

    resize() {

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
