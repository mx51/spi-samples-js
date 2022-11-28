import React from 'react';
import { Grid } from '@material-ui/core';
import { PATH_REFUND } from '../../definitions/constants/routerConfigs';
import Layout from '../Layout';
import OrderConfirmation from '../OrderConfirmation';

function RefundPage(): React.ReactElement {
  return (
    <Layout>
      <Grid container>
        <Grid item xs={12}>
          <OrderConfirmation title="Refund" pathname={PATH_REFUND} currentAmount={0} />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default RefundPage;
