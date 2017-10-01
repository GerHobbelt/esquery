
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");



describe("Attribute query", function () {

    it("conditional", function () {
        var matches = esquery(conditional, "[name=\"x\"]");
        assert.strictEqual(4, matches.length);
        assert.deepEqual([
            conditional.body[0].test.left,
            conditional.body[0].alternate.body[0].expression.left,
            conditional.body[1].test.left.left.left,
            conditional.body[1].test.right
        ], matches);

        matches = esquery(conditional, "[callee.name=\"foo\"]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[0].consequent.body[0].expression
        ], matches);

        matches = esquery(conditional, "[operator]");
        assert.strictEqual(8, matches.length);
        assert.deepEqual([
            conditional.body[0].test,
            conditional.body[0].alternate.body[0].expression,
            conditional.body[1].test,
            conditional.body[1].test.left,
            conditional.body[1].test.left.left,
            conditional.body[1].consequent.body[0].expression,
            conditional.body[1].consequent.body[0].expression.right,
            conditional.body[1].alternate.consequent.body[0].expression,
        ], matches);

        matches = esquery(conditional, "[prefix=true]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[1].consequent.body[0].expression.right
        ], matches);
    });

    it("for loop", function () {
        var matches = esquery(forLoop, "[operator=\"=\"]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0].init
        ], matches);

        matches = esquery(forLoop, "[object.name=\"foo\"]");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            forLoop.body[0].test.right,
            forLoop.body[0].body.body[0].expression.callee,
        ], matches);

        matches = esquery(forLoop, "[operator]");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            forLoop.body[0].init,
            forLoop.body[0].test,
            forLoop.body[0].update
        ], matches);
    });

    it("simple function", function () {
        var matches = esquery(simpleFunction, "[kind=\"var\"]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleFunction.body[0].body.body[0]
        ], matches);

        matches = esquery(simpleFunction, "[id.name=\"foo\"]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleFunction.body[0]
        ], matches);

        matches = esquery(simpleFunction, "[left]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleFunction.body[0].body.body[0].declarations[0].init
        ], matches);
    });

    it("simple program", function () {
        var matches = esquery(simpleProgram, "[kind=\"var\"]");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            simpleProgram.body[0],
            simpleProgram.body[1]
        ], matches);

        matches = esquery(simpleProgram, "[id.name=\"y\"]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleProgram.body[1].declarations[0]
        ], matches);

        matches = esquery(simpleProgram, "[body]");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            simpleProgram,
            simpleProgram.body[3].consequent
        ], matches);
    });

    it("conditional regexp", function () {
        var matches = esquery(conditional, "[name=/x|foo/]");
        assert.strictEqual(5, matches.length);
        assert.deepEqual([
            conditional.body[0].test.left,
            conditional.body[0].consequent.body[0].expression.callee,
            conditional.body[0].alternate.body[0].expression.left,
            conditional.body[1].test.left.left.left,
            conditional.body[1].test.right,
        ], matches);
    });

    it("simple function regexp", function () {
        var matches = esquery(simpleFunction, "[name=/x|foo/]");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            simpleFunction.body[0].id,
            simpleFunction.body[0].params[0],
            simpleFunction.body[0].body.body[0].declarations[0].init.left
        ], matches);
    });

    it("simple function numeric", function () {
        var matches = esquery(simpleFunction, "FunctionDeclaration[params.0.name=x]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleFunction.body[0]
        ], matches);
    });

    it("simple program regexp", function () {
        var matches = esquery(simpleProgram, "[name=/[asdfy]/]");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            simpleProgram.body[1].declarations[0].id,
            simpleProgram.body[3].test,
            simpleProgram.body[3].consequent.body[0].expression.left
        ], matches);
    });

    it("for loop regexp", function () {
        var matches = esquery(forLoop, "[name=/i|foo/]");
        assert.strictEqual(6, matches.length);
        assert.deepEqual([
            forLoop.body[0].init.left,
            forLoop.body[0].test.left,
            forLoop.body[0].test.right.object,
            forLoop.body[0].update.argument,
            forLoop.body[0].body.body[0].expression.callee.object,
            forLoop.body[0].body.body[0].expression.callee.property
        ], matches);
    });

    it("not string", function () {
        var matches = esquery(conditional, '[name!="x"]');
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            conditional.body[0].consequent.body[0].expression.callee,
            conditional.body[1].consequent.body[0].expression.left,
            conditional.body[1].alternate.consequent.body[0].expression.left,
        ], matches);
    });

    it("not type", function () {
        var matches = esquery(conditional, '[value!=type(number)]');
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            conditional.body[1].test.left.left.right,
            conditional.body[1].test.left.right,
            conditional.body[1].alternate.test,
        ], matches);
    });

    it("not regexp", function () {
        var matches = esquery(conditional, '[name!=/x|y/]');
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[0].consequent.body[0].expression.callee,
        ], matches);
    });

    it("less than", function () {
        var matches = esquery(conditional, "[body.length<2]");
        assert.strictEqual(4, matches.length);
        assert.deepEqual([
            conditional.body[0].consequent,
            conditional.body[0].alternate,
            conditional.body[1].consequent,
            conditional.body[1].alternate.consequent
        ], matches);
    });

    it("greater than", function () {
        var matches = esquery(conditional, "[body.length>1]");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional
        ], matches);
    });

    it("less than or equal", function () {
        var matches = esquery(conditional, "[body.length<=2]");
        assert.strictEqual(5, matches.length);
        assert.deepEqual([
            conditional,
            conditional.body[0].consequent,
            conditional.body[0].alternate,
            conditional.body[1].consequent,
            conditional.body[1].alternate.consequent
        ], matches);
    });

    it("greater than or equal", function () {
        var matches = esquery(conditional, "[body.length>=1]");
        assert.strictEqual(5, matches.length);
        assert.deepEqual([
            conditional,
            conditional.body[0].consequent,
            conditional.body[0].alternate,
            conditional.body[1].consequent,
            conditional.body[1].alternate.consequent
        ], matches);
    });

    it("attribute type", function () {
        var matches = esquery(conditional, "[test=type(object)]");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ], matches);

        matches = esquery(conditional, "[value=type(boolean)]");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            conditional.body[1].test.left.right,
            conditional.body[1].alternate.test
        ], matches);
    });
});

