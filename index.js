const { LogRunning, LogCheck, LogCustom, colors } = require('./logging')

const LCD = require('raspberrypi-liquid-crystal')

const COLS = 16
const ROWS = 2

const lcd = new LCD(
    1, // I2C bus
    0x27, // Address (sudo i2cdetect -y 1)
    COLS,
    ROWS
)

config = [
    configInit(),
    configInit(),
]

function configInit() {
    return {
        'msg': '8',
        'align': 'center',
        'scroll': false,
        'scrollSpeed': 50,
    }
}

twinkle = "Twinkle Twinkle Little star how I wonder what you are, up above the world so high, like a diamond in the sky."

let tick = 0
let tickrate = 0

LogRunning()
boot()
start()

setTimeout(update, tickrate)

function boot() {
    lcd.beginSync()
    LogCheck('LCD Connected!')
    lcd.clearSync()
    lcd.setCursorSync(1, 0)
    lcd.printSync('C4 by AllTWay')
    lcd.setCursorSync(4, 1)
    lcd.printSync('8Pirats')
    LogCheck('Booting Up!')
    sleep(2000)
}

function start() {
    lcd.clearSync()
    lcd.setCursorSync(1, 0)
    lcd.printSync(twinkle)
    lcd.setCursorSync(4, 1)
    lcd.printSync('8Pirats')

    LogCustom('  USER  ', colors.cyan, `${colors.magenta}Twinkle!`)

    config[0].msg = twinkle
    config[1].msg = '      8Pirats      '
    LogCustom('  DEBUG ', colors.cyan, 'Config:', config)
}

function update() {
    setTimeout(update, tickrate);

    for (var j = 0; j < ROWS; j++) {
        fitText(config[j].msg, j, config[j].scrollSpeed)
    }

    // This makes sure the ticks don't overflow by looping back to tick 0 after 2^30 ticks
    tick = (tick + 1) % (1 << 30)
}

function fitText(msg, line, delay) {
    if (msg > COLS) {
        config[line].scroll = true
    }

    i = tick % msg.length

    let sliced = ''
    for (var j = 0; j < COLS; j++) {
        sliced += msg[(i + j) % msg.length]
    }

    lcd.setCursorSync(0, line)
    lcd.printSync(sliced)
    sleep(delay)

    // LogCustom(' UPDATE ', 'debug', `Sliced[${sliced}] i[${i}] i+j[${i+j}]`)
}

function sleep(milliseconds) {
    const date = Date.now()
    let currentDate = null
    do {
        currentDate = Date.now()
    } while (currentDate - date < milliseconds)
}