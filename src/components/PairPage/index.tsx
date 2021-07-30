import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import useLocalStorage from '../../utils/hooks/useLocalStorage';
import Layout from '../Layout';
import FlowPanel from './FlowPanel';
import { FlowPanelInterface } from './FlowPanel/interfaces';
import useStyles from './index.styles';
import PairForm from './PairForm';
import PairStatus from './PairStatus';

const PairPage: React.FC = () => {
  const [flow, setFlow] = useLocalStorage('pairFlow', true);

  const handleDrawerToggle = () => {
    setFlow(!flow);
  };

  const classes = useStyles(flow as unknown as FlowPanelInterface);

  return (
    <Layout>
      <div className={classes.root}>
        <main className={flow ? `${classes.content} ${classes.contentShift}` : classes.content}>
          <Container maxWidth="md">
            <Grid container spacing={1}>
              <Grid item sm={8} xs={12} className={classes.pairFormContainer}>
                <PairForm />
              </Grid>
              <Grid item sm={4} xs={12} className={classes.pairStatusContainer}>
                <PairStatus open={flow} handleDrawerToggle={handleDrawerToggle} />
              </Grid>
            </Grid>
          </Container>
        </main>
        <FlowPanel flow={flow} />
      </div>
    </Layout>
  );
};

export default PairPage;
