var esprima = require("esprima");


module.exports = esprima.parse(
    "function foo(x, y) {\n" +
    "  var z = x + y;\n" +
    "  z++;\n" +
    "  return z;\n" +
    "}\n"
);
