// =========================================
// HILL RIDER GARAGE SYSTEM
// garage.js
// =========================================

const Garage = {

    open: false,

    upgrades: {
        engine: 0,
        grip: 0,
        suspension: 0
    },

    maxLevel: 5,

    basePrices: {
        engine: 25,
        grip: 20,
        suspension: 30
    },

    buttons: [],

    message: "",
    messageTimer: 0,

    // =====================================
    // CREATE
    // =====================================

    create() {

        this.load();

        this.applyUpgrades();

        window.addEventListener(
            "keydown",
            event => {

                if (
                    event.code === "KeyG" &&
                    !gameOver
                ) {

                    this.toggle();

                }

            }
        );

        canvas.addEventListener(
            "click",
            event => {

                if (!this.open) {
                    return;
                }

                this.handleClick(
                    event.clientX,
                    event.clientY
                );

            }
        );

    },

    // =====================================
    // LOAD
    // =====================================

    load() {

        // RESET LEVELS FIRST

        this.upgrades = {

            engine: 0,

            grip: 0,

            suspension: 0

        };


        const saved =

            localStorage.getItem(

                this.getStorageKey()

            );


        if (!saved) {

            return;

        }


        try {

            const data =

                JSON.parse(saved);


            this.upgrades.engine =

                Math.min(

                    this.maxLevel,

                    Math.max(

                        0,

                        Number(
                            data.engine
                        ) || 0

                    )

                );


            this.upgrades.grip =

                Math.min(

                    this.maxLevel,

                    Math.max(

                        0,

                        Number(
                            data.grip
                        ) || 0

                    )

                );


            this.upgrades.suspension =

                Math.min(

                    this.maxLevel,

                    Math.max(

                        0,

                        Number(
                            data.suspension
                        ) || 0

                    )

                );

        }

        catch (error) {

            console.error(

                "Garage Load Error:",

                error

            );

        }

    },

    // =====================================
    // SAVE
    // =====================================

    save() {

        try {

            localStorage.setItem(

                this.getStorageKey(),

                JSON.stringify(

                    this.upgrades

                )

            );

        }

        catch (error) {

            console.error(

                "Garage Save Error:",

                error

            );

        }

    },

    // =====================================
    // TOGGLE
    // =====================================

    toggle() {

        this.open =
            !this.open;

        keys.ArrowLeft = false;

        keys.ArrowRight = false;

        Physics.wheelSpeed = 0;

    },

    // =====================================
    // UPDATE
    // =====================================

    update() {

        if (
            this.messageTimer > 0
        ) {

            this.messageTimer--;

            if (
                this.messageTimer <= 0
            ) {

                this.message = "";

            }

        }

        if (!this.open) {
            return;
        }

        Body.setVelocity(
            car,
            {
                x: 0,
                y: 0
            }
        );

        Body.setAngularVelocity(
            car,
            0
        );

        Body.setAngularVelocity(
            wheel1,
            0
        );

        Body.setAngularVelocity(
            wheel2,
            0
        );

        Physics.wheelSpeed = 0;

    },

    // =====================================
    // PRICE
    // =====================================

    getPrice(type) {

        const level =
            this.upgrades[type];

        return (
            this.basePrices[type] *
            (level + 1)
        );

    },

    // =====================================
    // BUY
    // =====================================

    buy(type) {

        if (
            this.upgrades[type] >=
            this.maxLevel
        ) {

            this.showMessage(
                "UPGRADE ALREADY MAX"
            );

            return;

        }

        const price =
            this.getPrice(type);

        const success =
            Save.spendCoins(price);

        if (!success) {

            this.showMessage(
                "NOT ENOUGH COINS"
            );

            return;

        }

        this.upgrades[type]++;

        Coin.total =
            Save.getCoins();

        this.applyUpgrades();

        this.save();

        this.showMessage(
            type.toUpperCase() +
            " UPGRADED!"
        );

    },

    // =====================================
    // MESSAGE
    // =====================================

    showMessage(text) {

        this.message = text;

        this.messageTimer = 120;

    },

    // =====================================
    // APPLY UPGRADES
    // =====================================

    applyUpgrades() {

        const engineLevel =
            this.upgrades.engine;

        const gripLevel =
            this.upgrades.grip;

        const suspensionLevel =
            this.upgrades.suspension;

        Physics.engineAcceleration =
            0.018 +
            engineLevel * 0.004;

        Physics.maxForwardSpeed =
            0.58 +
            engineLevel * 0.06;

        wheel1.friction =
            10 +
            gripLevel * 3;

        wheel2.friction =
            10 +
            gripLevel * 3;

        wheel1.frictionStatic =
            20 +
            gripLevel * 4;

        wheel2.frictionStatic =
            20 +
            gripLevel * 4;

        axle1.stiffness =
            Math.max(
                0.45,
                0.75 -
                suspensionLevel * 0.05
            );

        axle2.stiffness =
            Math.max(
                0.45,
                0.75 -
                suspensionLevel * 0.05
            );

        axle1.damping =
            0.45 +
            suspensionLevel * 0.04;

        axle2.damping =
            0.45 +
            suspensionLevel * 0.04;

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
                x >= button.x &&
                x <=
                button.x +
                button.width &&

                y >= button.y &&
                y <=
                button.y +
                button.height
            ) {

                this.buy(
                    button.type
                );

                return;

            }

        }

    },

    // =====================================
    // DRAW
    // =====================================

    draw() {

        if (!this.open) {
            return;
        }

        this.drawWorkshop();

        this.drawHeader();

        this.drawCarPreview();

        this.drawUpgradePanel();

        this.drawMessage();

    },

    // =====================================
    // WORKSHOP BACKGROUND
    // =====================================

    drawWorkshop() {

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                canvas.height
            );

        gradient.addColorStop(
            0,
            "#263238"
        );

        gradient.addColorStop(
            0.7,
            "#37474f"
        );

        gradient.addColorStop(
            1,
            "#1b252a"
        );

        ctx.fillStyle =
            gradient;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // WALL LINES

        ctx.strokeStyle =
            "rgba(255,255,255,0.05)";

        ctx.lineWidth = 2;

        for (
            let y = 90;
            y < canvas.height - 120;
            y += 55
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                canvas.width,
                y
            );

            ctx.stroke();

        }


        // FLOOR

        const floorY =
            canvas.height * 0.72;

        ctx.fillStyle =
            "#202a2f";

        ctx.fillRect(
            0,
            floorY,
            canvas.width,
            canvas.height - floorY
        );


        // FLOOR LINES

        ctx.strokeStyle =
            "rgba(255,255,255,0.08)";

        for (
            let x = -canvas.width;
            x < canvas.width * 2;
            x += 100
        ) {

            ctx.beginPath();

            ctx.moveTo(
                canvas.width / 2,
                floorY
            );

            ctx.lineTo(
                x,
                canvas.height
            );

            ctx.stroke();

        }


        // LIGHT

        const light =
            ctx.createRadialGradient(
                canvas.width * 0.28,
                canvas.height * 0.43,
                10,
                canvas.width * 0.28,
                canvas.height * 0.43,
                300
            );

        light.addColorStop(
            0,
            "rgba(255,235,59,0.18)"
        );

        light.addColorStop(
            1,
            "rgba(255,235,59,0)"
        );

        ctx.fillStyle =
            light;

        ctx.fillRect(
            0,
            80,
            canvas.width * 0.6,
            canvas.height * 0.7
        );

    },

    // =====================================
    // HEADER
    // =====================================

    drawHeader() {

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            82
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.textAlign =
            "left";

        ctx.textBaseline =
            "middle";

        ctx.font =
            "bold 34px Arial";

        ctx.fillText(
            "HILL RIDER GARAGE",
            30,
            41
        );


        ctx.textAlign =
            "right";

        ctx.fillStyle =
            "#FFC107";

        ctx.font =
            "bold 25px Arial";

        ctx.fillText(
            "COINS  " +
            Save.getCoins(),
            canvas.width - 30,
            41
        );

    },

    // =====================================
    // CAR PREVIEW
    // =====================================

    drawCarPreview() {

        const carData =

            typeof CarSelect !== "undefined"

                ? CarSelect.getSelectedCar()

                : {

                    name: "RED RIDER",

                    bodyWidth: 120,

                    bodyHeight: 30,

                    wheelRadius: 20,

                    wheelOffsetX: 40,

                    wheelOffsetY: 25,

                    color: "#ff3b30",

                    roofColor: "#ff9800"

                };


        const previewX =
            canvas.width * 0.27;


        const previewY =
            canvas.height * 0.52;


        ctx.save();


        ctx.translate(

            previewX,

            previewY

        );


        const baseScale =

            Math.min(

                1.8,

                canvas.width / 800

            );


        const carScale =

            Math.min(

                1,

                145 / carData.bodyWidth

            );


        const scale =

            baseScale *

            carScale;


        ctx.scale(

            scale,

            scale

        );


        // =================================
        // SHADOW
        // =================================

        ctx.fillStyle =

            "rgba(0,0,0,0.45)";


        ctx.beginPath();


        ctx.ellipse(

            0,

            carData.wheelOffsetY +
            carData.wheelRadius +
            10,

            carData.bodyWidth * 0.72,

            15,

            0,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // =================================
        // WHEELS
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
        // BODY GRADIENT
        // =================================

        const bodyGradient =

            ctx.createLinearGradient(

                0,

                -carData.bodyHeight,

                0,

                carData.bodyHeight

            );


        bodyGradient.addColorStop(

            0,

            typeof lightenCarColor === "function"

                ? lightenCarColor(
                    carData.color,
                    35
                )

                : carData.color

        );


        bodyGradient.addColorStop(

            1,

            carData.color

        );


        ctx.fillStyle =
            bodyGradient;


        // =================================
        // BODY
        // =================================

        const halfWidth =

            carData.bodyWidth / 2;


        const halfHeight =

            carData.bodyHeight / 2;


        ctx.beginPath();


        ctx.moveTo(

            -halfWidth,

            -halfHeight + 5

        );


        ctx.lineTo(

            -halfWidth * 0.48,

            -halfHeight - 5

        );


        ctx.lineTo(

            halfWidth * 0.25,

            -halfHeight - 5

        );


        ctx.lineTo(

            halfWidth * 0.55,

            -halfHeight + 3

        );


        ctx.lineTo(

            halfWidth,

            -halfHeight + 8

        );


        ctx.lineTo(

            halfWidth,

            halfHeight

        );


        ctx.lineTo(

            -halfWidth,

            halfHeight

        );


        ctx.closePath();


        ctx.fill();


        // =================================
        // CABIN
        // =================================

        const cabinHeight =

            Math.max(

                22,

                carData.bodyHeight * 0.8

            );


        ctx.fillStyle =
            carData.roofColor;


        ctx.beginPath();


        ctx.moveTo(

            -22,

            -halfHeight - 4

        );


        ctx.lineTo(

            -10,

            -halfHeight -
            cabinHeight

        );


        ctx.lineTo(

            18,

            -halfHeight -
            cabinHeight

        );


        ctx.lineTo(

            34,

            -halfHeight - 3

        );


        ctx.closePath();


        ctx.fill();


        // =================================
        // WINDOWS
        // =================================

        ctx.fillStyle =
            "#81d4fa";


        ctx.beginPath();


        ctx.moveTo(

            -15,

            -halfHeight - 8

        );


        ctx.lineTo(

            -6,

            -halfHeight -
            cabinHeight +
            5

        );


        ctx.lineTo(

            2,

            -halfHeight -
            cabinHeight +
            5

        );


        ctx.lineTo(

            2,

            -halfHeight - 8

        );


        ctx.closePath();


        ctx.fill();


        ctx.beginPath();


        ctx.moveTo(

            8,

            -halfHeight -
            cabinHeight +
            5

        );


        ctx.lineTo(

            16,

            -halfHeight -
            cabinHeight +
            5

        );


        ctx.lineTo(

            27,

            -halfHeight - 8

        );


        ctx.lineTo(

            8,

            -halfHeight - 8

        );


        ctx.closePath();


        ctx.fill();


        // =================================
        // HEADLIGHT
        // =================================

        ctx.fillStyle =
            "#fff59d";


        ctx.beginPath();


        ctx.arc(

            halfWidth - 5,

            -3,

            5,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // =================================
        // BUMPERS
        // =================================

        ctx.fillStyle =
            "#37474f";


        ctx.fillRect(

            halfWidth - 2,

            halfHeight - 5,

            12,

            6

        );


        ctx.fillRect(

            -halfWidth - 8,

            halfHeight - 5,

            10,

            6

        );


        ctx.restore();


        // =================================
        // SELECTED CAR NAME
        // =================================

        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 23px Arial";


        ctx.fillText(

            carData.name,

            previewX,

            previewY + 115

        );


        // =================================
        // CAR TYPE
        // =================================

        ctx.fillStyle =
            "#FFC107";


        ctx.font =
            "bold 14px Arial";


        ctx.fillText(

            carData.description ||
            "HILL RIDER CAR",

            previewX,

            previewY + 145

        );

    },


    // =====================================
    // PREVIEW WHEEL
    // =====================================

    drawPreviewWheel(
        x,
        y,
        radius
    ) {

        // =================================
        // TYRE
        // =================================

        ctx.fillStyle =
            "#111111";


        ctx.beginPath();


        ctx.arc(

            x,

            y,

            radius,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // =================================
        // TYRE BORDER
        // =================================

        ctx.strokeStyle =
            "#424242";


        ctx.lineWidth =

            Math.max(

                2,

                radius * 0.12

            );


        ctx.stroke();


        // =================================
        // RIM
        // =================================

        ctx.fillStyle =
            "#90a4ae";


        ctx.beginPath();


        ctx.arc(

            x,

            y,

            radius * 0.48,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // =================================
        // INNER RIM
        // =================================

        ctx.fillStyle =
            "#455a64";


        ctx.beginPath();


        ctx.arc(

            x,

            y,

            radius * 0.22,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // =================================
        // SPOKES
        // =================================

        ctx.save();


        ctx.translate(

            x,

            y

        );


        ctx.strokeStyle =
            "#eceff1";


        ctx.lineWidth = 2;


        for (

            let i = 0;

            i < 6;

            i++

        ) {

            ctx.rotate(

                Math.PI / 3

            );


            ctx.beginPath();


            ctx.moveTo(

                radius * 0.22,

                0

            );


            ctx.lineTo(

                radius * 0.48,

                0

            );


            ctx.stroke();

        }


        ctx.restore();

    },

    // =====================================
    // UPGRADE PANEL
    // =====================================

    drawUpgradePanel() {

        const panelWidth =
            Math.min(
                470,
                canvas.width * 0.44
            );

        const panelX =
            canvas.width -
            panelWidth -
            35;

        const panelY = 110;

        const panelHeight =
            Math.min(
                440,
                canvas.height - 150
            );

        ctx.fillStyle =
            "rgba(0,0,0,0.42)";

        ctx.beginPath();

        ctx.roundRect(
            panelX,
            panelY,
            panelWidth,
            panelHeight,
            18
        );

        ctx.fill();


        ctx.textAlign =
            "left";

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 27px Arial";

        ctx.fillText(
            "UPGRADES",
            panelX + 25,
            panelY + 45
        );


        this.buttons = [];


        this.drawUpgrade(

            "engine",

            "ENGINE",

            "POWER & SPEED",

            panelX + 20,

            panelY + 70,

            panelWidth - 40

        );


        this.drawUpgrade(

            "grip",

            "TYRE GRIP",

            "BETTER HILL TRACTION",

            panelX + 20,

            panelY + 180,

            panelWidth - 40

        );


        this.drawUpgrade(

            "suspension",

            "SUSPENSION",

            "SMOOTHER LANDING",

            panelX + 20,

            panelY + 290,

            panelWidth - 40

        );


        ctx.fillStyle =
            "#cfd8dc";

        ctx.font =
            "16px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "PRESS G TO RETURN TO RACE",
            panelX + panelWidth / 2,
            panelY + panelHeight - 20
        );

    },

    // =====================================
    // DRAW UPGRADE
    // =====================================

    drawUpgrade(
        type,
        title,
        description,
        x,
        y,
        width
    ) {

        const level =
            this.upgrades[type];

        const maxed =
            level >=
            this.maxLevel;

        const price =
            this.getPrice(type);


        ctx.fillStyle =
            "rgba(255,255,255,0.08)";

        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            width,
            95,
            12
        );

        ctx.fill();


        ctx.textAlign =
            "left";

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 19px Arial";

        ctx.fillText(
            title,
            x + 16,
            y + 25
        );


        ctx.fillStyle =
            "#b0bec5";

        ctx.font =
            "12px Arial";

        ctx.fillText(
            description,
            x + 16,
            y + 45
        );


        // LEVEL BARS

        for (
            let i = 0;
            i < this.maxLevel;
            i++
        ) {

            ctx.fillStyle =
                i < level
                    ? "#FFC107"
                    : "#546e7a";

            ctx.fillRect(
                x + 16 + i * 29,
                y + 61,
                21,
                12
            );

        }


        ctx.fillStyle =
            "#cfd8dc";

        ctx.font =
            "bold 12px Arial";

        ctx.fillText(
            "LV " +
            level +
            "/" +
            this.maxLevel,
            x + 16,
            y + 88
        );


        const buttonWidth = 115;

        const buttonHeight = 48;

        const buttonX =
            x + width -
            buttonWidth -
            15;

        const buttonY =
            y + 24;


        if (maxed) {

            ctx.fillStyle =
                "#607d8b";

        } else if (
            Save.getCoins() >= price
        ) {

            ctx.fillStyle =
                "#43a047";

        } else {

            ctx.fillStyle =
                "#c62828";

        }


        ctx.beginPath();

        ctx.roundRect(
            buttonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            8
        );

        ctx.fill();


        ctx.textAlign =
            "center";

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 15px Arial";

        ctx.fillText(

            maxed
                ? "MAX"
                : "BUY " + price,

            buttonX +
            buttonWidth / 2,

            buttonY + 29

        );


        this.buttons.push({

            type: type,

            x: buttonX,

            y: buttonY,

            width: buttonWidth,

            height: buttonHeight

        });

    },

    // =====================================
    // MESSAGE
    // =====================================

    drawMessage() {

        if (!this.message) {
            return;
        }

        const width = 320;

        const height = 52;

        const x =
            canvas.width / 2 -
            width / 2;

        const y =
            canvas.height - 90;


        ctx.fillStyle =
            "rgba(0,0,0,0.8)";

        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            width,
            height,
            10
        );

        ctx.fill();


        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 17px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            this.message,
            canvas.width / 2,
            y + height / 2
        );

    },

    // =====================================
    // CURRENT CAR ID
    // =====================================

    getCurrentCarId() {

        if (
            typeof CarSelect ===
            "undefined"
        ) {

            return 0;

        }

        return CarSelect.selectedCar || 0;

    },

    // =====================================
    // STORAGE KEY
    // =====================================

    getStorageKey() {

        return (
            "hill_rider_garage_car_" +
            this.getCurrentCarId()
        );

    },

};