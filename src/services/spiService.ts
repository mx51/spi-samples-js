/* eslint-disable no-underscore-dangle */
import { Spi as SpiClient } from '@mx51/spi-client-js';
import { IPairFormSettings } from '../components/PairPage/PairForm/interfaces';
import { spiEvents, SPI_PAIR_STATUS } from '../definitions/constants/commonConfigs';
import { currentVersion, defaultPosName } from '../definitions/constants/spiConfigs';
import {
  FIELD_PRESSED_COLOR,
  PRIMARY_ERROR_COLOR,
  PRIMARY_THEME_COLOR,
} from '../definitions/constants/themeStylesConfigs';
import { getLocalStorage, setLocalStorage } from '../utils/common/spi/common';
import SpiEventTarget from '../utils/common/spi/eventTarget';
import { ITerminalSetups, ITerminals } from './interfaces';

class SpiService {
  currentInstanceId: string;

  private print;

  terminalInstance: Any;

  constructor() {
    this.currentInstanceId = '';
    this.print = console;
    this.terminalInstance = {};
  }

  static readTerminalList(): ITerminals {
    return JSON.parse(getLocalStorage('terminals') as string);
  }

  initializeTerminalInstance(instanceId: string, pairFormSettings: IPairFormSettings): ITerminalSetups {
    try {
      const currentTerminals = SpiService.readTerminalList();
      // instanceId: terminal instance id string
      // pairFormSettings: JSON object acquired from front-end UI
      const initialTerminals: ITerminals = {};
      initialTerminals[instanceId] = pairFormSettings;

      if (!currentTerminals) {
        // save terminal instance configurations into local storage `terminals`
        setLocalStorage('terminals', JSON.stringify(initialTerminals));
      } else {
        currentTerminals[instanceId] = pairFormSettings;
        setLocalStorage('terminals', JSON.stringify(currentTerminals));
      }
      // get current terminal instance
      return this.getCurrentInstance(instanceId);
    } catch (error) {
      const errorOutput = error || 'Error occurred during initialize terminal instance setup';

      this.print.error(`%c ${errorOutput}`, `color: ${PRIMARY_ERROR_COLOR};`);
      throw errorOutput;
    }
  }

  getCurrentInstance(instanceId: string): ITerminalSetups {
    try {
      const terminals = SpiService.readTerminalList();
      terminals[instanceId].secrets = null;
      // settings page related
      terminals[instanceId].print_merchant_copy_input = false;
      terminals[instanceId].receipt_from_eftpos = false;
      terminals[instanceId].check_sig_eftpos = false;
      terminals[instanceId].use_secure_web_sockets = false;
      terminals[instanceId].options = null;
      terminals[instanceId].spi_receipt_header = '';
      terminals[instanceId].spi_receipt_footer = '';

      return terminals[instanceId];
    } catch (error) {
      const errorOutput = error || 'Error occurred during terminal instance attribute addition setup';

      this.print.error(`%c ${errorOutput}`, `color: ${PRIMARY_ERROR_COLOR};`);
      throw errorOutput;
    }
  }

  setTerminalConfigurations(instanceId: string, terminalConfigurations: ITerminalSetups): ITerminalSetups {
    try {
      // create terminal event handler instance for handling event changes
      const { acquirerCode, apiKey, autoAddress, eftpos, posId, secureWebSocket, serialNumber, testMode, secrets } =
        terminalConfigurations;
      const terminal = new SpiEventTarget() as ITerminalSetups;
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
    } catch (error) {
      const errorOutput = error || 'Error occurred during terminal configuration setup';

      this.print.error(`%c ${errorOutput}`, `color: ${PRIMARY_ERROR_COLOR};`);
      throw errorOutput;
    }
  }

  createOrUpdateTerminal(instanceId: string, pairFormSettings: IPairFormSettings): ITerminalSetups {
    const currentTerminals = JSON.parse(getLocalStorage('terminals') as string);
    // check whether the instance id has been created or not
    const terminalConfigurations =
      Object.keys(currentTerminals).indexOf(instanceId) > -1
        ? currentTerminals[instanceId]
        : this.initializeTerminalInstance(instanceId, pairFormSettings);

    // return configured terminal instance settings
    const terminal: ITerminalSetups = this.setTerminalConfigurations(instanceId, terminalConfigurations);

    terminal.currentTxFlowStateOverride = null;

    // spiDeviceAddressChanged
    terminal.addEventListener(spiEvents.spiPairingFlowStateChanged, (event: Any) => {
      this.print.log(`%cspiDeviceAddressChanged: ${JSON.stringify(event, null, 2)}`, `color: ${PRIMARY_THEME_COLOR}`);
      // @Trigger redux action to update state for UI
    });

    // spiStatusChanged
    terminal.addEventListener(spiEvents.spiStatusChanged, (event: Any) => {
      if (event?.detail && event.detail === SPI_PAIR_STATUS.CONNECTED) {
        terminal.spiClient.AckFlowEndedAndBackToIdle();
      }

      const { detail: CurrentStatus } = event;

      this.print.log(`%cspiStatusChanged: ${CurrentStatus}`, `color: ${PRIMARY_THEME_COLOR}`);
    });

    // spiPairingFlowStateChanged event
    terminal.addEventListener(spiEvents.spiPairingFlowStateChanged, (event: Any) => {
      this.print.log(
        `%cspiPairingFlowStateChanged: ${JSON.stringify(event, null, 2)}`,
        `color: ${PRIMARY_THEME_COLOR}`
      );
      // @Trigger redux action to update state for UI
    });

    // spiSecretsChanged event
    terminal.addEventListener(spiEvents.spiSecretsChanged, () => {
      this.print.log(terminal.spiClient._secrets);
      // save secrets once terminal received secrets value during pair process
      const terminalsList = JSON.parse(getLocalStorage('terminals'));
      terminalsList[instanceId].secrets = terminal.spiClient._secrets;
      setLocalStorage('terminals', JSON.stringify(terminalsList));
      // @Trigger redux action to update state for UI
      this.print.info(
        `%c spiSecretsChanged data: ${JSON.stringify(terminal.spiClient._secrets, null, 2)}`,
        `color: ${FIELD_PRESSED_COLOR}`
      );
    });

    // spiTxFlowStateChanged event
    terminal.setEventMapper(spiEvents.spiTxFlowStateChanged, (event: Any) => {
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

    // spiTerminalStatusChanged event
    terminal.addEventListener(spiEvents.spiTerminalStatusChanged, (event: Any) => {
      this.print.log(`%cspiTerminalStatusChanged: ${{ event }}`, `color: ${PRIMARY_THEME_COLOR}`);
      // @Trigger redux action to update state for UI
    });

    // spiTerminalSetupsChanged action event
    terminal.addEventListener(spiEvents.spiTerminalSetupsChanged, (event: Any) => {
      this.print.log(`%cspiTerminalSetupsChanged: ${{ event }}`, `color: ${PRIMARY_THEME_COLOR}`);
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

  readCurrentInstance(): ITerminalSetups {
    // @Trigger redux action to update state for UI [optional]
    return this.terminalInstance[this.currentInstanceId];
  }

  readCurrentFlow(): Any {
    // @Trigger redux action to update state for UI
    return this.readCurrentInstance().currentTxFlowStateOverride || this.readCurrentInstance().CurrentTxFlowState;
  }

  // Pair related functionalities
  spiPairTerminal(): void {
    this.readCurrentInstance().spiClient.Pair();

    // spi library triggers spiStatusChanged event value updates
    this.readCurrentInstance().dispatchEvent(
      new CustomEvent(spiEvents.spiStatusChanged, {
        detail: SPI_PAIR_STATUS.CONNECTING,
      })
    );
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
  addTerminal(instanceId: string, pairFormSettings: ITerminalSetups): void {
    // const terminal = this.createTerminalInstance(instanceId, pairFormSettings);
    this.createOrUpdateTerminal(instanceId, pairFormSettings);
    // @Destructure spiClient instance and return configuration settings values
    // @Trigger redux action to update state for UI
  }

  removeTerminal(): void {
    this.removeTerminalInstance();
    // @Trigger redux action to update state for UI
  }
}

export default SpiService;
