import React from 'react';
import { Box } from '@material-ui/core';
import useStyles from './index.styles';

export const SpiPairingSteps = () => {
  const classes = useStyles();
  return (
    <Box className={classes.pairingStepsBox}>
      <div className={classes.pairingStepsHeader}>
        Steps to pair for:
        <br /> <strong>Simple Payments Integration</strong>
      </div>
      <ol className={classes.pairingStepsOl}>
        <li>Select your payment provider</li>
        <li>
          <i>On the terminal:</i> Go to “Manage POS pairing” to create a new POS Pairing.
        </li>
        <li>
          <i>On the terminal:</i> Select <strong>“Simple Payments Integration”.</strong>
        </li>
        <li>Enter the serial number and IP address provided from the terminal</li>
        <li>Create a POS ID to identify the pairing connection. </li>
        <li>Tap “Pair” to initiate the pairing on both devices</li>
      </ol>
    </Box>
  );
};
