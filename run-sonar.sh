#!/bin/bash


###
# TODO - delete this file once github action is working
###


set -e

# Check password
if [ -z "$SONAR_TOKEN" ]; then
  echo "error: SONAR_TOKEN not set. Aborting."
  exit 1
fi

# Determine git tag name
TAG_NAME=$( git rev-parse --abbrev-ref HEAD )

# Start
echo
echo " ******************************************************* "
echo " ***                                                 *** "
echo " *** RUNNING SONAR SCANNER ...                       *** "
echo " ***                                                 *** "
echo " ******************************************************* "
echo

# Run sonar
echo " * Publishing report to sonar ... "
echo

docker run --rm \
  --userns=host \
  -e SONAR_SCANNER_OPTS="-Xms1024m -Xmx2048m" \
  -e SONAR_LOGIN="$SONAR_TOKEN" \
  -v "${PWD}:/usr/src" \
  sonarsource/sonar-scanner-cli:latest -Dsonar.projectVersion=$TAG_NAME

# Finish
echo
echo " * Sonar report complete."
echo


