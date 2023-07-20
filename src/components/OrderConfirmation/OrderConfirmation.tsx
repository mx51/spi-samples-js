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
import { SPI_PAIR_STATUS } from '../../definitions/constants/commonConfigs';
import {
  PATH_CASH_OUT,
  PATH_REFUND,
  TEXT_PURCHASE,
  TEXT_REFUND,
  TEXT_CASHOUT,
  PATH_PAY_NOW,
} from '../../definitions/constants/routerConfigs';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import {
  orderCashoutAmountSelector,
  orderPromptForCashoutSelector,
  orderRefundAmountSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  productSubTotalSelector,
} from '../../redux/reducers/ProductSlice/productSelector';
import { addCashoutAmount, addRefundAmount, clearProductsOnly } from '../../redux/reducers/ProductSlice/productSlice';
import { updateSelectedTerminal } from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSlice';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { updateTxFlow } from '../../redux/reducers/TerminalSlice/terminalsSlice';
import {
  pairedConnectedTerminalList,
  terminalInstance,
  terminalTxFlowFinishedTracker,
  terminalTxFlowReceipt,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import {
  initiatePurchase,
  initiateMotoPurchase,
  initiateCashoutOnlyTx,
  initiateRefundTx,
  cancelTransaction,
  setTerminalToIdle,
} from '../../utils/common/purchase/purchaseHelper';
import KeyPad from '../KeyPad';
import TransactionProgressModal from '../TransactionProgressModal';
import UnknownTransactionModal from '../UnknownTransactionModal';

import useStyles from './index.styles';
import { IOrderConfirmation, ITitleStrategy } from './interfaces';

function OrderConfirmation({ title, pathname, editSubtotal }: IOrderConfirmation): React.ReactElement {
  const cashoutPage = pathname === PATH_CASH_OUT;
  const refundPage = pathname === PATH_REFUND;
  const purchasePage = pathname === PATH_PAY_NOW;

  const dispatch = useDispatch();

  const classes = useStyles();
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const refundAmount: number = useSelector(orderRefundAmountSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const promptForCashout: boolean = useSelector(orderPromptForCashoutSelector);
  const subtotalAmount = useSelector(productSubTotalSelector);

  const terminals = useSelector(pairedConnectedTerminalList);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const isFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminal)) ?? false;
  const receipt = useSelector(terminalTxFlowReceipt(selectedTerminal));

  const totalAmount = useMemo(() => {
    if (cashoutPage) {
      return cashoutAmount;
    }

    if (refundPage) {
      return refundAmount;
    }

    return surchargeAmount + tipAmount + cashoutAmount + subtotalAmount;
  }, [surchargeAmount, tipAmount, cashoutAmount, subtotalAmount, refundAmount]);
  const successStatus = currentTerminal?.txFlow?.success;

  const isUnknownState = isFinished && successStatus === TxFlowState.Unknown;

  const clearProductsOnlyAction = () => {
    dispatch(clearProductsOnly());
  };

  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const [showTransactionProgressModal, setShowTransactionProgressModal] = useState<boolean>(false);
  const [toShowUnknownTransaction, setToShowUnknownTransaction] = useState<boolean>(false);
  const [showUnknownTransactionModal, setShowUnknownTransactionModal] = useState<boolean>(true);

  function selectTerminal(terminalId: string) {
    dispatch(updateSelectedTerminal(terminalId));
  }

  function isDisabled() {
    if (
      !selectedTerminal ||
      currentTerminal?.status !== SPI_PAIR_STATUS.PairedConnected ||
      (purchasePage && subtotalAmount === 0)
    )
      return true;

    return totalAmount <= 0;
  }

  function updateUnknownTerminalState(success: string) {
    setTerminalToIdle(selectedTerminal);
    setShowUnknownTransactionModal(false);
    if (currentTerminal?.txFlow != null) {
      dispatch(
        updateTxFlow({
          id: selectedTerminal,
          txFlow: { ...currentTerminal?.txFlow, finished: true, success },
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
          defaultAmount={totalAmount}
          onClose={() => {
            setDisplayKeypad(false);
          }}
          onAmountChange={(amount) => {
            setDisplayKeypad(false);

            if (cashoutPage) {
              dispatch(addCashoutAmount(amount));
            } else if (refundPage) {
              dispatch(addRefundAmount(amount));
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
                    {currencyFormat(totalAmount / 100)}
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
                          checked={terminal.id === selectedTerminal}
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
            {purchasePage && (
              <>
                <Typography className={classes.label}>Select payment method</Typography>
                <Divider />
              </>
            )}
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
                terminalId={selectedTerminal}
                transactionType={currentTerminal?.txFlow?.type ?? ''}
                transactionDesc={receipt?.hostResponseText ?? ''}
                isFinished={isFinished}
                isSuccess={successStatus === 'Success'}
                onCancelTransaction={() => {
                  cancelTransaction(selectedTerminal);
                }}
                onRetryTransaction={() => {
                  setShowTransactionProgressModal(false);
                }}
                onDone={() => {
                  setShowTransactionProgressModal(false);
                }}
              />
            )}
            {purchasePage && (
              <Box display="flex" justifyContent="space-evenly">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isDisabled()}
                  focusRipple
                  classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                  onClick={() => {
                    setShowTransactionProgressModal(true);
                    initiatePurchase(
                      selectedTerminal,
                      subtotalAmount,
                      tipAmount,
                      cashoutAmount,
                      surchargeAmount,
                      promptForCashout
                    );
                  }}
                >
                  Card
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isDisabled() || tipAmount > 0 || cashoutAmount > 0}
                  focusRipple
                  classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                  onClick={() => {
                    setShowTransactionProgressModal(true);
                    initiateMotoPurchase(selectedTerminal, subtotalAmount, surchargeAmount);
                  }}
                >
                  Moto
                </Button>
              </Box>
            )}
            {cashoutPage && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={isDisabled()}
                focusRipple
                classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                onClick={() => {
                  setShowTransactionProgressModal(true);
                  initiateCashoutOnlyTx(selectedTerminal, totalAmount, surchargeAmount);
                }}
              >
                Cashout
              </Button>
            )}
            {refundPage && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={isDisabled()}
                focusRipple
                classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                onClick={() => {
                  setShowTransactionProgressModal(true);
                  initiateRefundTx(selectedTerminal, totalAmount);
                }}
              >
                Refund
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default OrderConfirmation;
