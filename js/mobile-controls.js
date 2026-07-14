// =========================================
// HILL RIDER MOBILE CONTROLS
// mobile-controls.js
// =========================================

const MobileControls = {

    brakePressed: false,

    gasPressed: false,

    brakeButton: {

        x: 0,
        y: 0,
        width: 150,
        height: 80

    },

    gasButton: {

        x: 0,
        y: 0,
        width: 150,
        height: 80

    },


    // =====================================
    // CREATE
    // =====================================

    create() {

        this.brakePressed = false;

        this.gasPressed = false;


        canvas.addEventListener(

            "pointerdown",

            event => {

                this.handlePointerDown(
                    event
                );

            }

        );


        canvas.addEventListener(

            "pointermove",

            event => {

                this.handlePointerMove(
                    event
                );

            }

        );


        canvas.addEventListener(

            "pointerup",

            event => {

                this.handlePointerUp(
                    event
                );

            }

        );


        canvas.addEventListener(

            "pointercancel",

            event => {

                this.handlePointerUp(
                    event
                );

            }

        );


        canvas.addEventListener(

            "pointerleave",

            event => {

                if (
                    event.pointerType ===
                    "mouse"
                ) {

                    this.handlePointerUp(
                        event
                    );

                }

            }

        );


        window.addEventListener(

            "blur",

            () => {

                this.reset();

            }

        );

    },


    // =====================================
    // CAN USE CONTROLS
    // =====================================

    canUse() {

        if (
            typeof Menu !==
            "undefined" &&
            Menu.open
        ) {

            return false;

        }


        if (
            typeof Pause !==
            "undefined" &&
            Pause.open
        ) {

            return false;

        }


        if (
            typeof Garage !==
            "undefined" &&
            Garage.open
        ) {

            return false;

        }


        if (
            typeof gameOver !==
            "undefined" &&
            gameOver
        ) {

            return false;

        }


        return true;

    },


    // =====================================
    // UPDATE BUTTON POSITION
    // =====================================

    updateLayout() {

        const margin = 28;

        const bottom = 28;


        let buttonWidth = 150;

        let buttonHeight = 80;


        if (
            canvas.width < 700
        ) {

            buttonWidth = 125;

            buttonHeight = 72;

        }


        this.brakeButton.x =
            margin;


        this.brakeButton.y =

            canvas.height -

            buttonHeight -

            bottom;


        this.brakeButton.width =
            buttonWidth;


        this.brakeButton.height =
            buttonHeight;


        this.gasButton.x =

            canvas.width -

            buttonWidth -

            margin;


        this.gasButton.y =

            canvas.height -

            buttonHeight -

            bottom;


        this.gasButton.width =
            buttonWidth;


        this.gasButton.height =
            buttonHeight;

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
    // BUTTON HIT TEST
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
    // POINTER DOWN
    // =====================================

    handlePointerDown(event) {

        if (!this.canUse()) {

            return;

        }


        this.updateLayout();


        const pointer =

            this.getPointerPosition(
                event
            );


        if (
            this.isInside(

                pointer.x,

                pointer.y,

                this.brakeButton

            )
        ) {

            event.preventDefault();


            this.brakePressed = true;


            keys.ArrowLeft = true;


            try {

                canvas.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

            }


            return;

        }


        if (
            this.isInside(

                pointer.x,

                pointer.y,

                this.gasButton

            )
        ) {

            event.preventDefault();


            this.gasPressed = true;


            keys.ArrowRight = true;


            try {

                canvas.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

            }

        }

    },


    // =====================================
    // POINTER MOVE
    // =====================================

    handlePointerMove(event) {

        if (!this.canUse()) {

            this.reset();

            return;

        }


        if (
            !this.brakePressed &&
            !this.gasPressed
        ) {

            return;

        }


        const pointer =

            this.getPointerPosition(
                event
            );


        if (this.brakePressed) {

            const insideBrake =

                this.isInside(

                    pointer.x,

                    pointer.y,

                    this.brakeButton

                );


            keys.ArrowLeft =
                insideBrake;

        }


        if (this.gasPressed) {

            const insideGas =

                this.isInside(

                    pointer.x,

                    pointer.y,

                    this.gasButton

                );


            keys.ArrowRight =
                insideGas;

        }

    },


    // =====================================
    // POINTER UP
    // =====================================

    handlePointerUp(event) {

        if (this.brakePressed) {

            keys.ArrowLeft = false;

        }


        if (this.gasPressed) {

            keys.ArrowRight = false;

        }


        this.brakePressed = false;

        this.gasPressed = false;


        try {

            if (
                canvas.hasPointerCapture(
                    event.pointerId
                )
            ) {

                canvas.releasePointerCapture(
                    event.pointerId
                );

            }

        }

        catch (error) {

        }

    },


    // =====================================
    // UPDATE
    // =====================================

    update() {

        if (!this.canUse()) {

            this.reset();

            return;

        }


        if (this.brakePressed) {

            keys.ArrowLeft = true;

        }


        if (this.gasPressed) {

            keys.ArrowRight = true;

        }

    },


    // =====================================
    // DRAW
    // =====================================

    draw() {

        if (!this.canUse()) {

            return;

        }


        this.updateLayout();


        this.drawButton(

            this.brakeButton,

            "BRAKE",

            "←",

            this.brakePressed,

            "#d84315"

        );


        this.drawButton(

            this.gasButton,

            "GAS",

            "→",

            this.gasPressed,

            "#43a047"

        );

    },


    // =====================================
    // DRAW BUTTON
    // =====================================

    drawButton(
        button,
        text,
        arrow,
        pressed,
        color
    ) {

        ctx.save();


        ctx.globalAlpha =

            pressed
                ? 0.95
                : 0.72;


        ctx.fillStyle =
            color;


        ctx.beginPath();


        ctx.roundRect(

            button.x,

            button.y,

            button.width,

            button.height,

            18

        );


        ctx.fill();


        ctx.strokeStyle =

            pressed
                ? "#ffffff"
                : "rgba(255,255,255,0.55)";


        ctx.lineWidth =

            pressed
                ? 5
                : 3;


        ctx.stroke();


        ctx.fillStyle =
            "#ffffff";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.font =
            "bold 29px Arial";


        ctx.fillText(

            arrow,

            button.x +
            button.width / 2,

            button.y +
            button.height / 2 -
            12

        );


        ctx.font =
            "bold 15px Arial";


        ctx.fillText(

            text,

            button.x +
            button.width / 2,

            button.y +
            button.height / 2 +
            22

        );


        ctx.restore();

    },


    // =====================================
    // RESET
    // =====================================

    reset() {

        this.brakePressed = false;

        this.gasPressed = false;


        keys.ArrowLeft = false;

        keys.ArrowRight = false;

    }

};