#!/bin/bash

set -e

HEROKU_TARGET_REPO="acmepos-js.git"


####
# METHODS
####
check_heroku_api_key() {
  if [ -z "$USER_HEROKU_API_KEY" ]; then
    die "error: variable USER_HEROKU_API_KEY not found."
  fi
}

banner_msg() {
  MSG1=$1
  printf " * %-90s * \n" "$MSG1"
}

banner_hr() {
  echo " ********************************************************************************************** "
}



####
# MAIN
####

# Using api key for deploy
check_heroku_api_key

# Start deploy
banner_msg " "
banner_msg "Deploying AcmePOS.js ... "
banner_msg " "

# Run deploy
git push -f https://heroku:${USER_HEROKU_API_KEY}@git.heroku.com/${HEROKU_TARGET_REPO} master

# Start deploy
banner_msg " "
banner_msg "Deploy complete."
banner_msg " "
