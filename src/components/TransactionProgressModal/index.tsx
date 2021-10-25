import React from 'react';
import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import useStyles from './index.styles';
import { TransactionProgressModalProps } from './interfaces';

function TransactionProgressModal({
  transactionType,
  isFinished,
  isSuccess,
  onCancelTransaction,
  onDone,
}: TransactionProgressModalProps): React.ReactElement {
  const classes = useStyles();
  return (
    <Dialog aria-labelledby="spiModalTitle" open>
      <DialogContent className={classes.transactionProgressModalContnent}>
        {!isFinished && (
          <>
            <img
              className={classes.modalImage}
              src="images/transactionStatus/inProgress.gif"
              alt="Transaction in progress img"
              width="56"
              height="56"
            />
            <Typography variant="body2" className={classes.modalHeading}>
              {transactionType.toUpperCase()}
            </Typography>
            <Typography variant="body2" className={classes.modalSublHeading}>
              In progress
            </Typography>
          </>
        )}
        {isFinished && isSuccess && (
          <>
            <img
              className={classes.modalImage}
              src="images/transactionStatus/approved.gif"
              alt="Transaction in progress img"
              width="56"
              height="56"
            />
            <Typography variant="body2" className={classes.modalHeading}>
              {transactionType.toUpperCase()}
            </Typography>
            <Typography variant="body2" className={classes.modalSublHeading}>
              Approved
            </Typography>
          </>
        )}
        {isFinished && !isSuccess && (
          <>
            <img
              className={classes.modalImage}
              src="images/transactionStatus/declined.gif"
              alt="Transaction in progress img"
              width="56"
              height="56"
            />
            <Typography variant="body2" className={classes.modalHeading}>
              {transactionType.toUpperCase()}
            </Typography>
            <Typography variant="body2" className={classes.modalSublHeading}>
              Declined
            </Typography>
          </>
        )}
        {!isFinished ? (
          <Button color="primary" variant="outlined" onClick={onCancelTransaction} className={classes.modalBtn}>
            Cancel transaction
          </Button>
        ) : (
          <Button color="primary" variant="contained" onClick={onDone} className={classes.modalBtn}>
            Done
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TransactionProgressModal;
