import React, { useState } from 'react';
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
import { orderTotalSelector } from '../../redux/reducers/ProductSlice/productSelector';
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
import { updatePreAuthParams } from '../../redux/reducers/PreAuth/preAuthSlice';
import { preAuthSelector } from '../../redux/reducers/PreAuth/preAuthSelector';

type ComponentByPathNameKeys = typeof PATH_PRE_AUTH | typeof PATH_REFUND | typeof PATH_PAY_NOW | typeof PATH_CASH_OUT;

function OrderConfirmation({ title, pathname, editSubtotal }: IOrderConfirmation): React.ReactElement {
  const cashoutPage = pathname === PATH_CASH_OUT;
  const refundPage = pathname === PATH_REFUND;
  const preAuthPage = pathname === PATH_PRE_AUTH;

  const dispatch = useDispatch();
  const classes = useStyles();
  const terminals = useSelector(pairedConnectedTerminalList);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps | undefined;
  const isFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminal)) ?? false;
  const receipt = useSelector(terminalTxFlowReceipt(selectedTerminal));
  const successStatus = currentTerminal?.txFlow?.success;
  const isUnknownState = isFinished && successStatus === TxFlowState.Unknown;
  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const [showTransactionProgressModal, setShowTransactionProgressModal] = useState<boolean>(false);
  const [toShowUnknownTransaction, setToShowUnknownTransaction] = useState<boolean>(false);
  const [showUnknownTransactionModal, setShowUnknownTransactionModal] = useState<boolean>(true);
  const totalAmount = useSelector(orderTotalSelector);
  const preAuth = useSelector(preAuthSelector);

  const clearProductsOnlyAction = () => {
    dispatch(clearProductsOnly());
  };

  function selectTerminal(terminalId: string) {
    dispatch(updateSelectedTerminal(terminalId));
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

  const componentByPathName: Record<ComponentByPathNameKeys, JSX.Element> = {
    '/pre-auth': <PreAuthOrderConfirmation setShowTransactionProgressModal={setShowTransactionProgressModal} />,
    '/refund': <RefundOrderConfirmation setShowTransactionProgressModal={setShowTransactionProgressModal} />,
    '/paynow': <PayNowOrderConfirmation setShowTransactionProgressModal={setShowTransactionProgressModal} />,
    '/cashout': <CashoutOrderConfirmation setShowTransactionProgressModal={setShowTransactionProgressModal} />,
  };

  const renderOrderConfirmationByAction = () => componentByPathName[pathname as ComponentByPathNameKeys];

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
            } else if (preAuthPage) {
              dispatch(
                updatePreAuthParams({
                  key: 'UPDATE_CURRENT_AMOUNT',
                  value: amount,
                })
              );
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
                    {preAuthPage ? currencyFormat(preAuth.currentAmount / 100) : currencyFormat(totalAmount / 100)}
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
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default OrderConfirmation;
