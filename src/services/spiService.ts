import { Spi as SpiClient } from '@mx51/spi-client-js';
import { spiEvents, SPI_PAIR_STATUS } from '../definitions/constants/commonConfigs';
import { FIELD_PRESSED_COLOR, PRIMARY_THEME_COLOR } from '../definitions/constants/themeStylesConfigs';
import { ITerminalConfig, ITerminals } from './interfaces';

const currentVersion = '2.8.5';
const defaultPosName = 'mx51';

function getLocalStorage(name: string) {
  return window.localStorage.getItem(name);
}

function setLocalStorage(name: string, value: string) {
  return window.localStorage.setItem(name, value);
}

class SpiService {
  private currentInstanceId: string;

  private print;

  private terminalInstance: Any;

  constructor() {
    this.currentInstanceId = '';
    this.print = console;
    this.terminalInstance = null;
  }

  static readTerminalList(): ITerminals {
    return JSON.parse(getLocalStorage('terminals') as string);
  }

  static initializeTerminalInstance(instanceId: string, pairFormSettings: ITerminalConfig): ITerminalConfig {
    const currentTerminals = SpiService.readTerminalList();
    // instanceId: terminal instance id
    // pairFormSettings: JSON stringify string
    const configs: ITerminals = {};
    configs[instanceId] = pairFormSettings;

    if (!currentTerminals) {
      // save terminal instance configs into local storage
      setLocalStorage('terminals', JSON.stringify(configs));
    } else {
      currentTerminals[instanceId] = configs;
      setLocalStorage('terminals', JSON.stringify(currentTerminals));
    }
    // get current terminal instance
    return SpiService.getCurrentInstance(instanceId);
  }

  static getCurrentInstance(instanceId: string): ITerminalConfig {
    const terminalList = SpiService.readTerminalList();
    terminalList[instanceId].secrets = null;
    // settings page related
    terminalList[instanceId].print_merchant_copy_input = false;
    terminalList[instanceId].receipt_from_eftpos = false;
    terminalList[instanceId].check_sig_eftpos = false;
    terminalList[instanceId].use_secure_web_sockets = false;
    terminalList[instanceId].options = null;
    terminalList[instanceId].spi_receipt_header = '';
    terminalList[instanceId].spi_receipt_footer = '';

    return terminalList[instanceId];
  }

  setTerminalConfigurations(instanceId: string, terminalConfigurations: ITerminalConfig): ITerminalConfig {
    // create terminal event handler instance for handling event changes
    const { acquirerCode, apiKey, autoAddress, eftpos, posId, secureWebSocket, serialNumber, testMode, secrets } =
      terminalConfigurations;
    const terminal = new EventTarget() as ITerminalConfig;
    this.currentInstanceId = instanceId;
    this.terminalInstance[instanceId] = terminal;
    // instantiate spi library as spiClient
    terminal.spiClient = new SpiClient(posId, serialNumber, eftpos, secrets);
    terminal.spiClient.SetEventBus(terminal);
    terminal.spiClient.SetPosInfo(defaultPosName, currentVersion);
    terminal.spiClient.SetAcquirerCode(acquirerCode);
    terminal.spiClient.SetDeviceApiKey(apiKey);
    terminal.spiClient.SetSecureWebSockets(secureWebSocket);
    terminal.spiClient.SetAutoAddressResolution(autoAddress);
    terminal.spiClient.SetTestMode(testMode);

    return terminal;
  }

  instantiateTerminal(instanceId: string, pairFormSettings: ITerminalConfig): ITerminalConfig {
    const currentTerminals = JSON.parse(getLocalStorage('terminals') as string);
    // check whether the instance id has been created or not
    const terminalConfigurations =
      Object.keys(currentTerminals).indexOf(instanceId) > -1
        ? currentTerminals[instanceId]
        : SpiService.initializeTerminalInstance(instanceId, pairFormSettings);

    // return configured terminal instance settings
    const terminal: ITerminalConfig = this.setTerminalConfigurations(instanceId, terminalConfigurations);

    terminal.currentTxFlowStateOverride = null;

    // spiTxFlowStateChanged event
    terminal.spiClient.setEventMapper(spiEvents.spiTxFlowStateChanged, (event: Any) => {
      const { detail } = event;

      if (!detail.override) terminal.currentTxFlowStateOverride = null;

      const updates = {
        type: spiEvents.spiTxFlowStateChanged,
        detail: this.readCurrentFlow(),
      };

      terminal.spiClient.AckFlowEndedAndBackToIdle();

      // @Trigger redux action to update state for UI
      return updates;
    });

    // spiPairingFlowStateChanged event
    terminal.spiClient.addEventListener(spiEvents.spiPairingFlowStateChanged, (event: Any) => {
      const { detail } = event;

      if (detail?.ConfirmationCode && !detail.AwaitingCheckFromEftpos && detail.AwaitingCheckFromPos)
        terminal.spiClient.PairingConfirmCode();

      // @Trigger redux action to update state for UI
    });

    // spiDeviceAddressChanged
    terminal.spiClient.addEventListener(spiEvents.spiPairingFlowStateChanged, (event: Any) => {
      this.print.log(`%c spiDeviceAddressChanged: ${{ event }}`, `color: ${PRIMARY_THEME_COLOR}`);
      // @Trigger redux action to update state for UI
    });

    // spiSecretsChanged event
    terminal.spiClient.addEventListener(spiEvents.spiSecretsChanged, (event: Any) => {
      this.print.info(
        `%c spiSecretsChanged data: ${{ message: 'keys rolled', id: instanceId, event }}`,
        `color: ${FIELD_PRESSED_COLOR}`
      );
      this.print.log(`%c spiSecretsChanged: ${{ event }}`, `color: ${PRIMARY_THEME_COLOR}`);
      // @Trigger redux action to update state for UI
    });

    // spiStatusChanged event
    terminal.spiClient.addEventListener(spiEvents.spiStatusChanged, (event: Any) => {
      if (event.detail && event.detail === SPI_PAIR_STATUS.CONNECTED) terminal.spiClient.AckFlowEndedAndBackToIdle();
      this.print.log(`%c spi status: ${{ detail: event.detail }}`, `color: ${PRIMARY_THEME_COLOR}`);
      // @Trigger redux action to update state for UI
    });

    // spiTerminalStatusChanged event
    terminal.spiClient.addEventListener(spiEvents.spiTerminalStatusChanged, (event: Any) => {
      this.print.log(`%c spiTerminalStatusChanged: ${{ event }}`, `color: ${PRIMARY_THEME_COLOR}`);
      // @Trigger redux action to update state for UI
    });

    // spiTerminalConfigChanged action event
    terminal.spiClient.addEventListener(spiEvents.spiTerminalConfigChanged, (event: Any) => {
      this.print.log(`%c spiTerminalConfigChanged: ${{ event }}`, `color: ${PRIMARY_THEME_COLOR}`);
      // @Trigger redux action to update state for UI
    });

    // spiTerminalStatusChanged action event
    terminal.spiClient.addEventListener(spiEvents.spiTerminalStatusChanged, (event: Any) => {
      this.print.log(`%c spiTerminalStatusChanged: ${{ event }}`, `color: ${PRIMARY_THEME_COLOR}`);
      // @Trigger redux action to update state for UI
    });

    terminal.spiClient.Start();

    return terminal;
  }

  removeTerminalInstance(): void {
    const currentTerminals = JSON.parse(getLocalStorage('terminals') as string);
    delete currentTerminals[this.currentInstanceId];
    // after delete current instance then update terminal list for localStorage
    setLocalStorage('terminals', JSON.stringify(currentTerminals));
  }

  readCurrentInstance(): ITerminalConfig {
    // @Trigger redux action to update state for UI
    return this.terminalInstance[this.currentInstanceId];
  }

  readCurrentFlow(): Any {
    // @Trigger redux action to update state for UI
    return this.readCurrentInstance().currentTxFlowStateOverride || this.readCurrentInstance().CurrentTxFlowState;
  }

  // Pair related functionalities
  spiPairTerminal(): void {
    this.readCurrentInstance().spiClient.Pair();
    // @Trigger redux action to update state for UI
  }

  spiCancelPairingTerminal(): void {
    this.readCurrentInstance().spiClient.PairingCancel();
    // @Trigger redux action to update state for UI
  }

  spiUnPairTerminal(): void {
    this.readCurrentInstance().spiClient.Unpair();
    // @Trigger redux action to update state for UI
  }

  // Terminal related functionalities
  addTerminal(instanceId: string, pairFormSettings: ITerminalConfig): void {
    // const terminal = this.createTerminalInstance(instanceId, pairFormSettings);
    this.instantiateTerminal(instanceId, pairFormSettings);
    // @Destructure spiClient instance and provide certain parameters
    // @Trigger redux action to update state for UI
  }

  removeTerminal(): void {
    this.removeTerminalInstance();
    // @Trigger redux action to update state for UI
  }
}

export default SpiService;
