import React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { useStyles } from './SummaryPanel.styles';
import currencyFormat from '../../../utils/common/intl/currencyFormatter';

export type SummaryPanelProps = {
  label: string;
  amount: number;
};

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ label, amount }) => {
  const classes = useStyles();

  return (
    <Box className={classes.panel}>
      <Typography className={classes.label}>{label}</Typography>
      <Paper className={classes.amount}>{currencyFormat(amount / 100)}</Paper>
    </Box>
  );
};
