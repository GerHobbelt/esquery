var esprima = require("esprima");


module.exports = esprima.parse(
    "x = 10;\n" +
    "while (x > 0) { x--; }"
);
