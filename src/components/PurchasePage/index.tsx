import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Layout from '../Layout';
import NoTerminalPage from '../NoTerminalPage';
import useStyles from './index.styles';
import Order from './Order';
import ProductList from './ProductList';

function Purchase(): React.ReactElement {
  const classes = useStyles();
  return (
    <Layout>
      <Grid container>
        <Grid item xs={8} className={classes.root}>
          <Typography variant="h6" component="h1">
            Purchase
          </Typography>
          <NoTerminalPage />
          <ProductList />
        </Grid>
        <Grid item xs={4}>
          <Order />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Purchase;
