
var esquery = require('../esquery');
var assert = require('assert');

var conditional = require("./fixtures/conditional");
console.log("conditional:", JSON.stringify(conditional, null, 2));


describe("Pseudo matches query", function () {

    it("conditional matches", function () {
        var matches = esquery(conditional, "Program IfStatement");
        assert.deepEqual([
            conditional.body[0],
            conditional.body[1],
            conditional.body[1].alternate
        ], matches);
    });

    it("#8: descendant selector includes ancestor in search", function() {
        var matches = esquery(conditional, "Identifier[name=x]");
        assert.strictEqual(4, matches.length);
        matches = esquery(conditional, "Identifier [name=x]");
        assert.strictEqual(0, matches.length);
        matches = esquery(conditional, "BinaryExpression [name=x]");
        assert.strictEqual(2, matches.length);
        matches = esquery(conditional, "AssignmentExpression [name=x]");
        assert.strictEqual(1, matches.length);
    });

});
