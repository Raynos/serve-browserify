var browserify = require("browserify");
var watchify = require("watchify");
var extend = require("xtend");
var embedNodeEnv = require("node-env/script");

var locationCache = {};

module.exports = bundle;

// return javascript string for the payload!
// bundle := (String, Callback<String>) => void
function bundle(location, opts, callback) {
    var b
    if (opts.watchify) {
        b = getFromCache(location, opts);
    } else {
        b = getBundle(location, opts)
    }

    b.bundle(function onPayload(err, payload) {
        if (err) {
            return callback(err);
        }

        payload = embedNodeEnv() + payload;

        callback(null, payload);
    });
}

function getFromCache(location, opts) {
    if (locationCache[location]) {
        return locationCache[location];
    }

    var b = getBundle(location, extend(opts, watchify.args));
    var w = watchify(b, opts);

    locationCache[location] = w;
    return w;
}

function getBundle(location, opts) {
    var b = browserify(opts);
    b.add(location);
    return b
}
