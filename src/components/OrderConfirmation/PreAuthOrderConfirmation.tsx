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

const PreAuthOrderConfirmationComponent: React.FC<IProps> = ({ setShowTransactionProgressModal }) => {
  const classes = useStyles();
  const { preAuthRef, preAuthAmount, currentAmount, surcharge, verified } = useSelector(preAuthSelector);
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;

  const handlePreAuthTxs = (type: string) => {
    switch (type) {
      case 'Top Up':
        InitiatePreAuthTopupTx(selectedTerminal, currentAmount, preAuthRef);
        break;
      case 'Reduce':
        InitiatePreAuthReduceTx(selectedTerminal, currentAmount, preAuthRef);
        break;
      case 'Extend':
        InitiatePreAuthExtendTx(selectedTerminal, preAuthRef);
        break;
      case 'Cancel':
        InitiatePreAuthCancelTx(selectedTerminal, preAuthRef);
        break;
      case 'Complete':
        InitiatePreAuthCompleteTx(selectedTerminal, preAuthAmount, preAuthRef, surcharge);
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
        {verified || preAuthRef ? (
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
                  <TableCell scope="row">{preAuthRef || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={verified ? 'Verified' : 'Unverified'}
                      className={verified ? classes.chipSuccess : classes.chipFailure}
                    />
                  </TableCell>
                  <TableCell>{`$${surcharge / 100}`}</TableCell>
                  <TableCell>{`$${preAuthAmount / 100}`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Box>

      <Box display="flex" justifyContent="space-evenly" sx={{ border: 1 }}>
        {preAuthRef ? (
          ['Top Up', 'Reduce', 'Extend', 'Cancel', 'Complete'].map((type) => (
            <Button
              variant="contained"
              color="primary"
              size="large"
              key={type}
              disabled={
                ['Extend', 'Cancel', 'Complete'].includes(type)
                  ? isAccountVerify()
                  : currentAmount <= 0 || !selectedTerminal
              }
              focusRipple
              classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
              onClick={() => {
                setShowTransactionProgressModal(true);
                handlePreAuthTxs(type);
              }}
            >
              {type}
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
              disabled={currentAmount <= 0 || !selectedTerminal}
              focusRipple
              classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
              onClick={() => {
                setShowTransactionProgressModal(true);
                InitiatePreAuthOpenTx(selectedTerminal, currentAmount);
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

export const PreAuthOrderConfirmation = React.memo(PreAuthOrderConfirmationComponent);
