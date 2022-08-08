import React from 'react';
import { Container } from '@material-ui/core';
import Layout from '../Layout';
import AutoAddressCheck from './AutoAddressCheck';
import useStyles from './index.styles';

const SupportToolsPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Container className={classes.root}>
        <AutoAddressCheck />
      </Container>
    </Layout>
  );
};

export default SupportToolsPage;
