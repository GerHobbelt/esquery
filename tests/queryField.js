
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");



describe("Field query", function () {

    it("single field", function () {
        var matches = esquery(conditional, ".test");
        assert.deepEqual([
            conditional.body[0].test,
            conditional.body[1].test,
            conditional.body[1].alternate.test
        ], matches);
    });

    it("field sequence", function () {
        var matches = esquery(simpleProgram, ".declarations.init");
        assert.deepEqual([
            simpleProgram.body[0].declarations[0].init,
            simpleProgram.body[1].declarations[0].init
        ], matches);
    });
});
