import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector } from 'react-redux';
import { Link as LinkRouter } from 'react-router-dom';
import useStyles from './index.styles';
import { TransactionProgressModalProps } from './interfaces';
import { SPI_TRANSACTION_TYPES } from '../../definitions/constants/commonConfigs';
import { PATH_ORDER_FINISHED, TEXT_CASHOUT } from '../../definitions/constants/routerConfigs';
import { ReactComponent as IconWarning } from '../../images/WarningIcon.svg';
import { useAppSelector } from '../../redux/hooks';
import { initialState, updatePreAuthParams } from '../../redux/reducers/PreAuth/preAuthSlice';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import {
  terminalTxFlowAwaitingSignatureTracker,
  terminalTxMessage,
  terminalInstance,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { approveSignature, declineSignature } from '../../utils/common/terminal/terminalHelpers';

function useTransactionProgressModal(transactionType: string) {
  const dispatch = useDispatch();
  const handlePreAuthActions = (currentTerminal: ITerminalProps) => {
    const preAuth = {
      preAuthRef: currentTerminal?.txFlow?.response?.data?.preAuthId ?? initialState.preAuthRef,
      amount: currentTerminal?.txFlow?.response?.data?.preAuthAmount ?? initialState.amount,
      topupAmount: currentTerminal?.txFlow?.response?.data?.topupAmount ?? 0,
      reduceAmount: currentTerminal?.txFlow?.response?.data?.reduceAmount ?? 0,
      surcharge: currentTerminal?.txFlow?.response?.data?.surchargeAmount ?? initialState.surcharge,
      verified: currentTerminal?.txFlow?.success === 'Success' ? true : initialState.verified,
    };

    if (currentTerminal.txFlow?.response.data.transactionType === 'A/C VERIFIED') {
      dispatch(
        updatePreAuthParams({
          key: 'UPDATE_VERIFIED',
          value: preAuth.verified,
        })
      );
    }

    if (currentTerminal.txFlow?.response.data.transactionType === 'PRE-AUTH') {
      dispatch(
        updatePreAuthParams({
          key: 'OPEN_PRE_AUTH',
          value: preAuth,
        })
      );
    }

    if (currentTerminal.txFlow?.response.data.transactionType === 'TOPUP') {
      dispatch(
        updatePreAuthParams({
          key: 'TOPUP_PRE_AUTH',
          value: preAuth.topupAmount,
        })
      );
    }

    if (currentTerminal.txFlow?.response.data.transactionType === 'CANCEL') {
      dispatch(
        updatePreAuthParams({
          key: 'REDUCE_PRE_AUTH',
          value: preAuth.reduceAmount,
        })
      );
    }

    if (currentTerminal.txFlow?.response.data.transactionType === 'PRE-AUTH CANCEL') {
      dispatch(
        updatePreAuthParams({
          key: 'CANCEL_PRE_AUTH',
          value: undefined,
        })
      );
    }

    if (currentTerminal.txFlow?.response.data.transactionType === 'PCOMP') {
      dispatch(
        updatePreAuthParams({
          key: 'COMPLETE_PRE_AUTH',
          value: undefined,
        })
      );
    }
  };

  const modalTitle =
    transactionType === SPI_TRANSACTION_TYPES.CashoutOnly ? TEXT_CASHOUT.toUpperCase() : transactionType.toUpperCase();

  return { handlePreAuthActions, modalTitle };
}

function TransactionProgressModal({
  terminalId,
  transactionType,
  transactionDesc,
  isFinished,
  isSuccess,
  onCancelTransaction,
  onRetryTransaction,
}: TransactionProgressModalProps): React.ReactElement {
  const { handlePreAuthActions, modalTitle } = useTransactionProgressModal(transactionType);
  const classes = useStyles();
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const awaitingSignatureCheck = useAppSelector(terminalTxFlowAwaitingSignatureTracker(terminalId));

  const txMessage = useAppSelector(terminalTxMessage(terminalId));

  const handleApprove = () => {
    approveSignature(terminalId);
  };

  const handleDecline = () => {
    declineSignature(terminalId);
  };

  return (
    <Dialog aria-labelledby="spiModalTitle" open disableRestoreFocus>
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
              <div>
                <Typography variant="body2" className={classes.modalSubHeading}>
                  In progress
                </Typography>
                <Typography variant="body2" className={classes.modalDescription}>
                  {txMessage?.displayMessageText}
                </Typography>
              </div>
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
                {currentTerminal?.txFlow?.response?.data?.hostResponseText.toUpperCase()}
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
                {currentTerminal?.txFlow?.success.toUpperCase()}
              </Typography>
              <Typography className={classes.modalDescription}>{transactionDesc}</Typography>
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
              onClick={() => {
                handlePreAuthActions(currentTerminal);
              }}
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
              <Button
                color="primary"
                variant="outlined"
                onClick={onRetryTransaction}
                className={`${classes.modalBtn} ${classes.btnWithLeftMargin}`}
              >
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
