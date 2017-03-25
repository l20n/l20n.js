export SHELL := /bin/bash
export PATH  := $(CURDIR)/node_modules/.bin:$(PATH)
export OK := \033[32;01m✓\033[0m

RUNTIMES := src/gecko src/testing src/web

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
	    src/localization.js > docs/localization.md
	documentation build --shallow -f md \
	    src/dom_localization.js > docs/dom_localization.md
	documentation build --shallow -f md \
	    src/document_localization.js > docs/document_localization.md

.PHONY: $(RUNTIMES) test docs
