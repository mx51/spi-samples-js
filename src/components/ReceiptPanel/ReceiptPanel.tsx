import React, { useState } from 'react';
import { Box, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { IReceiptPanel } from '../TerminalsPage/TerminalDetails/interfaces';
import { useReceiptPanelStyles } from './index.styles';
import { ReactComponent as TickIcon } from '../../images/TickIcon.svg';
import { ReactComponent as CopyIcon } from '../../images/CopyIcon.svg';

export default function ReceiptPanel({ children, title, css, textReceipt }: IReceiptPanel): React.ReactElement {
  const classes = useReceiptPanelStyles();
  const [copySuccess, setCopySuccess] = useState<string>('');

  const copyToClipboard = async (receipt: string) => {
    try {
      await navigator.clipboard.writeText(receipt);
      setCopySuccess('Success');
      setTimeout(() => {
        setCopySuccess('');
      }, 1000);
    } catch (err) {
      console.log('Failed to copy: ', err);
    }
  };

  return (
    <Grid className={css}>
      <Box className={classes.box}>
        <Grid className={classes.gridContainer}>
          <Grid item md={12} className={classes.receiptGrid}>
            <Typography variant="h6" component="h1">
              {title}
            </Typography>
            {children}
          </Grid>
          <Grid item md={12} className={classes.buttonGrid}>
            {textReceipt && (
              <Button className={classes.button} onClick={() => copyToClipboard(textReceipt)}>
                {copySuccess ? <TickIcon /> : <CopyIcon />}
                Copy Receipt
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}
