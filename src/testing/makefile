DIST := $(CURDIR)/../../dist/$(shell basename $(CURDIR))

build:
	@mkdir -p $(DIST)
	@rollup index.js \
	    --config ./bundle_config.js \
	    --output $(DIST)/l20n.js
