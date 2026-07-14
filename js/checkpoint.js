// =========================================
// HILL RIDER CHECKPOINT SYSTEM
// checkpoint.js
// =========================================

const Checkpoint = {

    milestones: [
        {
            distance: 500,
            reward: 25
        },

        {
            distance: 1000,
            reward: 50
        },

        {
            distance: 2000,
            reward: 100
        },

        {
            distance: 5000,
            reward: 250
        },

        {
            distance: 10000,
            reward: 500
        }
    ],

    reached: [],

    active: false,

    currentDistance: 0,

    currentReward: 0,

    timer: 0,

    maxTimer: 180,

    scale: 0,

    alpha: 0,

    particles: [],


    // =====================================
    // CREATE
    // =====================================

    create() {

        this.reached = [];

        this.active = false;

        this.currentDistance = 0;

        this.currentReward = 0;

        this.timer = 0;

        this.scale = 0;

        this.alpha = 0;

        this.particles = [];

    },


    // =====================================
    // UPDATE
    // =====================================

    update() {

        if (
            gameOver ||
            Menu.open ||
            Garage.open
        ) {

            return;

        }


        this.checkMilestones();


        if (this.active) {

            this.updateAnimation();

        }


        this.updateParticles();

    },


    // =====================================
    // CHECK MILESTONES
    // =====================================

    checkMilestones() {

        for (
            const milestone of
            this.milestones
        ) {

            if (
                distance >=
                    milestone.distance &&

                !this.reached.includes(
                    milestone.distance
                )
            ) {

                this.reach(
                    milestone
                );

                break;

            }

        }

    },


    // =====================================
    // REACH CHECKPOINT
    // =====================================

    reach(milestone) {

        this.reached.push(
            milestone.distance
        );


        this.currentDistance =
            milestone.distance;


        this.currentReward =
            milestone.reward;


        this.active = true;

        this.timer =
            this.maxTimer;

        this.scale = 0.2;

        this.alpha = 1;


        // =================================
        // ADD REWARD
        // =================================

        Coin.total +=
            milestone.reward;


        Save.updateCoins(
            Coin.total
        );


        // =================================
        // CREATE PARTICLES
        // =================================

        this.createCelebrationParticles();


        // =================================
        // SOUND
        // =================================

        this.playCheckpointSound();

    },


    // =====================================
    // ANIMATION
    // =====================================

    updateAnimation() {

        this.timer--;


        // OPEN ANIMATION

        if (
            this.timer >
            this.maxTimer - 20
        ) {

            this.scale +=
                (
                    1 -
                    this.scale
                ) * 0.22;

        }

        else {

            this.scale +=
                (
                    1 -
                    this.scale
                ) * 0.08;

        }


        // CLOSE ANIMATION

        if (
            this.timer < 45
        ) {

            this.alpha =
                this.timer / 45;

        }


        if (
            this.timer <= 0
        ) {

            this.active = false;

            this.timer = 0;

            this.alpha = 0;

        }

    },


    // =====================================
    // CREATE PARTICLES
    // =====================================

    createCelebrationParticles() {

        for (
            let i = 0;
            i < 45;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;


            const speed =
                2 +
                Math.random() *
                5;


            this.particles.push({

                x:
                    canvas.width /
                    2,

                y:
                    canvas.height /
                    2 -
                    40,

                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed -
                    2,

                size:
                    3 +
                    Math.random() *
                    5,

                life: 1,

                decay:
                    0.012 +
                    Math.random() *
                    0.015,

                gravity:
                    0.08

            });

        }

    },


    // =====================================
    // UPDATE PARTICLES
    // =====================================

    updateParticles() {

        for (
            const particle of
            this.particles
        ) {

            particle.x +=
                particle.vx;


            particle.y +=
                particle.vy;


            particle.vy +=
                particle.gravity;


            particle.vx *=
                0.99;


            particle.life -=
                particle.decay;

        }


        this.particles =
            this.particles.filter(

                particle =>
                    particle.life > 0

            );

    },


    // =====================================
    // CHECKPOINT SOUND
    // =====================================

    playCheckpointSound() {

        if (
            typeof Sound ===
            "undefined"
        ) {

            return;

        }


        if (
            !Sound.started ||
            Sound.muted ||
            Sound.gameStopped
        ) {

            return;

        }


        Sound.playTone(
            520,
            0.12,
            "sine",
            0.16
        );


        setTimeout(
            () => {

                if (
                    gameOver ||
                    Sound.gameStopped
                ) {

                    return;

                }


                Sound.playTone(
                    720,
                    0.12,
                    "sine",
                    0.16
                );

            },
            100
        );


        setTimeout(
            () => {

                if (
                    gameOver ||
                    Sound.gameStopped
                ) {

                    return;

                }


                Sound.playTone(
                    980,
                    0.2,
                    "sine",
                    0.2
                );

            },
            200
        );

    },


    // =====================================
    // DRAW
    // =====================================

    draw() {

        this.drawParticles();


        if (!this.active) {

            return;

        }


        ctx.save();


        ctx.globalAlpha =
            this.alpha;


        ctx.translate(

            canvas.width / 2,

            canvas.height / 2 -
            50

        );


        ctx.scale(

            this.scale,

            this.scale

        );


        // =================================
        // SHADOW
        // =================================

        ctx.fillStyle =
            "rgba(0,0,0,0.45)";


        ctx.beginPath();


        ctx.roundRect(

            -230,

            -100,

            460,

            200,

            24

        );


        ctx.fill();


        // =================================
        // BORDER
        // =================================

        ctx.strokeStyle =
            "#FFC107";


        ctx.lineWidth = 6;


        ctx.stroke();


        // =================================
        // CHECKPOINT
        // =================================

        ctx.fillStyle =
            "#FFC107";


        ctx.font =
            "bold 28px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            "CHECKPOINT",

            0,

            -55

        );


        // =================================
        // DISTANCE
        // =================================

        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 48px Arial";


        ctx.fillText(

            this.currentDistance +
            " M",

            0,

            0

        );


        // =================================
        // REWARD
        // =================================

        ctx.fillStyle =
            "#FFD54F";


        ctx.font =
            "bold 22px Arial";


        ctx.fillText(

            "+ " +
            this.currentReward +
            " COINS",

            0,

            55

        );


        ctx.restore();

    },


    // =====================================
    // DRAW PARTICLES
    // =====================================

    drawParticles() {

        for (
            let i = 0;
            i < this.particles.length;
            i++
        ) {

            const particle =
                this.particles[i];


            ctx.save();


            ctx.globalAlpha =
                Math.max(
                    0,
                    particle.life
                );


            if (
                i % 3 === 0
            ) {

                ctx.fillStyle =
                    "#FFC107";

            }

            else if (
                i % 3 === 1
            ) {

                ctx.fillStyle =
                    "#FF5722";

            }

            else {

                ctx.fillStyle =
                    "#4CAF50";

            }


            ctx.beginPath();


            ctx.arc(

                particle.x,

                particle.y,

                particle.size,

                0,

                Math.PI * 2

            );


            ctx.fill();


            ctx.restore();

        }

    },


    // =====================================
    // RESET
    // =====================================

    reset() {

        this.create();

    }

};