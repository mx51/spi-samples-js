#!/usr/bin/env python3

import requests
import importlib
import json
import os
import platform
import re
import subprocess
import sys


###
# GLOBALS
###

# Slack details
SLACK_WEBHOOK_URL        = os.getenv('CICD_FAILURE_WEBHOOK')
SLACK_ALERT_COLOUR       = '#FF0000'

# Azure build details
AZ_PROJECT       = os.getenv('SYSTEM_TEAMPROJECT')
AZ_BUILD_ID      = os.getenv('BUILD_BUILDID')
AZ_SYSTEM_JOBID  = os.getenv('SYSTEM_JOBID')
AZ_JOB_URL       = f'https://dev.azure.com/mx51/{AZ_PROJECT}/_build/results?view=logs&buildId={AZ_BUILD_ID}&j={AZ_SYSTEM_JOBID}'


###
# MAIN METHOD
###

def main():
    # Send generic alert
    slack_alert()

    # Finished
    print(' * Slack alert sent.')
    print()


# Post alert to slack
def slack_alert():
    # Display message
    print(' * Sending slack alert for pipeline failure ...')

    # Generate payload
    slack_data = generate_slack_payload()

    # Prepare post header
    headers = {'Content-Type': 'application/json'}

    # Send post
    if not SLACK_WEBHOOK_URL:
        fatal('error: env var not found: CICD_FAILURE_WEBHOOK')

    response = requests.post(
        SLACK_WEBHOOK_URL, data=json.dumps(slack_data), headers=headers
    )

    # Check response
    if response.status_code != 200:
        fatal('error: slack request failed: %s' % response.text)


# Json payload for slack
def generate_slack_payload():
    # Read alert message
    alert_message = os.getenv('ALERT_MESSAGE')

    if not alert_message:
        alert_message = 'Failure Detected'

    # Read pipeline details
    pipeline_name, pipeline_field = read_pipeline_details()

    return {
        'text': f'*WARNING*: Pipeline failure detected {pipeline_field}',
        'attachments': [
            {
                'color': '%s' % SLACK_ALERT_COLOUR,
                'title': 'Azure pipeline failure',
                'title_link': '%s' % AZ_JOB_URL,
                'text': f'\n*{pipeline_name}: {alert_message}.* Please click :point_up:'
            }
        ]
    }

# Read and format pipeline name for slack message
def read_pipeline_details():
    # Start with empty field
    pipeline_field = ''

    # Read from env var
    pipeline_name = os.getenv('BUILD_DEFINITIONNAME')

    # Format for slack
    if pipeline_name:
        pipeline_field = f'for *{pipeline_name}*'

    else:
        pipeline_name = '(unspecified)'

    return pipeline_name, pipeline_field


# Log message and exit
def fatal(msg):
    print(msg)
    print('Aborting.')
    sys.exit(1)


####
# MAIN
####

# Invoke main method
if __name__ == '__main__':
    main()

