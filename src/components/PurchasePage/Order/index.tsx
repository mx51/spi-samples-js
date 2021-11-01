import React, { useState } from 'react';
import { ListItemText, Box, Button, Divider, List, ListItem, Paper, Typography, Drawer } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link as LinkRouter } from 'react-router-dom';
import { PATH_PAY_NOW, PATH_PURCHASE } from '../../../definitions/constants/routerConfigs';
import { IProductSelector } from '../../../redux/reducers/ProductSlice/interfaces';
import {
  orderCashoutAmountSelector,
  orderSurchargeAmountSelector,
  orderTipAmountSelector,
  orderTotalSelector,
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
import { IOrderProps } from './interface';

function Order({ disablePayNow }: IOrderProps): React.ReactElement {
  const SURCHARGE_AMOUNT = 'SURCHARGE_AMOUNT';
  const CASHOUT_AMOUNT = 'CASHOUT_AMOUNT';
  const TIP_AMOUNT = 'TIP_AMOUNT';

  const dispatch = useDispatch();

  const products: Array<IProductSelector> = useSelector(productsSelector);
  const subtotalAmount: number = useSelector(productSubTotalSelector);

  const surchargeAmount: number = useSelector(orderSurchargeAmountSelector);
  const cashoutAmount: number = useSelector(orderCashoutAmountSelector);
  const tipAmount: number = useSelector(orderTipAmountSelector);

  const [keypadType, setKeypadType] = useState<string>('');
  const totalAmount: number = useSelector(orderTotalSelector);

  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
  };

  const requestAmount = (val: string) => {
    setKeypadType(val);
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
    setKeypadType('');
  };

  const getTitle = () => {
    if (keypadType === SURCHARGE_AMOUNT) return 'Surcharge';
    if (keypadType === CASHOUT_AMOUNT) return 'Cashout';
    if (keypadType === TIP_AMOUNT) return 'Tip';
    return '';
  };

  const getSubtitle = () => `Enter ${getTitle().toLowerCase()} amount`;

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
          subtitle={getSubtitle()}
          defaultAmount={getDefaultKeypadAmount()}
          onClose={() => {
            setKeypadType('');
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
            {!disablePayNow && (
              <Button className={classes.clear} onClick={clearAllProductsAction}>
                Clear all
              </Button>
            )}
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
          <OrderLineItem
            disabled={false}
            label="Surcharge"
            amount={surchargeAmount}
            onAdd={() => requestAmount(SURCHARGE_AMOUNT)}
            viewOnly={disablePayNow}
          />
          <OrderLineItem
            disabled={tipAmount > 0}
            label="Cashout"
            amount={cashoutAmount}
            onAdd={() => requestAmount(CASHOUT_AMOUNT)}
            viewOnly={disablePayNow}
          />
          <OrderLineItem
            disabled={cashoutAmount > 0}
            label="Tip"
            amount={tipAmount}
            onAdd={() => requestAmount(TIP_AMOUNT)}
            viewOnly={disablePayNow}
          />
          <Divider variant="middle" />
          <ListItem>
            <ListItemText primary="Total" classes={{ primary: classes.total }} />
            <Typography className={classes.totalPrice}>{currencyFormat(totalAmount / 100)}</Typography>
          </ListItem>
        </List>
        {!disablePayNow ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            classes={{ root: classes.payNowBtn, label: classes.actionBtnLabel }}
            component={LinkRouter}
            to={PATH_PAY_NOW}
          >
            Pay now
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            classes={{ root: classes.amendBtn, label: classes.actionBtnLabel }}
            component={LinkRouter}
            to={PATH_PURCHASE}
          >
            &lt; Amend order
          </Button>
        )}
      </Box>
    </>
  );
}

export default Order;
