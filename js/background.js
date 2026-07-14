// =========================================
// HILL RIDER BACKGROUND SYSTEM
// background.js
// =========================================

const Background = {

    clouds: [],
    stars: [],

    created: false,

    // =====================================
    // CREATE
    // =====================================

    create() {

        this.clouds = [];
        this.stars = [];

        for (let i = 0; i < 12; i++) {

            this.clouds.push({

                x: Math.random() * 5000,

                y:
                    50 +
                    Math.random() * 190,

                size:
                    0.7 +
                    Math.random() * 0.8,

                speed:
                    0.08 +
                    Math.random() * 0.08

            });

        }


        for (let i = 0; i < 100; i++) {

            this.stars.push({

                x: Math.random(),

                y: Math.random() * 0.65,

                size:
                    1 +
                    Math.random() * 2,

                alpha:
                    0.4 +
                    Math.random() * 0.6

            });

        }


        this.created = true;

    },


    // =====================================
    // MAP
    // =====================================

    getMap() {

        if (
            typeof Menu === "undefined"
        ) {

            return 0;

        }

        return Menu.selectedMap || 0;

    },


    // =====================================
    // UPDATE
    // =====================================

    update() {

        const map =
            this.getMap();


        if (map === 2) {

            return;

        }


        for (
            const cloud of
            this.clouds
        ) {

            cloud.x +=
                cloud.speed;


            const cameraOffset =
                camera.x * 0.12;


            if (
                cloud.x <
                cameraOffset - 400
            ) {

                cloud.x =
                    cameraOffset +
                    canvas.width +
                    600;

            }

        }

    },


    // =====================================
    // DRAW
    // =====================================

    draw() {

        const map =
            this.getMap();


        if (map === 0) {

            this.drawGreenSky();

            this.drawSun();

            this.drawGreenFarMountains();

            this.drawGreenNearMountains();

            this.drawClouds();

            return;

        }


        if (map === 1) {

            this.drawDesertSky();

            this.drawDesertSun();

            this.drawDesertFarDunes();

            this.drawDesertNearDunes();

            this.drawDesertClouds();

            return;

        }


        this.drawNightSky();

        this.drawStars();

        this.drawMoon();

        this.drawNightFarMountains();

        this.drawNightNearMountains();

    },


    // =====================================
    // GREEN SKY
    // =====================================

    drawGreenSky() {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            "#42aee8"
        );


        gradient.addColorStop(
            0.55,
            "#8dd7f5"
        );


        gradient.addColorStop(
            1,
            "#d7f2ff"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    },


    // =====================================
    // SUN
    // =====================================

    drawSun() {

        const x =
            canvas.width - 150;

        const y = 120;


        const glow =
            ctx.createRadialGradient(
                x,
                y,
                15,
                x,
                y,
                90
            );


        glow.addColorStop(
            0,
            "rgba(255,245,157,0.95)"
        );


        glow.addColorStop(
            0.5,
            "rgba(255,235,59,0.4)"
        );


        glow.addColorStop(
            1,
            "rgba(255,235,59,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            90,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#fff176";


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            42,
            0,
            Math.PI * 2
        );


        ctx.fill();

    },


    // =====================================
    // GREEN FAR MOUNTAINS
    // =====================================

    drawGreenFarMountains() {

        this.drawMountainLayer(

            camera.x * 0.12,

            canvas.height - 230,

            70,

            30,

            "#9cc8d7",

            0.002,

            0.005

        );

    },


    // =====================================
    // GREEN NEAR MOUNTAINS
    // =====================================

    drawGreenNearMountains() {

        this.drawMountainLayer(

            camera.x * 0.25,

            canvas.height - 160,

            60,

            22,

            "#70aeb8",

            0.003,

            0.007

        );

    },


    // =====================================
    // DESERT SKY
    // =====================================

    drawDesertSky() {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            "#ff8a3d"
        );


        gradient.addColorStop(
            0.48,
            "#ffbd66"
        );


        gradient.addColorStop(
            1,
            "#ffe4b5"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    },


    // =====================================
    // DESERT SUN
    // =====================================

    drawDesertSun() {

        const x =
            canvas.width - 145;

        const y = 115;


        const glow =
            ctx.createRadialGradient(
                x,
                y,
                25,
                x,
                y,
                115
            );


        glow.addColorStop(
            0,
            "rgba(255,255,180,1)"
        );


        glow.addColorStop(
            0.35,
            "rgba(255,193,7,0.55)"
        );


        glow.addColorStop(
            1,
            "rgba(255,152,0,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            115,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#fff59d";


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            50,
            0,
            Math.PI * 2
        );


        ctx.fill();

    },


    // =====================================
    // DESERT DUNES
    // =====================================

    drawDesertFarDunes() {

        this.drawMountainLayer(

            camera.x * 0.1,

            canvas.height - 185,

            50,

            22,

            "#d99b45",

            0.0018,

            0.004

        );

    },


    drawDesertNearDunes() {

        this.drawMountainLayer(

            camera.x * 0.22,

            canvas.height - 125,

            42,

            16,

            "#c78335",

            0.0025,

            0.006

        );

    },


    // =====================================
    // NIGHT SKY
    // =====================================

    drawNightSky() {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );


        gradient.addColorStop(
            0,
            "#020817"
        );


        gradient.addColorStop(
            0.55,
            "#0b1f45"
        );


        gradient.addColorStop(
            1,
            "#294b73"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    },


    // =====================================
    // STARS
    // =====================================

    drawStars() {

        for (
            const star of
            this.stars
        ) {

            const x =
                star.x *
                canvas.width;


            const y =
                star.y *
                canvas.height;


            ctx.globalAlpha =
                star.alpha;


            ctx.fillStyle =
                "#ffffff";


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                star.size,
                0,
                Math.PI * 2
            );


            ctx.fill();

        }


        ctx.globalAlpha = 1;

    },


    // =====================================
    // MOON
    // =====================================

    drawMoon() {

        const x =
            canvas.width - 145;

        const y = 110;


        const glow =
            ctx.createRadialGradient(
                x,
                y,
                30,
                x,
                y,
                100
            );


        glow.addColorStop(
            0,
            "rgba(236,239,241,0.45)"
        );


        glow.addColorStop(
            1,
            "rgba(236,239,241,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            100,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#eceff1";


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            42,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.fillStyle =
            "#cfd8dc";


        ctx.beginPath();


        ctx.arc(
            x - 12,
            y - 8,
            7,
            0,
            Math.PI * 2
        );


        ctx.arc(
            x + 13,
            y + 10,
            5,
            0,
            Math.PI * 2
        );


        ctx.arc(
            x + 10,
            y - 17,
            4,
            0,
            Math.PI * 2
        );


        ctx.fill();

    },


    // =====================================
    // NIGHT MOUNTAINS
    // =====================================

    drawNightFarMountains() {

        this.drawMountainLayer(

            camera.x * 0.1,

            canvas.height - 230,

            85,

            35,

            "#14294b",

            0.0025,

            0.006

        );

    },


    drawNightNearMountains() {

        this.drawMountainLayer(

            camera.x * 0.24,

            canvas.height - 155,

            70,

            30,

            "#0b1d38",

            0.0035,

            0.008

        );

    },


    // =====================================
    // MOUNTAIN LAYER
    // =====================================

    drawMountainLayer(
        offset,
        baseY,
        height1,
        height2,
        color,
        frequency1,
        frequency2
    ) {

        ctx.fillStyle =
            color;


        ctx.beginPath();


        ctx.moveTo(
            0,
            canvas.height
        );


        for (
            let screenX = -100;
            screenX <=
            canvas.width + 100;
            screenX += 40
        ) {

            const worldX =
                screenX +
                offset;


            const y =

                baseY -

                Math.sin(
                    worldX *
                    frequency1
                ) *
                height1 -

                Math.sin(
                    worldX *
                    frequency2
                ) *
                height2;


            ctx.lineTo(
                screenX,
                y
            );

        }


        ctx.lineTo(
            canvas.width,
            canvas.height
        );


        ctx.closePath();


        ctx.fill();

    },


    // =====================================
    // CLOUDS
    // =====================================

    drawClouds() {

        for (
            const cloud of
            this.clouds
        ) {

            const screenX =

                cloud.x -

                camera.x * 0.12;


            if (
                screenX < -250 ||
                screenX >
                canvas.width + 250
            ) {

                continue;

            }


            this.drawCloud(

                screenX,

                cloud.y,

                cloud.size,

                "rgba(255,255,255,0.82)"

            );

        }

    },


    // =====================================
    // DESERT CLOUDS
    // =====================================

    drawDesertClouds() {

        for (
            const cloud of
            this.clouds
        ) {

            const screenX =

                cloud.x -

                camera.x * 0.1;


            if (
                screenX < -250 ||
                screenX >
                canvas.width + 250
            ) {

                continue;

            }


            this.drawCloud(

                screenX,

                cloud.y,

                cloud.size * 0.75,

                "rgba(255,235,190,0.45)"

            );

        }

    },


    // =====================================
    // DRAW CLOUD
    // =====================================

    drawCloud(
        x,
        y,
        size,
        color
    ) {

        ctx.save();


        ctx.translate(
            x,
            y
        );


        ctx.scale(
            size,
            size
        );


        ctx.fillStyle =
            color;


        ctx.beginPath();


        ctx.arc(
            -32,
            5,
            24,
            0,
            Math.PI * 2
        );


        ctx.arc(
            0,
            -8,
            34,
            0,
            Math.PI * 2
        );


        ctx.arc(
            35,
            5,
            25,
            0,
            Math.PI * 2
        );


        ctx.arc(
            5,
            13,
            42,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.restore();

    }

};