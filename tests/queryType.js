
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");



describe("Type query", function () {

    it("conditional", function () {
        var matches = esquery(conditional, "Program");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional
        ], matches);

        matches = esquery(conditional, "IfStatement");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ], matches);

        matches = esquery(conditional, "LogicalExpression");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            conditional.body[1].test,
            conditional.body[1].test.left
        ], matches);

        matches = esquery(conditional, "ExpressionStatement");
        assert.strictEqual(4, matches.length);
        assert.deepEqual([
            conditional.body[0].consequent.body[0],
            conditional.body[0].alternate.body[0],
            conditional.body[1].consequent.body[0],
            conditional.body[1].alternate.consequent.body[0]
        ], matches);
    });

    it("for loop", function () {
        var matches = esquery(forLoop, "Program");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop
        ], matches);

        matches = esquery(forLoop, "ForStatement");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0]
        ], matches);

        matches = esquery(forLoop, "BinaryExpression");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0].test
        ], matches);
    });

    it("simple function", function () {
        var matches = esquery(simpleFunction, "Program");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleFunction
        ], matches);

        matches = esquery(simpleFunction, "VariableDeclaration");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleFunction.body[0].body.body[0]
        ], matches);

        matches = esquery(simpleFunction, "FunctionDeclaration");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleFunction.body[0]
        ], matches);

        matches = esquery(simpleFunction, "ReturnStatement");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleFunction.body[0].body.body[2]
        ], matches);
    });

    it("simple program", function () {
        var matches = esquery(simpleProgram, "Program");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleProgram
        ], matches);

        matches = esquery(simpleProgram, "VariableDeclaration");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            simpleProgram.body[0],
            simpleProgram.body[1]
        ], matches);

        matches = esquery(simpleProgram, "AssignmentExpression");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            simpleProgram.body[2].expression,
            simpleProgram.body[3].consequent.body[0].expression
        ], matches);

        matches = esquery(simpleProgram, "Identifier");
        assert.strictEqual(6, matches.length);
        assert.deepEqual([
            simpleProgram.body[0].declarations[0].id,
            simpleProgram.body[1].declarations[0].id,
            simpleProgram.body[2].expression.left,
            simpleProgram.body[2].expression.right.left,
            simpleProgram.body[3].test,
            simpleProgram.body[3].consequent.body[0].expression.left
        ], matches);
    });

    it("# type", function () {
        var matches = esquery(forLoop, "#Program");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop
        ], matches);

        matches = esquery(forLoop, "#ForStatement");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0]
        ], matches);

        matches = esquery(forLoop, "#BinaryExpression");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0].test
        ], matches);
    });

    it("case insensitive type", function () {
        var matches = esquery(forLoop, "Program");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop
        ], matches);

        matches = esquery(forLoop, "forStatement");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0]
        ], matches);

        matches = esquery(forLoop, "binaryexpression");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0].test
        ], matches);
    });
});
