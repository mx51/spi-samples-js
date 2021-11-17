import React from 'react';
import { Box, Button, Divider, Paper, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link as LinkRouter } from 'react-router-dom';
import { PATH_PURCHASE } from '../../definitions/constants/routerConfigs';
import { ReactComponent as ConnectedIcon } from '../../images/ConnectedIcon.svg';
import { ReactComponent as UnpairedIcon } from '../../images/UnpairedIcon.svg';

import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';

import currencyFormat from '../../utils/common/intl/currencyFormatter';
import OrderLineItem from '../OrderLineItem';
import OrderSubTotal from '../OrderSubTotal';
import useStyles from './index.style';

function PaymentSummary(): React.ReactElement {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const isFinished = currentTerminal.txFlow?.finished;
  const isSuccess = currentTerminal.txFlow?.success === 'Success';

  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
  };

  return (
    <Box className={classes.root}>
      {/* Note: change Icon name */}
      <Box flexGrow="2" className={classes.roots}>
        {isFinished && isSuccess && (
          <>
            <ConnectedIcon className={classes.connectedIcon} />
            <Typography variant="h5" component="h1">
              Purchase Approved
            </Typography>
          </>
        )}
        {isFinished && !isSuccess && (
          <>
            <UnpairedIcon className={classes.unpairedIcon} />
            <Typography variant="h5" component="h1">
              Purchase Declined
            </Typography>
          </>
        )}
        <Typography className={classes.heading}>Terminal:{currentTerminal?.posId}</Typography>

        <Typography className={classes.subheading}>
          {currentTerminal.deviceAddress} S/N {currentTerminal.serialNumber}
        </Typography>
        <Box className={classes.paper} component={Paper}>
          {currencyFormat((currentTerminal.txFlow?.request.data.purchaseAmount ?? 0) / 100)}
        </Box>
        <Typography className={classes.orderSummery}>Order Summary</Typography>
        <Divider variant="middle" />
        <OrderSubTotal label="Subtotal" amount={100} />
        <OrderLineItem
          disabled={false}
          label="Surcharge"
          amount={currentTerminal.txFlow?.request.data.surchargeAmount ?? 0}
          onAdd={() => 10}
          viewOnly
        />
        <OrderLineItem
          disabled={1 > 0}
          label="Cashout"
          amount={currentTerminal.txFlow?.request.data.cashAmount ?? 0}
          onAdd={() => 0}
          viewOnly
        />
        <OrderLineItem
          disabled={2 > 0}
          label="Tip"
          amount={currentTerminal.txFlow?.request.data.tipAmount ?? 0}
          onAdd={() => 0}
          viewOnly
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          classes={{ root: classes.newOrderBtn }}
          component={LinkRouter}
          to={PATH_PURCHASE}
          onClick={clearAllProductsAction}
        >
          New Order
        </Button>
      </Box>
    </Box>
  );
}

export default PaymentSummary;
