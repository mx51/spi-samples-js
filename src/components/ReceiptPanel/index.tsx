import React from 'react';
import { Box } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { IReceiptPanel } from '../TerminalsPage/TerminalDetails/interfaces';

export default function ReceiptPanel({ children, title, css }: IReceiptPanel): React.ReactElement {
  return (
    <Grid className={css}>
      <Box>
        <Typography variant="h6" component="h1">
          {title}
        </Typography>
        {children}
      </Box>
    </Grid>
  );
}
