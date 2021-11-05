import React from 'react';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { useAppSelector } from '../../../redux/hooks';
import { selectedAcquireConfirmPairingFlow } from '../../../redux/reducers/CommonSlice/commonSliceSelectors';
import { selectPairFormSerialNumber } from '../../../redux/reducers/PairFormSlice/PairFormSelectors';
import { IPairingFlow, ITerminal, ITerminalProps } from '../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance, terminalPairingFlow } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import useStyles from '../index.styles';

export default function PairFlow({ terminal }: ITerminal): React.ReactElement {
  const classes = useStyles();
  useAppSelector(selectedAcquireConfirmPairingFlow);
  const pairFormSerialNumber = useAppSelector(selectPairFormSerialNumber);
  const currentTerminal = useAppSelector(terminalInstance(pairFormSerialNumber));
  const currentTerminalPairingFlow = useAppSelector(terminalPairingFlow(pairFormSerialNumber));

  const statusInformation = (spi: ITerminalProps) => `
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
    <pre className={classes.flowContent}>
      {/* For unpaired terminal (Eg: Terminal Pair page) */}
      {pairFormSerialNumber &&
        currentTerminalPairingFlow &&
        currentTerminal.status !== SPI_PAIR_STATUS.PairedConnected &&
        pairFlowInformation(currentTerminalPairingFlow)}
      {pairFormSerialNumber &&
        currentTerminal &&
        currentTerminal.status === SPI_PAIR_STATUS.PairedConnected &&
        statusInformation(currentTerminal)}
      {/* For already paired terminal (Eg: Terminal Details page) */}
      {!pairFormSerialNumber && terminal && statusInformation(terminal)}
    </pre>
  );
}
