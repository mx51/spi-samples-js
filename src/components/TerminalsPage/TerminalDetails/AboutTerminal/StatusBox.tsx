import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { SPI_PAIR_STATUS } from '../../../../definitions/constants/commonConfigs';
import { ReactComponent as ConnectedIcon } from '../../../../images/ConnectedIcon.svg';
import { ReactComponent as ReconnectingIcon } from '../../../../images/ReconnectingIcon.svg';
import { ReactComponent as UnpairedIcon } from '../../../../images/UnpairedIcon.svg';

export default function StatusBox(classes: Any, status: string): React.ReactElement {
  switch (status) {
    case SPI_PAIR_STATUS.PairedConnected:
      return (
        <Box display="flex" alignItems="center" className={classes.statusBox}>
          <Typography align="right">
            <ConnectedIcon className={classes.connectedIcon} />
          </Typography>
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5">Connected</Typography>
            <Typography variant="inherit">Ready</Typography>
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
            <Typography variant="h5">Connecting</Typography>
            <Typography variant="inherit">Pairing</Typography>
          </Box>
        </Box>
      );
    default:
      return (
        <Box display="flex" alignItems="center" className={classes.statusBox}>
          <Typography align="right">
            <UnpairedIcon className={classes.unpairedIcon} />
          </Typography>
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5">Disconnected</Typography>
            <Typography variant="inherit">Unpaired</Typography>
          </Box>
        </Box>
      );
  }
}
