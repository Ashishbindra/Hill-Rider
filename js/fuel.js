// =========================================
// HILL RIDER FUEL SYSTEM
// fuel.js
// =========================================

const Fuel = {

    max: 100,
    current: 100,

    consumeRate: 0.018,

    empty: false,

    warningLevel: 25,

    pickups: [],

    pickupDistance: 22000,

    pickupAmount: 40,

    lastPickupX: 600,

    // =====================================
    // CREATE
    // =====================================

    create() {

        this.current = this.max;

        this.empty = false;

        this.pickups = [];

        this.lastPickupX = 600;

        this.generatePickups(600, 6000);

    },

    // =====================================
    // UPDATE
    // =====================================

    update() {

        this.consume();

        this.checkPickups();

        this.generateAhead();

        this.checkEmpty();

    },

    // =====================================
    // CONSUME FUEL
    // =====================================

    consume() {

        if (this.empty) {
            return;
        }

        const accelerating =
            keys["ArrowRight"] ||
            keys["ArrowLeft"];

        if (!accelerating) {
            return;
        }

        this.current -=
            this.consumeRate;

        if (this.current < 0) {

            this.current = 0;

        }

    },

    // =====================================
    // CHECK EMPTY
    // =====================================

    checkEmpty() {

        this.empty =
            this.current <= 0;

    },

    // =====================================
    // CAN DRIVE
    // =====================================

    canDrive() {

        return !this.empty;

    },

    // =====================================
    // GENERATE PICKUPS
    // =====================================

    generatePickups(startX, endX) {

        let x = Math.max(
            startX,
            this.lastPickupX
        );

        while (x <= endX) {

            const randomGap =
                this.pickupDistance +
                Math.random() * 500;

            x += randomGap;

            const terrainY =
                getTerrainY(x);

            this.pickups.push({

                x: x,

                y: terrainY - 55,

                width: 28,

                height: 38,

                collected: false

            });

            this.lastPickupX = x;

        }

    },

    // =====================================
    // GENERATE AHEAD
    // =====================================

    generateAhead() {

        const generateDistance =
            car.position.x + 5000;

        if (
            this.lastPickupX <
            generateDistance
        ) {

            this.generatePickups(

                this.lastPickupX,

                generateDistance

            );

        }

    },

    // =====================================
    // CHECK PICKUPS
    // =====================================

    checkPickups() {

        for (
            const pickup of
            this.pickups
        ) {

            if (pickup.collected) {
                continue;
            }

            const dx =
                car.position.x -
                pickup.x;

            const dy =
                car.position.y -
                pickup.y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (distance < 65) {

                pickup.collected = true;

                this.refill(
                    this.pickupAmount
                );

            }

        }

    },

    // =====================================
    // REFILL
    // =====================================

    refill(amount) {

        this.current += amount;

        if (
            this.current >
            this.max
        ) {

            this.current =
                this.max;

        }

        this.empty = false;

    },

    // =====================================
    // DRAW PICKUPS
    // =====================================

    drawPickups() {

        for (
            const pickup of
            this.pickups
        ) {

            if (pickup.collected) {
                continue;
            }

            if (
                pickup.x <
                camera.x - 100 ||
                pickup.x >
                camera.x +
                canvas.width +
                100
            ) {

                continue;

            }

            ctx.save();

            ctx.translate(
                pickup.x,
                pickup.y
            );

            // Fuel Can Body

            ctx.fillStyle = "#e53935";

            ctx.fillRect(
                -14,
                -19,
                28,
                38
            );

            // Top Handle

            ctx.strokeStyle = "#ffffff";

            ctx.lineWidth = 3;

            ctx.strokeRect(
                -7,
                -27,
                14,
                9
            );

            // Fuel Symbol

            ctx.fillStyle = "#ffffff";

            ctx.font =
                "bold 20px Arial";

            ctx.textAlign = "center";

            ctx.textBaseline =
                "middle";

            ctx.fillText(
                "F",
                0,
                1
            );

            ctx.restore();

        }

    },

    // =====================================
    // DRAW HUD
    // =====================================

    drawHUD() {

        const x = 20;

        const y = 58;

        const width = 220;

        const height = 24;

        const percent =
            this.current /
            this.max;

        // Background

        ctx.fillStyle =
            "rgba(0,0,0,0.45)";

        ctx.fillRect(
            x - 4,
            y - 4,
            width + 8,
            height + 8
        );

        // Empty Bar

        ctx.fillStyle = "#333";

        ctx.fillRect(
            x,
            y,
            width,
            height
        );

        // Fuel Bar

        if (
            this.current <=
            this.warningLevel
        ) {

            ctx.fillStyle =
                "#ff3b30";

        } else {

            ctx.fillStyle =
                "#ffd600";

        }

        ctx.fillRect(
            x,
            y,
            width * percent,
            height
        );

        // Border

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            x,
            y,
            width,
            height
        );

        // Text

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 16px Arial";

        ctx.textAlign = "left";

        ctx.fillText(
            "FUEL " +
            Math.ceil(
                this.current
            ) +
            "%",
            x,
            y + 45
        );

        if (this.empty) {

            ctx.font =
                "bold 34px Arial";

            ctx.textAlign =
                "center";

            ctx.fillStyle =
                "#ff3b30";

            ctx.fillText(
                "OUT OF FUEL",
                canvas.width / 2,
                100
            );

        }

    }

};