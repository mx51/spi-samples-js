import React from 'react';
import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { useAppSelector } from '../../../redux/hooks';
import { selectedAcquireConfirmPairingFlow } from '../../../redux/reducers/CommonSlice/commonSliceSelectors';
import { selectPairFormSerialNumber } from '../../../redux/reducers/PairFormSlice/PairFormSelectors';
import {
  IPairingFlow,
  IReceiptSchemes,
  ITerminal,
  ITerminalProps,
  ITerminalReceiptFormatProps,
} from '../../../redux/reducers/TerminalSlice/interfaces';
import { terminalInstance, terminalPairingFlow } from '../../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import useStyles from '../index.styles';

export function getReceiptSchemes(schemes: Array<IReceiptSchemes> = []): string {
  return schemes.reduce(
    (currentSchemeString: string, { scheme_name, settle_by_acquirer, total_count, total_value }: IReceiptSchemes) =>
      `${currentSchemeString}Scheme Name: ${scheme_name}, Settle By Acquirer: ${settle_by_acquirer}, Total Count: ${total_count}, Total Value: ${total_value}\n`,
    ''
  );
}

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

# ${pairingFlow?.message}
# Finished? ${pairingFlow?.finished}
# Successful? ${pairingFlow?.successful}
# Confirmation Code: ${pairingFlow?.confirmationCode || '-'}
# Waiting Confirm from Eftpos? ${pairingFlow?.awaitingCheckFromEftpos}
# Waiting Confirm from POS? ${pairingFlow?.awaitingCheckFromPos}
  `;

  const receiptInformation = (txFlowReceipt: ITerminalReceiptFormatProps) =>
    txFlowReceipt?.success
      ? `
### SETTLEMENT SUCCESSFUL!

# RESPONSE: ${txFlowReceipt?.hostResponseText}
# Merchant Receipt:
# Period Start: ${txFlowReceipt?.settlementPeriodStartTime} ${txFlowReceipt?.settlementPeriodStartDate}
# Period End: ${txFlowReceipt?.settlementPeriodEndTime} ${txFlowReceipt?.settlementPeriodEndDate}
# Settlement Time: ${txFlowReceipt?.settlementTriggeredTime} ${txFlowReceipt?.settlementTriggeredDate}
# Transaction Range: ${txFlowReceipt?.transactionRange}
# Terminal ID: ${txFlowReceipt?.terminalId}
# Total TX Count: ${txFlowReceipt?.accumulatedTotalCount}
# Total TX Value: $${txFlowReceipt?.accumulatedTotalValue}
# By Acquirer TX Count: ${txFlowReceipt?.accumulatedSettleByAcquirerCount}
# By Acquirer TX Value: $${txFlowReceipt?.accumulatedSettleByAcquirerValue}

# SCHEME SETTLEMENTS:

${getReceiptSchemes(txFlowReceipt?.schemes)}
    `
      : `
### SETTLEMENT FAILED!

# RESPONSE: ${txFlowReceipt?.hostResponseText}
# Error: ${txFlowReceipt?.errorReason}
# Merchant Receipt: -
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
      {terminal?.receipt && receiptInformation(terminal?.receipt)}
    </pre>
  );
}
