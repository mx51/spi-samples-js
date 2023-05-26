import React from 'react';
import { Box, Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link as LinkRouter, useHistory } from 'react-router-dom';
import { PATH_PURCHASE, TEXT_PURCHASE } from '../../definitions/constants/routerConfigs';
import { ReactComponent as FailedIcon } from '../../images/FailedIcon.svg';
import { ReactComponent as SuccessIcon } from '../../images/SuccessIcon.svg';

import { productSubTotalSelector } from '../../redux/reducers/ProductSlice/productSelector';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import {
  isTerminalTxFlowSuccess,
  terminalInstance,
  terminalTransactionTypeObject,
  terminalTxAmount,
  terminalTxFlowFinishedTracker,
  terminalTxTotalAmount,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import OrderLineItem from '../OrderLineItem';
import OrderSubTotal from '../OrderSubTotal';
import useStyles from './index.style';

function PaymentSummary(): React.ReactElement {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    location: { pathname },
  } = useHistory();
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const subtotalAmount = useSelector(productSubTotalSelector);
  const isTxFlowFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminal));
  const isTxFlowSuccess = useSelector(isTerminalTxFlowSuccess(selectedTerminal));
  const transactionAmount = useSelector(terminalTxAmount(selectedTerminal));
  const { typePath, typeTitle } = useSelector(terminalTransactionTypeObject(selectedTerminal));
  const originalTotalAmount: number = useSelector(terminalTxTotalAmount(selectedTerminal));

  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
  };

  const amountSummaryInformation = (type: string) => {
    const returns =
      pathname === '/order-finished' ? currentTerminal?.txFlow?.response?.data : currentTerminal?.txFlow?.request?.data;
    if (returns) return (returns as Any)[type];
    return 0;
  };

  return (
    <Box className={`${classes.root} ${typePath !== PATH_PURCHASE && classes.alignTop}`}>
      <Box flexGrow="2" className={classes.roots}>
        {isTxFlowFinished && isTxFlowSuccess && (
          <>
            <SuccessIcon className={classes.successIcon} />
            <Typography variant="h5" component="h1">
              {typeTitle} Approved
            </Typography>
          </>
        )}
        {isTxFlowFinished && !isTxFlowSuccess && (
          <>
            <FailedIcon className={classes.failedIcon} />
            <Typography variant="h5" component="h1">
              {typeTitle} Declined
            </Typography>
          </>
        )}
        <Typography className={classes.heading}>Terminal:{currentTerminal?.posId}</Typography>

        <Typography className={classes.subheading}>
          {currentTerminal?.deviceAddress} S/N {currentTerminal?.serialNumber}
        </Typography>
        <Box className={classes.paper} component={Paper}>
          {currencyFormat((typeTitle !== TEXT_PURCHASE ? transactionAmount ?? 0 : originalTotalAmount ?? 0) / 100)}
        </Box>
        {typePath === PATH_PURCHASE ? (
          <>
            <Typography className={classes.orderSummery}>Order Summary</Typography>
            <Divider variant="middle" />
            <OrderSubTotal label="Subtotal" amount={subtotalAmount} />
            <OrderLineItem disabled label="Surcharge" amount={amountSummaryInformation('surchargeAmount')} viewOnly />
            <OrderLineItem disabled label="Cashout" amount={amountSummaryInformation('bankCashAmount')} viewOnly />
            <OrderLineItem disabled label="Tip" amount={amountSummaryInformation('tipAmount')} viewOnly />
          </>
        ) : (
          <br />
        )}
        <Grid container spacing={1}>
          {typePath !== PATH_PURCHASE && (
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                classes={{ root: classes.actionBtn }}
                component={LinkRouter}
                to={typePath}
              >
                {typeTitle}
              </Button>
            </Grid>
          )}
          <Grid item xs={typePath !== PATH_PURCHASE ? 6 : 12}>
            <Button
              data-test-id="newOrderBtn"
              variant="contained"
              color="primary"
              size="large"
              classes={{ root: classes.actionBtn }}
              component={LinkRouter}
              to={PATH_PURCHASE}
              onClick={clearAllProductsAction}
            >
              New Order
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default PaymentSummary;
