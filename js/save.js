// =========================================
// HILL RIDER SAVE SYSTEM
// save.js
// =========================================

const Save = {

    key: "hill_rider_save_v1",

    data: {

        coins: 0,

        bestDistance: 0

    },

    // =====================================
    // CREATE
    // =====================================

    create() {

        this.load();

    },

    // =====================================
    // LOAD SAVE
    // =====================================

    load() {

        const savedData =
            localStorage.getItem(
                this.key
            );

        if (!savedData) {

            this.save();

            return;

        }

        try {

            const parsed =
                JSON.parse(savedData);

            this.data.coins =
                Number(
                    parsed.coins
                ) || 0;

            this.data.bestDistance =
                Number(
                    parsed.bestDistance
                ) || 0;

        } catch (error) {

            console.error(
                "Save Load Error:",
                error
            );

            this.reset();

        }

    },

    // =====================================
    // SAVE DATA
    // =====================================

    save() {

        try {

            localStorage.setItem(

                this.key,

                JSON.stringify(
                    this.data
                )

            );

        } catch (error) {

            console.error(
                "Save Error:",
                error
            );

        }

    },

    // =====================================
    // UPDATE COINS
    // =====================================

    updateCoins(coins) {

        const newCoins =
            Math.max(
                0,
                Math.floor(coins)
            );

        if (
            this.data.coins ===
            newCoins
        ) {

            return;

        }

        this.data.coins =
            newCoins;

        this.save();

    },

    // =====================================
    // ADD COINS
    // =====================================

    addCoins(amount) {

        this.data.coins +=
            Math.max(
                0,
                Math.floor(amount)
            );

        this.save();

    },

    // =====================================
    // SPEND COINS
    // =====================================

    spendCoins(amount) {

        amount =
            Math.max(
                0,
                Math.floor(amount)
            );

        if (
            this.data.coins <
            amount
        ) {

            return false;

        }

        this.data.coins -=
            amount;

        this.save();

        return true;

    },

    // =====================================
    // UPDATE BEST DISTANCE
    // =====================================

    updateBestDistance(
        currentDistance
    ) {

        currentDistance =
            Math.max(
                0,
                Math.floor(
                    currentDistance
                )
            );

        if (
            currentDistance <=
            this.data.bestDistance
        ) {

            return;

        }

        this.data.bestDistance =
            currentDistance;

        this.save();

    },

    // =====================================
    // GET COINS
    // =====================================

    getCoins() {

        return this.data.coins;

    },

    // =====================================
    // GET BEST DISTANCE
    // =====================================

    getBestDistance() {

        return this.data.bestDistance;

    },

    // =====================================
    // RESET SAVE
    // =====================================

    reset() {

        this.data = {

            coins: 0,

            bestDistance: 0

        };

        this.save();

    }

};