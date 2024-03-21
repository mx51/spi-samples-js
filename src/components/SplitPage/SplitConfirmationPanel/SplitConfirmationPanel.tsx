import React, { useState } from 'react';
import { Box, Button, Container, Grid } from '@material-ui/core';
import { SummaryPanel } from '../SummaryPanel/SummaryPanel';
import { useStyles } from './SplitConfirmationPanel.styles';
import Order from '../../PurchasePage/Order';
import { SplitMode } from '../interfaces';
import { SplitAmountPanel } from '../SplitAmountPanel/SplitAmountPanel';

export type SplitConfirmationPanelProps = {
  splitMode: SplitMode;
  splitIndex: number;
  splitAmount: number;
  totalAmount: number;
  onClickNext: (splitAmount: number, outstandingAmount: number) => void;
};

export const SplitConfirmationPanel: React.FC<SplitConfirmationPanelProps> = ({
  splitMode,
  splitIndex,
  splitAmount,
  totalAmount,
  onClickNext,
}) => {
  const classes = useStyles();

  const [newSplitAmount, setNewSplitAmount] = useState(splitAmount);

  return (
    <Grid container>
      <Grid item xs={4}>
        <Order disablePayNow isSubtotalEditable={false} bottomButton="cancelSplit" />
      </Grid>
      <Grid item xs={8}>
        <Container className={classes.container}>
          <span>Confirmation</span>
          <SummaryPanel
            label={`Split #${splitIndex + 1}`}
            amount={splitAmount}
            hideAmount={splitMode === 'splitByAmount'}
          />
          {splitMode === 'splitByAmount' && (
            <SplitAmountPanel
              totalAmount={totalAmount}
              splitAmount={newSplitAmount}
              onSplitAmountChange={setNewSplitAmount}
            />
          )}
          <Box className={classes.nextButtonRow}>
            <Button
              variant="contained"
              focusRipple
              classes={{ root: classes.nextBtn, label: classes.nextBtnLabel }}
              onClick={() => onClickNext(newSplitAmount, totalAmount - newSplitAmount)}
            >
              Next
            </Button>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};
