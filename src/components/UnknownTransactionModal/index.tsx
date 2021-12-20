import React from 'react';
import { Box, Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Link as LinkRouter } from 'react-router-dom';
import { PATH_ORDER_FINISHED } from '../../definitions/constants/routerConfigs';
import { ReactComponent as WarningIcon } from '../../images/WarningIcon.svg';
import useStyles from './index.styles';

import { UnknownTransactionModalProps } from './interfaces';

function UnknownTransactionModal({
  onFailedTransaction,
  onSuccessTransaction,
}: UnknownTransactionModalProps): React.ReactElement {
  const classes = useStyles();
  return (
    <Dialog aria-labelledby="spiModalTitle" open>
      <DialogContent className={classes.transactionProgressModalContnent}>
        <>
          <WarningIcon />
          <Typography variant="body2" className={classes.modalHeading}>
            Unknown transaction status
          </Typography>
          <Typography variant="body2" className={classes.modalSublHeading}>
            Was the transaction successful on the Eftpos terminal?
          </Typography>
        </>
        <Box display="flex" justifyContent="space-evenly">
          <Button
            color="primary"
            variant="outlined"
            className={classes.modalBtn}
            component={LinkRouter}
            to={PATH_ORDER_FINISHED}
            onClick={onSuccessTransaction}
          >
            Yes
          </Button>
          <Button
            color="primary"
            variant="outlined"
            className={classes.modalBtn}
            component={LinkRouter}
            to={PATH_ORDER_FINISHED}
            onClick={onFailedTransaction}
          >
            No
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default UnknownTransactionModal;
