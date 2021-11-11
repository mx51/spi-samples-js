import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { IReceiptPanel } from '../TerminalsPage/TerminalDetails/interfaces';
import useStyles from './index.styles';

export default function ReceiptPanel({ children, title }: IReceiptPanel): React.ReactElement {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <Typography variant="h6" component="h1">
        {title}
      </Typography>
      {children}
    </Grid>
  );
}
