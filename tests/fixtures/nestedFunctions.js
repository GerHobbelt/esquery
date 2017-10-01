var esprima = require("esprima");


module.exports = esprima.parse(
    "function foo() {\n" +
    "  var x = 1;\n" +
    "  function bar() {\n" +
    "    x = 2;\n" +
    "  }\n" +
    "}\n"
);
