var width = window.innerWidth, height = window.innerHeight;
var background, clearTitle, score, btn, failed, retry;
class Scene2EndGame extends Phaser.Scene {
    constructor() {
        super({ key: "Scene2EndGame" });
    }
    create(data) {
        Sounds["backgroundSound"].pause();
        background = this.add.image(0, 0, KEY_BACKGROUND).setOrigin(0);
        this.input.on('pointerdown', function () {
            console.log('GOTOSTORE');
        });
        if (data == "win") {
            clearTitle = this.add.image(0, 0, KEY_CLEAR_LEVEL).setOrigin(0).setScale(1.3);
            score = this.add.image(0, 0, KEY_SCORE).setOrigin(0);
            btn = this.add.image(0, 0, KEY_CLAIM_BUTTON).setOrigin(0).setScale(1.3);

            this.resize();
            this.scale.on("resize", this.resize, this);
            Sounds["gameWinSound"].play();
        } else {
            // Sounds["gameWinSound"].play();
            failed = this.add.image(0, 0, KEY_FAIL_LEVEL).setOrigin(0).setScale(1.3);
            retry = this.add.image(0, 0, KEY_RETRY).setOrigin(0).setScale(1.3);
            this.resize2();
            this.scale.on("resize2", this.resize2, this);
        }
    }
    resize(gameSize) {
        width = gameSize?.width || window.innerWidth;
        height = gameSize?.height || window.innerHeight;
        background.displayWidth = width;
        background.displayHeight = height;
        clearTitle.setPosition(width / 2 - clearTitle.width * 1.3 / 2, 150);
        score.setPosition(width / 2 - score.width / 2, 500);
        btn.setPosition(width / 2 - btn.width * 1.3 / 2, 2 * height / 3);
        this.scene.scene.tweens.add({
            targets: btn,
            scale: '1.5',
            // scaleCenterY: '1.5',      // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: -1,            // -1: infinity
            yoyo: true
        });
    }
    resize2(gameSize) {
        width = gameSize?.width || window.innerWidth;
        height = gameSize?.height || window.innerHeight;
        background.displayWidth = width;
        background.displayHeight = height;
        failed.setPosition(width / 2 - failed.width * 1.3 / 2, height / 4)
        retry.setPosition(width / 2 - retry.width * 1.3 / 2, 2 * height / 3)
        this.scene.scene.tweens.add({
            targets: retry,
            scale: '1.5',
            // scaleCenterY: '1.5',      // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 500,
            repeat: -1,            // -1: infinity
            yoyo: true
        });

    }

}