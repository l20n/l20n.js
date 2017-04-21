DIST := $(CURDIR)/../../dist/$(shell basename $(CURDIR))

build:
	rollup index.js \
	    -c ./bundle_config.js \
	    | babel --presets latest > $(DIST)/l20n.js
	babel --presets babili $(DIST)/l20n.js > $(DIST)/l20n.min.js
