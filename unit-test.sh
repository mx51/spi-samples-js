#!/bin/bash


###
# TODO - delete this file once github action is working
###


set -e

# Run unit tests
echo " * Running unit tests ..."
echo

TEST_IMAGE="node:12-alpine3.14"

docker run --rm \
  --userns=host \
  -v ${PWD}:/usr/src/app \
  -w /usr/src/app \
  ${TEST_IMAGE} /bin/sh -c "npm install && npm run test:deploy"

echo
echo " * Done."
echo

