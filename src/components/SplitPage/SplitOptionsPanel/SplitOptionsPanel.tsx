import React from 'react';
import { Divider, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { SplitMode } from '../interfaces';
import { useStyles } from './SplitOptionsPanel.styles';

export type SplitOptionsPanelProps = {
  splitOption: SplitMode;
  onSplitOptionChange: (splitOption: SplitMode) => void;
};

export const SplitOptionsPanel: React.FC<SplitOptionsPanelProps> = ({ splitOption, onSplitOptionChange }) => {
  const classes = useStyles();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onSplitOptionChange(event.target.value as SplitMode);
  }

  return (
    <>
      <Typography className={classes.dividerLabel}>Options</Typography>
      <Divider className={classes.divider} />
      <RadioGroup name="splitOptions" value={splitOption} onChange={(e) => handleChange(e)}>
        <FormControlLabel value="splitEvenly" label="Split evenly" control={<Radio color="primary" />} />
        <FormControlLabel value="splitByAmount" label="Split by amount" control={<Radio color="primary" />} />
      </RadioGroup>
    </>
  );
};
