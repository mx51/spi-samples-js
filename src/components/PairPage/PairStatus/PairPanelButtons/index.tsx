import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { SPI_PAIR_FLOW, SPI_PAIR_STATUS } from '../../../../definitions/constants/commonConfigs';
import { ReactComponent as ConnectedIcon } from '../../../../images/ConnectedIcon.svg';
import { ReactComponent as ReconnectingIcon } from '../../../../images/ReconnectingIcon.svg';
import { ReactComponent as UnpairedIcon } from '../../../../images/UnpairedIcon.svg';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { isPairButtonDisabled, selectPairFormValues } from '../../../../redux/reducers/PairFormSlice/PairFormSelectors';
import {
  handleCancelPairClick,
  handlePairClick,
  handleUnPairClick,
} from '../../../../utils/common/pair/pairStatusHelpers';
import useStyles from '../index.styles';
import { PairPanelButtonsInterface } from '../interfaces';

export default function PairPanelButtons(status: string): PairPanelButtonsInterface {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const pairFormValues = useAppSelector(selectPairFormValues);
  const isDisabled = useAppSelector(isPairButtonDisabled);

  switch (status) {
    case SPI_PAIR_STATUS.Unpaired:
      return {
        statusTitle: SPI_PAIR_STATUS.Unpaired,
        statusIcon: <UnpairedIcon className={classes.unpairedIcon} />,
        statusText: SPI_PAIR_FLOW.Idle,
        button: (
          <Button
            className={classes.pairBtn}
            color="primary"
            disabled={isDisabled}
            onClick={() => handlePairClick(dispatch, pairFormValues)}
            variant="contained"
          >
            Pair
          </Button>
        ),
      };
    case SPI_PAIR_STATUS.PairedConnecting:
      return {
        statusTitle: SPI_PAIR_STATUS.PairedConnecting,
        statusIcon: <ReconnectingIcon className={classes.reconnectIcon} />,
        statusText: SPI_PAIR_FLOW.Pairing,
        button: (
          <Button
            className={classes.cancelPairingBtn}
            onClick={() => handleCancelPairClick(dispatch, pairFormValues.serialNumber)}
            variant="outlined"
          >
            Cancel Pairing
          </Button>
        ),
      };
    case SPI_PAIR_STATUS.PairedConnected:
      return {
        statusTitle: SPI_PAIR_STATUS.PairedConnected,
        statusIcon: <ConnectedIcon className={classes.connectedIcon} />,
        statusText: SPI_PAIR_FLOW.Transaction,
        button: (
          <Box>
            <Button
              className={classes.unpairButton}
              color="primary"
              onClick={() => handleUnPairClick(dispatch, pairFormValues.serialNumber)}
            >
              Unpair
            </Button>
            <Button className={classes.pairBtn} color="primary" component={Link} to="/" variant="contained">
              Go to Sample POS
            </Button>
          </Box>
        ),
      };
    default:
      return {
        statusTitle: SPI_PAIR_STATUS.Unpaired,
        statusIcon: <UnpairedIcon className={classes.unpairedIcon} />,
        statusText: SPI_PAIR_FLOW.Idle,
        button: (
          <Button
            className={classes.pairBtn}
            color="primary"
            disabled={isDisabled}
            onClick={() => handlePairClick(dispatch, pairFormValues)}
            variant="contained"
          >
            Pair
          </Button>
        ),
      };
  }
}
