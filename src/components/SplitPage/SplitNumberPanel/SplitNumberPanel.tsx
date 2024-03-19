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
  numberOfSplits: number;
  onNumberOfSplitsChange: (numberOfSplits: number) => void;
};

export const SplitNumberPanel: React.FC<SplitNumberPanelProps> = ({
  totalAmount,
  numberOfSplits,
  onNumberOfSplitsChange,
}) => {
  const classes = useStyles();

  const changeNumberOfSplits = (addend: number) => {
    const newNumber = numberOfSplits + addend;
    onNumberOfSplitsChange(newNumber < 2 ? 2 : newNumber);
  };

  return (
    <>
      <Typography className={classes.dividerLabel}>Number of splits</Typography>
      <Divider className={classes.divider} />
      <Box className={classes.panel}>
        <SquareIconButton
          aria-label="decrease number of splits"
          color="primary"
          onClick={() => changeNumberOfSplits(-1)}
        >
          <RemoveIcon />
        </SquareIconButton>
        <span className={classes.numberOfSplits}>{numberOfSplits}</span>
        <SquareIconButton
          aria-label="decrease number of splits"
          color="primary"
          onClick={() => changeNumberOfSplits(1)}
        >
          <AddIcon />
        </SquareIconButton>
        <span className={classes.amountPerSplit}>
          approximately {currencyFormat(totalAmount / numberOfSplits / 100)} per split
        </span>
      </Box>
    </>
  );
};
