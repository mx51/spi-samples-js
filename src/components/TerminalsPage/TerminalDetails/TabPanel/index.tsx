import React from 'react';
import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../../../../redux/hooks';
import selectedShowFlowPanel from '../../../../redux/reducers/CommonSlice/commonSliceSelectors';
import FlowPanel from '../../../FlowPanel';
import { TabPanelProps } from '../interfaces';
import ReceiptPanel from '../ReceiptPanel';
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

  return (
    <>
      {value === index && (
        <div className={classes.root}>
          <div className={showFlowPanel ? `${classes.panel} ${classes.panelShift}` : classes.panel}>
            <Container maxWidth="lg">
              <Grid className={classes.detailsPanelContainer}>
                <div
                  className={
                    receiptToggle ? `${classes.detailsPanel} ${classes.detailsPanelShift}` : classes.detailsPanel
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
                <Grid className={receiptToggle ? classes.receiptPanelOpened : classes.receiptPanel}>
                  {receiptToggle && <ReceiptPanel />}
                </Grid>
              </Grid>
            </Container>
          </div>
          <FlowPanel terminal={terminal} />
        </div>
      )}
    </>
  );
}
