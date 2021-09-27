import React, { useState } from 'react';
import { ListItemText, Box, Button, Divider, List, ListItem, Paper, Typography, Drawer } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { IProductSelector } from '../../../redux/reducers/ProductSlice/interfaces';
import {
  orderCashoutAmountSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  productsSelector,
  productSubTotalSelector,
} from '../../../redux/reducers/ProductSlice/productSelector';
import {
  addCashoutAmount,
  addSurchargeAmount,
  addTipAmount,
  clearAllProducts,
} from '../../../redux/reducers/ProductSlice/productSlice';
import currencyFormat from '../../../utils/common/intl/currencyFormatter';
import KeyPad from '../../KeyPad';
import OrderLineItem from '../../OrderLineItem';
import OrderSubTotal from '../../OrderSubTotal';
import useStyles from './index.styles';

function Order(): React.ReactElement {

  const SURCHARGE_AMOUNT = 'SURCHARGE_AMOUNT'
  const CASHOUT_AMOUNT = 'CASHOUT_AMOUNT'
  const TIP_AMOUNT = 'TIP_AMOUNT'

  const dispatch = useDispatch();

  const products: Array<IProductSelector> = useSelector(productsSelector);
  const subtotalAmount: number = useSelector(productSubTotalSelector);

  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);

  const [keypadType, setkeypadType] = useState<string>('');

  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
    dispatch(addSurchargeAmount(0));
    dispatch(addCashoutAmount(0));
    dispatch(addTipAmount(0));
  };

  const totalAmount = subtotalAmount + surchargeAmount + tipAmount + cashoutAmount;
  const requestAmount = (val: string) => {
    setkeypadType(val);
  };

  const getDefaultKeypadAmount = (): number => {
    if (keypadType === SURCHARGE_AMOUNT) return surchargeAmount;
    if (keypadType === CASHOUT_AMOUNT) return cashoutAmount;
    if (keypadType === TIP_AMOUNT) return tipAmount;
    return 0;
  };

  const setKeypadAmount = (val: number) => {
    if (keypadType === SURCHARGE_AMOUNT) dispatch(addSurchargeAmount(val));
    else if (keypadType === CASHOUT_AMOUNT) dispatch(addCashoutAmount(val));
    else if (keypadType === TIP_AMOUNT) dispatch(addTipAmount(val));
    setkeypadType('');
  };

  const getTitle = () => {
    if (keypadType === SURCHARGE_AMOUNT) return 'Surcharge';
    if (keypadType === CASHOUT_AMOUNT) return 'Cashout';
    if (keypadType === TIP_AMOUNT) return 'Tip';
    return '';
  };

  const classes = useStyles();
  return (
    <>
      <Drawer
        anchor="right"
        open={keypadType !== ''}
        classes={{
          paper: classes.keypadDrawerPaper,
        }}
      >
        <KeyPad
          open={keypadType !== ''}
          title={getTitle()}
          defaultAmount={getDefaultKeypadAmount()}
          onClose={() => {
            setkeypadType('');
          }}
          onAmountChange={setKeypadAmount}
        />
      </Drawer>

      <Box component={Paper} className={classes.root} display="flex" flexDirection="column">
        <Box display="flex" justifyContent="space-between" className={classes.heading} alignItems="center">
          <Typography variant="h6" component="h1">
            Order
          </Typography>
          <Box>
            <Button className={classes.clear} onClick={clearAllProductsAction}>
              Clear all
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box className={classes.orderList}>
          <List>
            {products.map((product) => (
              <ListItem key={`product_${product.product.id}`}>
                <ListItemText
                  primary={`${product.quantity} x ${product.product.name}`}
                  classes={{ primary: classes.items }}
                />
                <Typography className={classes.amount}>
                  {currencyFormat((product.product.price * product.quantity) / 100)}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
        <List>
          <OrderSubTotal label="Subtotal" amount={subtotalAmount} />
          <OrderLineItem disabled={false} label="Surcharge" amount={surchargeAmount} onAdd={() => requestAmount(SURCHARGE_AMOUNT)} />
          <OrderLineItem
            disabled={tipAmount > 0}
            label="Cashout"
            amount={cashoutAmount}
            onAdd={() => requestAmount(CASHOUT_AMOUNT)}
          />
          <OrderLineItem disabled={cashoutAmount > 0} label="Tip" amount={tipAmount} onAdd={() => requestAmount(TIP_AMOUNT)} />
          <Divider variant="middle" />
          <ListItem>
            <ListItemText primary="Total" classes={{ primary: classes.total }} />
            <Typography className={classes.totalPrice}>{currencyFormat(totalAmount / 100)}</Typography>
          </ListItem>
        </List>
        <Button
          variant="contained"
          color="primary"
          size="large"
          classes={{ root: classes.payNowBtn, label: classes.payNowBtnLabel }}
        >
          Pay now
        </Button>
      </Box>
    </>
  );
}

export default Order;
