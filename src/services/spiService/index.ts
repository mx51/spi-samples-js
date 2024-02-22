import {
  BillRetrievalResult,
  BillStatusResponse,
  GetOpenTablesResponse,
  OpenTablesEntry,
  Spi as SpiClient,
  SpiStatus,
  SuccessState,
  TransactionOptions,
} from '@mx51/spi-client-js';
import dayjs from 'dayjs';
import { commonPairErrorMessage, spiEvents } from '../../definitions/constants/commonConfigs';
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
  updateTxFlowWithSideEffect,
  updateTxMessage,
} from '../../redux/reducers/TerminalSlice/terminalsSlice';
import { store } from '../../redux/store';
import { getLocalStorage, setLocalStorage, getTxFlow } from '../../utils/common/spi/common';
import SpiEventTarget from '../../utils/common/spi/eventTarget';
import { localStorageKeys, posVersion } from '../../utils/constants';

import { ITerminal, ITerminals } from '../interfaces';
import {
  addPaymentToTable,
  closeTable,
  lockTable,
  unlockTable,
} from '../../redux/reducers/PayAtTableSlice/payAtTableSlice';
import { TxLogService } from '../txLogService';

declare global {
  interface Window {
    Spi: Any;
  }
}

export interface PayAtTableConfig {
  payAtTableEnabled: boolean;
  operatorIdEnabled: boolean;
  splitByAmountEnabled: boolean;
  equalSplitEnabled: boolean;
  tableRetrievalEnabled: boolean;
  tippingEnabled: boolean;
  summaryReportEnabled: boolean;
  labelPayButton: string;
  labelOperatorId: string;
  labelTableId: string;
  allowedOperatorIds: string[];
}

export const initialPatConfig: PayAtTableConfig = {
  payAtTableEnabled: false,
  operatorIdEnabled: false,
  splitByAmountEnabled: false,
  equalSplitEnabled: false,
  tableRetrievalEnabled: false,
  tippingEnabled: false,
  summaryReportEnabled: false,
  labelPayButton: '',
  labelOperatorId: '',
  labelTableId: '',
  allowedOperatorIds: [],
};

class SpiService {
  state: { receiptConfig: Any; patConfig: PayAtTableConfig };

  dispatchAction: Any; // redux dispatch action

  print: Console = console;

  terminals: ITerminals = {};

  /**
   *
   */
  constructor() {
    this.state = {
      receiptConfig: (() => {
        const receiptConfigString = getLocalStorage(localStorageKeys.receiptConfig);
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
      patConfig: (() => {
        const patConfig = getLocalStorage(localStorageKeys.patConfig);
        return typeof patConfig === 'string' ? JSON.parse(patConfig) : initialPatConfig;
      })(),
    };
  }

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

  updatePatConfig(config: PayAtTableConfig) {
    Object.keys(this.terminals).forEach((terminalId) => {
      const terminal = this.terminals[terminalId];
      if (terminal.spiPat) {
        terminal.spiPat.Config.PayAtTableEnabled = config.payAtTableEnabled;
        terminal.spiPat.Config.OperatorIdEnabled = config.operatorIdEnabled;
        terminal.spiPat.Config.SplitByAmountEnabled = config.splitByAmountEnabled;
        terminal.spiPat.Config.EqualSplitEnabled = config.equalSplitEnabled;
        terminal.spiPat.Config.TableRetrievalEnabled = config.tableRetrievalEnabled;
        terminal.spiPat.Config.TippingEnabled = config.tippingEnabled;
        terminal.spiPat.Config.SummaryReportEnabled = config.summaryReportEnabled;
        terminal.spiPat.Config.LabelPayButton = config.labelPayButton;
        terminal.spiPat.Config.LabelOperatorId = config.labelOperatorId;
        terminal.spiPat.Config.LabelTableId = config.labelTableId;
        terminal.spiPat.Config.AllowedOperatorIds = config.allowedOperatorIds;
        terminal.spiPat.PushPayAtTableConfig();

        this.state.patConfig = config;
        setLocalStorage(localStorageKeys.patConfig, JSON.stringify(config));
      }
    });
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
      this.updateTerminalStorage(instanceId, 'status', SpiStatus.PairedConnecting);
      this.updateTerminalStorage(instanceId, 'reconnecting', true);

      if (!autoAddress) this.updateTerminalStorage(instanceId, 'deviceAddress', deviceAddress);

      // instantiate spi library
      instance.spiClient = new SpiClient(posId, serialNumber, deviceAddress, secrets);
      instance.spiPat = instance.spiClient.EnablePayAtTable();

      instance.spiPat.GetBillStatus = (
        billId: string,
        tableId: string,
        operatorId: string,
        paymentFlowStarted: boolean
      ) => {
        const { tables } = store.getState().payAtTable;
        const table = tables.find((t) => String(t.tableId) === tableId || t.billId === billId);

        if (!table || (table.locked && paymentFlowStarted)) {
          // We need more status in the BillRetrievalResult enum but this will do for now.
          return new BillStatusResponse({ Result: BillRetrievalResult.INVALID_TABLE_ID });
        }

        if (operatorId && table.operatorId && table.operatorId !== operatorId) {
          return Object.assign(new BillStatusResponse(), {
            Result: BillRetrievalResult.INVALID_OPERATOR_ID,
            OutstandingAmount: table.outStandingAmount,
            TotalAmount: table.totalAmount,
          });
        }

        if (paymentFlowStarted) {
          this.dispatchAction(lockTable(table.tableId));
        }

        return new BillStatusResponse({
          Result: BillRetrievalResult.SUCCESS,
          BillId: table.billId,
          TableId: tableId,
          OperatorId: operatorId,
          TotalAmount: table.totalAmount,
          OutstandingAmount: table.outStandingAmount,
          BillData: table.bill.billData,
        });
      };

      instance.spiPat.BillPaymentReceived = (billPayment: Any, billData: string) => {
        const { tables } = store.getState().payAtTable;
        const table = tables.find((t) => t.billId === billPayment.BillId);

        if (!table) {
          return new BillStatusResponse({ Result: BillRetrievalResult.INVALID_BILL_ID });
        }

        const terminalRefId = billPayment.PurchaseResponse._m.Data.terminal_ref_id;

        // Terminal RefId need to be unique, so ignore if we already processed a payment with this refId
        if (table.bill.payments.some((payment) => payment.terminalRefId === terminalRefId)) {
          return new BillStatusResponse({
            Result: BillRetrievalResult.SUCCESS,
            OutstandingAmount: table.outStandingAmount,
            TotalAmount: table.totalAmount,
          });
        }

        const {
          PaymentType,
          PurchaseAmount,
          SurchargeAmount,
          TipAmount,
          _incomingAdvice: {
            PosId,
            Data: { payment_details },
          },
        } = billPayment;
        const outstandingAmount = table.outStandingAmount - PurchaseAmount;

        this.dispatchAction(
          addPaymentToTable({
            tableId: table.tableId,
            payment: {
              paymentType: PaymentType,
              purchaseAmount: PurchaseAmount,
              surchargeAmount: SurchargeAmount,
              tipAmount: TipAmount,
              terminalRefId,
            },
            billData,
          })
        );

        if (outstandingAmount === 0) {
          this.dispatchAction(closeTable(table.tableId));
        }

        TxLogService.saveAndDeleteYesterdayTx({
          amountCents: PurchaseAmount,
          purchaseAmount: PurchaseAmount,
          tipAmount: TipAmount,
          surchargeAmount: SurchargeAmount,
          bankCashAmount: 0,
          successState: SuccessState.Success,
          completedTime: dayjs().unix() * 1000,
          hostResponseText: 'APPROVED',
          posId: PosId,
          posRefId: payment_details.terminal_ref_id,
          receipt: payment_details.merchant_receipt ?? '',
          tid: payment_details.terminal_id,
          mid: payment_details.merchant_id ?? '',
          total: PurchaseAmount + TipAmount + SurchargeAmount,
          type: 'Purchase',
          transactionType: 'PURCHASE',
          source: 'Pay At Table',
        });

        return new BillStatusResponse({
          Result: BillRetrievalResult.SUCCESS,
          OutstandingAmount: outstandingAmount,
          TotalAmount: table.totalAmount,
        });
      };
      instance.spiPat.BillPaymentFlowEnded = (message: Any) => {
        const { tables } = store.getState().payAtTable;
        const table = tables.find((t) => t.tableId === message.TableId || t.billId === message.BillId);

        if (table) {
          this.dispatchAction(unlockTable(table.tableId));
        }
      };
      instance.spiPat.GetOpenTables = (operatorId?: string): GetOpenTablesResponse =>
        new GetOpenTablesResponse(
          store
            .getState()
            .payAtTable.tables.filter((table) => !operatorId || !table.operatorId || operatorId === table.operatorId)
            .map(
              (table) =>
                new OpenTablesEntry({
                  TableId: String(table.tableId),
                  Label: table.label,
                  BillOutstandingAmount: table.outStandingAmount,
                })
            )
        );

      // Setup PAT
      if (this.state.patConfig.payAtTableEnabled) {
        instance.spiPat.Config.PayAtTableEnabled = this.state.patConfig.payAtTableEnabled;
        instance.spiPat.Config.OperatorIdEnabled = this.state.patConfig.operatorIdEnabled;
        instance.spiPat.Config.SplitByAmountEnabled = this.state.patConfig.splitByAmountEnabled;
        instance.spiPat.Config.EqualSplitEnabled = this.state.patConfig.equalSplitEnabled;
        instance.spiPat.Config.TableRetrievalEnabled = this.state.patConfig.tableRetrievalEnabled;
        instance.spiPat.Config.TippingEnabled = this.state.patConfig.tippingEnabled;
        instance.spiPat.Config.SummaryReportEnabled = this.state.patConfig.summaryReportEnabled;
        instance.spiPat.Config.LabelPayButton = this.state.patConfig.labelPayButton;
        instance.spiPat.Config.LabelOperatorId = this.state.patConfig.labelOperatorId;
        instance.spiPat.Config.LabelTableId = this.state.patConfig.labelTableId;
        instance.spiPat.Config.AllowedOperatorIds = this.state.patConfig.allowedOperatorIds;
        instance.spiPat.PushPayAtTableConfig();
      }

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
        if (status === SpiStatus.PairedConnected) {
          instance.spiClient.AckFlowEndedAndBackToIdle();

          const { txFlow } = store.getState().terminals[instanceId];
          if (txFlow?.override) {
            instance.spiClient.InitiateGetTx(txFlow?.posRefId);
          } else if (txFlow?.finished && txFlow?.success === SuccessState.Unknown) {
            instance.spiClient.InitiateRecovery(txFlow.posRefId, txFlow.type);
          }
        }

        if (status === SpiStatus.Unpaired) this.removeTerminalInstance(instanceId);

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
          txMessage: null, // not available during pair terminal stage
        };

        // after terminal paired and when page refreshed, update terminal status
        if (instance.spiClient._currentStatus === SpiStatus.PairedConnected) {
          this.dispatchAction(updatePairingStatus({ id: instanceId, status: SpiStatus.PairedConnected }));
          instance.spiClient.GetTerminalStatus(); // for trigger to call TerminalStatusResponse()
        } else {
          this.dispatchAction(updatePairingStatus({ id: instanceId, status: SpiStatus.Unpaired }));
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
        if (detail?.Finished) {
          instance.spiClient.AckFlowEndedAndBackToIdle();
        }

        // when Response Data available, update transaction flow response data
        if (detail?.Response?.Data) {
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
          this.dispatchAction(
            updateTxFlowSettlementResponse({
              id: instanceId,
              receipt,
            })
          );
        }

        this.dispatchAction(
          updateTxFlowWithSideEffect({
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
    this.dispatchAction(updatePairingStatus({ id: instanceId, status: SpiStatus.Unpaired }));
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
      this.getCurrentStatus(instanceId) === SpiStatus.PairedConnected &&
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

  initiateGetTransaction(instanceId: string, posRefId: string) {
    const spi = this.setSpiConfig(instanceId);
    return spi.InitiateGetTx(posRefId);
  }
}

const spiService = new SpiService();
spiService.start(store.dispatch);

export { spiService as default };
