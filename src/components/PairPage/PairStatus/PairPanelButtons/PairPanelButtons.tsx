import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { SPI_PAIR_STATUS } from '../../../../definitions/constants/commonConfigs';
import { PATH_PURCHASE } from '../../../../definitions/constants/routerConfigs';
import { ReactComponent as FailedIcon } from '../../../../images/FailedIcon.svg';
import { ReactComponent as ReconnectingIcon } from '../../../../images/ReconnectingIcon.svg';
import { ReactComponent as SuccessIcon } from '../../../../images/SuccessIcon.svg';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { selectPairFormValues } from '../../../../redux/reducers/PairFormSlice/PairFormSelectors';
import {
  getTitleFromStatus,
  handleCancelPairClick,
  handleUnPairClick,
} from '../../../../utils/common/pair/pairStatusHelpers';
import useStyles from '../index.styles';
import { PairPanelButtonsInterface } from '../interfaces';

export default function PairPanelButtons(
  status: string,
  message: string | null,
  reconnecting: boolean
): PairPanelButtonsInterface {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const pairFormValues = useAppSelector(selectPairFormValues);

  if (status === SPI_PAIR_STATUS.PairedConnecting && reconnecting) {
    return {
      statusTitle: getTitleFromStatus(SPI_PAIR_STATUS.PairedConnecting, reconnecting),
      statusIcon: <ReconnectingIcon className={classes.reconnectIcon} />,
      statusText: 'Not Ready',
      button: (
        <Button
          className={classes.cancelPairingBtn}
          data-test-id="cancelPairBtn"
          onClick={() => handleCancelPairClick(dispatch, pairFormValues.serialNumber)}
          variant="outlined"
        >
          Cancel Pairing
        </Button>
      ),
    };
  }
  if (status === SPI_PAIR_STATUS.PairedConnecting) {
    return {
      statusTitle: getTitleFromStatus(SPI_PAIR_STATUS.PairedConnecting, false),
      statusIcon: <ReconnectingIcon className={classes.reconnectIcon} />,
      statusText: message ?? SPI_PAIR_STATUS.PairedConnecting,
      button: (
        <Button
          className={classes.cancelPairingBtn}
          data-test-id="cancelPairBtn"
          onClick={() => handleCancelPairClick(dispatch, pairFormValues.serialNumber)}
          variant="outlined"
        >
          Cancel Pairing
        </Button>
      ),
    };
  }
  if (status === SPI_PAIR_STATUS.PairedConnected && pairFormValues.serialNumber !== '') {
    return {
      statusTitle: getTitleFromStatus(SPI_PAIR_STATUS.PairedConnected, false),
      statusIcon: <SuccessIcon className={classes.successIcon} />,
      statusText: 'Ready',
      button: (
        <Box>
          <Button
            className={classes.unpairButton}
            color="primary"
            data-test-id="unPairBtn"
            onClick={() => handleUnPairClick(dispatch, pairFormValues.serialNumber)}
          >
            Unpair
          </Button>
          <Button className={classes.pairBtn} color="primary" component={Link} to={PATH_PURCHASE} variant="contained">
            Go to Sample POS
          </Button>
        </Box>
      ),
    };
  }

  return {
    statusTitle: SPI_PAIR_STATUS.Unpaired,
    statusIcon: <FailedIcon className={classes.failedIcon} />,
    statusText: 'Not Ready',
    button: null,
  };
}
