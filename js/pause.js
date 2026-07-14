// =========================================
// HILL RIDER PAUSE SYSTEM
// pause.js
// =========================================

const Pause = {

    open: false,

    buttons: [],

    // =====================================
    // CREATE
    // =====================================

    create() {

        this.open = false;

        this.buttons = [];


        window.addEventListener(
            "keydown",
            event => {

                if (
                    event.code !== "Escape"
                ) {

                    return;

                }


                if (
                    Menu.open ||
                    gameOver ||
                    Garage.open
                ) {

                    return;

                }


                event.preventDefault();


                this.toggle();

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
    // TOGGLE
    // =====================================

    toggle() {

        if (this.open) {

            this.resume();

        }

        else {

            this.pause();

        }

    },


    // =====================================
    // PAUSE
    // =====================================

    pause() {

        if (
            Menu.open ||
            gameOver ||
            Garage.open
        ) {

            return;

        }


        this.open = true;


        // =================================
        // RESET CONTROLS
        // =================================

        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        Physics.wheelSpeed = 0;


        // =================================
        // STOP SOUND
        // =================================

        Sound.stop();

    },


    // =====================================
    // RESUME
    // =====================================

    resume() {

        this.open = false;


        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        Physics.wheelSpeed = 0;


        Sound.start();

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

                if (
                    button.action ===
                    "resume"
                ) {

                    this.resume();

                    return;

                }


                if (
                    button.action ===
                    "restart"
                ) {

                    this.open = false;


                    restartGame();


                    return;

                }


                if (
                    button.action ===
                    "menu"
                ) {

                    this.goToMenu();


                    return;

                }

            }

        }

    },


    // =====================================
    // GO TO MENU
    // =====================================

    goToMenu() {

        this.open = false;


        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        Physics.wheelSpeed = 0;


        // =================================
        // REMOVE OLD CAR
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
        // RESET TERRAIN
        // =================================

        rebuildTerrain();


        // =================================
        // CREATE NEW CAR
        // =================================

        createCar(

            300,

            getTerrainY(300) - 70

        );


        // =================================
        // RESET GAME STATE
        // =================================

        gameOver = false;


        gameOverReason = "";


        crashTimer = 0;


        fuelEmptyTimer = 0;


        distance = 0;


        // =================================
        // RESET CAMERA
        // =================================

        camera.x = 0;

        camera.y = 0;


        // =================================
        // RESET SYSTEMS
        // =================================

        Fuel.create();


        Coin.create();


        Particles.create();


        Checkpoint.reset();


        Garage.applyUpgrades();


        // =================================
        // OPEN MENU
        // =================================

        Menu.open = true;


        // =================================
        // STOP SOUND
        // =================================

        Sound.stop();

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
        // DARK OVERLAY
        // =================================

        ctx.fillStyle =
            "rgba(0,0,0,0.78)";


        ctx.fillRect(

            0,

            0,

            canvas.width,

            canvas.height

        );


        // =================================
        // PANEL
        // =================================

        const panelWidth =
            Math.min(
                430,
                canvas.width - 40
            );


        const panelHeight = 430;


        const panelX =

            canvas.width / 2 -

            panelWidth / 2;


        const panelY =

            canvas.height / 2 -

            panelHeight / 2;


        ctx.fillStyle =
            "rgba(28,39,45,0.96)";


        ctx.beginPath();


        ctx.roundRect(

            panelX,

            panelY,

            panelWidth,

            panelHeight,

            24

        );


        ctx.fill();


        // =================================
        // BORDER
        // =================================

        ctx.strokeStyle =
            "#FFC107";


        ctx.lineWidth = 4;


        ctx.stroke();


        // =================================
        // TITLE
        // =================================

        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 45px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            "PAUSED",

            canvas.width / 2,

            panelY + 70

        );


        // =================================
        // DISTANCE
        // =================================

        ctx.fillStyle =
            "#b0bec5";


        ctx.font =
            "bold 18px Arial";


        ctx.fillText(

            "DISTANCE  " +
            distance +
            " M",

            canvas.width / 2,

            panelY + 115

        );


        // =================================
        // BUTTONS
        // =================================

        this.drawButton(

            "RESUME",

            "resume",

            panelX + 45,

            panelY + 155,

            panelWidth - 90,

            62,

            "#43a047"

        );


        this.drawButton(

            "RESTART",

            "restart",

            panelX + 45,

            panelY + 235,

            panelWidth - 90,

            62,

            "#ef6c00"

        );


        this.drawButton(

            "MAIN MENU",

            "menu",

            panelX + 45,

            panelY + 315,

            panelWidth - 90,

            62,

            "#455a64"

        );


        // =================================
        // FOOTER
        // =================================

        ctx.fillStyle =
            "#90a4ae";


        ctx.font =
            "14px Arial";


        ctx.fillText(

            "PRESS ESC TO RESUME",

            canvas.width / 2,

            panelY + 405

        );

    },


    // =====================================
    // DRAW BUTTON
    // =====================================

    drawButton(
        text,
        action,
        x,
        y,
        width,
        height,
        color
    ) {

        ctx.fillStyle =
            color;


        ctx.beginPath();


        ctx.roundRect(

            x,

            y,

            width,

            height,

            12

        );


        ctx.fill();


        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 21px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(

            text,

            x + width / 2,

            y + height / 2

        );


        this.buttons.push({

            action: action,

            x: x,

            y: y,

            width: width,

            height: height

        });

    },


    // =====================================
    // RESET
    // =====================================

    reset() {

        this.open = false;

        this.buttons = [];

    }

};