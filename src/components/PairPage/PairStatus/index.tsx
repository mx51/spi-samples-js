import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { useAppSelector } from '../../../redux/hooks';
import { selectPairFormSerialNumber } from '../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import useStyles from './index.styles';
import PairPanelButtons from './PairPanelButtons';
import PairPanelInformation from './PairPanelInformation';

function PairStatus(): React.ReactElement {
  const classes = useStyles();
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const terminal = useAppSelector(terminalInstance(pairFormSerialNumber)) as ITerminalProps;

  const panelInformationList = [
    {
      title: 'Merchant ID',
      content: terminal?.merchantId || '-',
    },
    {
      title: 'Terminal ID',
      content: terminal?.terminalId || '-',
    },
    {
      title: 'Battery',
      content: terminal?.batteryLevel || '-',
    },
  ];

  return (
    <Grid container direction="column" className={classes.flowBox} id="pairStatus">
      <Grid container direction="row" justifyContent="space-between" alignItems="center" className={classes.title}>
        <Typography variant="h6" component="h1">
          Pairing status
        </Typography>
      </Grid>
      <Grid container direction="column" className={classes.statusPanel}>
        <Box display="flex" alignItems="center" className={classes.statusBox}>
          <Typography align="right">
            {PairPanelButtons(terminal?.status || SPI_PAIR_STATUS.Unpaired, null).statusIcon}
          </Typography>
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5" className={classes.statusTitle}>
              {PairPanelButtons(terminal?.status || SPI_PAIR_STATUS.Unpaired, null).statusTitle}
            </Typography>
            <Typography variant="inherit" className={classes.statusText}>
              {
                PairPanelButtons(
                  terminal?.status || SPI_PAIR_STATUS.Unpaired,
                  terminal?.pairingFlow?.message || SPI_PAIR_STATUS.Unpaired
                ).statusText
              }
            </Typography>
          </Box>
        </Box>

        {(terminal?.status === SPI_PAIR_STATUS.PairedConnected ||
          terminal?.status === SPI_PAIR_STATUS.Unpaired ||
          !terminal) &&
          panelInformationList.map(({ title, content }) => (
            <PairPanelInformation key={title} title={title} content={content} />
          ))}
        {terminal?.pairingFlow?.message === 'Confirm that the following Code is showing on the Terminal' && (
          <Box display="flex" flexDirection="column" marginLeft={2}>
            <Typography variant="h5" className={classes.pairingCode}>
              Pairing code: {terminal?.pairingFlow?.confirmationCode}
            </Typography>
            <Typography variant="inherit" className={classes.statusText}>
              Confirm pairing code on terminal
            </Typography>
          </Box>
        )}
      </Grid>
      <Grid container alignItems="center" justifyContent="flex-end" className={classes.statusButtonBox}>
        {PairPanelButtons(terminal?.status || SPI_PAIR_STATUS.Unpaired, null).button}
      </Grid>
    </Grid>
  );
}

export default PairStatus;
