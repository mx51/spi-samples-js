import React from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import {
  isTerminalTxFlowSuccess,
  terminalInstance,
  terminalTransactionTypeObject,
  terminalTxFlowFinishedTracker,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import FlowPanel from '../FlowPanel';
import Layout from '../Layout';
import PurchaseFlow from '../PurchaseFlow';
import CustomContentPanel from '../CustomContentPanel';
import useStyles from './index.style';
import { PaymentSummary } from '../PaymentSummary/PaymentSummary';

function OrderFinished(): React.ReactElement {
  const classes = useStyles();
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const { typePath } = useSelector(terminalTransactionTypeObject(selectedTerminal));
  const isTxFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminal));
  const isTxSuccess = useSelector(isTerminalTxFlowSuccess(selectedTerminal));

  return (
    <Layout>
      <Grid container>
        <Grid item xs={5}>
          <PaymentSummary
            typePath={typePath}
            isTxFinished={Boolean(isTxFinished)}
            isTxSuccess={Boolean(isTxSuccess)}
            deviceAddress={currentTerminal?.deviceAddress}
            posId={currentTerminal?.posId}
            serialNumber={currentTerminal?.serialNumber}
            txFlow={currentTerminal?.txFlow}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomContentPanel title="Receipt" css={classes.receiptBoxWrapper}>
            <pre>{currentTerminal?.txFlow?.response?.data.merchantReceipt}</pre>
          </CustomContentPanel>
        </Grid>
        <Grid item xs={4}>
          <FlowPanel>
            <PurchaseFlow />
          </FlowPanel>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default OrderFinished;
