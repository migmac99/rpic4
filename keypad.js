/**
 * Example of 4x4 membrane keypad reading (keypad directly wired on RasPi GPIO pins, not using I2C)
 * 
 * Setup :
 * - Hard : Raspberry Pi 4B, 16x2 LCD display behind PCF8574T, 4x4 membrane keypad
 * - Soft : command line utility 'raspi-gpio', Node v10+, Johnny-Five 1.4, Raspi-IO 11.0
 * 
 * Run: sudo node keypad.js
 */

const { Board, LCD, Pin, Buttons } = require("johnny-five");
const { RaspiIO } = require("raspi-io");
const { execSync } = require("child_process");
const utils = require("./utils");

const board = new Board({
    io: new RaspiIO(),
    repl: false
});

// warning: LCD must be wired to SDA1 & SCL1 pins for data transfer
// (instead of SDA0 & SCL0) otherwise it won't be recognized.
const lcd = new LCD({
    controller: "PCF8574T"
});

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

var cursorPos = 0;


board.on("ready", () => {

    lcd.clear().print("Waiting input").cursor(1, 0);

    // Start listening for key push
    checkCol();

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
        await utils.sleep(50);

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
        await utils.sleep(50);

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
        console.log("KEY PRESSED: ", char);
        if (cursorPos == 16) {
            cursorPos = 0;
            lcd.clear();
        }
        lcd.print(char);
        cursorPos++;
    }
});