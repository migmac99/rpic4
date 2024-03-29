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

    setup()
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

// let L1 = 16
// let L2 = 13
// let L3 = 6
// let L4 = 12

// let C1 = 21
// let C2 = 26
// let C3 = 20
// let C4 = 19

const GPIO = require('rpi-gpio')


// var gpiop = require('rpi-gpio').promise;

// gpiop.setup(L1, gpiop.DIR_OUT).then(() => { return gpiop.write(L1, true) }).catch((err) => { console.log('Error: ', err.toString()) })
// gpiop.setup(L2, gpiop.DIR_OUT).then(() => { return gpiop.write(L2, true) }).catch((err) => { console.log('Error: ', err.toString()) })
// gpiop.setup(L3, gpiop.DIR_OUT).then(() => { return gpiop.write(L3, true) }).catch((err) => { console.log('Error: ', err.toString()) })
// gpiop.setup(L4, gpiop.DIR_OUT).then(() => { return gpiop.write(L4, true) }).catch((err) => { console.log('Error: ', err.toString()) })

// gpiop.setup(C1, gpiop.DIR_IN).then(() => { return gpiop.read(C1, true) }).catch((err) => { console.log('Error: ', err.toString()) })
// gpiop.setup(C2, gpiop.DIR_IN).then(() => { return gpiop.read(C2, true) }).catch((err) => { console.log('Error: ', err.toString()) })
// gpiop.setup(C3, gpiop.DIR_IN).then(() => { return gpiop.read(C3, true) }).catch((err) => { console.log('Error: ', err.toString()) })
// gpiop.setup(C4, gpiop.DIR_IN).then(() => { return gpiop.read(C4, true) }).catch((err) => { console.log('Error: ', err.toString()) })

// GPIO.setwarnings(false)
// GPIO.setmode(GPIO.BOARD)

// GPIO.setup(L1, GPIO.OUT)
// GPIO.setup(L2, GPIO.OUT)
// GPIO.setup(L3, GPIO.OUT)
// GPIO.setup(L4, GPIO.OUT)

// GPIO.setup(C1, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
// GPIO.setup(C2, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
// GPIO.setup(C3, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)
// GPIO.setup(C4, GPIO.IN, pull_up_down = GPIO.PUD_DOWN)

// function readLine(line, characters) {
//     GPIO.output(line, GPIO.HIGH)
//     if (GPIO.input(C1) == 1) { LogCustom(`  GPIO  `, colors.cyan, `[${characters[0]}]`) }
//     if (GPIO.input(C2) == 1) { LogCustom(`  GPIO  `, colors.cyan, `[${characters[1]}]`) }
//     if (GPIO.input(C3) == 1) { LogCustom(`  GPIO  `, colors.cyan, `[${characters[2]}]`) }
//     if (GPIO.input(C4) == 1) { LogCustom(`  GPIO  `, colors.cyan, `[${characters[3]}]`) }
//     GPIO.output(line, GPIO.LOW)
// }

// while (true) {
//     readLine(L1, ["1", "2", "3", "A"])
//     readLine(L2, ["4", "5", "6", "B"])
//     readLine(L3, ["7", "8", "9", "C"])
//     readLine(L4, ["*", "0", "#", "D"])
//     time.sleep(0.1)
// }

// const Gpio = require('onoff').Gpio;

// const buttons = [
//     new Gpio(16, 'in', 'both'),
//     new Gpio(13, 'in', 'both'),
//     new Gpio(6, 'in', 'both'),
//     new Gpio(12, 'in', 'both'),
//     new Gpio(21, 'in', 'both'),
//     new Gpio(26, 'in', 'both'),
//     new Gpio(20, 'in', 'both'),
//     new Gpio(19, 'in', 'both'),
// ]

// for (let i = 0; i < buttons.length; i++) {
//     buttons[i].watch((err, value) => {
//         if (value != 0) {
//             LogCustom(`  GPIO  `, colors.cyan, `[${returnPin(i)}] Value => [${value}]`)
//         }
//     })
// }

// function returnPin(idx) {
//     let a = [16, 13, 6, 12, 21, 26, 20, 19]
//     return a[idx]
// }

// button.watch((err, value) => led.writeSync(value));

const Gpio = require('onoff').Gpio;

const _ROWS = [16, 13, 6, 12]
const _COLS = [21, 26, 20, 19]


function setup() {
    //Make column pins output
    new Gpio(_COLS[0], 'in', 'both')
    new Gpio(_COLS[1], 'in', 'both')
    new Gpio(_COLS[2], 'in', 'both')
    new Gpio(_COLS[3], 'in', 'both')

    //Make row pins input
    new Gpio(_ROWS[0], 'in', 'both')
    new Gpio(_ROWS[1], 'in', 'both')
    new Gpio(_ROWS[2], 'in', 'both')
    new Gpio(_ROWS[3], 'in', 'both')
}

function loop() {
    digitalWrite(_COLS[0], HIGH)
    digitalWrite(_COLS[1], LOW)
    digitalWrite(_COLS[2], LOW)
    digitalWrite(_COLS[3], LOW)
    let value = '1 EMPTY'
    if (digitalRead(_ROWS[0]) == HIGH && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == LOW) {
        value = "1"
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == HIGH && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == LOW) {
        value = "4"
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == HIGH && digitalRead(_ROWS[3]) == LOW) {
        value = "7"
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == HIGH) {
        value = "*"
    } else {}
    LogCustom(`  GPIO  `, colors.cyan, `[${returnPin(i)}] Value => [${value}]`)
    Sleep(100)

    digitalWrite(_COLS[0], LOW)
    digitalWrite(_COLS[1], HIGH)
    digitalWrite(_COLS[2], LOW)
    digitalWrite(_COLS[3], LOW)
    value = '2 EMPTY'
    if (digitalRead(_ROWS[0]) == HIGH && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == LOW) {
        value = "2"
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == HIGH && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == LOW) {
        value = "5"
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == HIGH && digitalRead(_ROWS[3]) == LOW) {
        value = "8"
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == HIGH) {
        value = "0"
    } else {}
    LogCustom(`  GPIO  `, colors.cyan, `[${returnPin(i)}] Value => [${value}]`)
    Sleep(100)

    digitalWrite(_COLS[0], LOW)
    digitalWrite(_COLS[1], LOW)
    digitalWrite(_COLS[2], HIGH)
    digitalWrite(_COLS[3], LOW)

    value = '3 EMPTY'
    if (digitalRead(_ROWS[0]) == HIGH && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == LOW) {
        value = '3'
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == HIGH && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == LOW) {
        value = '6'
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == HIGH && digitalRead(_ROWS[3]) == LOW) {
        value = '9'
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == HIGH) {
        value = '#'
    } else {}
    LogCustom(`  GPIO  `, colors.cyan, `[${returnPin(i)}] Value => [${value}]`)
    Sleep(100)

    digitalWrite(_COLS[0], LOW)
    digitalWrite(_COLS[1], LOW)
    digitalWrite(_COLS[2], LOW)
    digitalWrite(_COLS[3], HIGH)
    value = '4 EMPTY'
    if (digitalRead(_ROWS[0]) == HIGH && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == LOW) {
        value = 'A'
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == HIGH && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == LOW) {
        value = 'B'
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == HIGH && digitalRead(_ROWS[3]) == LOW) {
        value = 'C'
    } else if (digitalRead(_ROWS[0]) == LOW && digitalRead(_ROWS[1]) == LOW && digitalRead(_ROWS[2]) == LOW && digitalRead(_ROWS[3]) == HIGH) {
        value = 'D'
    } else {}
    LogCustom(`  GPIO  `, colors.cyan, `[${returnPin(i)}] Value => [${value}]`)
    Sleep(100)
}

////////////////////////////////////////////////////////////////////////


function update(line, tick) {
    cfg = config[line];

    // This makes sure the ticks don't overflow by looping back to tick 0 after 2^30 ticks
    let nextTick = (tick + 1) % (1 << 30)

    setTimeout(() => { update(line, nextTick) }, cfg.scrollSpeed)
    displayText(cfg.msg, line, tick)

    loop()

    // config[0].msg = "Key pressed: " + key
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