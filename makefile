export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)
export OK := \033[32;01m✓\033[0m

RUNTIMES := $(wildcard src/runtime/*)

all: lint build

build: $(RUNTIMES)

$(RUNTIMES):
	@$(MAKE) -s -C $@
	@echo -e " $(OK) $@ built"

clean:
	@rm -rf dist/*
	@echo -e " $(OK) dist cleaned"

lint:
	@eslint --max-warnings 0 src/
	@echo -e " $(OK) src/ linted"

test:
	karma start test/karma.conf.js

docs:
	documentation build --shallow -f md \
	    src/bindings/*.js > docs/bindings.md
	documentation build --shallow -f md \
	    src/lib/*.js > docs/localization.md

.PHONY: $(RUNTIMES) test docs
