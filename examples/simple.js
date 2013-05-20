var http = require("http")
var path = require("path")
var Router = require("routes-router")
var ecstatic = require("ecstatic")

var ServeBrowserify = require("../index")

var router = Router()

router.addRoute("/browserify/:appName",
    ServeBrowserify(path.join(__dirname, "browser")))
router.addRoute("/", ecstatic({
    root: path.join(__dirname, "static"),
    autoIndex: true
}))

var server = http.createServer(router)

server.listen(9024, function () {
    console.log("demo server listening on port 9024")
})