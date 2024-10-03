import React from 'react';
import { Box } from '@material-ui/core';
import useStyles from './index.styles';

export const SpiCloudPairingSteps = () => {
  const classes = useStyles();
  return (
    <Box className={classes.pairingStepsBox}>
      <div className={classes.pairingStepsHeader}>
        Steps to pair for:
        <br /> <strong>SPI Cloud</strong>
      </div>
      <ol className={classes.pairingStepsOl}>
        <li>Select your payment provider</li>
        <li>
          <i>On the terminal:</i> Select <strong>“SPI Cloud”</strong>
        </li>
        <li>
          Enter the <strong>pairing code</strong> provided from the terminal
        </li>
        <li>Create a POS nickname for the terminal to identify.</li>
        <li>Tap “Pair” to initiate the pairing on both devices</li>
      </ol>
    </Box>
  );
};
