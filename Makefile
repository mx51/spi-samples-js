#!/usr/bin/env make

include Makehelp.mk

## Compile code and create build artefacts
build:
	./scripts/make.sh build
.PHONY: build


## Run npm tests
test:
	./scripts/make.sh test
.PHONY: test


## Deploy build artefacts to CDN
deploy:
	./scripts/make.sh deploy
.PHONY: deploy


## Slack alerts for release
alert_release:
	./scripts/make.sh alert_release
.PHONY: alert_release


## Slack alerts for deploy
alert_deploy:
	./scripts/make.sh alert_deploy
.PHONY: alert_deploy


## Create and push new git tag
tag:
	./scripts/tag.sh
.PHONY: tag
