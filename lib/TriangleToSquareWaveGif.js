const W = 500, H = 500
const { createCanvas } = require('canvas');
const GifEncoder = require('gifencoder');
const fs = require('fs')
const drawColoredBackground = (context, color) => {
    context.fillStyle = color
    context.fillRect(0, 0, W, H)
}
class TriangleToSquareWaveGif {
    constructor() {
        this.initCanvas()
        this.initGifEncoder()
    }
    initCanvas() {
        this.canvas = new createCanvas(W, H);
        this.context = this.canvas.getContext('2d')
    }

    initGifEncoder() {
        this.gifEncoder = new GifEncoder(W, H)
        this.gifEncoder.setQuality(100)
        this.gifEncoder.setRepeat(0)
        this.gifEncoder.setDelay(80)
    }

    create(amp, freq, fileName) {
        this.gifEncoder.createReadStream().pipe(fs.createWriteStream(fileName))
        this.renderer = new Renderer(amp, freq)
        this.gifEncoder.start()
        this.renderer.render(this.context, (context) => {
            this.gifEncoder.addFrame(context)
        }, () => {
            this.gifEncoder.finish()
        })
    }
}

class State {
    constructor() {
        this.scale = 0
        this.prevScale = 0
        this.dir = 1
    }
    update(stopcb) {
        this.scale += 0.1 * this.dir
        console.log(this.scale)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir *= -1
            this.prevScale = this.scale
            console.log(this.scale)
            if (this.dir == 1) {
                stopcb()
            }
        }
    }
}
class TriangleToSquareWave {
    constructor(amp, freq) {
        this.state = new State()
        this.a = amp
        this.n = freq
    }
    draw(context) {
        // 1 frequency will have positive and negative wave cycle.
       const side = (W) / (2 * this.n)
       context.strokeStyle = 'teal'
       context.lineWidth = side/12
       context.lineCap = 'round'
       // 2nd and 3rd vertex will move the same distance in opposite direction
       context.save()
       context.translate(0, H/2)
       for (var i = 0; i < 2 * this.n; i++) {
            // x = 0, 1 , y = 1 - 2  * x
            const y = this.a * (1 - 2 * (i%2))
            const x = this.state.scale * (side/2)
            context.beginPath()
            context.moveTo(side * i, 0)
            context.lineTo(side * i + side/2 - x, y)
            context.lineTo(side * i + side/2 + x, y)
            context.lineTo(side * i + side, 0)
            context.stroke()
       }
       context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
}

class Renderer {
    constructor(amp, freq) {
        this.isRunning = true
        this.wave = new TriangleToSquareWave(amp, freq)
    }
    // updatecb is addingFrame to context, endcb is ending the gifencoder
    render(context, updatecb, endcb) {
        while (this.isRunning) {
            drawColoredBackground(context, '#212121')
            this.wave.draw(context)
            this.wave.update(() => {
                endcb()
                this.isRunning = false
            })
            updatecb(context)
        }
    }
}
const createTriangleToSquareWaveGif = (amp, freq, fileName) => {
    const triangleToSquareWaveGif = new TriangleToSquareWaveGif()
    if (amp < H) {
        triangleToSquareWaveGif.create(amp, freq, fileName)
    }
    else {
        console.log(`amplitude must be less than ${H}`)
    }
}
module.exports = createTriangleToSquareWaveGif