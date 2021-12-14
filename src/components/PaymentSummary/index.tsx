import React from 'react';
import { Box, Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link as LinkRouter } from 'react-router-dom';
import { PATH_PURCHASE } from '../../definitions/constants/routerConfigs';
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
  terminalTxFlowFinishedTracker,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import OrderLineItem from '../OrderLineItem';
import OrderSubTotal from '../OrderSubTotal';
import useStyles from './index.style';

function PaymentSummary(): React.ReactElement {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const subtotalAmount = useSelector(productSubTotalSelector);
  const isTxFlowFinished = useSelector(terminalTxFlowFinishedTracker(selectedTerminal));
  const isTxFlowSuccess = useSelector(isTerminalTxFlowSuccess(selectedTerminal));
  const { typePath, typeTitle } = useSelector(terminalTransactionTypeObject(selectedTerminal));

  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
  };

  return (
    <Box className={classes.root}>
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
          {currencyFormat((currentTerminal?.txFlow?.request.data.purchaseAmount ?? 0) / 100)}
        </Box>
        <Typography className={classes.orderSummery}>Order Summary</Typography>
        <Divider variant="middle" />
        <OrderSubTotal label="Subtotal" amount={subtotalAmount} />
        <OrderLineItem
          disabled
          label="Surcharge"
          onAdd={() => 0}
          amount={currentTerminal?.txFlow?.request.data.surchargeAmount ?? 0}
          viewOnly
        />
        <OrderLineItem
          disabled
          label="Cashout"
          onAdd={() => 0}
          amount={currentTerminal?.txFlow?.request.data.cashAmount ?? 0}
          viewOnly
        />
        <OrderLineItem
          disabled
          label="Tip"
          onAdd={() => 0}
          amount={currentTerminal?.txFlow?.request.data.tipAmount ?? 0}
          viewOnly
        />
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
