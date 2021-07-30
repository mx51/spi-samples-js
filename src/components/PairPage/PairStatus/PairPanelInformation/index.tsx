import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import useStyles from '../index.styles';
import { PairPanelInformationInterface } from '../interfaces';

export default function index({ title, content }: PairPanelInformationInterface): React.ReactElement {
  const classes = useStyles();

  return (
    <Box display="flex" flexDirection="column" className={classes.statusInfoBox}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="inherit">{content}</Typography>
    </Box>
  );
}
