var browserify = require("browserify")
var embedNodeEnv = require("node-env/script")

module.exports = bundle

// return javascript string for the payload!
// bundle := (String, Callback<String>) => void
function bundle(location, opts, callback) {
    var b = browserify(opts)
    b.add(location)
    b.bundle(function (err, payload) {
        if (err) {
            return callback(err)
        }

        payload = embedNodeEnv() + payload

        callback(null, payload)
    })
}
