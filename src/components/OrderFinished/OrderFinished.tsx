import React from 'react';
import { Grid } from '@material-ui/core';

import { useSelector } from 'react-redux';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import FlowPanel from '../FlowPanel';
import Layout from '../Layout';
import PaymentSummary from '../PaymentSummary';
import PurchaseFlow from '../PurchaseFlow';
import ReceiptPanel from '../ReceiptPanel';
import useStyles from './index.style';

function OrderFinished(): React.ReactElement {
  const classes = useStyles();
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;

  return (
    <Layout>
      <Grid container>
        <Grid item xs={12} sm={5}>
          <PaymentSummary />
        </Grid>
        <Grid item xs={12} sm={3}>
          <ReceiptPanel title="Receipt" css={classes.receiptBoxWrapper}>
            <pre>{currentTerminal?.txFlow?.response?.data.merchantReceipt}</pre>
          </ReceiptPanel>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FlowPanel>
            <PurchaseFlow />
          </FlowPanel>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default OrderFinished;
