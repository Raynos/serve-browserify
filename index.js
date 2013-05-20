var browserify = require("browserify")
var process = require("process")
var url = require("url")

var getLocation = require("./lib/get-location")

// /browserify/:appName
module.exports = ServeJavascript

function ServeJavascript(root) {
    return function serve(req, res) {
        var pathname = url.parse(req.url).pathname
        var parts = pathname.split("/")
        var appName = parts[parts.length - 1]

        res.setHeader("content-type", "application/javascript")

        getLocation(root, appName, "js", bundleLocation)

        function bundleLocation(err, uri) {
            // console.log("getting location", root, appName, err, uri)
            if (err) {
                res.statusCode = 404
                return res.end("404 Not Found")
            }

            bundle(uri, sendPayload)
        }

        function sendPayload(err, payload) {
            if (err) {
                return res.end("(" + function (err) {
                    throw new Error(err)
                } + "(" + JSON.stringify(err.message) + "))")
            }

            res.end(payload)
        }
    }
}

// return javascript string for the payload!
// bundle := (String, Callback<String>) => void
function bundle(location, callback) {
    var b = browserify()
    b.add(location)
    b.bundle({
        debug: true
    }, function (err, payload) {
        if (err) {
            return callback(err)
        }

        payload = ";(function () {\n window.NODE_ENV = '" +
            process.env.NODE_ENV + "'\n }());\n" + payload

        callback(null, payload)
    })
}
