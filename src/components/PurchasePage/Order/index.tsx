import React from 'react';
import { ListItemText, Box, Button, Divider, List, ListItem, Paper, Typography, IconButton } from '@material-ui/core';
import { ReactComponent as AddIcon } from '../../../images/AddIcon.svg';
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
        <ListItem>
          <ListItemText primary="Subtotal" classes={{ primary: classes.subTotal }} />
          <Typography className={classes.price}>$15.00</Typography>
        </ListItem>
        <ListItem>
          <ListItemText primary="Cashout" classes={{ primary: classes.additionalCharges }} />
          <Button
            variant="contained"
            size="small"
            disableElevation
            classes={{ root: classes.addtionalChargeBtn, label: classes.addtionalChargeBtnLabel }}
          >
            $0.50
          </Button>
        </ListItem>
        <ListItem>
          <ListItemText primary="Surcharge" classes={{ primary: classes.additionalCharges }} />
          <IconButton>
            <AddIcon />
          </IconButton>
        </ListItem>
        <ListItem>
          <ListItemText primary="Tip" classes={{ primary: classes.additionalCharges }} />
          <IconButton>
            <AddIcon />
          </IconButton>
        </ListItem>
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
