// <summary>
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
class KebabPos
{
    constructor(log, receipt, flow_msg) {
        this._spi = null;
        this._posId = "KEBABPOS1";
        this._eftposAddress = "192.168.1.1";
        this._spiSecrets = null;
        this._version = '2.1.0';
        this._rcpt_from_eftpos = false;
        this._sig_flow_from_eftpos = false;

        this._log = log;
        this._receipt = receipt;
        this._flow_msg = flow_msg;
    }

    Start()
    {
        this._log.info("Starting KebabPos...");
        this.LoadPersistedState();

        // region Spi Setup
        // This is how you instantiate Spi.
        this._spi = new Spi(this._posId, this._eftposAddress, this._spiSecrets); // It is ok to not have the secrets yet to start with.
        this._spi.Config.PromptForCustomerCopyOnEftpos = this._rcpt_from_eftpos;
        this._spi.Config.SignatureFlowOnEftpos = this._sig_flow_from_eftpos;

        document.addEventListener('StatusChanged', (e) => this.OnSpiStatusChanged(e.detail)); 
        document.addEventListener('PairingFlowStateChanged', (e) => this.OnPairingFlowStateChanged(e.detail)); 
        document.addEventListener('SecretsChanged', (e) => this.OnSecretsChanged(e.detail)); 
        document.addEventListener('TxFlowStateChanged', (e) => this.OnTxFlowStateChanged(e.detail)); 
        this._spi.Start();

        // And Now we just accept user input and display to the user what is happening.

        this._flow_msg.Clear();
        this._flow_msg.Info("# Welcome to KebabPos !");
        
        this.PrintStatusAndActions();
        this.AcceptUserInput();
    }

    OnTxFlowStateChanged(txState)
    {
        this._flow_msg.Clear();
        this.PrintStatusAndActions();
        this._flow_msg.Info("> ");
    }

    OnPairingFlowStateChanged(pairingFlowState)
    {
        this._flow_msg.Clear();
        this.PrintStatusAndActions();
        this._flow_msg.Info("> ");
    }

    OnSecretsChanged(secrets)
    {
        this._spiSecrets = secrets;
        if (secrets != null)
        {
            this._log.info(`# I Have Secrets: ${secrets.EncKey}${secrets.HmacKey}. Persist them Securely.`);
            localStorage.setItem('EncKey', secrets.EncKey);
            localStorage.setItem('HmacKey', secrets.HmacKey);
        }
        else
        {
            this._log.info(`# I Have Lost the Secrets, i.e. Unpaired. Destroy the persisted secrets.`);
            localStorage.removeItem('EncKey');
            localStorage.removeItem('HmacKey');
        }
    }

    /// <summary>
    /// Called when we received a Status Update i.e. Unpaired/PairedConnecting/PairedConnected
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="spiStatus"></param>
    OnSpiStatusChanged(spiStatus)
    {
        this._log.clear();
        this._log.info(`# --> SPI Status Changed: ${status.SpiStatus}`);
        this.PrintStatusAndActions();
    }

    PrintStatusAndActions()
    {
        this.PrintFlowInfo();

        this.PrintActions();

        this.PrintPairingStatus();
    }

    PrintFlowInfo()
    {
        switch (this._spi.CurrentFlow)
        {
            case SpiFlow.Pairing:
                var pairingState = this._spi.CurrentPairingFlowState;
                this._flow_msg.Info("### PAIRING PROCESS UPDATE ###");
                this._flow_msg.Info(`# ${pairingState.Message}`);
                this._flow_msg.Info(`# Finished? ${pairingState.Finished}`);
                this._flow_msg.Info(`# Successful? ${pairingState.Successful}`);
                this._flow_msg.Info(`# Confirmation Code: ${pairingState.ConfirmationCode}`);
                this._flow_msg.Info(`# Waiting Confirm from Eftpos? ${pairingState.AwaitingCheckFromEftpos}`);
                this._flow_msg.Info(`# Waiting Confirm from POS? ${pairingState.AwaitingCheckFromPos}`);
                break;

            case SpiFlow.Transaction:
                var txState = this._spi.CurrentTxFlowState;
                this._flow_msg.Info("### TX PROCESS UPDATE ###");
                this._flow_msg.Info(`# ${txState.DisplayMessage}`);
                this._flow_msg.Info(`# Id: ${txState.PosRefId}`);
                this._flow_msg.Info(`# Type: ${txState.Type}`);
                this._flow_msg.Info(`# Amount: ${txState.AmountCents / 100.0}`);
                this._flow_msg.Info(`# Waiting For Signature: ${txState.AwaitingSignatureCheck}`);
                this._flow_msg.Info(`# Attempting to Cancel : ${txState.AttemptingToCancel}`);
                this._flow_msg.Info(`# Finished: ${txState.Finished}`);
                this._flow_msg.Info(`# Success: ${txState.Success}`);

                if (txState.AwaitingSignatureCheck)
                {
                    // We need to print the receipt for the customer to sign.
                    this._flow_msg.Info(`# RECEIPT TO PRINT FOR SIGNATURE`);
                    this._flow_msg.Info(txState.SignatureRequiredMessage.GetMerchantReceipt().trim());
                }

                if (txState.AwaitingPhoneForAuth)
                {
                    this._flow_msg.Info(`# PHONE FOR AUTH DETAILS:`);
                    this._flow_msg.Info(`# CALL: ${txState.PhoneForAuthRequiredMessage.GetPhoneNumber()}`);
                    this._flow_msg.Info(`# QUOTE: Merchant Id: ${txState.PhoneForAuthRequiredMessage.GetMerchantId()}`);
                }

                if (txState.Finished)
                {
                    switch (txState.Type)
                    {
                        case TransactionType.Purchase:
                            this.HandleFinishedPurchase(txState);
                            break;
                        case TransactionType.Refund:
                            this.HandleFinishedRefund(txState);
                            break;
                        case TransactionType.CashoutOnly:
                            this.HandleFinishedCashout(txState);
                            break;
                        case TransactionType.MOTO:
                            this.HandleFinishedMoto(txState);
                            break;
                        case TransactionType.Settle:
                            this.HandleFinishedSettle(txState);
                            break;
                        case TransactionType.SettlementEnquiry:
                            this.HandleFinishedSettlementEnquiry(txState);
                            break;
                        case TransactionType.GetLastTransaction:
                            this.HandleFinishedGetLastTransaction(txState);
                            break;
                        default:
                            this._flow_msg.Error(`# CAN'T HANDLE TX TYPE: ${txState.Type}`);
                            break;
                    }
                }
                break;
            case SpiFlow.Idle:
                break;
        }
    }

    HandleFinishedPurchase(txState)
    {
        var purchaseResponse;
        switch (txState.Success)
        {
            case SuccessState.Success:
                this._flow_msg.Info(`# WOOHOO - WE GOT PAID!`);
                purchaseResponse = new PurchaseResponse(txState.Response);
                this._flow_msg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
                this._flow_msg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
                this._flow_msg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
                this._flow_msg.Info(`# Customer Receipt:`);
                this._flow_msg.Info(purchaseResponse.WasCustomerReceiptPrinted() ? purchaseResponse.GetCustomerReceipt().trim() : `# PRINTED FROM EFTPOS`);
                this._flow_msg.Info(`# PURCHASE: ${purchaseResponse.GetPurchaseAmount()}`);
                this._flow_msg.Info(`# TIP: ${purchaseResponse.GetTipAmount()}`);
                this._flow_msg.Info(`# CASHOUT: ${purchaseResponse.GetCashoutAmount()}`);
                this._flow_msg.Info(`# BANKED NON-CASH AMOUNT: ${purchaseResponse.GetBankNonCashAmount()}`);
                this._flow_msg.Info(`# BANKED CASH AMOUNT: ${purchaseResponse.GetBankCashAmount()}`);
                break;
            case SuccessState.Failed:
                this._flow_msg.Info(`# WE DID NOT GET PAID :(`);
                if (txState.Response != null)
                {
                    purchaseResponse = new PurchaseResponse(txState.Response);
                    this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
                    this._flow_msg.Info(`# Error Detail: ${txState.Response.GetErrorDetail()}`);
                    this._flow_msg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
                    this._flow_msg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
                    this._flow_msg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
                    this._flow_msg.Info(`# Customer Receipt:`);
                    this._flow_msg.Info(purchaseResponse.WasCustomerReceiptPrinted()
                        ? purchaseResponse.GetCustomerReceipt().trim()
                        : `# PRINTED FROM EFTPOS`);
                }
                break;
            case SuccessState.Unknown:
                this._flow_msg.Info(`# WE'RE NOT QUITE SURE WHETHER WE GOT PAID OR NOT :/`);
                this._flow_msg.Info(`# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.`);
                this._flow_msg.Info(`# IF YOU CONFIRM THAT THE CUSTOMER PAID, CLOSE THE ORDER.`);
                this._flow_msg.Info(`# OTHERWISE, RETRY THE PAYMENT FROM SCRATCH.`);
                break;
            default:
                throw new Error('Unknown transaction state');
        }
    }

    HandleFinishedRefund(txState)
    {
        var refundResponse;
        switch (txState.Success)
        {
            case SuccessState.Success:
                this._flow_msg.Info(`# REFUND GIVEN- OH WELL!`);
                refundResponse = new RefundResponse(txState.Response);
                this._flow_msg.Info(`# Response: ${refundResponse.GetResponseText()}`);
                this._flow_msg.Info(`# RRN: ${refundResponse.GetRRN()}`);
                this._flow_msg.Info(`# Scheme: ${refundResponse.SchemeName}`);
                this._flow_msg.Info(`# Customer Receipt:`);
                this._flow_msg.Info(!refundResponse.WasCustomerReceiptPrinted() ? refundResponse.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
                this._flow_msg.Info(`# REFUNDED AMOUNT: ${refundResponse.GetRefundAmount()}`);
                break;
            case SuccessState.Failed:
                this._flow_msg.Info(`# REFUND FAILED!`);
                this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
                this._flow_msg.Info(`# Error Detail: ${txState.Response.GetErrorDetail()}`);
                if (txState.Response != null)
                {
                    refundResponse = new RefundResponse(txState.Response);
                    this._flow_msg.Info(`# Response: ${refundResponse.GetResponseText()}`);
                    this._flow_msg.Info(`# RRN: ${refundResponse.GetRRN()}`);
                    this._flow_msg.Info(`# Scheme: ${refundResponse.SchemeName}`);
                    this._flow_msg.Info(`# Customer Receipt:`);
                    this._flow_msg.Info(!refundResponse.WasCustomerReceiptPrinted() ? refundResponse.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
                }
                break;
            case SuccessState.Unknown:
                this._flow_msg.Info("# WE'RE NOT QUITE SURE WHETHER THE REFUND WENT THROUGH OR NOT :/");
                this._flow_msg.Info("# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                this._flow_msg.Info("# YOU CAN THE TAKE THE APPROPRIATE ACTION.");
                break;
            default:
                throw new Error('Unknown transaction state');
        }
    }

    HandleFinishedCashout(txState)
    {
        var cashoutResponse;
        switch (txState.Success)
        {
            case SuccessState.Success:
                this._flow_msg.Info(`# CASH-OUT SUCCESSFUL - HAND THEM THE CASH!`);
                cashoutResponse = new CashoutOnlyResponse(txState.Response);
                this._flow_msg.Info(`# Response: ${cashoutResponse.GetResponseText()}`);
                this._flow_msg.Info(`# RRN: ${cashoutResponse.GetRRN()}`);
                this._flow_msg.Info(`# Scheme: ${cashoutResponse.SchemeName}`);
                this._flow_msg.Info(`# Customer Receipt:`);
                this._flow_msg.Info(!cashoutResponse.WasCustomerReceiptPrinted() ? cashoutResponse.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
                this._flow_msg.Info(`# CASHOUT: ${cashoutResponse.GetCashoutAmount()}`);
                this._flow_msg.Info(`# BANKED NON-CASH AMOUNT: ${cashoutResponse.GetBankNonCashAmount()}`);
                this._flow_msg.Info(`# BANKED CASH AMOUNT: ${cashoutResponse.GetBankCashAmount()}`);
                break;
            case SuccessState.Failed:
                this._flow_msg.Info(`# CASHOUT FAILED!`);
                this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
                this._flow_msg.Info(`# Error Detail: ${txState.Response.GetErrorDetail()}`);
                if (txState.Response != null)
                {
                    cashoutResponse = new CashoutOnlyResponse(txState.Response);
                    this._flow_msg.Info(`# Response: ${cashoutResponse.GetResponseText()}`);
                    this._flow_msg.Info(`# RRN: ${cashoutResponse.GetRRN()}`);
                    this._flow_msg.Info(`# Scheme: ${cashoutResponse.SchemeName}`);
                    this._flow_msg.Info(`# Customer Receipt:`);
                    this._flow_msg.Info(cashoutResponse.GetCustomerReceipt().trim());
                }
                break;
            case SuccessState.Unknown:
                this._flow_msg.Info(`# WE'RE NOT QUITE SURE WHETHER THE CASHOUT WENT THROUGH OR NOT :/`);
                this._flow_msg.Info(`# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.`);
                this._flow_msg.Info(`# YOU CAN THE TAKE THE APPROPRIATE ACTION.`);
                break;
            default:
                throw new Error('Unknown transaction state');
        }
    }

    HandleFinishedMoto(txState)
    {
        var motoResponse;
        var purchaseResponse;
        switch (txState.Success)
        {
            case SuccessState.Success:
                this._flow_msg.Info("# WOOHOO - WE GOT MOTO-PAID!");
                motoResponse = new MotoPurchaseResponse(txState.Response);
                purchaseResponse = motoResponse.PurchaseResponse;
                this._flow_msg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
                this._flow_msg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
                this._flow_msg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
                this._flow_msg.Info(`# Card Entry: ${purchaseResponse.GetCardEntry()}`);
                this._flow_msg.Info(`# Customer Receipt:`);
                this._flow_msg.Info(!purchaseResponse.WasCustomerReceiptPrinted() ? purchaseResponse.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
                this._flow_msg.Info(`# PURCHASE: ${purchaseResponse.GetPurchaseAmount()}`);
                this._flow_msg.Info(`# BANKED NON-CASH AMOUNT: ${purchaseResponse.GetBankNonCashAmount()}`);
                this._flow_msg.Info(`# BANKED CASH AMOUNT: ${purchaseResponse.GetBankCashAmount()}`);
                break;
            case SuccessState.Failed:
                this._flow_msg.Info(`# WE DID NOT GET MOTO-PAID :(`);
                this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
                this._flow_msg.Info(`# Error Detail: ${txState.Response.GetErrorDetail()}`);
                if (txState.Response != null)
                {
                    motoResponse = new MotoPurchaseResponse(txState.Response);
                    purchaseResponse = motoResponse.PurchaseResponse;
                    this._flow_msg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
                    this._flow_msg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
                    this._flow_msg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
                    this._flow_msg.Info(`# Customer Receipt:`);
                    this._flow_msg.Info(purchaseResponse.GetCustomerReceipt().trim());
                }
                break;
            case SuccessState.Unknown:
                this._flow_msg.Info("# WE'RE NOT QUITE SURE WHETHER THE MOTO WENT THROUGH OR NOT :/");
                this._flow_msg.Info("# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                this._flow_msg.Info("# YOU CAN THE TAKE THE APPROPRIATE ACTION.");
                break;
            default:
                throw new Error('Unknown transaction state');
        }
    }

    HandleFinishedGetLastTransaction(txState)
    {
        if (txState.Response != null)
        {
            var gltResponse = new GetLastTransactionResponse(txState.Response);

            if (this._lastCmd.length > 1) {
                // User specified that he intended to retrieve a specific tx by pos_ref_id
                // This is how you can use a handy function to match it.
                var success = this._spi.GltMatch(gltResponse, this._lastCmd[1]);
                if (success == SuccessState.Unknown)
                {
                    this._flow_msg.Info("# Did not retrieve Expected Transaction. Here is what we got:");
                } else {
                    this._flow_msg.Info("# Tx Matched Expected Purchase Request.");
                }
            }

            var purchaseResponse = new PurchaseResponse(txState.Response);
            this._flow_msg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
            this._flow_msg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
            this._flow_msg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
            this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
            this._flow_msg.Info(`# Customer Receipt:`);
            this._flow_msg.Info(purchaseResponse.GetCustomerReceipt().trim());
        }
        else
        {
            // We did not even get a response, like in the case of a time-out.
            this._flow_msg.Info("# Could Not Retrieve Last Transaction.");
        }
    }

    HandleFinishedSettle(txState)
    {
        switch (txState.Success)
        {
            case SuccessState.Success:
                this._flow_msg.Info("# SETTLEMENT SUCCESSFUL!");
                if (txState.Response != null)
                {
                    var settleResponse = new Settlement(txState.Response);
                    this._flow_msg.Info(`# Response: ${settleResponse.GetResponseText()}`);
                    this._flow_msg.Info("# Merchant Receipt:");
                    this._flow_msg.Info(settleResponse.GetReceipt().trim());
                    this._flow_msg.Info("# Period Start: " + settleResponse.GetPeriodStartTime());
                    this._flow_msg.Info("# Period End: " + settleResponse.GetPeriodEndTime());
                    this._flow_msg.Info("# Settlement Time: " + settleResponse.GetTriggeredTime());
                    this._flow_msg.Info("# Transaction Range: " + settleResponse.GetTransactionRange());
                    this._flow_msg.Info("# Terminal Id: " + settleResponse.GetTerminalId());
                    this._flow_msg.Info("# Total TX Count: " + settleResponse.GetTotalCount());
                    this._flow_msg.Info(`# Total TX Value: ${settleResponse.GetTotalValue() / 100.0}`);
                    this._flow_msg.Info("# By Aquirer TX Count: " + settleResponse.GetSettleByAquirerCount());
                    this._flow_msg.Info(`# By Aquirer TX Value: ${settleResponse.GetSettleByAquirerValue() / 100.0}`);
                    this._flow_msg.Info("# SCHEME SETTLEMENTS:");
                    var schemes = settleResponse.GetSchemeSettlementEntries();
                    for (var s in schemes)
                    {
                        this._flow_msg.Info("# " + s);
                    }

                }
                break;
            case SuccessState.Failed:
                this._flow_msg.Info("# SETTLEMENT FAILED!");
                if (txState.Response != null)
                {
                    var settleResponse = new Settlement(txState.Response);
                    this._flow_msg.Info(`# Response: ${settleResponse.GetResponseText()}`);
                    this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
                    this._flow_msg.Info("# Merchant Receipt:");
                    this._flow_msg.Info(settleResponse.GetReceipt().trim());
                }
                break;
            case SuccessState.Unknown:
                this._flow_msg.Info("# SETTLEMENT ENQUIRY RESULT UNKNOWN!");
                break;
            default:
                throw new Error('Unknown state');
        }
    }

    HandleFinishedSettlementEnquiry(txState)
    {
        switch (txState.Success)
        {
            case SuccessState.Success:
                this._flow_msg.Info("# SETTLEMENT ENQUIRY SUCCESSFUL!");
                if (txState.Response != null)
                {
                    var settleResponse = new Settlement(txState.Response);
                    this._flow_msg.Info(`# Response: ${settleResponse.GetResponseText()}`);
                    this._flow_msg.Info(`# Merchant Receipt:`);
                    this._flow_msg.Info(settleResponse.GetReceipt().trim());
                    this._flow_msg.Info(`# Period Start: ` + settleResponse.GetPeriodStartTime());
                    this._flow_msg.Info(`# Period End: ` + settleResponse.GetPeriodEndTime());
                    this._flow_msg.Info(`# Settlement Time: ` + settleResponse.GetTriggeredTime());
                    this._flow_msg.Info(`# Transaction Range: ` + settleResponse.GetTransactionRange());
                    this._flow_msg.Info(`# Terminal Id: ` + settleResponse.GetTerminalId());
                    this._flow_msg.Info(`# Total TX Count: ` + settleResponse.GetTotalCount());
                    this._flow_msg.Info(`# Total TX Value: ${settleResponse.GetTotalValue() / 100.0}`);
                    this._flow_msg.Info(`# By Aquirer TX Count: ` + settleResponse.GetSettleByAquirerCount());
                    this._flow_msg.Info(`# By Aquirere TX Value: ${settleResponse.GetSettleByAquirerValue() / 100.0}`);
                    this._flow_msg.Info(`# SCHEME SETTLEMENTS:`);
                    var schemes = settleResponse.GetSchemeSettlementEntries();
                    for (s in schemes)
                    {
                        this._flow_msg.Info(`# ` + s);
                    }
                }
                break;
            case SuccessState.Failed:
                this._flow_msg.Info("# SETTLEMENT ENQUIRY FAILED!");
                if (txState.Response != null)
                {
                    var settleResponse = new Settlement(txState.Response);
                    this._flow_msg.Info(`# Response: ${settleResponse.GetResponseText()}`);
                    this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
                    this._flow_msg.Info(`# Merchant Receipt:`);
                    this._flow_msg.Info(settleResponse.GetReceipt().trim());
                }
                break;
            case SuccessState.Unknown:
                this._flow_msg.Info("# SETTLEMENT ENQUIRY RESULT UNKNOWN!");
                break;
            default:
                throw new Error('Unknown Transaction state');
        }
    }

    PrintActions()
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
                        this._log.info(`# .. Unexpected Flow .. ${this._spi.CurrentFlow}`);
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
                        inputsEnabled.push('tip_amount_input');
                        inputsEnabled.push('cashout_amount_input');
                        inputsEnabled.push('prompt_for_cash');
                        inputsEnabled.push('purchase');
                        inputsEnabled.push('moto');
                        inputsEnabled.push('refund');
                        inputsEnabled.push('cashout');
                        inputsEnabled.push('settle');
                        inputsEnabled.push('settle_enq');
                        inputsEnabled.push('recover');
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
                                    inputsEnabled.push('ok_cancel');
                                    break;
                                default:
                                    // Unknown
                                    inputsEnabled.push('ok_override_paid');
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
        let inputs = document.querySelectorAll('.input');
        for(let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }

        inputsEnabled.forEach((input) => {
            document.getElementById(input).disabled = false;
        });

        this._flow_msg.Info(`# ----------- AVAILABLE ACTIONS ------------`);

        if (this._spi.CurrentFlow == SpiFlow.Idle)
        {
            this._flow_msg.Info(`# [kebab:1200:100:500:false] - [kebab:price:tip:cashout:promptForCash] Charge for kebab with extras!`);
            this._flow_msg.Info(`# [13kebab:1300] - MOTO - Accept Payment Over the phone`);
            this._flow_msg.Info(`# [yuck:500] - hand out a refund of $5.00!`);
            this._flow_msg.Info(`# [cashout:5000] - do a cashout only transaction`);
            this._flow_msg.Info(`# [settle] - Initiate Settlement`);
            this._flow_msg.Info(`# [settle_enq] - Settlment Enquiry`);
            this._flow_msg.Info(`#`);
            this._flow_msg.Info(`# [recover:prchs1] - Attempt State Recovery for pos_ref_id 'prchs1'`);
            this._flow_msg.Info(`# [glt:prchs1] - Get Last Transaction - Expect it to be posRefId 'prchs1'`);
            this._flow_msg.Info(`#`);
            this._flow_msg.Info(`# [rcpt_from_eftpos:true] - Offer Customer Receipt From Eftpos`);
            this._flow_msg.Info(`# [sig_flow_from_eftpos:true] - Signature Flow to be handled by Eftpos`);
            this._flow_msg.Info(`#`);
        }

        if (this._spi.CurrentStatus == SpiStatus.Unpaired && this._spi.CurrentFlow == SpiFlow.Idle)
        {
            this._flow_msg.Info("# [pos_id:CITYKEBAB1] - Set the POS ID");
        }

        if (this._spi.CurrentStatus == SpiStatus.Unpaired || this._spi.CurrentStatus == SpiStatus.PairedConnecting)
        {
            this._flow_msg.Info("# [eftpos_address:10.161.104.104] - Set the EFTPOS ADDRESS");
        }

        if (this._spi.CurrentStatus == SpiStatus.Unpaired && this._spi.CurrentFlow == SpiFlow.Idle)
            this._flow_msg.Info("# [pair] - Pair with Eftpos");

        if (this._spi.CurrentStatus != SpiStatus.Unpaired && this._spi.CurrentFlow == SpiFlow.Idle)
            this._flow_msg.Info("# [unpair] - Unpair and Disconnect");

        if (this._spi.CurrentFlow == SpiFlow.Pairing)
        {
            if (this._spi.CurrentPairingFlowState.AwaitingCheckFromPos)
                this._flow_msg.Info("# [pair_confirm] - Confirm Pairing Code");

            if (!this._spi.CurrentPairingFlowState.Finished)
                this._flow_msg.Info("# [pair_cancel] - Cancel Pairing");

            if (this._spi.CurrentPairingFlowState.Finished)
                this._flow_msg.Info("# [ok] - acknowledge final");
        }

        if (this._spi.CurrentFlow == SpiFlow.Transaction)
        {
            var txState = this._spi.CurrentTxFlowState;

            if (txState.AwaitingSignatureCheck)
            {
                this._flow_msg.Info("# [tx_sign_accept] - Accept Signature");
                this._flow_msg.Info("# [tx_sign_decline] - Decline Signature");
            }

            if (txState.AwaitingPhoneForAuth)
            {
                this._flow_msg.Info("# [tx_auth_code:123456] - Submit Phone For Auth Code");
            }

            if (!txState.Finished && !txState.AttemptingToCancel)
                this._flow_msg.Info("# [tx_cancel] - Attempt to Cancel Tx");

            if (txState.Finished)
                this._flow_msg.Info("# [ok] - acknowledge final");
        }

        this._flow_msg.Info("# [status] - reprint buttons/status");
        this._flow_msg.Info("# [bye] - exit");
        this._flow_msg.Info();
    }

    PrintPairingStatus()
    {
        this._flow_msg.Info(`# --------------- STATUS ------------------`);
        this._flow_msg.Info(`# ${this._posId} <-> Eftpos: ${this._eftposAddress} #`);
        this._flow_msg.Info(`# SPI STATUS: ${this._spi.CurrentStatus}     FLOW: ${this._spi.CurrentFlow} #`);
        this._flow_msg.Info(`# SPI CONFIG: ${JSON.stringify(this._spi.Config)}`);
        this._flow_msg.Info(`# -----------------------------------------`);
        this._flow_msg.Info(`# POS: v${this._version} Spi: v${Spi.GetVersion()}`);

    }

    AcceptUserInput()
    {
        document.getElementById('save_settings').addEventListener('click', () => {

            this._posId         = document.getElementById('pos_id').value;
            this._eftposAddress = document.getElementById('eftpos_address').value;

            this._spi.Config.PromptForCustomerCopyOnEftpos = document.getElementById('rcpt_from_eftpos').checked;
            this._spi.Config.SignatureFlowOnEftpos = document.getElementById('sig_flow_from_eftpos').checked;

            this._spi.SetPosId(this._posId);
            this._spi.SetEftposAddress(this._eftposAddress);

            localStorage.setItem('pos_id', this._posId);
            localStorage.setItem('eftpos_address', this._eftposAddress);
            localStorage.setItem('rcpt_from_eftpos', this._spi.Config.PromptForCustomerCopyOnEftpos);
            localStorage.setItem('sig_flow_from_eftpos', this._spi.Config.SignatureFlowOnEftpos);

            this._log.info(`Saved settings ${this._posId}:${this._eftposAddress}`);
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
            var posRefId        = `kebab-${new Date().toISOString()}`; 
            var purchaseAmount  = parseInt(document.getElementById('amount').value,10);
            var tipAmount       = parseInt(document.getElementById('tip_amount').value,10);
            var cashoutAmount   = parseInt(document.getElementById('cashout_amount').value,10);
            var promptForCashout = document.getElementById('prompt_for_cash').checked;
            var pres = this._spi.InitiatePurchaseTxV2(posRefId, purchaseAmount, tipAmount, cashoutAmount, promptForCashout);
            if (!pres.Initiated)
            {
                this._flow_msg.Info(`# Could not initiate purchase: ${pres.Message}. Please Retry.`);
            }
        });

        document.getElementById('refund').addEventListener('click', () => {
            let amount  = document.getElementById('amount').value;
            let rres    = this._spi.InitiateRefundTx(RequestIdHelper.Id("rfnd"), parseInt(amount,10));
            this._log.info(rres.Initiated ? "# Refund Initiated. Will be updated with Progress." : `# Could not initiate refund: ${rres.Message}. Please Retry.`);
        });

        document.getElementById('settle').addEventListener('click', () => {
            let sres = this._spi.InitiateSettleTx(RequestIdHelper.Id("settle"));
            this._log.info(sres.Initiated ? "# Settle Initiated. Will be updated with Progress." : `# Could not initiate settle: ${sres.Message}. Please Retry.`);
        });

        document.getElementById('glt').addEventListener('click', () => {
            let sres = this._spi.InitiateGetLastTx(RequestIdHelper.Id("glt"));
            this._log.info(sres.Initiated ? "# GLT Initiated. Will be updated with Progress." : `# Could not initiate GLT: ${sres.Message}. Please Retry.`);
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
            this._log.clear();
            this._flow_msg.innerHTML = "Select from the options below";
            this.PrintStatusAndActions();
        });

        document.getElementById('ok_cancel').addEventListener('click', () => {
            this._spi.AckFlowEndedAndBackToIdle();
            this._log.clear();
            this._flow_msg.innerHTML = "Order Cancelled";
            this.PrintStatusAndActions();
        });

        document.getElementById('ok_override_paid').addEventListener('click', () => {
            this._spi.AckFlowEndedAndBackToIdle();
            this._log.clear();
            this._flow_msg.innerHTML = "Order Paid.";
            this.PrintStatusAndActions();
        });
    }

    ProcessInput(spInput)
    {
        switch (spInput[0].ToLower())
        {
            case "purchase":
            case "kebab":
                var tipAmount = 0;
                if (spInput.Length > 2) int.TryParse(spInput[2],  tipAmount);
                var cashoutAmount = 0;
                if (spInput.Length > 3) int.TryParse(spInput[3],  cashoutAmount);
                var promptForCashout = false;
                if (spInput.Length > 4) bool.TryParse(spInput[4],  promptForCashout);
                // posRefId is what you would usually use to identify the order in your own system.
                var posRefId = "kebab-" + DateTime.Now.ToString("dd-MM-yyyy-HH-mm-ss"); 
                var pres = _spi.InitiatePurchaseTxV2(posRefId, int.Parse(spInput[1]), tipAmount, cashoutAmount, promptForCashout);
                if (!pres.Initiated)
                {
                    this._flow_msg.Info("# Could not initiate purchase: {pres.Message}. Please Retry.");
                }
                break;
            case "refund":
            case "yuck":
                var yuckres = _spi.InitiateRefundTx("yuck-" + DateTime.Now.ToString("dd-MM-yyyy-HH-mm-ss"), int.Parse(spInput[1]));
                if (!yuckres.Initiated)
                {
                    this._flow_msg.Info("# Could not initiate refund: {yuckres.Message}. Please Retry.");
                }
                break;
            case "cashout":
                var coRes = _spi.InitiateCashoutOnlyTx("launder-" + DateTime.Now.ToString("dd-MM-yyyy-HH-mm-ss"), int.Parse(spInput[1]));
                if (!coRes.Initiated)
                {
                    this._flow_msg.Info("# Could not initiate cashout: {coRes.Message}. Please Retry.");
                }
                break;
            case "13kebab":
                var motoRed = _spi.InitiateMotoPurchaseTx("kebab-" + DateTime.Now.ToString("dd-MM-yyyy-HH-mm-ss"), int.Parse(spInput[1]));
                if (!motoRed.Initiated)
                {
                    this._flow_msg.Info("# Could not initiate moto purchase: {motoRed.Message}. Please Retry.");
                }
                break;

            case "pos_id":
                this._printerClear();
                if (_spi.SetPosId(spInput[1]))
                {
                    _posId = spInput[1];
                    this._flow_msg.Info("## -> POS ID now set to {_posId}");
                }
                else
                {
                    this._flow_msg.Info("## -> Could not set POS ID");
                }
                ;
                PrintStatusAndActions();
                this._printerWrite("> ");
                break;
            case "eftpos_address":
                this._printerClear();
                if (_spi.SetEftposAddress(spInput[1]))
                {
                    _eftposAddress = spInput[1];
                    this._flow_msg.Info("## -> Eftpos Address now set to {_eftposAddress}");
                }
                else
                {
                    this._flow_msg.Info("## -> Could not set Eftpos Address");
                }
                ;
                PrintStatusAndActions();
                this._printerWrite("> ");
                break;

            case "pair":
                var pairingInited = _spi.Pair();
                if (!pairingInited) this._flow_msg.Info("## -> Could not Start Pairing. Check Settings.");
                break;
            case "pair_cancel":
                _spi.PairingCancel();
                break;
            case "pair_confirm":
                _spi.PairingConfirmCode();
                break;
            case "unpair":
                _spi.Unpair();
                break;

            case "tx_sign_accept":
                _spi.AcceptSignature(true);
                break;
            case "tx_sign_decline":
                _spi.AcceptSignature(false);
                break;
            case "tx_cancel":
                _spi.CancelTransaction();
                break;

            case "tx_auth_code":
                var sacRes = _spi.SubmitAuthCode(spInput[1]);
                if (!sacRes.ValidFormat)
                {
                    this._flow_msg.Info("Ivalid Code Format. {sacRes.Message}. Try Again.");
                }
                break;

            case "settle":
                var settleres = _spi.InitiateSettleTx(RequestIdHelper.Id("settle"));
                if (!settleres.Initiated)
                {
                    this._flow_msg.Info("# Could not initiate settlement: {settleres.Message}. Please Retry.");
                }
                break;
            case "settle_enq":
                var senqres = _spi.InitiateSettlementEnquiry(RequestIdHelper.Id("stlenq"));
                if (!senqres.Initiated)
                {
                    this._flow_msg.Info("# Could not initiate settlement enquiry: {senqres.Message}. Please Retry.");
                }
                break;


            case "rcpt_from_eftpos":
                _spi.Config.PromptForCustomerCopyOnEftpos = spInput[1].ToLower() == "true";
                break;
            case "sig_flow_from_eftpos":
                _spi.Config.SignatureFlowOnEftpos = spInput[1].ToLower() == "true";
                break;

            case "ok":
                this._printerClear();
                _spi.AckFlowEndedAndBackToIdle();
                PrintStatusAndActions();
                this._printerWrite("> ");
                break;

            case "recover":
                this._printerClear();
                var rres = _spi.InitiateRecovery(spInput[1], TransactionType.Purchase);
                if (!rres.Initiated)
                {
                    this._flow_msg.Info("# Could not initiate recovery. {rres.Message}. Please Retry.");
                }
                break;

            case "glt":
                var gltres = _spi.InitiateGetLastTx();
                this._flow_msg.Info(gltres.Initiated ? "# GLT Initiated. Will be updated with Progress." : "# Could not initiate GLT: {gltres.Message}. Please Retry.");
                break;

            case "status":
                this._printerClear();
                PrintStatusAndActions();
                break;
            case "bye":
                return true;
            case "":
                this._printerWrite("> ");
                break;

            default:
                this._flow_msg.Info("# I don't understand. Sorry.");
                this._printerWrite("> ");
                break;
        }
        return false;
    }

    LoadPersistedState()
    {
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

        this._rcpt_from_eftpos = document.getElementById('rcpt_from_eftpos').checked = localStorage.getItem('rcpt_from_eftpos') === 'true' || false;
        this._sig_flow_from_eftpos = document.getElementById('sig_flow_from_eftpos').checked = localStorage.getItem('sig_flow_from_eftpos') === 'true' || false;

        if(localStorage.getItem('EncKey') && localStorage.getItem('HmacKey')) {
            this._spiSecrets = new Secrets(localStorage.getItem('EncKey'), localStorage.getItem('HmacKey'));
        }
    }
}

/**
 * Start the POS
 */
document.addEventListener('DOMContentLoaded', () => {

    try {
        let log         = console;
        let receipt     = new Log(document.getElementById('receipt_output'),`\n\n \\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/ \n\n`);
        let flow_msg    = new Log(document.getElementById('flow_msg'));
        let pos         = new KebabPos(log, receipt, flow_msg);
        pos.Start();
    } catch(err) {
        console.error(err);
    }
});

