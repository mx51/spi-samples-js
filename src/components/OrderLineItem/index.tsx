import React from 'react';
import { Button, IconButton, ListItem, ListItemText } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import useStyles from './index.styles';
import { IOrderLineItemProps } from './interfaces/index';

function OrderLineItem({ label, amount }: IOrderLineItemProps): React.ReactElement {
  const classes = useStyles();

  return (
    <ListItem>
      <ListItemText primary={label} classes={{ primary: classes.additionalCharges }} />
      {amount === null ? (
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
          {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format((amount ?? 0) / 100)}
        </Button>
      )}
    </ListItem>
  );
}

export default OrderLineItem;
