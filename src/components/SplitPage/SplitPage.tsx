import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { orderPromptForCashoutSelector, orderTotalSelector } from '../../redux/reducers/ProductSlice/productSelector';
import Layout from '../Layout';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import {
  isTerminalTxFlowSuccess,
  terminalInstance,
  terminalTxFlowFinishedTracker,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { SplitMode } from './interfaces';
import { InitialSplitPanel } from './InitalSplitPanel/InitialSplitPanel';
import { SplitConfirmationPanel } from './SplitConfirmationPanel/SplitConfirmationPanel';
import TransactionProgressModal from '../TransactionProgressModal';
import { SPI_TRANSACTION_TYPES } from '../../definitions/constants/commonConfigs';
import { cancelTransaction, initiatePurchase } from '../../utils/common/purchase/purchaseHelper';
import { SplitReceiptPanel } from './SplitReceiptPanel/SplitReceiptPanel';
import { PATH_PURCHASE } from '../../definitions/constants/routerConfigs';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';

type Stage = 'initialSplit' | 'splitConfirmation' | 'splitReceipt';

function calculateSplitArray(totalAmount: number, splitNumber: number): number[] {
  if (splitNumber === 1) {
    return [totalAmount];
  }

  const result = Array(splitNumber).fill(Math.floor(totalAmount / splitNumber));
  result[0] = totalAmount - (splitNumber - 1) * Math.floor(totalAmount / splitNumber);
  return result;
}

export const SplitPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const totalAmount = useSelector(orderTotalSelector);
  const promptForCashout = useSelector(orderPromptForCashoutSelector);

  const selectedTerminalId = useSelector(selectedTerminalIdSelector);
  const selectedTerminal = useSelector(terminalInstance(selectedTerminalId)) as ITerminalProps;
  const isTxFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminalId)) ?? false;
  const isTxSuccess = useSelector(isTerminalTxFlowSuccess(selectedTerminalId));

  const [currentSplitNumber, setCurrentSplitNumber] = useState(0);
  const [splitArray, setSplitArray] = useState<number[]>([]);
  const [outstandingAmount, setOutstandingAmount] = useState(0);

  const [stage, setStage] = useState<Stage>('initialSplit');
  const [showModal, setShowModal] = useState(false);

  const backToPurchase = () => {
    history.push(PATH_PURCHASE);
  };

  const handleInitialClick = (splitMode: SplitMode, splitNumber: number) => {
    setCurrentSplitNumber(0);
    setOutstandingAmount(totalAmount);
    if (splitMode === 'splitEvenly') {
      setSplitArray(calculateSplitArray(totalAmount, splitNumber));
    }
    setStage('splitConfirmation');
  };

  const handleConfirmationClickNext = () => {
    setShowModal(true);
    initiatePurchase(selectedTerminalId, splitArray[currentSplitNumber], 0, 0, 0, promptForCashout);
  };

  const handleReceiptClickNext = () => {
    if (currentSplitNumber >= splitArray.length - 1) {
      dispatch(clearAllProducts());
      backToPurchase();
    }
    setCurrentSplitNumber(currentSplitNumber + 1);
    setStage('splitConfirmation');
  };

  const handleModalTransactionDone = () => {
    if (isTxSuccess) {
      setOutstandingAmount(outstandingAmount - splitArray[currentSplitNumber]);
      setShowModal(false);
      setStage('splitReceipt');
    } else {
      backToPurchase();
    }
  };

  return (
    <Layout>
      {stage === 'initialSplit' && <InitialSplitPanel totalAmount={totalAmount} onClickNext={handleInitialClick} />}

      {stage === 'splitConfirmation' && (
        <SplitConfirmationPanel
          splitNumber={currentSplitNumber}
          splitAmount={splitArray[currentSplitNumber]}
          onClickNext={handleConfirmationClickNext}
        />
      )}

      {stage === 'splitReceipt' && (
        <SplitReceiptPanel
          currentTerminal={selectedTerminal}
          isTxSuccess={isTxSuccess}
          isTxFinished={isTxFinished}
          currentSplitNumber={currentSplitNumber}
          totalSplitNumber={splitArray.length}
          amount={splitArray[currentSplitNumber]}
          outstandingAmount={outstandingAmount}
          onClickNext={handleReceiptClickNext}
        />
      )}

      {showModal && (
        <TransactionProgressModal
          terminalId={selectedTerminalId}
          transactionType={SPI_TRANSACTION_TYPES.Purchase}
          transactionDesc=""
          isFinished={isTxFinished}
          isSuccess={isTxSuccess}
          onCancelTransaction={() => {
            cancelTransaction(selectedTerminalId);
            backToPurchase();
          }}
          onRetryTransaction={() => {
            initiatePurchase(selectedTerminalId, splitArray[currentSplitNumber], 0, 0, 0, promptForCashout);
          }}
          onDone={handleModalTransactionDone}
        />
      )}
    </Layout>
  );
};
