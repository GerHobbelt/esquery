default: parser browser

PEGJS = node_modules/.bin/pegjs --cache --export-var 'var result'
# PEGJS = node_modules/.bin/pegjs --cache --format commonjs
CJSIFY = node_modules/.bin/cjsify

parser: parser.js
browser: dist/esquery.js

clean:
	-rm -f parser.js dist/*.js dist/*.map

parser.js: grammar.pegjs
	$(PEGJS) < "$<" > "$@"
	@echo 'if (typeof define === "function" && define.amd) { define(function(){ return result; }); } else if (typeof module !== "undefined" && module.exports) { module.exports = result; } else { this.esquery = result; }' >> "$@"

dist/esquery.js: esquery.js parser.js
	@mkdir -p "$(@D)"
	$(CJSIFY) esquery.js -vx esquery --source-map "$@.map" > "$@"

.PHONY: default parser browser clean
