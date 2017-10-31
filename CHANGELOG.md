
1.0.1-6 / 2017-10-30
====================

  * correct tests after merge of https://github.com/estools/esquery/pull/61
  * defensive coding / crash prevention: check before looping through the produced value set: the set may be NULL.

1.0.1-5 / 2017-10-30
====================

  * Merge branch 'fix-58-augment'

1.0.1-4 / 2017-10-30
====================

  * defensive coding: DO NOT silently fallthrough when processing unexpected selectors
  * following up on comment https://github.com/jupenur/esquery/commit/f8428503e946107c616b33e09872c7a5ab5686c1#commitcomment-25289848: ? Shouldn't this extra check be more lenient, i.e. read like this:
    ```
    // do not match against NULL and UNDEFINED values,
    // attempt to match against everything else (after coercing to string inside .test())
    case 'regexp': return p != null && selector.value.value.test(p);
    ```
    and apply this logic to all checks as they all suffer from the same "null" / "undefined" string comparison bug.

1.0.1-3 / 2017-10-30
====================

  * updated NPM packages
  * Merge remote-tracking branch 'remotes/jupenur/[#58](https://github.com/GerHobbelt/esquery/issues/58)'
  * Synced with mainline branch 'remotes/estools-original/master'
  * code linting using ESLint + whitespace fixes to make the code pass the lint check.
  * sort the set of supported AST node types in the documentation.
  * update NPM packages
  * Fix: add MetaProperty and TemplateLiteral to :expression class ([#59](https://github.com/GerHobbelt/esquery/issues/59))
    * Fix: add MetaProperty and TemplateLiteral to :expression class
    * Fix: MetaProperty#meta and #property are not matched by :expression
    * Chore: add test for template literal with `${...}`

1.0.1-2 / 2017-10-03
====================

  * correct `npm run pub` publish task

1.0.1-1 / 2017-10-02
====================

  * migrated the test suite to mocha as jstestr is FUBAR
  * Merge remote-tracking branch 'remotes/Qard/has-selector'
  * migrated to PEGjs 0.10.0: now all tests pass for sure.
  * remove debugging console.log() lines.
  * FIXED: The trouble started with PEGjs 0.8.0. From the CHANGELOG: "The ? operator now returns null on unsuccessful match.". PEG grammar action code has been adjusted accordingly (after having found this via screen dump compare between 0.7.0 run and 0.8.0 run; the changelog only helped after the fact in that I can now quote it). All tests pass once again.
  * Reverting to pegjs 0.7.0: **DRAT! ALL TESTS PASS WHEN PARSER IS BUILT WITH PEGJS 0.7.0 BUT FAILS WITH MANY ERRORS WHEN THE EXACT SAME GRAMMAR IS BUILT WITH PEGJS 0.10.0!** So that problem still isn't gone and I have no clue what is going wrong there... it's not *all* the tests that fail so the parser isn't completely botched...  :-S
  * add `make test` build target.
  * one exact check !== instead of != for code cleanliness. Also removed debugging code. **All tests pass.**
  * fix/surprise no. 3: when matching 'subjects', duplicate answers would/could be produced in some test cases. The fix is to check whether a match candidate is already present in the result set or not and only adding it to the result set when it is **not yet**.
  * fix/surprise no. 2: an attribute query which, for example, tests an attribute negatively against a regex such as `[name!=/x|y/]` then esquery would include a *slew* of 'matches': all the objects which **do not have the given attribute**. This is contrary to the *intent* of such a query: the expected set is all the objects which **do** carry said attribute but, in the given example, **do not match the value regex** for it. Without this fix, some attribute tests will produce 20+ results, including quite non-intuitive ones.
  * fix/surprise no. 1:
    - the shorthand regexes weren't very tolerant of the amount of 'tail': the shortest allowed may, for example, be `@Var` but we should also accept longer unambiguous shorthand, such as `@Varia` or `@Variable`. I know I stripped the original regexes to simplify them but one of the tests in tests/queryComplex.js failed due to this, after which the shorthand regexes got overhauled.
    - also note that the shorthand regexes are now sorted in reverse order so that longer shorthand regexes match before the shorter ones which would otherwise gobble the input, compare for instance `@UnaryOp` vs `@Unary`.
    - sorting the regexes in reverse order also popped up a duplicate line, which has been removed.
    The first bug is probably mine, the second probably as well (though I expect a mix of 'us' and 'them' there ;-) ), the third is definitely original.
    Tests have been added to verify the proper operation of this 'expandable shorthand behaviour' now.
  * fix: jstestr::assert.contains() !== node::assert.deepEqual() so we have to be more precise and **exactly** specify the returned results, **including** the precise order in which those are added to the returned arrays. Tests have been augmented to first check returned number of elements before checking the exact values via assert.deepEqual() to simplify debugging/diagnostics when a test fails. Following this work, many many tests are stricter than before and this strictness led to some very surprising discoveries in esquery itself, which will be committed next. Without those esquery fixes, several tests FAIL.
  * reverting commit SHA-1: 7622cb22354830a9b29fbf0b68784b76a1a600d3 :: rollback/revert to PEGJS 0.7.0 --> I double-checked and compiling with either PEGJS 0.7.0 or PEGJS 0.10.0 produces exactly the same number of errors in the unit tests: 29. So no use to stay with the old PEGJS as the errors originate someplace else... :-S
  * a la commit SHA-1: e1cfba6dd45406c5c5bb163b2f1cb8186f63343f :: rollback/revert to PEGJS 0.7.0 again as PEGJS 0.10.0 seems to produce even more errors in the unit tests: 41 vs. 29. (Compare also commit SHA-1: 58a0bdaa5ebb8d8ba259c707bb719a91470d5190 :: FAULT: update to PEGJS 0.10.0 produces a parser which apparently works differently and FAILS the tests in `npm test`!)
  * Merge remote-tracking branch 'remotes/kristianmandrup/master'
  * regenerate parser.
    WARNING: jstestr module is completely boogered, so no unit tests on NodeJS nor any browser. This is a jstestr issue, not an esquery issue!
  * Merge remote-tracking branch 'remotes/not-an-aardvark/es6-expressions'
  * Merge remote-tracking branch 'remotes/estools-original/master'
  * Fix TemplateLiterals and MetaProperties not being matched by :expression
  * Fixes [#58](https://github.com/GerHobbelt/esquery/issues/58): check attribute type before matching against a regexp
  * Fixes [#60](https://github.com/GerHobbelt/esquery/issues/60): reimplement subject indicators using :has selectors
  * Improve :scope support
  * Add :scope to readme
  * Implement relative selectors and :scope
  * Add :root to readme
  * Add :root selector; see [#2](https://github.com/GerHobbelt/esquery/issues/2)
  * Add test for nested descendant subject
  * Add correct SPDX expression.
  * update TravisCI: test all major modern NodeJS versions
  * fix PEGJS invocation for 0.7.0 again after rollback to that version: now all tests pass again via `npm i ; npm run build ; npm test` command line.
  * FAULT: update to PEGJS 0.10.0 produces a parser which apparently works differently and FAILS the tests in `npm test`!
  * regenerated parser.js; tests pass with PEGJS 0.7.0 at least...
  * fix `npm run build` task script
  * add `npm run build` task to easily REBUILD all library files (including regenerating parser.js using PEGJS)
  * fix `npm test` crash in r.js: adjust path in new test file as was done to the others before.
  * Merge remote-tracking branch 'remotes/nsfmc/fix-adjacent-length-access' into fix-me
  * fix tests: require path is project basedir, NOT tests/ ! --> `npm test` fails with r.js crash
  * fix PEGJS invocation for latest PEGJS: output UMD format and make sure the global is indeed called `result`
  * updated NPM packages; kept esprima at 1.x as latest esprima (3.3.x) seems to make `npm test` fail in various horrible ways...
  * fix crashes: more robust code by additional checks
  * add `make clean` target to forcibly clean generated files, so that a subsequent `make` invocation will regenerate those files, guaranteed.
  * Merge remote-tracking branch 'remotes/not-an-aardvark/robust-function-checks'
  * adjacent returns false if keys are undefined
    it's possible for `VisitorKeys` for a parent type to return `undefined` causing the subsequent iteration to fail. this bails early when that happens.
  * Expand :has() tests
  * Added :has() pseudo-selector to grammar.
  * Make :function matching more precise
    To check whether a node's type is `FunctionDeclaration` or `FunctionExpression`, esquery currently checks `node.type.slice(0, 8) === "Function"` as a shorthand rather than matching the node type explicitly. This works fine for the current ESTree spec because no other node types start with `Function`, but it can lead to unexpected behavior when traversing ASTs that have other node types starting with `Function`.
    esquery shouldn't need to account for the semantics of particular unknown node types, but using more precise `node.type` checks here would make esquery more robust when matching against custom/extended ASTs in general. This commit replaces the `type.startsWith("Function")` shorthand with an explicit check for `"FunctionDeclaration"` and `"FunctionExpression"`.

v1.0.0 / 2017-03-11
===================

  * Check whether a sibling/adjacent query is necessary before running it
    This improves performance for sibling matches that don't use subject indicators.
  * Use LEFT_SIDE and RIGHT_SIDE constants instead of strings
  * Make sibling/adjacent selector only match following siblings (fixes [#23](https://github.com/jrfeenst/esquery/issues/23))

0.4.1
=====

  * Latest compatible dependencies.
  * added shorthands
  * add quick start
  * update deps and add API usage doc with examples

v0.4.0 / 2015-05-05
===================

  * Merge pull request [#48](https://github.com/jrfeenst/esquery/issues/48) from sebmck/patch-1
    Upgrade estraverse to 4.0
  * drop node 0.8 and 0.6 from travis
  * Upgrade estraverse to 4.0
  * fix travis-ci badge
  * fixes [#42](https://github.com/jrfeenst/esquery/issues/42): update link to demo in README
  * Merge pull request [#36](https://github.com/jrfeenst/esquery/issues/36) from michaelficarra/GH-8
    fixes [#8](https://github.com/jrfeenst/esquery/issues/8): add regression test for "descendant includes ancestor" bug
  * fixes [#8](https://github.com/jrfeenst/esquery/issues/8): add regression test for "descendant includes ancestor" bug
  * Merge pull request [#34](https://github.com/jrfeenst/esquery/issues/34) from michaelficarra/GH-27
    fixes [#27](https://github.com/jrfeenst/esquery/issues/27): include actual JS programs in test fixtures
  * Merge pull request [#32](https://github.com/jrfeenst/esquery/issues/32) from michaelficarra/GH-24
    fixes [#24](https://github.com/jrfeenst/esquery/issues/24): change subject indicator from postfix to prefix
  * Merge pull request [#35](https://github.com/jrfeenst/esquery/issues/35) from michaelficarra/GH-33
    fixes [#33](https://github.com/jrfeenst/esquery/issues/33): add .npmignore
  * update documentation to reflect postfix->prefix change of subject (!)
  * fixes [#24](https://github.com/jrfeenst/esquery/issues/24): change subject indicator from postfix to prefix
  * Merge pull request [#31](https://github.com/jrfeenst/esquery/issues/31) from michaelficarra/GH-30
    fixes [#30](https://github.com/jrfeenst/esquery/issues/30): allow leading/trailing whitespace in queries
  * fixes [#33](https://github.com/jrfeenst/esquery/issues/33): add .npmignore
  * fixes [#27](https://github.com/jrfeenst/esquery/issues/27): include actual JS programs in test fixtures
  * remove pesky tabs, replace with four space indent
  * fixes [#30](https://github.com/jrfeenst/esquery/issues/30): allow leading/trailing whitespace in queries
  * fix node 0.6 SSL error during tests
  * fixes [#10](https://github.com/jrfeenst/esquery/issues/10): document "field" selector
  * fixes [#22](https://github.com/jrfeenst/esquery/issues/22): document class selector
  * link selectors in README to CSS docs
  * change demo link to use index.html; http://jrfeenst.github.io/esquery/
  * remove demo.html from master branch; it now lives only in gh-pages
  * add make target for browser bundle
  * fixes [#18](https://github.com/jrfeenst/esquery/issues/18): add test for numeric attribute selector
  * Merge pull request [#19](https://github.com/jrfeenst/esquery/issues/19) from michaelficarra/GH-6
    fixes [#6](https://github.com/jrfeenst/esquery/issues/6): add selector for classes of node types
  * Merge pull request [#20](https://github.com/jrfeenst/esquery/issues/20) from michaelficarra/GH-16
    fixes [#16](https://github.com/jrfeenst/esquery/issues/16): allow attribute selector to match non-String values
  * make class selectors case insensitive
  * fixes [#6](https://github.com/jrfeenst/esquery/issues/6): add selector for classes of node types
    XML is omitted because it's harder to detect and very uncommonly used
  * fixes [#16](https://github.com/jrfeenst/esquery/issues/16): allow attribute selector to match non-String values
  * Update the version number in prep for release.

v0.3.0 / 2013-11-05
===================

  * Merge pull request [#14](https://github.com/jrfeenst/esquery/issues/14) from michaelficarra/peg-parser
    fixes [#11](https://github.com/jrfeenst/esquery/issues/11): generate parser using PEG.js; fixes [#7](https://github.com/jrfeenst/esquery/issues/7); fixes [#9](https://github.com/jrfeenst/esquery/issues/9)
  * Merge pull request [#15](https://github.com/jrfeenst/esquery/issues/15) from michaelficarra/no-assignment-in-tests
    Move assignments out of tests.
  * move assignments out of tests
  * fixes [#11](https://github.com/jrfeenst/esquery/issues/11): generate parser using PEG.js; fixes [#7](https://github.com/jrfeenst/esquery/issues/7); fixes [#9](https://github.com/jrfeenst/esquery/issues/9)
  * Merge pull request [#12](https://github.com/jrfeenst/esquery/issues/12) from michaelficarra/rewrite
    Use single-pass evaluation model; expose composable interface; use estraverse
  * manually lift variable declarations to top of scope
  * death by 1000 gratuitous braces
  * refactor, clean up, and comment sibling, adjacent, and nthChild
  * DRY sibling, adjacent, nth-child, and nth-last-child matchers
  * implement arbitrary subject matching; fix sibling and adjacent matches
  * add comments
  * consistent styling
  * use consistent (node, selector) ordering for interfaces
  * fix field implementation
  * rewrite
  * Make node type matching case insensitive.
    Closes issue [#1](https://github.com/jrfeenst/esquery/issues/1)!
  * Update the version for another npm push.

0.2.0 / 2013-08-07
==================

  * Add a node cache to improve performance of type and wildcard queries.
  * Fix a regression in multilevel complex selectors.
  * Add # as an optional prefix to type selectors to allow better syntax in
    some cases.
  * Fix package.json syntax issue.
  * Add support for parent field name selector. This will return the nodes
    which are accessed throught the specified field or path. Example:
    ".body.test"
  * Add period as an operator for later use in parent attribute selector.
  * Updating version number.
  * Refactor the parser to better handle some cases such as compound
    selectors. Also fix some issues with descedant and child selector
    matching.
  * Add more error test cases to get coverage up over 98% and fix a few
    things found while doing it.
  * Add many more tests and fix some functionality. Now over 90% statement,
    branch, function, and line coverage.
  * Refactor tests to split them up by functionality rather than ast
    contents. Also adding :matches and :not tests.
  * Fix a couple issues with the subject identifier.
  * Add support for the ! operator to indicate the subject(s) of the
    selector.
  * Fix all the tests that are failing due to nth-child, and nth-last-child
    changes. Also fix string escaping.
  * Switch to css4 style :not instead of !. Also added :matches support
    which can be used for grouping. Unlike css4, it supports nesting.
  * Initial support for negating a selector using '!' prefix.
  * Add support for attribute value type comparison.
    Checks the type using typeof: [attr=type(string)].
  * Adding support for regexp based attribute queries. Regexp attribute
    queries look like: [attr=/regexp/].
  * Change the version in prep for deploying to npm.
  * Add travis ci build status image.
  * Update the version of jstestr due to new assert.
  * Add a travis ci config file.
  * Add a whole bunch of tests for querying from sample programs.
  * Add a number of token processing tests and some initial query tests. Added a number of AST from a few different bits of code for use in tests.
  * Start to add some tests. Added tokenization tests and some token
    processing tests.
  * Fixing attribute selector and making the sibling and adjacent selectors
    be order dependent (same as css).
  * Add support for sibling, adjacent, child, nth-child, and attribute
    existence ([attr]) selectors.
  * Add a link to the demo.
  * Initial version of ESQuery. Support parsing of selectors and querying
    using type, attribute, wildcard, and descendant selectors.

