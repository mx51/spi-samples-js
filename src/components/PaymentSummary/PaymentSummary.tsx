import React, { useEffect } from 'react';
import { Box, Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link as LinkRouter, useHistory } from 'react-router-dom';
import { PATH_PURCHASE } from '../../definitions/constants/routerConfigs';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import { ReactComponent as FailedIcon } from '../../images/FailedIcon.svg';
import { ReactComponent as SuccessIcon } from '../../images/SuccessIcon.svg';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import {
  isTerminalTxFlowSuccess,
  terminalInstance,
  terminalTransactionTypeObject,
  terminalTxFlowFinishedTracker,
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
  const isTxFlowFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminal));
  const isTxFlowSuccess = useSelector(isTerminalTxFlowSuccess(selectedTerminal));
  const { typePath, typeTitle } = useSelector(terminalTransactionTypeObject(selectedTerminal));

  useEffect(() => {
    dispatch(clearAllProducts());
  }, []);

  const amountSummaryInformation = (type: string) => {
    const returns =
      currentTerminal?.txFlow?.success === TxFlowState.Success
        ? currentTerminal?.txFlow?.response?.data
        : currentTerminal?.txFlow?.request?.data;
    if (returns) return (returns as Any)[type] ?? 0;
    return 0;
  };

  const subTotal = amountSummaryInformation('purchaseAmount');
  const surchangeAmount = amountSummaryInformation('surchargeAmount');
  const cashoutAmount = amountSummaryInformation('bankCashAmount');
  const tipAmount = amountSummaryInformation('tipAmount');
  const refundAmount = amountSummaryInformation('refundAmount');

  const originalTotalAmount = subTotal + surchangeAmount + cashoutAmount + tipAmount + refundAmount;

  return (
    <Box className={`${classes.root} ${typePath !== PATH_PURCHASE && classes.alignTop}`}>
      <Box flexGrow="2" className={classes.roots}>
        {isTxFlowFinished && isTxFlowSuccess && (
          <>
            <SuccessIcon className={classes.successIcon} />
            <Typography variant="h5" component="h1">
              {`${typeTitle?.toUpperCase()} ${currentTerminal?.txFlow?.response?.data?.hostResponseText?.toUpperCase()}`}
            </Typography>
          </>
        )}
        {isTxFlowFinished && !isTxFlowSuccess && (
          <>
            <FailedIcon className={classes.failedIcon} />
            <Typography variant="h5" component="h1">
              {`${typeTitle?.toUpperCase()} ${currentTerminal?.txFlow?.success?.toUpperCase()}`}
            </Typography>
            <Typography variant="h6" component="h1">
              {currentTerminal?.txFlow?.response?.data?.hostResponseText}
            </Typography>
          </>
        )}
        <Typography className={classes.heading}>Terminal:{currentTerminal?.posId}</Typography>

        <Typography className={classes.subheading}>
          {currentTerminal?.deviceAddress} S/N {currentTerminal?.serialNumber}
        </Typography>
        <Box className={classes.paper} component={Paper}>
          {currencyFormat((Number.isNaN(originalTotalAmount) ? 0 : originalTotalAmount) / 100)}
        </Box>
        {typePath === PATH_PURCHASE ? (
          <>
            <Typography className={classes.orderSummery}>Order Summary</Typography>
            <Divider variant="middle" />
            <OrderSubTotal label="Subtotal" amount={amountSummaryInformation('purchaseAmount')} />
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
