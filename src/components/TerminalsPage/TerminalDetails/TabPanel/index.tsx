import React from 'react';
import { Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import FlowPanel from '../../../FlowPanel';
import { TabPanelProps } from '../interfaces';
import ReceiptPanel from '../ReceiptPanel';
import useStyles from './index.styles';

export default function TabPanel({
  children,
  flow,
  index,
  setFlow,
  subtitle,
  title,
  value,
  receiptToggle,
  terminal,
}: TabPanelProps): React.ReactElement {
  const classes = useStyles({ flow, receiptToggle });

  return (
    <>
      {value === index && (
        <div className={classes.root}>
          <div className={flow ? `${classes.panel} ${classes.panelShift}` : classes.panel}>
            <Container maxWidth="lg">
              <Grid className={classes.detailsPanelContainer}>
                <div
                  className={
                    receiptToggle ? `${classes.detailsPanel} ${classes.detailsPanelShift}` : classes.detailsPanel
                  }
                >
                  <Grid container>
                    <Grid item className={classes.tabPanelContainer}>
                      <Grid container direction="row" justifyContent="space-between" spacing={1}>
                        <Grid item>
                          <Typography variant="h6" component="h1">
                            {title}
                          </Typography>
                          <Typography className={classes.text}>{subtitle}</Typography>
                        </Grid>
                        <Grid id="terminalFlow" item onClick={setFlow}>
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            {!flow && <KeyboardArrowLeftIcon className={classes.flowIcon} />}
                            <Button color="primary" type="button" className={classes.flowButton}>
                              {flow ? 'Hide' : 'Show'} flow
                            </Button>
                            {flow && <KeyboardArrowRightIcon className={classes.flowIcon} />}
                          </Box>
                        </Grid>
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
          <FlowPanel flow={flow} terminal={terminal} />
        </div>
      )}
    </>
  );
}
