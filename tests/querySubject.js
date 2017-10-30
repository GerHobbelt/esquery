
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");
var nestedFunctions = require("./fixtures/nestedFunctions");
var bigArray = require("./fixtures/bigArray");



describe("Query subject", function () {

    it("type subject", function () {
        var matches = esquery(conditional, "!IfStatement Identifier");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ], matches);
    });

    it("* subject", function () {
        var matches = esquery(forLoop, '!* > [name="foo"]');
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            forLoop.body[0].test.right,
            forLoop.body[0].body.body[0].expression.callee,
        ], matches);
    });

    it(":nth-child subject", function () {
        var matches = esquery(simpleFunction, '!:nth-child(1) [name="y"]');
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            simpleFunction.body[0],
            simpleFunction.body[0].body.body[0],
            simpleFunction.body[0].body.body[0].declarations[0],
        ], matches);
    });

    it(":nth-last-child subject", function () {
        var matches = esquery(simpleProgram, '!:nth-last-child(1) [name="y"]');
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            simpleProgram.body[1].declarations[0],
            simpleProgram.body[3],
            simpleProgram.body[3].consequent.body[0],
        ], matches);
    });

    it("attribute literal subject", function () {
        var matches = esquery(simpleProgram, '![test] [name="y"]');
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            simpleProgram.body[3]
        ], matches);
    });

    it("attribute type subject", function () {
        var matches = esquery(nestedFunctions, '![generator=type(boolean)] > BlockStatement');
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            nestedFunctions.body[0],
            nestedFunctions.body[0].body.body[1]
        ], matches);
    });

    it("attribute regexp subject", function () {
        var matches = esquery(conditional, '![operator=/=+/] > [name="x"]');
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            conditional.body[0].test,
            conditional.body[0].alternate.body[0].expression,
            conditional.body[1].test.left.left
        ], matches);
    });

    it("field subject", function () {
        var matches = esquery(forLoop, '!.test');
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0].test
        ], matches);
    });

    it(":matches subject", function () {
        var matches = esquery(forLoop, '!:matches(*) > [name="foo"]');
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            forLoop.body[0].test.right,
            forLoop.body[0].body.body[0].expression.callee,
        ], matches);
    });

    it(":not subject", function () {
        var matches = esquery(nestedFunctions, '!:not(BlockStatement) > [name="foo"]');
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            nestedFunctions.body[0],
        ], matches);
    });

    it("compound attributes subject", function () {
        var matches = esquery(conditional, '![left.name="x"][right.value=1]');
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            conditional.body[0].test
        ], matches);
    });

    it("decendent right subject", function () {
        var matches = esquery(forLoop, '* !AssignmentExpression');
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0].init
        ], matches);
    });

    it("child right subject", function () {
        var matches = esquery(forLoop, '* > !AssignmentExpression');
        assert.strictEqual(1, matches.length);
        assert.deepEqual([
            forLoop.body[0].init
        ], matches);
    });

    it("sibling left subject", function () {
        var matches = esquery(simpleProgram, "!VariableDeclaration ~ IfStatement");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            simpleProgram.body[0],
            simpleProgram.body[1]
        ], matches);
    });

    it("sibling right subject", function () {
        var matches = esquery(simpleProgram, "!VariableDeclaration ~ !IfStatement");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            simpleProgram.body[0],
            simpleProgram.body[1],
            simpleProgram.body[3]
        ], matches);
    });

    it("adjacent right subject", function () {
        var matches = esquery(simpleProgram, "!VariableDeclaration + !ExpressionStatement");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            simpleProgram.body[1],
            simpleProgram.body[2]
        ], matches);
    });

    it("multiple adjacent siblings", function () {
        var matches = esquery(bigArray, "Identifier + Identifier");
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            bigArray.body[0].expression.elements[4],
            bigArray.body[0].expression.elements[8]
        ], matches);
    });

    it("multiple siblings", function () {
        var matches = esquery(bigArray, "Identifier ~ Identifier");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            bigArray.body[0].expression.elements[4],
            bigArray.body[0].expression.elements[7],
            bigArray.body[0].expression.elements[8]
        ], matches);
    });

    it("nested descendant subject", function () {
        var matches = esquery(nestedFunctions, "!:function :function AssignmentExpression");
        assert.strictEqual(1, matches.length);
        assert.deepEqual([ 
            nestedFunctions.body[0] 
        ], matches);
    });
});
