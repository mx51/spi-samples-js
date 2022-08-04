import React from 'react';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import useStyles from './index.styles';
import { IOrderSubTotalProps } from './interfaces';

function OrderSubTotal({ label, amount }: IOrderSubTotalProps): React.ReactElement {
  const classes = useStyles();

  return (
    <ListItem>
      <ListItemText primary={label} classes={{ primary: classes.subTotal }} />
      <Typography className={classes.price}>{currencyFormat(amount / 100)}</Typography>
    </ListItem>
  );
}

export default OrderSubTotal;