/**
 * Use this to sleep for a given amount of time
 * @param miliseconds Time to sleep in ms
 */
function Sleep(milliseconds) {
    const date = Date.now()
    let currentDate = null
    do {
        currentDate = Date.now()
    } while (currentDate - date < milliseconds)
}

/**
 * Returns the reverse of given string
 * @param str String to be reversed
 */
function ReverseString(str) {
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return joinArray;
}

module.exports = {
    Sleep,
    ReverseString,
}