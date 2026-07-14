// =========================================
// HILL RIDER COIN SYSTEM
// coin.js
// =========================================

const Coin = {

    total: 0,

    items: [],

    lastGeneratedX: 500,

    generateDistance: 5000,

    minGap: 320,

    maxGap: 650,

    radius: 14,

    collectDistance: 48,

    rotation: 0,

    // =====================================
    // CREATE
    // =====================================
create() {

    this.total =
        Save.getCoins();

    this.items = [];

    this.lastGeneratedX = 500;

    this.rotation = 0;

    this.generateCoins(
        500,
        this.generateDistance
    );

},

    // =====================================
    // UPDATE
    // =====================================

    update() {

        this.rotation += 0.08;

        this.checkCollection();

        this.generateAhead();

        this.cleanup();

    },

    // =====================================
    // GENERATE COINS
    // =====================================

    generateCoins(startX, endX) {

        let x = Math.max(
            startX,
            this.lastGeneratedX
        );

        while (x < endX) {

            const gap =
                this.minGap +
                Math.random() *
                (
                    this.maxGap -
                    this.minGap
                );

            x += gap;

            const coinCount =
                3 +
                Math.floor(
                    Math.random() * 5
                );

            const pattern =
                Math.floor(
                    Math.random() * 3
                );

            this.createCoinGroup(
                x,
                coinCount,
                pattern
            );

            x += coinCount * 42;

            this.lastGeneratedX = x;

        }

    },

    // =====================================
    // CREATE COIN GROUP
    // =====================================

    createCoinGroup(
        startX,
        count,
        pattern
    ) {

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const x =
                startX +
                i * 42;

            let height = 52;

            if (pattern === 1) {

                height +=
                    Math.sin(
                        (
                            i /
                            Math.max(
                                1,
                                count - 1
                            )
                        ) *
                        Math.PI
                    ) * 65;

            }

            if (pattern === 2) {

                height +=
                    i * 12;

            }

            const y =
                getTerrainY(x) -
                height;

            this.items.push({

                x: x,

                y: y,

                collected: false,

                value: 1

            });

        }

    },

    // =====================================
    // GENERATE AHEAD
    // =====================================

    generateAhead() {

        const targetX =
            car.position.x +
            this.generateDistance;

        if (
            this.lastGeneratedX <
            targetX
        ) {

            this.generateCoins(

                this.lastGeneratedX,

                targetX

            );

        }

    },

    // =====================================
    // COLLECTION
    // =====================================

checkCollection() {

    for (const coin of this.items) {

        if (coin.collected) {
            continue;
        }

        const dx =
            car.position.x -
            coin.x;

        const dy =
            car.position.y -
            coin.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (
            distance <
            this.collectDistance
        ) {

            coin.collected = true;

            // Coin count increase
            this.total +=
                coin.value;

            // Coin localStorage me save
            Save.updateCoins(
                this.total
            );

        }

    }

},

    // =====================================
    // CLEANUP
    // =====================================

    cleanup() {

        const removeBefore =
            camera.x - 1000;

        this.items =
            this.items.filter(
                coin =>
                    !coin.collected &&
                    coin.x >
                    removeBefore
            );

    },

    // =====================================
    // DRAW COINS
    // =====================================

    draw() {

        for (
            const coin of
            this.items
        ) {

            if (coin.collected) {
                continue;
            }

            if (
                coin.x <
                camera.x - 100 ||
                coin.x >
                camera.x +
                canvas.width +
                100
            ) {

                continue;
            }

            this.drawCoin(coin);

        }

    },

    // =====================================
    // DRAW SINGLE COIN
    // =====================================

    drawCoin(coin) {

        ctx.save();

        ctx.translate(
            coin.x,
            coin.y
        );

        const scaleX =
            Math.max(
                0.18,
                Math.abs(
                    Math.cos(
                        this.rotation +
                        coin.x * 0.01
                    )
                )
            );

        ctx.scale(
            scaleX,
            1
        );

        // Outer Coin

        ctx.fillStyle =
            "#FFC107";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Border

        ctx.strokeStyle =
            "#FF8F00";

        ctx.lineWidth = 3;

        ctx.stroke();

        // Inner Coin

        ctx.fillStyle =
            "#FFD54F";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            this.radius - 5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Coin Mark

        ctx.fillStyle =
            "#F57F17";

        ctx.font =
            "bold 13px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            "$",
            0,
            1
        );

        ctx.restore();

    },

    // =====================================
    // DRAW HUD
    // =====================================

    drawHUD() {

        const x =
            canvas.width - 180;

        const y = 35;

        // Coin Icon

        ctx.fillStyle =
            "#FFC107";

        ctx.beginPath();

        ctx.arc(
            x,
            y - 7,
            15,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle =
            "#FF8F00";

        ctx.lineWidth = 3;

        ctx.stroke();

        ctx.fillStyle =
            "#F57F17";

        ctx.font =
            "bold 14px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            "$",
            x,
            y - 6
        );

        // Coin Count

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 28px Arial";

        ctx.textAlign =
            "left";

        ctx.fillText(
            this.total,
            x + 28,
            y
        );

    }

};