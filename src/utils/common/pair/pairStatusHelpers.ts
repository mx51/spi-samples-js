import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { IPairFormValues } from '../../../redux/reducers/PairFormSlice/interfaces';
import { addTerminal, removeTerminal, updatePairingStatus } from '../../../redux/reducers/TerminalSlice/terminalsSlice';
import { AppDispatch } from '../../../redux/store';
import spiService from '../../../services/spiService';

// pair terminal
async function handlePairClick(dispatch: AppDispatch, pairFormValues: IPairFormValues): Promise<void> {
  const instanceId = pairFormValues.serialNumber;
  const terminalConfigs = {
    acquirerCode: pairFormValues?.acquirerCode,
    autoAddress: pairFormValues?.autoAddress,
    deviceAddress: pairFormValues?.deviceAddress,
    posId: pairFormValues?.posId,
    secureWebSocket: true,
    serialNumber: instanceId,
    testMode: pairFormValues?.testMode,
    pluginVersion: '-',
    merchantId: '-',
    terminalId: '-',
    batteryLevel: '-',
    flow: null,
    id: instanceId,
    pairingFlow: null,
    posVersion: '',
    secrets: null,
    settings: null, // not available during pair terminal stage
    status: SPI_PAIR_STATUS.Unpaired,
    terminalStatus: '',
    txFlow: null,
    txMessage: null, // not available during pair terminal stage
    environment: pairFormValues?.environment,
  };

  dispatch(addTerminal({ id: instanceId, terminalConfigs }));
  // start pairing
  spiService.spiTerminalPair(instanceId);
}

// cancel terminal pairing
function handleCancelPairClick(dispatch: AppDispatch, instanceId: string): void {
  // trigger un-pair from spiService
  spiService.spiTerminalCancelPair(instanceId);
  // update terminal connection status when starting to pair a terminal
  dispatch(updatePairingStatus({ id: instanceId, status: SPI_PAIR_STATUS.Unpaired }));
}

// un-pair terminal
function handleUnPairClick(dispatch: AppDispatch, instanceId: string): void {
  // trigger un-pair from spiService
  spiService.spiTerminalUnPair(instanceId);
  // update terminal connection status when starting to pair a terminal
  dispatch(updatePairingStatus({ id: instanceId, status: SPI_PAIR_STATUS.Unpaired }));
}

// remove terminal
function handleRemoveClick(dispatch: AppDispatch, instanceId: string): void {
  dispatch(removeTerminal({ id: instanceId }));
}

function getTitleFromStatus(status: string, reconnecting: boolean): string {
  if (status === SPI_PAIR_STATUS.PairedConnecting && reconnecting) {
    return 'Reconnecting';
  }
  if (status === SPI_PAIR_STATUS.PairedConnecting) {
    return 'Pairing';
  }
  if (status === SPI_PAIR_STATUS.PairedConnected) {
    return 'Paired';
  }
  return 'Unpaired';
}

export { handleCancelPairClick, handlePairClick, handleUnPairClick, getTitleFromStatus, handleRemoveClick };
