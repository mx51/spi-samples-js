import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
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
import { TxLogServiceMapper } from '../../services/txLogService';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';

function OrderFinished(): React.ReactElement {
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal.id)) as ITerminalProps;
  const { typePath } = useSelector(terminalTransactionTypeObject(selectedTerminal.id));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAllProducts());
  }, []);

  if (!currentTerminal?.txFlow) return <div>Could not load transaction.</div>;

  const { txFlow, posId, merchantId, terminalId } = currentTerminal;
  const currentTransaction = TxLogServiceMapper.toTxLogItem({
    txFlow,
    posId,
    mid: merchantId!,
    tid: terminalId!,
  });

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
