DIST := $(CURDIR)/../../dist/$(shell basename $(CURDIR))

build:
	@mkdir -p $(DIST)
	@rollup index.js \
	    --config ./bundle_config.js \
	    --output $(DIST)/l20n.js
	@uglifyjs $(DIST)/l20n.js \
	    --compress \
	    --mangle \
	    --screw-ie8 \
	    --output $(DIST)/l20n.min.js
