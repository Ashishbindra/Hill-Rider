// =========================================
// HILL RIDER MAIN MENU
// menu.js
// =========================================

const Menu = {

    open: true,

    selectedMap: 0,

    maps: [

        {
            name: "GREEN HILLS",
            description: "EASY RIDE",
            skyTop: "#53b9ed",
            skyBottom: "#d7f2ff"
        },

        {
            name: "DESERT",
            description: "HOT & BUMPY",
            skyTop: "#ff9800",
            skyBottom: "#ffe0b2"
        },

        {
            name: "NIGHT HILLS",
            description: "DARK CHALLENGE",
            skyTop: "#071a3d",
            skyBottom: "#263b68"
        }

    ],

    buttons: [],


    // =====================================
    // CREATE
    // =====================================

    create() {

        this.open = true;

        this.selectedMap = 0;

        this.buttons = [];


        canvas.addEventListener(

            "click",

            event => {

                if (!this.open) {

                    return;

                }


                if (
                    typeof CarSelect !== "undefined" &&
                    CarSelect.open
                ) {

                    return;

                }


                const pointer =

                    this.getPointerPosition(
                        event
                    );


                this.handleClick(

                    pointer.x,

                    pointer.y

                );

            }

        );

    },


    // =====================================
    // POINTER POSITION
    // =====================================

    getPointerPosition(event) {

        const rect =

            canvas.getBoundingClientRect();


        const scaleX =

            canvas.width /

            rect.width;


        const scaleY =

            canvas.height /

            rect.height;


        return {

            x:

                (
                    event.clientX -
                    rect.left
                ) *

                scaleX,

            y:

                (
                    event.clientY -
                    rect.top
                ) *

                scaleY

        };

    },


    // =====================================
    // UPDATE
    // =====================================

    update() {

        if (!this.open) {

            return;

        }


        if (
            typeof CarSelect !== "undefined" &&
            CarSelect.open
        ) {

            CarSelect.update();

            return;

        }


        // =================================
        // CONTROLS OFF
        // =================================

        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        Physics.wheelSpeed = 0;


        // =================================
        // CAR START POSITION
        // =================================

        Body.setPosition(

            car,

            {

                x: 300,

                y: 100

            }

        );


        Body.setVelocity(

            car,

            {

                x: 0,

                y: 0

            }

        );


        Body.setAngle(

            car,

            0

        );


        Body.setAngularVelocity(

            car,

            0

        );


        // =================================
        // WHEEL 1 LOCK
        // =================================

        Body.setPosition(

            wheel1,

            {

                x:

                    300 -

                    CAR.wheelOffsetX,

                y:

                    100 +

                    CAR.wheelOffsetY

            }

        );


        Body.setVelocity(

            wheel1,

            {

                x: 0,

                y: 0

            }

        );


        Body.setAngularVelocity(

            wheel1,

            0

        );


        // =================================
        // WHEEL 2 LOCK
        // =================================

        Body.setPosition(

            wheel2,

            {

                x:

                    300 +

                    CAR.wheelOffsetX,

                y:

                    100 +

                    CAR.wheelOffsetY

            }

        );


        Body.setVelocity(

            wheel2,

            {

                x: 0,

                y: 0

            }

        );


        Body.setAngularVelocity(

            wheel2,

            0

        );


        // =================================
        // CAMERA RESET
        // =================================

        camera.x = 0;

    },


    // =====================================
    // HANDLE CLICK
    // =====================================

    handleClick(x, y) {

        for (
            const button of
            this.buttons
        ) {

            if (

                x < button.x ||

                x >
                button.x +
                button.width ||

                y < button.y ||

                y >
                button.y +
                button.height

            ) {

                continue;

            }


            // =================================
            // PLAY
            // =================================

            if (
                button.action ===
                "play"
            ) {

                this.startGame();

                return;

            }


            // =================================
            // MAP
            // =================================

            if (
                button.action ===
                "map"
            ) {

                this.selectedMap =

                    button.index;


                return;

            }


            // =================================
            // SELECT CAR
            // =================================

            if (
                button.action ===
                "car"
            ) {

                if (
                    typeof CarSelect !==
                    "undefined"
                ) {

                    CarSelect.show();

                }


                return;

            }

        }

    },


    // =====================================
    // START GAME
    // =====================================

    startGame() {

        // =================================
        // REMOVE MENU CAR
        // =================================

        Composite.remove(

            world,

            car

        );


        Composite.remove(

            world,

            wheel1

        );


        Composite.remove(

            world,

            wheel2

        );


        Composite.remove(

            world,

            axle1

        );


        Composite.remove(

            world,

            axle2

        );


        // =================================
        // REBUILD SELECTED MAP
        // =================================

        rebuildTerrain();


        // =================================
        // CREATE SELECTED CAR
        // =================================

        createCar(

            300,

            getTerrainY(300) - 70

        );


        // =================================
        // CAR RESET
        // =================================

        Body.setVelocity(

            car,

            {

                x: 0,

                y: 0

            }

        );


        Body.setAngle(

            car,

            0

        );


        Body.setAngularVelocity(

            car,

            0

        );


        // =================================
        // WHEEL RESET
        // =================================

        Body.setVelocity(

            wheel1,

            {

                x: 0,

                y: 0

            }

        );


        Body.setVelocity(

            wheel2,

            {

                x: 0,

                y: 0

            }

        );


        Body.setAngularVelocity(

            wheel1,

            0

        );


        Body.setAngularVelocity(

            wheel2,

            0

        );


        // =================================
        // RESET
        // =================================

        Physics.wheelSpeed = 0;


        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        camera.x = 0;

        camera.y = 0;


        Fuel.create();


        Coin.create();


        Particles.create();


        if (
            typeof Checkpoint !==
            "undefined"
        ) {

            Checkpoint.reset();

        }


        if (
            typeof MobileControls !==
            "undefined"
        ) {

            MobileControls.reset();

        }


        // =================================
        // GARAGE UPGRADES
        // =================================

        Garage.applyUpgrades();


        // =================================
        // CLOSE MENU
        // =================================

        this.open = false;


        // =================================
        // START SOUND
        // =================================

        Sound.start();

    },


    // =====================================
    // GET CURRENT MAP
    // =====================================

    getCurrentMap() {

        return this.maps[

            this.selectedMap

        ];

    },


    // =====================================
    // DRAW
    // =====================================

    draw() {

        if (!this.open) {

            return;

        }


        if (
            typeof CarSelect !== "undefined" &&
            CarSelect.open
        ) {

            CarSelect.draw();

            return;

        }


        this.buttons = [];


        this.drawBackground();


        this.drawTitle();


        this.drawMapSelection();


        this.drawCarButton();


        this.drawPlayButton();


        this.drawStats();

    },


    // =====================================
    // DRAW BACKGROUND
    // =====================================

    drawBackground() {

        const map =

            this.getCurrentMap();


        const gradient =

            ctx.createLinearGradient(

                0,

                0,

                0,

                canvas.height

            );


        gradient.addColorStop(

            0,

            map.skyTop

        );


        gradient.addColorStop(

            1,

            map.skyBottom

        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(

            0,

            0,

            canvas.width,

            canvas.height

        );


        // =================================
        // SUN / MOON
        // =================================

        ctx.fillStyle =

            this.selectedMap === 2

                ? "#eceff1"

                : "#fff176";


        ctx.beginPath();


        ctx.arc(

            canvas.width - 120,

            100,

            42,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // =================================
        // FAR HILLS
        // =================================

        ctx.fillStyle =

            this.selectedMap === 1

                ? "#d7a44a"

                : this.selectedMap === 2

                    ? "#172a50"

                    : "#8ab6b8";


        ctx.beginPath();


        ctx.moveTo(

            0,

            canvas.height

        );


        for (

            let x = 0;

            x <= canvas.width;

            x += 45

        ) {

            const y =

                canvas.height -

                170 -

                Math.sin(

                    x * 0.009

                ) *

                60 -

                Math.sin(

                    x * 0.021

                ) *

                20;


            ctx.lineTo(

                x,

                y

            );

        }


        ctx.lineTo(

            canvas.width,

            canvas.height

        );


        ctx.closePath();


        ctx.fill();


        // =================================
        // GROUND
        // =================================

        ctx.fillStyle =

            this.selectedMap === 1

                ? "#c9913d"

                : this.selectedMap === 2

                    ? "#24385c"

                    : "#4caf50";


        ctx.fillRect(

            0,

            canvas.height - 110,

            canvas.width,

            110

        );

    },


    // =====================================
    // DRAW TITLE
    // =====================================

    drawTitle() {

        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillStyle =

            "rgba(0,0,0,0.25)";


        ctx.font =

            "bold 64px Arial";


        ctx.fillText(

            "HILL RIDER",

            canvas.width / 2 + 4,

            74

        );


        ctx.fillStyle =
            "#ffffff";


        ctx.fillText(

            "HILL RIDER",

            canvas.width / 2,

            70

        );


        ctx.fillStyle =
            "#ffd600";


        ctx.font =

            "bold 18px Arial";


        ctx.fillText(

            "CLIMB • DRIVE • SURVIVE",

            canvas.width / 2,

            112

        );

    },


    // =====================================
    // DRAW MAP SELECTION
    // =====================================

    drawMapSelection() {

        const mobile =
            canvas.width < 700;


        const cardWidth =
            mobile ? 100 : 190;


        const cardHeight =
            mobile ? 80 : 120;


        const gap =
            mobile ? 8 : 20;


        const totalWidth =

            this.maps.length *

            cardWidth +

            (

                this.maps.length - 1

            ) *

            gap;


        const startX =

            Math.max(

                5,

                (

                    canvas.width -

                    totalWidth

                ) / 2

            );


        const y =
            mobile ? 150 : 145;


        for (

            let i = 0;

            i < this.maps.length;

            i++

        ) {

            const map =
                this.maps[i];


            const x =

                startX +

                i *

                (

                    cardWidth +

                    gap

                );


            const selected =

                i ===
                this.selectedMap;


            ctx.fillStyle =

                selected

                    ? "rgba(255,193,7,0.92)"

                    : "rgba(0,0,0,0.48)";


            ctx.beginPath();


            ctx.roundRect(

                x,

                y,

                cardWidth,

                cardHeight,

                10

            );


            ctx.fill();


            if (selected) {

                ctx.strokeStyle =
                    "#ffffff";


                ctx.lineWidth =
                    mobile ? 2 : 4;


                ctx.stroke();

            }


            ctx.fillStyle =

                selected

                    ? "#212121"

                    : "#ffffff";


            // MAP NAME

            ctx.font =

                "bold " +

                (

                    mobile ? 10 : 19

                ) +

                "px Arial";


            ctx.textAlign =
                "center";


            ctx.fillText(

                map.name,

                x +

                cardWidth / 2,

                y +

                (

                    mobile ? 25 : 42

                )

            );


            // DESCRIPTION

            ctx.font =

                (

                    mobile ? 8 : 13

                ) +

                "px Arial";


            ctx.fillText(

                map.description,

                x +

                cardWidth / 2,

                y +

                (

                    mobile ? 45 : 70

                )

            );


            // BUTTON

            ctx.font =

                "bold " +

                (

                    mobile ? 9 : 14

                ) +

                "px Arial";


            ctx.fillText(

                selected

                    ? "OK"

                    : "SELECT",

                x +

                cardWidth / 2,

                y +

                (

                    mobile ? 66 : 98

                )

            );


            this.buttons.push({

                action: "map",

                index: i,

                x: x,

                y: y,

                width: cardWidth,

                height: cardHeight

            });

        }

    },

    // =====================================
    // DRAW SELECT CAR BUTTON
    // =====================================

    drawCarButton() {

        const selectedCar =

            typeof CarSelect !==
                "undefined"

                ? CarSelect
                    .getSelectedCar()

                : {

                    name:
                        "RED RIDER",

                    color:
                        "#ff3b30"

                };


        const width =
            260;


        const height =
            58;


        const x =

            canvas.width / 2 -

            width / 2;


        const y =

            canvas.height -

            285;


        ctx.fillStyle =

            "rgba(38,50,56,0.92)";


        ctx.beginPath();


        ctx.roundRect(

            x,

            y,

            width,

            height,

            14

        );


        ctx.fill();


        ctx.strokeStyle =

            selectedCar.color;


        ctx.lineWidth =
            4;


        ctx.stroke();


        // =================================
        // CAR ICON
        // =================================

        ctx.fillStyle =

            selectedCar.color;


        ctx.fillRect(

            x + 20,

            y + 21,

            42,

            15

        );


        ctx.fillStyle =
            "#212121";


        ctx.beginPath();


        ctx.arc(

            x + 28,

            y + 39,

            7,

            0,

            Math.PI * 2

        );


        ctx.arc(

            x + 54,

            y + 39,

            7,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // =================================
        // TEXT
        // =================================

        ctx.fillStyle =
            "#ffffff";


        ctx.font =

            "bold 17px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(

            "SELECT CAR",

            x +

            width / 2 +

            25,

            y + 20

        );


        ctx.fillStyle =
            "#ffc107";


        ctx.font =

            "bold 13px Arial";


        ctx.fillText(

            selectedCar.name,

            x +

            width / 2 +

            25,

            y + 41

        );


        this.buttons.push({

            action: "car",

            x: x,

            y: y,

            width: width,

            height: height

        });

    },


    // =====================================
    // DRAW PLAY BUTTON
    // =====================================

    drawPlayButton() {

        const width =
            260;


        const height =
            72;


        const x =

            canvas.width / 2 -

            width / 2;


        const y =

            canvas.height -

            205;


        const gradient =

            ctx.createLinearGradient(

                0,

                y,

                0,

                y + height

            );


        gradient.addColorStop(

            0,

            "#76d275"

        );


        gradient.addColorStop(

            1,

            "#2e7d32"

        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();


        ctx.roundRect(

            x,

            y,

            width,

            height,

            16

        );


        ctx.fill();


        ctx.strokeStyle =
            "#ffffff";


        ctx.lineWidth =
            4;


        ctx.stroke();


        ctx.fillStyle =
            "#ffffff";


        ctx.font =

            "bold 31px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(

            "▶ PLAY",

            canvas.width / 2,

            y +

            height / 2

        );


        this.buttons.push({

            action: "play",

            x: x,

            y: y,

            width: width,

            height: height

        });

    },


    // =====================================
    // DRAW STATS
    // =====================================

    drawStats() {

        ctx.fillStyle =

            "rgba(0,0,0,0.5)";


        ctx.beginPath();


        ctx.roundRect(

            20,

            canvas.height - 82,

            270,

            55,

            12

        );


        ctx.fill();


        ctx.fillStyle =
            "#ffffff";


        ctx.textAlign =
            "left";


        ctx.font =

            "bold 16px Arial";


        ctx.fillText(

            "BEST  " +

            Save.getBestDistance() +

            " m",

            38,

            canvas.height - 55

        );


        ctx.fillStyle =
            "#ffc107";


        ctx.fillText(

            "COINS  " +

            Save.getCoins(),

            165,

            canvas.height - 55

        );


        ctx.fillStyle =

            "rgba(0,0,0,0.5)";


        ctx.beginPath();


        ctx.roundRect(

            canvas.width - 230,

            canvas.height - 82,

            210,

            55,

            12

        );


        ctx.fill();


        ctx.fillStyle =
            "#ffffff";


        ctx.textAlign =
            "center";


        ctx.fillText(

            "G  OPEN GARAGE",

            canvas.width - 125,

            canvas.height - 55

        );

    }

};