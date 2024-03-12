import React from 'react';
import { Box, Button, Container, Grid } from '@material-ui/core';
import { SummaryPanel } from '../SummaryPanel/SummaryPanel';
import { useStyles } from './SplitConfirmationPanel.styles';
import Order from '../../PurchasePage/Order';

export type SplitConfirmationPanelProps = {
  splitNumber: number;
  splitAmount: number;
  onClickNext: () => void;
};

export const SplitConfirmationPanel: React.FC<SplitConfirmationPanelProps> = ({
  splitNumber,
  splitAmount,
  onClickNext,
}) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={4}>
        <Order disablePayNow isSubtotalEditable={false} bottomButton="cancelSplit" />
      </Grid>
      <Grid item xs={8}>
        <Container className={classes.container}>
          <span>Confirmation</span>
          <SummaryPanel label={`Split #${splitNumber + 1}`} amount={splitAmount} />
          <Box className={classes.nextButtonRow}>
            <Button
              variant="contained"
              focusRipple
              classes={{ root: classes.nextBtn, label: classes.nextBtnLabel }}
              onClick={onClickNext}
            >
              Next
            </Button>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};
