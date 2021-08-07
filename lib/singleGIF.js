const W = 500, H = 500;
const { createCanvas } = require('canvas');
const GifEncoder = require('gifencoder');
const fs = require('fs');

class SingleGIF {
    constructor() {
        this.initCanvas();
        this.initGifEncoder();
    }

    initCanvas() {
        this.canvas = new createCanvas(W, H);
        this.context = this.canvas.getContext("2d");
    }

    initGifEncoder() {
        this.gifEncoder = new GifEncoder(W, H);
        this.gifEncoder.setQuality(100);
        this.gifEncoder.setRepeat(0);
        this.gifEncoder.setDelay(200);
    }

    drawBackgroundColor(color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, W, H);
        this.gifEncoder.addFrame(this.context);
    }

    create(amp, freq, fileName) {
        this.gifEncoder.createReadStream().pipe(fs.createWriteStream(fileName));
        this.gifEncoder.start();

        this.drawBackgroundColor('red');
        this.drawBackgroundColor('green');
        this.drawBackgroundColor('blue');
        this.drawBackgroundColor('teal');
        this.drawBackgroundColor('purple');

        this.gifEncoder.finish();
    }
}

const createSingleGIF = (amp, freq, fileName) => {
    const singleGIF = new SingleGIF();
    if (amp < H) {
        singleGIF.create(amp, freq, fileName);
    } else {
        console.log(`amplitude must be less than ${H}`);
    }
}

module.exports = createSingleGIF;