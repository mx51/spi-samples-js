import React from 'react';
import { Box, Divider, FormHelperText, IconButton, Typography, withStyles } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import currencyFormat from '../../../utils/common/intl/currencyFormatter';
import { useStyles } from './SplitNumberPanel.styles';

const SquareIconButton = withStyles({
  root: {
    color: 'white',
    backgroundColor: '#3A4D8F',
    borderRadius: '8px',
    width: '36px',
    height: '36px',
    '&:hover': {
      backgroundColor: '#3A4D8F',
    },
  },
})(IconButton);

export type SplitNumberPanelProps = {
  totalAmount: number;
  splitNumber: number;
  onSplitNumberChange: (splitNumber: number) => void;
};

export const SplitNumberPanel: React.FC<SplitNumberPanelProps> = ({
  totalAmount,
  splitNumber,
  onSplitNumberChange,
}) => {
  const classes = useStyles();

  const changeSplitNumber = (addend: number) => {
    const newSplitNumber = splitNumber + addend;
    onSplitNumberChange(newSplitNumber < 0 ? 0 : newSplitNumber);
  };

  return (
    <>
      <Typography className={classes.dividerLabel}>Number of splits</Typography>
      <Divider className={classes.divider} />
      <Box className={classes.panel}>
        <SquareIconButton aria-label="decrease number of splits" color="primary" onClick={() => changeSplitNumber(-1)}>
          <RemoveIcon />
        </SquareIconButton>
        <span className={classes.splitNumber}>{splitNumber}</span>
        <SquareIconButton aria-label="decrease number of splits" color="primary" onClick={() => changeSplitNumber(1)}>
          <AddIcon />
        </SquareIconButton>
        {splitNumber > 0 && (
          <span className={classes.splitAmount}>
            approximately {currencyFormat(totalAmount / splitNumber / 100)} per split
          </span>
        )}
      </Box>
      {splitNumber <= 0 && <FormHelperText error>Please select number of splits to continue</FormHelperText>}
    </>
  );
};
