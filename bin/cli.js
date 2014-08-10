#!/usr/bin/env node

var ecstatic = require('ecstatic');
var fs = require('fs');
var getport = require('getport');
var http = require('http');
var url = require('url');
var path = require('path');
var sendHtml = require('send-data/html');

var ServeBrowserify = require('../index.js');

var serveBrowserify = ServeBrowserify({
    root: process.cwd(),
    base: '/'
});

var serveStatic = ecstatic({
    root: process.cwd(),
    autoIndex: true,
    defaultExt: true
});

var indexFile = path.join(process.cwd(), 'index.html');
var hasIndex = fs.existsSync(indexFile);
var defaultIndex

if (!hasIndex) {
    defaultIndex = fs.readFileSync(
        path.join(__dirname, 'defaultIndex.html'))
}

var server = http.createServer(function(req, res) {
    var path = url.parse(req.url).path;
    if (/\.js$/.test(path)) {
        console.log('browserifying', req.url);
        return serveBrowserify(req, res);
    } else if (path === '/' && !hasIndex) {
        console.log('sending index page', req.url)
        return sendHtml(req, res, defaultIndex)
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
        console.log('serve-browserify listening on port http://127.0.0.1:' + port);
    });
});
