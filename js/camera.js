const camera = {

    x: 0,
    y: 0,

    smooth: 0.08,

    update() {

        if (!car) return;

        const targetX = car.position.x - canvas.width * 0.35;

        this.x += (targetX - this.x) * this.smooth;

        if (this.x < 0)
            this.x = 0;

    }

};