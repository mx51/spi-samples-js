#!/bin/bash

set -e


###
# FUNCTIONS
###

# Exit with message
die() {
  msg="$1"
  echo -e "$msg\nAborting."
  exit 1
}

# Error if env var not found
check_env_var() {
  VAR_NAME=$1
  VAR_VALUE=$2

  if [ -z "${VAR_VALUE}" ]; then
    die "error: environment variable not found: ${VAR_NAME}"
  fi
}

# Determine VERSION value
source_version_value() {
  # Check if building off tag in Azure
  if [[ $BUILD_SOURCEBRANCH == refs/tags/* ]]; then
    echo " * Azure BUILD_SOURCEBRANCH env var with tag value detected: $BUILD_SOURCEBRANCH"

    # Clean up tag name
    TAG_NAME=${BUILD_SOURCEBRANCH##"refs/tags/"}

    # Use as VERSION
    export VERSION="$TAG_NAME"

  else
    # Source version via git describe
    echo " * Using 'git describe' to source version value"
    set +e
    GIT_DESCRIBE=$( git describe --always --tags --long 2> /dev/null )
    set -e
    echo

    # Check branch name value exists and is valid
    if [ -z "$GIT_DESCRIBE" ]; then
      die "error: git project not detected, or not initalised properly"
    fi

    # Use as VERSION
    export VERSION=$GIT_DESCRIBE
  fi
}

# make deploy
run_deploy() {
  # Check for required env vars
  check_env_var "CLOUDFRONT_ID" "$CLOUDFRONT_ID"
  check_env_var "S3_BUCKET"     "$S3_BUCKET"
  check_env_var "ARTIFACT_PATH" "$ARTIFACT_PATH"

  # Assume AWS role for integrations account
  echo " * Assuming AWS integrations role ..."
  aws_assume_role

  # Deploy artefacts
  echo " * Deploying to AWS ..."

  # Copy spi-samples-js folder
  echo "   - executing: aws s3 cp --recursive $ARTIFACT_PATH s3://$S3_BUCKET/ ..."
  aws s3 cp --recursive $ARTIFACT_PATH "s3://$S3_BUCKET/"

  # Fetch invalidation ID
  echo "   - fetching invalidation for cloudfront ID: $CLOUDFRONT_ID ..."
  AWS_INVALIDATION_ID=$( aws cloudfront create-invalidation \
    --distribution-id=$CLOUDFRONT_ID \
    --paths '/*' | \
      jq -r '.Invalidation.Id'
  )

  # Invalidate cache
  echo "   - invalidating cache ..."
  aws cloudfront wait invalidation-completed \
    --distribution-id=$CLOUDFRONT_ID \
    --id $AWS_INVALIDATION_ID

  echo " * Deploy complete"
}

# Assume AWS integrations role for S3/CF deployment
aws_assume_role() {
  # Check for ARN env var
  check_env_var "ASSUMED_ROLE" "$ASSUMED_ROLE"

  # Call aws sts
  CREDS=$( aws sts assume-role --role-arn ${ASSUMED_ROLE} --role-session-name aws-spi-samples-jss-1 )

  # Export AWS creds
  export AWS_ACCESS_KEY_ID=$( echo $CREDS     | jq -r ".Credentials | .AccessKeyId" )
  export AWS_SECRET_ACCESS_KEY=$( echo $CREDS | jq -r ".Credentials | .SecretAccessKey" )
  export AWS_SESSION_TOKEN=$( echo $CREDS     | jq -r ".Credentials | .SessionToken" )
}

# make alert_deploy
run_alert_deploy() {
  # Check for required env vars
  check_env_var "VERSION"       "$VERSION"
  check_env_var "SHIPPED_TO"    "$SHIPPED_TO"

  # Source change author via git
  # NOTE - azure does not provide user details as a predefined variable
  GIT_AUTHOR=$( git show -s --format='<mailto:%ae|%an>' )

  # DEBUG
  echo
  echo " * PWD                            : $( pwd )"
  echo " * SYSTEM_DEFAULTWORKINGDIRECTORY : $SYSTEM_DEFAULTWORKINGDIRECTORY"
  echo " * AGENT_NAME                     : $AGENT_NAME"
  echo
  # DEBUG

  # TODO - we might eventually want to alert for deployments, which we can do by calling the python script

  # Post deploy alert to slack
  #slack_message ":rocket: $GIT_AUTHOR just shipped version *$VERSION* to ${SHIPPED_TO}!"
}


###
# MAIN
###

TASK="$1"
echo

# Source tag name from git
if [ -z "$VERSION" ]; then
  source_version_value
fi

echo " * Using version: $VERSION"
echo

# Perform task, default to "make build"
case $TASK in
  ( "alert_release" | "deploy" | "alert_deploy" )
    run_$TASK;;
esac

echo " * Done."
echo
