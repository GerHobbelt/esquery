
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
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("two types child (shorthand)", function () {
        var matches = esquery(conditional, "@If > @Binary");
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("three types child", function () {
        var matches = esquery(conditional, "IfStatement > BinaryExpression > Identifier");
        assert.deepEqual([
            conditional.body[0].test.left
        ], matches);
    });

    it("three types child (shorthand)", function () {
        var matches = esquery(conditional, "@If > @Binary > @Id");
        assert.deepEqual([
            conditional.body[0].test.left
        ], matches);
    });

    it("two types descendant", function () {
        var matches = esquery(conditional, "IfStatement BinaryExpression");
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("two types descendant (shorthand)", function () {
        var matches = esquery(conditional, "@If @Binary");
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("two types sibling", function () {
        var matches = esquery(simpleProgram, "VariableDeclaration ~ IfStatement");
        assert.deepEqual([
            simpleProgram.body[3]
        ], matches);
    });

    it("two types sibling (shorthand)", function () {
        var matches = esquery(simpleProgram, "@Var ~ @If");
        assert.deepEqual([
            simpleProgram.body[3]
        ], matches);
    });

    it("two types adjacent", function () {
        var matches = esquery(simpleProgram, "VariableDeclaration + ExpressionStatement");
        assert.deepEqual([
            simpleProgram.body[2]
        ], matches);
    });

    it("two types adjacent (shorthand)", function () {
        var matches = esquery(simpleProgram, "@Variable + @Expr");
        assert.deepEqual([
            simpleProgram.body[2]
        ], matches);
    });
});
