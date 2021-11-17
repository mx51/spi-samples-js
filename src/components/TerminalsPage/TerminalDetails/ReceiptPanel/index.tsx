import React from 'react';
import { Box } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import selectedTerminalIdSelector from '../../../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import useStyles from './index.styles';

export default function ReceiptPanel(): React.ReactElement {
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;

  const classes = useStyles();
  return (
    <Box className={classes.receiptBoxWrapper}>
      <Box className={classes.receiptBox}>
        <Typography variant="h6" component="h1">
          Receipt
        </Typography>
        <pre>{currentTerminal?.txFlow?.response?.data.merchantReceipt}</pre>
      </Box>
    </Box>
  );
}
