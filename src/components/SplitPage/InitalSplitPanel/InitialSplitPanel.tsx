import { Box, Button, Container, Grid } from '@material-ui/core';
import React, { useState } from 'react';
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
  const [numberOfSplits, setNumberOfSplits] = useState(0);
  const [splitAmount, setSplitAmount] = useState(totalAmount);

  const handleClick = () => {
    onClickNext(splitMode, numberOfSplits, splitAmount);
  };

  const isNextButtonDisabled = totalAmount <= 0 || (splitMode === 'splitEvenly' && numberOfSplits <= 0);

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
