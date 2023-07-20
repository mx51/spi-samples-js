import React from 'react';
import { Backdrop, Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { orderOverrideSubtotalSelector } from '../../redux/reducers/ProductSlice/productSelector';
import { isPaired } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import Layout from '../Layout';
import NoTerminalPage from '../NoTerminalPage';
import useStyles from './index.styles';
import Order from './Order';
import ProductList from './ProductList';

function Purchase(): React.ReactElement {
  const classes = useStyles();
  const isTerminalPaired: boolean = useSelector(isPaired);
  const isOverrideSubtotalAmount = useSelector(orderOverrideSubtotalSelector);

  return (
    <Layout>
      <Grid container>
        <Grid item xs={8} className={classes.root}>
          <Backdrop className={classes.backdrop} open={isOverrideSubtotalAmount} />
          <Typography variant="h6" component="h1">
            Purchase
          </Typography>
          {!isTerminalPaired && <NoTerminalPage />}
          <ProductList />
        </Grid>
        <Grid item xs={4}>
          <Order disablePayNow={false} />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Purchase;
