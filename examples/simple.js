var http = require("http")
var path = require("path")
var Router = require("routes-router")
var ecstatic = require("ecstatic")

var ServeBrowserify = require("../index")

var router = Router()

router.addRoute("/browserify/:appName", ServeBrowserify({
    cache: true,
    root: path.join(__dirname, "browser"),
    gzip: true,
    debug: true
}))
router.addRoute("/", ecstatic({
    root: path.join(__dirname, "static"),
    autoIndex: true
}))

var server = http.createServer(router)

server.listen(9024, function () {
    console.log("demo server listening on port 9024")
})
