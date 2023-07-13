import React from 'react';
import { Grid } from '@material-ui/core';
import { PATH_CASH_OUT } from '../../definitions/constants/routerConfigs';
import Layout from '../Layout';
import OrderConfirmation from '../OrderConfirmation';

function CashoutPage(): React.ReactElement {
  return (
    <Layout>
      <Grid container>
        <Grid item xs={12}>
          <OrderConfirmation title="Cashout" pathname={PATH_CASH_OUT} currentAmount={0} editSubtotal />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default CashoutPage;
