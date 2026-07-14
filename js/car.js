// ======================================
// HILL RIDER CAR SYSTEM
// car.js
// ======================================

let car;
let wheel1;
let wheel2;

let axle1;
let axle2;


// ======================================
// CAR CONFIG
// ======================================

const CAR = {
    type: "car",

    width: 120,

    height: 30,

    wheelRadius: 20,

    wheelOffsetX: 40,

    wheelOffsetY: 26,

    enginePower: 0.45,

    maxSpeed: 1.8,

    brakePower: 0.25,

    suspension: 0.65,

    suspensionLength: 10,

    wheelGrip: 8,

    airResistance: 0.01,

    color: "#ff3b30",

    roofColor: "#ff9800",

    accelerationMultiplier: 1,

    maxSpeedMultiplier: 1,

    airControlMultiplier: 1,

    gripMultiplier: 1

};


// ======================================
// APPLY SELECTED CAR
// ======================================

function applySelectedCar() {

    let selected;


    if (
        typeof CarSelect !== "undefined"
    ) {

        selected =
            CarSelect.getSelectedCar();

    }


    if (!selected) {

        selected = {

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

            roofColor: "#ff9800"

        };

    }

    CAR.type =
        selected.type || "car";

    CAR.width =
        selected.bodyWidth;


    CAR.height =
        selected.bodyHeight;


    CAR.wheelRadius =
        selected.wheelRadius;


    CAR.wheelOffsetX =
        selected.wheelOffsetX;


    CAR.wheelOffsetY =
        selected.wheelOffsetY;


    CAR.accelerationMultiplier =
        selected.acceleration;


    CAR.maxSpeedMultiplier =
        selected.maxSpeed;


    CAR.airControlMultiplier =
        selected.airControl;


    CAR.gripMultiplier =
        selected.grip;


    CAR.color =
        selected.color;


    CAR.roofColor =
        selected.roofColor;


    CAR.wheelGrip =

        8 *

        CAR.gripMultiplier;

}


// ======================================
// CREATE CAR / BIKE
// ======================================

function createCar(x, y) {

    applySelectedCar();


    // ==================================
    // VEHICLE BODY SETTINGS
    // ==================================

    const isBike =
        CAR.type === "bike";


    const bodyDensity =
        isBike
            ? 0.0011
            : 0.0015;


    const bodyInertia =
        isBike
            ? 1800
            : Infinity;


    const axleStiffness =
        isBike
            ? 0.55
            : CAR.suspension;


    const axleDamping =
        isBike
            ? 0.55
            : 0.45;


    const axleLength =
        isBike
            ? 4
            : 3;


    // ==================================
    // CREATE BODY
    // ==================================

    car = Bodies.rectangle(

        x,

        y,

        CAR.width,

        CAR.height,

        {

            density:
                bodyDensity,

            friction:

                8 *

                CAR.gripMultiplier,

            frictionAir:
                CAR.airResistance,

            restitution:
                0.05,

            inertia:
                bodyInertia

        }

    );


    // ==================================
    // REAR WHEEL
    // ==================================

    wheel1 = Bodies.circle(

        x -
        CAR.wheelOffsetX,

        y +
        CAR.wheelOffsetY,

        CAR.wheelRadius,

        {

            density:

                isBike
                    ? 0.0022
                    : 0.003,

            friction:
                CAR.wheelGrip,

            restitution:
                0,

            frictionStatic:

                20 *

                CAR.gripMultiplier

        }

    );


    // ==================================
    // FRONT WHEEL
    // ==================================

    wheel2 = Bodies.circle(

        x +
        CAR.wheelOffsetX,

        y +
        CAR.wheelOffsetY,

        CAR.wheelRadius,

        {

            density:

                isBike
                    ? 0.0022
                    : 0.003,

            friction:
                CAR.wheelGrip,

            restitution:
                0,

            frictionStatic:

                20 *

                CAR.gripMultiplier

        }

    );


    // ==================================
    // REAR AXLE
    // ==================================

    axle1 = Constraint.create({

        bodyA:
            car,

        pointA: {

            x:
                -CAR.wheelOffsetX,

            y:
                CAR.height / 2

        },

        bodyB:
            wheel1,

        stiffness:
            axleStiffness,

        damping:
            axleDamping,

        length:
            axleLength

    });


    // ==================================
    // FRONT AXLE
    // ==================================

    axle2 = Constraint.create({

        bodyA:
            car,

        pointA: {

            x:
                CAR.wheelOffsetX,

            y:
                CAR.height / 2

        },

        bodyB:
            wheel2,

        stiffness:
            axleStiffness,

        damping:
            axleDamping,

        length:
            axleLength

    });


    // ==================================
    // ADD VEHICLE TO WORLD
    // ==================================

    Composite.add(

        world,

        [

            car,

            wheel1,

            wheel2,

            axle1,

            axle2

        ]

    );


    // ==================================
    // RESET VEHICLE PHYSICS
    // ==================================

    if (
        typeof Physics !==
        "undefined"
    ) {

        Physics.wheelSpeed = 0;


        if (

            typeof Physics.smoothWheelSpeed !==
            "undefined"

        ) {

            Physics.smoothWheelSpeed = 0;

        }


        if (

            typeof Physics.resetIdleLock ===
            "function"

        ) {

            Physics.resetIdleLock();

        }

    }


    // ==================================
    // RESET SUSPENSION VISUAL
    // ==================================

    if (

        typeof SuspensionVisual !==
        "undefined"

    ) {

        SuspensionVisual.rearCompression = 0;

        SuspensionVisual.frontCompression = 0;

    }

}


// ======================================
// DRAW WHEEL
// ======================================

function drawWheel(wheel) {

    ctx.save();

    ctx.translate(
        wheel.position.x,
        wheel.position.y
    );

    ctx.rotate(
        wheel.angle
    );


    // ==================================
    // GET GRIP LEVEL
    // ==================================

    let gripLevel = 0;

    if (
        typeof Garage !== "undefined" &&
        Garage.upgrades
    ) {

        gripLevel =
            Number(
                Garage.upgrades.grip
            ) || 0;

    }


    // ==================================
    // TYRE SIZE BY GRIP LEVEL
    // ==================================

    const visualRadius =

        CAR.wheelRadius +

        gripLevel * 0.7;


    // ==================================
    // OUTER TYRE
    // ==================================

    ctx.fillStyle =

        gripLevel >= 4
            ? "#080808"
            : gripLevel >= 2
                ? "#101010"
                : "#171717";


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        visualRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // ==================================
    // TYRE OUTER RING
    // ==================================

    ctx.strokeStyle =

        gripLevel >= 5
            ? "#ffc107"
            : "#3b3b3b";


    ctx.lineWidth =

        gripLevel >= 5
            ? 2
            : 1;


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        visualRadius - 1,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    // ==================================
    // TYRE TREADS
    // ==================================

    const treadCount =

        10 +

        gripLevel * 2;


    const treadLength =

        5 +

        gripLevel * 1.2;


    const treadWidth =

        Math.max(
            2,
            CAR.wheelRadius * 0.13
        ) +

        gripLevel * 0.35;


    ctx.strokeStyle =

        gripLevel >= 4
            ? "#616161"
            : "#444444";


    ctx.lineWidth =
        treadWidth;


    ctx.lineCap =
        "round";


    for (
        let i = 0;
        i < treadCount;
        i++
    ) {

        ctx.save();

        ctx.rotate(

            i *

            Math.PI * 2 /

            treadCount

        );


        ctx.beginPath();

        ctx.moveTo(

            visualRadius -
            treadLength,

            0

        );

        ctx.lineTo(

            visualRadius + 1,

            0

        );

        ctx.stroke();

        ctx.restore();

    }


    // ==================================
    // LEVEL 3+ SIDE GRIP BLOCKS
    // ==================================

    if (
        gripLevel >= 3
    ) {

        const blockCount =

            8 +

            gripLevel;


        ctx.fillStyle =
            "#292929";


        for (
            let i = 0;
            i < blockCount;
            i++
        ) {

            ctx.save();

            ctx.rotate(

                i *

                Math.PI * 2 /

                blockCount

            );


            ctx.fillRect(

                visualRadius - 4,

                -3,

                7 +

                gripLevel * 0.5,

                6

            );


            ctx.restore();

        }

    }


    // ==================================
    // RIM
    // ==================================

    const rimRadius =

        CAR.wheelRadius * 0.5;


    const rimGradient =

        ctx.createRadialGradient(

            -3,
            -3,
            2,

            0,
            0,
            rimRadius

        );


    rimGradient.addColorStop(
        0,
        "#eceff1"
    );


    rimGradient.addColorStop(
        1,
        gripLevel >= 4
            ? "#78909c"
            : "#90a4ae"
    );


    ctx.fillStyle =
        rimGradient;


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        rimRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // ==================================
    // INNER RIM
    // ==================================

    ctx.fillStyle =

        gripLevel >= 5
            ? "#ffc107"
            : "#455a64";


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        rimRadius * 0.45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // ==================================
    // SPOKES
    // ==================================

    const spokeCount =

        5 +

        Math.min(
            gripLevel,
            3
        );


    ctx.strokeStyle =
        "#eceff1";


    ctx.lineWidth =

        gripLevel >= 4
            ? 2.5
            : 2;


    for (
        let i = 0;
        i < spokeCount;
        i++
    ) {

        ctx.save();

        ctx.rotate(

            i *

            Math.PI * 2 /

            spokeCount

        );


        ctx.beginPath();

        ctx.moveTo(

            rimRadius * 0.45,

            0

        );

        ctx.lineTo(

            rimRadius * 0.92,

            0

        );

        ctx.stroke();

        ctx.restore();

    }


    // ==================================
    // HUB
    // ==================================

    ctx.fillStyle =
        "#263238";


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        Math.max(
            3,
            rimRadius * 0.18
        ),
        0,
        Math.PI * 2
    );

    ctx.fill();


    // ==================================
    // MAX GRIP BADGE
    // ==================================

    if (
        gripLevel >= 5
    ) {

        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 7px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(
            "G",
            0,
            0
        );

    }


    ctx.restore();

}

// ======================================
// SUSPENSION VISUAL STATE
// ======================================

const SuspensionVisual = {

    rearCompression: 0,

    frontCompression: 0,


    update() {

        if (
            typeof Garage === "undefined" ||
            !Garage.upgrades
        ) {

            return;

        }


        const level =

            Number(
                Garage.upgrades.suspension
            ) || 0;


        if (level <= 0) {

            this.rearCompression = 0;

            this.frontCompression = 0;

            return;

        }


        const rearTarget =

            Math.max(

                -6,

                Math.min(

                    8,

                    wheel1.velocity.y * 2.2

                )

            );


        const frontTarget =

            Math.max(

                -6,

                Math.min(

                    8,

                    wheel2.velocity.y * 2.2

                )

            );


        const smoothSpeed =

            0.12 +

            level * 0.025;


        this.rearCompression +=

            (
                rearTarget -
                this.rearCompression
            ) *

            smoothSpeed;


        this.frontCompression +=

            (
                frontTarget -
                this.frontCompression
            ) *

            smoothSpeed;

    }

};

// ======================================
// DRAW SUSPENSION SPRING
// ======================================

function drawSuspensionSpring(

    carBody,

    wheel,

    level

) {

    const startX =

        carBody.position.x;


    const startY =

        carBody.position.y + 4;


    const endX =

        wheel.position.x;


    const endY =

        wheel.position.y;


    const dx =

        endX - startX;


    const dy =

        endY - startY;


    const distance =

        Math.sqrt(

            dx * dx +

            dy * dy

        );


    if (
        distance <= 0
    ) {

        return;

    }


    const angle =

        Math.atan2(

            dy,

            dx

        );


    ctx.save();


    ctx.translate(

        startX,

        startY

    );


    ctx.rotate(

        angle

    );


    // ==================================
    // SHOCK BODY
    // ==================================

    ctx.strokeStyle =

        level >= 5
            ? "#ffc107"
            : level >= 3
                ? "#ff7043"
                : "#90a4ae";


    ctx.lineWidth =

        3 +

        level * 0.35;


    ctx.lineCap =
        "round";


    ctx.beginPath();


    ctx.moveTo(

        0,

        0

    );


    ctx.lineTo(

        distance,

        0

    );


    ctx.stroke();


    // ==================================
    // SPRING
    // ==================================

    const springStart =

        8;


    const springEnd =

        Math.max(

            springStart,

            distance - 8

        );


    const springLength =

        springEnd -

        springStart;


    const coilCount =

        5 +

        level;


    const springHeight =

        4 +

        level * 0.7;


    ctx.strokeStyle =

        level >= 5
            ? "#fff176"
            : "#eceff1";


    ctx.lineWidth =

        1.5 +

        level * 0.2;


    ctx.beginPath();


    ctx.moveTo(

        springStart,

        0

    );


    const points =

        coilCount * 2;


    for (

        let i = 1;

        i <= points;

        i++

    ) {

        const progress =

            i / points;


        const x =

            springStart +

            springLength *

            progress;


        const y =

            i % 2 === 0

                ? -springHeight

                : springHeight;


        ctx.lineTo(

            x,

            y

        );

    }


    ctx.lineTo(

        springEnd,

        0

    );


    ctx.stroke();


    // ==================================
    // JOINTS
    // ==================================

    ctx.fillStyle =
        "#37474f";


    ctx.beginPath();


    ctx.arc(

        0,

        0,

        4,

        0,

        Math.PI * 2

    );


    ctx.fill();


    ctx.beginPath();


    ctx.arc(

        distance,

        0,

        4,

        0,

        Math.PI * 2

    );


    ctx.fill();


    ctx.restore();

}
// ======================================
// DRAW CAR / BIKE
// ======================================

function drawCar() {

    SuspensionVisual.update();
    // ==================================
    // TRAIN
    // ==================================

    if (
        CAR.type === "train"
    ) {

        drawTrain();

        return;

    }
    // ==================================
    // TEMPU
    // ==================================

    if (
        CAR.type === "tempu"
    ) {

        drawTempu();

        return;

    }
    // ==================================
    // BIKE
    // ==================================

    if (
        CAR.type === "cycle"
    ) {

        drawCycle();

        return;

    }
    // ==================================
    // BIKE
    // ==================================

    if (
        CAR.type === "bike"
    ) {

        drawBike();

        return;

    }


    // ==================================
    // NORMAL CAR SUSPENSION
    // ==================================

    drawSuspension(

        car.position.x - 40,

        car.position.y +
        14 +
        SuspensionVisual.rearCompression,

        wheel1.position.x,

        wheel1.position.y

    );


    drawSuspension(

        car.position.x + 40,

        car.position.y +
        14 +
        SuspensionVisual.frontCompression,

        wheel2.position.x,

        wheel2.position.y

    );


    // ==================================
    // WHEELS
    // ==================================

    drawWheel(
        wheel1
    );

    drawWheel(
        wheel2
    );


    // ==================================
    // CAR BODY
    // ==================================

    ctx.save();


    ctx.translate(

        car.position.x,

        car.position.y

    );


    ctx.rotate(
        car.angle
    );


    const scaleX =

        CAR.width /
        120;


    const scaleY =

        CAR.height /
        30;


    ctx.scale(

        scaleX,

        scaleY

    );


    // ==================================
    // BODY SHADOW
    // ==================================

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";


    ctx.beginPath();


    ctx.roundRect(

        -58,

        -9,

        116,

        28,

        7

    );


    ctx.fill();


    // ==================================
    // MAIN BODY
    // ==================================

    const bodyGradient =

        ctx.createLinearGradient(

            0,

            -20,

            0,

            20

        );


    bodyGradient.addColorStop(

        0,

        lightenCarColor(
            CAR.color,
            35
        )

    );


    bodyGradient.addColorStop(

        1,

        CAR.color

    );


    ctx.fillStyle =
        bodyGradient;


    ctx.beginPath();


    ctx.moveTo(
        -58,
        -13
    );


    ctx.lineTo(
        -28,
        -18
    );


    ctx.lineTo(
        15,
        -18
    );


    ctx.lineTo(
        31,
        -10
    );


    ctx.lineTo(
        59,
        -6
    );


    ctx.lineTo(
        59,
        14
    );


    ctx.lineTo(
        -58,
        14
    );


    ctx.closePath();


    ctx.fill();


    // ==================================
    // CABIN
    // ==================================

    ctx.fillStyle =
        CAR.roofColor;


    ctx.beginPath();


    ctx.moveTo(
        -22,
        -18
    );


    ctx.lineTo(
        -11,
        -43
    );


    ctx.lineTo(
        19,
        -43
    );


    ctx.lineTo(
        34,
        -17
    );


    ctx.closePath();


    ctx.fill();


    // ==================================
    // WINDOWS
    // ==================================

    ctx.fillStyle =
        "#b3e5fc";


    ctx.beginPath();


    ctx.moveTo(
        -15,
        -21
    );


    ctx.lineTo(
        -7,
        -38
    );


    ctx.lineTo(
        2,
        -38
    );


    ctx.lineTo(
        2,
        -21
    );


    ctx.closePath();


    ctx.fill();


    ctx.fillStyle =
        "#81d4fa";


    ctx.beginPath();


    ctx.moveTo(
        7,
        -38
    );


    ctx.lineTo(
        17,
        -38
    );


    ctx.lineTo(
        28,
        -21
    );


    ctx.lineTo(
        7,
        -21
    );


    ctx.closePath();


    ctx.fill();


    // ==================================
    // WINDOW BORDER
    // ==================================

    ctx.strokeStyle =
        "#263238";


    ctx.lineWidth = 3;


    ctx.beginPath();


    ctx.moveTo(
        4,
        -41
    );


    ctx.lineTo(
        4,
        -20
    );


    ctx.stroke();


    // ==================================
    // FRONT HOOD
    // ==================================

    ctx.fillStyle =

        darkenCarColor(
            CAR.color,
            35
        );


    ctx.fillRect(

        30,

        -9,

        29,

        7

    );


    // ==================================
    // BUMPER
    // ==================================

    ctx.fillStyle =
        "#37474f";


    ctx.fillRect(

        54,

        8,

        13,

        6

    );


    ctx.fillRect(

        -65,

        8,

        10,

        6

    );


    // ==================================
    // HEADLIGHT
    // ==================================

    ctx.fillStyle =
        "#fff59d";


    ctx.beginPath();


    ctx.arc(

        55,

        -2,

        5,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // DOOR
    // ==================================

    ctx.strokeStyle =
        "rgba(20,20,20,0.55)";


    ctx.lineWidth = 2;


    ctx.strokeRect(

        -20,

        -15,

        43,

        27

    );


    // ==================================
    // DOOR HANDLE
    // ==================================

    ctx.fillStyle =
        "#263238";


    ctx.fillRect(

        12,

        -9,

        7,

        2

    );


    // ==================================
    // DRIVER
    // ==================================

    drawDriver();


    ctx.restore();

}

// ======================================
// DRAW PLAYABLE BIKE
// ======================================

function drawBike() {

    // ==================================
    // WHEELS
    // ==================================

    drawWheel(
        wheel1
    );


    drawWheel(
        wheel2
    );


    ctx.save();


    ctx.translate(

        car.position.x,

        car.position.y

    );


    ctx.rotate(
        car.angle
    );


    // ==================================
    // BIKE SHADOW
    // ==================================

    ctx.fillStyle =
        "rgba(0,0,0,0.20)";


    ctx.beginPath();


    ctx.ellipse(

        0,

        23,

        42,

        7,

        0,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // MAIN BIKE FRAME
    // ==================================

    ctx.strokeStyle =
        CAR.color;


    ctx.lineWidth = 6;


    ctx.lineCap =
        "round";


    ctx.lineJoin =
        "round";


    ctx.beginPath();


    // REAR HUB

    ctx.moveTo(
        -32,
        22
    );


    // SEAT FRAME

    ctx.lineTo(
        -10,
        -3
    );


    // ENGINE FRAME

    ctx.lineTo(
        10,
        20
    );


    // REAR FRAME

    ctx.lineTo(
        -32,
        22
    );


    // LOWER FRAME

    ctx.lineTo(
        10,
        20
    );


    // FRONT FRAME

    ctx.lineTo(
        27,
        -8
    );


    ctx.stroke();


    // ==================================
    // FRONT FORK
    // ==================================

    ctx.strokeStyle =
        "#b0bec5";


    ctx.lineWidth = 5;


    ctx.beginPath();


    ctx.moveTo(
        27,
        -8
    );


    ctx.lineTo(
        32,
        22
    );


    ctx.stroke();


    // ==================================
    // REAR SUSPENSION
    // ==================================

    ctx.strokeStyle =
        "#ffc107";


    ctx.lineWidth = 4;


    ctx.beginPath();


    ctx.moveTo(
        -10,
        -1
    );


    ctx.lineTo(
        -26,
        18
    );


    ctx.stroke();


    // ==================================
    // ENGINE
    // ==================================

    const engineGradient =

        ctx.createLinearGradient(

            -10,

            4,

            12,

            20

        );


    engineGradient.addColorStop(

        0,

        "#78909c"

    );


    engineGradient.addColorStop(

        1,

        "#263238"

    );


    ctx.fillStyle =
        engineGradient;


    ctx.beginPath();


    ctx.roundRect(

        -10,

        4,

        23,

        17,

        4

    );


    ctx.fill();


    // ==================================
    // ENGINE DETAIL
    // ==================================

    ctx.strokeStyle =
        "#cfd8dc";


    ctx.lineWidth = 2;


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        ctx.beginPath();


        ctx.moveTo(

            -7,

            8 + i * 3

        );


        ctx.lineTo(

            8,

            8 + i * 3

        );


        ctx.stroke();

    }


    // ==================================
    // FUEL TANK
    // ==================================

    const tankGradient =

        ctx.createLinearGradient(

            0,

            -14,

            0,

            3

        );


    tankGradient.addColorStop(

        0,

        lightenCarColor(
            CAR.color,
            35
        )

    );


    tankGradient.addColorStop(

        1,

        CAR.color

    );


    ctx.fillStyle =
        tankGradient;


    ctx.beginPath();


    ctx.roundRect(

        -5,

        -12,

        27,

        15,

        7

    );


    ctx.fill();


    // ==================================
    // SEAT
    // ==================================

    ctx.strokeStyle =
        "#171717";


    ctx.lineWidth = 7;


    ctx.beginPath();


    ctx.moveTo(
        -20,
        -7
    );


    ctx.lineTo(
        -5,
        -7
    );


    ctx.stroke();


    // ==================================
    // HANDLE STEM
    // ==================================

    ctx.strokeStyle =
        "#455a64";


    ctx.lineWidth = 4;


    ctx.beginPath();


    ctx.moveTo(
        27,
        -8
    );


    ctx.lineTo(
        28,
        -19
    );


    ctx.stroke();


    // ==================================
    // HANDLE BAR
    // ==================================

    ctx.strokeStyle =
        "#212121";


    ctx.lineWidth = 4;


    ctx.beginPath();


    ctx.moveTo(
        21,
        -19
    );


    ctx.lineTo(
        35,
        -19
    );


    ctx.stroke();


    // ==================================
    // EXHAUST
    // ==================================

    ctx.strokeStyle =
        "#546e7a";


    ctx.lineWidth = 5;


    ctx.beginPath();


    ctx.moveTo(
        4,
        17
    );


    ctx.lineTo(
        -14,
        22
    );


    ctx.lineTo(
        -34,
        17
    );


    ctx.stroke();


    // ==================================
    // HEADLIGHT
    // ==================================

    ctx.fillStyle =
        "#fff59d";


    ctx.beginPath();


    ctx.arc(

        30,

        -11,

        4,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // RIDER
    // ==================================

    drawBikeRider();


    ctx.restore();

}

// ======================================
// DRAW PLAYABLE CYCLE
// ======================================

function drawCycle() {

    // ==================================
    // WHEELS
    // ==================================

    drawWheel(
        wheel1
    );


    drawWheel(
        wheel2
    );


    // ==================================
    // CYCLE BODY
    // ==================================

    ctx.save();


    ctx.translate(

        car.position.x,

        car.position.y

    );


    ctx.rotate(
        car.angle
    );


    // ==================================
    // FRAME
    // ==================================

    ctx.strokeStyle =
        CAR.color;


    ctx.lineWidth =
        4;


    ctx.lineCap =
        "round";


    ctx.lineJoin =
        "round";


    ctx.beginPath();


    // REAR WHEEL TO SEAT

    ctx.moveTo(

        -CAR.wheelOffsetX,

        CAR.wheelOffsetY

    );


    ctx.lineTo(

        -10,

        -4

    );


    // SEAT TO PEDAL

    ctx.lineTo(

        0,

        20

    );


    // PEDAL TO REAR WHEEL

    ctx.lineTo(

        -CAR.wheelOffsetX,

        CAR.wheelOffsetY

    );


    // TOP FRAME

    ctx.moveTo(

        -10,

        -4

    );


    ctx.lineTo(

        20,

        1

    );


    // FRONT TRIANGLE

    ctx.lineTo(

        0,

        20

    );


    ctx.lineTo(

        CAR.wheelOffsetX,

        CAR.wheelOffsetY

    );


    ctx.stroke();


    // ==================================
    // FRONT FORK
    // ==================================

    ctx.strokeStyle =
        "#b0bec5";


    ctx.lineWidth =
        3;


    ctx.beginPath();


    ctx.moveTo(

        20,

        1

    );


    ctx.lineTo(

        CAR.wheelOffsetX,

        CAR.wheelOffsetY

    );


    ctx.stroke();


    // ==================================
    // HANDLE STEM
    // ==================================

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


    // ==================================
    // HANDLE
    // ==================================

    ctx.strokeStyle =
        "#263238";


    ctx.lineWidth =
        3;


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


    // ==================================
    // SEAT
    // ==================================

    ctx.strokeStyle =
        "#212121";


    ctx.lineWidth =
        5;


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


    // ==================================
    // PEDAL ROTATION
    // ==================================

    const pedalAngle =

        wheel1.angle *
        1.35;


    const pedalX =

        Math.cos(
            pedalAngle
        ) *
        8;


    const pedalY =

        Math.sin(
            pedalAngle
        ) *
        8;


    // ==================================
    // PEDAL GEAR
    // ==================================

    ctx.strokeStyle =
        "#455a64";


    ctx.lineWidth =
        2;


    ctx.beginPath();


    ctx.arc(

        0,

        20,

        5,

        0,

        Math.PI * 2

    );


    ctx.stroke();


    // ==================================
    // PEDAL ARM
    // ==================================

    ctx.beginPath();


    ctx.moveTo(

        -pedalX,

        20 -
        pedalY

    );


    ctx.lineTo(

        pedalX,

        20 +
        pedalY

    );


    ctx.stroke();


    // ==================================
    // CHAIN
    // ==================================

    ctx.strokeStyle =
        "#78909c";


    ctx.lineWidth =
        1.5;


    ctx.beginPath();


    ctx.moveTo(

        0,

        16

    );


    ctx.lineTo(

        -CAR.wheelOffsetX,

        CAR.wheelOffsetY -
        3

    );


    ctx.lineTo(

        -CAR.wheelOffsetX,

        CAR.wheelOffsetY +
        3

    );


    ctx.lineTo(

        0,

        24

    );


    ctx.stroke();


    // ==================================
    // RIDER
    // ==================================

    drawCycleRider(

        pedalX,

        pedalY

    );


    ctx.restore();

}


// ======================================
// DRAW CYCLE RIDER
// ======================================

function drawCycleRider(

    pedalX,

    pedalY

) {

    // ==================================
    // BACK LEG
    // ==================================

    ctx.strokeStyle =
        "#263238";


    ctx.lineWidth =
        6;


    ctx.lineCap =
        "round";


    ctx.beginPath();


    ctx.moveTo(

        -8,

        -8

    );


    ctx.lineTo(

        -2,

        5

    );


    ctx.lineTo(

        pedalX,

        20 +
        pedalY

    );


    ctx.stroke();


    // ==================================
    // FRONT LEG
    // ==================================

    ctx.beginPath();


    ctx.moveTo(

        -8,

        -8

    );


    ctx.lineTo(

        3,

        5

    );


    ctx.lineTo(

        -pedalX,

        20 -
        pedalY

    );


    ctx.stroke();


    // ==================================
    // RIDER BODY
    // ==================================

    ctx.strokeStyle =
        "#7b1fa2";


    ctx.lineWidth =
        9;


    ctx.beginPath();


    ctx.moveTo(

        -8,

        -9

    );


    ctx.lineTo(

        2,

        -31

    );


    ctx.lineTo(

        17,

        -18

    );


    ctx.stroke();


    // ==================================
    // RIDER ARM
    // ==================================

    ctx.strokeStyle =
        "#d89b72";


    ctx.lineWidth =
        5;


    ctx.beginPath();


    ctx.moveTo(

        2,

        -27

    );


    ctx.lineTo(

        13,

        -21

    );


    ctx.lineTo(

        23,

        -12

    );


    ctx.stroke();


    // ==================================
    // NECK
    // ==================================

    ctx.fillStyle =
        "#d89b72";


    ctx.fillRect(

        -1,

        -40,

        7,

        8

    );


    // ==================================
    // HEAD
    // ==================================

    ctx.beginPath();


    ctx.arc(

        3,

        -47,

        9,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // HELMET
    // ==================================

    ctx.fillStyle =
        CAR.color;


    ctx.beginPath();


    ctx.arc(

        3,

        -49,

        10,

        Math.PI,

        Math.PI * 2

    );


    ctx.fill();

}


// ======================================
// DRAW BIKE RIDER
// ======================================

function drawBikeRider() {

    // ==================================
    // BACK LEG
    // ==================================

    ctx.strokeStyle =
        "#263238";


    ctx.lineWidth = 7;


    ctx.lineCap =
        "round";


    ctx.beginPath();


    ctx.moveTo(
        -8,
        -12
    );


    ctx.lineTo(
        1,
        4
    );


    ctx.lineTo(
        11,
        15
    );


    ctx.stroke();


    // ==================================
    // RIDER BODY
    // ==================================

    ctx.strokeStyle =
        "#1565c0";


    ctx.lineWidth = 10;


    ctx.beginPath();


    ctx.moveTo(
        -8,
        -13
    );


    ctx.lineTo(
        3,
        -36
    );


    ctx.lineTo(
        19,
        -22
    );


    ctx.stroke();


    // ==================================
    // ARM
    // ==================================

    ctx.strokeStyle =
        "#d89b72";


    ctx.lineWidth = 6;


    ctx.beginPath();


    ctx.moveTo(
        3,
        -31
    );


    ctx.lineTo(
        16,
        -25
    );


    ctx.lineTo(
        27,
        -19
    );


    ctx.stroke();


    // ==================================
    // GLOVE
    // ==================================

    ctx.fillStyle =
        "#212121";


    ctx.beginPath();


    ctx.arc(

        27,

        -19,

        4,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // NECK
    // ==================================

    ctx.fillStyle =
        "#d89b72";


    ctx.fillRect(

        -1,

        -44,

        7,

        8

    );


    // ==================================
    // HEAD
    // ==================================

    ctx.fillStyle =
        "#d89b72";


    ctx.beginPath();


    ctx.arc(

        3,

        -50,

        10,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // HELMET
    // ==================================

    const helmetGradient =

        ctx.createLinearGradient(

            0,

            -63,

            0,

            -46

        );


    helmetGradient.addColorStop(

        0,

        "#f44336"

    );


    helmetGradient.addColorStop(

        1,

        "#b71c1c"

    );


    ctx.fillStyle =
        helmetGradient;


    ctx.beginPath();


    ctx.arc(

        3,

        -51,

        12,

        Math.PI,

        Math.PI * 2

    );


    ctx.lineTo(

        15,

        -48

    );


    ctx.lineTo(

        8,

        -45

    );


    ctx.closePath();


    ctx.fill();


    // ==================================
    // VISOR
    // ==================================

    ctx.fillStyle =
        "rgba(38,50,56,0.9)";


    ctx.beginPath();


    ctx.moveTo(
        6,
        -55
    );


    ctx.lineTo(
        16,
        -52
    );


    ctx.lineTo(
        10,
        -48
    );


    ctx.lineTo(
        5,
        -49
    );


    ctx.closePath();


    ctx.fill();

}

// ======================================
// LIGHTEN CAR COLOR
// ======================================

function lightenCarColor(
    color,
    amount
) {

    return adjustCarColor(

        color,

        amount

    );

}


// ======================================
// DARKEN CAR COLOR
// ======================================

function darkenCarColor(
    color,
    amount
) {

    return adjustCarColor(

        color,

        -amount

    );

}


// ======================================
// ADJUST COLOR
// ======================================

function adjustCarColor(
    color,
    amount
) {

    let value =

        color.replace(
            "#",
            ""
        );


    if (
        value.length === 3
    ) {

        value =

            value
                .split("")
                .map(

                    char =>
                        char + char

                )
                .join("");

    }


    const number =

        parseInt(
            value,
            16
        );


    let red =

        (
            number >> 16
        ) +

        amount;


    let green =

        (
            (
                number >> 8
            ) &
            0x00FF
        ) +

        amount;


    let blue =

        (
            number &
            0x0000FF
        ) +

        amount;


    red =

        Math.max(

            0,

            Math.min(
                255,
                red
            )

        );


    green =

        Math.max(

            0,

            Math.min(
                255,
                green
            )

        );


    blue =

        Math.max(

            0,

            Math.min(
                255,
                blue
            )

        );


    return (

        "#" +

        (
            (
                1 << 24
            ) +

            (
                red << 16
            ) +

            (
                green << 8
            ) +

            blue
        )
            .toString(16)
            .slice(1)

    );

}

// ======================================
// DRAW SUSPENSION
// ======================================

function drawSuspension(
    startX,
    startY,
    endX,
    endY
) {

    let level = 0;

    if (
        typeof Garage !== "undefined" &&
        Garage.upgrades
    ) {

        level =
            Number(
                Garage.upgrades.suspension
            ) || 0;

    }


    // LEVEL 0 = HIDDEN

    if (level <= 0) {

        return;

    }


    const dx =
        endX - startX;

    const dy =
        endY - startY;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance <= 0) {

        return;

    }


    const angle =
        Math.atan2(
            dy,
            dx
        );


    ctx.save();

    ctx.translate(
        startX,
        startY
    );

    ctx.rotate(
        angle
    );


    // ==================================
    // BLACK BACK SHOCK
    // ==================================

    ctx.strokeStyle =
        "#111111";

    ctx.lineWidth =
        7 + level * 0.5;

    ctx.lineCap =
        "round";

    ctx.beginPath();

    ctx.moveTo(
        0,
        0
    );

    ctx.lineTo(
        distance,
        0
    );

    ctx.stroke();


    // ==================================
    // SHOCK ABSORBER
    // ==================================

    ctx.strokeStyle =

        level >= 5
            ? "#ffc107"
            : level >= 3
                ? "#ff5722"
                : "#90a4ae";


    ctx.lineWidth =
        3 + level * 0.4;


    ctx.beginPath();

    ctx.moveTo(
        2,
        0
    );

    ctx.lineTo(
        distance - 2,
        0
    );

    ctx.stroke();


    // ==================================
    // SPRING
    // ==================================

    const springStart = 4;

    const springEnd =
        distance - 4;

    const springLength =
        springEnd -
        springStart;


    const coils =
        6 + level * 2;


    const springSize =
        5 + level;


    ctx.strokeStyle =

        level >= 5
            ? "#fff176"
            : "#ffffff";


    ctx.lineWidth =
        2 + level * 0.25;


    ctx.beginPath();

    ctx.moveTo(
        springStart,
        0
    );


    for (
        let i = 1;
        i <= coils;
        i++
    ) {

        const progress =
            i / coils;


        const x =

            springStart +

            springLength *
            progress;


        const y =

            i % 2 === 0
                ? -springSize
                : springSize;


        ctx.lineTo(
            x,
            y
        );

    }


    ctx.lineTo(
        springEnd,
        0
    );

    ctx.stroke();


    // ==================================
    // BODY JOINT
    // ==================================

    ctx.fillStyle =
        "#ffc107";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // ==================================
    // WHEEL JOINT
    // ==================================

    ctx.beginPath();

    ctx.arc(
        distance,
        0,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


// ======================================
// ENGINE
// ======================================

function accelerate(dir) {

    Body.setAngularVelocity(

        wheel1,

        dir *

        CAR.enginePower *

        CAR.accelerationMultiplier

    );


    Body.setAngularVelocity(

        wheel2,

        dir *

        CAR.enginePower *

        CAR.accelerationMultiplier

    );

}


// ======================================
// BRAKE
// ======================================

function brake() {

    Body.setAngularVelocity(

        wheel1,

        0

    );


    Body.setAngularVelocity(

        wheel2,

        0

    );

}


// ======================================
// DRAW DRIVER
// ======================================

function drawDriver() {

    ctx.save();


    // ==================================
    // DRIVER BODY
    // ==================================

    ctx.fillStyle =
        "#263238";


    ctx.beginPath();


    ctx.roundRect(

        -8,

        -30,

        18,

        25,

        5

    );


    ctx.fill();


    // ==================================
    // NECK
    // ==================================

    ctx.fillStyle =
        "#d89b72";


    ctx.fillRect(

        -2,

        -35,

        7,

        7

    );


    // ==================================
    // HEAD
    // ==================================

    ctx.fillStyle =
        "#d89b72";


    ctx.beginPath();


    ctx.arc(

        2,

        -42,

        10,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // HELMET
    // ==================================

    const helmetGradient =

        ctx.createLinearGradient(

            0,

            -55,

            0,

            -37

        );


    helmetGradient.addColorStop(

        0,

        "#ffeb3b"

    );


    helmetGradient.addColorStop(

        1,

        "#f57f17"

    );


    ctx.fillStyle =
        helmetGradient;


    ctx.beginPath();


    ctx.arc(

        2,

        -43,

        12,

        Math.PI,

        Math.PI * 2

    );


    ctx.lineTo(

        14,

        -40

    );


    ctx.lineTo(

        8,

        -38

    );


    ctx.closePath();


    ctx.fill();


    // ==================================
    // HELMET STRIPE
    // ==================================

    ctx.strokeStyle =
        "#e53935";


    ctx.lineWidth = 3;


    ctx.beginPath();


    ctx.moveTo(

        2,

        -54

    );


    ctx.lineTo(

        2,

        -44

    );


    ctx.stroke();


    // ==================================
    // VISOR
    // ==================================

    ctx.fillStyle =

        "rgba(38,50,56,0.85)";


    ctx.beginPath();


    ctx.moveTo(

        5,

        -47

    );


    ctx.lineTo(

        15,

        -44

    );


    ctx.lineTo(

        10,

        -40

    );


    ctx.lineTo(

        5,

        -41

    );


    ctx.closePath();


    ctx.fill();


    // ==================================
    // ARM
    // ==================================

    ctx.strokeStyle =
        "#d89b72";


    ctx.lineWidth = 5;


    ctx.lineCap =
        "round";


    ctx.beginPath();


    ctx.moveTo(

        5,

        -24

    );


    ctx.lineTo(

        16,

        -18

    );


    ctx.lineTo(

        21,

        -12

    );


    ctx.stroke();


    // ==================================
    // STEERING WHEEL
    // ==================================

    ctx.strokeStyle =
        "#212121";


    ctx.lineWidth = 3;


    ctx.beginPath();


    ctx.arc(

        22,

        -13,

        7,

        0,

        Math.PI * 2

    );


    ctx.stroke();


    // ==================================
    // SEAT
    // ==================================

    ctx.fillStyle =
        "#37474f";


    ctx.beginPath();


    ctx.roundRect(

        -14,

        -29,

        7,

        28,

        3

    );


    ctx.fill();


    ctx.restore();

}

// ======================================
// REBUILD SELECTED CAR
// ======================================

function rebuildCar() {

    if (
        !car ||
        !wheel1 ||
        !wheel2
    ) {

        return;

    }


    // ==================================
    // SAVE CURRENT POSITION
    // ==================================

    const position = {

        x: car.position.x,

        y: car.position.y

    };


    const angle =
        car.angle;


    // ==================================
    // REMOVE OLD CAR
    // ==================================

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


    // ==================================
    // CREATE SELECTED CAR
    // ==================================

    createCar(

        position.x,

        position.y

    );


    // ==================================
    // RESET BODY
    // ==================================

    Body.setAngle(

        car,

        angle

    );


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


    // ==================================
    // RESET WHEELS
    // ==================================

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


    // ==================================
    // RESET PHYSICS
    // ==================================

    Physics.wheelSpeed = 0;


    keys.ArrowLeft = false;

    keys.ArrowRight = false;


    // ==================================
    // REAPPLY GARAGE UPGRADES
    // ==================================

    if (
        typeof Garage !==
        "undefined"
    ) {

        Garage.applyUpgrades();

    }

}
// ======================================
// FINAL SUSPENSION DRAW OVERRIDE
// ======================================

drawSuspension = function (
    startX,
    startY,
    endX,
    endY
) {

    let level = 0;


    if (
        typeof Garage !== "undefined" &&
        Garage.upgrades
    ) {

        level =

            Number(
                Garage.upgrades.suspension
            ) || 0;

    }


    // ==================================
    // LEVEL 0 = NO SUSPENSION VISUAL
    // ==================================

    if (
        level <= 0
    ) {

        return;

    }


    const dx =

        endX -
        startX;


    const dy =

        endY -
        startY;


    const distance =

        Math.sqrt(

            dx * dx +

            dy * dy

        );


    if (
        !Number.isFinite(distance) ||
        distance <= 1
    ) {

        return;

    }


    const angle =

        Math.atan2(

            dy,

            dx

        );


    ctx.save();


    ctx.translate(

        startX,

        startY

    );


    ctx.rotate(
        angle
    );


    // ==================================
    // SHOCK BACK BODY
    // ==================================

    ctx.strokeStyle =
        "#111111";


    ctx.lineWidth =

        6 +

        level * 0.45;


    ctx.lineCap =
        "round";


    ctx.beginPath();


    ctx.moveTo(
        0,
        0
    );


    ctx.lineTo(
        distance,
        0
    );


    ctx.stroke();


    // ==================================
    // INNER SHOCK
    // ==================================

    ctx.strokeStyle =

        level >= 5
            ? "#ffc107"
            : level >= 3
                ? "#ff5722"
                : "#90a4ae";


    ctx.lineWidth =

        2.5 +

        level * 0.35;


    ctx.beginPath();


    ctx.moveTo(
        2,
        0
    );


    ctx.lineTo(

        Math.max(
            2,
            distance - 2
        ),

        0

    );


    ctx.stroke();


    // ==================================
    // SPRING SETTINGS
    // ==================================

    const springStart =

        Math.min(
            5,
            distance * 0.15
        );


    const springEnd =

        Math.max(

            springStart,

            distance -
            springStart

        );


    const springLength =

        Math.max(

            0,

            springEnd -
            springStart

        );


    const coils =

        7 +

        level * 2;


    const springSize =

        Math.min(

            5 +
            level * 0.75,

            Math.max(
                3,
                distance * 0.18
            )

        );


    // ==================================
    // DRAW SPRING
    // ==================================

    ctx.strokeStyle =

        level >= 5
            ? "#fff176"
            : "#ffffff";


    ctx.lineWidth =

        1.8 +

        level * 0.22;


    ctx.beginPath();


    ctx.moveTo(

        springStart,

        0

    );


    for (
        let i = 1;
        i <= coils;
        i++
    ) {

        const progress =

            i /
            coils;


        const springX =

            springStart +

            springLength *
            progress;


        let springY = 0;


        if (
            i < coils
        ) {

            springY =

                i % 2 === 0
                    ? -springSize
                    : springSize;

        }


        ctx.lineTo(

            springX,

            springY

        );

    }


    ctx.stroke();


    // ==================================
    // BODY JOINT
    // ==================================

    ctx.fillStyle =

        level >= 5
            ? "#ffc107"
            : "#607d8b";


    ctx.beginPath();


    ctx.arc(

        0,

        0,

        4,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // WHEEL JOINT
    // ==================================

    ctx.beginPath();


    ctx.arc(

        distance,

        0,

        4,

        0,

        Math.PI * 2

    );


    ctx.fill();


    ctx.restore();

};

// =========================================
// HILL BIKE BALANCE PHYSICS
// PART 3
// =========================================

const BikePhysics = {

    enabled: false,

    groundBalanceForce: 0.018,

    airBalanceForce: 0.008,

    landingBalanceForce: 0.022,

    maxGroundRotation: 0.09,

    maxAirRotation: 0.16,


    // =====================================
    // CHECK BIKE
    // =====================================

    isBike() {

        return (

            typeof CAR !== "undefined" &&

            CAR.type === "bike"

        );

    },


    // =====================================
    // UPDATE
    // =====================================

    update() {

        if (
            !this.isBike()
        ) {

            this.enabled = false;

            return;

        }


        if (

            typeof car === "undefined" ||

            !car

        ) {

            return;

        }


        this.enabled = true;


        // =================================
        // BIKE ON GROUND
        // =================================

        if (
            Physics.grounded
        ) {

            this.updateGroundBalance();

        }


        // =================================
        // BIKE IN AIR
        // =================================

        else {

            this.updateAirBalance();

        }


        this.limitRotation();

    },


    // =====================================
    // GROUND BALANCE
    // =====================================

    updateGroundBalance() {

        if (

            !Physics.rearGrounded &&

            !Physics.frontGrounded

        ) {

            return;

        }


        const terrainAngle =

            Physics.getTerrainAngle(

                car.position.x

            );


        const difference =

            this.normalizeAngle(

                terrainAngle -

                car.angle

            );


        // =================================
        // SPEED
        // =================================

        const speed =

            Math.abs(
                car.velocity.x
            );


        let balanceStrength =

            this.groundBalanceForce;


        // =================================
        // MORE STABILITY AT SPEED
        // =================================

        if (
            speed > 3
        ) {

            balanceStrength +=

                Math.min(

                    0.012,

                    speed *
                    0.0008

                );

        }


        // =================================
        // ONE WHEEL TOUCH
        // =================================

        if (

            !Physics.rearGrounded ||

            !Physics.frontGrounded

        ) {

            balanceStrength *=

                0.45;

        }


        // =================================
        // APPLY BALANCE
        // =================================

        const correction =

            difference *

            balanceStrength;


        Body.setAngularVelocity(

            car,

            car.angularVelocity +

            correction

        );


        // =================================
        // REDUCE SMALL VIBRATION
        // =================================

        if (

            Physics.rearGrounded &&

            Physics.frontGrounded &&

            Math.abs(
                difference
            ) < 0.08

        ) {

            Body.setAngularVelocity(

                car,

                car.angularVelocity *
                0.94

            );

        }

    },


    // =====================================
    // AIR BALANCE
    // =====================================

    updateAirBalance() {

        let rotationForce =

            this.airBalanceForce;


        // =================================
        // SUSPENSION UPGRADE
        // =================================

        if (

            typeof Physics.getSuspensionLevel ===
            "function"

        ) {

            const suspensionLevel =

                Physics.getSuspensionLevel();


            rotationForce *=

                1 +

                suspensionLevel *
                0.035;

        }


        // =================================
        // RIGHT = BIKE FRONT UP
        // =================================

        if (
            keys["ArrowRight"]
        ) {

            Body.setAngularVelocity(

                car,

                car.angularVelocity +

                rotationForce

            );

        }


        // =================================
        // LEFT = BIKE FRONT DOWN
        // =================================

        if (
            keys["ArrowLeft"]
        ) {

            Body.setAngularVelocity(

                car,

                car.angularVelocity -

                rotationForce

            );

        }


        // =================================
        // AIR ROTATION DAMPING
        // =================================

        if (

            !keys["ArrowRight"] &&

            !keys["ArrowLeft"]

        ) {

            Body.setAngularVelocity(

                car,

                car.angularVelocity *
                0.998

            );

        }

    },


    // =====================================
    // LANDING BALANCE
    // =====================================

    stabilizeLanding() {

        if (
            !this.isBike()
        ) {

            return;

        }


        if (

            !Physics.rearGrounded ||

            !Physics.frontGrounded

        ) {

            return;

        }


        const terrainAngle =

            Physics.getTerrainAngle(

                car.position.x

            );


        const difference =

            this.normalizeAngle(

                terrainAngle -

                car.angle

            );


        const correction =

            difference *

            this.landingBalanceForce;


        Body.setAngularVelocity(

            car,

            car.angularVelocity +

            correction

        );

    },


    // =====================================
    // LIMIT BIKE ROTATION
    // =====================================

    limitRotation() {

        let maxRotation;


        if (
            Physics.grounded
        ) {

            maxRotation =

                this.maxGroundRotation;

        }

        else {

            maxRotation =

                this.maxAirRotation;

        }


        if (

            car.angularVelocity >

            maxRotation

        ) {

            Body.setAngularVelocity(

                car,

                maxRotation

            );

        }


        if (

            car.angularVelocity <

            -maxRotation

        ) {

            Body.setAngularVelocity(

                car,

                -maxRotation

            );

        }

    },


    // =====================================
    // NORMALIZE ANGLE
    // =====================================

    normalizeAngle(angle) {

        while (
            angle > Math.PI
        ) {

            angle -=

                Math.PI * 2;

        }


        while (
            angle < -Math.PI
        ) {

            angle +=

                Math.PI * 2;

        }


        return angle;

    }

};


// =========================================
// CONNECT BIKE PHYSICS TO MAIN PHYSICS
// =========================================

const originalPhysicsUpdate =

    Physics.update.bind(
        Physics
    );


Physics.update = function () {

    originalPhysicsUpdate();


    BikePhysics.update();


    BikePhysics.stabilizeLanding();

};

// =========================================
// BIKE AIR CONTROL CONFLICT FIX
// =========================================

const originalAirControl =
    Physics.updateAirControl.bind(
        Physics
    );


Physics.updateAirControl = function () {

    // BIKE AIR CONTROL
    // BikePhysics handle karega

    if (
        typeof CAR !== "undefined" &&
        CAR.type === "bike"
    ) {

        return;

    }


    // NORMAL CARS

    originalAirControl();

};

// ======================================
// DRAW PLAYABLE TEMPU
// ======================================

function drawTempu() {

    SuspensionVisual.update();


    // SUSPENSION

    drawSuspension(

        car.position.x -
        CAR.wheelOffsetX,

        car.position.y +
        CAR.height / 2 +
        SuspensionVisual.rearCompression,

        wheel1.position.x,

        wheel1.position.y

    );


    drawSuspension(

        car.position.x +
        CAR.wheelOffsetX,

        car.position.y +
        CAR.height / 2 +
        SuspensionVisual.frontCompression,

        wheel2.position.x,

        wheel2.position.y

    );


    // WHEELS

    drawWheel(
        wheel1
    );


    drawWheel(
        wheel2
    );


    ctx.save();


    ctx.translate(

        car.position.x,

        car.position.y

    );


    ctx.rotate(
        car.angle
    );


    const scaleX =

        CAR.width /
        112;


    const scaleY =

        CAR.height /
        42;


    ctx.scale(

        scaleX,

        scaleY

    );


    // ==================================
    // BODY SHADOW
    // ==================================

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";


    ctx.beginPath();


    ctx.roundRect(

        -55,

        -19,

        110,

        48,

        8

    );


    ctx.fill();


    // ==================================
    // MAIN YELLOW BODY
    // ==================================

    const bodyGradient =

        ctx.createLinearGradient(

            0,

            -20,

            0,

            28

        );


    bodyGradient.addColorStop(

        0,

        lightenCarColor(
            CAR.color,
            30
        )

    );


    bodyGradient.addColorStop(

        1,

        CAR.color

    );


    ctx.fillStyle =
        bodyGradient;


    ctx.beginPath();


    ctx.roundRect(

        -55,

        -20,

        110,

        48,

        8

    );


    ctx.fill();


    // ==================================
    // FRONT NOSE
    // ==================================

    ctx.beginPath();


    ctx.moveTo(
        52,
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
        47,
        24
    );


    ctx.closePath();


    ctx.fill();


    // ==================================
    // BLACK ROOF
    // ==================================

    ctx.fillStyle =
        CAR.roofColor;


    ctx.beginPath();


    ctx.roundRect(

        -48,

        -44,

        88,

        29,

        10

    );


    ctx.fill();


    // ==================================
    // REAR ROOF SUPPORT
    // ==================================

    ctx.fillRect(

        -48,

        -27,

        8,

        48

    );


    // ==================================
    // FRONT ROOF SUPPORT
    // ==================================

    ctx.fillRect(

        35,

        -27,

        9,

        49

    );


    // ==================================
    // SIDE WINDOW
    // ==================================

    ctx.fillStyle =
        "#b3e5fc";


    ctx.fillRect(

        -35,

        -38,

        41,

        20

    );


    // ==================================
    // FRONT WINDSCREEN
    // ==================================

    ctx.fillStyle =
        "#81d4fa";


    ctx.beginPath();


    ctx.moveTo(
        12,
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
        9,
        -17
    );


    ctx.closePath();


    ctx.fill();


    // ==================================
    // WINDOW BARS
    // ==================================

    ctx.strokeStyle =
        "#263238";


    ctx.lineWidth =
        3;


    ctx.beginPath();


    ctx.moveTo(
        -20,
        -38
    );


    ctx.lineTo(
        -20,
        -18
    );


    ctx.moveTo(
        -4,
        -38
    );


    ctx.lineTo(
        -4,
        -18
    );


    ctx.moveTo(
        8,
        -40
    );


    ctx.lineTo(
        8,
        -17
    );


    ctx.stroke();


    // ==================================
    // DRIVER
    // ==================================

    ctx.fillStyle =
        "#1565c0";


    ctx.fillRect(

        17,

        -18,

        14,

        21

    );


    ctx.fillStyle =
        "#d89b72";


    ctx.beginPath();


    ctx.arc(

        24,

        -27,

        8,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // STEERING HANDLE
    // ==================================

    ctx.strokeStyle =
        "#212121";


    ctx.lineWidth =
        3;


    ctx.beginPath();


    ctx.moveTo(
        30,
        -11
    );


    ctx.lineTo(
        42,
        -4
    );


    ctx.stroke();


    // ==================================
    // BLACK SIDE STRIPE
    // ==================================

    ctx.fillStyle =
        "#212121";


    ctx.fillRect(

        -52,

        7,

        104,

        6

    );


    // ==================================
    // FRONT MUDGUARD
    // ==================================

    ctx.strokeStyle =
        "#263238";


    ctx.lineWidth =
        5;


    ctx.beginPath();


    ctx.arc(

        39,

        27,

        20,

        Math.PI,

        Math.PI * 2

    );


    ctx.stroke();


    // ==================================
    // REAR MUDGUARD
    // ==================================

    ctx.beginPath();


    ctx.arc(

        -39,

        27,

        20,

        Math.PI,

        Math.PI * 2

    );


    ctx.stroke();


    // ==================================
    // HEADLIGHT
    // ==================================

    ctx.fillStyle =
        "#fff59d";


    ctx.beginPath();


    ctx.arc(

        59,

        4,

        5,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // REAR LIGHT
    // ==================================

    ctx.fillStyle =
        "#d50000";


    ctx.fillRect(

        -58,

        2,

        5,

        11

    );


    // ==================================
    // FRONT BUMPER
    // ==================================

    ctx.fillStyle =
        "#455a64";


    ctx.fillRect(

        55,

        18,

        16,

        6

    );


    // ==================================
    // NUMBER PLATE
    // ==================================

    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(

        51,

        10,

        13,

        5

    );


    ctx.restore();

}
// ======================================
// DRAW 4 BOGIE TRAIN
// ======================================

function drawTrain() {

    // ==================================
    // MAIN PHYSICS WHEELS
    // ==================================

    drawWheel(
        wheel1
    );


    drawWheel(
        wheel2
    );


    ctx.save();


    ctx.translate(

        car.position.x,

        car.position.y

    );


    ctx.rotate(
        car.angle
    );


    // ==================================
    // TRAIN ENGINE
    // ==================================

    const engineGradient =

        ctx.createLinearGradient(

            0,

            -30,

            0,

            30

        );


    engineGradient.addColorStop(

        0,

        lightenCarColor(
            CAR.color,
            30
        )

    );


    engineGradient.addColorStop(

        1,

        CAR.color

    );


    ctx.fillStyle =
        engineGradient;


    // MAIN ENGINE BODY

    ctx.beginPath();


    ctx.roundRect(

        -58,

        -20,

        110,

        47,

        7

    );


    ctx.fill();


    // ==================================
    // ENGINE FRONT
    // ==================================

    ctx.fillStyle =
        darkenCarColor(
            CAR.color,
            25
        );


    ctx.beginPath();


    ctx.roundRect(

        35,

        -7,

        36,

        34,

        5

    );


    ctx.fill();


    // ==================================
    // CABIN
    // ==================================

    ctx.fillStyle =
        CAR.roofColor;


    ctx.beginPath();


    ctx.roundRect(

        -48,

        -48,

        47,

        30,

        5

    );


    ctx.fill();


    // ==================================
    // CABIN WINDOW
    // ==================================

    ctx.fillStyle =
        "#81d4fa";


    ctx.fillRect(

        -39,

        -41,

        28,

        17

    );


    // WINDOW BORDER

    ctx.strokeStyle =
        "#263238";


    ctx.lineWidth =
        3;


    ctx.strokeRect(

        -39,

        -41,

        28,

        17

    );


    // ==================================
    // CHIMNEY
    // ==================================

    ctx.fillStyle =
        "#212121";


    ctx.fillRect(

        25,

        -35,

        14,

        31

    );


    ctx.beginPath();


    ctx.roundRect(

        18,

        -42,

        28,

        9,

        4

    );


    ctx.fill();


    // ==================================
    // FRONT LIGHT
    // ==================================

    ctx.fillStyle =
        "#fff59d";


    ctx.beginPath();


    ctx.arc(

        67,

        2,

        6,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // ENGINE DETAIL
    // ==================================

    ctx.fillStyle =
        "#ffc107";


    ctx.fillRect(

        -57,

        7,

        110,

        5

    );


    // ==================================
    // FRONT BUMPER
    // ==================================

    ctx.fillStyle =
        "#37474f";


    ctx.fillRect(

        64,

        20,

        17,

        7

    );


    // ==================================
    // DRIVER
    // ==================================

    ctx.fillStyle =
        "#d89b72";


    ctx.beginPath();


    ctx.arc(

        -25,

        -32,

        7,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // ==================================
    // DRAW 4 BOGIES
    // ==================================

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        drawTrainBogie(
            i
        );

    }


    ctx.restore();

}


// ======================================
// DRAW TRAIN BOGIE
// ======================================

function drawTrainBogie(
    index
) {

    const bogieX =

        -105 -
        index * 78;


    // ==================================
    // CONNECTOR
    // ==================================

    ctx.strokeStyle =
        "#37474f";


    ctx.lineWidth =
        5;


    ctx.beginPath();


    ctx.moveTo(

        bogieX + 37,

        12

    );


    ctx.lineTo(

        index === 0
            ? -58
            : bogieX + 44,

        12

    );


    ctx.stroke();


    // ==================================
    // BOGIE SHADOW
    // ==================================

    ctx.fillStyle =
        "rgba(0,0,0,0.20)";


    ctx.beginPath();


    ctx.roundRect(

        bogieX - 34,

        -19,

        69,

        48,

        6

    );


    ctx.fill();


    // ==================================
    // BOGIE BODY
    // ==================================

    let bogieColor;


    if (
        index === 0
    ) {

        bogieColor =
            "#1976d2";

    }

    else if (
        index === 1
    ) {

        bogieColor =
            "#388e3c";

    }

    else if (
        index === 2
    ) {

        bogieColor =
            "#f57c00";

    }

    else {

        bogieColor =
            "#7b1fa2";

    }


    ctx.fillStyle =
        bogieColor;


    ctx.beginPath();


    ctx.roundRect(

        bogieX - 34,

        -22,

        69,

        47,

        6

    );


    ctx.fill();


    // ==================================
    // ROOF
    // ==================================

    ctx.fillStyle =
        "#263238";


    ctx.beginPath();


    ctx.roundRect(

        bogieX - 38,

        -28,

        77,

        9,

        4

    );


    ctx.fill();


    // ==================================
    // WINDOWS
    // ==================================

    ctx.fillStyle =
        "#b3e5fc";


    ctx.fillRect(

        bogieX - 26,

        -14,

        17,

        15

    );


    ctx.fillRect(

        bogieX + 8,

        -14,

        17,

        15

    );


    // ==================================
    // WINDOW BORDERS
    // ==================================

    ctx.strokeStyle =
        "#263238";


    ctx.lineWidth =
        2;


    ctx.strokeRect(

        bogieX - 26,

        -14,

        17,

        15

    );


    ctx.strokeRect(

        bogieX + 8,

        -14,

        17,

        15

    );


    // ==================================
    // BOGIE STRIPE
    // ==================================

    ctx.fillStyle =
        "#ffc107";


    ctx.fillRect(

        bogieX - 32,

        7,

        65,

        4

    );


    // ==================================
    // LEFT WHEEL
    // ==================================

    drawTrainWheel(

        bogieX - 21,

        27

    );


    // ==================================
    // RIGHT WHEEL
    // ==================================

    drawTrainWheel(

        bogieX + 21,

        27

    );

}


// ======================================
// DRAW TRAIN WHEEL
// ======================================

function drawTrainWheel(
    x,
    y
) {

    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.rotate(
        wheel1.angle
    );


    // TYRE

    ctx.fillStyle =
        "#171717";


    ctx.beginPath();


    ctx.arc(

        0,

        0,

        11,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // METAL WHEEL

    ctx.fillStyle =
        "#78909c";


    ctx.beginPath();


    ctx.arc(

        0,

        0,

        7,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // HUB

    ctx.fillStyle =
        "#263238";


    ctx.beginPath();


    ctx.arc(

        0,

        0,

        3,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // WHEEL LINES

    ctx.strokeStyle =
        "#cfd8dc";


    ctx.lineWidth =
        1.5;


    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const angle =

            i *
            Math.PI /
            2;


        ctx.beginPath();


        ctx.moveTo(
            0,
            0
        );


        ctx.lineTo(

            Math.cos(
                angle
            ) *
            7,

            Math.sin(
                angle
            ) *
            7

        );


        ctx.stroke();

    }


    ctx.restore();

}