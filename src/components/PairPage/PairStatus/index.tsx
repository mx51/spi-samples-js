import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { useAppSelector } from '../../../redux/hooks';
import useStyles from './index.styles';
import { PairStatusInterface, PairStatusStatesInterface } from './interfaces';
import PairPanelButtons from './PairPanelButtons';
import PairPanelInformation from './PairPanelInformation';

function PairStatus({ open, handleDrawerToggle }: PairStatusInterface): React.ReactElement {
  const classes = useStyles();
  const pair = useAppSelector((state) => state.pair);

  const [pairPanel] = useState<PairStatusStatesInterface>({
    // @TODO will setup 'setPairPanel' later when doing api integrations
    merchantId: '-',
    terminalId: '-',
    battery: '-',
  });

  const panelInformationList = [
    {
      title: 'Merchant ID',
      content: pairPanel.merchantId,
    },
    {
      title: 'Terminal ID',
      content: pairPanel.terminalId,
    },
    {
      title: 'Battery',
      content: pairPanel.battery,
    },
  ];

  return (
    <Grid container direction="column" className={classes.flowBox} id="pairStatus">
      <Grid container direction="row" justifyContent="space-between" alignItems="center" className={classes.title}>
        <Grid item xs={4}>
          <Typography variant="h6" component="h1">
            Status
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            onClick={handleDrawerToggle}
            className={classes.flowToggle}
          >
            {!open && <KeyboardArrowLeftIcon className={classes.flowIcon} />}
            <Button color="primary" type="button" className={classes.flowButton}>
              {open ? 'Hide' : 'Show'} flow
            </Button>
            {open && <KeyboardArrowRightIcon className={classes.flowIcon} />}
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="column" className={classes.statusPanel}>
        <Box display="flex" alignItems="center" className={classes.statusBox}>
          <Typography align="right">{PairPanelButtons(pair.status).statusIcon}</Typography>
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5">{PairPanelButtons(pair.status).statusTitle}</Typography>
            <Typography variant="inherit">{PairPanelButtons(pair.status).statusText}</Typography>
          </Box>
        </Box>
        {panelInformationList.map(({ title, content }) => (
          <PairPanelInformation key={title} title={title} content={content} />
        ))}
      </Grid>
      <Grid container alignItems="center" justifyContent="flex-end" className={classes.statusButtonBox}>
        {PairPanelButtons(pair.status).button}
      </Grid>
    </Grid>
  );
}

export default PairStatus;
