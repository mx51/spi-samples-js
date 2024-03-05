import React, { useEffect, useMemo } from 'react';
import { Box, Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { Link as LinkRouter } from 'react-router-dom';
import useStyles from './index.style';
import {
  PATH_ACCOUNT_VERIFY,
  PATH_PRE_AUTH,
  TEXT_PRE_AUTH,
  PATH_PURCHASE,
} from '../../definitions/constants/routerConfigs';
import { ReactComponent as FailedIcon } from '../../images/FailedIcon.svg';
import { ReactComponent as SuccessIcon } from '../../images/SuccessIcon.svg';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';
import { ITxFlow } from '../../redux/reducers/TerminalSlice/interfaces';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import OrderLineItem from '../OrderLineItem';
import OrderSubTotal from '../OrderSubTotal';
import { getTxTypeByPosRefId } from '../../utils/tx-utils';

interface Props {
  typePath: string;
  isTxFinished: boolean;
  isTxSuccess: boolean;

  // TODO: confirm with product about the expected behaviour if the page is refresh
  // i.e no information on the last txFlow, posId, ...
  posId?: string;
  deviceAddress?: string;
  serialNumber?: string;
  txFlow: ITxFlow | null;
}

export const PaymentSummary: React.FC<Props> = ({
  typePath,
  isTxFinished,
  isTxSuccess,
  posId,
  deviceAddress,
  serialNumber,
  txFlow,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearAllProducts());
  }, []);

  const amountSummaryInformation = (type: string) => {
    const responseData = txFlow?.override ? txFlow?.request.data : txFlow?.response.data;
    if (responseData) return (responseData as Any)[type] ?? 0;
    return 0;
  };

  const pathNameFormatter = (path: string) => {
    if (path) {
      const pathName = path.split('/')[1];
      return pathName.charAt(0).toUpperCase() + pathName.slice(1);
    }
    return '';
  };

  const subTotal = amountSummaryInformation('purchaseAmount');
  const surchangeAmount = amountSummaryInformation('surchargeAmount');
  const cashoutAmount = amountSummaryInformation('bankCashAmount');
  const tipAmount = amountSummaryInformation('tipAmount');
  const refundAmount = amountSummaryInformation('refundAmount');

  const originalTotalAmount = [PATH_PRE_AUTH, PATH_ACCOUNT_VERIFY].includes(typePath)
    ? txFlow?.amountCents + surchangeAmount
    : subTotal + surchangeAmount + cashoutAmount + tipAmount + refundAmount;

  const transactionStatus = useMemo(() => {
    const transactionType = getTxTypeByPosRefId(txFlow?.posRefId ?? '').toUpperCase();
    const status = txFlow?.success === 'Success' ? 'APPROVED' : 'DECLINED';
    return `${transactionType} ${status}`;
  }, [txFlow]);

  return (
    <Box className={`${classes.root} ${typePath !== PATH_PURCHASE && classes.alignTop}`}>
      <Box flexGrow="2" className={classes.roots}>
        {isTxFinished && isTxSuccess && (
          <>
            <SuccessIcon data-testid="success-icon" className={classes.successIcon} />
            <Typography variant="h5" component="h1">
              {transactionStatus}
            </Typography>
          </>
        )}
        {isTxFinished && !isTxSuccess && (
          <>
            <FailedIcon data-testid="fail-icon" className={classes.failedIcon} />
            <Typography variant="h5" component="h1">
              {transactionStatus}
            </Typography>
          </>
        )}
        <Typography className={classes.heading}>Terminal: {posId}</Typography>

        <Typography className={classes.subheading}>
          {deviceAddress} | S/N {serialNumber}
        </Typography>
        <Box data-testid="total" className={classes.paper} component={Paper}>
          {currencyFormat((Number.isNaN(originalTotalAmount) ? 0 : originalTotalAmount) / 100)}
        </Box>
        {typePath === PATH_PURCHASE ? (
          <>
            <Typography className={classes.orderSummery}>Order Summary</Typography>
            <Divider variant="middle" />
            <OrderSubTotal
              data-testid="subTotal"
              label="Subtotal"
              amount={amountSummaryInformation('purchaseAmount')}
            />
            <OrderLineItem
              data-testid="surchage"
              disabled
              label="Surcharge"
              amount={amountSummaryInformation('surchargeAmount')}
              viewOnly
            />
            <OrderLineItem
              data-testid="cashout"
              disabled
              label="Cashout"
              amount={amountSummaryInformation('bankCashAmount')}
              viewOnly
            />
            <OrderLineItem
              data-testid="tip"
              disabled
              label="Tip"
              amount={amountSummaryInformation('tipAmount')}
              viewOnly
            />
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
                to={typePath !== PATH_ACCOUNT_VERIFY ? typePath : PATH_PRE_AUTH}
              >
                {typePath !== PATH_ACCOUNT_VERIFY ? pathNameFormatter(typePath) : TEXT_PRE_AUTH}
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
};
