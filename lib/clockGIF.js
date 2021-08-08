const { createCanvas } = require('canvas');
const GifEncoder = require('gifencoder');
const fs = require('fs');


const W = 500, H = 500
const DELAY = 1000; // ms
const COUNT = 5; // s: how much seconds to display

const drawColoredBackground = (context, color) => {
    context.fillStyle = color
    context.fillRect(0, 0, W, H);
}

class ClockGIF {
    constructor() {
        this.initCanvas();
        this.initGifEncoder();
    }

    initCanvas() {
        this.canvas = new createCanvas(W, H);
        this.context = this.canvas.getContext('2d');
    }

    initGifEncoder() {
        this.gifEncoder = new GifEncoder(W, H);
        this.gifEncoder.setQuality(100);
        this.gifEncoder.setRepeat(0);
        this.gifEncoder.setDelay(DELAY);
    }

    create(endDateTime, fileName) {
        this.gifEncoder.createReadStream().pipe(fs.createWriteStream(fileName));
        this.renderer = new Renderer(endDateTime);
        this.gifEncoder.start();
        this.renderer.render(this.context, (context) => {
            this.gifEncoder.addFrame(context)
        }, () => {
            this.gifEncoder.finish()
        })
    }
}

class Clock {
    constructor() {}

    draw(context, dateTime) {
    //     // 1 frequency will have positive and negative wave cycle.
    //    const side = (W) / (2 * this.n)
    //    context.strokeStyle = 'teal'
    //    context.lineWidth = side/12
    //    context.lineCap = 'round'
    //    // 2nd and 3rd vertex will move the same distance in opposite direction
    //    context.save()
    //    context.translate(0, H/2)
    //    for (var i = 0; i < 2 * this.n; i++) {
    //         // x = 0, 1 , y = 1 - 2  * x
    //         const y = this.a * (1 - 2 * (i%2))
    //         const x = this.state.scale * (side/2)
    //         context.beginPath()
    //         context.moveTo(side * i, 0)
    //         context.lineTo(side * i + side/2 - x, y)
    //         context.lineTo(side * i + side/2 + x, y)
    //         context.lineTo(side * i + side, 0)
    //         context.stroke()
    //    }
    //    context.restore()

        context.font = "50px serif";
        context.fillStyle = "white";
        const curTime = new Date(dateTime).toTimeString();
        context.fillText(curTime, 50, 100);

        console.log("hello", curTime);
    }
}

class Renderer {
    constructor(endDateTime) {
        this.clock = new Clock();

        this.count = COUNT;

        this.curDateTime = 0;
        this.endDateTime = endDateTime || 0;
        this.remainDateTime = 0;

        this.init();
    }

    init() {
        this.curDateTime = new Date().getTime();
        this.remainDateTime = this.endDateTime - this.curDateTime;

        if (this.remainDateTime < this.count * 1000) {
            this.remainDateTime = 0;
        }
    }

    // updatecb is addingFrame to context, endcb is ending the gifencoder
    render(context, updatecb, endcb) {
        if (this.remainDateTime > 0) {
            for (let i = 0; i < this.count; i += 1) {
                // drawColoredBackground(context, '#212121');
                context.clearRect(0, 0, W, H);
                this.clock.draw(context, this.remainDateTime - 1000 * i);

                updatecb(context);
            }
        } else {
            // drawColoredBackground(context, '#212121');
            this.clock.draw(context, this.remainDateTime);

            updatecb(context);
        }

        endcb();
    }
}

const createClockGIF = (endDateTime, fileName) => {
    // endDateTime should be integer.
    const clockGIF = new ClockGIF();
    let givenDateTime = isNaN(endDateTime) ? new Date(endDateTime).getTime() : endDateTime;

    clockGIF.create(givenDateTime, fileName);
}

module.exports = createClockGIF