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
  splitAmountArray: number[];
  splitIndex: number;
  currentSplitAmount: number;
  outstandingAmount: number;
  showModal: boolean;
};

type Action =
  | { type: 'startSplit'; splitMode: SplitMode; numberOfSplits: number; splitAmount: number }
  | { type: 'startTransaction'; currentSplitAmount: number; outstandingAmount: number }
  | { type: 'showReceipt' }
  | { type: 'nextSplit' };

function calculateSplitArray(totalAmount: number, numberOfSplits: number): number[] {
  if (numberOfSplits === 1) {
    return [totalAmount];
  }

  const result = Array(numberOfSplits).fill(Math.floor(totalAmount / numberOfSplits));
  result[0] = totalAmount - (numberOfSplits - 1) * Math.floor(totalAmount / numberOfSplits);
  return result;
}

export const SplitPage: React.FC = () => {
  const appDispatch = useDispatch();
  const history = useHistory();

  const totalAmount = useSelector(orderTotalSelector);
  const promptForCashout = useSelector(orderPromptForCashoutSelector);

  const selectedTerminalId = useSelector(selectedTerminalIdSelector);
  const selectedTerminal = useSelector(terminalInstance(selectedTerminalId.id)) as ITerminalProps;
  const isTxFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminalId.id)) ?? false;
  const isTxSuccess = useSelector(isTerminalTxFlowSuccess(selectedTerminalId.id));

  const backToPurchase = () => {
    history.push(PATH_PURCHASE);
  };

  const reducer = (currentState: State, action: Action): State => {
    if (action.type === 'startSplit') {
      const splitAmountArray =
        action.splitMode === 'splitEvenly' ? calculateSplitArray(totalAmount, action.numberOfSplits) : [];
      const currentSplitAmount = action.splitMode === 'splitEvenly' ? splitAmountArray[0] : action.splitAmount;

      if (action.splitMode === 'splitByAmount') {
        initiatePurchase(selectedTerminalId.id, currentSplitAmount, 0, 0, 0, promptForCashout);
      }

      return {
        stage: 'splitConfirmation',
        splitMode: action.splitMode,
        splitAmountArray,
        splitIndex: 0,
        currentSplitAmount,
        outstandingAmount: totalAmount - currentSplitAmount,
        showModal: action.splitMode === 'splitByAmount',
      };
    }
    if (action.type === 'startTransaction') {
      initiatePurchase(selectedTerminalId.id, action.currentSplitAmount, 0, 0, 0, promptForCashout);

      return {
        ...currentState,
        currentSplitAmount: action.currentSplitAmount,
        outstandingAmount: action.outstandingAmount,
        showModal: true,
      };
    }
    if (action.type === 'showReceipt') {
      return {
        ...currentState,
        stage: 'splitReceipt',
        showModal: false,
      };
    }
    if (action.type === 'nextSplit') {
      if (currentState.outstandingAmount <= 0) {
        appDispatch(clearAllProducts());
        backToPurchase();
      }

      const { splitMode, splitAmountArray, splitIndex, outstandingAmount } = currentState;
      const currentSplitAmount = splitMode === 'splitEvenly' ? splitAmountArray[splitIndex + 1] : outstandingAmount;

      return {
        ...currentState,
        stage: 'splitConfirmation',
        splitIndex: splitIndex + 1,
        currentSplitAmount,
        outstandingAmount: outstandingAmount - currentSplitAmount,
      };
    }
    return currentState;
  };
  const [state, dispatch] = useReducer(reducer, {
    stage: 'initialSplit',
    splitMode: 'splitEvenly',
    splitAmountArray: [],
    splitIndex: 0,
    currentSplitAmount: 0,
    outstandingAmount: 0,
    showModal: false,
  });

  return (
    <Layout>
      {state.stage === 'initialSplit' && (
        <InitialSplitPanel
          totalAmount={totalAmount}
          onClickNext={(splitMode, numberOfSplits, splitAmount) => {
            dispatch({
              type: 'startSplit',
              splitMode,
              numberOfSplits,
              splitAmount,
            });
          }}
        />
      )}

      {state.stage === 'splitConfirmation' && (
        <SplitConfirmationPanel
          splitMode={state.splitMode}
          splitIndex={state.splitIndex}
          splitAmount={state.currentSplitAmount}
          totalAmount={state.outstandingAmount + state.currentSplitAmount}
          onClickNext={(splitAmount, outstandingAmount) => {
            dispatch({
              type: 'startTransaction',
              currentSplitAmount: splitAmount,
              outstandingAmount,
            });
          }}
        />
      )}

      {state.stage === 'splitReceipt' && (
        <SplitReceiptPanel
          currentTerminal={selectedTerminal}
          splitIndex={state.splitIndex}
          splitMode={state.splitMode}
          numberOfSplits={state.splitAmountArray.length}
          splitAmount={state.currentSplitAmount}
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
          terminalId={selectedTerminalId.id}
          transactionType={SPI_TRANSACTION_TYPES.Purchase}
          transactionDesc=""
          isFinished={isTxFinished}
          isSuccess={isTxSuccess}
          onCancelTransaction={() => {
            cancelTransaction(selectedTerminalId.id);
            backToPurchase();
          }}
          onRetryTransaction={() => {
            initiatePurchase(selectedTerminalId.id, state.currentSplitAmount, 0, 0, 0, promptForCashout);
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
