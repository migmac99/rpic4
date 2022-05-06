// var Keypad = require("rpi-keypad");

// var input = new Keypad(
//     [
//         ["1", "2", "3", "A"],
//         ["4", "5", "6", "B"],
//         ["7", "8", "9", "C"],
//         ["*", "0", "#", "D"],
//     ], // keypad layout
//     [25, 8, 7, 1], // row GPIO pins
//     [12, 16, 20, 21] // colum GPIO pins
// );

// setInterval(() => {
//     var key = input.getKey();
//     if (key != null) {
//         console.log("key pressed: " + key);
//     } else {
//         console.log("no key pressed");
//     }
// }, 100);