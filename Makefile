default: parser browser

PEGJS = node_modules/.bin/pegjs --cache --format commonjs
CJSIFY = node_modules/.bin/cjsify

parser: parser.js
browser: dist/esquery.js

clean:
	-rm -f parser.js dist/*.js dist/*.map

parser.js: grammar.pegjs
	$(PEGJS) < "$<" > "$@"

dist/esquery.js: esquery.js parser.js
	@mkdir -p "$(@D)"
	$(CJSIFY) esquery.js -vx esquery --source-map "$@.map" > "$@"

.PHONY: default parser browser clean
