import React, { useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectedShowFlowPanel } from '../../redux/reducers/CommonSlice/commonSliceSelectors';
import { resetPairForm } from '../../redux/reducers/PairFormSlice/pairFormSlice';
import FlowPanel from '../FlowPanel';
import { IFlowPanel } from '../FlowPanel/interfaces';
import PairFlow from '../FlowPanel/PairFlow';
import Layout from '../Layout';
import SnackbarWrapper from '../Snackbar';
import useStyles from './index.styles';
import PairForm from './PairForm';
import PairStatus from './PairStatus';

const PairPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const showFlowPanel = useAppSelector(selectedShowFlowPanel);
  const classes = useStyles(showFlowPanel as unknown as IFlowPanel);

  useEffect(() => {
    dispatch(resetPairForm()); // reset paired form when required
  }, [dispatch]);

  return (
    <Layout>
      <div className={classes.root}>
        <div className={showFlowPanel ? `${classes.content} ${classes.contentShift}` : classes.content}>
          <Container maxWidth="md">
            <Grid container>
              <Grid item sm={8} xs={12} className={classes.pairFormContainer}>
                <PairForm />
              </Grid>
              <Grid item sm={4} xs={12} className={classes.pairStatusContainer}>
                <PairStatus />
              </Grid>
            </Grid>
          </Container>
        </div>
        <FlowPanel>
          <PairFlow />
        </FlowPanel>
        <SnackbarWrapper />
      </div>
    </Layout>
  );
};

export default PairPage;
