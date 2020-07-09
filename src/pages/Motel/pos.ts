import { Spi, Secrets, TransactionType, SpiFlow, SpiStatus } from '@mx51/spi-client-js';
import { accountVerify, pairing, preAuth, terminalStatus, transactionFlow } from '../../services';
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
class MotelPos extends Pos {
  private _log: Console;
  private _receipt: Logger;
  private _flowMsg: Logger;
  private _spi: Spi;
  private _spiPreauth: any;
  private _posId: string;
  private _eftposAddress: string;
  private _spiSecrets?: any;
  private _version?: string | null;
  private _serialNumber?: string;
  private _rcptFromEftpos: boolean;
  private _sigFlowFromEftpos: boolean;
  private _printMerchantCopy: boolean;

  constructor(log: Console, receipt: Logger, flowMsg: Logger) {
    super();
    this._log = log;
    this._receipt = receipt;
    this._flowMsg = flowMsg;

    this._spi = null;
    this._spiPreauth = null;
    this._posId = 'MOTELPOS1';
    this._eftposAddress = '192.168.1.1';
    this._spiSecrets = null;
    this._version = getSpiVersion();
    this._serialNumber = '';
    this._rcptFromEftpos = false;
    this._sigFlowFromEftpos = false;
    this._printMerchantCopy = false;

    this.PrintStatusAndActions = this.PrintStatusAndActions.bind(this);
  }

  Start() {
    this._log.info('Starting MotelPos...');
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

    this._spiPreauth = this._spi.EnablePreauth();
    this._spi.Start();

    // And Now we just accept user input and display to the user what is happening.

    this._flowMsg.Clear();
    this._flowMsg.Info('# Welcome to MotelPos !');

    this.PrintStatusAndActions();
    this.AcceptUserInput();
  }

  PrintStatusAndActions() {
    this.PrintFlowInfo();
    this.PrintActions();
    pairing.printPairingStatus(this._flowMsg, this._spi);
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

        if (txState.Finished) {
          switch (txState.Type) {
            case TransactionType.Preauth:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, preAuth, txState);
              break;
            case TransactionType.AccountVerify:
              Pos.processCompletedEvent(this._flowMsg, this._receipt, accountVerify, txState);
              break;
            default:
              this._flowMsg.Info(`# CAN'T HANDLE TX TYPE: ${txState.Type}`);
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
              'eftpos_address',
              'pair',
              'pos_id',
              'rcpt_from_eftpos',
              'save_settings',
              'sig_flow_from_eftpos'
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
        // we give user the option of changing IP address, just in case the EFTPOS got a new one in the meanwhile
        inputsEnabled.push('eftpos_address', 'rcpt_from_eftpos', 'save_settings', 'sig_flow_from_eftpos');
      // but otherwise we give the same options as PairedConnected     // goto case SpiStatus.PairedConnected
      // caution: intentionally falls through
      case SpiStatus.PairedConnected:
        switch (this._spi.CurrentFlow) {
          case SpiFlow.Idle: // Paired, Idle
            inputsEnabled.push(
              'amount_input',
              'surcharge_input',
              'preauth_ref_input',
              'save_settings',

              'acct_verify',
              'preauth_open',
              'preauth_topup',
              'preauth_topdown',
              'preauth_extend',
              'preauth_complete',
              'preauth_cancel',

              'unpair',
              'rcpt_from_eftpos',
              'sig_flow_from_eftpos',
              'print_merchant_copy'
            );
            break;
          case SpiFlow.Transaction: // Paired, Transaction
            if (this._spi.CurrentTxFlowState.AwaitingSignatureCheck) {
              inputsEnabled.push('tx_sign_accept', 'tx_sign_decline');
            }

            if (!this._spi.CurrentTxFlowState.Finished && !this._spi.CurrentTxFlowState.AttemptingToCancel) {
              inputsEnabled.push('tx_cancel');
            }

            if (this._spi.CurrentTxFlowState.Finished) {
              inputsEnabled.push('ok');
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
      const inputEl = document.getElementById(input);
      if (!inputEl) throw new Error(`Input element not found to enable: ${input}`);
      (inputEl as HTMLInputElement).disabled = false;
    });

    this._flowMsg.Info();
  }

  AcceptUserInput() {
    this.addUiOperation('#save_settings', 'click', () => {
      if (this._spi.CurrentStatus === SpiStatus.Unpaired && this._spi.CurrentFlow === SpiFlow.Idle) {
        this._posId = Pos.getElementValue('#pos_id');
        this._eftposAddress = Pos.getElementValue('#eftpos_address');

        this._spi.SetPosId(this._posId);
        this._spi.SetEftposAddress(this._eftposAddress);

        localStorage.setItem('pos_id', this._posId);
        localStorage.setItem('eftpos_address', this._eftposAddress);
        this._log.info(`Saved settings ${this._posId}:${this._eftposAddress}`);
      }

      this._spiPreauth.Config.EnabledPromptForCustomerCopyOnEftpos = Pos.getElementCheckboxValue('#rcpt_from_eftpos');
      this._spiPreauth.Config.EnabledSignatureFlowOnEftpos = Pos.getElementCheckboxValue('#sig_flow_from_eftpos');
      this._spiPreauth.Config.EnabledPrintMerchantCopy = Pos.getElementCheckboxValue('#print_merchant_copy');

      localStorage.setItem('rcpt_from_eftpos', this._spiPreauth.Config.EnabledPromptForCustomerCopyOnEftpos);
      localStorage.setItem('sig_flow_from_eftpos', this._spiPreauth.Config.EnabledSignatureFlowOnEftpos);
      localStorage.setItem('print_merchant_copy', this._spiPreauth.Config.EnabledPrintMerchantCopy);

      pairing.printPairingStatus(this._flowMsg, this._spi);
    });

    this.addUiOperation('#pair', 'click', () => pairing.pair(this._spi));
    this.addUiOperation('#pair_confirm', 'click', () => pairing.pairingConfirmCode(this._spi));
    this.addUiOperation('#pair_cancel', 'click', () => pairing.pairingCancel(this._spi));
    this.addUiOperation('#unpair', 'click', () => pairing.unpair(this._spi));

    this.addUiOperation('#acct_verify', 'click', () =>
      accountVerify.initiateAccountVerify(this._flowMsg, this._spiPreauth)
    );

    this.addUiOperation('#preauth_open', 'click', () =>
      preAuth.initiatePreauthOpen(this._flowMsg, this._spiPreauth, Pos.getElementNumberValue('#amount'))
    );
    this.addUiOperation('#preauth_topup', 'click', () =>
      preAuth.initiatePreauthIncrease(
        this._flowMsg,
        this._spiPreauth,
        Pos.getElementNumberValue('#amount'),
        Pos.getElementValue('#preauth_ref')
      )
    );
    this.addUiOperation('#preauth_topdown', 'click', () =>
      preAuth.initiatePreauthDecrease(
        this._flowMsg,
        this._spiPreauth,
        Pos.getElementNumberValue('#amount'),
        Pos.getElementValue('#preauth_ref')
      )
    );
    this.addUiOperation('#preauth_extend', 'click', () =>
      preAuth.initiatePreauthExtension(this._flowMsg, this._spiPreauth, Pos.getElementValue('#preauth_ref'))
    );
    this.addUiOperation('#preauth_cancel', 'click', () =>
      preAuth.initiatePreauthCancellation(this._flowMsg, this._spiPreauth, Pos.getElementValue('#preauth_ref'))
    );
    this.addUiOperation('#preauth_complete', 'click', () =>
      preAuth.initiatePreauthCompletion(
        this._flowMsg,
        this._spiPreauth,
        Pos.getElementNumberValue('#amount'),
        Pos.getElementNumberValue('#surcharge'),
        Pos.getElementValue('#preauth_ref')
      )
    );

    this.addUiOperation('#tx_sign_accept', 'click', () => transactionFlow.acceptSignature(this._spi));
    this.addUiOperation('#tx_sign_decline', 'click', () => transactionFlow.declineSignature(this._spi));
    this.addUiOperation('#tx_cancel', 'click', () => transactionFlow.cancelTransaction(this._spi));

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
    this._printMerchantCopy = localStorage.getItem('print_merchant_copy') === 'true' || false;
    (document.getElementById('print_merchant_copy') as HTMLInputElement).checked = this._printMerchantCopy;

    if (localStorage.getItem('EncKey') && localStorage.getItem('HmacKey')) {
      this._spiSecrets = new Secrets(localStorage.getItem('EncKey'), localStorage.getItem('HmacKey'));
    }
  }
}

export { MotelPos as default };
