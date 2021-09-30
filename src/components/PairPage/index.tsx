import React, { useCallback, useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useAppDispatch } from '../../redux/hooks';
import { readTerminalPairError, updatePairFormParams } from '../../redux/reducers/PairFormSlice/pairFormSlice';
import FlowPanel from '../FlowPanel';
import { IFlowPanel } from '../FlowPanel/interfaces';
import Layout from '../Layout';
import SnackbarWrapper from '../Snackbar';
import useStyles from './index.styles';
import PairForm from './PairForm';
import PairStatus from './PairStatus';

const PairPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [flow, setFlow] = useState(false); // By default, flow is closed

  const handleDrawerToggle = () => {
    setFlow(!flow);
  };

  const handlePairFormReset = useCallback(() => {
    dispatch(readTerminalPairError({ isShown: false, message: '' }));
    dispatch(updatePairFormParams({ key: 'serialNumber', value: '' }));
  }, [dispatch]);

  const classes = useStyles(flow as unknown as IFlowPanel);

  useEffect(() => {
    // cleanup status panel after initial connected/paired
    handlePairFormReset();
  }, [dispatch]);

  return (
    <Layout>
      <div className={classes.root}>
        <main className={flow ? `${classes.content} ${classes.contentShift}` : classes.content}>
          <Container maxWidth="md">
            <Grid container>
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
        <SnackbarWrapper />
      </div>
    </Layout>
  );
};

export default PairPage;
