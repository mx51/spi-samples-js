import { Spi, Secrets, TransactionType, SuccessState, SpiFlow, SpiStatus } from '@mx51/spi-client-js';
import {
  cashout,
  moto,
  pairing,
  purchase,
  refund,
  settlement,
  settlementEnquiry,
  terminalStatus,
  transactionFlow,
} from '../../services';
import Pos from '../../services/_common/pos';
import { getSpiVersion } from '../../services/_common/uiHelpers';

import '../legacyStyles.scss';

// <summary>
// NOTE: THIS PROJECT USES THE latest version of the SPI Client Library
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
// </summary>// <summary>
// NOTE: THIS PROJECT USES THE 2.1.x of the SPI Client Library
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
class KebabPos extends Pos {
  private _log: Console;
  private _receipt: Logger;
  private _flowMsg: Logger;
  private _spi: Spi;
  private _posId: string;
  private _eftposAddress: string;
  private _spiSecrets?: any;
  private _version?: string | null;
  private _rcptFromEftpos: boolean;
  private _sigFlowFromEftpos: boolean;

  constructor(log: Console, receipt: Logger, flowMsg: Logger) {
    super();
    this._log = log;
    this._receipt = receipt;
    this._flowMsg = flowMsg;

    this._spi = null;
    this._posId = 'KEBABPOS1';
    this._eftposAddress = '192.168.1.1';
    this._spiSecrets = null;
    this._version = getSpiVersion();
    this._rcptFromEftpos = false;
    this._sigFlowFromEftpos = false;

    this.PrintStatusAndActions = this.PrintStatusAndActions.bind(this);
  }

  Start() {
    this._log.info('Starting KebabPos...');
    this.LoadPersistedState();

    // region Spi Setup
    // This is how you instantiate Spi.
    this._spi = new Spi(this._posId, this._eftposAddress, this._spiSecrets); // It is ok to not have the secrets yet to start with.
    this._spi.Config.PromptForCustomerCopyOnEftpos = this._rcptFromEftpos;
    this._spi.Config.SignatureFlowOnEftpos = this._sigFlowFromEftpos;

    this._spi.SetPosInfo('mx51', this._version);

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

    this._spi.Start();

    // And Now we just accept user input and display to the user what is happening.

    this._flowMsg.Clear();
    this._flowMsg.Info('# Welcome to KebabPos !');

    this.PrintStatusAndActions();
    this.AcceptUserInput();
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

        if (txState.AwaitingSignatureCheck) {
          // We need to print the receipt for the customer to sign.
          this._flowMsg.Info(`# RECEIPT TO PRINT FOR SIGNATURE`);
          this._receipt.Info(txState.SignatureRequiredMessage.GetMerchantReceipt().trim());
        }

        if (txState.AwaitingPhoneForAuth) {
          this._flowMsg.Info(`# PHONE FOR AUTH DETAILS:`);
          this._flowMsg.Info(`# CALL: ${txState.PhoneForAuthRequiredMessage.GetPhoneNumber()}`);
          this._flowMsg.Info(`# QUOTE: Merchant Id: ${txState.PhoneForAuthRequiredMessage.GetMerchantId()}`);
        }

        if (txState.Finished) {
          switch (txState.Type) {
            case TransactionType.Purchase:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, purchase, txState);
              break;
            case TransactionType.Refund:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, refund, txState);
              break;
            case TransactionType.CashoutOnly:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, cashout, txState);
              break;
            case TransactionType.MOTO:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, moto, txState);
              break;
            case TransactionType.Settle:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, settlement, txState);
              break;
            case TransactionType.SettlementEnquiry:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, settlementEnquiry, txState);
              break;
            case TransactionType.GetLastTransaction:
              transactionFlow.handleGetLastTransaction(
                this._flowMsg,
                this._receipt,
                this._spi,
                txState,
                (document.getElementById('pos_ref_id') as HTMLInputElement).value
              );
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
    const inputsEnabled = [];
    const statusEl = document.getElementById('status_indicator') as HTMLElement;
    const primaryStatusEl = document.getElementById('primary_status') as HTMLElement;
    const flowStatusEl = document.getElementById('flow_status') as HTMLElement;
    const flowStatusHeading = document.getElementById('flow_status_heading') as HTMLElement;

    statusEl.dataset.status = this._spi.CurrentStatus;
    statusEl.dataset.flow = this._spi.CurrentFlow;
    primaryStatusEl.innerText = this._spi.CurrentStatus;
    flowStatusEl.innerText = this._spi.CurrentFlow;
    flowStatusHeading.innerText = this._spi.CurrentFlow;

    // Available Actions depend on the current status (Unpaired/PairedConnecting/PairedConnected)
    switch (this._spi.CurrentStatus) {
      case SpiStatus.Unpaired: // Unpaired...
        switch (this._spi.CurrentFlow) {
          case SpiFlow.Idle: // Unpaired, Idle
            inputsEnabled.push(
              'pos_id',
              'eftpos_address',
              'rcpt_from_eftpos',
              'sig_flow_from_eftpos',
              'pair',
              'save_settings'
            );
            break;

          case SpiFlow.Pairing: {
            // Unpaired, PairingFlow
            const pairingState = this._spi.CurrentPairingFlowState;
            if (pairingState.AwaitingCheckFromPos) {
              inputsEnabled.push('pair_confirm');
            }
            if (!pairingState.Finished) {
              inputsEnabled.push('pair_cancel');
            } else {
              inputsEnabled.push('ok');
            }
            break;
          }
          case SpiFlow.Transaction: // Unpaired, TransactionFlow - Should never be the case!
          default:
            this._log.info(`# .. Unexpected Flow .. ${this._spi.CurrentFlow}`);
            break;
        }
        break;
      case SpiStatus.PairedConnecting: // This is still considered as a Paired kind of state, but...
        // .. we give user the option of changing IP address, just in case the EFTPOS got a new one in the meanwhile
        inputsEnabled.push('eftpos_address', 'rcpt_from_eftpos', 'sig_flow_from_eftpos', 'save_settings');
      // .. but otherwise we give the same options as PairedConnected
      // goto case SpiStatus.PairedConnected;
      // caution: intentionally falls through

      case SpiStatus.PairedConnected:
        switch (this._spi.CurrentFlow) {
          case SpiFlow.Idle: // Paired, Idle
            inputsEnabled.push(
              'amount_input',
              'tip_amount_input',
              'cashout_amount_input',
              'prompt_for_cash',
              'pos_ref_id_input',
              'save_settings',

              'purchase',
              'moto',
              'refund',
              'cashout',
              'settle',
              'settle_enq',
              'recover',
              'unpair',
              'glt',
              'rcpt_from_eftpos',
              'sig_flow_from_eftpos'
            );
            break;
          case SpiFlow.Transaction: // Paired, Transaction
            if (this._spi.CurrentTxFlowState.AwaitingSignatureCheck) {
              inputsEnabled.push('tx_sign_accept', 'tx_sign_decline');
            }

            if (this._spi.CurrentTxFlowState.AwaitingPhoneForAuth) {
              inputsEnabled.push('tx_auth_code', 'auth_code_input');
            }

            if (!this._spi.CurrentTxFlowState.Finished && !this._spi.CurrentTxFlowState.AttemptingToCancel) {
              inputsEnabled.push('tx_cancel');
            } else {
              switch (this._spi.CurrentTxFlowState.Success) {
                case SuccessState.Success:
                  inputsEnabled.push('ok');
                  break;
                case SuccessState.Failed:
                  inputsEnabled.push('ok_cancel');
                  break;
                default:
                  // Unknown
                  inputsEnabled.push('ok_cancel');
                  break;
              }
            }
            break;
          case SpiFlow.Pairing: // Paired, Pairing - we have just finished the pairing flow. OK to ack.
            inputsEnabled.push('ok');
            break;
          default:
            this._log.info(`# .. Unexpected Flow .. ${this._spi.CurrentFlow}`);
            break;
        }
        break;

      default:
        this._log.info(`# .. Unexpected State .. ${this._spi.CurrentStatus}`);
        break;
    }

    // Configure buttons / inputs
    const inputs = document.querySelectorAll('.input');
    for (let i = 0; i < inputs.length; i += 1) {
      (inputs[i] as HTMLInputElement).disabled = true;
    }

    inputsEnabled.forEach((input) => {
      (document.getElementById(input) as HTMLInputElement).disabled = false;
    });

    this._flowMsg.Info();
  }

  PrintPairingStatus() {
    this._flowMsg.Info(`# --------------- STATUS ------------------`);
    this._flowMsg.Info(`# ${this._posId} <-> Eftpos: ${this._eftposAddress} #`);
    this._flowMsg.Info(`# SPI STATUS: ${this._spi.CurrentStatus}     FLOW: ${this._spi.CurrentFlow} #`);
    this._flowMsg.Info(`# SPI CONFIG: ${JSON.stringify(this._spi.Config)}`);
    this._flowMsg.Info(`# -----------------------------------------`);
    this._flowMsg.Info(`# POS: v${this._version} Spi: v${Spi.GetVersion()}`);
  }

  AcceptUserInput() {
    this.addUiOperation('#save_settings', 'click', () => {
      if (this._spi.CurrentStatus === SpiStatus.Unpaired && this._spi.CurrentFlow === SpiFlow.Idle) {
        this._posId = Pos.getElementValue('#pos_id');
        this._eftposAddress = Pos.getElementValue('eftpos_address');

        this._spi.SetPosId(this._posId);
        this._spi.SetEftposAddress(this._eftposAddress);

        localStorage.setItem('pos_id', this._posId);
        localStorage.setItem('eftpos_address', this._eftposAddress);
        this._log.info(`Saved settings ${this._posId}:${this._eftposAddress}`);
      }

      this._spi.Config.PromptForCustomerCopyOnEftpos = Pos.getElementCheckboxValue('#rcpt_from_eftpos');
      this._spi.Config.SignatureFlowOnEftpos = Pos.getElementCheckboxValue('#sig_flow_from_eftpos');

      localStorage.setItem('rcpt_from_eftpos', this._spi.Config.PromptForCustomerCopyOnEftpos);
      localStorage.setItem('sig_flow_from_eftpos', this._spi.Config.SignatureFlowOnEftpos);

      this.PrintPairingStatus();
    });

    this.addUiOperation('#pair', 'click', () => pairing.pair(this._spi));
    this.addUiOperation('#pair_confirm', 'click', () => pairing.pairingConfirmCode(this._spi));
    this.addUiOperation('#pair_cancel', 'click', () => pairing.pairingCancel(this._spi));
    this.addUiOperation('#unpair', 'click', () => pairing.unpair(this._spi));

    this.addUiOperation('#purchase', 'click', () =>
      purchase.initiatePurchase(
        this._flowMsg,
        {},
        this._spi,
        Pos.getElementNumberValue('#amount'),
        Pos.getElementNumberValue('#tip_amount'),
        Pos.getElementNumberValue('#cashout_amount'),
        Pos.getElementNumberValue('#surcharge_amount'),
        Pos.getElementCheckboxValue('#prompt_for_cash')
      )
    );

    this.addUiOperation('#refund', 'click', () =>
      refund.initiateRefund(
        this._flowMsg,
        this._spi,
        Pos.getElementNumberValue('#amount'),
        Pos.getElementCheckboxValue('#suppress_merchant_password')
      )
    );

    this.addUiOperation('#cashout', 'click', () =>
      cashout.initiateCashout(
        this._flowMsg,
        this._log,
        this._spi,
        Pos.getElementNumberValue('#cashout_amount'),
        Pos.getElementNumberValue('#surcharge_amount')
      )
    );

    this.addUiOperation('#moto', 'click', () =>
      moto.initiateMotoPurchase(
        this._flowMsg,
        this._spi,
        Pos.getElementNumberValue('#amount'),
        Pos.getElementNumberValue('#surcharge_amount'),
        Pos.getElementCheckboxValue('#suppress_merchant_password')
      )
    );

    this.addUiOperation('#settle', 'click', () => settlement.initiateSettlement(this._flowMsg, this._spi));
    this.addUiOperation('#settle_enq', 'click', () =>
      settlementEnquiry.initiateSettlementEnquiry(this._flowMsg, this._spi)
    );

    this.addUiOperation('#tx_sign_accept', 'click', () => transactionFlow.acceptSignature(this._spi));
    this.addUiOperation('#tx_sign_decline', 'click', () => transactionFlow.declineSignature(this._spi));
    this.addUiOperation('#tx_cancel', 'click', () => transactionFlow.cancelTransaction(this._spi));
    this.addUiOperation('#tx_auth_code', 'click', () =>
      transactionFlow.submitAuthCode(this._flowMsg, this._spi, Pos.getElementValue('#auth_code'))
    );

    this.addUiOperation('#recover', 'click', () =>
      transactionFlow.initiateRecovery(this._flowMsg, this._spi, Pos.getElementValue('#pos_ref_id'))
    );
    this.addUiOperation('#glt', 'click', () => transactionFlow.initiateGetLastTransaction(this._flowMsg, this._spi));

    this.addUiOperation('#ok', 'click', () =>
      transactionFlow.acknowledgeCompletion(this._flowMsg, this._spi, this.PrintStatusAndActions)
    );
    this.addUiOperation('#ok_cancel', 'click', () =>
      transactionFlow.acknowledgeCancellation(this._flowMsg, this._spi, this.PrintStatusAndActions)
    );
  }

  LoadPersistedState() {
    if (localStorage.getItem('pos_id')) {
      this._posId = localStorage.getItem('pos_id') || '';
      (document.getElementById('pos_id') as HTMLInputElement).value = this._posId;
    } else {
      this._posId = (document.getElementById('pos_id') as HTMLInputElement).value;
    }

    if (localStorage.getItem('eftpos_address')) {
      this._eftposAddress = localStorage.getItem('eftpos_address') || '';
      (document.getElementById('eftpos_address') as HTMLInputElement).value = this._eftposAddress;
    } else {
      this._eftposAddress = (document.getElementById('eftpos_address') as HTMLInputElement).value;
    }

    this._rcptFromEftpos = localStorage.getItem('rcpt_from_eftpos') === 'true' || false;
    (document.getElementById('rcpt_from_eftpos') as HTMLInputElement).checked = this._rcptFromEftpos;
    this._sigFlowFromEftpos = localStorage.getItem('sig_flow_from_eftpos') === 'true' || false;
    (document.getElementById('sig_flow_from_eftpos') as HTMLInputElement).checked = this._sigFlowFromEftpos;

    if (localStorage.getItem('EncKey') && localStorage.getItem('HmacKey')) {
      this._spiSecrets = new Secrets(localStorage.getItem('EncKey'), localStorage.getItem('HmacKey'));
    }
  }
}

export default KebabPos;
