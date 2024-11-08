import React, { useMemo } from 'react';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useStyles from './index.styles';
import {
  orderCashoutAmountSelector,
  orderPromptForCashoutSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  productSubTotalSelector,
} from '../../redux/reducers/ProductSlice/productSelector';
import { initiateMotoPurchase } from '../../utils/common/purchase/purchaseHelper';
import { IProps } from './interfaces';
import { PATH_SPLIT } from '../../definitions/constants/routerConfigs';

export const PayNowOrderConfirmation: React.FC<IProps> = ({ setShowTransactionProgressModal, transactionHandler }) => {
  const classes = useStyles();
  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const subtotalAmount = useSelector(productSubTotalSelector);
  const promptForCashout = useSelector(orderPromptForCashoutSelector);

  const selectedTerminalId = transactionHandler?.terminalId;

  const isCardDisabled = useMemo(
    () => !transactionHandler || subtotalAmount <= 0,
    [transactionHandler, subtotalAmount]
  );
  const isMotoDisabled = useMemo(
    () => !transactionHandler || subtotalAmount <= 0 || cashoutAmount > 0 || tipAmount > 0,
    [transactionHandler, subtotalAmount, cashoutAmount, tipAmount]
  );
  const isSplitDisabled = useMemo(
    () => !transactionHandler || subtotalAmount <= 0 || surchargeAmount > 0 || cashoutAmount > 0 || tipAmount > 0,
    [transactionHandler, subtotalAmount, surchargeAmount, cashoutAmount, tipAmount]
  );
  return (
    <>
      <Typography className={classes.label}>Select payment method</Typography>
      <Divider />
      <Box display="flex" justifyContent="space-evenly">
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={isCardDisabled}
          focusRipple
          classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
          onClick={() => {
            setShowTransactionProgressModal(true);
            transactionHandler?.initiatePurchase(
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
          disabled={isMotoDisabled}
          focusRipple
          classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
          onClick={() => {
            setShowTransactionProgressModal(true);
            initiateMotoPurchase(selectedTerminalId!, subtotalAmount, surchargeAmount);
          }}
        >
          Moto
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={isSplitDisabled}
          focusRipple
          classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
          component={Link}
          to={PATH_SPLIT}
        >
          Split
        </Button>
      </Box>
    </>
  );
};
