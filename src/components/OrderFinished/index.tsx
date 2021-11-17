import React from 'react';
import { Grid } from '@material-ui/core';

import FlowPanel from '../FlowPanel';
import Layout from '../Layout';
import PaymentSummary from '../PaymentSummary';
import PurchaseFlow from '../PurchaseFlow';
import ReceiptPanel from '../TerminalsPage/TerminalDetails/ReceiptPanel';
import useStyles from './index.style';

function OrderFinished(): React.ReactElement {
  const classes = useStyles();

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <PaymentSummary />
        </Grid>
        <Grid item xs={3}>
          <ReceiptPanel />
        </Grid>
        <Grid item xs={4}>
          <FlowPanel>
            <PurchaseFlow />
          </FlowPanel>
          {/* <Order disablePayNow /> */}
        </Grid>
      </Grid>
    </Layout>
  );
}

export default OrderFinished;
