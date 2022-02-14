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

module.exports = {
    Sleep
}