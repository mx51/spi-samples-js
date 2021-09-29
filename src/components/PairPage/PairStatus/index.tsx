import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { useAppSelector } from '../../../redux/hooks';
import { selectPairFormSerialNumber } from '../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import useStyles from './index.styles';
import { PairStatusInterface } from './interfaces';
import PairPanelButtons from './PairPanelButtons';
import PairPanelInformation from './PairPanelInformation';

function PairStatus({ open, handleDrawerToggle }: PairStatusInterface): React.ReactElement {
  const classes = useStyles();
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const terminal = useAppSelector(terminalInstance(pairFormSerialNumber)) as ITerminalProps;

  const panelInformationList = [
    {
      title: 'Merchant ID',
      content: terminal?.merchantId,
    },
    {
      title: 'Terminal ID',
      content: terminal?.terminalId,
    },
    {
      title: 'Battery',
      content: terminal?.batteryLevel,
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
            data-test-id="flowToggler"
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
          <Typography align="right">
            {PairPanelButtons(terminal?.status || SPI_PAIR_STATUS.Unpaired).statusIcon}
          </Typography>
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5">
              {PairPanelButtons(terminal?.status || SPI_PAIR_STATUS.Unpaired).statusTitle}
            </Typography>
            <Typography variant="inherit">
              {PairPanelButtons(terminal?.status || SPI_PAIR_STATUS.Unpaired).statusText}
            </Typography>
          </Box>
        </Box>

        {panelInformationList.map(({ title, content }) =>
          title === 'Battery' && terminal?.batteryLevel === '-' ? null : (
            <PairPanelInformation key={title} title={title} content={content} />
          )
        )}
      </Grid>
      <Grid container alignItems="center" justifyContent="flex-end" className={classes.statusButtonBox}>
        {PairPanelButtons(terminal?.status || SPI_PAIR_STATUS.Unpaired).button}
      </Grid>
    </Grid>
  );
}

export default PairStatus;
