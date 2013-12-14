
build: node_modules components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	@rm -fr build components node_modules

node_modules: package.json
	@npm install

test:
	@./node_modules/.bin/mocha test/index.js \
		--reporter dot \
		--bail

test-component: build
	@open test/index.html

.PHONY: clean test test-component