// =========================================
// HILL RIDER CAR SELECTION SYSTEM
// car-select.js
// =========================================

const CarSelect = {

    selectedCar: 0,

    previewCar: 0,

    open: false,

    buttons: [],


    // =====================================
    // CARS
    // =====================================

    cars: [

        {

            id: 0,

            name: "RED RIDER",

            description:
                "BALANCED CAR",

            bodyWidth: 120,

            bodyHeight: 30,

            wheelRadius: 20,

            wheelOffsetX: 40,

            wheelOffsetY: 25,

            acceleration: 1,

            maxSpeed: 1,

            airControl: 1,

            grip: 1,

            color: "#ff3b30",

            roofColor: "#ff9800",

            price: 0

        },


        {

            id: 1,

            name: "MONSTER TRUCK",

            description:
                "POWER & BIG WHEELS",

            bodyWidth: 145,

            bodyHeight: 38,

            wheelRadius: 28,

            wheelOffsetX: 50,

            wheelOffsetY: 32,

            acceleration: 0.88,

            maxSpeed: 0.9,

            airControl: 0.72,

            grip: 1.3,

            color: "#3949ab",

            roofColor: "#5c6bc0",

            price: 500

        },


        {

            id: 2,

            name: "DESERT BUGGY",

            description:
                "FAST & LIGHT",

            bodyWidth: 110,

            bodyHeight: 26,

            wheelRadius: 18,

            wheelOffsetX: 38,

            wheelOffsetY: 23,

            acceleration: 1.25,

            maxSpeed: 1.18,

            airControl: 1.3,

            grip: 0.82,

            color: "#f9a825",

            roofColor: "#212121",

            price: 1000

        },
        // =====================================
        // HILL BIKE
        // =====================================

        {

            id: 3,

            type: "bike",

            name: "HILL BIKE",

            description:
                "FAST & EXTREME BALANCE",

            bodyWidth: 82,

            bodyHeight: 14,

            wheelRadius: 17,

            wheelOffsetX: 32,

            wheelOffsetY: 22,

            acceleration: 1.35,

            maxSpeed: 1.22,

            airControl: 1.5,

            grip: 0.92,

            color: "#e53935",

            roofColor: "#212121",

            price: 1500

        },


        // =====================================
        // MOUNTAIN CYCLE
        // =====================================

        {

            id: 4,

            type: "cycle",

            name: "MOUNTAIN CYCLE",

            description:
                "LIGHT & HUMAN POWER",

            bodyWidth: 76,

            bodyHeight: 12,

            wheelRadius: 18,

            wheelOffsetX: 31,

            wheelOffsetY: 21,

            acceleration: 0.72,

            maxSpeed: 0.72,

            airControl: 1.35,

            grip: 0.95,

            color: "#00c853",

            roofColor: "#212121",

            price: 800

        },


        // =====================================
        // CITY TEMPU
        // =====================================

        {

            id: 5,

            type: "tempu",

            name: "CITY TEMPU",

            description:
                "HEAVY & STRONG AUTO",

            bodyWidth: 112,

            bodyHeight: 42,

            wheelRadius: 18,

            wheelOffsetX: 39,

            wheelOffsetY: 31,

            acceleration: 0.92,

            maxSpeed: 0.88,

            airControl: 0.65,

            grip: 1.18,

            color: "#f9a825",

            roofColor: "#212121",

            price: 2200

        }
        ,


        // =====================================
        // HILL TRAIN
        // =====================================

        {

            id: 6,

            type: "train",

            name: "HILL TRAIN",

            description:
                "ENGINE + 4 BOGIES",

            bodyWidth: 135,

            bodyHeight: 48,

            wheelRadius: 17,

            wheelOffsetX: 43,

            wheelOffsetY: 31,

            acceleration: 0.82,

            maxSpeed: 0.78,

            airControl: 0.25,

            grip: 1.30,

            color: "#d32f2f",

            roofColor: "#263238",

            price: 5000

        }
    ],


    // =====================================
    // CREATE
    // =====================================

    create() {

        this.open = false;

        this.buttons = [];


        const savedCar =

            Number(

                localStorage.getItem(
                    "hillRiderSelectedCar"
                )

            );


        if (

            Number.isInteger(
                savedCar
            ) &&

            savedCar >= 0 &&

            savedCar <
            this.cars.length

        ) {

            this.selectedCar =
                savedCar;

        }

        else {

            this.selectedCar = 0;

        }


        this.previewCar =
            this.selectedCar;


        canvas.addEventListener(

            "click",

            event => {

                if (!this.open) {

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


        window.addEventListener(

            "keydown",

            event => {

                if (!this.open) {

                    return;

                }


                if (
                    event.code ===
                    "ArrowLeft"
                ) {

                    event.preventDefault();

                    this.previousCar();

                }


                if (
                    event.code ===
                    "ArrowRight"
                ) {

                    event.preventDefault();

                    this.nextCar();

                }


                if (
                    event.code ===
                    "Enter"
                ) {

                    event.preventDefault();

                    this.selectCar(
                        this.previewCar
                    );

                }


                if (
                    event.code ===
                    "Escape"
                ) {

                    event.preventDefault();

                    this.close();

                }

            }

        );

    },


    // =====================================
    // GET SELECTED CAR
    // =====================================

    getSelectedCar() {

        return (

            this.cars[
            this.selectedCar
            ] ||

            this.cars[0]

        );

    },


    // =====================================
    // GET PREVIEW CAR
    // =====================================

    getPreviewCar() {

        return (

            this.cars[
            this.previewCar
            ] ||

            this.cars[0]

        );

    },


    // =====================================
    // OPEN
    // =====================================

    show() {

        if (
            gameOver ||
            Pause.open
        ) {

            return;

        }


        this.previewCar =
            this.selectedCar;


        this.open = true;


        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        Physics.wheelSpeed = 0;


        if (
            typeof MobileControls !==
            "undefined"
        ) {

            MobileControls.reset();

        }


        Sound.stop();

    },


    // =====================================
    // CLOSE
    // =====================================

    close() {

        this.open = false;


        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        Physics.wheelSpeed = 0;


        if (
            typeof MobileControls !==
            "undefined"
        ) {

            MobileControls.reset();

        }


        if (
            !Menu.open &&
            !gameOver &&
            !Pause.open
        ) {

            Sound.start();

        }

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
    // IS INSIDE
    // =====================================

    isInside(
        x,
        y,
        button
    ) {

        return (

            x >= button.x &&

            x <=
            button.x +
            button.width &&

            y >= button.y &&

            y <=
            button.y +
            button.height

        );

    },


    // =====================================
    // PREVIOUS CAR
    // =====================================

    previousCar() {

        this.previewCar--;


        if (
            this.previewCar < 0
        ) {

            this.previewCar =

                this.cars.length - 1;

        }


        this.playMoveSound();

    },


    // =====================================
    // NEXT CAR
    // =====================================

    nextCar() {

        this.previewCar++;


        if (
            this.previewCar >=
            this.cars.length
        ) {

            this.previewCar = 0;

        }


        this.playMoveSound();

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

                !this.isInside(
                    x,
                    y,
                    button
                )

            ) {

                continue;

            }


            if (
                button.action ===
                "close"
            ) {

                this.close();

                return;

            }


            if (
                button.action ===
                "previous"
            ) {

                this.previousCar();

                return;

            }


            if (
                button.action ===
                "next"
            ) {

                this.nextCar();

                return;

            }


            if (
                button.action ===
                "select"
            ) {

                this.selectCar(
                    this.previewCar
                );

                return;

            }

        }

    },


    // =====================================
    // SELECT CAR
    // =====================================

    selectCar(carId) {

        const selected =

            this.cars[
            carId
            ];


        if (!selected) {

            return;

        }


        const unlocked =

            this.isUnlocked(
                carId
            );


        // =================================
        // UNLOCK CAR
        // =================================

        if (!unlocked) {

            if (
                Coin.total <
                selected.price
            ) {

                this.playErrorSound();

                return;

            }


            Coin.total -=
                selected.price;


            Save.updateCoins(
                Coin.total
            );


            this.unlockCar(
                carId
            );

        }


        // =================================
        // SELECT CAR
        // =================================

        this.selectedCar =
            carId;


        this.previewCar =
            carId;


        localStorage.setItem(

            "hillRiderSelectedCar",

            String(
                carId
            )

        );


        // =====================================
        // LIVE CAR REBUILD
        // =====================================

        if (
            typeof Garage !==
            "undefined"
        ) {

            Garage.load();

        }


        if (
            typeof rebuildCar ===
            "function"
        ) {

            rebuildCar();

        }


        if (
            typeof Garage !==
            "undefined"
        ) {

            Garage.applyUpgrades();

        }


        this.playSelectSound();

    },


    // =====================================
    // UNLOCK CAR
    // =====================================

    unlockCar(carId) {

        const unlocked =

            this.getUnlockedCars();


        if (
            !unlocked.includes(
                carId
            )
        ) {

            unlocked.push(
                carId
            );

        }


        localStorage.setItem(

            "hillRiderUnlockedCars",

            JSON.stringify(
                unlocked
            )

        );

    },


    // =====================================
    // GET UNLOCKED CARS
    // =====================================

    getUnlockedCars() {

        let unlocked = [0];


        try {

            const saved =

                JSON.parse(

                    localStorage.getItem(
                        "hillRiderUnlockedCars"
                    )

                );


            if (
                Array.isArray(
                    saved
                )
            ) {

                unlocked =
                    saved;

            }

        }

        catch (error) {

            unlocked = [0];

        }


        if (
            !unlocked.includes(0)
        ) {

            unlocked.push(0);

        }


        return unlocked;

    },


    // =====================================
    // IS UNLOCKED
    // =====================================

    isUnlocked(carId) {

        return this
            .getUnlockedCars()
            .includes(
                carId
            );

    },


    // =====================================
    // UPDATE
    // =====================================

    update() {

        if (!this.open) {

            return;

        }


        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        Physics.wheelSpeed = 0;

    },


    // =====================================
    // DRAW
    // =====================================

    draw() {

        if (!this.open) {

            return;

        }


        this.buttons = [];


        // =================================
        // BACKGROUND
        // =================================

        ctx.fillStyle =

            "rgba(8,15,20,0.97)";


        ctx.fillRect(

            0,

            0,

            canvas.width,

            canvas.height

        );


        // =================================
        // TITLE
        // =================================

        ctx.fillStyle =
            "#ffffff";


        ctx.font =

            canvas.height < 500

                ? "bold 27px Arial"

                : "bold 38px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            "SELECT CAR",

            canvas.width / 2,

            canvas.height < 500
                ? 28
                : 45

        );


        // =================================
        // COINS
        // =================================

        ctx.fillStyle =
            "#FFD54F";


        ctx.font =

            canvas.height < 500

                ? "bold 16px Arial"

                : "bold 20px Arial";


        ctx.fillText(

            "COINS : " +
            Coin.total,

            canvas.width / 2,

            canvas.height < 500
                ? 58
                : 82

        );


        // =================================
        // CAR CARD
        // =================================

        this.drawCurrentCar();


        // =================================
        // CLOSE BUTTON
        // =================================

        this.drawCloseButton();

    },


    // =====================================
    // DRAW CURRENT CAR
    // =====================================

    drawCurrentCar() {

        const carData =

            this.getPreviewCar();


        const compact =

            canvas.height < 500;


        const cardWidth =

            Math.min(

                compact
                    ? 430
                    : 500,

                canvas.width - 180

            );


        const cardHeight =

            compact
                ? 285
                : 400;


        const x =

            canvas.width / 2 -

            cardWidth / 2;


        const y =

            compact
                ? 72
                : 110;


        const selected =

            this.selectedCar ===
            carData.id;


        const unlocked =

            this.isUnlocked(
                carData.id
            );


        // =================================
        // CARD
        // =================================

        ctx.fillStyle =

            selected

                ? "rgba(255,193,7,0.18)"

                : "rgba(38,50,56,0.98)";


        ctx.beginPath();


        ctx.roundRect(

            x,

            y,

            cardWidth,

            cardHeight,

            22

        );


        ctx.fill();


        ctx.strokeStyle =

            selected

                ? "#FFC107"

                : "#546e7a";


        ctx.lineWidth =

            selected
                ? 5
                : 3;


        ctx.stroke();


        // =================================
        // PREVIOUS BUTTON
        // =================================

        const arrowSize =

            compact
                ? 58
                : 70;


        const previousButton = {

            x:

                Math.max(

                    15,

                    x -
                    arrowSize -
                    20

                ),

            y:

                y +
                cardHeight / 2 -
                arrowSize / 2,

            width:
                arrowSize,

            height:
                arrowSize

        };


        this.drawArrowButton(

            previousButton,

            "◀"

        );


        this.buttons.push({

            action:
                "previous",

            ...previousButton

        });


        // =================================
        // NEXT BUTTON
        // =================================

        const nextButton = {

            x:

                Math.min(

                    canvas.width -
                    arrowSize -
                    15,

                    x +
                    cardWidth +
                    20

                ),

            y:

                y +
                cardHeight / 2 -
                arrowSize / 2,

            width:
                arrowSize,

            height:
                arrowSize

        };


        this.drawArrowButton(

            nextButton,

            "▶"

        );


        this.buttons.push({

            action:
                "next",

            ...nextButton

        });


        // =================================
        // CAR PREVIEW
        // =================================

        this.drawPreviewCar(

            carData,

            canvas.width / 2,

            y +
            (
                compact
                    ? 67
                    : 100
            ),

            compact
                ? 0.75
                : 1

        );


        // =================================
        // CAR NAME
        // =================================

        ctx.fillStyle =
            "#ffffff";


        ctx.font =

            compact

                ? "bold 21px Arial"

                : "bold 28px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(

            carData.name,

            canvas.width / 2,

            y +
            (
                compact
                    ? 122
                    : 175
            )

        );


        // =================================
        // DESCRIPTION
        // =================================

        ctx.fillStyle =
            "#b0bec5";


        ctx.font =

            compact

                ? "12px Arial"

                : "15px Arial";


        ctx.fillText(

            carData.description,

            canvas.width / 2,

            y +
            (
                compact
                    ? 148
                    : 207
            )

        );


        // =================================
        // STATS
        // =================================

        const statWidth =

            Math.min(

                300,

                cardWidth - 70

            );


        const statX =

            canvas.width / 2 -

            statWidth / 2;


        const statStartY =

            y +
            (
                compact
                    ? 178
                    : 245
            );


        const statGap =

            compact
                ? 24
                : 32;


        this.drawStat(

            "SPEED",

            carData.maxSpeed,

            statX,

            statStartY,

            statWidth

        );


        this.drawStat(

            "POWER",

            carData.acceleration,

            statX,

            statStartY +
            statGap,

            statWidth

        );


        this.drawStat(

            "GRIP",

            carData.grip,

            statX,

            statStartY +
            statGap * 2,

            statWidth

        );


        // =================================
        // SELECT BUTTON
        // =================================

        const selectWidth =

            Math.min(

                300,

                cardWidth - 60

            );


        const selectButton = {

            x:

                canvas.width / 2 -

                selectWidth / 2,

            y:

                y +
                cardHeight -
                (
                    compact
                        ? 45
                        : 60
                ),

            width:
                selectWidth,

            height:

                compact
                    ? 36
                    : 44

        };


        if (selected) {

            ctx.fillStyle =
                "#43a047";

        }

        else if (unlocked) {

            ctx.fillStyle =
                "#1976d2";

        }

        else {

            ctx.fillStyle =
                "#ef6c00";

        }


        ctx.beginPath();


        ctx.roundRect(

            selectButton.x,

            selectButton.y,

            selectButton.width,

            selectButton.height,

            10

        );


        ctx.fill();


        ctx.fillStyle =
            "#ffffff";


        ctx.font =

            compact

                ? "bold 14px Arial"

                : "bold 17px Arial";


        let buttonText;


        if (selected) {

            buttonText =
                "SELECTED";

        }

        else if (unlocked) {

            buttonText =
                "SELECT";

        }

        else {

            buttonText =

                "UNLOCK " +

                carData.price +

                " COINS";

        }


        ctx.fillText(

            buttonText,

            canvas.width / 2,

            selectButton.y +

            selectButton.height / 2

        );


        this.buttons.push({

            action:
                "select",

            ...selectButton

        });


        // =================================
        // PAGE DOTS
        // =================================

        this.drawPageDots(

            y +
            cardHeight +
            (
                compact
                    ? 14
                    : 20
            )

        );

    },


    // =====================================
    // DRAW ARROW BUTTON
    // =====================================

    drawArrowButton(
        button,
        icon
    ) {

        ctx.fillStyle =

            "rgba(255,193,7,0.92)";


        ctx.beginPath();


        ctx.roundRect(

            button.x,

            button.y,

            button.width,

            button.height,

            15

        );


        ctx.fill();


        ctx.fillStyle =
            "#212121";


        ctx.font =

            "bold 27px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            icon,

            button.x +
            button.width / 2,

            button.y +
            button.height / 2

        );

    },


    // =====================================
    // DRAW PAGE DOTS
    // =====================================

    drawPageDots(y) {

        const gap = 24;


        const startX =

            canvas.width / 2 -

            (
                (
                    this.cars.length - 1
                ) *

                gap

            ) / 2;


        for (

            let i = 0;

            i < this.cars.length;

            i++

        ) {

            ctx.fillStyle =

                i ===
                    this.previewCar

                    ? "#FFC107"

                    : "#546e7a";


            ctx.beginPath();


            ctx.arc(

                startX +
                i * gap,

                y,

                i ===
                    this.previewCar

                    ? 6

                    : 4,

                0,

                Math.PI * 2

            );


            ctx.fill();

        }

    },


    // =====================================
    // DRAW CLOSE BUTTON
    // =====================================

    drawCloseButton() {

        const compact =

            canvas.height < 500;


        const closeButton = {

            x:

                canvas.width / 2 -
                85,

            y:

                canvas.height -
                (
                    compact
                        ? 42
                        : 58
                ),

            width:
                170,

            height:

                compact
                    ? 32
                    : 42

        };


        ctx.fillStyle =
            "#455a64";


        ctx.beginPath();


        ctx.roundRect(

            closeButton.x,

            closeButton.y,

            closeButton.width,

            closeButton.height,

            9

        );


        ctx.fill();


        ctx.fillStyle =
            "#ffffff";


        ctx.font =

            compact

                ? "bold 13px Arial"

                : "bold 16px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            "CLOSE",

            canvas.width / 2,

            closeButton.y +

            closeButton.height / 2

        );


        this.buttons.push({

            action:
                "close",

            ...closeButton

        });

    },


    // =====================================
    // DRAW STAT
    // =====================================

    drawStat(
        name,
        value,
        x,
        y,
        width
    ) {

        ctx.fillStyle =
            "#cfd8dc";


        ctx.font =
            "bold 12px Arial";


        ctx.textAlign =
            "left";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            name,

            x,

            y

        );


        const barX =
            x + 65;


        const barWidth =
            width - 65;


        ctx.fillStyle =
            "#37474f";


        ctx.fillRect(

            barX,

            y - 5,

            barWidth,

            10

        );


        const normalized =

            Math.min(

                1,

                value / 1.3

            );


        ctx.fillStyle =
            "#FFC107";


        ctx.fillRect(

            barX,

            y - 5,

            barWidth *
            normalized,

            10

        );

    },

    // =====================================
    // DRAW PREVIEW CAR
    // =====================================

    drawPreviewCar(
        carData,
        x,
        y,
        scale
    ) {

        ctx.save();


        ctx.translate(
            x,
            y
        );


        ctx.scale(
            scale,
            scale
        );


        // =================================
        // SHADOW
        // =================================

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";


        ctx.beginPath();


        ctx.ellipse(

            0,

            carData.wheelOffsetY + 25,

            carData.bodyWidth * 0.6,

            12,

            0,

            0,

            Math.PI * 2

        );


        ctx.fill();

        // =================================
        // TRAIN PREVIEW
        // =================================

        if (
            carData.type === "train"
        ) {

            // ENGINE

            ctx.fillStyle =
                carData.color;


            ctx.fillRect(

                -55,

                -18,

                75,

                42

            );


            // ENGINE FRONT

            ctx.fillRect(

                20,

                -5,

                28,

                29

            );


            // CABIN

            ctx.fillStyle =
                carData.roofColor;


            ctx.fillRect(

                -45,

                -42,

                42,

                25

            );


            // WINDOW

            ctx.fillStyle =
                "#81d4fa";


            ctx.fillRect(

                -37,

                -36,

                25,

                14

            );


            // CHIMNEY

            ctx.fillStyle =
                "#212121";


            ctx.fillRect(

                24,

                -29,

                12,

                27

            );


            ctx.fillRect(

                19,

                -34,

                22,

                7

            );


            // ENGINE WHEELS

            this.drawPreviewWheel(

                -35,

                25,

                14

            );


            this.drawPreviewWheel(

                22,

                25,

                14

            );


            // =================================
            // 4 BOGIES
            // =================================

            for (
                let i = 0;
                i < 4;
                i++
            ) {

                const bogieX =

                    -95 -
                    i * 63;


                // CONNECTOR

                ctx.strokeStyle =
                    "#37474f";


                ctx.lineWidth =
                    4;


                ctx.beginPath();


                ctx.moveTo(

                    bogieX + 30,

                    8

                );


                ctx.lineTo(

                    bogieX + 38,

                    8

                );


                ctx.stroke();


                // BOGIE BODY

                ctx.fillStyle =

                    i % 2 === 0
                        ? "#1976d2"
                        : "#388e3c";


                ctx.beginPath();


                ctx.roundRect(

                    bogieX - 27,

                    -14,

                    55,

                    34,

                    5

                );


                ctx.fill();


                // BOGIE ROOF

                ctx.fillStyle =
                    "#263238";


                ctx.fillRect(

                    bogieX - 30,

                    -19,

                    61,

                    7

                );


                // WINDOWS

                ctx.fillStyle =
                    "#b3e5fc";


                ctx.fillRect(

                    bogieX - 20,

                    -7,

                    13,

                    12

                );


                ctx.fillRect(

                    bogieX + 5,

                    -7,

                    13,

                    12

                );


                // WHEELS

                this.drawPreviewWheel(

                    bogieX - 17,

                    21,

                    9

                );


                this.drawPreviewWheel(

                    bogieX + 17,

                    21,

                    9

                );

            }


            ctx.restore();

            return;

        }
        // =================================
        // TEMPU PREVIEW
        // =================================

        if (
            carData.type === "tempu"
        ) {

            // WHEELS

            this.drawPreviewWheel(

                -carData.wheelOffsetX,

                carData.wheelOffsetY,

                carData.wheelRadius

            );


            this.drawPreviewWheel(

                carData.wheelOffsetX,

                carData.wheelOffsetY,

                carData.wheelRadius

            );


            // MAIN BODY

            ctx.fillStyle =
                carData.color;


            ctx.beginPath();


            ctx.roundRect(

                -55,

                -20,

                110,

                48,

                8

            );


            ctx.fill();


            // FRONT NOSE

            ctx.beginPath();


            ctx.moveTo(
                55,
                -8
            );


            ctx.lineTo(
                65,
                2
            );


            ctx.lineTo(
                65,
                24
            );


            ctx.lineTo(
                48,
                24
            );


            ctx.closePath();


            ctx.fill();


            // BLACK ROOF

            ctx.fillStyle =
                carData.roofColor;


            ctx.beginPath();


            ctx.roundRect(

                -48,

                -43,

                88,

                27,

                10

            );


            ctx.fill();


            // FRONT PILLAR

            ctx.fillRect(

                35,

                -25,

                9,

                48

            );


            // WINDSCREEN

            ctx.fillStyle =
                "#81d4fa";


            ctx.beginPath();


            ctx.moveTo(
                17,
                -38
            );


            ctx.lineTo(
                34,
                -38
            );


            ctx.lineTo(
                34,
                -17
            );


            ctx.lineTo(
                13,
                -17
            );


            ctx.closePath();


            ctx.fill();


            // SIDE WINDOW

            ctx.fillStyle =
                "#b3e5fc";


            ctx.fillRect(

                -31,

                -37,

                38,

                19

            );


            // WINDOW BARS

            ctx.strokeStyle =
                "#263238";


            ctx.lineWidth =
                3;


            ctx.beginPath();


            ctx.moveTo(
                -17,
                -37
            );


            ctx.lineTo(
                -17,
                -18
            );


            ctx.stroke();


            // FRONT GLASS BORDER

            ctx.beginPath();


            ctx.moveTo(
                10,
                -40
            );


            ctx.lineTo(
                10,
                -17
            );


            ctx.stroke();


            // BUMPER

            ctx.fillStyle =
                "#37474f";


            ctx.fillRect(

                55,

                17,

                16,

                6

            );


            // HEADLIGHT

            ctx.fillStyle =
                "#fff59d";


            ctx.beginPath();


            ctx.arc(

                59,

                5,

                5,

                0,

                Math.PI * 2

            );


            ctx.fill();


            // BACK LIGHT

            ctx.fillStyle =
                "#d50000";


            ctx.fillRect(

                -57,

                3,

                5,

                10

            );


            // DRIVER HEAD

            ctx.fillStyle =
                "#d89b72";


            ctx.beginPath();


            ctx.arc(

                23,

                -27,

                7,

                0,

                Math.PI * 2

            );


            ctx.fill();


            // DRIVER BODY

            ctx.fillStyle =
                "#1565c0";


            ctx.fillRect(

                17,

                -20,

                13,

                18

            );


            // TEMPU STRIPE

            ctx.fillStyle =
                "#212121";


            ctx.fillRect(

                -52,

                7,

                104,

                6

            );


            ctx.restore();

            return;

        }
        // =================================
        // =================================
        // CYCLE PREVIEW
        // =================================

        if (
            carData.type === "cycle"
        ) {

            // =============================
            // WHEELS
            // =============================

            this.drawPreviewWheel(

                -carData.wheelOffsetX,

                carData.wheelOffsetY,

                carData.wheelRadius

            );


            this.drawPreviewWheel(

                carData.wheelOffsetX,

                carData.wheelOffsetY,

                carData.wheelRadius

            );


            // =============================
            // CYCLE FRAME
            // =============================

            ctx.strokeStyle =
                carData.color;


            ctx.lineWidth = 4;


            ctx.lineCap =
                "round";


            ctx.lineJoin =
                "round";


            ctx.beginPath();


            // REAR WHEEL TO SEAT

            ctx.moveTo(
                -31,
                21
            );


            ctx.lineTo(
                -9,
                -3
            );


            // SEAT TO PEDAL

            ctx.lineTo(
                0,
                20
            );


            // PEDAL TO REAR WHEEL

            ctx.lineTo(
                -31,
                21
            );


            // REAR TO FRONT FRAME

            ctx.moveTo(
                -9,
                -3
            );


            ctx.lineTo(
                20,
                1
            );


            ctx.lineTo(
                0,
                20
            );


            ctx.lineTo(
                31,
                21
            );


            ctx.stroke();


            // =============================
            // FRONT FORK
            // =============================

            ctx.strokeStyle =
                "#b0bec5";


            ctx.lineWidth = 3;


            ctx.beginPath();


            ctx.moveTo(
                20,
                1
            );


            ctx.lineTo(
                31,
                21
            );


            ctx.stroke();


            // =============================
            // HANDLE STEM
            // =============================

            ctx.beginPath();


            ctx.moveTo(
                20,
                1
            );


            ctx.lineTo(
                23,
                -12
            );


            ctx.stroke();


            // =============================
            // HANDLE
            // =============================

            ctx.strokeStyle =
                "#263238";


            ctx.lineWidth = 3;


            ctx.beginPath();


            ctx.moveTo(
                18,
                -12
            );


            ctx.lineTo(
                29,
                -12
            );


            ctx.stroke();


            // =============================
            // SEAT
            // =============================

            ctx.strokeStyle =
                "#212121";


            ctx.lineWidth = 5;


            ctx.beginPath();


            ctx.moveTo(
                -15,
                -5
            );


            ctx.lineTo(
                -4,
                -5
            );


            ctx.stroke();


            // =============================
            // PEDAL
            // =============================

            ctx.strokeStyle =
                "#455a64";


            ctx.lineWidth = 2;


            ctx.beginPath();


            ctx.arc(

                0,

                20,

                5,

                0,

                Math.PI * 2

            );


            ctx.stroke();


            ctx.beginPath();


            ctx.moveTo(
                -5,
                20
            );


            ctx.lineTo(
                5,
                20
            );


            ctx.stroke();


            // =============================
            // RIDER LEG
            // =============================

            ctx.strokeStyle =
                "#263238";


            ctx.lineWidth = 5;


            ctx.beginPath();


            ctx.moveTo(
                -7,
                -7
            );


            ctx.lineTo(
                0,
                6
            );


            ctx.lineTo(
                5,
                20
            );


            ctx.stroke();


            // =============================
            // RIDER BODY
            // =============================

            ctx.strokeStyle =
                "#7b1fa2";


            ctx.lineWidth = 8;


            ctx.beginPath();


            ctx.moveTo(
                -7,
                -8
            );


            ctx.lineTo(
                3,
                -30
            );


            ctx.lineTo(
                20,
                -13
            );


            ctx.stroke();


            // =============================
            // RIDER ARM
            // =============================

            ctx.strokeStyle =
                "#d89b72";


            ctx.lineWidth = 5;


            ctx.beginPath();


            ctx.moveTo(
                3,
                -26
            );


            ctx.lineTo(
                13,
                -20
            );


            ctx.lineTo(
                23,
                -12
            );


            ctx.stroke();


            // =============================
            // HEAD
            // =============================

            ctx.fillStyle =
                "#d89b72";


            ctx.beginPath();


            ctx.arc(

                3,

                -40,

                9,

                0,

                Math.PI * 2

            );


            ctx.fill();


            // =============================
            // HELMET
            // =============================

            ctx.fillStyle =
                "#00c853";


            ctx.beginPath();


            ctx.arc(

                3,

                -42,

                10,

                Math.PI,

                Math.PI * 2

            );


            ctx.fill();


            ctx.restore();

            return;

        }


        // =================================
        // NORMAL CAR WHEELS
        // =================================

        this.drawPreviewWheel(

            -carData.wheelOffsetX,

            carData.wheelOffsetY,

            carData.wheelRadius

        );


        this.drawPreviewWheel(

            carData.wheelOffsetX,

            carData.wheelOffsetY,

            carData.wheelRadius

        );


        // =================================
        // NORMAL CAR BODY
        // =================================

        ctx.fillStyle =
            carData.color;


        ctx.beginPath();


        ctx.roundRect(

            -carData.bodyWidth / 2,

            -carData.bodyHeight / 2,

            carData.bodyWidth,

            carData.bodyHeight,

            7

        );


        ctx.fill();


        // =================================
        // CABIN
        // =================================

        ctx.fillStyle =
            carData.roofColor;


        ctx.beginPath();


        ctx.moveTo(

            -22,

            -carData.bodyHeight / 2

        );


        ctx.lineTo(

            -10,

            -carData.bodyHeight / 2 -
            25

        );


        ctx.lineTo(

            18,

            -carData.bodyHeight / 2 -
            25

        );


        ctx.lineTo(

            33,

            -carData.bodyHeight / 2

        );


        ctx.closePath();


        ctx.fill();


        // =================================
        // WINDOWS
        // =================================

        ctx.fillStyle =
            "#b3e5fc";


        ctx.fillRect(

            -6,

            -carData.bodyHeight / 2 -
            21,

            20,

            16

        );


        // =================================
        // HEADLIGHT
        // =================================

        ctx.fillStyle =
            "#fff59d";


        ctx.beginPath();


        ctx.arc(

            carData.bodyWidth / 2 - 4,

            -3,

            4,

            0,

            Math.PI * 2

        );


        ctx.fill();


        ctx.restore();

    },


    // =====================================
    // DRAW PREVIEW WHEEL
    // =====================================

    drawPreviewWheel(
        x,
        y,
        radius
    ) {

        ctx.fillStyle =
            "#171717";


        ctx.beginPath();


        ctx.arc(

            x,

            y,

            radius,

            0,

            Math.PI * 2

        );


        ctx.fill();


        ctx.fillStyle =
            "#b0bec5";


        ctx.beginPath();


        ctx.arc(

            x,

            y,

            radius * 0.5,

            0,

            Math.PI * 2

        );


        ctx.fill();


        ctx.fillStyle =
            "#455a64";


        ctx.beginPath();


        ctx.arc(

            x,

            y,

            radius * 0.2,

            0,

            Math.PI * 2

        );


        ctx.fill();

    },


    // =====================================
    // MOVE SOUND
    // =====================================

    playMoveSound() {

        if (
            typeof Sound ===
            "undefined"
        ) {

            return;

        }


        Sound.start();


        Sound.playTone(

            420,

            0.05,

            "sine",

            0.07

        );

    },


    // =====================================
    // SELECT SOUND
    // =====================================

    playSelectSound() {

        if (
            typeof Sound ===
            "undefined"
        ) {

            return;

        }


        Sound.start();


        Sound.playTone(

            650,

            0.08,

            "sine",

            0.12

        );


        setTimeout(

            () => {

                Sound.playTone(

                    900,

                    0.12,

                    "sine",

                    0.14

                );

            },

            70

        );

    },


    // =====================================
    // ERROR SOUND
    // =====================================

    playErrorSound() {

        if (
            typeof Sound ===
            "undefined"
        ) {

            return;

        }


        Sound.start();


        Sound.playTone(

            180,

            0.18,

            "square",

            0.12

        );

    },


    // =====================================
    // RESET
    // =====================================

    reset() {

        this.open = false;

        this.buttons = [];


        this.previewCar =
            this.selectedCar;

    }

};