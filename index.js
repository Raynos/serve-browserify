var resolve = require("resolve")
var path = require("path")
var url = require("url")

var bundle = require("./bundle")
var CompiledFiles = require("./lib/compiled-files")
// var getLocation = require("./lib/get-location")

// /js/:appName
module.exports = CompiledFiles({
    // this is the function to compile the resource.
    // the location is the value returned by findResource
    // you should pass a String to the callback
    compile: function (location, opts, callback) {
        resolve(location, function (err, fileUri) {
            if (err) {
                return callback(err)
            }

            bundle(fileUri, opts, callback)
        })
    },
    // This is the logic of how to display errors to the user
    sendError: function sendError(req, res, err) {
        return res.end("(" + function (err) {
            throw new Error(err)
        } + "(" + JSON.stringify(err.message) + "))")
    },
    // CompiledFiles will set this content type on the response
    contentType: "application/javascript",
    /*
        findResource takes a Request, the opts passed to the ServeFile
            function and a callback.

        It's responsibility is to return a location on disk that the
            Request is asking for.
    */
    findResource: function findResource(req, res, opts) {
        var pathname = url.parse(req.url).pathname
        var parts = pathname.split("/")
        return path.join(opts.root, parts[parts.length - 1])
    }
})

