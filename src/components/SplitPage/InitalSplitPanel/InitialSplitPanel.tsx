import { Box, Button, Container, FormHelperText, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Order from '../../PurchasePage/Order';
import { SummaryPanel } from '../SummaryPanel/SummaryPanel';
import { SplitOptionsPanel } from '../SplitOptionsPanel/SplitOptionsPanel';
import { SplitNumberPanel } from '../SplitNumberPanel/SplitNumberPanel';
import { SplitMode } from '../interfaces';
import { useStyles } from './InitialSplitPanel.styles';
import { SplitAmountPanel } from '../SplitAmountPanel/SplitAmountPanel';

export type InitialSplitPanelProps = {
  totalAmount: number;
  onClickNext: (splitMode: SplitMode, numberOfSplits: number, splitAmount: number) => void;
};

export const InitialSplitPanel: React.FC<InitialSplitPanelProps> = ({ totalAmount, onClickNext }) => {
  const classes = useStyles();

  const [splitMode, setSplitMode] = useState<SplitMode>('splitEvenly');
  const [numberOfSplits, setNumberOfSplits] = useState(2);
  const [splitAmount, setSplitAmount] = useState(0);

  const handleClick = () => {
    onClickNext(splitMode, numberOfSplits, splitAmount);
  };

  useEffect(() => {
    setSplitAmount(0);
  }, [totalAmount]);

  const isNextButtonDisabled =
    totalAmount <= 0 ||
    (splitMode === 'splitEvenly' && numberOfSplits <= 0) ||
    (splitMode === 'splitByAmount' && splitAmount <= 0);

  return (
    <Grid container>
      <Grid item xs={4}>
        <Order disablePayNow isSubtotalEditable bottomButton="amendOrder" />
      </Grid>
      <Grid item xs={8}>
        <Container className={classes.container}>
          <SummaryPanel label="Split" amount={totalAmount} />
          <SplitOptionsPanel splitOption={splitMode} onSplitOptionChange={setSplitMode} />
          {splitMode === 'splitEvenly' && (
            <SplitNumberPanel
              totalAmount={totalAmount}
              numberOfSplits={numberOfSplits}
              onNumberOfSplitsChange={setNumberOfSplits}
            />
          )}
          {splitMode === 'splitByAmount' && (
            <SplitAmountPanel
              totalAmount={totalAmount}
              splitAmount={splitAmount}
              onSplitAmountChange={setSplitAmount}
            />
          )}
          {totalAmount <= 0 && (
            <FormHelperText error className={classes.errorText}>
              Please set a value for the subtotal amount
            </FormHelperText>
          )}
          <Box className={classes.nextButtonRow}>
            <Button
              variant="contained"
              focusRipple
              classes={{ root: classes.nextBtn, label: classes.nextBtnLabel }}
              onClick={handleClick}
              disabled={isNextButtonDisabled}
            >
              Next
            </Button>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};
