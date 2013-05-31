var url = require("url")
var zlib = require("zlib")
var crypto = require("crypto")

var bundle = require("./bundle")
var getLocation = require("./lib/get-location")

var isGzip = /\bgzip\b/

// /browserify/:appName
module.exports = ServeJavascript

function ServeJavascript(root, opts) {
    opts = opts || {}
    var cache = opts.cache
    var gzip = opts.gzip
    var cacheControl = opts.cacheControl || "max-age=300, must-revalidate"
    var debug = "debug" in opts ? opts.debug : true
    var bundleCache = {}

    return function serve(req, res) {
        var pathname = url.parse(req.url).pathname
        var parts = pathname.split("/")
        var appName = parts[parts.length - 1]
        var cacheKey = root + ":" + appName

        res.setHeader("content-type", "application/javascript")

        if (cache && bundleCache[cacheKey]) {
            return sendBundle(req, res, bundleCache[cacheKey])
        }

        getLocation(root, appName, "js", bundleLocation)

        function bundleLocation(err, uri) {
            if (err) {
                res.statusCode = 404
                return res.end("404 Not Found")
            }

            bundle(uri, { debug: debug }, sendPayload)
        }

        function sendPayload(err, payload) {
            if (err) {
                return sendError(req, res, err)
            }

            if (gzip) {
                zlib.gzip(payload, function (err, buffer) {
                    if (err) {
                        return sendError(req, res, err)
                    }

                    sendGzipPlain({ plain: payload, gzip: buffer} )
                })
            } else {
                sendGzipPlain({ plain: payload })
            }

            function sendGzipPlain(types) {
                var hash = crypto
                    .createHash("md5")
                    .update(types.plain)
                    .digest("hex")

                var opts = new ServeJavascriptChunk(
                    types.plain, types.gzip, hash)

                if (cache) {
                    bundleCache[cacheKey] = opts
                }

                sendBundle(req, res, opts)
            }
        }
    }

    function sendError(req, res, err) {
        return res.end("(" + function (err) {
            throw new Error(err)
        } + "(" + JSON.stringify(err.message) + "))")
    }

    function sendBundle(req, res, opts) {
        var regEtag = req.headers["if-none-match"] || ""

        if (cache && regEtag === opts.hash) {
            res.statusCode = 304
            return res.end()
        }

        res.statusCode = 200

        if (cache) {
            res.setHeader("Etag", opts.hash)
            res.setHeader("Cache-Control", cacheControl)
        }

        var acceptEncoding = req.headers["accept-encoding"] || ""

        if (gzip && acceptEncoding.match(isGzip) && opts.gzip) {
            res.setHeader("content-encoding", "gzip")
            return res.end(opts.gzip)
        }

        return res.end(opts.plain)
    }
}

function ServeJavascriptChunk(plain, gzip, hash) {
    this.plain = plain || null
    this.gzip = gzip || null
    this.hash = hash || null
}
