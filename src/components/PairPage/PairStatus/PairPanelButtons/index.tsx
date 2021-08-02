import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { SPI_PAIR_FLOW } from '../../../../definitions/constants/commonConfigs';
import { ReactComponent as ConnectedIcon } from '../../../../images/ConnectedIcon.svg';
import { ReactComponent as ReconnectingIcon } from '../../../../images/ReconnectingIcon.svg';
import { ReactComponent as UnpairedIcon } from '../../../../images/UnpairedIcon.svg';
import { useAppDispatch } from '../../../../redux/hooks';
import handlePairClick from '../../../../utils/common/pair/pairStatusHelpers';
import useStyles from '../index.styles';
import { PairPanelButtonsInterface } from '../interfaces';

export default function PairPanelButtons(status: string): PairPanelButtonsInterface {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  switch (status) {
    case SPI_PAIR_FLOW.IDLE:
      return {
        statusTitle: 'Unpaired',
        statusIcon: <UnpairedIcon className={classes.unpairedIcon} />,
        statusText: 'Idle',
        button: (
          <Button
            variant="contained"
            color="primary"
            className={classes.pairBtn}
            onClick={() => handlePairClick(dispatch)}
          >
            Pair
          </Button>
        ),
      };
    case SPI_PAIR_FLOW.PAIRING:
      return {
        statusTitle: 'Reconnecting',
        statusIcon: <ReconnectingIcon className={classes.reconnectIcon} />,
        statusText: 'Pairing',
        button: (
          <Button variant="outlined" className={classes.cancelPairingBtn}>
            Cancel Pairing
          </Button>
        ),
      };
    case SPI_PAIR_FLOW.TRANSACTION:
      return {
        statusTitle: 'Connected',
        statusIcon: <ConnectedIcon className={classes.connectedIcon} />,
        statusText: 'Ready',
        button: (
          <Box>
            <Button color="primary" className={classes.unpairButton}>
              Unpair
            </Button>
            <Button variant="contained" color="primary" className={classes.pairBtn}>
              Go to Sample POS
            </Button>
          </Box>
        ),
      };
    default:
      return {
        statusTitle: 'Unpaired',
        statusIcon: <UnpairedIcon className={classes.unpairedIcon} />,
        statusText: 'Idle',
        button: (
          <Button
            variant="contained"
            color="primary"
            className={classes.pairBtn}
            onClick={() => handlePairClick(dispatch)}
          >
            Pair
          </Button>
        ),
      };
  }
}
