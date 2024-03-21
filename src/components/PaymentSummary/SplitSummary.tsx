import React from 'react';
import { Box, Paper } from '@material-ui/core';
import { useStyles } from '../SplitPage/SplitReceiptPanel/SplitReceiptPanel.styles';
import currencyFormat from '../../utils/common/intl/currencyFormatter';

type Props = {
  currentSplitNumber: number;
  totalSplitNumber: number;
  amount: number;
  outstandingAmount: number;
};

export const SplitSummary = ({ currentSplitNumber, totalSplitNumber, amount, outstandingAmount }: Props) => {
  const classes = useStyles();

  return (
    <Box className={classes.paper} component={Paper}>
      <span className={classes.splitNumberRow}>
        Split {currentSplitNumber + 1} of {totalSplitNumber}
      </span>
      {currencyFormat(amount / 100)}
      <Box className={classes.outstandingAmountRow}>
        <span>Outstanding amount</span>
        <span>{currencyFormat(outstandingAmount / 100)}</span>
      </Box>
    </Box>
  );
};
