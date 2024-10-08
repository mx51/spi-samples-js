import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  isPairDisabled,
  selectPairFormSerialNumber,
  selectPairFormValues,
} from '../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { isTerminalUnpaired } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { handlePairClick } from '../../../utils/common/pair/pairStatusHelpers';
import useStyles from './index.styles';
import PairConfiguration from './PairConfiguration';
import { ITerminal } from './interfaces';

const PairForm: React.FC<ITerminal> = ({ currentTerminal }: ITerminal) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  // read redux store states
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const terminalUnpaired = useAppSelector(isTerminalUnpaired(pairFormSerialNumber));
  const pairFormValues = useAppSelector(selectPairFormValues);
  const pairDisabled = useAppSelector(isPairDisabled);

  const handlePair = () => handlePairClick(dispatch, pairFormValues);

  return (
    <Grid container direction="column" className={classes.formContainer}>
      <form autoComplete="off">
        <PairConfiguration />
        <Button
          className={classes.pairBtn}
          color="primary"
          disabled={(!currentTerminal && pairDisabled) || terminalUnpaired}
          data-test-id="pairBtn"
          onClick={handlePair}
          variant="contained"
        >
          Pair
        </Button>
      </form>
    </Grid>
  );
};

export default PairForm;
