# serve-browserify

[![dependency status][3]][4]

HTTP handler for serving browserify bundles

## Example

```js
var http = require("http")
var path = require("path")
// Simple http router
var Router = require("routes-router")
// Simple static file server
var ecstatic = require("ecstatic")

var ServeBrowserify = require("serve-browserify")

var router = Router()

// ServeBrowserify(opts) returns a http handler
// to server browserified bundles. The suggestion is to
// server /browserify/foo as /browser/foo/index.js or
// /browserify/bar as /browser/bar.js
// also /browserify/x/y as /browser/x/y.js
router.addRoute("/browserify/*", ServeBrowserify({
    root: path.join(__dirname, "browser"),
    base: "/browserify"
}))
// static server to serve html page for example
router.addRoute("/", ecstatic({
    root: path.join(__dirname, "static"),
    autoIndex: true
}))

var server = http.createServer(router)

server.listen(9024, function () {
    console.log("demo server listening on port 9024")
})
```

## Documentation

### `ServeJavascript(opts?)`

```ocaml
type RequestHandler := (req: HttpRequest, res: HttpResponse)

serve-browserify := ({
    root: String,
    base: String?,
    cache: Boolean?,
    gzip: Boolean?,
    cacheControl: String?,
    debug: Boolean?
}) => RequestHandler
```

ServeJavascript returns a function when given a root and opts will
    serve javascript files through browserify

Valid options are:

 - root: The root folder location where it should look for
    javascript files to browserify & serve
 - base: The base HTTP path where you are serving your assets
    from. This is only needed if you want to serve nested files
 - cache: This will cache if enabled, which means every location
    browserify bundle get's cached after initial compilation.
    This also enables ETag's & HTTP caching
 - gzip: This will enable gzipping the bundle and sending it
    as gzip'd encoded data to browsers if their accept-encoding
    matches
 - cacheControl: This is a string you can set for the cache
    control header. It defaults to 'max-age=300, must-revalidate'
 - debug: This is an option passed to browserify, when debug is
    set, browserify will embed source maps. Disable this in
    production to decrease file size

## Cli

See `serve-browserify --help`

## Installation

`npm install serve-browserify`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Raynos/serve-browserify.png
  [2]: https://travis-ci.org/Raynos/serve-browserify
  [3]: https://david-dm.org/Raynos/serve-browserify.png
  [4]: https://david-dm.org/Raynos/serve-browserify
  [5]: https://ci.testling.com/Raynos/serve-browserify.png
  [6]: https://ci.testling.com/Raynos/serve-browserify
