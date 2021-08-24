import React from 'react';
import { ListItemText, Box, Button, Divider, List, ListItem, Paper, Typography } from '@material-ui/core';

import OrderLineItem from '../../OrderLineItem';
import OrderSubTotal from '../../OrderSubTotal';
import useStyles from './index.styles';

function Order(): React.ReactElement {
  const classes = useStyles();
  return (
    <Box component={Paper} className={classes.root} display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" className={classes.heading}>
        <Typography variant="h6" component="h1">
          Order
        </Typography>
        <Box>
          <Button className={classes.clear}>Clear all</Button>
        </Box>
      </Box>
      <Divider />
      <Box flexGrow={1}>
        <p>TODO</p>
      </Box>
      <Divider />
      <List>
        <OrderSubTotal label="subtotal" amount={10} />
        <OrderLineItem label="Surcharge" amount={0.5} />
        <OrderLineItem label="Cashout" amount={null} />
        <OrderLineItem label="Tip" amount={null} />
        <Divider variant="middle" />
        <ListItem>
          <ListItemText primary="Total" classes={{ primary: classes.total }} />
          <Typography className={classes.totalPrice}>$0.00</Typography>
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
