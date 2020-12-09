import {
  updateTxMessage,
  updateTxFlow,
  updateTerminalSerialNumber,
  updatePairingStatus,
  updatePairingFlow,
  updateTerminalStatus,
} from './terminalSlice';

import eventBus from '../../pages/Burger/eventBus';
import events from '../../constants/events';

export default function watchTerminalEvents() {
  return (dispatch) => {
    eventBus.addEventListener(events.spiTerminalConfigChanged, (e) => {
      const { id: instanceId, payload } = e.detail;
      const event = {
        id: instanceId,
        serialNumber: payload.serial_number,
      };

      dispatch(updateTerminalSerialNumber(event));

      // terminalsSlice.actions.updateTerminalSerialNumber(event);
    });

    eventBus.addEventListener(events.spiStatusChanged, (e) => {
      console.log('addEventListener spiStatusChanged', e);
      const { id: instanceId, payload } = e.detail;
      const event = {
        id: instanceId,
        status: payload,
      };

      dispatch(updatePairingStatus(event));

      // terminalsSlice.actions.updateTerminalSerialNumber(event);
    });

    eventBus.addEventListener(events.spiPairingFlowStateChanged, (e) => {
      const { detail } = e;
      const event = {
        id: detail.id,
        payload: { ...detail.payload },
      };

      dispatch(updatePairingFlow(event));

      // ter
    });

    eventBus.addEventListener(events.spiTerminalStatusChanged, (e) => {
      console.log('addEvent spiTerminalStatusChanged', e);
      const { detail } = e;
      const event = {
        id: detail.id,
        payload: { ...detail.payload },
      };

      dispatch(updateTerminalStatus(event));

      // ter
    });

    eventBus.addEventListener(events.spiTxFlowStateChanged, (e) => {
      console.log('spiTxFlowStateChanged', e);
      const { detail } = e;
      const event = {
        id: detail.id,
        payload: JSON.parse(JSON.stringify(detail.payload)),
      };
      dispatch(updateTxFlow(event));
    });

    eventBus.addEventListener(events.spiTxUpdateMessage, (e) => {
      console.log('spiTxUpdateMessage', e);
      const { detail } = e;
      const event = {
        id: detail.id,
        payload: JSON.parse(JSON.stringify(detail)),
      };
      dispatch(updateTxMessage(event));
    });
  };
}
