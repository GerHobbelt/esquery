/* vim: set sw=4 sts=4 : */
(function () {

    var estraverse = require('estraverse');
    var parser = require('./parser');

    var isArray = Array.isArray || function isArray(array) {
        return {}.toString.call(array) === '[object Array]';
    };

    var LEFT_SIDE = {};
    var RIGHT_SIDE = {};

    function esqueryModule() {

        /**
         * Convert shorthand notation in the selector.
         * 
         * @param  {string} selector 
         * @return {string} 
         */
        function translateInput(selector) {
            selector = selector.replace(/@Yield\w*\b/, 'YieldExpression');
            selector = selector.replace(/@With\w*\b/, 'WithStatement');
            selector = selector.replace(/@While\w*\b/, 'WhileStatement');
            selector = selector.replace(/@Var\w*\b/, 'VariableDeclaration');
            selector = selector.replace(/@UnaryOp\w*\b/, 'UnaryOperator');
            selector = selector.replace(/@Unary\w*\b/, 'UnaryExpression');
            selector = selector.replace(/@Try\w*\b/, 'TryStatement');
            selector = selector.replace(/@Throw\w*\b/, 'ThrowStatement');
            selector = selector.replace(/@This\w*\b/, 'ThisExpression');
            selector = selector.replace(/@Switch\w*\b/, 'SwitchStatement');
            selector = selector.replace(/@Seq\w*\b/, 'SequenceExpression');
            selector = selector.replace(/@Return\w*\b/, 'ReturnStatement');
            selector = selector.replace(/@Object\w*\b/, 'ObjectExpression');
            selector = selector.replace(/@New\w*\b/, 'NewExpression');
            selector = selector.replace(/@Member\w*\b/, 'MemberExpression');
            selector = selector.replace(/@LogicalOp\w*\b/, 'LogicalOperator');
            selector = selector.replace(/@Logical\w*\b/, 'LogicalExpression');
            selector = selector.replace(/@Let\w*\b/, 'LetStatement');
            selector = selector.replace(/@Labeled\w*\b/, 'LabeledStatement');
            selector = selector.replace(/@If\w*\b/, 'IfStatement');
            selector = selector.replace(/@Id\w*\b/, 'Identifier');
            selector = selector.replace(/@Gen\w*\b/, 'GeneratorExpression');
            selector = selector.replace(/@FunctionDecl\w*\b/, 'FunctionDeclaration');
            selector = selector.replace(/@FunDecl\w*\b/, 'FunctionDeclaration');
            selector = selector.replace(/@Fun\w*\b/, 'FunctionExpression');
            selector = selector.replace(/@ForOf\w*\b/, 'ForOfStatement');
            selector = selector.replace(/@ForIn\w*\b/, 'ForInStatement');
            selector = selector.replace(/@For\w*\b/, 'ForStatement');
            selector = selector.replace(/@Expr\w*\b/, 'ExpressionStatement');
            selector = selector.replace(/@Empty\w*\b/, 'EmptyStatement');
            selector = selector.replace(/@DoWhile\w*\b/, 'DoWhileStatement');
            selector = selector.replace(/@Cont\w*\b/, 'ContinueStatement');
            selector = selector.replace(/@Cond\w*\b/, 'ConditionalExpression');
            selector = selector.replace(/@Call\w*\b/, 'CallExpression');
            selector = selector.replace(/@Break\w*\b/, 'BreakStatement');
            selector = selector.replace(/@Block\w*\b/, 'BlockStatement');
            selector = selector.replace(/@BinaryOp\w*\b/, 'BinaryOperator');
            selector = selector.replace(/@BinOp\w*\b/, 'BinaryOperator');
            selector = selector.replace(/@BinExp\w*\b/, 'BinaryExpression');
            selector = selector.replace(/@Bin\w*\b/, 'BinaryExpression');
            selector = selector.replace(/@AssignOp\w*\b/, 'AssignmentOperator');
            selector = selector.replace(/@Assign\w*\b/, 'AssignmentExpression');
            selector = selector.replace(/@Arrow\w*\b/, 'ArrowExpression');
            selector = selector.replace(/@Array\w*\b/, 'ArrayExpression');

            return selector;
        }

        /**
         * Get the value of a property which may be multiple levels down in the object.
         */
        function getPath(obj, key) {
            var i, keys = key.split(".");
            for (i = 0; i < keys.length; i++) {
                if (obj == null) { return obj; }
                obj = obj[keys[i]];
            }
            return obj;
        }

        /**
         * Determine whether `node` can be reached by following `path`, starting at `ancestor`.
         */
        function inPath(node, ancestor, path) {
            var field, remainingPath, i;
            if (path.length === 0) { return node === ancestor; }
            if (ancestor == null) { return false; }
            field = ancestor[path[0]];
            remainingPath = path.slice(1);
            if (isArray(field)) {
                for (i = 0, l = field.length; i < l; ++i) {
                    if (inPath(node, field[i], remainingPath)) { return true; }
                }
                return false;
            } else {
                return inPath(node, field, remainingPath);
            }
        }

        /**
         * Given a `node` and its ancestors, determine if `node` is matched by `selector`.
         */
        function matches(node, selector, ancestry) {
            var path, ancestor, i, l, p;
            if (!selector) { return true; }
            if (!node) { return false; }
            if (!ancestry) { ancestry = []; }

            switch (selector.type) {
                case 'wildcard':
                    return true;

                case 'identifier':
                    return selector.value.toLowerCase() === node.type.toLowerCase();

                case 'field':
                    path = selector.name.split('.');
                    ancestor = ancestry[path.length - 1];
                    return inPath(node, ancestor, path);

                case 'matches':
                    for (i = 0, l = selector.selectors.length; i < l; ++i) {
                        if (matches(node, selector.selectors[i], ancestry)) { return true; }
                    }
                    return false;

                case 'compound':
                    for (i = 0, l = selector.selectors.length; i < l; ++i) {
                        if (!matches(node, selector.selectors[i], ancestry)) { return false; }
                    }
                    return true;

                case 'not':
                    for (i = 0, l = selector.selectors.length; i < l; ++i) {
                        if (matches(node, selector.selectors[i], ancestry)) { return false; }
                    }
                    return true;

                case 'has':
                    var a, collector = [];
                    for (i = 0, l = selector.selectors.length; i < l; ++i) {
                      a = [];
                      estraverse.traverse(node, {
                          enter: function (node, parent) {
                              if (parent != null) { a.unshift(parent); }
                              if (matches(node, selector.selectors[i], a)) {
                                collector.push(node);
                              }
                          },
                          leave: function () { a.shift(); }
                      });
                    }
                    return collector.length !== 0;

                case 'child':
                    if (matches(node, selector.right, ancestry)) {
                        return matches(ancestry[0], selector.left, ancestry.slice(1));
                    }
                    return false;

                case 'descendant':
                    if (matches(node, selector.right, ancestry)) {
                        for (i = 0, l = ancestry.length; i < l; ++i) {
                            if (matches(ancestry[i], selector.left, ancestry.slice(i + 1))) {
                                return true;
                            }
                        }
                    }
                    return false;

                case 'attribute':
                    p = getPath(node, selector.name);
                    switch (selector.operator) {
                        case null:
                        case void 0:
                            return p != null;
                        case '=':
                            switch (selector.value.type) {
                                case 'regexp': return p != null && selector.value.value.test(p);
                                case 'literal': return p != null && '' + selector.value.value === '' + p;
                                case 'type': return p != null && selector.value.value === typeof p;
                            }
                        case '!=':
                            switch (selector.value.type) {
                                case 'regexp': return p != null && !selector.value.value.test(p);
                                case 'literal': return p != null && '' + selector.value.value !== '' + p;
                                case 'type': return p != null && selector.value.value !== typeof p;
                            }
                        case '<=': return p != null && p <= selector.value.value;
                        case '<': return p != null && p < selector.value.value;
                        case '>': return p != null && p > selector.value.value;
                        case '>=': return p != null && p >= selector.value.value;
                    }

                case 'sibling':
                    return matches(node, selector.right, ancestry) &&
                        sibling(node, selector.left, ancestry, LEFT_SIDE) ||
                        selector.left && selector.left.subject &&
                        matches(node, selector.left, ancestry) &&
                        sibling(node, selector.right, ancestry, RIGHT_SIDE);

                case 'adjacent':
                    return matches(node, selector.right, ancestry) &&
                        adjacent(node, selector.left, ancestry, LEFT_SIDE) ||
                        selector.right && selector.right.subject &&
                        matches(node, selector.left, ancestry) &&
                        adjacent(node, selector.right, ancestry, RIGHT_SIDE);

                case 'nth-child':
                    return matches(node, selector.right, ancestry) &&
                        nthChild(node, ancestry, function (length) {
                            return selector.index.value - 1;
                        });

                case 'nth-last-child':
                    return matches(node, selector.right, ancestry) &&
                        nthChild(node, ancestry, function (length) {
                            return length - selector.index.value;
                        });

                case 'class':
                    if (!node.type) return false;
                    switch (selector.name.toLowerCase()) {
                        case 'statement':
                            if (node.type.slice(-9) === 'Statement') return true;
                            // fallthrough: interface Declaration <: Statement { }
                        case 'declaration':
                            return node.type.slice(-11) === 'Declaration';
                        case 'pattern':
                            if (node.type.slice(-7) === 'Pattern') return true;
                            // fallthrough: interface Expression <: Node, Pattern { }
                        case 'expression':
                            return node.type.slice(-10) === 'Expression' ||
                                node.type.slice(-7) === 'Literal' ||
                                (
                                    node.type === 'Identifier' &&
                                    (ancestry.length === 0 || ancestry[0].type !== 'MetaProperty')
                                ) ||
                                node.type === 'MetaProperty';
                        case 'function':
                            return node.type === 'FunctionDeclaration' ||
                                node.type === 'FunctionExpression' ||
                                node.type === 'ArrowFunctionExpression';
                    }
                    throw new Error('Unknown class name: ' + selector.name);
            }

            throw new Error('Unknown selector type: ' + selector.type);
        }

        /*
         * Determines if the given node has a sibling that matches the given selector.
         */
        function sibling(node, selector, ancestry, side) {
            var parent = ancestry[0], listProp, startIndex, keys, i, l, k, lowerBound, upperBound;
            if (!parent) { return false; }
            if (!selector) { return false; }
            keys = estraverse.VisitorKeys[parent.type];
            for (i = 0, l = keys.length; i < l; ++i) {
                listProp = parent[keys[i]];
                if (isArray(listProp)) {
                    startIndex = listProp.indexOf(node);
                    if (startIndex < 0) { continue; }
                    if (side === LEFT_SIDE) {
                      lowerBound = 0;
                      upperBound = startIndex;
                    } else {
                      lowerBound = startIndex + 1;
                      upperBound = listProp.length;
                    }
                    for (k = lowerBound; k < upperBound; ++k) {
                        if (matches(listProp[k], selector, ancestry)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        /*
         * Determines if the given node has an asjacent sibling that matches the given selector.
         */
        function adjacent(node, selector, ancestry, side) {
            var parent = ancestry[0], listProp, keys, i, l, idx;
            if (!parent) { return false; }
            if (!selector) { return false; }
            keys = estraverse.VisitorKeys[parent.type];
            if (!keys) { return false; }
            for (i = 0, l = keys.length; i < l; ++i) {
                listProp = parent[keys[i]];
                if (isArray(listProp)) {
                    idx = listProp.indexOf(node);
                    if (idx < 0) { continue; }
                    if (side === LEFT_SIDE && idx > 0 && matches(listProp[idx - 1], selector, ancestry)) {
                        return true;
                    }
                    if (side === RIGHT_SIDE && idx < listProp.length - 1 && matches(listProp[idx + 1], selector, ancestry)) {
                        return true;
                    }
                }
            }
            return false;
        }

        /*
         * Determines if the given node is the nth child, determined by idxFn, which is given the containing list's length.
         */
        function nthChild(node, ancestry, idxFn) {
            var parent = ancestry[0], listProp, keys, i, l, idx;
            if (!parent) { return false; }
            keys = estraverse.VisitorKeys[parent.type];
            for (i = 0, l = keys.length; i < l; ++i) {
                listProp = parent[keys[i]];
                if (isArray(listProp)) {
                    idx = listProp.indexOf(node);
                    if (idx >= 0 && idx === idxFn(listProp.length)) { return true; }
                }
            }
            return false;
        }

        /*
         * For each selector node marked as a subject, find the portion of the selector that the subject must match.
         */
        function subjects(selector, ancestor) {
            var results, p;
            if (selector == null || typeof selector !== 'object') { return []; }
            if (ancestor == null) { ancestor = selector; }
            results = selector.subject ? [ancestor] : [];
            for(p in selector) {
                if (!{}.hasOwnProperty.call(selector, p)) { continue; }
                [].push.apply(results, subjects(selector[p], p === 'left' ? selector[p] : ancestor));
            }
            return results;
        }

        /**
         * Check if given node already exists in array.
         */
        function isAlreadyPresent(array, node) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] === node) {
                    return true;
                }
            }
            return false;
        }

        /**
         * From a JS AST and a selector AST, collect all JS AST nodes that match the selector.
         */
        function match(ast, selector) {
            var ancestry = [], results = [], altSubjects, i, l, k, m;
            if (!selector) { return results; }
            altSubjects = subjects(selector);
            estraverse.traverse(ast, {
                enter: function (node, parent) {
                    if (parent != null) { ancestry.unshift(parent); }
                    if (matches(node, selector, ancestry)) {
                        if (altSubjects.length) {
                            for (i = 0, l = altSubjects.length; i < l; ++i) {
                                if (matches(node, altSubjects[i], ancestry)) { 
                                    if (!isAlreadyPresent(results, node)) {
                                        results.push(node); 
                                    }
                                }
                                for (k = 0, m = ancestry.length; k < m; ++k) {
                                    if (matches(ancestry[k], altSubjects[i], ancestry.slice(k + 1))) {
                                        if (!isAlreadyPresent(results, ancestry[k])) {
                                            results.push(ancestry[k]);
                                        }
                                    }
                                }
                            }
                        } else {
                            results.push(node);
                        }
                    }
                },
                leave: function () { 
                    ancestry.shift(); 
                }
            });
            return results;
        }

        /**
         * Parse a selector string and return its AST.
         */
        function parse(selector) {
            selector = translateInput(selector);

            return parser.parse(selector);
        }

        /**
         * Query the code AST using the selector string.
         */
        function query(ast, selector) {
            return match(ast, parse(selector));
        }

        query.parse = parse;
        query.match = match;
        query.matches = matches;
        return query.query = query;
    }


    if (typeof define === "function" && define.amd) {
        define(esqueryModule);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = esqueryModule();
    } else {
        this.esquery = esqueryModule();
    }

})();
