import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import BackspaceOutlinedIcon from '@material-ui/icons/BackspaceOutlined';
import CloseIcon from '@material-ui/icons/Close';
import calculator from './calculator';
import useStyles from './index.styles';
import { IKeyPadProps } from './interfaces';

function KeyPad({ title, subtitle, defaultAmount, onAmountChange, onClose }: IKeyPadProps): React.ReactElement {
  const classes = useStyles();
  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', '0', '.'];
  const [amount, setAmount] = useState((defaultAmount / 100).toString());

  const amountChangeHandler = () => {
    const newAmount = Math.round(parseFloat(amount) * 100);
    if (newAmount !== defaultAmount) {
      onAmountChange(newAmount);
    } else {
      onClose();
    }
  };

  const updateAmount = (num: string) => {
    if (KEYS.includes(num)) {
      setAmount((amt) => calculator(amt, num));
    } else if (num === 'Enter') {
      amountChangeHandler();
    }
  };

  const keyboardHandler = (event: KeyboardEvent) => {
    updateAmount(event.key);
  };

  useEffect(() => {
    document.addEventListener('keydown', keyboardHandler);

    return function cleanup() {
      document.removeEventListener('keydown', keyboardHandler);
    };
  }, [amount]);

  return (
    <Box component={Paper} className={classes.root} display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" className={classes.heading} alignItems="center">
        <Typography variant="h6" component="h1">
          {title}
        </Typography>
        <Box>
          <Button aria-label="Close Button" onClick={onClose}>
            <CloseIcon />
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box className={classes.keypadDisplay}>
        <Typography className={classes.keypadDisplayLabel}>{subtitle}</Typography>
        <Typography variant="h6" component="h1" className={classes.keypadDisplayAmount}>
          {amount}
        </Typography>
      </Box>
      <Divider />
      <Grid container className={classes.grid}>
        {KEYS.map((num) => (
          <Grid item xs={4} key={`keypad-${num}`}>
            <Button
              color="primary"
              variant="outlined"
              fullWidth
              classes={{ root: classes.keypadBtn, label: classes.keypadBtnLabel }}
              onClick={() => updateAmount(num)}
            >
              {num !== 'Backspace' ? num : <BackspaceOutlinedIcon className={classes.keypadBtnLabel} />}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Button
        variant="contained"
        color="primary"
        size="large"
        classes={{ root: classes.okBtn, label: classes.okBtnLabel }}
        onClick={amountChangeHandler}
      >
        OK
      </Button>
    </Box>
  );
}

export default KeyPad;
