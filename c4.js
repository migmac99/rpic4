var logging = true;

if (logging){
    console.log('.'); //Start Spacer
    console.log('+==========================+');
    console.log('|  Starting C4 by ' + '\x1b[36m%s\x1b[0m', 'AllTWay' + '\x1b[0m', ' |');
    console.log('+==+=======================+');
} else {
    console.log('Starting C4 by ' + '\x1b[36m%s\1', 'AllTWay' + '\x1b[0m');
}

//START HTML SERVER

const http = require('http');

const PORT = 0080;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello dev.to!\n');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});


//LOCAL IPV4 DETECTION

var public_ipv4;

'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
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

//Extra Logging

if (logging){
    console.log('   |');
    console.log('   +--=[' + '\x1b[47m\x1b[30m' + ' Public IP ' + '\x1b[0m' + ']=--> ' + '\x1b[32m' + public_ipv4 + '\x1b[0m');
    console.log('   |');
    console.log('   .'); //End Spacer
}
