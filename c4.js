var logging = true;

if (logging) {
    console.log('.'); //Start Spacer
    console.log('+==========================+');
    console.log('|  Starting C4 by ' + '\x1b[36m%s\x1b[0m', 'AllTWay' + '\x1b[0m', ' |');
    console.log('+==+=======================+');
} else {
    console.log('Starting C4 by ' + '\x1b[36m%s\1', 'AllTWay' + '\x1b[0m');
}

//VARIABLES
var public_ipv4;

var os = require('os');
var express = require('express');
var fs = require('fs');

var ifaces = os.networkInterfaces();

//LOCAL IPV4 DETECTION
'use strict';
Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skips over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            //console.log(ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 address
            //console.log(ifname, iface.address);
            public_ipv4 = iface.address;
        }
        ++alias;
    });
});

//START HTML SERVER
const http = require('http');
const PORT = 80;

var app = express();

app.get('/', function(req, res) {
    res.sendFile('html/index.html', { root: __dirname })
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    //res.use(express.static(path.join(__dirname,"public")));
});

app.listen(PORT, () => {
    console.log(`C4 Server running on port ${PORT}.`);
});

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello dev.to!\n');
// });

// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}.`);
// });

//Extra Logging

if (logging) {
    console.log('   |');
    console.log('   +--=[' + '\x1b[47m\x1b[30m' + ' Public IP ' + '\x1b[0m' + ']=--> ' + '\x1b[32m' + public_ipv4 + '\x1b[0m');
    console.log('   |');
    console.log('   .'); //End Spacer
}