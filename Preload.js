function gameStart() { }
var nAssets = 6;
var nLoaded = 0;
var bgSound, jumpSound, winSound, loseSound, attackSound, collectCoinSound, hitBonusBlockSound, killEnemySound, standOnEnemySound, flagSound, bossDeadSound;
var Sounds;
class Preload extends Phaser.Scene {
    constructor() {
        super({ key: "Preload" });
    }

    createGameObjects() {
        this.cameras.main.fadeOut(0, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            window.gameReady && window.gameReady();
            this.scene.start("Scene1PlayGame");
        });
    }

    create() {
        this.textures.addBase64(KEY_STAR, sprStarB64);
        nLoaded++;
        this.textures.addBase64(KEY_PLATE, sprPlateB64);
        nLoaded++;
        this.textures.addBase64(KEY_BACKGROUND, sprBackgroundB64);
        nLoaded++;
        this.textures.addBase64(KEY_DEADZONE, sprDeadZoneB64);
        nLoaded++;
        this.textures.addBase64(KEY_CLOCK, sprClockB64);
        nLoaded++;
        this.textures.addBase64(KEY_BACKGROUND_CLOCK, sprBackgroundClockB64);
        nLoaded++;
        if (nLoaded >= nAssets) {
            var actualCreate = this.createGameObjects.bind(this);
            actualCreate();
        }
        // Sounds = {
        //     bgSound: new Howl({
        //         src: backgroundSoundB64,
        //         loop: true,
        //     }),
        //     jumpSound: new Howl({
        //         src: jumpSoundB64,
        //     }),
        // };
        // nLoaded++;

        // sprPlayerWeaponImg.onload = () => {
        //     this.textures.addSpriteSheet("sprPlayerWeapon", sprPlayerWeaponImg, {
        //         frameWidth: 32,
        //         frameHeight: 32,
        //     });
        //     nLoaded++;
        // };
        // sprPlayerWeaponImg.src = sprPlayerWeaponB64;

        // sprBonusPointImg.onload = () => {
        //     this.textures.addSpriteSheet("sprBonusPoint", sprBonusPointImg, {
        //         frameWidth: 34,
        //         frameHeight: 34,
        //     });
        //     nLoaded++;
        //     if (nLoaded >= nAssets) {
        //         var actualCreate = this.createGameObjects.bind(this);
        //         actualCreate();
        //     }
        // };
        // sprBonusPointImg.src = sprBlockCoinB64;
    }

    update() { }
}