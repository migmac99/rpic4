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

LogRunning()

lcd.beginSync()
LogCheck('LCD Connected!')

lcd.clearSync()
lcd.setCursorSync(1, 0)
lcd.printSync('C4 by AllTWay')
lcd.setCursorSync(4, 1)
lcd.printSync('8Pirats')
LogCheck('Booting Up!')


sleep(2000)
twinkle = "Twinkle Twinkle Little star how I wonder what you are, up above the world so high, like a diamond in the sky."

lcd.clearSync()
    // lcd.setCursorSync(1, 0)
    // lcd.printSync(twinkle)
    // lcd.setCursorSync(4, 1)
    // lcd.printSync('8Pirats')

LogCustom('  USER  ', colors.cyan, `${colors.magenta}Twinkle!`)

lcd.setCursorSync(4, 1)
lcd.printSync('8Pirats')
fitText(twinkle, 0, 150)


function fitText(msg, line, delay) {
    if (msg.length > COLS) {
        for (var start = 0; start < msg.length; start++) {
            end = ((start + COLS) > msg.length) ? (start + COLS - msg.Length) : (start + COLS)
            sliced = msg.substring(start, end)
            lcd.setCursorSync(0, line)
            lcd.printSync(sliced)
            sleep(delay)
        }
    }

    LogCustom('  USER  ', 'debug', `[${sliced.length}] sliced[${sliced}] msg[${msg}]`)
}


// LogCustom('  PAGE  ', 'debug', 'User request for /widget')
// LogCustom('  USER  ', colors.cyan, `${colors.red}Disconnected`);

function sleep(milliseconds) {
    const date = Date.now()
    let currentDate = null
    do {
        currentDate = Date.now()
    } while (currentDate - date < milliseconds)
}