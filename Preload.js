function gameStart() { }
var nAssets = 13;
var nLoaded = 0;
var matchTrueSound, matchFailSound, gameWinSound;
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
        this.textures.addBase64(KEY_BACKGROUND, sprBackgroundB64);
        nLoaded++;
        this.textures.addBase64(KEY_CTA_BUTTON, sprCtaButtonB64);
        nLoaded++;
        this.textures.addBase64(KEY_STAR, sprStarB64);
        nLoaded++;
        this.textures.addBase64(KEY_PLATE, sprPlateB64);
        nLoaded++;
        this.textures.addBase64(KEY_DEADZONE, sprDeadZoneB64);
        nLoaded++;
        this.textures.addBase64(KEY_CLOCK, sprClockB64);
        nLoaded++;
        this.textures.addBase64(KEY_BACKGROUND_CLOCK, sprBackgroundClockB64);
        nLoaded++;
        this.textures.addBase64(KEY_CLEAR_LEVEL, sprClearLevelB64);
        nLoaded++;
        this.textures.addBase64(KEY_SCORE, sprScoreB64);
        nLoaded++;
        this.textures.addBase64(KEY_CLAIM_BUTTON, sprClaimBtnB64);
        nLoaded++;
        this.textures.addBase64(KEY_FAIL_LEVEL, sprFailLevelB64)
        nLoaded++;
        this.textures.addBase64(KEY_RETRY, sprRetryB64)
        nLoaded++;
        Sounds = {
            backgroundSound: new Howl({
                src: matchTrueB64,
                loop: true,
            }),
            matchTrueSound: new Howl({
                src: matchTrueB64,

            }),
            matchFailSound: new Howl({
                src: matchFailB64,
            }),
            gameWinSound: new Howl({
                src: gameWinB64,
            }),
        };
        nLoaded++;
        if (nLoaded >= nAssets) {
            var actualCreate = this.createGameObjects.bind(this);
            actualCreate();
        }

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

// MINTE