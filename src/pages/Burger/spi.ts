import {
  BillStatusResponse,
  Secrets as SPISecrets,
  Spi as SPIClient,
  SpiFlow,
  SpiStatus,
  SuccessState,
  TransactionFlowState,
  TransactionOptions,
  TransactionType,
} from '@mx51/spi-client-js';
import { v4 as uuid } from 'uuid';
import events from '../../constants/events';
import eventBus from './eventBus';
import EventTarget from '../../utils/eventTarget';

class SPI {
  libraryInstances: any;
  globalConfig: any;
  posIdInstanceMap: any;

  constructor() {
    this.globalConfig = {};
    this.libraryInstances = {};
    this.posIdInstanceMap = {};
  }

  spiAddTerminal(config: any) {
    const instance = this.createLibraryInstance(config);
    const terminalConfig = { ...config };
    this.log.info({ message: 'created new instance', id: instance.id });
    console.log('spiceAddTerminal', config);

    const { CurrentFlow, CurrentPairingFlowState, CurrentStatus, CurrentTxFlowState } = instance.spi;
    return SPI.createEventPayload(instance.id, {
      status: CurrentStatus,
      flow: CurrentFlow,
      pairingFlow: CurrentPairingFlowState,
      txFlow: CurrentTxFlowState,
      terminalConfig,
    });
  }

  spiUnpairTerminal(id: any) {
    this.getInstance(id).spi.Unpair();

    return SPI.createEventPayload(id, {
      ...this.getCurrentPairingFlow(id),
    });
  }

  spiRemoveTerminal(id: string) {
    const { _posId: posId, _transactionMonitoringThread: transactionMonitoringThread } = this.getInstance(id).spi;
    // There is a setTimeout that need to be stopped so the library can be garbage collected
    clearInterval(transactionMonitoringThread);

    delete this.posIdInstanceMap[posId];
    delete this.libraryInstances[id];
    this.log.info({ message: 'instance removed', id });
    console.log('spiRemoveTerminal', SPI.createEventPayload(id, {}));

    return SPI.createEventPayload(id, {});
  }

  spiPairTerminal(id: string, config: any) {
    const { spi } = this.getInstance(id);

    spi.SetPosId(config.posId);
    // Auto-address needs to be disabled to change an eftpos address
    spi.SetAutoAddressResolution(false);
    spi.SetEftposAddress(config.eftpos);
    // spi.SetAutoAddressResolution(config.auto);

    if (spi.HasSerialNumberChanged(config.serialNumber)) {
      spi.SetSerialNumber(config.serialNumber);
    }

    spi.Pair();
    const terminalConfig = { ...config };

    SPI.broadcastEvent(id, {
      type: 'StatusChanged',
      detail: SpiStatus.PairedConnecting,
    });

    return SPI.createEventPayload(id, {
      terminalConfig,
    });
  }

  getInstance(instanceId: string) {
    return this.libraryInstances[instanceId];
  }

  createLibraryInstance(config: any, instanceId = uuid()): EventTarget {
    const name = 'mx51';
    const version = '2.8.0';
    console.log('createLibraryInstance', config);

    const terminalConfig = {
      PosId: '',
      SerialNumber: '',
      EftposAddress: '',
      Secrets: null,
      TestMode: true,
      AutoAddressResolution: '',
    };

    const instance = new EventTarget();
    instance.id = instanceId;
    this.libraryInstances[instance.id] = instance;
    instance.spi = new SPIClient(
      terminalConfig.PosId,
      terminalConfig.SerialNumber,
      terminalConfig.EftposAddress,
      terminalConfig.Secrets
    );
    instance.spi.SetEventBus(instance);

    instance.spi.SetPosInfo(name, version);
    instance.spi.SetAcquirerCode('wbc');
    instance.spi.SetDeviceApiKey('RamenPosDeviceIpApiKey');
    instance.spi.SetSecureWebSockets(false); // prefer IP over FQDN
    instance.spi._inTestMode = terminalConfig.TestMode;
    instance.spi.SetAutoAddressResolution(terminalConfig.AutoAddressResolution);
    instance.spi.PrintingResponse = () => true;

    instance.addEventListener(events.spiPairingFlowStateChanged, (e: any) => {
      const { detail } = e;

      console.log('addEventListener callback', events.spiPairingFlowStateChanged, e, JSON.stringify(e));

      if (detail?.ConfirmationCode && !detail.AwaitingCheckFromEftpos && detail.AwaitingCheckFromPos) {
        instance.spi.PairingConfirmCode();
      }

      // this.getTerminalStatus(instanceId);
      // this.getTerminalConfig(instanceId);

      SPI.broadcastEvent(instanceId, e);
      console.log({ instanceId, e });
    });

    instance.addEventListener(events.spiSecretsChanged, (detail: any) => {
      console.log({ detail });

      this.log.info({ message: 'keys rolled', id: instanceId, detail });
      // this.setConfig({ Secrets: updatedSecrets }, instanceId, true);
    });

    instance.addEventListener(events.spiStatusChanged, (e: any) => {
      console.log('event called', e);

      // this.getTerminalStatus(instanceId);
      // this.getTerminalConfig(instanceId);
      if (e.detail && e.detail === 'PairedConnected') {
        instance.spi.AckFlowEndedAndBackToIdle();
      }

      SPI.broadcastEvent(instanceId, e);
      console.log('addEventListener', events.spiStatusChanged, e);

      const { detail: CurrentStatus } = e;
      // return CurrentStatus === SpiStatus.PairedConnected && this.retriveConfig(instanceId);
    });

    instance.addEventListener(events.spiTerminalConfigChanged, (e: any) => {
      // this.getTerminalStatus(instanceId);
      // this.getTerminalConfig(instanceId);
      // SPI.broadcastEvent(instanceId, e);
      console.log('addEventListener', events.spiTerminalConfigChanged, e);

      SPI.broadcastEvent(instance.id, e);
      // return CurrentStatus === SpiStatus.PairedConnected && this.retriveConfig(instanceId);
    });

    instance.spi.TerminalConfigurationResponse = (e: any) => {
      console.log('TerminalConfigurationResponse', e);

      instance.dispatchEvent(
        new CustomEvent(events.spiTerminalConfigChanged, {
          detail: e.Data,
        })
      );
      // SPI.broadcastEvent(instanceId, {
      //   type: events.spiTerminalConfigChanged,
      //   detail: {
      //     ...e.Data,
      //     updatedAt: e.DateTimeStamp,
      //   },
      // });
    };

    instance.spi.Start();
    // window.setTimeout(() => instance.spi.Pair(), 1000);
    return instance;
  }

  log = {
    info: function info(message: any) {
      console.log(message);
    },
  };

  static createEventPayload(instanceId: String, payload: any) {
    return { id: instanceId, payload };
  }

  static broadcastEvent(instanceId: string, event: any) {
    const { detail: payload, type } = event;
    eventBus.dispatchEvent(new CustomEvent(type, { detail: SPI.createEventPayload(instanceId, payload) }));
  }

  getCurrentPairingFlow(instanceId: string) {
    return this.getInstance(instanceId).spi.CurrentPairingFlowState;
  }
}

export default new SPI();
