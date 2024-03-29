import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { SPI_PAIR_STATUS } from '../../../../definitions/constants/commonConfigs';
import { ReactComponent as FailedIcon } from '../../../../images/FailedIcon.svg';
import { ReactComponent as ReconnectingIcon } from '../../../../images/ReconnectingIcon.svg';
import { ReactComponent as SuccessIcon } from '../../../../images/SuccessIcon.svg';
import useStyles from './index.styles';

export default function StatusBox({ status }: { status: string }): React.ReactElement {
  const classes = useStyles();

  switch (status) {
    case SPI_PAIR_STATUS.PairedConnected:
      return (
        <Box display="flex" alignItems="center" className={classes.statusBox}>
          <Typography align="right">
            <SuccessIcon className={classes.successIcon} />
          </Typography>
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5" className={classes.statusTitle}>
              Paired
            </Typography>
            <Typography variant="inherit" className={classes.statusText}>
              Ready
            </Typography>
          </Box>
        </Box>
      );
    case SPI_PAIR_STATUS.PairedConnecting:
      return (
        <Box display="flex" alignItems="center" className={classes.statusBox}>
          <Typography align="right">
            <ReconnectingIcon className={classes.reconnectIcon} />
          </Typography>
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5" className={classes.statusTitle}>
              Reconnecting
            </Typography>
            <Typography variant="inherit" className={classes.statusText}>
              Not Ready
            </Typography>
          </Box>
        </Box>
      );
    default:
      return (
        <Box display="flex" alignItems="center" className={classes.statusBox}>
          <Typography align="right">
            <FailedIcon className={classes.failedIcon} />
          </Typography>
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5" className={classes.statusTitle}>
              Unpaired
            </Typography>
            <Typography variant="inherit" className={classes.statusText}>
              Not Ready
            </Typography>
          </Box>
        </Box>
      );
  }
}
