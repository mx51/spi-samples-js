import React, { HTMLAttributes } from 'react';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import useStyles from './index.styles';

interface Props extends HTMLAttributes<HTMLLIElement> {
  label: string;
  amount: number;
}

function OrderSubTotal({ label, amount, ...others }: Props): React.ReactElement {
  const classes = useStyles();

  return (
    <ListItem {...others}>
      <ListItemText primary={label} classes={{ primary: classes.subTotal }} />
      <Typography className={classes.price}>{currencyFormat(amount / 100)}</Typography>
    </ListItem>
  );
}

export default OrderSubTotal;
