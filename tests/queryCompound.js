
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");



describe("Compound query", function () {

    it("two attributes", function () {
        var matches = esquery(conditional, '[left.name="x"][right.value=1]');
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("type and pseudo", function () {
        var matches = esquery(conditional, '[left.name="x"]:matches(*)');
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            conditional.body[0].test,
            conditional.body[0].alternate.body[0].expression,
            conditional.body[1].test.left.left,
        ], matches);
    });
});
