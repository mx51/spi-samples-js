import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Link as LinkRouter } from 'react-router-dom';
import { SPI_TRANSACTION_TYPES } from '../../definitions/constants/commonConfigs';
import { PATH_ORDER_FINISHED, TEXT_CASHOUT } from '../../definitions/constants/routerConfigs';
import { ReactComponent as IconWarning } from '../../images/WarningIcon.svg';
import { useAppSelector } from '../../redux/hooks';
import { terminalTxFlowAwaitingSignatureTracker } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { approveSignature, declineSignature } from '../../utils/common/terminal/terminalHelpers';
import useStyles from './index.styles';
import { TransactionProgressModalProps } from './interfaces';

function TransactionProgressModal({
  terminalId,
  transactionType,
  isFinished,
  isSuccess,
  onCancelTransaction,
  onRetryTransaction,
}: TransactionProgressModalProps): React.ReactElement {
  const classes = useStyles();
  const awaitingSignatureCheck = useAppSelector(terminalTxFlowAwaitingSignatureTracker(terminalId));
  const modalTitle =
    transactionType === SPI_TRANSACTION_TYPES.CashoutOnly ? TEXT_CASHOUT.toUpperCase() : transactionType.toUpperCase();

  const handleApprove = () => {
    approveSignature(terminalId);
  };

  const handleDecline = () => {
    declineSignature(terminalId);
  };

  return (
    <Dialog aria-labelledby="spiModalTitle" open>
      {awaitingSignatureCheck ? (
        <>
          <DialogTitle>
            <IconButton onClick={handleDecline} className={classes.closeButton}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box className={classes.signatureFlow}>
              <IconWarning />
              <Typography variant="h6">Confirm customer signature</Typography>
              <Typography variant="body2">
                Does the customer&#39;s signature match the signature on the card?
              </Typography>
              <Button color="primary" data-test-id="approveSignature" onClick={handleApprove}>
                Yes
              </Button>
              <Button color="primary" data-test-id="declineSignature" onClick={handleDecline}>
                No
              </Button>
            </Box>
          </DialogContent>
        </>
      ) : (
        <DialogContent className={classes.transactionProgressModalContent}>
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
                In progress ...
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
          {!isFinished && (
            <Button color="primary" variant="outlined" onClick={onCancelTransaction} className={classes.modalBtn}>
              Cancel transaction
            </Button>
          )}

          {isFinished && isSuccess && (
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
          {isFinished && !isSuccess && (
            <Box display="flex" justifyContent="space-evenly">
              <Button
                color="primary"
                variant="contained"
                component={LinkRouter}
                to={PATH_ORDER_FINISHED}
                className={classes.modalBtn}
              >
                Done
              </Button>
              <Button color="primary" variant="outlined" onClick={onRetryTransaction} className={classes.modalBtn}>
                Retry
              </Button>
            </Box>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}

export default TransactionProgressModal;
