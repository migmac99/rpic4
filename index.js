const { LogRunning, LogCheck, LogCustom, colors } = require('./logging')
const { Sleep, ReverseString } = require('./utility')

const { Board, LCD, Pin, Buttons } = require("johnny-five");
const { RaspiIO } = require("raspi-io");
const { execSync } = require("child_process");

const board = new Board({
    io: new RaspiIO(),
    repl: false
});

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

const pinCodes = {
    rows: ["GPIO5", "GPIO6", "GPIO13", "GPIO19"],
    cols: ["GPIO12", "GPIO16", "GPIO20", "GPIO21"]
};

const keys = [
    ["1", "2", "3", "A"],
    ["4", "5", "6", "B"],
    ["7", "8", "9", "C"],
    ["*", "0", "#", "D"],
];

var colPressed = null;
var rowPressed = null;

var keypad = { pins: null };

async function checkCol() {
    delete keypad.pins;

    keypad = {
        pins: Object.assign({}, pinCodes)
    };

    keypad.pins.rows = keypad.pins.rows.map(function(pinCode) {
        return new Pin({ mode: Pin.OUTPUT, pin: pinCode });
    });

    keypad.pins.cols = new Buttons(keypad.pins.cols.map(function(pinCode) {
        return { pin: pinCode, isPullup: true };
    }))

    keypad.pins.rows.forEach((pin) => { pin.low() });

    // required wait (for pin creation & pin.low() propagation?)
    await Sleep(50);

    keypad.pins.cols.on("down", function(button) {
        // send column index as parameter to checkRow()
        checkRow(pinCodes.cols.indexOf(button.pin))
    });
}

async function checkRow(numCol) {
    colPressed = numCol;

    // as soon as a button press on a column is detected,
    // inverse pins modes (input <=> output) to detect pressed button row
    keypad.pins.cols.forEach((pin) => { pin.removeAllListeners() });
    delete keypad.pins;

    keypad = {
        pins: Object.assign({}, pinCodes)
    };

    keypad.pins.rows = keypad.pins.rows.map(function(pinCode) {
        return new Pin({ mode: Pin.INPUT, pin: pinCode, type: "digital" });
    });

    // enable pullup resistors for input pins
    // I did not find a way to do it through Johnny Five ;
    // here we must use Pins instead of Buttons because an immediate read
    // (using Pin.query()) is required
    pinCodes.rows.forEach(function(code) {
        execSync('raspi-gpio set ' + parseInt(code.substring(4), 10) + ' pu');
    });

    keypad.pins.cols = keypad.pins.cols.map(function(pinCode) {
        return new Pin({ mode: Pin.OUTPUT, pin: pinCode, type: "digital" });
    });

    keypad.pins.cols.forEach((pin) => { pin.low() });

    // required wait (for pin creation & pin.low() propagation?)
    await Sleep(50);

    rowPressed = null;

    for (let currentRow = 0; currentRow < 4; currentRow++) {
        if (await isButtonPressedInKeypadRow(keypad, currentRow)) {
            rowPressed = currentRow;
            break;
        }
    }

    if (rowPressed !== null) {
        showKeyPressed();
    } else {
        config[0].msg = "[1] Keypad Issue!"
        console.log("Keypad issue: could not detect row of pressed key. Waiting for next key push.");
    }

    checkCol();
}

/**
 * Detect if a button has been pressed in specified keypad col
 * @return Promise
 */
function isButtonPressedInKeypadRow(keypad, rowNum) {
    return new Promise((resolve) => {
        keypad.pins.rows[rowNum].query((state) => {
            resolve(state.value == 0);
        });
    });
}

function showKeyPressed() {
    let char = keys[rowPressed][colPressed];
    config[0].msg = "Key pressed: " + char
    console.log("KEY PRESSED: ", char);
    if (cursorPos == 16) {
        cursorPos = 0;
        config[0].msg = ""
    }
    config[0].msg = char
    cursorPos++;
}

////////////////////////////////////////////////////////////////////////


function update(line, tick) {
    cfg = config[line];

    // This makes sure the ticks don't overflow by looping back to tick 0 after 2^30 ticks
    let nextTick = (tick + 1) % (1 << 30)

    setTimeout(() => { update(line, nextTick) }, cfg.scrollSpeed)
    displayText(cfg.msg, line, tick)

    // setInterval(() => {
    //     var key = input.getKey()
    //     config[0].scroll = false

    //     if (key != null) {
    //         config[0].msg = "Key pressed: " + key
    //     } else {
    //         config[0].msg = "No Key Pressed!"
    //     }
    // }, 100)
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