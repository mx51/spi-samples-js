import { SPI_PAIR_STATUS } from '../../../definitions/constants/commonConfigs';
import { IPairFormValues } from '../../../redux/reducers/PairFormSlice/interfaces';
import { addTerminal, updatePairingStatus } from '../../../redux/reducers/TerminalSlice/terminalsSlice';
import { AppDispatch } from '../../../redux/store';
import spiService from '../../../services/spiService';

// pair terminal
async function handlePairClick(dispatch: AppDispatch, pairFormValues: IPairFormValues): Promise<void> {
  const instanceId = pairFormValues.serialNumber;
  dispatch(addTerminal({ id: instanceId, pairFormValues }));
  // start pairing
  spiService.spiTerminalPair(instanceId, pairFormValues);
  // update terminal connection status when starting to pair a terminal
  dispatch(updatePairingStatus({ id: instanceId, status: SPI_PAIR_STATUS.PairedConnecting }));
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

export { handleCancelPairClick, handlePairClick, handleUnPairClick };
