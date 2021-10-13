import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  isPairDisabled,
  selectPairFormSerialNumber,
  selectPairFormValues,
} from '../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { initialSpiFormData } from '../../../utils/common/pair/pairFormHelpers';
import { handlePairClick } from '../../../utils/common/pair/pairStatusHelpers';
import useStyles from './index.styles';
import { ISPIFormData } from './interfaces';
import PairConfiguration from './PairConfiguration';
import PaymentType from './PaymentType';

const PairForm: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  // spi pair form state tracker
  const [spi, setSpi] = useState<ISPIFormData>(initialSpiFormData);
  // read redux store states
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const terminal = useAppSelector(terminalInstance(pairFormSerialNumber)) as ITerminalProps;

  const pairFormValues = useAppSelector(selectPairFormValues);
  const pairBtnDisabled = useAppSelector(isPairDisabled);

  return (
    <Grid container direction="column" className={classes.formContainer}>
      <form autoComplete="off" className={classes.pairForm}>
        <PaymentType terminal={terminal} />
        <PairConfiguration setSpi={setSpi} spi={spi} terminal={terminal} />
        <Button
          className={classes.pairBtn}
          color="primary"
          disabled={
            pairBtnDisabled ||
            terminal?.status === SPI_PAIR_STATUS.PairedConnecting ||
            terminal?.status === SPI_PAIR_STATUS.PairedConnected
          }
          data-test-id="pairBtn"
          onClick={() => handlePairClick(dispatch, pairFormValues)}
          variant="contained"
        >
          Pair
        </Button>
      </form>
    </Grid>
  );
};

export default PairForm;
