import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { isPaired } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import Layout from '../Layout';
import NoTerminalPage from '../NoTerminalPage';
import useStyles from './index.styles';
import Order from './Order';
import ProductList from './ProductList';

function Purchase(): React.ReactElement {
  const classes = useStyles();
  const isTerminalPaired: boolean = useSelector(isPaired);

  return (
    <Layout>
      <Grid container>
        <Grid item xs={12} sm={8} className={classes.root}>
          <Typography variant="h6" component="h1">
            Purchase
          </Typography>
          {!isTerminalPaired && <NoTerminalPage />}
          <ProductList />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Order disablePayNow={false} />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Purchase;
