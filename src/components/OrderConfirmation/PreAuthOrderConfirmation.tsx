import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import useStyles from './index.styles';
import { preAuthSelector } from '../../redux/reducers/PreAuth/preAuthSelector';
import { terminalInstance } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import {
  InitiateAccountVerifyTx,
  InitiatePreAuthCancelTx,
  InitiatePreAuthCompleteTx,
  InitiatePreAuthExtendTx,
  InitiatePreAuthOpenTx,
  InitiatePreAuthReduceTx,
  InitiatePreAuthTopupTx,
} from '../../utils/common/purchase/purchaseHelper';
import { SPI_PAIR_STATUS } from '../../definitions/constants/commonConfigs';
import { IProps } from './interfaces';

export const PreAuthOrderConfirmation: React.FC<IProps> = ({
  isDisabled,
  totalAmount,
  setShowTransactionProgressModal,
}) => {
  const classes = useStyles();
  const preAuth = useSelector(preAuthSelector);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;

  const handlePreAuthTxs = (terminal: any, type: string, amount: number) => {
    switch (type) {
      case 'Top Up':
        InitiatePreAuthTopupTx(terminal, amount, preAuth.preAuthRef);
        break;
      case 'Reduce':
        InitiatePreAuthReduceTx(terminal, amount, preAuth.preAuthRef);
        break;
      case 'Extend':
        InitiatePreAuthExtendTx(terminal, preAuth.preAuthRef);
        break;
      case 'Cancel':
        InitiatePreAuthCancelTx(terminal, preAuth.preAuthRef);
        break;
      case 'Complete':
        InitiatePreAuthCompleteTx(terminal, preAuth.amount, preAuth.preAuthRef, preAuth.surcharge);
        break;
      default:
        break;
    }
  };

  function isAccountVerify() {
    return !selectedTerminal || currentTerminal?.status !== SPI_PAIR_STATUS.PairedConnected;
  }

  return (
    <>
      <Box className={classes.tableBox}>
        {preAuth.verified || preAuth.preAuthRef ? (
          <TableContainer component={Paper} className={classes.table} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pre Auth Ref</TableCell>
                  <TableCell>Account Verified</TableCell>
                  <TableCell>Surcharge</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className={classes.unclickable}>
                  <TableCell scope="row">{preAuth.preAuthRef || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={preAuth.verified ? 'Verified' : 'Unverified'}
                      className={preAuth.verified ? classes.chipSuccess : classes.chipFailure}
                    />
                  </TableCell>
                  <TableCell>{`$${preAuth.surcharge / 100}`}</TableCell>
                  <TableCell>{`$${preAuth.amount / 100}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Box>

      <Box display="flex" justifyContent="space-evenly" sx={{ border: 1 }}>
        {preAuth.preAuthRef ? (
          ['Top Up', 'Reduce', 'Extend', 'Cancel', 'Complete'].map((text) => (
            <Button
              variant="contained"
              color="primary"
              size="large"
              key={text}
              disabled={['Extend', 'Cancel', 'Complete'].includes(text) ? isAccountVerify() : isDisabled()}
              focusRipple
              classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
              onClick={() => {
                setShowTransactionProgressModal(true);
                handlePreAuthTxs(selectedTerminal, text, totalAmount);
              }}
            >
              {text}
            </Button>
          ))
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isAccountVerify()}
              focusRipple
              classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
              onClick={() => {
                setShowTransactionProgressModal(true);
                InitiateAccountVerifyTx(selectedTerminal);
              }}
            >
              Verify Account
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isDisabled()}
              focusRipple
              classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
              onClick={() => {
                setShowTransactionProgressModal(true);
                InitiatePreAuthOpenTx(selectedTerminal, totalAmount);
              }}
            >
              Open Pre-Auth
            </Button>
          </>
        )}
      </Box>
    </>
  );
};
