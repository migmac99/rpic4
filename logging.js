// ============================================================================================================================================================================
// Fancy console logging by Migmac
//
var pjson = require('./package.json');

let colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    BGblack: "\x1b[40m",
    BGred: "\x1b[41m",
    BGgreen: "\x1b[42m",
    BGyellow: "\x1b[43m",
    BGblue: "\x1b[44m",
    BGmagenta: "\x1b[45m",
    BGcyan: "\x1b[46m",
    BGwhite: "\x1b[47m"
}

/**
 * This Function is called once when the App is ready
 * @param ShowDependencies bool | Defaults to false
 */
function LogRunning(ShowDependencies = false) {
    console.log(`+==========================+`);
    console.log(`|  Starting ${colors.magenta}${pjson.name}${colors.reset} by ${colors.cyan}AllTWay${colors.reset}  |`);
    if (ShowDependencies) {
        console.log(`+==+=======================+`);
        console.log(`|  ${colors.red}|${colors.reset}`);
        LogDependencies();
    } else {
        console.log(`+==========================+`);
        console.log(`|`);
    }
}

function LogDependencies() {
    if (pjson.devDependencies) {
        console.log(`|${colors.red}  +-- DevDependencies${colors.reset}`);

        for (var key in pjson.devDependencies) {
            if (pjson.devDependencies.hasOwnProperty(key)) {
                console.log(`|  ${colors.red}|${colors.reset}${colors.red}   +-- ${colors.yellow}${key} [${pjson.devDependencies[key]}]${colors.reset}`);
            }
        }
        console.log(`|${colors.red}  |${colors.reset}`);
    }

    console.log(`|${colors.red}  +-- Dependencies${colors.reset}`);

    for (var key in pjson.dependencies) {
        if (pjson.dependencies.hasOwnProperty(key)) {
            console.log(`|${colors.red}      +-- ${colors.yellow}${key} [${pjson.dependencies[key]}]${colors.reset}`);
        }
    }

    console.log(`|`);
}

/**
 * Use this to issue Log Check messages 
 * @param msg Message to be shown if OK
 * @param failedmsg Message to be shown if FAILED
 */
function LogCheck(msg, failedmsg = null, attempt = false) {
    if (failedmsg != null) {
        console.log(`[${colors.red} FAILED ${colors.reset}] ${msg}\n${failedmsg}`);
    } else {
        console.log(`[${colors.green}   OK   ${colors.reset}] ${msg}`);
    }
}

/**
 * Use this to issue custom Log messages 
 * @param type Type of message [ TYPE ]
 * @param typecolor Color for type (color.cyan)
 * @param msg Message to be shown if OK
 * @param objMsg used to display Multiline vars
 */
function LogCustom(type, typecolor, msg, objMsg = null) {
    switch (typecolor) {
        case "debug":
            if (process.env.LOG_DEBUG != 'false') {
                console.log(`[${colors.yellow}${type}${colors.reset}] ${msg}${colors.reset}`);
                if (objMsg) { console.log(objMsg) }
            }
            break

        default:
            console.log(`[${typecolor}${type}${colors.reset}] ${msg}${colors.reset}`);
            if (objMsg) { console.log(objMsg) }
            break
    }
}

module.exports = {
    colors,
    LogRunning,
    LogCheck,
    LogCustom
}