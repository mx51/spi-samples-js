import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import Layout from '../../Layout';
import { PaymentSummary } from '../../PaymentSummary/PaymentSummary';
import { TxLogItem, TxLogService } from '../../../services/txLogService';
import { SplitMode } from '../interfaces';

export type SplitReceiptPanelProps = {
  currentTerminal: ITerminalProps;
  splitMode: SplitMode;
  splitIndex: number;
  numberOfSplits: number;
  splitAmount: number;
  outstandingAmount: number;
  onClickNext: () => void;
};

export const SplitReceiptPanel: React.FC<SplitReceiptPanelProps> = ({
  currentTerminal,
  splitMode,
  splitIndex,
  numberOfSplits,
  splitAmount,
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
        splitTransaction={{ splitAmount, outstandingAmount, onClickNext, splitMode, numberOfSplits, splitIndex }}
      />
    </Layout>
  );
};
