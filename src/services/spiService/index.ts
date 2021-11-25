import { Spi as SpiClient, TransactionOptions } from '@mx51/spi-client-js';
import { commonPairErrorMessage, spiEvents, SPI_PAIR_STATUS } from '../../definitions/constants/commonConfigs';
import { currentVersion, defaultApikey, defaultLocalIP, defaultPosName } from '../../definitions/constants/spiConfigs';
import {
  FIELD_PRESSED_COLOR,
  PRIMARY_ERROR_COLOR,
  PRIMARY_THEME_COLOR,
} from '../../definitions/constants/themeStylesConfigs';
import { setConfirmPairingFlow } from '../../redux/reducers/CommonSlice/commonSlice';
import { IPairFormValues } from '../../redux/reducers/PairFormSlice/interfaces';
import { readTerminalPairError, updatePairFormParams } from '../../redux/reducers/PairFormSlice/pairFormSlice';
import {
  updatePairingFlow,
  updatePairingStatus,
  updateTerminal,
  updateTerminalBatteryLevel,
  updateTerminalConfigurations,
  updateTxFlowSettlementResponse,
  updateTxFlow,
  updateTxMessage,
} from '../../redux/reducers/TerminalSlice/terminalsSlice';
import { getLocalStorage, setLocalStorage } from '../../utils/common/spi/common';
import SpiEventTarget from '../../utils/common/spi/eventTarget';
import { ITerminal, ITerminals } from '../interfaces';

declare global {
  interface Window {
    Spi: Any;
  }
}

class SpiService {
  dispatchAction: Any; // redux dispatch action

  print: Console;

  terminals: ITerminals;

  constructor() {
    this.print = console;
    this.terminals = {};
  }

  start(dispatch: Any): void {
    // start to render existed terminal instance(s)
    this.dispatchAction = dispatch;

    if (!getLocalStorage('terminals')) setLocalStorage('terminals', '{}');

    const recordedTerminals = JSON.parse(getLocalStorage('terminals') as string);

    if (Object.keys(recordedTerminals).length > 0) {
      // read existed/created terminal instances
      Object.values(recordedTerminals).forEach(async (terminal: Any) => {
        const instanceId = terminal.serialNumber;
        this.createLibraryInstance(instanceId);
      });
    }
  }

  // read local storage terminals list: all the terminal instances localStorage data
  readTerminalList(): ITerminals {
    this.print.log(getLocalStorage('terminals'));
    return JSON.parse(getLocalStorage('terminals') || '{}');
  }

  // remove terminal record from localStorage
  removeUnpairedTerminalLocalStorage(instanceId: string): void {
    this.print.log(getLocalStorage('terminals'));
    const recordedTerminals = JSON.parse(getLocalStorage('terminals') as string);
    delete recordedTerminals[instanceId];
    setLocalStorage('terminals', JSON.stringify(recordedTerminals));
  }

  // read current terminal instance
  readTerminalInstance(instanceId: string): ITerminal {
    return this.terminals[instanceId];
  }

  // remove instance record from localStorage
  removeTerminalInstance(instanceId: string): void {
    const currentTerminals = JSON.parse(getLocalStorage('terminals'));
    delete currentTerminals[instanceId];

    this.print.log(`%cSPI terminal instances: ${getLocalStorage('terminals')}`);

    setLocalStorage('terminals', JSON.stringify(currentTerminals));
  }

  // update localStorage current terminal configs
  updateTerminalStorage(instanceId: string, key: string, value: Any): void {
    const currentTerminals = this.readTerminalList();

    if (Object.keys(currentTerminals).indexOf(instanceId) > -1) {
      (currentTerminals as Any)[instanceId][key] = value;
      setLocalStorage('terminals', JSON.stringify(currentTerminals));
    }
  }

  async createLibraryInstance(instanceId: string, pairForm?: IPairFormValues): Promise<ITerminal> {
    try {
      const terminalsStorage = this.readTerminalList();
      const instance = new SpiEventTarget() as Any; // instantiate event target class for spi library event handlings

      this.terminals[instanceId] = instance;

      // if terminal instance already been saved in localStorage, use this.readTerminalList() for reading terminal instance
      // if terminal is not paired yet (no localStorage record being found), use pairForm for pair instance creation
      const terminalFormParams: Any =
        Object.keys(terminalsStorage).indexOf(instanceId) > -1 ? terminalsStorage[instanceId] : pairForm;

      // get current terminal settings
      const { acquirerCode, autoAddress, deviceAddress, posId, serialNumber, testMode, secrets } = terminalFormParams;

      // create localStorage instance if no terminal instance has been found inside current local terminals storage
      if (Object.keys(terminalsStorage).indexOf(instanceId) <= -1) {
        setLocalStorage(
          'terminals',
          JSON.stringify({
            ...terminalsStorage,
            [instanceId]: {},
          })
        );
      }

      // save acquirerCode & posId & serialNumber & testMode into localStorage
      this.updateTerminalStorage(instanceId, 'acquirerCode', acquirerCode);
      this.updateTerminalStorage(instanceId, 'posId', posId);
      this.updateTerminalStorage(instanceId, 'serialNumber', serialNumber);
      this.updateTerminalStorage(instanceId, 'testMode', testMode);

      if (!autoAddress) this.updateTerminalStorage(instanceId, 'deviceAddress', deviceAddress);

      // instantiate spi library
      instance.spiClient = new SpiClient(posId, serialNumber, deviceAddress, secrets);

      // spi library methods setup
      instance.spiClient.SetEventBus(instance);
      instance.spiClient.SetPosInfo(defaultPosName, currentVersion);
      instance.spiClient.SetAcquirerCode(acquirerCode);
      instance.spiClient.SetDeviceApiKey(defaultApikey);
      instance.spiClient._inTestMode = testMode;

      // setup terminal id in localStorage
      this.updateTerminalStorage(instanceId, 'id', serialNumber);

      if (autoAddress) {
        // setup auto address resolution when user selected auto address in pair form
        const eftposAddress = await this.getTerminalAddress(instanceId);

        if (!eftposAddress) {
          this.removeTerminalInstance(instanceId);
          this.handleTerminalPairFailure(instanceId);
        }

        // setup AUTO address to show in current pair form
        instance.spiClient.SetEftposAddress(eftposAddress);
      }

      instance.spiClient.PrintingResponse = () => true;
      instance.currentTxFlowStateOverride = null; // without mutating spi client's tx flow object.

      instance.setEventMapper(spiEvents.spiTxFlowStateChanged, ({ detail }: Any) => {
        // if this is not an override but "EFTPOS" event, we reset our override value
        if (!detail.override) instance.currentTxFlowStateOverride = null;

        const updatedEvent = {
          detail: this.getCurrentTxFlow(instanceId),
        };

        return updatedEvent;
      });

      // SPI Device Address Change Listener
      instance.addEventListener(spiEvents.spiDeviceAddressChanged, ({ detail: address }: Any) => {
        const EftposAddress = address.fqdn || address.ip || defaultLocalIP;

        if (!EftposAddress) {
          // remove localStorage record for pair failed terminal instance
          this.removeTerminalInstance(instanceId);
          this.handleTerminalPairFailure(
            instanceId,
            'Acquiring EFTPOS address is failed. Please check the pair form configurations and retry it later.'
          );
        }

        // Only first time pair show the eftpos address (When form reset, no eftpos address will be shown)
        if (EftposAddress && !getLocalStorage('terminals').includes(EftposAddress))
          this.dispatchAction(
            updatePairFormParams({
              key: 'deviceAddress',
              value: {
                value: EftposAddress,
                isValid: true,
              },
            })
          );

        // save eftposAddress (deviceAddress) into localStorage
        this.updateTerminalStorage(instanceId, 'deviceAddress', EftposAddress);
      });

      // SPI Auto Address Failed Result Listener
      instance.addEventListener(spiEvents.spiAutoAddressResolutionFailed, ({ detail: error }: Any) => {
        this.removeTerminalInstance(instanceId);
        this.handleTerminalPairFailure(instanceId, error?.message);
        this.print.error(`%cautoAddressResolutionFailed: ${JSON.stringify(error)}`, `color: ${PRIMARY_ERROR_COLOR};`);
      });

      // SPI Paring Flow State Change Listener
      instance.addEventListener(spiEvents.spiPairingFlowStateChanged, ({ detail }: Any) => {
        this.dispatchAction(
          updatePairingFlow({
            id: instanceId,
            pairingFlow: detail,
          })
        );

        if (detail?.ConfirmationCode && detail.AwaitingCheckFromEftpos && detail.AwaitingCheckFromPos)
          this.dispatchAction(setConfirmPairingFlow(true)); // turn on "show confirm pairing flow message in flow panel"

        if (detail?.ConfirmationCode && !detail.AwaitingCheckFromEftpos && detail.AwaitingCheckFromPos) {
          instance.spi.PairingConfirmCode();
        }

        if (detail.Message === 'Pairing Failed') {
          this.handleTerminalPairFailure(instanceId, detail.Message);
          this.removeTerminalInstance(instanceId);
        }

        this.print.log(`%cspiPairingFlowStateChanged: ${JSON.stringify(detail)}`, `color: ${PRIMARY_THEME_COLOR}`);
      });

      // SPI Secrets Change Listener
      instance.addEventListener(spiEvents.spiSecretsChanged, ({ detail }: Any) => {
        // save secrets into localStorage
        this.updateTerminalStorage(instanceId, 'secrets', detail);

        this.print.info(
          `%cspiSecretsChanged: ${JSON.stringify(instance.spiClient._secrets)}`,
          `color: ${FIELD_PRESSED_COLOR}`
        );
      });

      // SPI Status Change Listener
      instance.addEventListener(spiEvents.spiStatusChanged, ({ detail: status }: Any) => {
        if (status === SPI_PAIR_STATUS.PairedConnected) instance.spiClient.AckFlowEndedAndBackToIdle();

        this.dispatchAction(
          updatePairingStatus({
            id: instanceId,
            status, // update the latest pair form connection status
          })
        );

        this.print.info(`%cspiStatusChanged: ${JSON.stringify(status)}`, `color: ${FIELD_PRESSED_COLOR}`);
      });

      // ONLY on battery update, we request a terminal status to streamline accessing this information in one way.
      instance.spiClient.BatteryLevelChanged = () => this.getTerminalStatus(instanceId);

      // SPI Terminal Configuration Response Function (always get called when browser gets refreshed)
      instance.spiClient.TerminalConfigurationResponse = ({ Data }: Any) => {
        // after terminal paired and when page refreshed, update terminal status
        if (instance.spiClient._currentStatus === SPI_PAIR_STATUS.PairedConnected) {
          this.dispatchAction(updatePairingStatus({ id: instanceId, status: SPI_PAIR_STATUS.PairedConnected }));
          instance.spiClient.GetTerminalStatus(); // for trigger to call TerminalStatusResponse()
        } else {
          this.dispatchAction(updatePairingStatus({ id: instanceId, status: SPI_PAIR_STATUS.Unpaired }));
        }

        // ensure current terminal redux store instance object is update to date
        this.dispatchAction(
          updateTerminal({
            id: instanceId,
            spiClient: instance.spiClient,
          })
        );

        this.dispatchAction(
          updateTerminalConfigurations({
            id: instanceId,
            pluginVersion: Data?.plugin_version,
            merchantId: Data?.merchant_id,
            terminalId: Data?.terminal_id,
          })
        );

        this.print.log(
          `%cTerminalConfigurationResponse data: ${JSON.stringify(Data, null, 2)}`,
          `color: ${FIELD_PRESSED_COLOR}`
        );
      };

      // SPI Terminal Status Response Function
      instance.spiClient.TerminalStatusResponse = ({ Data }: Any) => {
        // ensure current terminal redux store object is update to date
        this.dispatchAction(
          updateTerminalBatteryLevel({
            id: instanceId,
            batteryLevel: Data?.battery_level,
          })
        );

        this.print.log(
          `%cTerminalStatusResponse data: ${JSON.stringify(Data, null, 2)}`,
          `color: ${FIELD_PRESSED_COLOR}`
        );
      };

      // SPI Tx Flow State Change Listener
      instance.addEventListener(spiEvents.spiTxFlowStateChanged, (event: Any) => {
        const { detail } = event;

        if (detail.Finished) {
          instance.spiClient.AckFlowEndedAndBackToIdle();
        }

        // when Response Data available, update transaction flow response data
        if (detail?.Response?.Data)
          this.dispatchAction(
            updateTxFlowSettlementResponse({
              id: instanceId,
              responseData: detail.Response.Data,
            })
          );

        this.dispatchAction(
          updateTxFlow({
            id: instanceId,
            txFlow: detail,
          })
        );
      });

      instance.spiClient.TransactionUpdateMessage = ({ Data }: Any) => {
        this.dispatchAction(
          updateTxMessage({
            id: instanceId,
            txMessage: {
              decryptedJson: '',
              displayMessageCode: Data.display_message_code,
              displayMessageText: Data.display_message_text,
              posCounter: '',
              posRefId: Data.pos_ref_id,
            },
          })
        );
      };

      instance.spiClient.Start();
      this.dispatchAction(setConfirmPairingFlow(false)); // turn off "show confirm pairing flow message in flow panel"

      window.Spi = instance; // export as window object (For debugging purposes)

      return instance;
    } catch (error: Any) {
      // remove localStorage record for pair failed terminal instance
      this.removeTerminalInstance(instanceId);
      // update terminal connection status after terminal instance creation process failed
      this.handleTerminalPairFailure(instanceId);

      this.print.error(`%c ${JSON.stringify(error)}`, `color: ${PRIMARY_ERROR_COLOR};`);

      throw Error(`Failed during creating terminal instance. ${error?.message ? `Error: ${error?.message}` : ''}`);
    }
  }

  // * spi library helpers *

  handleTerminalPairFailure(instanceId: string, message: string = commonPairErrorMessage) {
    this.dispatchAction(updatePairingStatus({ id: instanceId, status: SPI_PAIR_STATUS.Unpaired }));
    this.dispatchAction(
      readTerminalPairError({
        isShown: true,
        message,
      })
    );
  }

  async getTerminalAddress(instanceId: string): Promise<string> {
    const aar = await this.readTerminalInstance(instanceId).spiClient.GetTerminalAddress();
    return aar;
  }

  getCurrentTxFlow(instanceId: string): ITerminal {
    const instance = this.readTerminalInstance(instanceId);
    return instance.currentTxFlowStateOverride || instance.spiClient.CurrentTxFlowState;
  }

  getTerminalStatus(instanceId: string): ITerminal {
    return this.ready(instanceId) && this.readTerminalInstance(instanceId).spiClient.GetTerminalStatus();
  }

  ready(instanceId: string): ITerminal {
    return (
      this.getCurrentStatus(instanceId) === SPI_PAIR_STATUS.PairedConnected &&
      this.readTerminalInstance(instanceId).spiClient._mostRecentPongReceived
    );
  }

  getCurrentStatus(instanceId: string): ITerminal {
    return this.readTerminalInstance(instanceId).spiClient.CurrentStatus;
  }

  // * terminal related operations *

  async spiTerminalPair(instanceId: string, pairForm: IPairFormValues): Promise<void> {
    await this.createLibraryInstance(instanceId, pairForm);
    this.readTerminalInstance(instanceId).spiClient.Pair();
  }

  spiTerminalCancelPair(instanceId: string): void {
    this.readTerminalInstance(instanceId).spiClient.PairingCancel();
    this.removeUnpairedTerminalLocalStorage(instanceId);
  }

  spiTerminalUnPair(instanceId: string): void {
    this.readTerminalInstance(instanceId).spiClient.Unpair();
    this.removeUnpairedTerminalLocalStorage(instanceId);
  }

  initiatePurchaseTransaction(
    instanceId: string,
    posRefId: string,
    purchaseAmount: number,
    tipAmount: number,
    cashoutAmount: number,
    promptForCashout: boolean,
    surchargeAmount: number
  ): void {
    const spi = this.readTerminalInstance(instanceId).spiClient;
    const options = new TransactionOptions();
    options.SetCustomerReceiptHeader('');
    options.SetMerchantReceiptHeader('');
    options.SetCustomerReceiptFooter('');
    options.SetMerchantReceiptFooter('');

    return spi.InitiatePurchaseTxV2(
      posRefId,
      purchaseAmount,
      tipAmount,
      cashoutAmount,
      promptForCashout,
      options,
      surchargeAmount
    );
  }

  initiateMotoPurchaseTransaction(
    instanceId: string,
    posRefId: string,
    purchaseAmount: number,
    surchargeAmount: number
  ): void {
    const spi = this.readTerminalInstance(instanceId).spiClient;
    return spi.InitiateMotoPurchaseTx(posRefId, purchaseAmount, surchargeAmount);
  }

  initiateCashoutOnlyTxTransaction(
    instanceId: string,
    posRefId: string,
    purchaseAmount: number,
    surchargeAmount: number
  ): void {
    return this.readTerminalInstance(instanceId).spiClient.InitiateCashoutOnlyTx(
      posRefId,
      purchaseAmount,
      surchargeAmount
    );
  }

  initTxSettlement(instanceId: string, posRefId: string) {
    return this.readTerminalInstance(instanceId).spiClient.InitiateSettleTx(posRefId);
  }

  initTxSettlementEnquiry(instanceId: string, posRefId: string) {
    return this.readTerminalInstance(instanceId).spiClient.InitiateSettlementEnquiry(posRefId);
  }
}

const spiService = new SpiService();

export { spiService as default };
