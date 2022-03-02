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
import {
  isPairDisabled,
  selectPairFormSerialNumber,
  selectPairFormValues,
} from '../../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { isTerminalUnpaired } from '../../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import {
  getTitleFromStatus,
  handleCancelPairClick,
  handlePairClick,
  handleUnPairClick,
} from '../../../../utils/common/pair/pairStatusHelpers';
import useStyles from '../index.styles';
import { PairPanelButtonsInterface } from '../interfaces';

export default function PairPanelButtons(status: string, message: string | null): PairPanelButtonsInterface {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const pairFormValues = useAppSelector(selectPairFormValues);
  const pairBtnDisabled = useAppSelector(isPairDisabled);
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const terminalUnpaired = useAppSelector(isTerminalUnpaired(pairFormSerialNumber));

  const handlePair = () => handlePairClick(dispatch, pairFormValues);

  if (status === SPI_PAIR_STATUS.PairedConnecting) {
    return {
      statusTitle: getTitleFromStatus(SPI_PAIR_STATUS.PairedConnecting),
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
      statusTitle: getTitleFromStatus(SPI_PAIR_STATUS.PairedConnected),
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
    statusText: '-',
    button: (
      <Button
        className={classes.pairBtn}
        color="primary"
        disabled={pairBtnDisabled || terminalUnpaired}
        data-test-id="pairBtn"
        onClick={handlePair}
        variant="contained"
      >
        Pair
      </Button>
    ),
  };
}
