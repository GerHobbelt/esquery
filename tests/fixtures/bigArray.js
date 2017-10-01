var esprima = require("esprima");


module.exports = esprima.parse(
    '[1, 2, 3, foo, bar, 4, 5, baz, qux, 6]'
);
