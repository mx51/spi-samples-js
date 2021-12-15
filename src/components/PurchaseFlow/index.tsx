import React from 'react';
import { useSelector } from 'react-redux';
import { TxFlowState } from '../../definitions/constants/terminalConfigs';
import selectedTerminalIdSelector from '../../redux/reducers/SelectedTerminalSlice/selectedTerminalSliceSelector';
import { ITerminalProps } from '../../redux/reducers/TerminalSlice/interfaces';
import {
  terminalInstance,
  terminalTxFlowAwaitingSignatureTracker,
} from '../../redux/reducers/TerminalSlice/terminalsSliceSelectors';
import currencyFormat from '../../utils/common/intl/currencyFormatter';

export default function PurchaseFlow(): React.ReactElement {
  const selectedTerminal = useSelector(selectedTerminalIdSelector);
  const currentTerminal = useSelector(terminalInstance(selectedTerminal)) as ITerminalProps;
  const isSuccess = currentTerminal?.txFlow?.success === TxFlowState.Success;
  const awaitingSignatureCheck = useSelector(terminalTxFlowAwaitingSignatureTracker(selectedTerminal));

  const statusInformation = (spi: ITerminalProps) =>
    awaitingSignatureCheck
      ? `
# ----------- STATUS -----------

# WOOHOO - WE GOT PAID!
# POS Reference: ${spi.txFlow?.request.data.posRefId}
# Response: ${spi.txFlow?.response.data.hostResponseText}
# RRN: ${spi.txFlow?.response.data.rrn}
# Scheme: ${spi.txFlow?.response.data.schemeName}

# ----------- Customer Receipt -----------

# PURCHASE: ${currencyFormat((spi?.txFlow?.request.data.purchaseAmount ?? 0) / 100)}
# TIP: ${currencyFormat((spi?.txFlow?.request.data.tipAmount ?? 0) / 100)}
# SURCHARGE: ${currencyFormat((spi?.txFlow?.request.data.surchargeAmount ?? 0) / 100)}
# CASHOUT: ${currencyFormat((spi?.txFlow?.request.data.cashAmount ?? 0) / 100)}

`
      : `
### TX PROCESS UPDATE ###

# ${spi?.txFlow?.displayMessage}
# Request Id: ${spi?.txFlow?.signatureRequiredMessage?.requestId} 
# PosRefId: ${spi?.txFlow?.posRefId}
# Type: ${spi?.txFlow?.type}
# Request Amount: ${currencyFormat((spi?.txFlow?.amountCents ?? 0) / 100)}
# Waiting For Signature: ${spi?.txFlow?.awaitingSignatureCheck}
# Finished: ${spi?.txFlow?.finished}
# Success: ${spi?.txFlow?.success}
`;

  const failedStatusInformation = (spi: ITerminalProps) => `
# ----------- STATUS -----------

# WE DID NOT GET PAID :(
# Error Detail: see 'host_response_text' for details
# Response: ${spi?.txFlow?.response.data.hostResponseText}
# RRN: ${spi?.txFlow?.response.data.rrn}
`;

  return <pre>{isSuccess ? statusInformation(currentTerminal) : failedStatusInformation(currentTerminal)}</pre>;
}
