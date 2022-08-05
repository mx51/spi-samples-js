import React from 'react';
import { Grid, Typography, Container } from '@material-ui/core';
import Layout from '../Layout';
import AutoAddressCheck from './AutoAddressCheck';
import useStyles from './index.styles';

const SupportToolsPage: React.FC = () => {
  const classes = useStyles();

  return (
    <Layout>
      <Container maxWidth="md" className={classes.root}>
        <Grid container>
          <Grid item xs={8}>
            <Typography variant="h6" component="h1">
              Support Tools
            </Typography>
            <Typography className={classes.title}>Auto Address Check</Typography>
            <AutoAddressCheck />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default SupportToolsPage;
