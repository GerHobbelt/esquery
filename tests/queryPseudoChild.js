
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");



describe("Pseudo *-child query", function () {

    it("conditional first child", function () {
        var matches = esquery(conditional, ":first-child");
        assert.deepEqual([
            conditional.body[0],
            conditional.body[0].consequent.body[0],
            conditional.body[0].alternate.body[0],
            conditional.body[1].consequent.body[0],
            conditional.body[1].alternate.consequent.body[0]
        ], matches);
    });

    it("conditional last child", function () {
        var matches = esquery(conditional, ":last-child");
        assert.deepEqual([
            conditional.body[1],
            conditional.body[0].consequent.body[0],
            conditional.body[0].alternate.body[0],
            conditional.body[1].consequent.body[0],
            conditional.body[1].alternate.consequent.body[0]
        ], matches);
    });

    it("conditional nth child", function () {
        var matches = esquery(conditional, ":nth-child(2)");
        assert.deepEqual([
            conditional.body[1]
        ], matches);

        matches = esquery(conditional, ":nth-last-child(2)");
        assert.deepEqual([
            conditional.body[0]
        ], matches);
    });

    it("for loop first child", function () {
        var matches = esquery(forLoop, ":first-child");
        assert.deepEqual([
            forLoop.body[0],
            forLoop.body[0].body.body[0]
        ], matches);
    });

    it("for loop last child", function () {
        var matches = esquery(forLoop, ":last-child");
        assert.deepEqual([
            forLoop.body[0],
            forLoop.body[0].body.body[0]
        ], matches);
    });

    it("for loop nth child", function () {
        var matches = esquery(forLoop, ":nth-last-child(1)");
        assert.deepEqual([
            forLoop.body[0],
            forLoop.body[0].body.body[0]
        ], matches);
    });

    it("simple function first child", function () {
        var matches = esquery(simpleFunction, ":first-child");
        assert.deepEqual([
            simpleFunction.body[0],
            simpleFunction.body[0].params[0],
            simpleFunction.body[0].body.body[0],
            simpleFunction.body[0].body.body[0].declarations[0]
        ], matches);
    });

    it("simple function last child", function () {
        var matches = esquery(simpleFunction, ":last-child");
        assert.deepEqual([
            simpleFunction.body[0],
            simpleFunction.body[0].params[1],
            simpleFunction.body[0].body.body[2],
            simpleFunction.body[0].body.body[0].declarations[0]
        ], matches);
    });

    it("simple function nth child", function () {
        var matches = esquery(simpleFunction, ":nth-child(2)");
        assert.deepEqual([
            simpleFunction.body[0].params[1],
            simpleFunction.body[0].body.body[1]
        ], matches);

        matches = esquery(simpleFunction, ":nth-child(3)");
        assert.deepEqual([
            simpleFunction.body[0].body.body[2]
        ], matches);

        matches = esquery(simpleFunction, ":nth-last-child(2)");
        assert.deepEqual([
            simpleFunction.body[0].params[0],
            simpleFunction.body[0].body.body[1]
        ], matches);
    });

    it("simple program first child", function () {
        var matches = esquery(simpleProgram, ":first-child");
        assert.deepEqual([
            simpleProgram.body[0],
            simpleProgram.body[0].declarations[0],
            simpleProgram.body[1].declarations[0],
            simpleProgram.body[3].consequent.body[0]
        ], matches);
    });

    it("simple program last child", function () {
        var matches = esquery(simpleProgram, ":last-child");
        assert.deepEqual([
            simpleProgram.body[3],
            simpleProgram.body[0].declarations[0],
            simpleProgram.body[1].declarations[0],
            simpleProgram.body[3].consequent.body[0]
        ], matches);
    });

    it("simple program nth child", function () {
        var matches = esquery(simpleProgram, ":nth-child(2)");
        assert.deepEqual([
            simpleProgram.body[1]
        ], matches);

        matches = esquery(simpleProgram, ":nth-child(3)");
        assert.deepEqual([
            simpleProgram.body[2]
        ], matches);

        matches = esquery(simpleProgram, ":nth-last-child(2)");
        assert.deepEqual([
            simpleProgram.body[2]
        ], matches);
    });
});
