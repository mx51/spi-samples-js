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
  orderCashoutAmountSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  orderTotalSelector,
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
import { initiatePurchase, initiateMotoPurchase } from '../../utils/common/purchase/purchaseHelper';
import KeyPad from '../KeyPad';
import TransactionProgressModal from '../TransactionProgressModal';
import useStyles from './index.styles';

function PayNow(): React.ReactElement {
  const dispatch = useDispatch();

  const classes = useStyles();
  const originalTotalAmount: number = useSelector(orderTotalSelector);
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const terminals = useSelector(pairedConnectedTerminalList);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;

  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
  };

  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(originalTotalAmount);
  const [showTransactionProgressModal, setShowTransactionProgressModal] = useState<boolean>(false);

  function selectTerminal(terminalId: string) {
    dispatch(updateSelectedTerminal(terminalId));
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
                <Typography className={classes.payLabel}>Pay</Typography>
              </Box>
              <Button className={classes.orderTotalBtn} onClick={() => setDisplayKeypad(true)}>
                <Box
                  flex="1"
                  display="flex"
                  className={classes.paper}
                  onClick={() => setDisplayKeypad(true)}
                  component={Paper}
                >
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
            <Typography className={classes.label}>Select payment method</Typography>
            <Divider />
            {showTransactionProgressModal && (
              <TransactionProgressModal
                transactionType={currentTerminal?.txFlow?.type ?? ''}
                isFinished={currentTerminal?.txFlow?.finished ?? false}
                isSuccess={currentTerminal?.txFlow?.success === 'Success'}
                onCancelTransaction={() => {
                  setShowTransactionProgressModal(false);
                }}
                onDone={() => {
                  setShowTransactionProgressModal(false);
                }}
              />
            )}
            <Box display="flex" justifyContent="space-evenly">
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={!selectedTerminal}
                focusRipple
                classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                onClick={() => {
                  setShowTransactionProgressModal(true);
                  initiatePurchase(selectedTerminal, totalAmount, tipAmount, cashoutAmount, surchargeAmount, false);
                }}
              >
                Card
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={!selectedTerminal}
                focusRipple
                classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
                onClick={() => {
                  setShowTransactionProgressModal(true);
                  initiateMotoPurchase(selectedTerminal, totalAmount, surchargeAmount);
                }}
              >
                Moto
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default PayNow;
