import {
    Spi, 
    Logger, 
    Secrets, 
    TransactionType,
    RefundResponse,
    GetLastTransactionResponse,
    PurchaseResponse,
    Settlement,
    SuccessState,
    SpiFlow,
    SpiStatus} from '../lib/spi-client-js';

/// <summary>
/// This is your POS. To integrate with SPI, you need to instantiate a Spi object
/// and interact with it.
/// 
/// Primarily you need to implement 3 things.
/// 1. Settings Screen
/// 2. Pairing Flow Screen
/// 3. Transaction Flow screen
/// 
/// </summary>
class AcmePos {

    constructor(log, printer) {
        this._log       = log;
        this._printer   = printer;
    }

    Start() 
    {
        // This is where you load your state - like the pos_id, eftpos address and secrets - from your file system or database
        this.LoadPersistedState();

        // region Spi Setup
        // This is how you instantiate Spi.
        this._spi = new Spi(this._posId, this._eftposAddress, this._spiSecrets, this._log); // It is ok to not have the secrets yet to start with.
        document.addEventListener('StatusChanged', (e) => this.OnStatusChanged(e.detail)); // Called when Status changes between Unpaired, PairedConnected and PairedConnecting
        document.addEventListener('SecretsChanged', (e) => this.OnSecretsChanged(e.detail)); // Called when Secrets are set or changed or voided.
        document.addEventListener('PairingFlowStateChanged', (e) => this.OnPairingFlowStateChanged(e.detail)); // Called throughout to pairing process to update us with progress
        document.addEventListener('TxFlowStateChanged', (e) => this.OnTxFlowStateChanged(e.detail)); // Called throughout to transaction process to update us with progress
        this._spi.Start();

        // THIS LINE IS JUST a backdoor for testing
        this._spi._conn.SpiProtocol = localStorage.getItem('SpiProtocol') || SPI_PROTOCOL;
        // -------

        // Where to print out the receipts
        
        this._flow_msg = document.getElementById('flow_msg');

        // And Now we just accept user input and display to the user what is happening.

        this._log.Clear();
        this._log.Info("# ");
        this._log.Info(`# Howdy and welcome to ACME-POS! My name is ${this._posId}.`);
        this._log.Info("# I integrate with SPI.");
        this._log.Info("# ");

        this.PrintStatusAndActions();
        this.AcceptUserInput();
    }

    /// <summary>
    /// Called when we received a Status Update i.e. Unpaired/PairedConnecting/PairedConnected
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="spiStatus"></param>
    OnStatusChanged(spiStatus)
    {
        if (this._spi.CurrentFlow == SpiFlow.Idle) {
            this._log.Clear();
        }
        this.PrintStatusAndActions();
    }

    /// <summary>
    /// Called during the pairing process to let us know how it's going.
    /// We just update our screen with the information, and provide relevant Actions to the user.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="pairingFlowState"></param>
    OnPairingFlowStateChanged(pairingFlowState)
    {
        this._log.Clear();
        this._flow_msg.innerHTML = pairingFlowState.Message;
        if (pairingFlowState.ConfirmationCode)
        {
            this._log.Info(`# Confirmation Code: ${pairingFlowState.ConfirmationCode}`);    
        }
        this.PrintStatusAndActions();
    }


    /// <summary>
    /// Called during a transaction to let us know how it's going.
    /// We just update our screen with the information, and provide relevant Actions to the user.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="txFlowState"></param>
    OnTxFlowStateChanged(txFlowState)
    {
        this._log.Clear();
        this._flow_msg.innerHTML = txFlowState.DisplayMessage;
        this._log.Info(`# Id: ${txFlowState.Id}`);
        this._log.Info(`# Type: ${txFlowState.Type}`);
        this._log.Info(`# RequestSent: ${txFlowState.RequestSent}`);
        this._log.Info(`# WaitingForSignature: ${txFlowState.AwaitingSignatureCheck}`);
        this._log.Info(`# Attempting to Cancel : ${txFlowState.AttemptingToCancel}`);
        this._log.Info(`# Finished: ${txFlowState.Finished}`);
        this._log.Info(`# Outcome: ${txFlowState.Success}`);
        this._log.Info(`# Display Message: ${txFlowState.DisplayMessage}`);

        if (txFlowState.AwaitingSignatureCheck)
        {
            // We need to print the receipt for the customer to sign.
            var receipt = txFlowState.SignatureRequiredMessage.GetMerchantReceipt().trim();
            this._printer.print(receipt);
        }
        
        // If the transaction is finished, we take some extra steps.
        if (txFlowState.Finished)
        {
            if (txFlowState.Success == SuccessState.Unknown)
            {
                // TH-4T, TH-4N, TH-2T - This is the dge case when we can't be sure what happened to the transaction.
                // Invite the merchant to look at the last transaction on the EFTPOS using the dicumented shortcuts.
                // Now offer your merchant user the options to:
                // A. Retry the transaction from scratch or pay using a different method - If Merchant is confident that tx didn't go through.
                // B. Override Order as Paid in you POS - If Merchant is confident that payment went through.
                // C. Cancel out of the order all together - If the customer has left / given up without paying
                this._log.Info("");
                this._log.Info("# ##########################################################################");
                this._log.Info("# NOT SURE IF WE GOT PAID OR NOT. CHECK LAST TRANSACTION MANUALLY ON EFTPOS!");
                this._log.Info("# ##########################################################################");
            }
            else 
            {

                // We have a result...
                switch (txFlowState.Type)
                {
                    // Depending on what type of transaction it was, we might act diffeently or use different data.
                    case TransactionType.Purchase:
                        if (txFlowState.Success == SuccessState.Success)
                        {
                            // TH-6A
                            this._log.Info("");
                            this._log.Info("# ##########################################################################");
                            this._log.Info("# HOORAY WE GOT PAID (TH-7A). CLOSE THE ORDER!");
                            this._log.Info("# ##########################################################################");
                        }
                        else
                        {
                            // TH-6E
                            this._log.Info("");
                            this._log.Info("# ##########################################################################");
                            this._log.Info("# WE DIDN'T GET PAID. RETRY PAYMENT (TH-5R) OR GIVE UP (TH-5C)!");
                            this._log.Info("# ##########################################################################");
                        }

                        if (txFlowState.Response != null)
                        {
                            var purchaseResponse = new PurchaseResponse(txFlowState.Response);
                            this._log.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
                            this._log.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
                            this._log.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
                            this._log.Info(`# Error: ${txFlowState.Response.GetError()}`);
                            this._log.Info(`# Customer Receipt:`);
                            this._printer.print(purchaseResponse.GetCustomerReceipt().trim());
                        }
                        else
                        {
                            // We did not even get a response, like in the case of a time-out.
                        }
                        break;
                    case TransactionType.Refund:
                        if (txFlowState.Response != null)
                        {
                            var refundResponse = new RefundResponse(txFlowState.Response);
                            this._log.Info(`# Scheme: ${refundResponse.SchemeName}`);
                            this._log.Info(`# Response: ${refundResponse.GetResponseText()}`);
                            this._log.Info(`# RRN: ${refundResponse.GetRRN()}`);
                            this._log.Info(`# Error: ${txFlowState.Response.GetError()}`);
                            this._log.Info(`# Customer Receipt:`);
                            this._printer.print(refundResponse.GetCustomerReceipt().trim());
                        }
                        else
                        {
                            // We did not even get a response, like in the case of a time-out.
                        }
                        break;
                    case TransactionType.Settle:
                        if (txFlowState.Response != null)
                        {
                            var settleResponse = new Settlement(txFlowState.Response);
                            this._log.Info(`# Response: ${settleResponse.GetResponseText()}`);
                            this._log.Info(`# Error: ${txFlowState.Response.GetError()}`);
                            this._log.Info(`# Merchant Receipt:`);
                            this._printer.print(settleResponse.GetReceipt().trim());
                        }
                        else
                        {
                            // We did not even get a response, like in the case of a time-out.
                        }
                        break;
                    case TransactionType.GetLastTx:
                        if (txFlowState.Response != null)
                        {
                            var gltResponse = new GetLastTransactionResponse(txFlowState.Response);
                            this._log.Info("# Checking to see if it matches the $100.00 purchase we did 1 minute ago :)");
                            var success = this._spi.GltMatch(gltResponse, TransactionType.Purchase, 10000, Date.now() - 120000, "MYORDER123");
                            if (success == SuccessState.Unknown)
                            {
                                this._log.Info("# Did not retrieve Expected Transaction.");
                                this._printer.print(gltResponse.GetMerchantReceipt().trim());
                            }
                            else
                            {
                                this._log.Info("# Tx Matched Expected Purchase Request.");
                                this._log.Info("# Result: ", success);

                                var purchaseResponse = new PurchaseResponse(txFlowState.Response);
                                this._log.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
                                this._log.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
                                this._log.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
                                this._log.Info(`# Error: ${txFlowState.Response.GetError()}`);
                                this._log.Info(`# Customer Receipt:`);
                                this._printer.print(purchaseResponse.GetMerchantReceipt().trim());
                            }
                        }
                        else
                        {
                            // We did not even get a response, like in the case of a time-out.
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        
        // Let's show the user what options he has at this stage.
        this.PrintStatusAndActions();
    }
     
    /// <summary>
    /// Called when Secrets are set or changed or voided.
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="newSecrets"></param>
    OnSecretsChanged(newSecrets)
    {
        this._spiSecrets = newSecrets;
        if (this._spiSecrets != null)
        {
            console.info(`# --------- I GOT NEW SECRETS -----------`);
            console.info(`# ---------- PERSIST THEM SAFELY ----------`);
            console.info(`# ${this._spiSecrets.EncKey}:${this._spiSecrets.HmacKey}`);
            console.info(`# -----------------------------------------`);
            localStorage.setItem('EncKey', this._spiSecrets.EncKey);
            localStorage.setItem('HmacKey', this._spiSecrets.HmacKey);
        }
        else
        {
            console.info("# --------- THE SECRETS HAVE BEEN VOIDED -----------");
            console.info("# ---------- CONSIDER ME UNPAIRED ----------");
            console.info("# -----------------------------------------");
            localStorage.removeItem('EncKey');
            localStorage.removeItem('HmacKey');
        }

    }


    /// <summary>
    /// This method prints the current Spi Status and Flow
    /// and lists available actions to the user.
    /// </summary>
    PrintStatusAndActions()
    {
        // List of input controls which are enabled / shown for the current application state
        let inputsEnabled   = [];
        let statusEl        = document.getElementById('status_indicator');
        let primaryStatusEl = document.getElementById('primary_status');
        let flowStatusEl    = document.getElementById('flow_status');
        let flowStatusHeading = document.getElementById('flow_status_heading');

        statusEl.dataset['status']  = this._spi.CurrentStatus;
        statusEl.dataset['flow']    = this._spi.CurrentFlow;
        primaryStatusEl.innerText   = this._spi.CurrentStatus;
        flowStatusEl.innerText      = this._spi.CurrentFlow;
        flowStatusHeading.innerText = this._spi.CurrentFlow;

        // Available Actions depend on the current status (Unpaired/PairedConnecting/PairedConnected)
        switch (this._spi.CurrentStatus)
        {
            case SpiStatus.Unpaired: //Unpaired...
                switch (this._spi.CurrentFlow)
                {
                    case SpiFlow.Idle: // Unpaired, Idle
                        inputsEnabled.push('pos_id');
                        inputsEnabled.push('eftpos_address');
                        inputsEnabled.push('pair');
                        inputsEnabled.push('save_settings');
                        break;
                        
                    case SpiFlow.Pairing: // Unpaired, PairingFlow
                        var pairingState = this._spi.CurrentPairingFlowState;
                        if (pairingState.AwaitingCheckFromPos)
                        {
                            inputsEnabled.push('pair_confirm');
                        }
                        if (!pairingState.Finished)
                        {
                            inputsEnabled.push('pair_cancel');
                        }
                        else
                        {
                            inputsEnabled.push('ok');
                        }
                        break;
                        
                    case SpiFlow.Transaction: // Unpaired, TransactionFlow - Should never be the case!
                    default:
                        this._log.Info(`# .. Unexpected Flow .. ${this._spi.CurrentFlow}`);
                        break;
                }
                break;
            case SpiStatus.PairedConnecting: // This is still considered as a Paired kind of state, but...
                // .. we give user the option of changing IP address, just in case the EFTPOS got a new one in the meanwhile
                inputsEnabled.push('eftpos_address');
                inputsEnabled.push('save_settings');
                // .. but otherwise we give the same options as PairedConnected
                // goto case SpiStatus.PairedConnected;

            case SpiStatus.PairedConnected:
                switch (this._spi.CurrentFlow)
                {
                    case SpiFlow.Idle: // Paired, Idle
                        inputsEnabled.push('amount_input');
                        inputsEnabled.push('purchase');
                        inputsEnabled.push('refund');
                        inputsEnabled.push('settle');
                        inputsEnabled.push('unpair');
                        inputsEnabled.push('glt');
                        break;
                    case SpiFlow.Transaction: // Paired, Transaction
                        if (this._spi.CurrentTxFlowState.AwaitingSignatureCheck)
                        {
                            inputsEnabled.push('tx_sign_accept');
                            inputsEnabled.push('tx_sign_decline');
                        }
                        if (!this._spi.CurrentTxFlowState.Finished)
                        {
                            inputsEnabled.push('tx_cancel');
                        }
                        else
                        {
                            switch (this._spi.CurrentTxFlowState.Success) {
                                case SuccessState.Success:
                                    inputsEnabled.push('ok');
                                    break;
                                case SuccessState.Failed:
                                    inputsEnabled.push('ok_retry');
                                    inputsEnabled.push('ok_cancel');
                                    break;
                                default:
                                    // Unknown
                                    inputsEnabled.push('ok_override_paid');
                                    inputsEnabled.push('ok_retry');
                                    inputsEnabled.push('ok_cancel');
                                    break;
                            }
                        }
                        break;
                    case SpiFlow.Pairing: // Paired, Pairing - we have just finished the pairing flow. OK to ack.
                        inputsEnabled.push('ok');
                        break;
                    default:
                        this._log.Info(`# .. Unexpected Flow .. ${this._spi.CurrentFlow}`);
                        break;
                }
                break;


            default:
                this._log.Info(`# .. Unexpected State .. ${this._spi.CurrentStatus}`);
                break;
        }

        // Configure buttons / inputs
        let inputs = document.querySelectorAll('.input');
        for(let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }

        inputsEnabled.forEach((input) => {
            document.getElementById(input).disabled = false;
        });
    }

    AcceptUserInput()
    {
        document.getElementById('save_settings').addEventListener('click', () => {

            this._posId         = document.getElementById('pos_id').value;
            this._eftposAddress = document.getElementById('eftpos_address').value;

            this._spi.SetPosId(this._posId);
            this._spi.SetEftposAddress(this._eftposAddress);

            localStorage.setItem('pos_id', this._posId);
            localStorage.setItem('eftpos_address', this._eftposAddress);

            this._log.Info(`Saved settings ${this._posId}:${this._eftposAddress}`);
        });

        document.getElementById('pair').addEventListener('click', () => {
            this._spi.Pair();
        });

        document.getElementById('pair_confirm').addEventListener('click', () => {
            this._spi.PairingConfirmCode();
        });

        document.getElementById('pair_cancel').addEventListener('click', () => {
            this._spi.PairingCancel();
        });

        document.getElementById('unpair').addEventListener('click', () => {
            this._spi.Unpair();
        });

        document.getElementById('purchase').addEventListener('click', () => {
            this.doPurchase();
        });

        document.getElementById('refund').addEventListener('click', () => {
            let amount  = document.getElementById('amount').value;
            let rres    = this._spi.InitiateRefundTx(RequestIdHelper.Id("rfnd"), parseInt(amount,10));
            this._log.Info(rres.Initiated ? "# Refund Initiated. Will be updated with Progress." : `# Could not initiate refund: ${rres.Message}. Please Retry.`);
        });

        document.getElementById('settle').addEventListener('click', () => {
            let sres = this._spi.InitiateSettleTx(RequestIdHelper.Id("settle"));
            this._log.Info(sres.Initiated ? "# Settle Initiated. Will be updated with Progress." : `# Could not initiate settle: ${sres.Message}. Please Retry.`);
        });

        document.getElementById('glt').addEventListener('click', () => {
            let sres = this._spi.InitiateGetLastTx(RequestIdHelper.Id("glt"));
            this._log.Info(sres.Initiated ? "# GLT Initiated. Will be updated with Progress." : `# Could not initiate GLT: ${sres.Message}. Please Retry.`);
        });

        document.getElementById('tx_sign_accept').addEventListener('click', () => {
            this._spi.AcceptSignature(true);
        });

        document.getElementById('tx_sign_decline').addEventListener('click', () => {
            this._spi.AcceptSignature(false);
        });

        document.getElementById('tx_cancel').addEventListener('click', () => {
            this._spi.CancelTransaction();
        });

        document.getElementById('ok').addEventListener('click', () => {
            this._spi.AckFlowEndedAndBackToIdle();
            this._log.Clear();
            this._flow_msg.innerHTML = "Select from the options below";
            this.PrintStatusAndActions();
        });

        document.getElementById('ok_retry').addEventListener('click', () => {
            let txType = this._spi.CurrentTxFlowState.Type;
            this._spi.AckFlowEndedAndBackToIdle();
            this._log.Clear();

            if (txType == TransactionType.Purchase) {
                this.doPurchase();
            } else {
                 this._flow_msg.innerHTML = "Retry by selecting from the options below";
                this.PrintStatusAndActions();
            }
        });

        document.getElementById('ok_cancel').addEventListener('click', () => {
            this._spi.AckFlowEndedAndBackToIdle();
            this._log.Clear();
            this._flow_msg.innerHTML = "Order Cancelled";
            this.PrintStatusAndActions();
        });

        document.getElementById('ok_override_paid').addEventListener('click', () => {
            this._spi.AckFlowEndedAndBackToIdle();
            this._log.Clear();
            this._flow_msg.innerHTML = "Order Paid.";
            this.PrintStatusAndActions();
        });
    }

    doPurchase() {
        let amount = document.getElementById('amount').value;
        let pres = this._spi.InitiatePurchaseTx(RequestIdHelper.Id("prchs"), parseInt(amount, 10));
        this._log.Info(pres.Initiated ? `# Purchase Initiated. Will be updated with Progress.` : `# Could not initiate purchase: ${pres.Message}. Please Retry.`);
    }

    LoadPersistedState() {
        if(localStorage.getItem('pos_id')) {
            this._posId = localStorage.getItem('pos_id');
            document.getElementById('pos_id').value = this._posId;
        } else {
            this._posId = document.getElementById('pos_id').value;
        }

        if(localStorage.getItem('eftpos_address')) {
            this._eftposAddress = localStorage.getItem('eftpos_address');
            document.getElementById('eftpos_address').value = this._eftposAddress;
        } else {
            this._eftposAddress = document.getElementById('eftpos_address').value;
        }

        if(localStorage.getItem('EncKey') && localStorage.getItem('HmacKey')) {
            this._spiSecrets = new Secrets(localStorage.getItem('EncKey'), localStorage.getItem('HmacKey'));
        }
    }
}

/**
 * When our code has been loaded in the browser we initialize the app
 */
document.addEventListener('DOMContentLoaded', () => {

    try {
        let log     = new Logger(document.getElementById('log'));
        let printer = new Printer(document.getElementById('receipt_output'));
        let pos     = new AcmePos(log, printer);
        pos.Start();
    } catch(err) {
        console.error(err);
    }
});
