import React from 'react';
import { Grid } from '@material-ui/core';
import { PATH_PRE_AUTH } from '../../definitions/constants/routerConfigs';
import Layout from '../Layout';
import OrderConfirmation from '../OrderConfirmation';

const PreAuthPage: React.FC = () => (
  <Layout>
    <Grid>
      <Grid>
        <OrderConfirmation title="Pre Auth" pathname={PATH_PRE_AUTH} currentAmount={0} editSubtotal />
      </Grid>
    </Grid>
  </Layout>
);

export default PreAuthPage;
