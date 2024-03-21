import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import {
  terminalInstance,
  terminalTransactionTypeObject,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import FlowPanel from '../FlowPanel';
import Layout from '../Layout';
import PurchaseFlow from '../PurchaseFlow';
import { PaymentSummary } from '../PaymentSummary/PaymentSummary';
import { TxLogItem, TxLogService } from '../../services/txLogService';

function OrderFinished(): React.ReactElement {
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const { typePath } = useSelector(terminalTransactionTypeObject(selectedTerminal));
  const [currentTransaction, setcurrentTransaction] = useState<TxLogItem>();

  const currentTxId = currentTerminal?.txFlow?.posRefId;

  useEffect(() => {
    if (!currentTransaction && currentTxId) {
      setcurrentTransaction(TxLogService.findTxByPosRefId(currentTxId));
    }
  }, [currentTransaction]);

  if (!currentTransaction) return <div>Could not load transaction.</div>;

  return (
    <Layout>
      <PaymentSummary currentTransaction={currentTransaction} typePath={typePath} />
      <Grid item xs={4}>
        <FlowPanel>
          <PurchaseFlow />
        </FlowPanel>
      </Grid>
    </Layout>
  );
}

export default OrderFinished;
