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

_tag:
	git tag ${TAG}
	@echo created ${TAG}

## Run git tag picking the version from package.json
tag:
	make _tag TAG="$$(node -e 'console.log(require("./package").version)')"

## Push tags to the remote repository
posttag:
	git push && git push --tags

## Delete a git tag. make tag/delete TAG=8.0.0
tag/delete:
	git tag -d ${TAG}
	git push --delete origin ${TAG}
	

.PHONY: list test
.PHONY: tag 
.PHONY: all install node_modules

## Run update deps for all of them
update-deps:
	ncu -x chai -u && npm i && npm test

.PHONY: build prebuild

## prebuild scripts
prebuild:
	npm run prebuild

## build the app
build:
	npm run build

## build the app in watch mode
watch:
	npm run build-watch
