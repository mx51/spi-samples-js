import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { useDispatch, useSelector } from 'react-redux';
import { SPI_PAIR_STATUS } from '../../definitions/constants/commonConfigs';
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
import { preAuthSelector } from '../../redux/reducers/PreAuth/preAuthSelector';
import {
  orderCashoutAmountSelector,
  orderPromptForCashoutSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  productSubTotalSelector,
} from '../../redux/reducers/ProductSlice/productSelector';
import { addKeypadAmount, clearProductsOnly } from '../../redux/reducers/ProductSlice/productSlice';
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
import { getTitleFromStatus } from '../../utils/common/pair/pairStatusHelpers';
import {
  initiatePurchase,
  initiateMotoPurchase,
  initiateCashoutOnlyTx,
  initiateRefundTx,
  InitiateAccountVerifyTx,
  cancelTransaction,
  setTerminalToIdle,
  InitiatePreAuthOpenTx,
  InitiatePreAuthCompleteTx,
  InitiatePreAuthCancelTx,
  InitiatePreAuthExtendTx,
  InitiatePreAuthReduceTx,
  InitiatePreAuthTopupTx,
} from '../../utils/common/purchase/purchaseHelper';
import KeyPad from '../KeyPad';
import TransactionProgressModal from '../TransactionProgressModal';
import UnknownTransactionModal from '../UnknownTransactionModal';
import useStyles from './index.styles';
import { IOrderConfirmation, ITitleStrategy } from './interfaces';

function OrderConfirmation({ title, pathname, currentAmount }: IOrderConfirmation): React.ReactElement {
  const dispatch = useDispatch();

  const classes = useStyles();
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const promptForCashout: boolean = useSelector(orderPromptForCashoutSelector);

  const terminals = useSelector(pairedConnectedTerminalList);
  const [subtotalAmount, setSubtotalAmount] = useState<number>(useSelector(productSubTotalSelector));
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const isFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminal)) ?? false;
  const receipt = useSelector(terminalTxFlowReceipt(selectedTerminal));
  const preAuth = useSelector(preAuthSelector);

  const successStatus = currentTerminal?.txFlow?.success;

  const isUnknownState = isFinished && successStatus === TxFlowState.Unknown;

  const clearProductsOnlyAction = () => {
    dispatch(clearProductsOnly());
  };

  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(currentAmount);
  const [showTransactionProgressModal, setShowTransactionProgressModal] = useState<boolean>(false);
  const [toShowUnknownTransaction, setToShowUnknownTransaction] = useState<boolean>(false);

  const [showUnknownTransactionModal, setShowUnknownTransactionModal] = useState<boolean>(true);

  function selectTerminal(terminalId: string) {
    dispatch(updateSelectedTerminal(terminalId));
  }

  function isDisabled() {
    return !selectedTerminal || currentTerminal?.status !== SPI_PAIR_STATUS.PairedConnected || totalAmount <= 0;
  }

  function isAccountVerify() {
    return !selectedTerminal || currentTerminal?.status !== SPI_PAIR_STATUS.PairedConnected;
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

  const preAuthButtonText = ['Top Up', 'Reduce', 'Extend', 'Cancel', 'Complete'];

  const titleStrategy: ITitleStrategy = {
    Pay: `Override ${TEXT_PURCHASE}`,
    [TEXT_CASHOUT]: TEXT_CASHOUT,
    [TEXT_REFUND]: TEXT_REFUND,
  };

  function getTitleForKeypad(): string {
    return title in titleStrategy ? (titleStrategy as unknown as Record<string, keyof ITitleStrategy>)[title] : title;
  }

  const handlePreAuthTxs = (terminal: any, type: string, amount: number) => {
    switch (type) {
      case 'Top Up':
        InitiatePreAuthTopupTx(terminal, amount, preAuth.preAuthRef);
        break;
      case 'Reduce':
        InitiatePreAuthReduceTx(terminal, amount, preAuth.preAuthRef);
        break;
      case 'Extend':
        InitiatePreAuthExtendTx(terminal, preAuth.preAuthRef);
        break;
      case 'Cancel':
        InitiatePreAuthCancelTx(terminal, preAuth.preAuthRef);
        break;
      case 'Complete':
        InitiatePreAuthCompleteTx(terminal, preAuth.amount, preAuth.preAuthRef, preAuth.surcharge);
        break;
      default:
        break;
    }
  };

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
            setTotalAmount(amount);
            setSubtotalAmount(amount);
            setDisplayKeypad(false);
            clearProductsOnlyAction();
            dispatch(addKeypadAmount(amount));
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
                onClick={() => setDisplayKeypad(true)}
              >
                <Box flex="1" display="flex" className={classes.paper} component={Paper}>
                  <Box className={classes.orderTotalInputField} flex="1">
                    {currencyFormat(totalAmount / 100)}
                  </Box>
                  <Box>
                    <Icon>
                      <CreateIcon />
                    </Icon>
                  </Box>
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
              {pathname === PATH_PRE_AUTH &&
                (preAuth.verified || preAuth.preAuthRef ? (
                  <TableContainer component={Paper} className={classes.table} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Pre Auth Ref</TableCell>
                          <TableCell>Account Verified</TableCell>
                          <TableCell>Surcharge</TableCell>
                          <TableCell>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow className={classes.unclickable}>
                          <TableCell scope="row">{preAuth.preAuthRef !== '' ? preAuth.preAuthRef : '-'}</TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={preAuth.verified ? 'Verified' : 'Unverified'}
                              className={preAuth.verified ? classes.chipSuccess : classes.chipFailure}
                            />
                          </TableCell>
                          <TableCell>{`$${preAuth.surcharge / 100}`}</TableCell>
                          <TableCell>{`$${preAuth.amount / 100}`}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : null)}
            </RadioGroup>
            {pathname === PATH_PAY_NOW && (
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
            <Box display="flex" justifyContent="space-evenly">
              {pathname === PATH_PAY_NOW && (
                <>
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
                </>
              )}
              {pathname === PATH_CASH_OUT && (
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
              {pathname === PATH_REFUND && (
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
              {pathname === PATH_PRE_AUTH &&
                (preAuth.preAuthRef ? (
                  preAuthButtonText.map((text) => (
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={['Extend', 'Cancel', 'Complete'].includes(text) ? isAccountVerify() : isDisabled()}
                      focusRipple
                      classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                      onClick={() => {
                        setShowTransactionProgressModal(true);
                        handlePreAuthTxs(selectedTerminal, text, totalAmount);
                      }}
                    >
                      {text}
                    </Button>
                  ))
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isAccountVerify()}
                      focusRipple
                      classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                      onClick={() => {
                        setShowTransactionProgressModal(true);
                        InitiateAccountVerifyTx(selectedTerminal);
                      }}
                    >
                      Verify Account
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isDisabled()}
                      focusRipple
                      classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                      onClick={() => {
                        setShowTransactionProgressModal(true);
                        InitiatePreAuthOpenTx(selectedTerminal, totalAmount);
                      }}
                    >
                      Open Pre-Auth
                    </Button>
                  </>
                ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default OrderConfirmation;
