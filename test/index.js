var test = require("tape")

var serve-browserify = require("../index")

test("serve-browserify is a function", function (assert) {
    assert.equal(typeof serve-browserify, "function")
    assert.end()
})
