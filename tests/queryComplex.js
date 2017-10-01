
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");
var nestedFunctions = require("./fixtures/nestedFunctions");



describe("Complex selector query", function () {

    it("two types child", function () {
        var matches = esquery(conditional, "IfStatement > BinaryExpression");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("two types child (shorthand)", function () {
        var matches = esquery(conditional, "@If > @Binary");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("three types child", function () {
        var matches = esquery(conditional, "IfStatement > BinaryExpression > Identifier");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[0].test.left
        ], matches);
    });

    it("three types child (shorthand)", function () {
        var matches = esquery(conditional, "@If > @Binary > @Id");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[0].test.left
        ], matches);
    });

    it("two types descendant", function () {
        var matches = esquery(conditional, "IfStatement BinaryExpression");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            conditional.body[0].test,
            conditional.body[1].test.left.left,
        ], matches);
    });

    it("two types descendant (shorthand)", function () {
        var matches = esquery(conditional, "@If @Binary");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            conditional.body[0].test,
            conditional.body[1].test.left.left,
        ], matches);
    });

    it("two types sibling", function () {
        var matches = esquery(simpleProgram, "VariableDeclaration ~ IfStatement");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleProgram.body[3]
        ], matches);
    });

    it("two types sibling (shorthand)", function () {
        var matches = esquery(simpleProgram, "@Var ~ @If");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleProgram.body[3]
        ], matches);
    });

    it("two types adjacent", function () {
        var matches = esquery(simpleProgram, "VariableDeclaration + ExpressionStatement");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleProgram.body[2]
        ], matches);
    });

    it("two types adjacent (shorthand)", function () {
        var matches = esquery(simpleProgram, "@Var + @Expr");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleProgram.body[2]
        ], matches);
    });
});
