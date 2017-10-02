default: browser test 

PEGJS = node_modules/.bin/pegjs --cache --format commonjs
CJSIFY = node_modules/.bin/cjsify

parser: parser.js
browser: parser dist/esquery.js
test: parser
	node_modules/.bin/mocha tests

clean:
	-rm -f parser.js dist/*.js dist/*.map

parser.js: grammar.pegjs
	$(PEGJS) < "$<" > "$@"

dist/esquery.js: esquery.js parser.js
	@mkdir -p "$(@D)"
	$(CJSIFY) esquery.js -vx esquery --source-map "$@.map" > "$@"

.PHONY: default parser browser clean test
