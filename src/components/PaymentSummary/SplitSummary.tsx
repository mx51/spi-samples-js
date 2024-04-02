import React from 'react';
import { Box, Paper } from '@material-ui/core';
import { useStyles } from '../SplitPage/SplitReceiptPanel/SplitReceiptPanel.styles';
import currencyFormat from '../../utils/common/intl/currencyFormatter';

type Props = {
  splitAmount: number;
  outstandingAmount: number;
  splitIndex: number;
  splitMode: string;
  numberOfSplits: number;
};

export const SplitSummary = ({ splitAmount, outstandingAmount, splitIndex, splitMode, numberOfSplits }: Props) => {
  const classes = useStyles();

  return (
    <Box className={classes.paper} component={Paper}>
      <span className={classes.splitIndexRow}>
        Split #{splitIndex + 1} {splitMode === 'splitEvenly' && `of ${numberOfSplits}`}
      </span>
      {currencyFormat(splitAmount / 100)}
      <Box className={classes.outstandingAmountRow}>
        <span>Outstanding amount</span>
        <span>{currencyFormat(outstandingAmount / 100)}</span>
      </Box>
    </Box>
  );
};
