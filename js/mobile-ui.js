// =========================================
// HILL RIDER MOBILE UI SYSTEM
// mobile-ui.js
// =========================================

const MobileUI = {

    isMobile: false,

    showRotateMessage: false,

    fullscreenButton: {

        x: 0,
        y: 0,
        width: 48,
        height: 42

    },

    pauseButton: {

        x: 0,
        y: 0,
        width: 48,
        height: 42

    },


    // =====================================
    // CREATE
    // =====================================

    create() {

        this.detectDevice();

        this.updateOrientation();


        window.addEventListener(

            "resize",

            () => {

                this.detectDevice();

                this.updateOrientation();

            }

        );


        window.addEventListener(

            "orientationchange",

            () => {

                setTimeout(

                    () => {

                        this.detectDevice();

                        this.updateOrientation();

                    },

                    250

                );

            }

        );


        canvas.addEventListener(

            "click",

            event => {

                this.handleClick(
                    event
                );

            }

        );

    },


    // =====================================
    // DETECT DEVICE
    // =====================================

    detectDevice() {

        this.isMobile =

            window.matchMedia(
                "(pointer: coarse)"
            ).matches ||

            navigator.maxTouchPoints > 0;

    },


    // =====================================
    // UPDATE ORIENTATION
    // =====================================

    updateOrientation() {

        if (!this.isMobile) {

            this.showRotateMessage = false;

            return;

        }


        this.showRotateMessage =

            window.innerHeight >

            window.innerWidth;

    },


    // =====================================
    // UPDATE LAYOUT
    // =====================================

    updateLayout() {

        this.fullscreenButton.x =

            canvas.width - 130;


        this.fullscreenButton.y = 12;


        this.pauseButton.x =

            canvas.width - 72;


        this.pauseButton.y = 12;

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
    // HIT TEST
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
    // HANDLE CLICK
    // =====================================

    handleClick(event) {

        this.updateLayout();


        const pointer =

            this.getPointerPosition(
                event
            );


        // =================================
        // FULLSCREEN
        // =================================

        if (

            this.isInside(

                pointer.x,

                pointer.y,

                this.fullscreenButton

            )

        ) {

            event.preventDefault();

            event.stopPropagation();


            this.toggleFullscreen();


            return;

        }


        // =================================
        // PAUSE
        // =================================

        if (

            this.isInside(

                pointer.x,

                pointer.y,

                this.pauseButton

            )

        ) {

            if (
                Menu.open ||
                gameOver ||
                Garage.open
            ) {

                return;

            }


            event.preventDefault();

            event.stopPropagation();


            Pause.toggle();

        }

    },


    // =====================================
    // FULLSCREEN
    // =====================================

    async toggleFullscreen() {

        try {

            if (
                !document.fullscreenElement
            ) {

                const element =

                    document.documentElement;


                if (
                    element.requestFullscreen
                ) {

                    await element
                        .requestFullscreen();

                }


                else if (
                    element.webkitRequestFullscreen
                ) {

                    element
                        .webkitRequestFullscreen();

                }

            }

            else {

                if (
                    document.exitFullscreen
                ) {

                    await document
                        .exitFullscreen();

                }


                else if (
                    document.webkitExitFullscreen
                ) {

                    document
                        .webkitExitFullscreen();

                }

            }

        }

        catch (error) {

            console.warn(

                "Fullscreen error:",

                error

            );

        }

    },


    // =====================================
    // UPDATE
    // =====================================

    update() {

        this.updateOrientation();

    },


    // =====================================
    // DRAW
    // =====================================

    draw() {

        this.updateLayout();


        // =================================
        // FULLSCREEN BUTTON
        // =================================

        this.drawButton(

            this.fullscreenButton,

            document.fullscreenElement
                ? "⛶"
                : "⛶"

        );


        // =================================
        // PAUSE BUTTON
        // =================================

        if (

            !Menu.open &&

            !gameOver &&

            !Garage.open &&

            !Pause.open

        ) {

            this.drawButton(

                this.pauseButton,

                "⏸"

            );

        }


        // =================================
        // ROTATE MESSAGE
        // =================================

        if (
            this.showRotateMessage &&
            !document.fullscreenElement
        ) {

            this.drawRotateMessage();

        }

    },


    // =====================================
    // DRAW BUTTON
    // =====================================

    drawButton(
        button,
        icon
    ) {

        ctx.save();


        ctx.fillStyle =

            "rgba(0,0,0,0.52)";


        ctx.beginPath();


        ctx.roundRect(

            button.x,

            button.y,

            button.width,

            button.height,

            10

        );


        ctx.fill();


        ctx.strokeStyle =

            "rgba(255,255,255,0.5)";


        ctx.lineWidth = 2;


        ctx.stroke();


        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 23px Arial";


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


        ctx.restore();

    },


    // =====================================
    // ROTATE MESSAGE
    // =====================================

    drawRotateMessage() {

        ctx.save();


        ctx.fillStyle =

            "rgba(0,0,0,0.92)";


        ctx.fillRect(

            0,

            0,

            canvas.width,

            canvas.height

        );


        ctx.fillStyle =
            "#ffffff";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.font =
            "60px Arial";


        ctx.fillText(

            "📱",

            canvas.width / 2,

            canvas.height / 2 - 80

        );


        ctx.font =
            "bold 30px Arial";


        ctx.fillText(

            "ROTATE YOUR PHONE",

            canvas.width / 2,

            canvas.height / 2

        );


        ctx.fillStyle =
            "#FFC107";


        ctx.font =
            "bold 20px Arial";


        ctx.fillText(

            "PLAY IN LANDSCAPE MODE",

            canvas.width / 2,

            canvas.height / 2 + 50

        );


        ctx.fillStyle =
            "#b0bec5";


        ctx.font =
            "16px Arial";


        ctx.fillText(

            "↻  TURN PHONE SIDEWAYS",

            canvas.width / 2,

            canvas.height / 2 + 95

        );


        ctx.restore();

    },


    // =====================================
    // RESET
    // =====================================

    reset() {

        this.updateOrientation();

    }

};