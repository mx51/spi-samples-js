import React from 'react';
import { Grid } from '@material-ui/core';

import FlowPanel from '../FlowPanel';
import Layout from '../Layout';
import PaymentSummary from '../PaymentSummary';
import useStyles from './index.style';

function OrderFinished(): React.ReactElement {
  const classes = useStyles();

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <PaymentSummary />
        </Grid>
        <Grid item xs={4}>
          <p>Receipt</p>
        </Grid>
        <Grid item xs={4}>
          <FlowPanel>Work in progress..</FlowPanel>
          {/* <Order disablePayNow /> */}
        </Grid>
      </Grid>
    </Layout>
  );
}

export default OrderFinished;
