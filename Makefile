# get Makefile directory name: http://stackoverflow.com/a/5982798/376773
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# Path
PATH := node_modules/.bin:$(PATH)

NODE ?= $(shell which node)
YARN ?= $(shell which yarn)
PKG ?= $(if $(YARN),$(YARN),$(NODE) $(shell which npm))

default: help

include .make/*.mk

install: node_modules

node_modules: package.json
	@NODE_ENV= $(PKG) install
	@touch node_modules

# Example how to get a command execution into a variable and use it in the same line
# pack:
# @file=$$(npm ls); echo "$$file";

## Build the project
build:
	$(PKG) run build

_tag:
	git tag ${TAG}
	@echo created ${TAG}

## Run git tag picking the version from package.json
tag:
	make _tag TAG="$$(node -e 'console.log(require("./package").version)')"

## Push tags to the remote repository
posttag:
	git push && git push --tags

.PHONY: list test
.PHONY: tag 
.PHONY: all install node_modules
