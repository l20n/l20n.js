DIST := $(CURDIR)/../../dist/$(shell basename $(CURDIR))

build:
	@mkdir -p $(DIST)
	@rollup index.js -c ./bundle_config.js \
	    | babel > $(DIST)/l20n.js
