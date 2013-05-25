# serve-browserify

<!-- [![build status][1]][2]  -->

[![dependency status][3]][4]

<!-- [![browser support][5]][6] -->

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

// ServeBrowserify(rootFolder) returns a http handler
// to server browserified bundles. The suggestion is to
// server /browserify/foo as /browser/foo/index.js or
// /browserify/bar as /browser/bar.js
router.addRoute("/browserify/:appName",
    ServeBrowserify(path.join(__dirname, "browser")))
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
