// =========================================
// HILL RIDER PHYSICS ENGINE
// physics.js
// =========================================

const Physics = {

    wheelSpeed: 0,

    smoothWheelSpeed: 0,

    roadSmoothness: 0.16,


    // =====================================
    // BASE PHYSICS
    // =====================================

    engineAcceleration: 0.018,

    engineRelease: 0.975,

    maxForwardSpeed: 0.58,

    maxReverseSpeed: -0.34,

    airRotationForce: 0.0035,

    downForce: 0.00012,


    // =====================================
    // GROUND STATE
    // =====================================

    grounded: false,

    rearGrounded: false,

    frontGrounded: false,


    // =====================================
    // MAP PHYSICS
    // =====================================

    mapAcceleration: 1,

    mapMaxSpeed: 1,

    mapGrip: 1,

    mapRelease: 1,

    mapAirControl: 1,

    mapDownForce: 1,

    slipAmount: 0,


    // =====================================
    // IDLE LOCK
    // =====================================

    idleFrames: 0,

    idlePose: null,


    // =====================================
    // UPDATE
    // =====================================

    update() {

        this.updateMapPhysics();

        this.detectGround();

        this.updateEngine();

        this.updateAirControl();

        this.applyDownForce();

        this.applyTerrainGrip();

        this.applyRoadSmoothing();

        this.stabilizeLanding();

        this.applyIdleStabilizer();

        this.limitCarSpeed();

    },


    // =====================================
    // GET MAP
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
    // CAR ACCELERATION
    // =====================================

    getCarAcceleration() {

        if (
            typeof CAR === "undefined"
        ) {

            return 1;

        }


        return (

            CAR.accelerationMultiplier ||

            1

        );

    },


    // =====================================
    // CAR MAX SPEED
    // =====================================

    getCarMaxSpeed() {

        if (
            typeof CAR === "undefined"
        ) {

            return 1;

        }


        return (

            CAR.maxSpeedMultiplier ||

            1

        );

    },


    // =====================================
    // CAR AIR CONTROL
    // =====================================

    getCarAirControl() {

        if (
            typeof CAR === "undefined"
        ) {

            return 1;

        }


        return (

            CAR.airControlMultiplier ||

            1

        );

    },


    // =====================================
    // CAR GRIP
    // =====================================

    getCarGrip() {

        if (
            typeof CAR === "undefined"
        ) {

            return 1;

        }


        return (

            CAR.gripMultiplier ||

            1

        );

    },

    // =====================================
    // SUSPENSION LEVEL
    // =====================================

    getSuspensionLevel() {

        if (
            typeof Garage === "undefined" ||
            !Garage.upgrades
        ) {

            return 0;

        }


        return Math.min(

            5,

            Math.max(

                0,

                Number(
                    Garage.upgrades.suspension
                ) || 0

            )

        );

    },
    // =====================================
    // ENGINE UPGRADE LEVEL
    // =====================================

    getEngineLevel() {

        if (
            typeof Garage === "undefined" ||
            !Garage.upgrades
        ) {

            return 0;

        }


        return Math.min(

            5,

            Math.max(

                0,

                Number(
                    Garage.upgrades.engine
                ) || 0

            )

        );

    },
    // =====================================
    // MAP PHYSICS
    // =====================================

    updateMapPhysics() {

        const map =
            this.getMap();


        // =================================
        // GREEN HILLS
        // =================================

        if (map === 0) {

            this.mapAcceleration = 1;

            this.mapMaxSpeed = 1;

            this.mapGrip = 1;

            this.mapRelease = 1;

            this.mapAirControl = 1;

            this.mapDownForce = 1;

            this.slipAmount = 0;


            return;

        }


        // =================================
        // DESERT
        // =================================

        if (map === 1) {

            this.mapAcceleration = 0.82;

            this.mapMaxSpeed = 0.92;

            this.mapGrip = 0.58;

            this.mapRelease = 0.99;

            this.mapAirControl = 0.92;

            this.mapDownForce = 0.9;

            this.slipAmount = 0.35;


            return;

        }


        // =================================
        // NIGHT HILLS
        // =================================

        this.mapAcceleration = 0.72;

        this.mapMaxSpeed = 0.88;

        this.mapGrip = 0.82;

        this.mapRelease = 0.96;

        this.mapAirControl = 0.72;

        this.mapDownForce = 1.25;

        this.slipAmount = 0.08;

    },


    // =====================================
    // GROUND DETECTION
    // =====================================

    detectGround() {

        this.rearGrounded =

            this.isWheelOnTerrain(
                wheel1
            );


        this.frontGrounded =

            this.isWheelOnTerrain(
                wheel2
            );


        this.grounded =

            this.rearGrounded ||

            this.frontGrounded;

    },


    // =====================================
    // WHEEL TERRAIN CHECK
    // =====================================

    isWheelOnTerrain(wheel) {

        const terrainY =

            getTerrainY(
                wheel.position.x
            );


        const wheelBottom =

            wheel.position.y +

            CAR.wheelRadius;


        const distance =

            terrainY -

            wheelBottom;


        const detectionRange =

            Math.max(

                16,

                CAR.wheelRadius * 0.72

            );


        return (

            distance >
            -detectionRange &&

            distance <
            detectionRange

        );

    },


    // =====================================
    // ENGINE
    // =====================================

    updateEngine() {

        if (

            typeof Fuel !== "undefined" &&

            !Fuel.canDrive()

        ) {

            this.wheelSpeed *=

                this.engineRelease;


            this.smoothWheelSpeed *=

                0.97;


            return;

        }


        const carAcceleration =

            this.getCarAcceleration();


        const carMaxSpeed =

            this.getCarMaxSpeed();

        // =================================
        // ENGINE UPGRADE POWER
        // =================================

        const engineLevel =

            this.getEngineLevel();


        const engineAccelerationBoost =

            1 +

            engineLevel * 0.12;


        const engineSpeedBoost =

            1 +

            engineLevel * 0.055;


        const engineHillPower =

            1 +

            engineLevel * 0.08;


        const acceleration =

            this.engineAcceleration *

            this.mapAcceleration *

            carAcceleration *

            engineAccelerationBoost;


        const forwardLimit =

            this.maxForwardSpeed *

            this.mapMaxSpeed *

            carMaxSpeed *

            engineSpeedBoost;


        const reverseLimit =

            this.maxReverseSpeed *

            this.mapMaxSpeed *

            carMaxSpeed *

            (
                1 +
                engineLevel * 0.025
            );


        // =================================
        // GAS
        // =================================

        if (
            keys["ArrowRight"]
        ) {

            this.resetIdleLock();


            this.wheelSpeed +=

                acceleration;

        }


        // =================================
        // BRAKE / REVERSE
        // =================================

        else if (
            keys["ArrowLeft"]
        ) {

            this.resetIdleLock();


            this.wheelSpeed -=

                acceleration;

        }


        // =================================
        // ENGINE RELEASE
        // =================================

        else {

            const release =

                Math.pow(

                    this.engineRelease,

                    this.mapRelease

                );


            this.wheelSpeed *=

                release;


            if (

                Math.abs(
                    this.wheelSpeed
                ) < 0.008

            ) {

                this.wheelSpeed = 0;

            }

        }


        // =================================
        // FORWARD LIMIT
        // =================================

        if (

            this.wheelSpeed >

            forwardLimit

        ) {

            this.wheelSpeed =

                forwardLimit;

        }


        // =================================
        // REVERSE LIMIT
        // =================================

        if (

            this.wheelSpeed <

            reverseLimit

        ) {

            this.wheelSpeed =

                reverseLimit;

        }


        // =================================
        // SMOOTH WHEEL DRIVE
        // =================================

        if (this.grounded) {

            let targetDriveSpeed =

                this.wheelSpeed;
            // =================================
            // HILL ENGINE TORQUE
            // =================================

            const terrainAngle =

                this.getTerrainAngle(

                    car.position.x

                );


            const climbingForward =

                terrainAngle < -0.08 &&

                keys["ArrowRight"];


            const climbingReverse =

                terrainAngle > 0.08 &&

                keys["ArrowLeft"];


            if (
                climbingForward ||
                climbingReverse
            ) {

                targetDriveSpeed *=

                    engineHillPower;

            }

            // =================================
            // TERRAIN SLIP
            // =================================

            if (

                this.slipAmount > 0 &&

                (
                    keys["ArrowRight"] ||

                    keys["ArrowLeft"]
                )

            ) {

                const carGrip =

                    this.getCarGrip();


                const finalSlip =

                    this.slipAmount /

                    Math.max(

                        0.5,

                        carGrip

                    );


                // =================================
                // REDUCED RANDOM JERK
                // =================================

                const slip =

                    1 +

                    Math.random() *

                    finalSlip *

                    0.35;


                targetDriveSpeed *=

                    slip;

            }


            // =================================
            // SMOOTH POWER TRANSFER
            // =================================

            this.smoothWheelSpeed +=

                (

                    targetDriveSpeed -

                    this.smoothWheelSpeed

                ) *

                this.roadSmoothness;


            if (

                Math.abs(
                    this.smoothWheelSpeed
                ) < 0.002 &&

                !keys["ArrowRight"] &&

                !keys["ArrowLeft"]

            ) {

                this.smoothWheelSpeed = 0;

            }


            // =================================
            // REAR WHEEL
            // =================================

            Body.setAngularVelocity(

                wheel1,

                this.smoothWheelSpeed

            );


            // =================================
            // FRONT WHEEL
            // =================================

            Body.setAngularVelocity(

                wheel2,

                this.smoothWheelSpeed *
                0.96

            );

        }

        else {

            this.smoothWheelSpeed *=

                0.992;


            Body.setAngularVelocity(

                wheel1,

                wheel1.angularVelocity *

                0.995

            );


            Body.setAngularVelocity(

                wheel2,

                wheel2.angularVelocity *

                0.995

            );

        }

    },


    // =====================================
    // RESET IDLE LOCK
    // =====================================

    resetIdleLock() {

        this.idleFrames = 0;

        this.idlePose = null;

    },


    // =====================================
    // TERRAIN GRIP
    // =====================================

    applyTerrainGrip() {

        if (!this.grounded) {

            return;

        }


        if (

            !keys["ArrowRight"] &&

            !keys["ArrowLeft"] &&

            Math.abs(
                car.velocity.x
            ) < 0.35

        ) {

            return;

        }


        const carGrip =

            this.getCarGrip();


        const finalGrip =

            this.mapGrip *

            carGrip;


        // =================================
        // LOW GRIP
        // =================================

        if (
            finalGrip < 0.8
        ) {

            const slideResistance =

                0.997 +

                finalGrip *

                0.002;


            Body.setVelocity(

                car,

                {

                    x:

                        car.velocity.x *

                        slideResistance,

                    y:

                        car.velocity.y

                }

            );

        }


        // =================================
        // HIGH GRIP
        // =================================

        if (
            finalGrip > 1
        ) {

            const stability =

                Math.min(

                    0.0025,

                    (

                        finalGrip -

                        1

                    ) *

                    0.002

                );


            Body.setVelocity(

                car,

                {

                    x:

                        car.velocity.x *

                        (
                            1 -
                            stability
                        ),

                    y:

                        car.velocity.y

                }

            );

        }


        // =================================
        // DESERT
        // =================================

        if (
            this.getMap() === 1
        ) {

            Body.setVelocity(

                car,

                {

                    x:

                        car.velocity.x *

                        (

                            0.998 +

                            finalGrip *

                            0.001

                        ),

                    y:

                        car.velocity.y

                }

            );

        }


        // =================================
        // NIGHT HILL
        // =================================

        if (
            this.getMap() === 2
        ) {

            const terrainAngle =

                this.getTerrainAngle(

                    car.position.x

                );


            const climbing =

                terrainAngle < -0.15 &&

                car.velocity.x > 0;


            if (climbing) {

                const climbResistance =

                    0.991 +

                    Math.min(

                        0.005,

                        carGrip *

                        0.0025

                    );


                Body.setVelocity(

                    car,

                    {

                        x:

                            car.velocity.x *

                            climbResistance,

                        y:

                            car.velocity.y

                    }

                );

            }

        }

    },


    // =====================================
    // ROAD SMOOTHING
    // SUSPENSION PHYSICS
    // =====================================

    applyRoadSmoothing() {

        if (

            !this.rearGrounded ||

            !this.frontGrounded

        ) {

            return;

        }


        const speed =

            Math.abs(
                car.velocity.x
            );


        if (
            speed < 0.4
        ) {

            return;

        }


        const suspensionLevel =

            this.getSuspensionLevel();


        const terrainAngle =

            this.getTerrainAngle(

                car.position.x

            );


        const angleDifference =

            terrainAngle -

            car.angle;


        // =================================
        // BODY ROAD ALIGNMENT
        // =================================

        const alignmentStrength =

            0.003 +

            suspensionLevel *
            0.0007;


        if (

            Math.abs(
                angleDifference
            ) < 0.5

        ) {

            Body.setAngularVelocity(

                car,

                car.angularVelocity +

                angleDifference *

                alignmentStrength

            );

        }


        // =================================
        // BODY BOUNCE ABSORBER
        // =================================

        const bodyDamping =

            Math.max(

                0.68,

                0.91 -

                suspensionLevel *
                0.045

            );


        if (

            Math.abs(
                car.velocity.y
            ) <

            2.2 +

            suspensionLevel *
            0.35

        ) {

            Body.setVelocity(

                car,

                {

                    x:
                        car.velocity.x,

                    y:

                        car.velocity.y *

                        bodyDamping

                }

            );

        }


        // =================================
        // WHEEL BOUNCE ABSORBER
        // =================================

        const wheelDamping =

            Math.max(

                0.7,

                0.93 -

                suspensionLevel *
                0.04

            );


        const wheelBounceLimit =

            1.8 +

            suspensionLevel *
            0.45;


        if (

            Math.abs(
                wheel1.velocity.y
            ) < wheelBounceLimit

        ) {

            Body.setVelocity(

                wheel1,

                {

                    x:
                        wheel1.velocity.x,

                    y:

                        wheel1.velocity.y *

                        wheelDamping

                }

            );

        }


        if (

            Math.abs(
                wheel2.velocity.y
            ) < wheelBounceLimit

        ) {

            Body.setVelocity(

                wheel2,

                {

                    x:
                        wheel2.velocity.x,

                    y:

                        wheel2.velocity.y *

                        wheelDamping

                }

            );

        }


        // =================================
        // HIGH LEVEL BODY STABILITY
        // =================================

        if (
            suspensionLevel >= 3
        ) {

            const rotationDamping =

                0.995 -

                (
                    suspensionLevel - 2
                ) *
                0.008;


            Body.setAngularVelocity(

                car,

                car.angularVelocity *

                rotationDamping

            );

        }

    },


    // =====================================
    // AIR CONTROL
    // =====================================

    updateAirControl() {

        if (this.grounded) {

            return;

        }


        this.resetIdleLock();


        const carAirControl =

            this.getCarAirControl();


        const rotationForce =

            this.airRotationForce *

            this.mapAirControl *

            carAirControl;


        if (
            keys["ArrowRight"]
        ) {

            Body.setAngularVelocity(

                car,

                car.angularVelocity +

                rotationForce

            );

        }


        if (
            keys["ArrowLeft"]
        ) {

            Body.setAngularVelocity(

                car,

                car.angularVelocity -

                rotationForce

            );

        }

    },


    // =====================================
    // DOWN FORCE
    // =====================================

    applyDownForce() {

        if (!this.grounded) {

            return;

        }


        if (

            !keys["ArrowRight"] &&

            !keys["ArrowLeft"] &&

            Math.abs(
                car.velocity.x
            ) < 0.35

        ) {

            return;

        }


        const speed =

            Math.abs(
                car.velocity.x
            );


        const carGrip =

            this.getCarGrip();


        const force =

            speed *

            this.downForce *

            this.mapDownForce *

            Math.max(

                0.75,

                carGrip

            );


        Body.applyForce(

            car,

            car.position,

            {

                x: 0,

                y: force

            }

        );

    },


    // =====================================
    // LANDING STABILIZER
    // =====================================

    stabilizeLanding() {

        if (!this.grounded) {

            return;

        }


        if (

            !keys["ArrowRight"] &&

            !keys["ArrowLeft"] &&

            Math.abs(
                car.velocity.x
            ) < 0.5

        ) {

            return;

        }


        if (

            this.rearGrounded &&

            this.frontGrounded

        ) {

            const terrainAngle =

                this.getTerrainAngle(

                    car.position.x

                );


            const difference =

                terrainAngle -

                car.angle;


            const suspensionLevel =

                this.getSuspensionLevel();


            let stabilizer =

                0.009 +

                suspensionLevel *
                0.0012;


            if (
                this.getMap() === 1
            ) {

                stabilizer =

                    0.007;

            }


            if (
                this.getMap() === 2
            ) {

                stabilizer =

                    0.006;

            }


            stabilizer *=

                this.getCarGrip();


            const correction =

                difference *

                stabilizer;


            Body.setAngularVelocity(

                car,

                car.angularVelocity +

                correction

            );

            // =================================
            // LANDING SHOCK ABSORBER
            // =================================

            if (
                suspensionLevel > 0 &&
                car.velocity.y > 0
            ) {

                const landingDamping =

                    Math.max(

                        0.58,

                        0.9 -

                        suspensionLevel *
                        0.055

                    );


                Body.setVelocity(

                    car,

                    {

                        x:
                            car.velocity.x,

                        y:

                            car.velocity.y *

                            landingDamping

                    }

                );

            }

        }

    },


    // =====================================
    // TERRAIN ANGLE
    // =====================================

    getTerrainAngle(x) {

        const distance = 28;


        const y1 =

            getTerrainY(

                x -
                distance

            );


        const y2 =

            getTerrainY(

                x +
                distance

            );


        return Math.atan2(

            y2 - y1,

            distance * 2

        );

    },


    // =====================================
    // IDLE STABILIZER
    // =====================================

    applyIdleStabilizer() {

        const driving =

            keys["ArrowRight"] ||

            keys["ArrowLeft"];


        if (driving) {

            this.resetIdleLock();

            return;

        }


        if (

            !this.rearGrounded ||

            !this.frontGrounded

        ) {

            this.resetIdleLock();

            return;

        }


        const motion =

            Math.abs(
                car.velocity.x
            ) +

            Math.abs(
                car.velocity.y
            ) +

            Math.abs(
                car.angularVelocity
            ) * 10 +

            Math.abs(
                wheel1.angularVelocity
            ) +

            Math.abs(
                wheel2.angularVelocity
            );


        if (
            motion > 0.55
        ) {

            this.resetIdleLock();

            return;

        }


        this.idleFrames++;


        // =================================
        // WAIT SUSPENSION
        // =================================

        if (
            this.idleFrames < 12
        ) {

            this.wheelSpeed *=

                0.7;


            this.smoothWheelSpeed *=

                0.65;


            return;

        }


        // =================================
        // SAVE POSITION
        // =================================

        if (!this.idlePose) {

            this.idlePose = {

                carX:
                    car.position.x,

                carY:
                    car.position.y,

                carAngle:
                    car.angle,


                wheel1X:
                    wheel1.position.x,

                wheel1Y:
                    wheel1.position.y,

                wheel1Angle:
                    wheel1.angle,


                wheel2X:
                    wheel2.position.x,

                wheel2Y:
                    wheel2.position.y,

                wheel2Angle:
                    wheel2.angle

            };

        }


        this.wheelSpeed = 0;

        this.smoothWheelSpeed = 0;


        // =================================
        // LOCK CAR
        // =================================

        Body.setPosition(

            car,

            {

                x:
                    this.idlePose.carX,

                y:
                    this.idlePose.carY

            }

        );


        Body.setAngle(

            car,

            this.idlePose.carAngle

        );


        // =================================
        // LOCK REAR WHEEL
        // =================================

        Body.setPosition(

            wheel1,

            {

                x:
                    this.idlePose.wheel1X,

                y:
                    this.idlePose.wheel1Y

            }

        );


        Body.setAngle(

            wheel1,

            this.idlePose.wheel1Angle

        );


        // =================================
        // LOCK FRONT WHEEL
        // =================================

        Body.setPosition(

            wheel2,

            {

                x:
                    this.idlePose.wheel2X,

                y:
                    this.idlePose.wheel2Y

            }

        );


        Body.setAngle(

            wheel2,

            this.idlePose.wheel2Angle

        );


        // =================================
        // ZERO VELOCITY
        // =================================

        Body.setVelocity(

            car,

            {
                x: 0,
                y: 0
            }

        );


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

    },


    // =====================================
    // SPEED LIMIT
    // =====================================

    limitCarSpeed() {

        let maxVelocity = 18;


        const map =

            this.getMap();


        const carMaxSpeed =

            this.getCarMaxSpeed();


        if (
            map === 1
        ) {

            maxVelocity = 15;

        }


        if (
            map === 2
        ) {

            maxVelocity = 14;

        }


        maxVelocity *=

            carMaxSpeed;


        // =================================
        // FORWARD LIMIT
        // =================================

        if (

            car.velocity.x >

            maxVelocity

        ) {

            Body.setVelocity(

                car,

                {

                    x:
                        maxVelocity,

                    y:
                        car.velocity.y

                }

            );

        }


        // =================================
        // REVERSE LIMIT
        // =================================

        if (

            car.velocity.x <

            -maxVelocity

        ) {

            Body.setVelocity(

                car,

                {

                    x:
                        -maxVelocity,

                    y:
                        car.velocity.y

                }

            );

        }


        // =================================
        // ANGULAR LIMIT
        // =================================

        let maxAngularVelocity =

            0.18;


        if (
            map === 2
        ) {

            maxAngularVelocity =

                0.16;

        }


        maxAngularVelocity *=

            Math.max(

                0.75,

                this.getCarAirControl()

            );


        if (

            car.angularVelocity >

            maxAngularVelocity

        ) {

            Body.setAngularVelocity(

                car,

                maxAngularVelocity

            );

        }


        if (

            car.angularVelocity <

            -maxAngularVelocity

        ) {

            Body.setAngularVelocity(

                car,

                -maxAngularVelocity

            );

        }

    }

};

// =========================================
// CYCLE PHYSICS
// =========================================

const originalCycleEngineUpdate =
    Physics.updateEngine.bind(
        Physics
    );


Physics.updateEngine = function () {

    originalCycleEngineUpdate();


    if (
        typeof CAR === "undefined" ||
        CAR.type !== "cycle"
    ) {

        return;

    }


    // HUMAN PEDAL POWER

    Physics.wheelSpeed *=
        0.992;


    // UPHILL SLOWDOWN

    if (
        Physics.grounded
    ) {

        const terrainAngle =

            Physics.getTerrainAngle(
                car.position.x
            );


        if (
            terrainAngle < -0.12 &&
            car.velocity.x > 0
        ) {

            Body.setVelocity(

                car,

                {

                    x:
                        car.velocity.x *
                        0.992,

                    y:
                        car.velocity.y

                }

            );

        }

    }

};