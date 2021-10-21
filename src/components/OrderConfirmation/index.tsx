import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { useDispatch, useSelector } from 'react-redux';
import { orderTotalSelector } from '../../redux/reducers/ProductSlice/productSelector';
import { clearAllProducts } from '../../redux/reducers/ProductSlice/productSlice';
import { pairedTerminalList } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import currencyFormat from '../../utils/common/intl/currencyFormatter';
import KeyPad from '../KeyPad';
import useStyles from './index.styles';

function PayNow(): React.ReactElement {
  const dispatch = useDispatch();

  const classes = useStyles();
  const originalTotalAmount: number = useSelector(orderTotalSelector);
  const terminals = useSelector(pairedTerminalList);

  const clearAllProductsAction = () => {
    dispatch(clearAllProducts());
  };

  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const [selectedTerminal, setSelectedTerminal] = useState<string>();
  const [totalAmount, setTotalAmount] = useState<number>(originalTotalAmount);

  return (
    <>
      <Drawer
        anchor="right"
        open={displayKeypad}
        classes={{
          paper: classes.keypadDrawerPaper,
        }}
      >
        <KeyPad
          open={displayKeypad}
          title="Override Purchase amount"
          subtitle="Enter purchase amount"
          defaultAmount={totalAmount}
          onClose={() => {
            setDisplayKeypad(false);
          }}
          onAmountChange={(amount) => {
            setTotalAmount(amount);
            setDisplayKeypad(false);
            clearAllProductsAction();
          }}
        />
      </Drawer>
      <Grid container justifyContent="center">
        <Grid item xs={7} className={classes.gridStyles}>
          <Box className={classes.root} display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box flex="1">
                <Typography className={classes.payLabel}>Pay</Typography>
              </Box>
              <Button className={classes.orderTotalBtn} onClick={() => setDisplayKeypad(true)}>
                <Box
                  flex="1"
                  display="flex"
                  className={classes.paper}
                  onClick={() => setDisplayKeypad(true)}
                  component={Paper}
                >
                  <Box className={classes.orderTotalInputField} flex="1">
                    {currencyFormat(totalAmount / 100)}
                  </Box>
                  <Box>
                    <Icon>
                      <CreateIcon />
                    </Icon>
                  </Box>
                </Box>
              </Button>
            </Box>
            <Typography className={classes.label}>Select terminal</Typography>
            <Divider />
            <RadioGroup className={classes.radioGroup} aria-label="terminalList" name="terminalList">
              <Box>
                <List>
                  {terminals.map((terminal) => (
                    <ListItem key={terminal.id} dense disableGutters>
                      <ListItemIcon>
                        <Radio
                          onClick={() => setSelectedTerminal(terminal.id)}
                          className={classes.radioBtn}
                          checked={terminal.id === selectedTerminal}
                          value={terminal.id}
                          name="terminal"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={terminal.posId}
                        secondary={`${terminal.deviceAddress} S/N ${terminal.serialNumber}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </RadioGroup>
            <Typography className={classes.label}>Select payment method</Typography>
            <Divider />
            <Box display="flex" justifyContent="space-evenly">
              <Button
                variant="contained"
                color="primary"
                size="large"
                focusRipple
                classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
              >
                Card
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                focusRipple
                classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
              >
                Moto
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default PayNow;
