// =========================================
// HILL RIDER GAME SYSTEM
// game.js
// =========================================

Save.create();

createTerrain();

createCar(
    300,
    100
);

Fuel.create();

Coin.create();

Garage.create();

Sound.create();

Menu.create();

Background.create();

Particles.create();

Checkpoint.create();

Pause.create();

MobileControls.create();

MobileUI.create();

CarSelect.create();

// =========================================
// GAME STATE
// =========================================

let distance = 0;

let gameOver = false;

let crashTimer = 0;

let fuelEmptyTimer = 0;

let gameOverReason = "";


let restartButton = {

    x: 0,

    y: 0,

    width: 220,

    height: 60

};


// =========================================
// UPDATE
// =========================================

function update() {

    // =====================================
    // MAIN MENU
    // =====================================

    if (Menu.open) {

        Menu.update();

        Engine.update(
            engine,
            1000 / 60
        );

        return;

    }


    // =====================================
    // PAUSE
    // =====================================

    if (Pause.open) {

        Pause.update();

        return;

    }


    // =====================================
    // GAME OVER
    // =====================================

    if (gameOver) {

        Engine.update(
            engine,
            1000 / 60
        );

        return;

    }


    // =====================================
    // GARAGE
    // =====================================

    Garage.update();

    // =====================================
    // MOBILE CONTROLS
    MobileControls.update();

    // =====================================
    // MOBILE UI
    // =====================================

    MobileUI.update();

    if (!Garage.open) {

        Physics.update();

    }


    // =====================================
    // MATTER ENGINE
    // =====================================

    Engine.update(
        engine,
        1000 / 60
    );


    // =====================================
    // CAMERA
    // =====================================

    camera.update();


    // =====================================
    // BACKGROUND
    // =====================================

    Background.update();


    // =====================================
    // TERRAIN
    // =====================================

    updateTerrain();


    // =====================================
    // FUEL
    // =====================================

    Fuel.update();


    // =====================================
    // COINS
    // =====================================

    Coin.update();


    // =====================================
    // SOUND
    // =====================================

    Sound.update();


    // =====================================
    // PARTICLES
    // =====================================

    Particles.update();


    // =====================================
    // DISTANCE
    // =====================================

    distance = Math.max(

        0,

        Math.floor(
            car.position.x / 10
        )

    );


    Save.updateBestDistance(
        distance
    );


    // =====================================
    // CHECKPOINT
    // =====================================

    Checkpoint.update();


    // =====================================
    // GAME OVER CHECK
    // =====================================

    checkCrash();

    checkFuelGameOver();

    checkFallGameOver();

}


// =========================================
// CRASH DETECTION
// =========================================

function checkCrash() {

    const angle =

        Math.abs(

            normalizeAngle(
                car.angle
            )

        );


    const upsideDown =

        angle >

        Math.PI * 0.62;


    if (upsideDown) {

        crashTimer +=

            1000 / 60;

    }

    else {

        crashTimer = 0;

    }


    if (

        crashTimer >

        1800

    ) {

        endGame(
            "CRASHED"
        );

    }

}


// =========================================
// FUEL GAME OVER
// =========================================

function checkFuelGameOver() {

    if (Fuel.empty) {

        fuelEmptyTimer +=

            1000 / 60;

    }

    else {

        fuelEmptyTimer = 0;

    }


    if (

        fuelEmptyTimer >

        3000

    ) {

        endGame(
            "OUT OF FUEL"
        );

    }

}


// =========================================
// FALL / KHAYI GAME OVER
// =========================================

function checkFallGameOver() {

    if (gameOver) {

        return;

    }


    const terrainY =

        getTerrainY(
            car.position.x
        );


    const fallDistance =

        car.position.y -

        terrainY;


    // =====================================
    // TERRAIN SE NICHE
    // =====================================

    if (

        fallDistance >

        120

    ) {

        endGame(
            "FELL INTO THE ABYSS"
        );

        return;

    }


    // =====================================
    // SCREEN SE NICHE
    // =====================================

    if (

        car.position.y >

        canvas.height + 100

    ) {

        endGame(
            "FELL INTO THE ABYSS"
        );

    }

}


// =========================================
// NORMALIZE ANGLE
// =========================================

function normalizeAngle(angle) {

    while (

        angle >

        Math.PI

    ) {

        angle -=

            Math.PI * 2;

    }


    while (

        angle <

        -Math.PI

    ) {

        angle +=

            Math.PI * 2;

    }


    return angle;

}


// =========================================
// END GAME
// =========================================

function endGame(reason) {

    if (gameOver) {

        return;

    }


    gameOver = true;


    gameOverReason = reason;


    // =====================================
    // STOP CAR
    // =====================================

    Physics.wheelSpeed = 0;


    keys.ArrowLeft = false;

    keys.ArrowRight = false;


    // =====================================
    // STOP SOUND
    // =====================================

    Sound.stop();


    // =====================================
    // SAVE BEST
    // =====================================

    Save.updateBestDistance(
        distance
    );

}


// =========================================
// DRAW
// =========================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =====================================
    // BACKGROUND
    // =====================================

    Background.draw();


    // =====================================
    // WORLD
    // =====================================

    ctx.save();


    ctx.translate(
        -camera.x,
        0
    );


    drawTerrain();


    Fuel.drawPickups();


    Coin.draw();


    Particles.draw();


    drawCar();


    ctx.restore();


    // =====================================
    // DISTANCE
    // =====================================

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 25px Arial";


    ctx.textAlign =
        "left";


    ctx.textBaseline =
        "alphabetic";


    ctx.fillText(

        "Distance : " +

        distance +

        " m",

        20,

        36

    );


    // =====================================
    // BEST DISTANCE
    // =====================================

    ctx.font =
        "bold 17px Arial";


    ctx.fillText(

        "BEST : " +

        Save.getBestDistance() +

        " m",

        20,

        125

    );


    // =====================================
    // HUD
    // =====================================

    Fuel.drawHUD();


    Coin.drawHUD();


    Sound.drawHUD();

    // =====================================
    // MOBILE CONTROLS
    // =====================================

    MobileControls.draw();

    // =====================================
    // MOBILE UI
    // =====================================

    MobileUI.draw();

    // =====================================
    // CHECKPOINT
    // =====================================

    Checkpoint.draw();


    // =====================================
    // GARAGE
    // =====================================

    Garage.draw();


    // =====================================
    // PAUSE
    // =====================================

    Pause.draw();


    // =====================================
    // GAME OVER
    // =====================================

    if (gameOver) {

        drawGameOver();

    }


    // =====================================
    // MAIN MENU
    // =====================================

    if (Menu.open) {

        Menu.draw();

    }

}


// =========================================
// DRAW GAME OVER
// =========================================

function drawGameOver() {

    ctx.fillStyle =

        "rgba(0,0,0,0.75)";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    ctx.textAlign =
        "center";


    ctx.fillStyle =
        "#ff3b30";


    ctx.font =
        "bold 52px Arial";


    ctx.fillText(

        "GAME OVER",

        canvas.width / 2,

        canvas.height / 2 - 120

    );


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 25px Arial";


    ctx.fillText(

        gameOverReason,

        canvas.width / 2,

        canvas.height / 2 - 70

    );


    ctx.font =
        "22px Arial";


    ctx.fillText(

        "DISTANCE : " +

        distance +

        " m",

        canvas.width / 2,

        canvas.height / 2 - 20

    );


    ctx.fillText(

        "BEST : " +

        Save.getBestDistance() +

        " m",

        canvas.width / 2,

        canvas.height / 2 + 20

    );


    // =====================================
    // RESTART BUTTON
    // =====================================

    restartButton.x =

        canvas.width / 2 -

        restartButton.width / 2;


    restartButton.y =

        canvas.height / 2 + 65;


    ctx.fillStyle =
        "#4CAF50";


    ctx.fillRect(

        restartButton.x,

        restartButton.y,

        restartButton.width,

        restartButton.height

    );


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 23px Arial";


    ctx.fillText(

        "RESTART",

        canvas.width / 2,

        restartButton.y + 39

    );

}


// =========================================
// RESTART CLICK
// =========================================

canvas.addEventListener(

    "click",

    event => {

        if (!gameOver) {

            return;

        }


        const x =
            event.clientX;


        const y =
            event.clientY;


        if (

            x >= restartButton.x &&

            x <=

            restartButton.x +

            restartButton.width &&


            y >= restartButton.y &&

            y <=

            restartButton.y +

            restartButton.height

        ) {

            restartGame();

        }

    }

);


// =========================================
// RESTART GAME
// =========================================

function restartGame() {

    gameOver = false;


    gameOverReason = "";


    crashTimer = 0;


    fuelEmptyTimer = 0;


    distance = 0;


    Physics.wheelSpeed = 0;


    // =====================================
    // RESET CONTROLS
    // =====================================

    keys.ArrowLeft = false;

    keys.ArrowRight = false;


    // =====================================
    // REMOVE OLD CAR
    // =====================================

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


    // =====================================
    // REBUILD TERRAIN
    // =====================================

    rebuildTerrain();


    // =====================================
    // CREATE NEW CAR
    // =====================================

    createCar(

        300,

        getTerrainY(300) - 70

    );


    // =====================================
    // RESET CAR
    // =====================================

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


    // =====================================
    // RESET WHEELS
    // =====================================

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


    // =====================================
    // RESET CAMERA
    // =====================================

    camera.x = 0;

    camera.y = 0;


    // =====================================
    // RESET SYSTEMS
    // =====================================

    Fuel.create();


    Coin.create();


    Particles.create();


    Checkpoint.reset();


    Pause.reset();

    MobileControls.reset();

    MobileUI.reset();


    // =====================================
    // GARAGE UPGRADES
    // =====================================

    Garage.applyUpgrades();


    // =====================================
    // START SOUND
    // =====================================

    Sound.start();

}


// =========================================
// GAME LOOP
// =========================================

function gameLoop() {

    update();


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


gameLoop();