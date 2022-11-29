import React from 'react';
import { Button, IconButton, ListItem, ListItemText, Typography } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import useStyles from './index.styles';
import { IOrderLineItemProps } from './interfaces/index';

function OrderLineItem({ label, amount, onAdd, disabled, viewOnly }: IOrderLineItemProps): React.ReactElement {
  const classes = useStyles();

  return (
    <ListItem>
      <ListItemText
        primary={label}
        classes={{
          primary: !viewOnly ? classes.additionalChargesEnable : classes.additionalChargesDisable,
        }}
      />

      {viewOnly && <Typography>{currencyFormat(amount / 100)}</Typography>}
      {!viewOnly &&
        (amount === 0 ? (
          <IconButton
            disabled={disabled}
            aria-label="Add Amount"
            component="span"
            className={classes.addAmountBtn}
            onClick={onAdd}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            size="small"
            disableElevation
            disabled={disabled}
            classes={{ root: classes.additionalChargeBtn, label: classes.additionalChargeBtnLabel }}
            onClick={onAdd}
          >
            {currencyFormat(amount / 100)}
          </Button>
        ))}
    </ListItem>
  );
}

export default OrderLineItem;
