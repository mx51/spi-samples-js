import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { useDispatch, useSelector } from 'react-redux';
import { SpiStatus } from '@mx51/spi-client-js';
import {
  PATH_CASH_OUT,
  PATH_REFUND,
  PATH_PRE_AUTH,
  TEXT_PURCHASE,
  TEXT_REFUND,
  TEXT_CASHOUT,
  PATH_PAY_NOW,
} from '../../definitions/constants/routerConfigs';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import {
  orderCashoutAmountSelector,
  orderRefundAmountSelector,
  orderTotalSelector,
} from '../../redux/reducers/ProductSlice/productSelector';
import { addCashoutAmount, addRefundAmount, clearProductsOnly } from '../../redux/reducers/ProductSlice/productSlice';
import { updateSelectedTerminal } from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSlice';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { updateTxFlowWithSideEffect } from '../../redux/reducers/TerminalSlice/terminalsSlice';
import {
  isPaired,
  pairedConnectedTerminalList,
  terminalInstance,
  terminalTxFlowFinishedTracker,
  terminalTxFlowReceipt,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import { cancelTransaction, setTerminalToIdle } from '../../utils/common/purchase/purchaseHelper';
import KeyPad from '../KeyPad';
import TransactionProgressModal from '../TransactionProgressModal';
import UnknownTransactionModal from '../UnknownTransactionModal';
import useStyles from './index.styles';
import { IOrderConfirmation, ITitleStrategy } from './interfaces';
import { CashoutOrderConfirmation } from './CashoutOrderConfirmation';
import { PayNowOrderConfirmation } from './PayNowOrderConfirmation';
import { PreAuthOrderConfirmation } from './PreAuthOrderConfirmation';
import { RefundOrderConfirmation } from './RefundOrderConfirmation';
import { usePreAuthActions } from '../../hooks/usePreAuthActions';
import NoTerminalPage from '../NoTerminalPage';

type ComponentByPathNameKeys = typeof PATH_PRE_AUTH | typeof PATH_REFUND | typeof PATH_PAY_NOW | typeof PATH_CASH_OUT;

// @TODO - Redesign this component.
function OrderConfirmation({ title, pathname, editSubtotal }: IOrderConfirmation): React.ReactElement {
  const cashoutPage = pathname === PATH_CASH_OUT;
  const refundPage = pathname === PATH_REFUND;
  const preAuthPage = pathname === PATH_PRE_AUTH;

  const dispatch = useDispatch();
  const classes = useStyles();
  const terminals = useSelector(pairedConnectedTerminalList);
  const selectedTerminalId = useSelector(selectedTerminalIdSelector);
  const selectedTerminal = useSelector(terminalInstance(selectedTerminalId)) as ITerminalProps;
  const isFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminalId)) ?? false;
  const receipt = useSelector(terminalTxFlowReceipt(selectedTerminalId));
  const successStatus = selectedTerminal?.txFlow?.success;
  const isUnknownState = isFinished && successStatus === TxFlowState.Unknown;
  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const [showTransactionProgressModal, setShowTransactionProgressModal] = useState<boolean>(false);
  const [toShowUnknownTransaction, setToShowUnknownTransaction] = useState<boolean>(false);
  const [showUnknownTransactionModal, setShowUnknownTransactionModal] = useState<boolean>(true);
  const [keypadAmount, setKeypadAmount] = useState<number>(0);
  const refundAmount: number = useSelector(orderRefundAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const totalAmount = useSelector(orderTotalSelector);
  const isOverride = selectedTerminal?.txFlow?.override;
  const isTerminalPaired: boolean = useSelector(isPaired);

  const { handleKeypadUpdate } = usePreAuthActions(selectedTerminal);

  const clearProductsOnlyAction = () => {
    dispatch(clearProductsOnly());
  };

  function selectTerminal(terminalId: string) {
    dispatch(updateSelectedTerminal(terminalId));
  }

  function updateUnknownTerminalState(success: string) {
    setTerminalToIdle(selectedTerminalId);
    setShowUnknownTransactionModal(false);
    if (selectedTerminal?.txFlow != null) {
      dispatch(
        updateTxFlowWithSideEffect({
          id: selectedTerminalId,
          txFlow: { ...selectedTerminal?.txFlow, finished: true, success, override: true },
        })
      );
    }
  }

  const titleStrategy: ITitleStrategy = {
    Pay: `Override ${TEXT_PURCHASE}`,
    [TEXT_CASHOUT]: TEXT_CASHOUT,
    [TEXT_REFUND]: TEXT_REFUND,
  };

  function getTitleForKeypad(): string {
    return title in titleStrategy ? (titleStrategy as unknown as Record<string, keyof ITitleStrategy>)[title] : title;
  }

  const connectedSelectedTerminal =
    selectedTerminal?.status === SpiStatus.PairedConnected ? selectedTerminal : undefined;

  const componentByPathName: Record<ComponentByPathNameKeys, JSX.Element> = {
    '/pre-auth': (
      <PreAuthOrderConfirmation
        selectedTerminal={connectedSelectedTerminal}
        setShowTransactionProgressModal={setShowTransactionProgressModal}
      />
    ),
    '/refund': (
      <RefundOrderConfirmation
        selectedTerminal={connectedSelectedTerminal}
        setShowTransactionProgressModal={setShowTransactionProgressModal}
      />
    ),
    '/paynow': (
      <PayNowOrderConfirmation
        selectedTerminal={connectedSelectedTerminal}
        setShowTransactionProgressModal={setShowTransactionProgressModal}
      />
    ),
    '/cashout': (
      <CashoutOrderConfirmation
        selectedTerminal={connectedSelectedTerminal}
        setShowTransactionProgressModal={setShowTransactionProgressModal}
      />
    ),
  };

  const renderOrderConfirmationByAction = () => componentByPathName[pathname as ComponentByPathNameKeys];

  const keypayDisplayAmount = useMemo(() => {
    if (refundPage) {
      return refundAmount;
    }

    if (cashoutPage) {
      return cashoutAmount;
    }

    if (preAuthPage) {
      return keypadAmount;
    }

    return totalAmount;
  }, [refundAmount, cashoutAmount, keypadAmount, totalAmount]);

  return (
    <>
      <Drawer
        anchor="right"
        open={displayKeypad}
        classes={{
          paper: classes.keypadDrawerPaper,
        }}
      >
        <KeyPad
          open={displayKeypad}
          title={getTitleForKeypad()}
          subtitle={`Enter ${getTitleForKeypad().toLowerCase()} amount`}
          defaultAmount={keypayDisplayAmount}
          onClose={() => {
            setDisplayKeypad(false);
          }}
          onAmountChange={(amount) => {
            setDisplayKeypad(false);
            setKeypadAmount(amount);
            if (cashoutPage) {
              dispatch(addCashoutAmount(amount));
            } else if (refundPage) {
              dispatch(addRefundAmount(amount));
            } else if (preAuthPage) {
              handleKeypadUpdate(amount);
            }
            clearProductsOnlyAction();
          }}
        />
      </Drawer>
      <Grid container justifyContent="center">
        <Grid item xs={7} className={classes.gridStyles}>
          <Box className={classes.root} display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box flex="1">
                <Typography className={classes.payLabel}>{title}</Typography>
              </Box>
              <Button
                data-testid="orderTotalButton"
                className={classes.orderTotalBtn}
                disableRipple={!editSubtotal}
                disabled={!editSubtotal}
                onClick={() => setDisplayKeypad(true)}
              >
                <Box flex="1" display="flex" className={classes.paper} component={Paper}>
                  <Box className={classes.orderTotalInputField} flex="1">
                    {currencyFormat(keypayDisplayAmount / 100)}
                  </Box>
                  {editSubtotal && (
                    <Box>
                      <Icon>
                        <CreateIcon />
                      </Icon>
                    </Box>
                  )}
                </Box>
              </Button>
            </Box>
            {isTerminalPaired ? (
              <>
                <Typography className={classes.label}>Select terminal</Typography>
                <Divider />
                <RadioGroup className={classes.radioGroup} aria-label="terminalList" name="terminalList">
                  <Box>
                    <List>
                      {terminals.map((terminal) => (
                        <ListItem key={terminal.id} dense disableGutters onClick={() => selectTerminal(terminal.id)}>
                          <ListItemIcon>
                            <Radio
                              className={classes.radioBtn}
                              checked={terminal.id === selectedTerminalId}
                              value={terminal.id}
                              name="terminal"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={terminal.posId}
                            secondary={`${terminal.deviceAddress} S/N ${terminal.serialNumber}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </RadioGroup>
              </>
            ) : (
              <NoTerminalPage />
            )}

            {renderOrderConfirmationByAction()}

            {showUnknownTransactionModal && isUnknownState && (
              <UnknownTransactionModal
                onSuccessTransaction={() => {
                  updateUnknownTerminalState('Success');
                  setToShowUnknownTransaction(true);
                }}
                onFailedTransaction={() => {
                  updateUnknownTerminalState('Failed');
                  setToShowUnknownTransaction(true);
                }}
              />
            )}
            {showTransactionProgressModal && (!isUnknownState || toShowUnknownTransaction) && (
              <TransactionProgressModal
                terminalId={selectedTerminalId}
                transactionType={selectedTerminal?.txFlow?.type ?? ''}
                transactionDesc={isOverride ? '' : receipt?.hostResponseText ?? ''}
                isFinished={isFinished}
                isSuccess={successStatus === 'Success'}
                onCancelTransaction={() => {
                  cancelTransaction(selectedTerminalId);
                }}
                onRetryTransaction={() => {
                  setShowTransactionProgressModal(false);
                }}
                onDone={() => {
                  setShowTransactionProgressModal(false);
                }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default OrderConfirmation;
