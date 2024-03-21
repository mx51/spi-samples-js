import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PATH_TRANSACTIONS } from '../../../definitions/constants/routerConfigs';
import { TxLogItem, TxLogService } from '../../../services/txLogService';
import Layout from '../../Layout';
import { PaymentSummary } from '../../PaymentSummary/PaymentSummary';

export const TransactionDetailsPage: React.FC = () => {
  const { pathname } = useLocation();
  const currentTransactionId = pathname?.split(`${PATH_TRANSACTIONS}/`)[1];
  const [currentTransaction, setcurrentTransaction] = useState<TxLogItem>();

  useEffect(() => {
    if (!currentTransaction) {
      setcurrentTransaction(TxLogService.findTxByPosRefId(currentTransactionId));
    }
  }, [currentTransaction]);

  if (!currentTransaction) return <div>Could not load transaction.</div>;

  return (
    <Layout>
      <PaymentSummary currentTransaction={currentTransaction} transactionHistory />
    </Layout>
  );
};
