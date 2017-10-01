
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");



describe("Compound query", function () {

    it("two attributes", function () {
        var matches = esquery(conditional, '[left.name="x"][right.value=1]');
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("type and pseudo", function () {
        var matches = esquery(conditional, '[left.name="x"]:matches(*)');
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });
});
