import {
  Box,
  Button,
  Chip,
  Drawer,
  Paper,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import useStyles from './index.styles';
import {
  selectAllPreAuths,
  selectPreAuthById,
  selectPreAuthKeyPadAmount,
} from '../../redux/reducers/PreAuth/preAuthSelector';
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
import { IPreAuthValues } from '../../redux/reducers/PreAuth/interfaces';
import { RootState } from '../../redux/store';
import KeyPad from '../KeyPad';
import { usePreAuthActions } from '../../hooks/usePreAuthActions';

const PreAuthOrderConfirmationComponent: React.FC<IProps> = ({ setShowTransactionProgressModal, selectedTerminal }) => {
  const classes = useStyles();
  const openPreAuths = useSelector(selectAllPreAuths);
  const [selectedPreAuthId, setSelectedPreAuthId] = useState('');
  const selectedPreAuth = useSelector((state: RootState): IPreAuthValues | undefined =>
    selectPreAuthById(state, selectedPreAuthId)
  );
  const keypadAmount = useSelector(selectPreAuthKeyPadAmount);
  const [displayKeypad, setDisplayKeypad] = useState<boolean>(false);
  const { handleSurchargeUpdate } = usePreAuthActions(selectedTerminal);

  const terminalId = selectedTerminal?.serialNumber;
  const handlePreAuthTxs = (type: string) => {
    if (selectedPreAuth && terminalId) {
      const { preAuthRef, surcharge } = selectedPreAuth;
      switch (type) {
        case 'Top Up':
          InitiatePreAuthTopupTx(terminalId, keypadAmount, preAuthRef);
          break;
        case 'Reduce':
          InitiatePreAuthReduceTx(terminalId, keypadAmount, preAuthRef);
          break;
        case 'Extend':
          InitiatePreAuthExtendTx(terminalId, preAuthRef);
          break;
        case 'Cancel':
          InitiatePreAuthCancelTx(terminalId, preAuthRef);
          break;
        case 'Complete':
          InitiatePreAuthCompleteTx(terminalId, keypadAmount, preAuthRef, surcharge);
          break;
        default:
          break;
      }
    }
  };

  const isDisabled = useMemo(
    () => !selectedTerminal || selectedTerminal.status !== SPI_PAIR_STATUS.PairedConnected,
    [selectedTerminal]
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={displayKeypad}
        classes={{
          paper: classes.keypadDrawerPaper,
        }}
      >
        <KeyPad
          open={displayKeypad}
          title="Surcharge"
          subtitle="Enter Surcharge amount"
          defaultAmount={0}
          onClose={() => {
            setDisplayKeypad(false);
          }}
          onAmountChange={(surchargeAmount) => {
            setDisplayKeypad(false);
            handleSurchargeUpdate(surchargeAmount, selectedPreAuthId);
          }}
        />
      </Drawer>
      <Box className={classes.tableBox}>
        {openPreAuths.length ? (
          <TableContainer component={Paper} className={classes.table} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> </TableCell>
                  <TableCell>Pre Auth Ref</TableCell>
                  <TableCell>Account Verified</TableCell>
                  <TableCell>Surcharge</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openPreAuths.map((preAuth: IPreAuthValues) => (
                  <TableRow key={preAuth.preAuthRef} onClick={() => setSelectedPreAuthId(preAuth.preAuthRef)}>
                    <TableCell key={preAuth.preAuthRef} scope="row">
                      <Radio
                        className={classes.radioBtn}
                        checked={preAuth.preAuthRef === selectedPreAuthId}
                        value={preAuth.preAuthRef}
                        name="selectedPreAuth"
                      />
                    </TableCell>
                    <TableCell>{preAuth.preAuthRef}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={preAuth.verified ? 'Verified' : 'Unverified'}
                        className={preAuth.verified ? classes.chipSuccess : classes.chipFailure}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        disableElevation
                        disabled={!(selectedPreAuthId === preAuth.preAuthRef)}
                        classes={{ root: classes.additionalChargeBtn, label: classes.additionalChargeBtnLabel }}
                        onClick={() => setDisplayKeypad(true)}
                      >
                        {`$${preAuth.surcharge / 100}`}
                      </Button>
                    </TableCell>
                    <TableCell>{`$${preAuth.preAuthAmount / 100}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="space-evenly" sx={{ border: 1 }}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={isDisabled}
            focusRipple
            classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
            onClick={() => {
              setShowTransactionProgressModal(true);
              InitiateAccountVerifyTx(selectedTerminal?.serialNumber ?? '');
            }}
          >
            Verify
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={keypadAmount <= 0 || isDisabled}
            focusRipple
            classes={{ root: classes.paymentTypeBtn, label: classes.paymentTypeBtnLabel }}
            onClick={() => {
              setShowTransactionProgressModal(true);
              InitiatePreAuthOpenTx(selectedTerminal?.serialNumber ?? '', keypadAmount);
            }}
          >
            Open
          </Button>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          {['Extend', 'Cancel', 'Top Up', 'Reduce', 'Complete'].map((type) => (
            <>
              <Button
                variant="contained"
                color="primary"
                size="large"
                key={type}
                disabled={
                  ['Extend', 'Cancel'].includes(type)
                    ? !selectedPreAuthId || isDisabled
                    : !selectedPreAuthId || keypadAmount <= 0 || isDisabled
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
            </>
          ))}
        </Box>
      </Box>
    </>
  );
};

export const PreAuthOrderConfirmation = React.memo(PreAuthOrderConfirmationComponent);
