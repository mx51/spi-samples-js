import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useStyles from './index.styles';

export default function ReceiptPanel(): React.ReactElement {
  const classes = useStyles();
  return (
    <Grid className={classes.root}>
      <Typography variant="h6" component="h1">
        Receipt
      </Typography>
    </Grid>
  );
}
