
var esquery = require('../esquery');
var assert = require('assert');

var ast = require("./fixtures/allClasses");



describe("Class query", function () {

    it(":statement", function () {
        var matches = esquery(ast, ":statement");
        assert.deepEqual([
          ast.body[0],
          ast.body[0].body,
          ast.body[0].body.body[0],
          ast.body[0].body.body[1],
          ast.body[0].body.body[2],
          ast.body[0].body.body[3]
        ], matches);
        assert.strictEqual(6, matches.length);
    });

    it(":expression", function () {
        var matches = esquery(ast, ":Expression");
        assert.deepEqual([
          ast.body[0].id,
          ast.body[0].body.body[0].expression,
          ast.body[0].body.body[0].expression.left.elements[0],
          ast.body[0].body.body[0].expression.right,
          ast.body[0].body.body[0].expression.right.body,
          ast.body[0].body.body[1].expression,
          ast.body[0].body.body[2].expression,
          ast.body[0].body.body[3].expression,
          ast.body[0].body.body[3].expression.expressions[0]
        ], matches);
        assert.strictEqual(9, matches.length);
    });

    it(":function", function () {
        var matches = esquery(ast, ":FUNCTION");
        assert.deepEqual([
          ast.body[0],
          ast.body[0].body.body[0].expression.right
        ], matches);
        assert.strictEqual(2, matches.length);
    });

    it(":declaration", function () {
        var matches = esquery(ast, ":declaratioN");
        assert.deepEqual([
          ast.body[0]
        ], matches);
        assert.strictEqual(1, matches.length);
    });

    it(":pattern", function () {
        var matches = esquery(ast, ":paTTern");
        assert.deepEqual([
          ast.body[0].id,
          ast.body[0].body.body[0].expression,
          ast.body[0].body.body[0].expression.left,
          ast.body[0].body.body[0].expression.left.elements[0],
          ast.body[0].body.body[0].expression.right,
          ast.body[0].body.body[0].expression.right.body,
          ast.body[0].body.body[1].expression,
          ast.body[0].body.body[2].expression,
          ast.body[0].body.body[3].expression,
          ast.body[0].body.body[3].expression.expressions[0]
        ], matches);
        assert.strictEqual(10, matches.length);
    });

});

