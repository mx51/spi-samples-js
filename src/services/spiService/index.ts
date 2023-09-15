import { Spi as SpiClient, TransactionOptions } from '@mx51/spi-client-js';
import { commonPairErrorMessage, spiEvents, SPI_PAIR_STATUS } from '../../definitions/constants/commonConfigs';
import { defaultApikey, defaultLocalIP, defaultPosName } from '../../definitions/constants/spiConfigs';
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
import { getLocalStorage, setLocalStorage, getTxFlow } from '../../utils/common/spi/common';
import SpiEventTarget from '../../utils/common/spi/eventTarget';
import { RECEIPT_CONFIG, posVersion } from '../../utils/constants';

import { ITerminal, ITerminals } from '../interfaces';

declare global {
  interface Window {
    Spi: Any;
  }
}

class SpiService {
  state = {
    receiptConfig: (() => {
      const receiptConfigString = getLocalStorage(RECEIPT_CONFIG);
      return typeof receiptConfigString === 'string'
        ? JSON.parse(receiptConfigString)
        : {
            eftposMerchantCopy: false,
            eftposCustomerCopy: false,
            eftposSignatureFlow: false,
            suppressMerchantPassword: false,
            receiptHeader: '',
            receiptFooter: '',
          };
    })(),
  };

  dispatchAction: Any; // redux dispatch action

  print: Console = console;

  terminals: ITerminals = {};

  // updates receipt config when state changes in useLocalSate hook
  updateReceiptConfig(config: any) {
    this.state.receiptConfig = config;
  }

  // sets custom receipt headers and footers
  setCustomReceipts() {
    const { receiptConfig } = this.state;
    const options = new TransactionOptions();
    options.SetCustomerReceiptHeader(receiptConfig.receiptHeader);
    options.SetMerchantReceiptHeader(receiptConfig.receiptHeader);
    options.SetCustomerReceiptFooter(receiptConfig.receiptFooter);
    options.SetMerchantReceiptFooter(receiptConfig.receiptFooter);
    return options;
  }

  // sets the receipt configuration for the terminal instance
  setSpiConfig(instanceId: string) {
    const spi = this.readTerminalInstance(instanceId).spiClient;
    const { receiptConfig } = this.state;
    spi.Config.PromptForCustomerCopyOnEftpos = receiptConfig.eftposCustomerCopy;
    spi.Config.SignatureFlowOnEftpos = receiptConfig.eftposSignatureFlow;
    spi.Config.PrintMerchantCopy = receiptConfig.eftposMerchantCopy;
    return spi;
  }

  // sets the receipt configuration for the preauth instance
  setPreAuthConfig(instanceId: string) {
    const spi = this.readTerminalInstance(instanceId).spiPreAuth;
    const { receiptConfig } = this.state;
    spi.Config.PromptForCustomerCopyOnEftpos = receiptConfig.eftposCustomerCopy;
    spi.Config.SignatureFlowOnEftpos = receiptConfig.eftposSignatureFlow;
    spi.Config.PrintMerchantCopy = receiptConfig.eftposMerchantCopy;
    return spi;
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
      const { acquirerCode, autoAddress, deviceAddress, posId, serialNumber, testMode, secrets, environment } =
        terminalFormParams;

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
      this.updateTerminalStorage(instanceId, 'status', SPI_PAIR_STATUS.PairedConnecting);
      this.updateTerminalStorage(instanceId, 'reconnecting', true);

      if (!autoAddress) this.updateTerminalStorage(instanceId, 'deviceAddress', deviceAddress);

      // instantiate spi library
      instance.spiClient = new SpiClient(posId, serialNumber, deviceAddress, secrets);

      // spi library methods setup
      instance.spiClient.SetEventBus(instance);
      instance.spiClient.SetPosInfo(defaultPosName, posVersion);
      instance.spiClient.SetAcquirerCode(acquirerCode);
      instance.spiClient.SetDeviceApiKey(defaultApikey);
      instance.spiClient.EnvironmentCode = environment;
      instance.spiClient.SetTestMode(testMode);

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
        const pairingFlow = {
          message: detail?.Message,
          awaitingCheckFromEftpos: detail?.AwaitingCheckFromEftpos,
          awaitingCheckFromPos: detail?.AwaitingCheckFromPos,
          confirmationCode: detail?.ConfirmationCode,
          finished: detail?.Finished,
          successful: detail?.Successful,
        };

        this.dispatchAction(
          updatePairingFlow({
            id: instanceId,
            pairingFlow,
          })
        );

        if (detail?.confirmationCode && detail?.awaitingCheckFromEftpos && detail?.awaitingCheckFromPos)
          this.dispatchAction(setConfirmPairingFlow(true)); // turn on "show confirm pairing flow message in flow panel"

        if (detail?.confirmationCode && !detail?.awaitingCheckFromEftpos && detail?.awaitingCheckFromPos) {
          instance.spi.PairingConfirmCode();
        }

        if (detail?.Message === 'Pairing Failed') {
          this.handleTerminalPairFailure(instanceId, detail?.Message);
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

        if (!instance.spiClient._secrets) this.removeTerminalInstance(instanceId);
      });

      // SPI Status Change Listener
      instance.addEventListener(spiEvents.spiStatusChanged, ({ detail: status }: Any) => {
        if (status === SPI_PAIR_STATUS.PairedConnected) instance.spiClient.AckFlowEndedAndBackToIdle();

        if (status === SPI_PAIR_STATUS.Unpaired) this.removeTerminalInstance(instanceId);

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
        const { spiClient } = instance;
        const terminalConfigurations = {
          acquirerCode: spiClient?._tenantCode,
          autoAddress: spiClient?._autoAddressResolutionEnabled,
          deviceAddress: spiClient?._eftposAddress,
          posId: spiClient?._posId,
          secureWebSocket: spiClient?._forceSecureWebSockets,
          serialNumber: spiClient?._serialNumber,
          testMode: spiClient?._inTestMode,
          flow: spiClient?.CurrentFlow,
          id: spiClient?._serialNumber,
          pairingFlow: spiClient?.CurrentPairingFlowState,
          posVersion: spiClient?._posVersion,
          secrets: spiClient?._secrets,
          settings: null, // not available during pair terminal stage
          status: spiClient?._currentStatus,
          terminalStatus: spiClient?.CurrentFlow,
          txFlow: getTxFlow(spiClient?.CurrentTxFlowState),
          txMessage: null, // not available during pair terminal stage
        };

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
            spiClient: terminalConfigurations,
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

        const receipt = {
          accumulatedSettleByAcquirerCount: detail?.Response?.Data?.accumulated_settle_by_acquirer_count,
          accumulatedSettleByAcquirerValue: detail?.Response?.Data?.accumulated_settle_by_acquirer_value,
          accumulatedTotalCount: detail?.Response?.Data?.accumulated_total_count,
          accumulatedTotalValue: detail?.Response?.Data?.accumulated_total_value,
          bankDate: detail?.Response?.Data?.bank_date,
          bankTime: detail?.Response?.Data?.bank_time,
          errorDetail: detail?.Response?.Data?.error_detail,
          errorReason: detail?.Response?.Data?.error_reason,
          hostResponseCode: detail?.Response?.Data?.host_response_code,
          hostResponseText: detail?.Response?.Data?.host_response_text,
          merchantAcquirer: detail?.Response?.Data?.merchant_acquirer,
          merchantAddress: detail?.Response?.Data?.merchant_address,
          merchantCity: detail?.Response?.Data?.merchant_city,
          merchantCountry: detail?.Response?.Data?.merchant_country,
          merchantName: detail?.Response?.Data?.merchant_name,
          merchantPostcode: detail?.Response?.Data?.merchant_postcode,
          merchantReceipt: detail?.Response?.Data?.merchant_receipt,
          merchantReceiptPrinted: detail?.Response?.Data?.merchant_receipt_printed,
          schemes: detail?.Response?.Data?.schemes,
          settlementPeriodEndDate: detail?.Response?.Data?.settlement_period_end_date,
          settlementPeriodEndTime: detail?.Response?.Data?.settlement_period_end_time,
          settlementPeriodStartDate: detail?.Response?.Data?.settlement_period_start_date,
          settlementPeriodStartTime: detail?.Response?.Data?.settlement_period_start_time,
          settlementTriggeredDate: detail?.Response?.Data?.settlement_triggered_date,
          settlementTriggeredTime: detail?.Response?.Data?.settlement_triggered_time,
          stan: detail?.Response?.Data?.stan,
          success: detail?.Response?.Data?.success,
          terminalId: detail?.Response?.Data?.terminal_id,
          transactionRange: detail?.Response?.Data?.transaction_range,
        };

        if (detail?.Finished) {
          instance.spiClient.AckFlowEndedAndBackToIdle();
        }

        // when Response Data available, update transaction flow response data
        if (detail?.Response?.Data)
          this.dispatchAction(
            updateTxFlowSettlementResponse({
              id: instanceId,
              receipt,
            })
          );

        this.dispatchAction(
          updateTxFlow({
            id: instanceId,
            txFlow: getTxFlow(detail),
          })
        );
      });

      instance.spiClient.TransactionUpdateMessage = ({ Data }: Any) => {
        this.dispatchAction(
          updateTxMessage({
            id: instanceId,
            txMessage: {
              decryptedJson: '',
              displayMessageCode: Data?.display_message_code,
              displayMessageText: Data?.display_message_text,
              posCounter: '',
              posRefId: Data?.pos_ref_id,
            },
          })
        );
      };

      // set up pre-auth instance
      instance.spiPreAuth = instance.spiClient.EnablePreauth();

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

  getCurrentStatus(instanceId: string): string {
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

  // * Purchase related operations *

  spiCancelTransaction(instanceId: string) {
    const spi = this.readTerminalInstance(instanceId).spiClient;
    spi.CancelTransaction();
  }

  spiSetTerminalToIdle(instanceId: string) {
    const spi = this.readTerminalInstance(instanceId).spiClient;
    spi.AckFlowEndedAndBackToIdle();
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
    const spi = this.setSpiConfig(instanceId);
    const options = this.setCustomReceipts();

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
    const spi = this.setSpiConfig(instanceId);
    const options = this.setCustomReceipts();
    const { suppressMerchantPassword } = this.state.receiptConfig;
    return spi.InitiateMotoPurchaseTx(posRefId, purchaseAmount, surchargeAmount, suppressMerchantPassword, options);
  }

  initiateCashoutOnlyTxTransaction(
    instanceId: string,
    posRefId: string,
    purchaseAmount: number,
    surchargeAmount: number
  ): void {
    const spi = this.setSpiConfig(instanceId);
    const options = this.setCustomReceipts();
    return spi.InitiateCashoutOnlyTx(posRefId, purchaseAmount, surchargeAmount, options);
  }

  initiateRefundTxTransaction(instanceId: string, posRefId: string, refundAmount: number): void {
    const spi = this.setSpiConfig(instanceId);
    const options = this.setCustomReceipts();
    const { suppressMerchantPassword } = this.state.receiptConfig;
    return spi.InitiateRefundTx(posRefId, refundAmount, suppressMerchantPassword, options);
  }

  initiateAccountVerify(instanceId: string, posRefId: string): void {
    const preAuth = this.setPreAuthConfig(instanceId);
    return preAuth.InitiateAccountVerifyTx(posRefId);
  }

  initiatePreAuthOpen(instanceId: string, posRefId: string, preAuthAmount: number): void {
    const preAuth = this.setPreAuthConfig(instanceId);
    const options = this.setCustomReceipts();
    return preAuth.InitiateOpenTx(posRefId, preAuthAmount, options);
  }

  initiatePreAuthTopup(instanceId: string, posRefId: string, preAuthId: string, preAuthAmount: number): void {
    const preAuth = this.setPreAuthConfig(instanceId);
    const options = this.setCustomReceipts();
    return preAuth.InitiateTopupTx(posRefId, preAuthId, preAuthAmount, options);
  }

  initiatePreAuthReduce(instanceId: string, posRefId: string, preAuthId: string, preAuthAmount: number): void {
    const preAuth = this.setPreAuthConfig(instanceId);
    const options = this.setCustomReceipts();
    return preAuth.InitiatePartialCancellationTx(posRefId, preAuthId, preAuthAmount, options);
  }

  initiatePreAuthExtend(instanceId: string, posRefId: string, preAuthId: string): void {
    const preAuth = this.setPreAuthConfig(instanceId);
    const options = this.setCustomReceipts();
    return preAuth.InitiateExtendTx(posRefId, preAuthId, options);
  }

  initiatePreAuthCompletion(
    instanceId: string,
    posRefId: string,
    preAuthId: string,
    preAuthAmount: number,
    surchargeAmount: number
  ): void {
    const preAuth = this.setPreAuthConfig(instanceId);
    const options = this.setCustomReceipts();
    return preAuth.InitiateCompletionTx(posRefId, preAuthId, preAuthAmount, surchargeAmount, options);
  }

  initiatePreAuthCancel(instanceId: string, posRefId: string, preAuthId: string): void {
    const preAuth = this.setPreAuthConfig(instanceId);
    const options = this.setCustomReceipts();
    return preAuth.InitiateCancelTx(posRefId, preAuthId, options);
  }

  initTxSettlement(instanceId: string, posRefId: string) {
    const spi = this.setSpiConfig(instanceId);
    const options = this.setCustomReceipts();
    return spi.InitiateSettleTx(posRefId, options);
  }

  initTxSettlementEnquiry(instanceId: string, posRefId: string) {
    const spi = this.setSpiConfig(instanceId);
    const options = this.setCustomReceipts();
    return spi.InitiateSettlementEnquiry(posRefId, options);
  }

  signatureForApprove(instanceId: string) {
    const spi = this.setSpiConfig(instanceId);
    return spi.AcceptSignature(true);
  }

  signatureForDecline(instanceId: string) {
    const spi = this.setSpiConfig(instanceId);
    return spi.AcceptSignature(false);
  }
}

const spiService = new SpiService();

export { spiService as default };
