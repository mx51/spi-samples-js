/* eslint-disable no-console */
import React, { useState } from 'react';
import { ListItemText, Box, Button, Divider, List, ListItem, Paper, Typography } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import { IProductSelector } from '../../../redux/reducers/ProductSlice/interfaces';
import { productsSelector, productSubTotalSelector } from '../../../redux/reducers/ProductSlice/productSelector';
import { clearAllProducts } from '../../../redux/reducers/ProductSlice/productSlice';
import currencyFormat from '../../../utils/common/intl/currencyFormatter';
import OrderLineItem from '../../OrderLineItem';
import OrderSubTotal from '../../OrderSubTotal';
import useStyles from './index.styles';

function Order(): React.ReactElement {
  const dispatch = useDispatch();
  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
  };
  const products: Array<IProductSelector> = useSelector(productsSelector);
  const subtotalAmount: number = useSelector(productSubTotalSelector);

  const [surchargeAmount, setSurchargeAmount] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);
  const [cashoutAmount, setCashoutAmount] = useState(0);

  // Note: logs will be removed once key pad component is created REMINDER: to remove eslint in line 1

  console.log(setSurchargeAmount);
  console.log(setTipAmount);
  console.log(setCashoutAmount);

  const totalAmount = subtotalAmount + surchargeAmount + tipAmount + cashoutAmount;

  const classes = useStyles();
  return (
    <Box component={Paper} className={classes.root} display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" className={classes.heading}>
        <Typography variant="h6" component="h1">
          Order
        </Typography>
        <Box>
          <Button className={classes.clear} onClick={() => clearAllProductsAction()}>
            Clear all
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box className={classes.orderList}>
        <List>
          {products.map((product) => (
            <ListItem key={product.product.id}>
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
        <OrderLineItem label="Surcharge" amount={surchargeAmount} />
        <OrderLineItem label="Cashout" amount={cashoutAmount} />
        <OrderLineItem label="Tip" amount={tipAmount} />
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
  );
}

export default Order;
