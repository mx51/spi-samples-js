import React from 'react';
import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Link as LinkRouter } from 'react-router-dom';
import { SPI_TRANSACTION_TYPES } from '../../definitions/constants/commonConfigs';
import { PATH_ORDER_FINISHED, TEXT_CASHOUT } from '../../definitions/constants/routerConfigs';
import useStyles from './index.styles';

import { TransactionProgressModalProps } from './interfaces';

function TransactionProgressModal({
  transactionType,
  isFinished,
  isSuccess,
  onCancelTransaction,
}: TransactionProgressModalProps): React.ReactElement {
  const classes = useStyles();

  const modalTitle =
    transactionType === SPI_TRANSACTION_TYPES.CashoutOnly ? TEXT_CASHOUT.toUpperCase() : transactionType.toUpperCase();

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
            <Typography variant="body2" className={classes.modalSubHeading}>
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
              {modalTitle}
            </Typography>
            <Typography variant="body2" className={classes.modalSubHeading}>
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
              {modalTitle}
            </Typography>
            <Typography variant="body2" className={classes.modalSubHeading}>
              Declined
            </Typography>
          </>
        )}
        {!isFinished ? (
          <Button color="primary" variant="outlined" onClick={onCancelTransaction} className={classes.modalBtn}>
            Cancel transaction
          </Button>
        ) : (
          <Button
            color="primary"
            variant="contained"
            component={LinkRouter}
            to={PATH_ORDER_FINISHED}
            className={classes.modalBtn}
          >
            Done
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TransactionProgressModal;
