import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import { useTransactionDetailPageStyle } from '../TransactionPage/TransactionDetailsPage/TransactionDetailsPage.style';
import {
  PATH_ACCOUNT_VERIFY,
  PATH_PRE_AUTH,
  PATH_PURCHASE,
  TEXT_PRE_AUTH,
} from '../../definitions/constants/routerConfigs';

type Props = {
  splitTransaction?: {
    currentSplitNumber: number;
    totalSplitNumber: number;
    amount: number;
    outstandingAmount: number;
    onClickNext: () => void;
  };
  typePath?: string;
  classes?: Record<string, string>;
};

const pathNameFormatter = (path: string) => {
  if (path) {
    const pathName = path.split('/')[1];
    return pathName.charAt(0).toUpperCase() + pathName.slice(1);
  }
  return '';
};

const SplitTransactionButton = ({ splitTransaction, classes }: Props) =>
  splitTransaction ? (
    <Button
      variant="contained"
      color="primary"
      size="large"
      classes={{ root: classes?.actionBtn }}
      onClick={splitTransaction.onClickNext}
    >
      {splitTransaction.currentSplitNumber >= splitTransaction.totalSplitNumber - 1
        ? 'Finish'
        : `Next (Split #${splitTransaction.currentSplitNumber + 2})`}
    </Button>
  ) : null;

const OtherTransactionButtons = ({ typePath, classes }: Props) => (
  <>
    {typePath && typePath !== PATH_PURCHASE ? (
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          classes={{ root: classes?.actionBtn }}
          component={LinkRouter}
          to={typePath !== PATH_ACCOUNT_VERIFY ? typePath : PATH_PRE_AUTH}
        >
          {typePath !== PATH_ACCOUNT_VERIFY ? pathNameFormatter(typePath) : TEXT_PRE_AUTH}
        </Button>
      </Grid>
    ) : null}
    <Grid item xs={typePath !== PATH_PURCHASE ? 6 : 12}>
      <Button
        data-test-id="newOrderBtn"
        variant="contained"
        color="primary"
        size="large"
        classes={{ root: classes?.actionBtn }}
        component={LinkRouter}
        to={PATH_PURCHASE}
      >
        New Order
      </Button>
    </Grid>
  </>
);

export const OrderButtons = ({ typePath, splitTransaction }: Props) => {
  const classes = useTransactionDetailPageStyle();

  return (
    <Grid container spacing={1}>
      {splitTransaction ? (
        <SplitTransactionButton splitTransaction={splitTransaction} classes={classes} />
      ) : (
        <OtherTransactionButtons typePath={typePath} classes={classes} />
      )}
    </Grid>
  );
};
