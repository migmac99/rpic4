const { LogRunning, LogCheck, LogCustom, colors } = require('./logging');

const LCD = require('raspberrypi-liquid-crystal');

const lcd = new LCD(
    1, // I2C bus
    0x27, // Address (sudo i2cdetect -y 1)
    16, // Columns
    2 // Rows
);

LogRunning();

lcd.beginSync();
LogCheck('LCD Connected!')

lcd.clearSync();
lcd.printSync('C4 by AllTWay');
lcd.setCursorSync(0, 1);
lcd.printSync('8Pirats');
LogCustom('  PRINT ', 'debug', 'Printing!')


// LogCustom('  PAGE  ', 'debug', 'User request for /widget')
// LogCustom('  USER  ', colors.cyan, `${colors.red}Disconnected`);