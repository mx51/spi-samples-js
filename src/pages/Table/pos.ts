import {
  BillPaymentFlowEndedResponse,
  BillRetrievalResult,
  BillStatusResponse,
  GetOpenTablesResponse,
  OpenTablesEntry,
  Secrets,
  Spi,
  SpiFlow,
  SpiStatus,
  TransactionType,
} from '@mx51/spi-client-js';
import Bill from '../../services/_common/bill';
import { pairing, purchase, refund, settlement, terminalStatus, transactionFlow } from '../../services';
import Pos from '../../services/_common/pos';
import { getSpiVersion } from '../../services/_common/uiHelpers';

import '../style.scss';

// <summary>
// NOTE: THIS PROJECT USES THE latest verion of the SPI Client Library
//
// This is your POS. To integrate with SPI, you need to instantiate a Spi object
// and interact with it.
//
// Primarily you need to implement 3 things.
// 1. Settings Screen
// 2. Pairing Flow Screen
// 3. Transaction Flow screen
//
// To see logs from spi, check the console
// </summary>
class TablePos extends Pos {
  private _log: Console;
  private _receipt: Logger;
  private _flowMsg: Logger;
  private _spi: Spi;
  private _pat: any;
  private _posId: string;
  private _eftposAddress: string;
  private _spiSecrets?: any;
  private _version?: string | null;
  private _serialNumber?: string;
  private _rcptFromEftpos: boolean;
  private _sigFlowFromEftpos: boolean;
  private _printMerchantCopy: boolean;

  private billsStore: any;
  private tableToBillMapping: any;
  private assemblyBillDataStore: any;
  private _isActionFlow: boolean;

  constructor(log: Console, receipt: Logger, flowMsg: Logger) {
    super();
    this._log = log;
    this._receipt = receipt;
    this._flowMsg = flowMsg;

    this._spi = null;
    this._posId = 'TABLEPOS1';
    this._eftposAddress = '192.168.1.1';
    this._spiSecrets = null;
    this._version = getSpiVersion();
    this._serialNumber = '';
    this._rcptFromEftpos = false;
    this._sigFlowFromEftpos = false;
    this._printMerchantCopy = false;

    // My Bills Store.
    // Key = BillId
    // Value = Bill
    this.billsStore = {};

    // Lookup dictionary of table -> current order
    // Key = TableId
    // Value = BillId
    this.tableToBillMapping = {};

    // Assembly Payments Integration asks us to persist some data on their behalf
    // So that the eftpos terminal can recover state.
    // Key = BillId
    // Value = Assembly Payments Bill Data
    this.assemblyBillDataStore = {};

    this._pat = null;

    this._isActionFlow = false;

    this.PrintStatusAndActions = this.PrintStatusAndActions.bind(this);
  }

  Start() {
    this._log.info('Starting TablePos...');
    this.LoadPersistedState();

    // region Spi Setup
    // This is how you instantiate Spi.
    this._spi = new Spi(this._posId, this._serialNumber, this._eftposAddress, this._spiSecrets); // It is ok to not have the secrets yet to start with.
    this._spi.Config.PromptForCustomerCopyOnEftpos = this._rcptFromEftpos;
    this._spi.Config.SignatureFlowOnEftpos = this._sigFlowFromEftpos;
    this._spi.Config.PrintMerchantCopy = this._printMerchantCopy;

    this._spi.SetPosInfo('assembly', this._version);

    document.addEventListener('StatusChanged', (e: SpiEvent) =>
      terminalStatus.onSpiStatusChanged(this._flowMsg, this.PrintStatusAndActions, e.detail)
    );
    document.addEventListener('PairingFlowStateChanged', () =>
      terminalStatus.onPairingFlowStateChanged(this._flowMsg, this.PrintStatusAndActions)
    );
    document.addEventListener('SecretsChanged', (e: SpiEvent) => terminalStatus.onSecretsChanged(this._log, e.detail));
    document.addEventListener('TxFlowStateChanged', () =>
      terminalStatus.onTxFlowStateChanged(this._flowMsg, this.PrintStatusAndActions)
    );

    this._spi.PrintingResponse = (message: Message) =>
      terminalStatus.handlePrintingResponse(this._flowMsg, this._spi, message, this.PrintStatusAndActions);
    this._spi.TerminalStatusResponse = (message: Message) =>
      terminalStatus.handleTerminalStatusResponse(this._flowMsg, this._spi, message, this.PrintStatusAndActions);
    this._spi.BatteryLevelChanged = (message: Message) =>
      terminalStatus.handleBatteryLevelChanged(
        this._flowMsg,
        this._log,
        this._spi,
        message,
        this.PrintStatusAndActions
      );

    this._pat = this._spi.EnablePayAtTable();
    this.EnablePayAtTableConfigs();
    this._pat.GetBillStatus = this.getBillDetails;
    this._pat.BillPaymentReceived = this.billPaymentReceived;
    this._pat.BillPaymentFlowEnded = this.billPaymentFlowEnded;
    this._pat.GetOpenTables = this.getOpenTables;

    this._spi.Start();

    // And Now we just accept user input and display to the user what is happening.

    this._flowMsg.Clear();
    this._flowMsg.Info('# Welcome to TablePos !');

    this.PrintStatusAndActions();
  }

  EnablePayAtTableConfigs() {
    if (localStorage.getItem('pat_config')) {
      const savedPatConfig = JSON.parse(localStorage.getItem('pat_config') || '');
      this._pat.Config.PayAtTableEnabled = savedPatConfig.PayAtTableEnabled;
      this._pat.Config.OperatorIdEnabled = savedPatConfig.OperatorIdEnabled;
      this._pat.Config.EqualSplitEnabled = savedPatConfig.EqualSplitEnabled;
      this._pat.Config.SplitByAmountEnabled = savedPatConfig.SplitByAmountEnabled;
      this._pat.Config.TippingEnabled = savedPatConfig.TippingEnabled;
      this._pat.Config.SummaryReportEnabled = savedPatConfig.SummaryReportEnabled;
      this._pat.Config.AllowedOperatorIds = savedPatConfig.AllowedOperatorIds;
      this._pat.Config.LabelOperatorId = savedPatConfig.LabelOperatorId;
      this._pat.Config.LabelTableId = savedPatConfig.LabelTableId;
      this._pat.Config.LabelPayButton = savedPatConfig.LabelPayButton;
      this._pat.Config.TableRetrievalEnabled = savedPatConfig.TableRetrievalEnabled;
    }

    (document.getElementById('pat_enabled') as HTMLInputElement).checked = this._pat.Config.PayAtTableEnabled;
    (document.getElementById('operatorid_enabled') as HTMLInputElement).checked = this._pat.Config.OperatorIdEnabled;
    (document.getElementById('equal_split') as HTMLInputElement).checked = this._pat.Config.EqualSplitEnabled;
    (document.getElementById('split_by_amount') as HTMLInputElement).checked = this._pat.Config.SplitByAmountEnabled;
    (document.getElementById('tipping') as HTMLInputElement).checked = this._pat.Config.TippingEnabled;
    (document.getElementById('summary_report') as HTMLInputElement).checked = this._pat.Config.SummaryReportEnabled;
    (document.getElementById(
      'set_allowed_operatorid'
    ) as HTMLInputElement).value = this._pat.Config.AllowedOperatorIds.join(',');
    (document.getElementById('set_label_operatorid') as HTMLInputElement).value = this._pat.Config.LabelOperatorId;
    (document.getElementById('set_label_tableid') as HTMLInputElement).value = this._pat.Config.LabelTableId;
    (document.getElementById('set_label_paybutton') as HTMLInputElement).value = this._pat.Config.LabelPayButton;
    (document.getElementById(
      'table_retrieval_enabled'
    ) as HTMLInputElement).checked = this._pat.Config.TableRetrievalEnabled;
  }

  PrintStatusAndActions() {
    this.PrintFlowInfo();
    this.PrintActions();
    this.PrintPairingStatus();
  }

  PrintFlowInfo() {
    switch (this._spi.CurrentFlow) {
      case SpiFlow.Pairing: {
        pairing.handlePairingUpdate(this._flowMsg, this._spi.CurrentPairingFlowState);
        break;
      }
      case SpiFlow.Transaction: {
        const txState = this._spi.CurrentTxFlowState;
        transactionFlow.handleTransaction(this._flowMsg, txState);

        if (txState.Finished) {
          switch (txState.Type) {
            case TransactionType.Purchase:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, purchase, txState);
              break;
            case TransactionType.Refund:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, refund, txState);
              break;
            case TransactionType.Settle:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, settlement, txState);
              break;
            default:
              this._flowMsg.Error(`# CAN'T HANDLE TX TYPE: ${txState.Type}`);
              break;
          }
        }
        break;
      }
      default:
    }
  }

  PrintActions() {
    // List of input controls which are enabled / shown for the current application state
    // let inputsEnabled = [];
    const statusEl = document.getElementById('status_indicator') as HTMLElement;
    const primaryStatusEl = document.getElementById('primary_status') as HTMLElement;
    const flowStatusEl = document.getElementById('flow_status') as HTMLElement;
    const flowStatusHeading = document.getElementById('flow_status_heading') as HTMLElement;
    // let actionForm = document.getElementById('action-form');
    // let pairingForm = document.getElementById('pairing-form');
    const actionSubmitButton = document.getElementById('submit_action') as HTMLButtonElement;
    const cancelActionButton = document.getElementById('cancel_action') as HTMLButtonElement;
    const actionInputGroups = document.querySelectorAll('#action-inputs .input-field-group');
    const currentActionHeading = document.getElementById('current-action-heading') as HTMLElement;

    statusEl.dataset.status = this._spi.CurrentStatus;
    statusEl.dataset.flow = this._spi.CurrentFlow;
    primaryStatusEl.innerText = this._spi.CurrentStatus;
    flowStatusEl.innerText = this._spi.CurrentFlow;
    flowStatusHeading.innerText = this._spi.CurrentFlow;

    const isUnpaired = this._spi.CurrentStatus === SpiStatus.Unpaired;
    const isPairedConnecting = this._spi.CurrentStatus === SpiStatus.PairedConnecting;
    const isPairedConnected = this._spi.CurrentStatus === SpiStatus.PairedConnected;

    const isIdleFlow = this._spi.CurrentFlow === SpiFlow.Idle;
    const isTransactionFlow = this._spi.CurrentFlow === SpiFlow.Transaction;
    const isPairingFlow = this._spi.CurrentFlow === SpiFlow.Pairing;

    // Configure buttons and related inputs
    const buttons = [
      {
        id: 'save_settings',
        enabled: (isUnpaired && isIdleFlow) || isPairedConnecting || (isPairedConnected && isIdleFlow),
        onClick: () => {
          if (isUnpaired && isIdleFlow) {
            this._posId = Pos.getElementValue('#pos_id');
            this._eftposAddress = Pos.getElementValue('#eftpos_address');

            this._spi.SetPosId(this._posId);
            this._spi.SetEftposAddress(this._eftposAddress);

            localStorage.setItem('pos_id', this._posId);
            localStorage.setItem('eftpos_address', this._eftposAddress);
          }

          if (isIdleFlow) {
            // Print config
            this._spi.Config.PrintMerchantCopy = Pos.getElementCheckboxValue('#print_merchant_copy');
            this._spi.Config.PromptForCustomerCopyOnEftpos = Pos.getElementCheckboxValue('#rcpt_from_eftpos');
            this._spi.Config.SignatureFlowOnEftpos = Pos.getElementCheckboxValue('#sig_flow_from_eftpos');

            localStorage.setItem('print_merchant_copy', this._spi.Config.PrintMerchantCopy);
            localStorage.setItem('rcpt_from_eftpos', this._spi.Config.PromptForCustomerCopyOnEftpos);
            localStorage.setItem('sig_flow_from_eftpos', this._spi.Config.SignatureFlowOnEftpos);

            // PAT config
            this._pat.Config.PayAtTableEnabled = Pos.getElementCheckboxValue('#pat_enabled');
            this._pat.Config.OperatorIdEnabled = Pos.getElementCheckboxValue('#operatorid_enabled');
            this._pat.Config.EqualSplitEnabled = Pos.getElementCheckboxValue('#equal_split');
            this._pat.Config.SplitByAmountEnabled = Pos.getElementCheckboxValue('#split_by_amount');
            this._pat.Config.TippingEnabled = Pos.getElementCheckboxValue('#tipping');
            this._pat.Config.SummaryReportEnabled = Pos.getElementCheckboxValue('#summary_report');
            this._pat.Config.AllowedOperatorIds = Pos.getElementValue('#set_allowed_operatorid').split(',');
            this._pat.Config.LabelOperatorId = Pos.getElementValue('#set_label_operatorid');
            this._pat.Config.LabelTableId = Pos.getElementValue('#set_label_tableid');
            this._pat.Config.LabelPayButton = Pos.getElementValue('#set_label_paybutton');
            this._pat.Config.TableRetrievalEnabled = Pos.getElementCheckboxValue('#table_retrieval_enabled');

            if (isPairedConnected) {
              this._pat.PushPayAtTableConfig();
            }

            localStorage.setItem('pat_config', JSON.stringify(this._pat.Config));
          }

          this._log.info(`Saved settings ${this._posId}:${this._eftposAddress}`);

          this.PrintPairingStatus();
        },
        inputs: [],
      },
      {
        id: 'pat_all_enable',
        enabled: isIdleFlow,
        onClick: () => {
          const payAtTableConfig = {
            PayAtTableEnabled: true,
            OperatorIdEnabled: true,
            AllowedOperatorIds: [1],
            EqualSplitEnabled: true,
            SplitByAmountEnabled: true,
            SummaryReportEnabled: true,
            TippingEnabled: true,
            LabelOperatorId: 'Operator ID',
            LabelPayButton: 'Pay at Table',
            LabelTableId: 'Table Number',
            TableRetrievalEnabled: true,
          };

          localStorage.setItem('pat_config', JSON.stringify(payAtTableConfig));
          this.EnablePayAtTableConfigs();
          this._pat.PushPayAtTableConfig();
        },
        inputs: [],
      },
      {
        id: 'pair',
        enabled: isUnpaired && isIdleFlow,
        onClick: () => pairing.pair(this._spi),
        inputs: [],
      },
      {
        id: 'pair_confirm',
        enabled: isPairingFlow && this._spi.CurrentPairingFlowState.AwaitingCheckFromEftpos,
        onClick: () => pairing.pairingConfirmCode(this._spi),
        inputs: [],
      },
      {
        id: 'pair_cancel',
        enabled: isPairingFlow,
        onClick: () => pairing.pairingCancel(this._spi),
        inputs: [],
      },
      {
        id: 'unpair',
        enabled: !isUnpaired && isIdleFlow,
        onClick: () => pairing.unpair(this._spi),
        inputs: [],
      },
      {
        id: 'purchase',
        enabled: isPairedConnected && isIdleFlow,
        onSubmit: () =>
          purchase.initiatePurchase(
            this._flowMsg,
            {},
            this._spi,
            Pos.getElementNumberValue('#amount'),
            Pos.getElementNumberValue('#tip_amount'),
            Pos.getElementNumberValue('#cashout_amount'),
            Pos.getElementNumberValue('#surcharge_amount'),
            Pos.getElementCheckboxValue('#prompt_for_cash')
          ),
        inputs: ['amount'],
      },
      {
        id: 'refund',
        enabled: isPairedConnected && isIdleFlow,
        onSubmit: () =>
          refund.initiateRefund(
            this._flowMsg,
            this._spi,
            Pos.getElementNumberValue('#amount'),
            Pos.getElementCheckboxValue('#suppress_merchant_password')
          ),
        inputs: ['amount'],
      },
      {
        id: 'settle',
        enabled: isPairedConnected && isIdleFlow,
        onClick: () => settlement.initiateSettlement(this._flowMsg, this._spi),
        inputs: [],
      },
      {
        id: 'tx_sign_accept',
        enabled: isTransactionFlow && this._spi.CurrentTxFlowState.AwaitingSignatureCheck,
        onClick: () => transactionFlow.acceptSignature(this._spi),
        inputs: [],
      },
      {
        id: 'tx_sign_decline',
        enabled: isTransactionFlow && this._spi.CurrentTxFlowState.AwaitingSignatureCheck,
        onClick: () => transactionFlow.declineSignature(this._spi),
        inputs: [],
      },
      {
        id: 'tx_cancel',
        enabled:
          isTransactionFlow && this._spi.CurrentTxFlowState.Finished && this._spi.CurrentTxFlowState.AttemptingToCancel,
        onClick: () => transactionFlow.cancelTransaction(this._spi),
        inputs: [],
      },
      {
        id: 'ok',
        enabled:
          (isPairingFlow && this._spi.CurrentPairingFlowState.Finished) ||
          (isTransactionFlow && this._spi.CurrentTxFlowState.Finished),
        onClick: () => transactionFlow.acknowledgeCompletion(this._flowMsg, this._spi, this.PrintStatusAndActions),
        inputs: [],
      },
      {
        // start a new bill for table
        id: 'open',
        enabled: isPairedConnected && isIdleFlow,
        onSubmit: () =>
          this.openTable(
            Pos.getElementValue('#table_number'),
            Pos.getElementValue('#operator_id'),
            Pos.getElementValue('#label'),
            Pos.getElementCheckboxValue('#locked')
          ),
        inputs: ['table_number', 'operator_id', 'label', 'locked'],
      },
      {
        // add $amount to the bill of table #
        id: 'add',
        enabled: isPairedConnected && isIdleFlow,
        onSubmit: () => this.addToTable(Pos.getElementValue('#table_number'), Pos.getElementNumberValue('#amount')),
        inputs: ['table_number', 'amount'],
      },
      {
        // close table
        id: 'close',
        enabled: isPairedConnected && isIdleFlow,
        onSubmit: () => this.closeTable(Pos.getElementValue('#table_number')),
        inputs: ['table_number'],
      },
      {
        // Lock/Unlock table
        id: 'lock',
        enabled: isPairedConnected && isIdleFlow,
        onSubmit: () => this.lockTable(Pos.getElementValue('#table_number'), Pos.getElementCheckboxValue('#locked')),
        inputs: ['table_number', 'locked'],
      },
      {
        // list open tables
        id: 'tables',
        enabled: isPairedConnected && isIdleFlow,
        onClick: this.printTables,
        inputs: [],
      },
      {
        // print current bill for table
        id: 'table',
        enabled: isPairedConnected && isIdleFlow,
        onSubmit: () => this.printTable(Pos.getElementValue('#table_number')),
        inputs: ['table_number'],
      },
      {
        // print bill with ID
        id: 'bill',
        enabled: isPairedConnected && isIdleFlow,
        onSubmit: () => this.printBill(Pos.getElementValue('#bill_id')),
        inputs: ['bill_id'],
      },
    ];

    // Hide action inputs
    actionInputGroups.forEach((inputGroup) => {
      inputGroup.classList.add('hidden');
    });

    buttons.forEach((button) => {
      const buttonElement = document.getElementById(button.id) as HTMLButtonElement;

      buttonElement.disabled = !button.enabled;

      // If this button requires additional input
      if (button.inputs && button.inputs.length) {
        buttonElement.onclick = () => {
          // Show relevant inputs for this action
          button.inputs.forEach((input) => {
            const inputElement = document.getElementById(input) as HTMLInputElement;
            const inputGroupElement = document.querySelector(`#action-inputs [data-id="${input}"]`);

            (inputGroupElement as HTMLElement).classList.remove('hidden');
            inputElement.required = true;
          });

          this._isActionFlow = true;
          actionSubmitButton.onclick = () => {
            (button as any).onSubmit();
            this._isActionFlow = false;

            actionInputGroups.forEach((inputGroup) => {
              inputGroup.classList.add('hidden');
            });

            actionSubmitButton.classList.add('hidden');
            cancelActionButton.classList.add('hidden');
            currentActionHeading.innerText = '';
          };

          actionSubmitButton.classList.remove('hidden');
          cancelActionButton.classList.remove('hidden');
          currentActionHeading.innerText = buttonElement.innerText;
        };
      } else {
        (buttonElement as any).onclick = button.onClick;
        actionSubmitButton.classList.add('hidden');
      }
    });

    cancelActionButton.onclick = () => {
      this._isActionFlow = false;

      actionInputGroups.forEach((inputGroup) => {
        inputGroup.classList.add('hidden');
      });

      actionSubmitButton.classList.add('hidden');
      cancelActionButton.classList.add('hidden');
      currentActionHeading.innerText = '';
    };

    this._flowMsg.Info();
  }

  PrintPairingStatus() {
    this._flowMsg.Info(`# --------------- STATUS ------------------`);
    this._flowMsg.Info(`# ${this._posId} <-> Eftpos: ${this._eftposAddress} #`);
    this._flowMsg.Info(`# SPI STATUS: ${this._spi.CurrentStatus}     FLOW: ${this._spi.CurrentFlow} #`);
    this._flowMsg.Info(`# SPI CONFIG: ${JSON.stringify(this._spi.Config)}`);
    this._flowMsg.Info('# ----------------TABLES-------------------');
    this._flowMsg.Info(`#    Open Tables: ${Object.keys(this.tableToBillMapping).length}`);
    this._flowMsg.Info(`# Bills in Store: ${Object.keys(this.billsStore).length}`);
    this._flowMsg.Info(`# Assembly Bills: ${Object.keys(this.assemblyBillDataStore).length}`);
    this._flowMsg.Info(`# -----------------------------------------`);
    this._flowMsg.Info(`# POS: v${this._version} Spi: v${Spi.GetVersion()}`);
  }

  LoadPersistedState() {
    if (localStorage.getItem('pos_id')) {
      this._posId = localStorage.getItem('pos_id') || '';
      (document.getElementById('pos_id') as HTMLInputElement).value = this._posId;
    } else {
      this._posId = Pos.getElementValue('#pos_id');
    }

    if (localStorage.getItem('eftpos_address')) {
      this._eftposAddress = localStorage.getItem('eftpos_address') || '';
      (document.getElementById('eftpos_address') as HTMLInputElement).value = this._eftposAddress;
    } else {
      this._eftposAddress = Pos.getElementValue('#eftpos_address');
    }

    this._printMerchantCopy = localStorage.getItem('print_merchant_copy') === 'true' || false;
    (document.getElementById('print_merchant_copy') as HTMLInputElement).checked = this._printMerchantCopy;
    this._rcptFromEftpos = localStorage.getItem('rcpt_from_eftpos') === 'true' || false;
    (document.getElementById('rcpt_from_eftpos') as HTMLInputElement).checked = this._rcptFromEftpos;
    this._sigFlowFromEftpos = localStorage.getItem('sig_flow_from_eftpos') === 'true' || false;
    (document.getElementById('sig_flow_from_eftpos') as HTMLInputElement).checked = this._sigFlowFromEftpos;

    if (localStorage.getItem('EncKey') && localStorage.getItem('HmacKey')) {
      this._spiSecrets = new Secrets(localStorage.getItem('EncKey'), localStorage.getItem('HmacKey'));
    }

    this.tableToBillMapping = JSON.parse(localStorage.getItem('tableToBillMapping') || '{}');
    this.assemblyBillDataStore = JSON.parse(localStorage.getItem('assemblyBillDataStore') || '{}');
    const savedBillData = JSON.parse(localStorage.getItem('billsStore') || '{}');

    Object.keys(savedBillData).forEach((bill) => {
      this.billsStore[bill] = Object.assign(new Bill(), savedBillData[bill]);
    });
  }

  getBillDetails(billId: string, tableId: string, operatorId: string, paymentFlowStarted: boolean) {
    let retrievedBillId = billId;

    if (!retrievedBillId) {
      // We were not given a billId, just a tableId.
      // This means that we are being asked for the bill by its table number.

      // Let's see if we have it.
      if (!this.tableToBillMapping[tableId]) {
        // We didn't find a bill for this table.
        // We just tell the Eftpos that.
        return Object.assign(new BillStatusResponse(), { Result: BillRetrievalResult.INVALID_TABLE_ID });
      }

      // We have a billId for this Table.
      // Let's set it so we can retrieve it.
      retrievedBillId = this.tableToBillMapping[tableId];
    }

    if (!this.billsStore[retrievedBillId]) {
      // We could not find the billId that was asked for.
      // We just tell the Eftpos that.
      return Object.assign(new BillStatusResponse(), { Result: BillRetrievalResult.INVALID_BILL_ID });
    }

    const myBill = this.billsStore[retrievedBillId];

    if (this.billsStore[retrievedBillId].Locked && paymentFlowStarted) {
      this._log.info(`Table is Locked.`);
      return Object.assign(new BillStatusResponse(), { Result: BillRetrievalResult.INVALID_TABLE_ID });
    }

    this.billsStore[retrievedBillId].Locked = paymentFlowStarted;

    const response = Object.assign(new BillStatusResponse(), {
      Result: BillRetrievalResult.SUCCESS,
      BillId: retrievedBillId,
      TableId: tableId,
      OperatorId: operatorId,
      TotalAmount: myBill.TotalAmount,
      OutstandingAmount: myBill.OutstandingAmount,
    });

    const billData = this.assemblyBillDataStore[retrievedBillId];

    response.BillData = billData;
    return response;
  }

  // <param name="billPayment"></param>
  // <param name="updatedBillData"></param>
  billPaymentReceived(billPayment: any, updatedBillData: any) {
    if (!this.billsStore[billPayment.BillId]) {
      // We cannot find this bill.
      return Object.assign(new BillStatusResponse(), { Result: BillRetrievalResult.INVALID_BILL_ID });
    }

    this._flowMsg.Info(
      `# Got a ${billPayment.PaymentType} Payment against bill ${billPayment.BillId} for table ${billPayment.TableId}`
    );
    const bill = this.billsStore[billPayment.BillId];
    bill.OutstandingAmount -= billPayment.PurchaseAmount;
    bill.tippedAmount += billPayment.TipAmount;
    bill.SurchargeAmount += billPayment.SurchargeAmount;
    bill.Locked = bill.OutstandingAmount !== 0;

    this._flowMsg.Info(`Updated Bill: ${JSON.stringify(bill)}`);

    // Here you can access other data that you might want to store from this payment, for example the merchant receipt.
    // billPayment.PurchaseResponse.GetMerchantReceipt();

    // It is important that we persist this data on behalf of assembly.
    this.assemblyBillDataStore[billPayment.BillId] = updatedBillData;

    this.saveBillState();

    return Object.assign(new BillStatusResponse(), {
      Result: BillRetrievalResult.SUCCESS,
      OutstandingAmount: bill.OutstandingAmount,
      TotalAmount: bill.TotalAmount,
    });
  }

  billPaymentFlowEnded(message: any) {
    const billPaymentFlowEndedResponse = new BillPaymentFlowEndedResponse(message);

    if (!this.billsStore[billPaymentFlowEndedResponse.BillId]) {
      // We cannot find this bill.
      this._flowMsg.Info(`Incorrect Bill Id!`);
      return;
    }

    const myBill = this.billsStore[billPaymentFlowEndedResponse.BillId];
    myBill.Locked = false;

    this._flowMsg.Info(`
            Bill Id                : ${billPaymentFlowEndedResponse.BillId}
            Table                  : ${billPaymentFlowEndedResponse.TableId}
            Operator Id            : ${billPaymentFlowEndedResponse.OperatorId}
            Bill OutStanding Amount: ${(billPaymentFlowEndedResponse.BillOutstandingAmount / 100.0).toFixed(2)}
            Bill Total Amount      : ${(billPaymentFlowEndedResponse.BillTotalAmount / 100.0).toFixed(2)}
            Card Total Count       : ${billPaymentFlowEndedResponse.CardTotalCount}
            Card Total Amount      : ${billPaymentFlowEndedResponse.CardTotalAmount}
            Cash Total Count       : ${billPaymentFlowEndedResponse.CashTotalCount}
            Cash Total Amount      : ${billPaymentFlowEndedResponse.CashTotalAmount}
            Locked                 : ${myBill.Locked}`);
  }

  getOpenTables(operatorId: string) {
    const openTableList: any = [];
    let isOpenTables = false;

    if (Object.keys(this.tableToBillMapping).length > 0) {
      Object.keys(this.tableToBillMapping).forEach((tableId) => {
        const item = this.tableToBillMapping[tableId];

        if (this.billsStore[item].OperatorId === operatorId && this.billsStore[item].OutstandingAmount > 0) {
          if (!isOpenTables) {
            this._flowMsg.Info(`#    Open Tables: `);
            isOpenTables = true;
          }

          const openTablesItem = Object.assign(new OpenTablesEntry(), {
            TableId: tableId,
            Label: this.billsStore[item].Label,
            BillOutstandingAmount: this.billsStore[item].OutstandingAmount,
          });

          this._flowMsg.Info(
            `Table Id : ${tableId}, Bill Id: ${this.billsStore[item].BillId}, Outstanding Amount: $${(
              this.billsStore[item].OutstandingAmount / 100
            ).toFixed(2)}`
          );
          openTableList.push(openTablesItem);
        }
      });
    }

    if (!isOpenTables) {
      this._flowMsg.Info(`# No Open Tables.`);
    }

    const openTableListJson = JSON.stringify(openTableList);

    return Object.assign(new GetOpenTablesResponse(), {
      TableData: openTableListJson,
    });
  }

  openTable(tableId: string, operatorId: string, label: string, locked = false) {
    if (this.tableToBillMapping[tableId]) {
      this._flowMsg.Info(`Table Already Open: ${JSON.stringify(this.billsStore[this.tableToBillMapping[tableId]])}`);
      return;
    }

    const newBill = Object.assign(new Bill(), {
      BillId: (Date.now() * 1000 + new Date().getMilliseconds()).toString(),
      TableId: tableId,
      OperatorId: operatorId,
      Label: label,
      Locked: locked,
    });
    this.billsStore[newBill.BillId] = newBill;
    this.tableToBillMapping[newBill.TableId] = newBill.BillId;

    if (!this._pat.Config.AllowedOperatorIds.includes(operatorId)) {
      this._pat.Config.AllowedOperatorIds.push(operatorId);
      (document.getElementById(
        'set_allowed_operatorid'
      ) as HTMLInputElement).value = this._pat.Config.AllowedOperatorIds.join(',');
      this._pat.PushPayAtTableConfig();
      localStorage.setItem('pat_config', JSON.stringify(this._pat.Config));
    }

    this.saveBillState();
    this._flowMsg.Info(`Opened: ${JSON.stringify(newBill)}`);
  }

  addToTable(tableId: string, amountCents: number) {
    if (!this.tableToBillMapping[tableId]) {
      this._flowMsg.Info('Table not Open.');
      return;
    }

    const bill = this.billsStore[this.tableToBillMapping[tableId]];
    if (bill.Locked) {
      this._flowMsg.Info('Table is Locked.');
      return;
    }

    bill.TotalAmount += amountCents;
    bill.OutstandingAmount += amountCents;
    this.saveBillState();
    this._flowMsg.Info(`Updated: ${JSON.stringify(bill)}`);
  }

  closeTable(tableId: string) {
    if (!this.tableToBillMapping[tableId]) {
      this._flowMsg.Info('Table not Open.');
      return;
    }
    const bill = this.billsStore[this.tableToBillMapping[tableId]];
    if (bill.Locked) {
      this._flowMsg.Info('Table is Locked.');
      return;
    }

    if (bill.OutstandingAmount > 0) {
      this._flowMsg.Info(`Bill not Paid Yet: ${JSON.stringify(bill)}`);
      return;
    }

    delete this.billsStore[this.tableToBillMapping[tableId]];
    delete this.tableToBillMapping[tableId];
    delete this.assemblyBillDataStore[bill.BillId];
    this.saveBillState();
    this._flowMsg.Info(`Closed: ${JSON.stringify(bill)}`);
  }

  lockTable(tableId: string, locked: boolean) {
    if (!this.tableToBillMapping[tableId]) {
      this._flowMsg.Info('Table not Open.');
      return;
    }
    const bill = this.billsStore[this.tableToBillMapping[tableId]];
    bill.Locked = locked;
    this.saveBillState();

    if (locked) {
      this._flowMsg.Info(`Locked: ${JSON.stringify(bill)}`);
    } else {
      this._flowMsg.Info(`UnLocked: ${JSON.stringify(bill)}`);
    }
  }

  printTable(tableId: string) {
    if (!this.tableToBillMapping[tableId]) {
      this._flowMsg.Info('Table not Open.');
      return;
    }
    this.printBill(this.tableToBillMapping[tableId]);
  }

  printTables() {
    if (Object.keys(this.tableToBillMapping).length > 0) {
      this._flowMsg.Info('# Open Tables: ');
      Object.keys(this.tableToBillMapping).forEach((table) => {
        this._flowMsg.Info(`# Table #${table}, Bill #${this.tableToBillMapping[table]}`);
      });
    } else {
      this._flowMsg.Info('# No Open Tables.');
    }

    if (Object.keys(this.billsStore).length > 0) {
      this._flowMsg.Info('# My Bills Store: ');

      Object.keys(this.billsStore).forEach((bill) => {
        this._flowMsg.Info(`# ${this.billsStore[bill].toString()}`);
      });
    }

    if (Object.keys(this.assemblyBillDataStore).length > 0) {
      this._flowMsg.Info(`# Assembly Bills Data: ${JSON.stringify(this.assemblyBillDataStore)}`);
    }
  }

  printBill(billId: string) {
    if (!this.billsStore[billId]) {
      this._flowMsg.Info('Bill Not Found.');
      return;
    }
    this._flowMsg.Info(`Bill: ${this.billsStore[billId].toString()}`);
  }

  static newBillId() {
    return (Date.now() * 1000 + new Date().getMilliseconds()).toString();
  }

  saveBillState() {
    localStorage.setItem('tableToBillMapping', JSON.stringify(this.tableToBillMapping));
    localStorage.setItem('billsStore', JSON.stringify(this.billsStore));
    localStorage.setItem('assemblyBillDataStore', JSON.stringify(this.assemblyBillDataStore));
  }
}

export { TablePos as default };
