import React from 'react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import useStyles from './index.styles';
import { ReactComponent as ReconnectingIcon } from '../../../images/ReconnectingIcon.svg';
import { PairingResponse } from './SpiCloudPairingReducer';

type Props = {
  pairingResponse: PairingResponse | undefined;
  onCancel: () => void;
  onConfirmation: () => void;
};

export const SpiCloudPairingConfirmation: React.FC<Props> = ({ pairingResponse, onConfirmation, onCancel }) => {
  const classes = useStyles();

  return (
    <div aria-live="polite">
      <Grid container direction="column" className={classes.statusPanel}>
        <Box display="flex" alignItems="center" className={classes.statusBox}>
          <ReconnectingIcon className={classes.reconnectIcon} />
          <Box ml={2}>
            <Typography variant="h6" component="h6">
              Pairing
            </Typography>
            Confirm that the following Code is showing on the Terminal
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" marginLeft={2}>
          Code:
          <Typography variant="h5" className={classes.pairingCode}>
            {pairingResponse?.data?.confirmation_code}
          </Typography>
        </Box>
        <Grid container alignItems="center" justifyContent="flex-end">
          <Button color="primary" onClick={onConfirmation} variant="contained">
            Confirm
          </Button>
          <Button
            className={classes.cancelPairingBtn}
            data-test-id="cancelPairBtn"
            onClick={onCancel}
            variant="outlined"
          >
            Cancel Pairing
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
