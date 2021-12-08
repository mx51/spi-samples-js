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
import { PATH_CASH_OUT, PATH_PAY_NOW, PATH_REFUND } from '../../definitions/constants/routerConfigs';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import {
  orderCashoutAmountSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  productSubTotalSelector,
} from '../../redux/reducers/ProductSlice/productSelector';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';
import { updateSelectedTerminal } from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSlice';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import {
  pairedConnectedTerminalList,
  terminalInstance,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import {
  initiatePurchase,
  initiateMotoPurchase,
  initiateCashoutOnlyTx,
  initiateRefundTx,
} from '../../utils/common/purchase/purchaseHelper';
import KeyPad from '../KeyPad';
import TransactionProgressModal from '../TransactionProgressModal';
import useStyles from './index.styles';
import { IOrderConfirmation } from './interfaces';

function OrderConfirmation({ title, pathname, currentAmount }: IOrderConfirmation): React.ReactElement {
  const dispatch = useDispatch();

  const classes = useStyles();
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const subtotalAmount: number = useSelector(productSubTotalSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const terminals = useSelector(pairedConnectedTerminalList);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;

  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
  };

  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(currentAmount);
  const [showTransactionProgressModal, setShowTransactionProgressModal] = useState<boolean>(false);

  function selectTerminal(terminalId: string) {
    dispatch(updateSelectedTerminal(terminalId));
  }

  function isDisabled() {
    return !selectedTerminal || totalAmount <= 0;
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
          title="Override Purchase amount"
          subtitle="Enter purchase amount"
          defaultAmount={totalAmount}
          onClose={() => {
            setDisplayKeypad(false);
          }}
          onAmountChange={(amount) => {
            setTotalAmount(amount);
            setDisplayKeypad(false);
            clearAllProductsAction();
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
              <Button className={classes.orderTotalBtn} onClick={() => setDisplayKeypad(true)}>
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
                    <ListItem key={terminal.id} dense disableGutters>
                      <ListItemIcon>
                        <Radio
                          onClick={() => selectTerminal(terminal.id)}
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
            {pathname === PATH_PAY_NOW && (
              <>
                <Typography className={classes.label}>Select payment method</Typography>
                <Divider />
              </>
            )}
            {showTransactionProgressModal && (
              <TransactionProgressModal
                terminalId={selectedTerminal}
                transactionType={currentTerminal?.txFlow?.type ?? ''}
                isFinished={currentTerminal?.txFlow?.finished ?? false}
                isSuccess={currentTerminal?.txFlow?.success === TxFlowState.Success}
                onCancelTransaction={() => {
                  setShowTransactionProgressModal(false);
                }}
                onDone={() => {
                  setShowTransactionProgressModal(false);
                }}
              />
            )}
            {pathname === PATH_PAY_NOW && (
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
                      false
                    );
                  }}
                >
                  Card
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
                    initiateMotoPurchase(selectedTerminal, subtotalAmount, surchargeAmount);
                  }}
                >
                  Moto
                </Button>
              </Box>
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
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default OrderConfirmation;
