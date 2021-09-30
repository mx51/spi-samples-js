import React from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../../redux/hooks';
import { selectPairFormSerialNumber } from '../../redux/reducers/PairFormSlice/PairFormSelectors';
import { IPairingFlow, ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance } from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import useStyles from './index.styles';
import { IFlowPanelState } from './interfaces';

export default function FlowPanel({ flow, terminal }: IFlowPanelState): React.ReactElement {
  const classes = useStyles();
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const currentTerminal = useAppSelector(terminalInstance(pairFormSerialNumber)) as ITerminalProps;

  const statusInformation = (spi: Any) => `
# ----------- STATUS -----------

# POSID: ${spi?.posId}
# EFTPOS: ${spi?.deviceAddress}
# SPI STATUS: ${spi?.status}
# FLOW: ${spi?.flow}

# ------------------------------
# POS: ${spi?.posVersion ? `v${spi?.posVersion}` : '-'} Spi: ${`${spi?.pluginVersion}`}
  `;

  const pairFlowInformation = (pairingFlow: IPairingFlow) => `
### PAIRING PROCESS UPDATE ###

# ${pairingFlow.Message}
# Finished? ${pairingFlow.Finished}
# Successful? ${pairingFlow.Successful}
# Confirmation Code: ${pairingFlow.ConfirmationCode}
# Waiting Confirm from Eftpos? ${pairingFlow.AwaitingCheckFromEftpos}
# Waiting Confirm from POS? ${pairingFlow.AwaitingCheckFromPos}
  `;

  return (
    <Drawer
      anchor="right"
      classes={{
        paper: classes.drawerPaper,
      }}
      className={classes.drawer}
      data-test-id="flowPanel"
      open={flow}
      variant="persistent"
    >
      <Box className={classes.flowBoxWrapper}>
        <Box className={classes.flowBox}>
          <Typography variant="h6" component="h1">
            Flow
          </Typography>
          <pre className={classes.flowContent}>
            {currentTerminal?.pairingFlow && pairFlowInformation(currentTerminal?.pairingFlow)}
            {pairFormSerialNumber && currentTerminal && statusInformation(currentTerminal)}
            {/* Above one is for unpaired terminal (Eg: Terminal Pair page) */}
            {!pairFormSerialNumber && terminal && statusInformation(terminal)}
            {/* Above one is for already paired terminal (Eg: Terminal Details page) */}
          </pre>
        </Box>
      </Box>
    </Drawer>
  );
}
