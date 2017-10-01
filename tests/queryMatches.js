
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
var forLoop = require("./fixtures/forLoop");
var simpleFunction = require("./fixtures/simpleFunction");
var simpleProgram = require("./fixtures/simpleProgram");



describe("Pseudo matches query", function () {

    it("conditional matches", function () {
        var matches = esquery(conditional, ":matches(IfStatement)");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate,
        ], matches);
    });

    it("for loop matches", function () {
        var matches = esquery(forLoop, ":matches(BinaryExpression, MemberExpression)");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            forLoop.body[0].test,
            forLoop.body[0].test.right,
            forLoop.body[0].body.body[0].expression.callee
        ], matches);
    });

    it("simple function matches", function () {
        var matches = esquery(simpleFunction, ':matches([name="foo"], ReturnStatement)');
        assert.strictEqual(2, matches.length);
        assert.deepEqual([
            simpleFunction.body[0].id,
            simpleFunction.body[0].body.body[2]
        ], matches);
    });

    it("simple program matches", function () {
        var matches = esquery(simpleProgram, ":matches(AssignmentExpression, BinaryExpression)");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            simpleProgram.body[2].expression,
            simpleProgram.body[2].expression.right,
            simpleProgram.body[3].consequent.body[0].expression,
        ], matches);
    });

    it("implicit matches", function () {
        var matches = esquery(simpleProgram, "AssignmentExpression, BinaryExpression, NonExistant");
        assert.strictEqual(3, matches.length);
        assert.deepEqual([
            simpleProgram.body[2].expression,
            simpleProgram.body[2].expression.right,
            simpleProgram.body[3].consequent.body[0].expression,
        ], matches);
    });
});
