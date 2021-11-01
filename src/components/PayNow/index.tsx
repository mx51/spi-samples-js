import React from 'react';
import { Grid } from '@material-ui/core';
import Layout from '../Layout';
import OrderConfirmation from '../OrderConfirmation';
import Order from '../PurchasePage/Order';
import useStyles from './index.styles';

function PayNow(): React.ReactElement {
  const classes = useStyles();

  return (
    <Layout>
      <Grid container>
        <Grid item xs={4} className={classes.root}>
          <Order disablePayNow />
        </Grid>
        <Grid item xs={8}>
          <OrderConfirmation />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default PayNow;
