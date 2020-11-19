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

  spiceAddTerminal(config: any) {
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

  createLibraryInstance(config: any, instanceId = uuid()): EventTarget {
    const name = 'mx51';
    const version = '2.8.0';
    console.log('createLibraryInstance', config);

    const terminalConfig = {
      PosId: config.posId,
      SerialNumber: '',
      EftposAddress: config.eftpos,
      Secrets: null,
      TestMode: true,
      AutoAddressResolution: config.autoAddress,
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

      // SPI.broadcastEvent(instanceId, e);
      console.log({ instanceId, e });
    });

    instance.addEventListener(events.spiSecretsChanged, (detail: any) => {
      console.log({ detail });

      this.log.info({ message: 'keys rolled', id: instanceId, detail });
      // this.setConfig({ Secrets: updatedSecrets }, instanceId, true);
    });

    instance.addEventListener(events.spiStatusChanged, (e: any) => {
      // this.getTerminalStatus(instanceId);
      // this.getTerminalConfig(instanceId);
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
    window.setTimeout(() => instance.spi.Pair(), 3000);
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
}

export default new SPI();
