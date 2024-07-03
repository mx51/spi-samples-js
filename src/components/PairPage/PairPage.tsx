import React, { useEffect } from 'react';
import { Button, Container, Grid } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectedShowFlowPanel } from '../../redux/reducers/CommonSlice/commonSliceSelectors';
import { resetPairForm, updatePairForm } from '../../redux/reducers/PairFormSlice/pairFormSlice';
import FlowPanel from '../FlowPanel';
import { IFlowPanel } from '../FlowPanel/interfaces';
import PairFlow from '../FlowPanel/PairFlow';
import Layout from '../Layout';
import SnackbarWrapper from '../Snackbar';
import useStyles from './index.styles';
import PairForm from './PairForm';
import PairStatus from './PairStatus';
import { PATH_TERMINALS } from '../../definitions/constants/routerConfigs';
import { terminalInstance } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { IPairFormParams } from '../../redux/reducers/PairFormSlice/interfaces';

const PairPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const showFlowPanel = useAppSelector(selectedShowFlowPanel);
  const classes = useStyles(showFlowPanel as unknown as IFlowPanel);
  const { id } = useParams<{ id: string }>();
  const currentTerminal = useAppSelector<ITerminalProps | undefined>((state) =>
    id ? terminalInstance(id)(state) : undefined
  );

  const goToTerminals = () => {
    history.push(PATH_TERMINALS);
  };

  useEffect(() => {
    if (!currentTerminal) {
      dispatch(resetPairForm()); // reset paired form when required
    } else {
      const action: Partial<IPairFormParams> = {
        acquirerCode: {
          value: currentTerminal.acquirerCode,
          isValid: true,
          option: currentTerminal.acquirerCode,
        },
        deviceAddress: {
          value: currentTerminal.deviceAddress,
          isValid: true,
        },
        posId: {
          value: currentTerminal.posId,
          isValid: true,
        },
        serialNumber: {
          value: currentTerminal.serialNumber,
          isValid: true,
        },
        testMode: currentTerminal.testMode,
      };
      dispatch(updatePairForm(action));
    }
  }, [dispatch]);

  return (
    <Layout>
      <div className={classes.root}>
        <div className={showFlowPanel ? `${classes.content} ${classes.contentShift}` : classes.content}>
          <Container maxWidth="md">
            <Grid container>
              <Grid item sm={8} xs={12} className={classes.pairFormContainer}>
                <Button className={classes.backLink} onClick={() => goToTerminals()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#393F73" />
                  </svg>
                  <span className={classes.backLinkText}>Back to Terminals</span>
                </Button>
                <PairForm currentTerminal={currentTerminal} />
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
