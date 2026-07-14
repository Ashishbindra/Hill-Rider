// =========================================
// HILL RIDER TERRAIN SYSTEM
// terrain.js
// =========================================

let terrainBodies = [];

let terrainPoints = [];

let terrainStartX = -1000;

let terrainEndX = 0;

let terrainSegmentWidth = 80;

let terrainGenerateDistance = 5000;

let terrainRemoveDistance = 1800;


// =========================================
// CREATE TERRAIN
// =========================================

function createTerrain() {

    clearTerrain();

    terrainPoints = [];

    terrainStartX = -1000;

    terrainEndX = terrainStartX;

    generateTerrainUntil(
        terrainGenerateDistance
    );

}


// =========================================
// CLEAR TERRAIN
// =========================================

function clearTerrain() {

    for (const body of terrainBodies) {

        Composite.remove(
            world,
            body
        );

    }

    terrainBodies = [];

}


// =========================================
// GET MAP INDEX
// =========================================

function getCurrentMapIndex() {

    if (
        typeof Menu === "undefined"
    ) {

        return 0;

    }

    return Menu.selectedMap || 0;

}


// =========================================
// GENERATE TERRAIN
// =========================================

function generateTerrainUntil(targetX) {

    while (
        terrainEndX <
        targetX
    ) {

        const x1 =
            terrainEndX;

        const x2 =
            x1 +
            terrainSegmentWidth;

        const y1 =
            getTerrainHeight(x1);

        const y2 =
            getTerrainHeight(x2);

        terrainPoints.push({

            x: x1,

            y: y1

        });

        createTerrainSegment(

            x1,

            y1,

            x2,

            y2

        );

        terrainEndX = x2;

    }

}


// =========================================
// CREATE TERRAIN SEGMENT
// =========================================

function createTerrainSegment(
    x1,
    y1,
    x2,
    y2
) {

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;

    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const angle =
        Math.atan2(
            dy,
            dx
        );

    const centerX =
        (
            x1 + x2
        ) / 2;

    const centerY =
        (
            y1 + y2
        ) / 2 + 100;

    const body =
        Bodies.rectangle(

            centerX,

            centerY,

            length + 4,

            200,

            {

                isStatic: true,

                angle: angle,

                friction: 1.2,

                restitution: 0

            }

        );

    terrainBodies.push(body);

    Composite.add(
        world,
        body
    );

}


// =========================================
// TERRAIN HEIGHT
// =========================================

function getTerrainHeight(x) {

    const map =
        getCurrentMapIndex();


    // =====================================
    // STARTING SAFE AREA
    // =====================================

    if (
        x >= -1000 &&
        x <= 650
    ) {

        return (
            canvas.height -
            115
        );

    }


    // =====================================
    // GREEN HILLS
    // =====================================

    if (map === 0) {

        return getGreenHillHeight(x);

    }


    // =====================================
    // DESERT
    // =====================================

    if (map === 1) {

        return getDesertHeight(x);

    }


    // =====================================
    // NIGHT HILLS
    // =====================================

    return getNightHillHeight(x);

}


// =========================================
// GREEN HILLS
// =========================================

function getGreenHillHeight(x) {

    const base =
        canvas.height -
        170;

    const hill1 =
        Math.sin(
            x * 0.0028
        ) * 85;

    const hill2 =
        Math.sin(
            x * 0.0065
        ) * 42;

    const hill3 =
        Math.sin(
            x * 0.014
        ) * 12;

    return (
        base -
        hill1 -
        hill2 -
        hill3
    );

}


// =========================================
// DESERT
// =========================================

function getDesertHeight(x) {

    const base =
        canvas.height -
        150;

    const dune1 =
        Math.sin(
            x * 0.0018
        ) * 105;

    const dune2 =
        Math.sin(
            x * 0.0042 + 1.8
        ) * 48;

    const dune3 =
        Math.sin(
            x * 0.009
        ) * 18;

    return (
        base -
        dune1 -
        dune2 -
        dune3
    );

}


// =========================================
// NIGHT HILLS
// =========================================

function getNightHillHeight(x) {

    const base =
        canvas.height -
        185;

    const hill1 =
        Math.sin(
            x * 0.0035
        ) * 110;

    const hill2 =
        Math.sin(
            x * 0.008
        ) * 58;

    const hill3 =
        Math.sin(
            x * 0.017
        ) * 20;

    return (
        base -
        hill1 -
        hill2 -
        hill3
    );

}


// =========================================
// GET TERRAIN Y
// =========================================

function getTerrainY(x) {

    return getTerrainHeight(x);

}


// =========================================
// UPDATE TERRAIN
// =========================================

function updateTerrain() {

    const targetX =
        car.position.x +
        terrainGenerateDistance;

    generateTerrainUntil(
        targetX
    );

    cleanupTerrain();

}


// =========================================
// CLEANUP
// =========================================

function cleanupTerrain() {

    const removeX =
        car.position.x -
        terrainRemoveDistance;

    while (
        terrainBodies.length > 0 &&
        terrainBodies[0].position.x <
        removeX
    ) {

        const body =
            terrainBodies.shift();

        Composite.remove(
            world,
            body
        );

    }

    terrainPoints =
        terrainPoints.filter(
            point =>
                point.x >
                removeX -
                terrainSegmentWidth
        );

}


// =========================================
// REBUILD TERRAIN
// =========================================

function rebuildTerrain() {

    clearTerrain();

    terrainPoints = [];

    terrainStartX = -1000;

    terrainEndX =
        terrainStartX;

    generateTerrainUntil(
        terrainGenerateDistance
    );

}


// =========================================
// DRAW TERRAIN
// =========================================

function drawTerrain() {

    const map =
        getCurrentMapIndex();

    if (
        terrainPoints.length <
        2
    ) {

        return;

    }


    // =====================================
    // GROUND BODY
    // =====================================

    if (map === 0) {

        ctx.fillStyle =
            "#795548";

    } else if (map === 1) {

        ctx.fillStyle =
            "#c58b3c";

    } else {

        ctx.fillStyle =
            "#182a46";

    }


    ctx.beginPath();

    ctx.moveTo(

        terrainPoints[0].x,

        canvas.height + 400

    );


    for (
        const point of
        terrainPoints
    ) {

        ctx.lineTo(
            point.x,
            point.y
        );

    }


    ctx.lineTo(

        terrainPoints[
            terrainPoints.length - 1
        ].x,

        canvas.height + 400

    );


    ctx.closePath();

    ctx.fill();


    // =====================================
    // TERRAIN TOP
    // =====================================

    ctx.beginPath();


    for (
        let i = 0;
        i <
        terrainPoints.length;
        i++
    ) {

        const point =
            terrainPoints[i];

        if (i === 0) {

            ctx.moveTo(
                point.x,
                point.y
            );

        } else {

            ctx.lineTo(
                point.x,
                point.y
            );

        }

    }


    if (map === 0) {

        ctx.strokeStyle =
            "#43a047";

        ctx.lineWidth = 15;

    } else if (map === 1) {

        ctx.strokeStyle =
            "#f4c56a";

        ctx.lineWidth = 18;

    } else {

        ctx.strokeStyle =
            "#455f85";

        ctx.lineWidth = 15;

    }


    ctx.lineJoin = "round";

    ctx.lineCap = "round";

    ctx.stroke();


    // =====================================
    // SECOND TERRAIN LINE
    // =====================================

    if (map === 0) {

        ctx.strokeStyle =
            "#8bc34a";

    } else if (map === 1) {

        ctx.strokeStyle =
            "#ffe082";

    } else {

        ctx.strokeStyle =
            "#607d9f";

    }


    ctx.lineWidth = 5;

    ctx.stroke();

}