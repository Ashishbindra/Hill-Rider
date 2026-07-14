// =========================================
// HILL RIDER PARTICLE SYSTEM
// particles.js
// =========================================

const Particles = {

    items: [],

    smokeTimer: 0,
    dustTimer: 0,

    create() {

        this.items = [];

        this.smokeTimer = 0;
        this.dustTimer = 0;

    },

    update() {

        if (Garage.open || gameOver) {

            this.updateParticles();

            return;

        }

        this.createExhaust();

        this.createDust();

        this.updateParticles();

    },

    // =====================================
    // EXHAUST
    // =====================================

    createExhaust() {

        const driving =
            keys["ArrowRight"] ||
            keys["ArrowLeft"];

        if (!driving) {

            this.smokeTimer++;

            if (this.smokeTimer < 14) {
                return;
            }

        } else {

            this.smokeTimer++;

            if (this.smokeTimer < 5) {
                return;
            }

        }

        this.smokeTimer = 0;

        const exhaust =
            this.getCarLocalPoint(
                -64,
                5
            );

        this.items.push({

            type: "smoke",

            x: exhaust.x,
            y: exhaust.y,

            vx:
                -0.7 -
                Math.random() * 0.8,

            vy:
                -0.2 -
                Math.random() * 0.5,

            size:
                5 +
                Math.random() * 5,

            life: 1,

            decay:
                0.012 +
                Math.random() * 0.008

        });

    },

    // =====================================
    // DUST
    // =====================================

    createDust() {

        if (!Physics.grounded) {
            return;
        }

        const speed =
            Math.abs(car.velocity.x);

        if (speed < 1.5) {
            return;
        }

        this.dustTimer++;

        if (this.dustTimer < 3) {
            return;
        }

        this.dustTimer = 0;

        const wheel =
            car.velocity.x >= 0
                ? wheel1
                : wheel2;

        for (let i = 0; i < 2; i++) {

            this.items.push({

                type: "dust",

                x:
                    wheel.position.x +
                    (
                        Math.random() * 10 -
                        5
                    ),

                y:
                    wheel.position.y +
                    CAR.wheelRadius -
                    2,

                vx:
                    -car.velocity.x * 0.15 +
                    (
                        Math.random() * 0.8 -
                        0.4
                    ),

                vy:
                    -0.4 -
                    Math.random() * 1,

                size:
                    4 +
                    Math.random() * 7,

                life: 1,

                decay:
                    0.025 +
                    Math.random() * 0.02

            });

        }

    },

    // =====================================
    // UPDATE PARTICLES
    // =====================================

    updateParticles() {

        for (const particle of this.items) {

            particle.x += particle.vx;

            particle.y += particle.vy;

            particle.life -= particle.decay;

            if (particle.type === "smoke") {

                particle.vx *= 0.98;

                particle.vy -= 0.005;

                particle.size += 0.08;

            }

            if (particle.type === "dust") {

                particle.vx *= 0.94;

                particle.vy += 0.025;

                particle.size += 0.04;

            }

        }

        this.items =
            this.items.filter(
                particle =>
                    particle.life > 0
            );

        if (this.items.length > 300) {

            this.items.splice(
                0,
                this.items.length - 300
            );

        }

    },

    // =====================================
    // CAR LOCAL POINT
    // =====================================

    getCarLocalPoint(
        localX,
        localY
    ) {

        const cos =
            Math.cos(car.angle);

        const sin =
            Math.sin(car.angle);

        return {

            x:
                car.position.x +
                localX * cos -
                localY * sin,

            y:
                car.position.y +
                localX * sin +
                localY * cos

        };

    },

    // =====================================
    // DRAW
    // =====================================

    draw() {

        for (const particle of this.items) {

            ctx.save();

            ctx.globalAlpha =
                Math.max(
                    0,
                    particle.life
                );

            if (
                particle.type ===
                "smoke"
            ) {

                ctx.fillStyle =
                    "#607d8b";

            } else {

                ctx.fillStyle =
                    "#8d6e63";

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

    }

};