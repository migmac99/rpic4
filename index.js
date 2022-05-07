const { LogRunning, LogCheck, LogCustom, colors } = require('./logging')
const { Sleep, ReverseString } = require('./utility')

const LCD = require('raspberrypi-liquid-crystal')
const COLS = 16
const ROWS = 2
const lcd = new LCD(
    1, // I2C bus
    0x27, // Address (sudo i2cdetect -y 1)
    COLS,
    ROWS
)

config = []

function configInit() {
    return {
        'msg': '8',
        'scroll': false,
        'scrollSpeed': 50,
        'scrollRight': true,
        'align': 'center',
    }
}

twinkle = "Twinkle Twinkle Little star how I wonder what you are, up above the world so high, like a diamond in the sky."

LogRunning()
boot()

function boot() {
    lcd.beginSync()
    LogCheck('LCD Connected!')
    lcd.clearSync()
    lcd.setCursorSync(1, 0)
    lcd.printSync('C4 by AllTWay')
    lcd.setCursorSync(4, 1)
    lcd.printSync('8Pirats')
    LogCheck('Booting Up!')
    Sleep(2000)
    lcd.clearSync()

    for (let i = 0; i < ROWS; i++) {
        config.push(configInit());
    }

    start()

    for (let i = 0; i < ROWS; i++) {
        update(i, 0)
    }
}

function start() {
    LogCustom('  USER  ', colors.cyan, `${colors.magenta}Twinkle!`)

    config[0].msg = twinkle
    config[0].scrollSpeed = 100

    config[1].msg = '    8Pirats    '
    config[1].scroll = true
    config[1].scrollRight = false
    config[1].scrollSpeed = 500

    LogCustom('  DEBUG ', colors.cyan, 'Config:', config)
}


////////////////////////////////////////////////////////////////////////

// const physPinCodes = {
//     rows: ["P1-36", "P1-33", "P1-31", "P1-32"],
//     cols: ["P1-40", "P1-37", "P1-38", "P1-35"],
// }

const pinCodes = {
    rows: [16, 13, 6, 12],
    cols: [21, 26, 20, 19],
}

const keys = [
    ["1", "2", "3", "A"],
    ["4", "5", "6", "B"],
    ["7", "8", "9", "C"],
    ["*", "0", "#", "D"],
]

const Gpio = require('onoff').Gpio;

const buttons = [
    new Gpio(16, 'in', 'both'),
    new Gpio(13, 'in', 'both'),
    new Gpio(6, 'in', 'both'),
    new Gpio(12, 'in', 'both'),
    new Gpio(21, 'in', 'both'),
    new Gpio(26, 'in', 'both'),
    new Gpio(20, 'in', 'both'),
    new Gpio(19, 'in', 'both'),
]



function returnPin(idx) {
    let a = [16, 13, 6, 12, 21, 26, 20, 19]
    return a[idx]
}

// button.watch((err, value) => led.writeSync(value));


////////////////////////////////////////////////////////////////////////


function update(line, tick) {
    cfg = config[line];

    // This makes sure the ticks don't overflow by looping back to tick 0 after 2^30 ticks
    let nextTick = (tick + 1) % (1 << 30)

    setTimeout(() => { update(line, nextTick) }, cfg.scrollSpeed)
    displayText(cfg.msg, line, tick)


    // config[0].msg = "Key pressed: " + key

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].watch((err, value) => {
            if (value != 0) {
                LogCustom(`  GPIO  `, colors.cyan, `[${returnPin(i)}] Value => [${value}]`)
            }
        })
    }
}

function displayText(msg, line, tick) {
    cfg = config[line];

    if ((msg.length > COLS) && (!cfg.scroll)) {
        cfg.scroll = true
        LogCustom('  DEBUG ', colors.cyan, 'Config:', config)
    }

    let sliced = ''

    if (cfg.scroll) {
        i = tick % msg.length

        if (cfg.scrollRight) {
            for (var j = 0; j < COLS; j++) {
                sliced += msg[(i + j) % msg.length]
            }
        } else {
            for (var j = (COLS - 1); j >= 0; j--) {
                sliced += ReverseString(msg)[(i + j) % msg.length]
            }
        }
    } else {
        sliced = msg
    }

    lcd.setCursorSync(0, line)
    lcd.printSync(sliced)

    // LogCustom(' UPDATE ', 'debug', `Sliced[${sliced}] i[${i}] i+j[${i+j}]`)
}