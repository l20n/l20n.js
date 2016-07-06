export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)
export OK := \033[32;01m✓\033[0m

RUNTIMES := $(wildcard src/runtime/*)

.PHONY: build $(RUNTIMES)
build: $(RUNTIMES)
	babel --presets es2015-loose --out-dir dist/compat/web dist/bundle/web

$(RUNTIMES):
	@$(MAKE) -s -C $@
	@echo -e " $(OK) $@ built"

clean:
	@rm -rf dist/*
	@echo -e " $(OK) dist cleaned"

lint:
	eslint src/

test-lib:
	@mocha \
	    --recursive \
	    --reporter dot \
	    --require ./test/compat \
	    test/lib/parser/ftl

test-browser:
	karma start test/karma.conf.js

include tools/perf/makefile
