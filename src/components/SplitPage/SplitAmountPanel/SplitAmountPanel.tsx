import { Box, Button, Divider, Drawer, FormHelperText, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import currencyFormat from '../../../utils/common/intl/currencyFormatter';
import KeyPad from '../../KeyPad';
import { useStyles } from './SplitAmountPanel.styles';

export type SplitAmountPanelProps = {
  splitAmount: number;
  totalAmount: number;
  onSplitAmountChange: (splitAmount: number) => void;
};
export const SplitAmountPanel: React.FC<SplitAmountPanelProps> = ({
  splitAmount,
  totalAmount,
  onSplitAmountChange,
}) => {
  const classes = useStyles();
  const [displayKeypad, setDisplayKeypad] = useState(false);

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
          title="Split"
          subtitle="Enter split amount"
          defaultAmount={0}
          onClose={() => {
            setDisplayKeypad(false);
          }}
          onAmountChange={(amount) => {
            setDisplayKeypad(false);
            if (amount >= totalAmount) {
              onSplitAmountChange(totalAmount);
            } else {
              onSplitAmountChange(amount);
            }
          }}
        />
      </Drawer>
      <Typography className={classes.dividerLabel}>Amount to split</Typography>
      <Divider className={classes.divider} />
      <Box className={classes.panel}>
        <Button
          classes={{ root: classes.splitAmountButton, label: classes.splitAmountButtonLabel }}
          onClick={() => {
            setDisplayKeypad(true);
          }}
        >
          {currencyFormat(splitAmount / 100)}
        </Button>

        <span className={classes.outstandingAmount}>{currencyFormat((totalAmount - splitAmount) / 100)} remaining</span>
      </Box>
      {splitAmount <= 0 && (
        <FormHelperText error className={classes.errorText}>
          Please enter an amount to continue
        </FormHelperText>
      )}
    </>
  );
};
