import React, { useReducer } from 'react';
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

type State = {
  stage: Stage;
  splitMode: SplitMode;
  splitArray: number[];
  currentSplitNumber: number;
  outstandingAmount: number;
  showModal?: boolean;
};

type Action =
  | { type: 'startSplit'; splitMode: SplitMode; splitNumber: number }
  | { type: 'startTransaction' }
  | { type: 'showReceipt' }
  | { type: 'nextSplit' };

function calculateSplitArray(totalAmount: number, splitNumber: number): number[] {
  if (splitNumber === 1) {
    return [totalAmount];
  }

  const result = Array(splitNumber).fill(Math.floor(totalAmount / splitNumber));
  result[0] = totalAmount - (splitNumber - 1) * Math.floor(totalAmount / splitNumber);
  return result;
}

export const SplitPage: React.FC = () => {
  const appDispatch = useDispatch();
  const history = useHistory();

  const totalAmount = useSelector(orderTotalSelector);
  const promptForCashout = useSelector(orderPromptForCashoutSelector);

  const selectedTerminalId = useSelector(selectedTerminalIdSelector);
  const selectedTerminal = useSelector(terminalInstance(selectedTerminalId)) as ITerminalProps;
  const isTxFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminalId)) ?? false;
  const isTxSuccess = useSelector(isTerminalTxFlowSuccess(selectedTerminalId));

  const backToPurchase = () => {
    history.push(PATH_PURCHASE);
  };

  const reducer = (currentState: State, action: Action): State => {
    if (action.type === 'startSplit') {
      if (action.splitMode === 'splitEvenly') {
        return {
          stage: 'splitConfirmation',
          splitMode: action.splitMode,
          splitArray: calculateSplitArray(totalAmount, action.splitNumber),
          currentSplitNumber: 0,
          outstandingAmount: totalAmount,
        };
      }
      return currentState;
    }
    if (action.type === 'startTransaction') {
      const splitAmount = currentState.splitArray[currentState.currentSplitNumber];
      initiatePurchase(selectedTerminalId, splitAmount, 0, 0, 0, promptForCashout);

      return {
        ...currentState,
        showModal: true,
      };
    }
    if (action.type === 'showReceipt') {
      const splitAmount = currentState.splitArray[currentState.currentSplitNumber];

      return {
        ...currentState,
        stage: 'splitReceipt',
        outstandingAmount: currentState.outstandingAmount - splitAmount,
        showModal: false,
      };
    }
    if (action.type === 'nextSplit') {
      if (currentState.currentSplitNumber >= currentState.splitArray.length - 1) {
        appDispatch(clearAllProducts());
        backToPurchase();
      }
      return {
        ...currentState,
        stage: 'splitConfirmation',
        currentSplitNumber: currentState.currentSplitNumber + 1,
      };
    }
    return currentState;
  };
  const [state, dispatch] = useReducer(reducer, {
    stage: 'initialSplit',
    splitMode: 'splitEvenly',
    splitArray: [],
    currentSplitNumber: 0,
    outstandingAmount: 0,
  });

  return (
    <Layout>
      {state.stage === 'initialSplit' && (
        <InitialSplitPanel
          totalAmount={totalAmount}
          onClickNext={(splitMode, splitNumber) => {
            dispatch({
              type: 'startSplit',
              splitMode,
              splitNumber,
            });
          }}
        />
      )}

      {state.stage === 'splitConfirmation' && (
        <SplitConfirmationPanel
          splitNumber={state.currentSplitNumber}
          splitAmount={state.splitArray[state.currentSplitNumber]}
          onClickNext={() => {
            dispatch({
              type: 'startTransaction',
            });
          }}
        />
      )}

      {state.stage === 'splitReceipt' && (
        <SplitReceiptPanel
          currentTerminal={selectedTerminal}
          isTxSuccess={isTxSuccess}
          isTxFinished={isTxFinished}
          currentSplitNumber={state.currentSplitNumber}
          totalSplitNumber={state.splitArray.length}
          amount={state.splitArray[state.currentSplitNumber]}
          outstandingAmount={state.outstandingAmount}
          onClickNext={() => {
            dispatch({
              type: 'nextSplit',
            });
          }}
        />
      )}

      {state.showModal && (
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
            initiatePurchase(selectedTerminalId, state.splitArray[state.currentSplitNumber], 0, 0, 0, promptForCashout);
          }}
          onDone={() => {
            if (isTxSuccess) {
              dispatch({
                type: 'showReceipt',
              });
            } else {
              backToPurchase();
            }
          }}
        />
      )}
    </Layout>
  );
};
