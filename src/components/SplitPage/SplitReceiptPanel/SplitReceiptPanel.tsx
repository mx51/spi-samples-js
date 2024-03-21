import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import Layout from '../../Layout';
import { PaymentSummary } from '../../PaymentSummary/PaymentSummary';
import { TxLogItem, TxLogService } from '../../../services/txLogService';

export type SplitReceiptPanelProps = {
  currentTerminal: ITerminalProps;
  currentSplitNumber: number;
  totalSplitNumber: number;
  amount: number;
  outstandingAmount: number;
  onClickNext: () => void;
};

export const SplitReceiptPanel: React.FC<SplitReceiptPanelProps> = ({
  currentTerminal,
  currentSplitNumber,
  totalSplitNumber,
  amount,
  outstandingAmount,
  onClickNext,
}) => {
  const { pathname } = useLocation();
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
      <PaymentSummary
        currentTransaction={currentTransaction}
        typePath={pathname}
        splitTransaction={{ currentSplitNumber, totalSplitNumber, amount, outstandingAmount, onClickNext }}
      />
    </Layout>
  );
};
