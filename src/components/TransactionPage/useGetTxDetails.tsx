import React from 'react';
import { ReactComponent as FailedIcon } from '../../images/FailedIcon.svg';
import { ReactComponent as SuccessIcon } from '../../images/SuccessIcon.svg';
import { ReactComponent as WarningIcon } from '../../images/WarningIcon.svg';
import { useTransactionPageStyle } from './TransactionPage.style';

type GetTxDetails = {
  getIconByStatus: (status: string) => React.ReactElement;
  getStatus: (status: string) => string;
};

export const useGetTxDetails = (): GetTxDetails => {
  const classes = useTransactionPageStyle();

  const getIconByStatus = (status: string) => {
    const iconByStatusMap = {
      Success: <SuccessIcon className={classes.successIcon} data-testid="success-icon" />,
      Failed: <FailedIcon className={classes.failedIcon} data-testid="fail-icon" />,
      Unknown: <WarningIcon className={classes.failedIcon} data-testid="warning-icon" />,
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

  return { getIconByStatus, getStatus };
};
