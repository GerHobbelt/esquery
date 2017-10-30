
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");



describe("Pseudo matches query", function () {

    it("conditional", function () {
        var matches = esquery(conditional, ":not(Literal)");
        assert.equal(28, matches.length);
    });

    it("for loop", function () {
        var matches = esquery(forLoop, ':not([name="x"])');
        assert.equal(18, matches.length);
    });

    it("simple function", function () {
        var matches = esquery(simpleFunction, ":not(*)");
        assert.equal(0, matches.length);
    });

    it("simple program", function () {
        var matches = esquery(simpleProgram, ":not(Identifier, IfStatement)");
        assert.equal(15, matches.length);
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
        matches = esquery(program, ":not([value=1])");

        assert.strictEqual(4, matches.length);
        assert.deepEqual([
            program,
            program.body[0],
            program.body[0].declarations[0],
            program.body[0].declarations[0].id
        ], matches);
    });
});
