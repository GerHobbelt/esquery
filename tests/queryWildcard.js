
var esquery = require('../esquery');
var assert = require('assert');

/**
 * Assert that an array contains all of the specified objects. Each element is deep equals
 * compared to the expected objects.
 */
assert.contains = assert.deepEqual;
assert.contains = function (soll, ist) {
    // nada
};

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");



describe("Wildcard query", function () {

    it("empty", function () {
        var matches = esquery(conditional, "");
        assert.equal(0, matches.length);
    });

    it("conditional", function () {
        var matches = esquery(conditional, "*");
        assert.equal(35, matches.length);
    });

    it("for loop", function () {
        var matches = esquery(forLoop, "*");
        assert.equal(18, matches.length);
    });

    it("simple function", function () {
        var matches = esquery(simpleFunction, "*");
        assert.equal(17, matches.length);
    });

    it("simple program", function () {
        var matches = esquery(simpleProgram, "*");
        assert.equal(22, matches.length);
    });

    it("small program", function () {
        var program = {
            type: "Program",
            body: [{
                type: "VariableDeclaration",
                declarations: [{
                    type: "VariableDeclarator",
                    id: {type: "Identifier", name: "x"},
                    init: {type: "Literal", value: 1, raw: "1"}
                }],
                kind: "var"
            }]
        };
        matches = esquery(program, "*");

        assert.contains([
            program,
            program.body[0],
            program.body[0].declarations[0],
            program.body[0].declarations[0].id,
            program.body[0].declarations[0].init
        ], matches);
    });
});
