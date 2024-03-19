import React, { useMemo } from 'react';
import { Box, Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import CustomContentPanel from '../../CustomContentPanel';
import { useStyles } from './SplitReceiptPanel.styles';
import { ReactComponent as FailedIcon } from '../../../images/FailedIcon.svg';
import { ReactComponent as SuccessIcon } from '../../../images/SuccessIcon.svg';
import currencyFormat from '../../../utils/common/intl/currencyFormatter';
import OrderSubTotal from '../../OrderSubTotal';
import OrderLineItem from '../../OrderLineItem';
import { SplitMode } from '../interfaces';

export type SplitReceiptPanelProps = {
  currentTerminal: ITerminalProps;
  isTxFinished: boolean;
  isTxSuccess: boolean;
  splitMode: SplitMode;
  splitIndex: number;
  numberOfSplits: number;
  splitAmount: number;
  outstandingAmount: number;
  onClickNext: () => void;
};

export const SplitReceiptPanel: React.FC<SplitReceiptPanelProps> = ({
  currentTerminal,
  isTxFinished,
  isTxSuccess,
  splitMode,
  splitIndex,
  numberOfSplits,
  splitAmount,
  outstandingAmount,
  onClickNext,
}) => {
  const classes = useStyles();

  const { terminalId, deviceAddress, serialNumber, txFlow } = currentTerminal;

  const transactionStatus = useMemo(() => {
    const status = isTxSuccess ? 'approved' : 'declined';
    return `Purchase ${status}`;
  }, [isTxSuccess]);

  const amountSummaryInformation = (type: string) => {
    const responseData = txFlow?.override ? txFlow?.request.data : txFlow?.response.data;
    if (responseData) return (responseData as Any)[type] ?? 0;
    return 0;
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={8}>
        <Box className={classes.summary}>
          {isTxFinished && isTxSuccess && <SuccessIcon className={classes.successIcon} />}
          {isTxFinished && !isTxSuccess && <FailedIcon className={classes.failedIcon} />}
          <Typography variant="h5" component="h1">
            {transactionStatus}
          </Typography>

          <Typography className={classes.heading}>Terminal: {terminalId}</Typography>

          <Typography className={classes.subheading}>
            {deviceAddress} | S/N {serialNumber}
          </Typography>
          <Box className={classes.paper} component={Paper}>
            <span className={classes.splitIndexRow}>
              Split {splitIndex + 1} {splitMode === 'splitEvenly' && `of ${numberOfSplits}`}
            </span>
            {currencyFormat(splitAmount / 100)}
            <Box className={classes.outstandingAmountRow}>
              <span>Outstanding amount</span>
              <span>{currencyFormat(outstandingAmount / 100)}</span>
            </Box>
          </Box>
          <Typography className={classes.orderSummery}>Order Summary</Typography>
          <Divider variant="middle" />
          <OrderSubTotal label="Subtotal" amount={amountSummaryInformation('purchaseAmount')} />
          <OrderLineItem disabled label="Surcharge" amount={amountSummaryInformation('surchargeAmount')} viewOnly />
          <OrderLineItem disabled label="Cashout" amount={amountSummaryInformation('bankCashAmount')} viewOnly />
          <OrderLineItem disabled label="Tip" amount={amountSummaryInformation('tipAmount')} viewOnly />
          <Button
            variant="contained"
            color="primary"
            size="large"
            classes={{ root: classes.actionBtn }}
            onClick={onClickNext}
          >
            {outstandingAmount <= 0 ? 'Finish' : `Next (Split #${splitIndex + 2})`}
          </Button>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <CustomContentPanel title="Receipt" css={classes.receiptBoxWrapper}>
          <pre>{currentTerminal?.txFlow?.response?.data.merchantReceipt}</pre>
        </CustomContentPanel>
      </Grid>
    </Grid>
  );
};
