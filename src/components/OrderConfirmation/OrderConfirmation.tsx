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
import { useHistory } from 'react-router-dom';
import {
  PATH_CASH_OUT,
  PATH_REFUND,
  PATH_PRE_AUTH,
  TEXT_PURCHASE,
  TEXT_REFUND,
  TEXT_CASHOUT,
  PATH_PAY_NOW,
  PATH_ORDER_FINISHED,
} from '../../definitions/constants/routerConfigs';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import {
  orderCashoutAmountSelector,
  orderRefundAmountSelector,
  orderTotalSelector,
} from '../../redux/reducers/ProductSlice/productSelector';
import { addCashoutAmount, addRefundAmount, clearProductsOnly } from '../../redux/reducers/ProductSlice/productSlice';
import { updateSelectedTerminal } from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSlice';
import selectSelectedTerminal from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { updateTxFlowWithSideEffect } from '../../redux/reducers/TerminalSlice/terminalsSlice';
import {
  selectHasPairedTerminals,
  pairedConnectedTerminalList,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { selectCloudPairings, selectHasCloudPairings } from '../../redux/reducers/PairingSlice/pairingSelectors';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import { setTerminalToIdle } from '../../utils/common/purchase/purchaseHelper';
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
import { useTransactionHandler } from '../../transaction-handling/use-transaction-handler';
import { TerminalConnection } from '../../transaction-handling/terminal-connection';

type ComponentByPathNameKeys = typeof PATH_PRE_AUTH | typeof PATH_REFUND | typeof PATH_PAY_NOW | typeof PATH_CASH_OUT;

// @TODO - Redesign this component.
function OrderConfirmation({ title, pathname, editSubtotal }: IOrderConfirmation): React.ReactElement {
  const cashoutPage = pathname === PATH_CASH_OUT;
  const refundPage = pathname === PATH_REFUND;
  const preAuthPage = pathname === PATH_PRE_AUTH;

  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const terminals = useSelector(pairedConnectedTerminalList);
  const cloudPairings = useSelector(selectCloudPairings());
  const selectedTerminalState = useSelector(selectSelectedTerminal);
  const transactionHandler = useTransactionHandler(selectedTerminalState);
  const isFinished = transactionHandler?.txFlow?.finished ?? false;
  const successStatus = transactionHandler?.txFlow?.success;
  const isUnknownState = isFinished && successStatus === TxFlowState.Unknown;
  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const [showTransactionProgressModal, setShowTransactionProgressModal] = useState<boolean>(false);
  const [toShowUnknownTransaction, setToShowUnknownTransaction] = useState<boolean>(false);
  const [showUnknownTransactionModal, setShowUnknownTransactionModal] = useState<boolean>(true);
  const [keypadAmount, setKeypadAmount] = useState<number>(0);
  const refundAmount: number = useSelector(orderRefundAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const totalAmount = useSelector(orderTotalSelector);
  const isOverride = transactionHandler?.txFlow?.override;
  const hasPairedTerminals: boolean = useSelector(selectHasPairedTerminals);
  const hasCloudPairings = useSelector(selectHasCloudPairings);
  const hasPairings = hasPairedTerminals || hasCloudPairings;

  const { handleKeypadUpdate } = usePreAuthActions(transactionHandler?.txFlow);

  const clearProductsOnlyAction = () => {
    dispatch(clearProductsOnly());
  };

  function selectTerminal(terminalId: string, connection: TerminalConnection) {
    dispatch(updateSelectedTerminal({ id: terminalId, connection }));
  }

  function updateUnknownTerminalState(success: string) {
    setTerminalToIdle(selectedTerminalState.id);
    setShowUnknownTransactionModal(false);
    if (transactionHandler?.txFlow !== undefined) {
      dispatch(
        updateTxFlowWithSideEffect({
          id: selectedTerminalState.id,
          txFlow: { ...transactionHandler.txFlow, finished: true, success, override: true },
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

  const connectedTransactionHandler = transactionHandler?.isTerminalConnected ? transactionHandler : undefined;

  const componentByPathName: Record<ComponentByPathNameKeys, JSX.Element> = {
    '/pre-auth': (
      <PreAuthOrderConfirmation
        transactionHandler={connectedTransactionHandler}
        setShowTransactionProgressModal={setShowTransactionProgressModal}
      />
    ),
    '/refund': (
      <RefundOrderConfirmation
        transactionHandler={connectedTransactionHandler}
        setShowTransactionProgressModal={setShowTransactionProgressModal}
      />
    ),
    '/paynow': (
      <PayNowOrderConfirmation
        transactionHandler={connectedTransactionHandler}
        setShowTransactionProgressModal={setShowTransactionProgressModal}
      />
    ),
    '/cashout': (
      <CashoutOrderConfirmation
        transactionHandler={connectedTransactionHandler}
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
            {hasPairings ? (
              <>
                <Typography className={classes.label}>Select terminal</Typography>
                <Divider />
                <RadioGroup className={classes.radioGroup} aria-label="terminalList" name="terminalList">
                  <Box>
                    <List>
                      {terminals.map((terminal) => (
                        <ListItem
                          key={terminal.id}
                          dense
                          disableGutters
                          onClick={() => selectTerminal(terminal.id, 'local')}
                        >
                          <ListItemIcon>
                            <Radio
                              className={classes.radioBtn}
                              checked={terminal.id === selectedTerminalState.id}
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
                      {cloudPairings.map((cloudPairing) => (
                        <ListItem
                          key={cloudPairing.pairingId}
                          dense
                          disableGutters
                          onClick={() => selectTerminal(cloudPairing.pairingId, 'cloud')}
                        >
                          <ListItemIcon>
                            <Radio
                              className={classes.radioBtn}
                              checked={cloudPairing.pairingId === selectedTerminalState.id}
                              value={cloudPairing.pairingId}
                              name="terminal"
                            />
                          </ListItemIcon>
                          <ListItemText primary={cloudPairing.posNickname} secondary={cloudPairing.pairingId} />
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
                terminalId={selectedTerminalState.id}
                transactionType={transactionHandler?.txFlow?.type ?? ''}
                transactionDesc={isOverride ? '' : transactionHandler?.receipt?.hostResponseText ?? ''}
                isFinished={isFinished}
                isSuccess={successStatus === 'Success'}
                onCancelTransaction={() => {
                  transactionHandler?.cancelTransaction();
                }}
                onRetryTransaction={() => {
                  setShowTransactionProgressModal(false);
                }}
                onDone={() => {
                  setShowTransactionProgressModal(false);
                  history.push(PATH_ORDER_FINISHED);
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
