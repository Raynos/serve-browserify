var zlib = require("zlib")
var crypto = require("crypto")

var isGzip = /\bgzip\b/

module.exports = CompiledFiles

function CompiledFiles(config) {
    config = config || {}
    var contentType = config.contentType || "text/plain"
    var sendError = config.sendError || defaultSendError
    var compile = config.compile
    var findResource = config.findResource

    if (!config.findResource) {
        throw new Error("Must pass in a resource finding function")
    }

    if (!config.compile) {
        throw new Error("Must pass in a compile function")
    }

    return function ServeFile(opts) {
        opts = opts || {}
        var cache = opts.cache
        var gzip = opts.gzip
        var cacheControl = opts.cacheControl || "max-age=300, must-revalidate"
        var compiledCache = {}

        return function routeHandler(req, res) {
            var location = findResource(req, res, opts)

            res.setHeader("content-type", contentType)

            if (cache && compiledCache[location]) {
                return sendResource(req, res, compiledCache[location])
            }

            compile(location, opts, prepareResource)

            function prepareResource(err, payload) {
                if (err) {
                    return sendError(req, res, err)
                }

                if (gzip) {
                    zlib.gzip(payload, function (err, buffer) {
                        if (err) {
                            return sendError(req, res, err)
                        }

                        sendGzipPlain({ plain: payload, gzip: buffer })
                    })
                } else {
                    sendGzipPlain({ plain: payload })
                }
            }

            function sendGzipPlain(types) {
                var hash = crypto
                    .createHash("md5")
                    .update(types.plain)
                    .digest("hex")

                var chunk = new FileChunk(types.plain, types.gzip, hash)

                if (cache) {
                    compiledCache[location] = chunk
                }

                sendResource(req, res, chunk)
            }
        }

        function sendResource(req, res, chunk) {
            var reqEtag = req.headers["if-none-match"] || ""

            if (cache && reqEtag === chunk.hash) {
                res.statusCode = 304
                return res.end()
            }

            res.statusCode = 200

            if (cache) {
                res.setHeader("Etag", chunk.hash)
                res.setHeader("Cache-Control", cacheControl)
            }

            var acceptEncoding = req.headers["accept-encoding"] || ""

            if (gzip && chunk.gzip && acceptEncoding.match(isGzip)) {
                res.setHeader("content-encoding", "gzip")
                return res.end(chunk.gzip)
            }

            return res.end(chunk.plain)
        }
    }
}

function defaultSendError(req, res, err) {
    res.statusCode = 500
    res.end(err.message)
}

function FileChunk(plain, gzip, hash) {
    this.plain = plain || null
    this.gzip = gzip || null
    this.hash = hash || null
}


