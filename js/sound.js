// =========================================
// HILL RIDER SOUND SYSTEM
// sound.js
// =========================================

const Sound = {

    context: null,

    masterGain: null,

    engineOscillator: null,

    engineGain: null,

    started: false,

    muted: false,

    gameStopped: false,

    lastCoinTotal: 0,

    lastFuel: 100,


    // =====================================
    // CREATE
    // =====================================

    create() {

        this.lastCoinTotal =
            Coin.total;

        this.lastFuel =
            Fuel.current;

        this.gameStopped = false;


        window.addEventListener(
            "keydown",
            () => {

                this.start();

            },
            {
                once: true
            }
        );


        canvas.addEventListener(
            "pointerdown",
            () => {

                this.start();

            },
            {
                once: true
            }
        );

    },


    // =====================================
    // START AUDIO
    // =====================================

    start() {

        this.gameStopped = false;


        if (this.started) {

            if (
                this.context &&
                this.context.state ===
                "suspended"
            ) {

                this.context.resume();

            }


            if (
                this.masterGain
            ) {

                this.masterGain.gain
                    .cancelScheduledValues(
                        this.context.currentTime
                    );


                this.masterGain.gain
                    .setValueAtTime(

                        this.muted
                            ? 0
                            : 0.35,

                        this.context.currentTime

                    );

            }


            return;

        }


        const AudioContext =

            window.AudioContext ||

            window.webkitAudioContext;


        if (!AudioContext) {

            console.warn(
                "Web Audio not supported"
            );

            return;

        }


        this.context =
            new AudioContext();


        this.masterGain =
            this.context.createGain();


        this.masterGain.gain.value =
            this.muted
                ? 0
                : 0.35;


        this.masterGain.connect(
            this.context.destination
        );


        this.createEngineSound();


        this.started = true;

    },


    // =====================================
    // ENGINE SOUND
    // =====================================

    createEngineSound() {

        this.engineOscillator =
            this.context.createOscillator();


        this.engineGain =
            this.context.createGain();


        this.engineOscillator.type =
            "sawtooth";


        this.engineOscillator.frequency.value =
            60;


        this.engineGain.gain.value =
            0;


        this.engineOscillator.connect(
            this.engineGain
        );


        this.engineGain.connect(
            this.masterGain
        );


        this.engineOscillator.start();

    },


    // =====================================
    // UPDATE
    // =====================================

    update() {

        if (!this.started) {

            return;

        }


        if (this.gameStopped) {

            return;

        }


        this.updateEngine();

        this.checkCoin();

        this.checkFuel();

    },


    // =====================================
    // UPDATE ENGINE SOUND
    // =====================================

    updateEngine() {

        if (
            !this.engineOscillator ||
            !this.engineGain
        ) {

            return;

        }


        const driving =

            (
                keys["ArrowRight"] ||
                keys["ArrowLeft"]
            ) &&

            Fuel.canDrive() &&

            !Garage.open &&

            !gameOver;


        const speed =

            Math.abs(
                Physics.wheelSpeed
            );


        const frequency =

            65 +

            speed * 260;


        this.engineOscillator.frequency
            .setTargetAtTime(

                frequency,

                this.context.currentTime,

                0.05

            );


        const volume =

            driving
                ? 0.16
                : 0.025;


        this.engineGain.gain
            .setTargetAtTime(

                volume,

                this.context.currentTime,

                0.08

            );

    },


    // =====================================
    // CHECK COIN
    // =====================================

    checkCoin() {

        if (
            Coin.total >
            this.lastCoinTotal
        ) {

            this.playCoin();

        }


        this.lastCoinTotal =
            Coin.total;

    },


    // =====================================
    // CHECK FUEL
    // =====================================

    checkFuel() {

        if (
            Fuel.current >
            this.lastFuel + 5
        ) {

            this.playFuel();

        }


        this.lastFuel =
            Fuel.current;

    },


    // =====================================
    // COIN SOUND
    // =====================================

    playCoin() {

        this.playTone(
            850,
            0.09,
            "sine",
            0.18
        );


        setTimeout(
            () => {

                if (
                    this.gameStopped
                ) {

                    return;

                }


                this.playTone(
                    1150,
                    0.08,
                    "sine",
                    0.12
                );

            },
            55
        );

    },


    // =====================================
    // FUEL SOUND
    // =====================================

    playFuel() {

        this.playTone(
            300,
            0.12,
            "square",
            0.12
        );


        setTimeout(
            () => {

                if (
                    this.gameStopped
                ) {

                    return;

                }


                this.playTone(
                    450,
                    0.14,
                    "square",
                    0.1
                );

            },
            90
        );

    },


    // =====================================
    // PLAY TONE
    // =====================================

    playTone(
        frequency,
        duration,
        type,
        volume
    ) {

        if (
            !this.started ||
            this.muted ||
            this.gameStopped
        ) {

            return;

        }


        const oscillator =
            this.context.createOscillator();


        const gain =
            this.context.createGain();


        oscillator.type =
            type;


        oscillator.frequency.value =
            frequency;


        gain.gain.setValueAtTime(

            volume,

            this.context.currentTime

        );


        gain.gain.exponentialRampToValueAtTime(

            0.001,

            this.context.currentTime +
            duration

        );


        oscillator.connect(
            gain
        );


        gain.connect(
            this.masterGain
        );


        oscillator.start();


        oscillator.stop(

            this.context.currentTime +
            duration

        );

    },


    // =====================================
    // STOP ALL GAME SOUND
    // =====================================

    stop() {

        if (!this.started) {

            return;

        }


        this.gameStopped = true;


        if (
            this.engineGain &&
            this.context
        ) {

            this.engineGain.gain
                .cancelScheduledValues(
                    this.context.currentTime
                );


            this.engineGain.gain
                .setValueAtTime(

                    0,

                    this.context.currentTime

                );

        }


        if (
            this.masterGain &&
            this.context
        ) {

            this.masterGain.gain
                .cancelScheduledValues(
                    this.context.currentTime
                );


            this.masterGain.gain
                .setValueAtTime(

                    0,

                    this.context.currentTime

                );

        }

    },


    // =====================================
    // MUTE
    // =====================================

    toggleMute() {

        this.muted =
            !this.muted;


        if (!this.masterGain) {

            return;

        }


        if (this.gameStopped) {

            this.masterGain.gain.value = 0;

            return;

        }


        this.masterGain.gain.value =

            this.muted
                ? 0
                : 0.35;

    },


    // =====================================
    // DRAW HUD
    // =====================================

    drawHUD() {

        ctx.save();


        ctx.fillStyle =
            "rgba(0,0,0,0.45)";


        ctx.fillRect(
            canvas.width - 70,
            65,
            48,
            42
        );


        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "24px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            this.muted
                ? "🔇"
                : "🔊",

            canvas.width - 46,

            86

        );


        ctx.restore();

    }

};


// =========================================
// SOUND BUTTON
// =========================================

canvas.addEventListener(
    "click",
    event => {

        const x =
            event.clientX;


        const y =
            event.clientY;


        if (
            x >= canvas.width - 70 &&
            x <= canvas.width - 22 &&
            y >= 65 &&
            y <= 107
        ) {

            Sound.start();

            Sound.toggleMute();

        }

    }
);