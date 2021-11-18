import React from 'react';
import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { TxFlowState } from '../../../../definitions/constants/terminalConfigs';
import { useAppSelector } from '../../../../redux/hooks';
import { selectedShowFlowPanel } from '../../../../redux/reducers/CommonSlice/commonSliceSelectors';
import {
  terminalTxFlowFinishedTracker,
  terminalTxFlowReceipt,
  terminalTxFlowReceiptContent,
  terminalTxFlowSuccessTracker,
} from '../../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import FlowPanel from '../../../FlowPanel';
import PairFlow from '../../../FlowPanel/PairFlow';
import ReceiptPanel from '../../../ReceiptPanel';
import { TabPanelProps } from '../interfaces';
import useStyles from './index.styles';

export default function TabPanel({
  children,
  index,
  subtitle,
  title,
  value,
  receiptToggle,
  terminal,
}: TabPanelProps): React.ReactElement {
  const showFlowPanel = useAppSelector(selectedShowFlowPanel);
  const classes = useStyles({ showFlowPanel });

  const txFlowReceiptContent = useAppSelector(terminalTxFlowReceiptContent(terminal?.id as string));
  const txFlowReceipt = useAppSelector(terminalTxFlowReceipt(terminal?.id as string));
  const txFlowFinishedState = useAppSelector(terminalTxFlowFinishedTracker(terminal?.id as string));
  const txFlowSuccessState = useAppSelector(terminalTxFlowSuccessTracker(terminal?.id as string));

  const ReceiptContentDOM = () => (
    <>
      {!txFlowFinishedState && txFlowSuccessState === TxFlowState.Unknown && (
        <pre className={classes.preContent}>Settle Initiated. Will be updated with Progress.</pre>
      )}
      {(txFlowSuccessState === TxFlowState.Failed || txFlowReceipt?.errorReason) && txFlowFinishedState && (
        <pre className={classes.preContent}>
          Could not initiate settle: <strong>{txFlowReceipt?.errorReason}</strong>. Please Retry.
        </pre>
      )}
      {txFlowFinishedState && txFlowSuccessState === TxFlowState.Success && txFlowReceiptContent && (
        <pre className={classes.preContent}>{txFlowReceiptContent}</pre>
      )}
    </>
  );

  return (
    <>
      {value === index && (
        <div className={classes.root}>
          <div className={showFlowPanel ? `${classes.panel} ${classes.panelShift}` : classes.panel}>
            <Container maxWidth="lg">
              <Grid className={classes.detailsPanelContainer}>
                <div
                  className={
                    receiptToggle?.settlement || receiptToggle?.settlementEnquiry
                      ? `${classes.detailsPanel} ${classes.detailsPanelShift}`
                      : classes.detailsPanel
                  }
                >
                  <Grid container>
                    <Grid item className={classes.tabPanelContainer}>
                      <Grid container direction="column" justifyContent="space-between" spacing={1}>
                        <Typography variant="h6" component="h1">
                          {title}
                        </Typography>
                        <Typography className={classes.text}>{subtitle}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid>{children}</Grid>
                </div>
                <Grid
                  className={
                    receiptToggle?.settlement || receiptToggle?.settlementEnquiry
                      ? classes.receiptPanelOpened
                      : classes.receiptPanel
                  }
                >
                  {receiptToggle?.settlement && (
                    <ReceiptPanel title="Settlement Receipt" css={classes.receiptBoxWrapper}>
                      <ReceiptContentDOM />
                    </ReceiptPanel>
                  )}
                  {receiptToggle?.settlementEnquiry && (
                    <ReceiptPanel title="Settlement Enquiry Receipt" css={classes.receiptBoxWrapper}>
                      <ReceiptContentDOM />
                    </ReceiptPanel>
                  )}
                </Grid>
              </Grid>
            </Container>
          </div>
          <FlowPanel>
            <PairFlow terminal={terminal} />
          </FlowPanel>
        </div>
      )}
    </>
  );
}
