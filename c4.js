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
	    console.log(ifname + ':' + alias, iface.address);
	} else {
	    // this interface has only one ipv4 address
	    console.log(ifname, iface.address);
	}
	++alias;
    });
});

// en0 192.168.1.101
// eth0 10.0.0.101
