// =========================================
// HILL RIDER CONTROL SYSTEM
// controls.js
// =========================================

let keys = {

    ArrowLeft: false,

    ArrowRight: false

};


const gasButton =
    document.getElementById(
        "gasBtn"
    );


const brakeButton =
    document.getElementById(
        "brakeBtn"
    );


// =========================================
// KEYBOARD
// =========================================

window.addEventListener(
    "keydown",
    event => {

        if (
            event.code ===
            "ArrowRight"
        ) {

            keys.ArrowRight = true;

            event.preventDefault();

        }


        if (
            event.code ===
            "ArrowLeft"
        ) {

            keys.ArrowLeft = true;

            event.preventDefault();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        if (
            event.code ===
            "ArrowRight"
        ) {

            keys.ArrowRight = false;

        }


        if (
            event.code ===
            "ArrowLeft"
        ) {

            keys.ArrowLeft = false;

        }

    }
);


// =========================================
// BUTTON STATE
// =========================================

function setControlState(
    button,
    key,
    state
) {

    keys[key] = state;


    if (state) {

        button.classList.add(
            "active"
        );

    } else {

        button.classList.remove(
            "active"
        );

    }

}


// =========================================
// GAS
// =========================================

gasButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        gasButton.setPointerCapture(
            event.pointerId
        );

        setControlState(
            gasButton,
            "ArrowRight",
            true
        );

        Sound.start();

    }
);


gasButton.addEventListener(
    "pointerup",
    event => {

        event.preventDefault();

        setControlState(
            gasButton,
            "ArrowRight",
            false
        );

    }
);


gasButton.addEventListener(
    "pointercancel",
    () => {

        setControlState(
            gasButton,
            "ArrowRight",
            false
        );

    }
);


// =========================================
// BRAKE / REVERSE
// =========================================

brakeButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        brakeButton.setPointerCapture(
            event.pointerId
        );

        setControlState(
            brakeButton,
            "ArrowLeft",
            true
        );

        Sound.start();

    }
);


brakeButton.addEventListener(
    "pointerup",
    event => {

        event.preventDefault();

        setControlState(
            brakeButton,
            "ArrowLeft",
            false
        );

    }
);


brakeButton.addEventListener(
    "pointercancel",
    () => {

        setControlState(
            brakeButton,
            "ArrowLeft",
            false
        );

    }
);


// =========================================
// WINDOW RESET
// =========================================

window.addEventListener(
    "blur",
    () => {

        keys.ArrowLeft = false;

        keys.ArrowRight = false;


        gasButton.classList.remove(
            "active"
        );

        brakeButton.classList.remove(
            "active"
        );

    }
);