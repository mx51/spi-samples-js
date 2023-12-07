import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { ReactComponent as FailedIcon } from '../images/FailedIcon.svg';
import { ReactComponent as SuccessIcon } from '../images/SuccessIcon.svg';
import { ReactComponent as WarningIcon } from '../images/WarningIcon.svg';

export const useIconStyles = makeStyles((theme: Theme) =>
  createStyles({
    successIcon: {
      color: theme.palette.success.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '24px',
      height: '24px',
    },
    failedIcon: {
      color: theme.palette.error.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '24px',
      height: '24px',
    },
    unknownIcon: {
      color: theme.palette.warning.main,
      margin: theme.spacing(1),
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '24px',
      height: '24px',
    },
  })
);

type GetTxDetails = {
  getTransactionType: (txType: string, preAuthTxType: string) => string;
  getIconByStatus: (status: string) => React.ReactElement;
  getStatus: (status: string) => string;
};

export const useGetTxDetails = (): GetTxDetails => {
  const classes = useIconStyles();

  const getTransactionType = (txType: string, preAuthTxType: string) => {
    const preAuthTypeMap = {
      PCOMP: 'Preauth Complete',
      'PRE-AUTH EXT': 'Preauth Extend',
      'PRE-AUTH CANCEL': 'Preauth Cancel',
      TOPUP: 'Preauth Topup',
      'A/C VERIFIED': 'Account Verified',
      CANCEL: 'Preauth Reduce',
      'PRE-AUTH': 'Preauth Open',
    } as { [key: string]: string };

    const txTypeMap = {
      Purchase: 'Purchase',
      Refund: 'Refund',
      CashoutOnly: 'Cashout',
      MOTO: 'MOTO',
      Preauth: 'Preauth',
      AccountVerify: 'Account Verify',
    } as { [key: string]: string };

    const preAuthtype = preAuthTxType ? preAuthTypeMap[preAuthTxType] : 'PREAUTH';
    const transactionType = txType === 'Preauth' ? preAuthtype : txTypeMap[txType];
    return transactionType;
  };

  const getIconByStatus = (status: string) => {
    const iconByStatusMap = {
      Success: <SuccessIcon className={classes.successIcon} />,
      Failed: <FailedIcon className={classes.failedIcon} />,
      Unknown: <WarningIcon className={classes.failedIcon} />,
    } as { [key: string]: React.ReactElement };

    return iconByStatusMap[status];
  };

  const getStatus = (status: string) => {
    const successStateMap = {
      Success: 'Approved',
      Failed: 'Declined',
      Unknown: 'Unknown',
    } as { [key: string]: string };

    return successStateMap[status];
  };

  return { getTransactionType, getIconByStatus, getStatus };
};
