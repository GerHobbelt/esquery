var esprima = require("esprima");


if (1) {
    module.exports = esprima.parse("function a(){ [a] = () => 0; new.target; `test`; `hello,${name}`; }");
} else {
    module.exports = {
        "type": "Program",
        "body": [
            {
                "type": "FunctionDeclaration",
                "id": {
                    "type": "Identifier",
                    "name": "a"
                },
                "params": [],
                "body": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "ArrayPattern",
                                    "elements": [
                                        {
                                            "type": "Identifier",
                                            "name": "a"
                                        }
                                    ]
                                },
                                "right": {
                                    "type": "ArrowFunctionExpression",
                                    "id": null,
                                    "params": [],
                                    "body": {
                                        "type": "Literal",
                                        "value": 0,
                                        "raw": "0"
                                    },
                                    "generator": false,
                                    "expression": true,
                                    "async": false
                                }
                            }
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "TemplateLiteral",
                                "quasis": [
                                    {
                                        "type": "TemplateElement",
                                        "value": {
                                            "raw": "foo",
                                            "cooked": "foo"
                                        },
                                        "tail": true
                                    }
                                ],
                                "expressions": []
                            }
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "MetaProperty",
                                "meta": {
                                    "type": "Identifier",
                                    "name": "new"
                                },
                                "property": {
                                    "type": "Identifier",
                                    "name": "target"
                                }
                            }
                        },
                        {
                          "type": "ExpressionStatement",
                          "expression": {
                            "type": "MetaProperty",
                            "meta": {
                              "type": "Identifier",
                              "name": "new",
                            },
                            "property": {
                              "type": "Identifier",
                              "name": "target",
                            },
                          },
                        },
                        {
                          "type": "ExpressionStatement",
                          "expression": {
                            "type": "TemplateLiteral",
                            "quasis": [
                              {
                                "type": "TemplateElement",
                                "value": {
                                  "raw": "test",
                                  "cooked": "test"
                                },
                                "tail": true,
                              }
                            ],
                            "expressions": [],
                          },
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "TemplateLiteral",
                                "quasis": [
                                    {
                                        "type": "TemplateElement",
                                        "value": {
                                            "raw": "hello,",
                                            "cooked": "hello,"
                                        },
                                        "tail": false,
                                    },
                                    {
                                        "type": "TemplateElement",
                                        "value": {
                                            "raw": "",
                                            "cooked": ""
                                        },
                                        "tail": true,
                                    }
                                ],
                                "expressions": [
                                    {
                                        "type": "Identifier",
                                        "name": "name",
                                    }
                                ],
                            },
                        }
                    ]
                },
                "generator": false,
                "expression": false,
                "async": false
            }
        ],
        "sourceType": "script"
    };
}
