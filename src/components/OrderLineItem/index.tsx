import React from 'react';
import { Button, IconButton, ListItem, ListItemText } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import useStyles from './index.styles';
import { IOrderLineItemProps } from './interfaces/index';

function OrderLineItem({ label, amount }: IOrderLineItemProps): React.ReactElement {
  const classes = useStyles();

  return (
    <ListItem>
      <ListItemText primary={label} classes={{ primary: classes.additionalCharges }} />
      {amount === 0 ? (
        <IconButton aria-label="Add Amount" component="span" className={classes.addAmountBtn}>
          <AddCircleOutlineIcon />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          size="small"
          disableElevation
          classes={{ root: classes.addtionalChargeBtn, label: classes.addtionalChargeBtnLabel }}
        >
          {currencyFormat(amount / 100)}
        </Button>
      )}
    </ListItem>
  );
}

export default OrderLineItem;
