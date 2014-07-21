#!/usr/bin/env node

var ecstatic = require('ecstatic');
var getport = require('getport');
var http = require("http");
var url = require('url');
var ServeBrowserify = require("../index.js");

var serveBrowserify = ServeBrowserify({
    root: process.cwd(),
    base: '/'
});

var serveStatic = ecstatic({
    root: process.cwd(),
    autoIndex: true
});

var server = http.createServer(function(req, res) {
    if (/\.js$/.test(url.parse(req.url).path)) {
        console.log('browserifying', req.url);
        return serveBrowserify(req, res);
    } else {
        console.log('serving static', req.url);
        return serveStatic(req, res);
    }
});

getport(9000, function(err, port) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    server.listen(port, function() {
        console.log("serve-browserify listening on port http://127.0.0.1:" + port);
    });
});
