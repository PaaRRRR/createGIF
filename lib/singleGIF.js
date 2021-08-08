const W = 500, H = 500;
const { createCanvas } = require('canvas');
const GifEncoder = require('gifencoder');
const fs = require('fs');

const DELAY = 1000;

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
        this.gifEncoder.setDelay(DELAY);
    }

    drawBackgroundColor(color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, W, H);
        this.gifEncoder.addFrame(this.context);
    }

    fillText(text, color = "white") {
        this.context.clearRect(0, 0, W, H);

        this.context.font = "50px serif";
        this.context.fillStyle = color;
        this.context.fillText(text, 50, 100);
        this.gifEncoder.addFrame(this.context);
    }

    create(fileName) {
        this.gifEncoder.createReadStream().pipe(fs.createWriteStream(fileName));
        this.gifEncoder.start();

        this.drawBackgroundColor('red');
        this.drawBackgroundColor('green');
        this.drawBackgroundColor('blue');
        this.drawBackgroundColor('teal');
        this.drawBackgroundColor('purple');

        // this.fillText('red');
        // this.fillText('green');
        // this.fillText('blue');
        // this.fillText('teal');
        // this.fillText('purple');

        this.gifEncoder.finish();
    }
}

const createSingleGIF = (fileName) => {
    const singleGIF = new SingleGIF();
    singleGIF.create(fileName);
}

module.exports = createSingleGIF;