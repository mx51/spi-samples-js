import React from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { PATH_PAY_NOW } from '../../definitions/constants/routerConfigs';
import { orderTotalSelector } from '../../redux/reducers/ProductSlice/productSelector';
import Layout from '../Layout';
import OrderConfirmation from '../OrderConfirmation';
import Order from '../PurchasePage/Order';
import useStyles from './index.styles';

function PayNow(): React.ReactElement {
  const classes = useStyles();
  const originalTotalAmount: number = useSelector(orderTotalSelector);

  return (
    <Layout>
      <Grid container>
        <Grid item xs={4} className={classes.root}>
          <Order disablePayNow />
        </Grid>
        <Grid item xs={8}>
          <OrderConfirmation title="Pay" pathname={PATH_PAY_NOW} currentAmount={originalTotalAmount} />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default PayNow;
