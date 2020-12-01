import { updateTerminalSerialNumber, updatePairingStatus, updatePairingFlow } from './terminalSlice';
import eventBus from '../../pages/Burger/eventBus';
import events from '../../constants/events';

export default function watchTerminalEvents() {
  return (dispatch) => {
    eventBus.addEventListener(events.spiTerminalConfigChanged, (e) => {
      console.log('addEventListener spiTerminalConfigChanged', events.spiTerminalConfigChanged, e);
      const { id: instanceId, payload } = e.detail;
      const event = {
        id: instanceId,
        serialNumber: payload.serial_number,
      };

      console.log('calling updateTerminalSerialNumber', event);

      dispatch(updateTerminalSerialNumber(event));

      // terminalsSlice.actions.updateTerminalSerialNumber(event);
    });

    eventBus.addEventListener(events.spiStatusChanged, (e) => {
      console.log('addEventListener spiStatusChanged', events.spiStatusChanged, e);
      const { id: instanceId, payload } = e.detail;
      const event = {
        id: instanceId,
        status: payload,
      };

      console.log('calling updateTerminalSerialNumber', event);

      dispatch(updatePairingStatus(event));

      // terminalsSlice.actions.updateTerminalSerialNumber(event);
    });
    eventBus.addEventListener(events.spiPairingFlowStateChanged, (e) => {
      console.log('addEventListener spiPairingFlowStateChanged', events.spiPairingFlowStateChanged, e);
      const { id: instanceId, payload } = e.detail;
      const event = {
        id: instanceId,
        payload,
      };

      console.log('calling spiPairingFlowStateChanged', event);

      dispatch(updatePairingFlow(event));

      // ter
    });
  };
}
