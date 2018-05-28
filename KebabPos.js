/// <summary>
/// NOTE: THIS PROJECT USES THE 2.1.x of the SPI Client Library
///  
/// This is your POS. To integrate with SPI, you need to instantiate a Spi object
/// and interact with it.
/// 
/// Primarily you need to implement 3 things.
/// 1. Settings Screen
/// 2. Pairing Flow Screen
/// 3. Transaction Flow screen
/// 
/// To see logs from spi, you need to create a SPIClient.dll.config file next to your binary, 
/// that contains log4net configuration, similar to what is inside app.config in this project.
/// </summary>
class KebabPos
{
    constructor(log, receipt, flow_msg) {
        this._spi = null;
        this._posId = "KEBABPOS1";
        this._eftposAddress = "192.168.1.1";
        this._spiSecrets = null;
        this._version = '2.1.0';

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
        document.addEventListener('StatusChanged', (e) => this.OnSpiStatusChanged(e.detail)); 
        document.addEventListener('PairingFlowStateChanged', (e) => this.OnPairingFlowStateChanged(e.detail)); 
        document.addEventListener('SecretsChanged', (e) => this.OnSecretsChanged(e.detail)); 
        document.addEventListener('TxFlowStateChanged', (e) => this.OnTxFlowStateChanged(e.detail)); 
        this._spi.Start();

        // And Now we just accept user input and display to the user what is happening.

        this._log.clear();
        this._log.info("# Welcome to KebabPos !");
        
        this.PrintStatusAndActions();
        this.AcceptUserInput();
    }

    OnTxFlowStateChanged(txState)
    {
        this._log.Clear();
        this.PrintStatusAndActions();
        this._log.Write("> ");
    }

    OnPairingFlowStateChanged(pairingFlowState)
    {
        this._log.Clear();
        this.PrintStatusAndActions();
        this._log.Write("> ");
    }

    OnSecretsChanged(secrets)
    {
        this._spiSecrets = secrets;
        if (secrets != null)
        {
            this._log.info(`# I Have Secrets: ${secrets.EncKey}${secrets.HmacKey}. Persist them Securely.`);
        }
        else
        {
            this._log.info(`# I Have Lost the Secrets, i.e. Unpaired. Destroy the persisted secrets.`);
        }
    }

    /// <summary>
    /// Called when we received a Status Update i.e. Unpaired/PairedConnecting/PairedConnected
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="spiStatus"></param>
    OnSpiStatusChanged(spiStatus)
    {
        this._log.Clear();
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
        PurchaseResponse purchaseResponse;
        switch (txState.Success)
        {
            case Message.SuccessState.Success:
                this._printerWriteLine($"# WOOHOO - WE GOT PAID!");
                purchaseResponse = new PurchaseResponse(txState.Response);
                this._printerWriteLine("# Response: {0}", purchaseResponse.GetResponseText());
                this._printerWriteLine("# RRN: {0}", purchaseResponse.GetRRN());
                this._printerWriteLine("# Scheme: {0}", purchaseResponse.SchemeName);
                this._printerWriteLine("# Customer Receipt:");
                this._printerWriteLine(!purchaseResponse.WasCustomerReceiptPrinted() ? purchaseResponse.GetCustomerReceipt().TrimEnd() : "# PRINTED FROM EFTPOS");
                this._printerWriteLine("# PURCHASE: {0}", purchaseResponse.GetPurchaseAmount());
                this._printerWriteLine("# TIP: {0}", purchaseResponse.GetTipAmount());
                this._printerWriteLine("# CASHOUT: {0}", purchaseResponse.GetCashoutAmount());
                this._printerWriteLine("# BANKED NON-CASH AMOUNT: {0}", purchaseResponse.GetBankNonCashAmount());
                this._printerWriteLine("# BANKED CASH AMOUNT: {0}", purchaseResponse.GetBankCashAmount());

                break;
            case Message.SuccessState.Failed:
                this._printerWriteLine($"# WE DID NOT GET PAID :(");
                this._printerWriteLine("# Error: {0}", txState.Response.GetError());
                this._printerWriteLine("# Error Detail: {0}", txState.Response.GetErrorDetail());
                if (txState.Response != null)
                {
                    purchaseResponse = new PurchaseResponse(txState.Response);
                    this._printerWriteLine("# Response: {0}", purchaseResponse.GetResponseText());
                    this._printerWriteLine("# RRN: {0}", purchaseResponse.GetRRN());
                    this._printerWriteLine("# Scheme: {0}", purchaseResponse.SchemeName);
                    this._printerWriteLine("# Customer Receipt:");
                    this._printerWriteLine(!purchaseResponse.WasCustomerReceiptPrinted()
                        ? purchaseResponse.GetCustomerReceipt().TrimEnd()
                        : "# PRINTED FROM EFTPOS");
                }
                break;
            case Message.SuccessState.Unknown:
                this._printerWriteLine($"# WE'RE NOT QUITE SURE WHETHER WE GOT PAID OR NOT :/");
                this._printerWriteLine($"# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                this._printerWriteLine($"# IF YOU CONFIRM THAT THE CUSTOMER PAID, CLOSE THE ORDER.");
                this._printerWriteLine($"# OTHERWISE, RETRY THE PAYMENT FROM SCRATCH.");
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private void HandleFinishedRefund(TransactionFlowState txState)
    {
        RefundResponse refundResponse;
        switch (txState.Success)
        {
            case Message.SuccessState.Success:
                this._printerWriteLine($"# REFUND GIVEN- OH WELL!");
                refundResponse = new RefundResponse(txState.Response);
                this._printerWriteLine("# Response: {0}", refundResponse.GetResponseText());
                this._printerWriteLine("# RRN: {0}", refundResponse.GetRRN());
                this._printerWriteLine("# Scheme: {0}", refundResponse.SchemeName);
                this._printerWriteLine("# Customer Receipt:");
                this._printerWriteLine(!refundResponse.WasCustomerReceiptPrinted() ? refundResponse.GetCustomerReceipt().TrimEnd() : "# PRINTED FROM EFTPOS");
                this._printerWriteLine("# REFUNDED AMOUNT: {0}", refundResponse.GetRefundAmount());
                break;
            case Message.SuccessState.Failed:
                this._printerWriteLine($"# REFUND FAILED!");
                this._printerWriteLine("# Error: {0}", txState.Response.GetError());
                this._printerWriteLine("# Error Detail: {0}", txState.Response.GetErrorDetail());
                if (txState.Response != null)
                {
                    refundResponse = new RefundResponse(txState.Response);
                    this._printerWriteLine("# Response: {0}", refundResponse.GetResponseText());
                    this._printerWriteLine("# RRN: {0}", refundResponse.GetRRN());
                    this._printerWriteLine("# Scheme: {0}", refundResponse.SchemeName);
                    this._printerWriteLine("# Customer Receipt:");
                    this._printerWriteLine(!refundResponse.WasCustomerReceiptPrinted() ? refundResponse.GetCustomerReceipt().TrimEnd() : "# PRINTED FROM EFTPOS");
                }
                break;
            case Message.SuccessState.Unknown:
                this._printerWriteLine($"# WE'RE NOT QUITE SURE WHETHER THE REFUND WENT THROUGH OR NOT :/");
                this._printerWriteLine($"# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                this._printerWriteLine($"# YOU CAN THE TAKE THE APPROPRIATE ACTION.");
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private void HandleFinishedCashout(TransactionFlowState txState)
    {
        CashoutOnlyResponse cashoutResponse;
        switch (txState.Success)
        {
            case Message.SuccessState.Success:
                this._printerWriteLine($"# CASH-OUT SUCCESSFUL - HAND THEM THE CASH!");
                cashoutResponse = new CashoutOnlyResponse(txState.Response);
                this._printerWriteLine("# Response: {0}", cashoutResponse.GetResponseText());
                this._printerWriteLine("# RRN: {0}", cashoutResponse.GetRRN());
                this._printerWriteLine("# Scheme: {0}", cashoutResponse.SchemeName);
                this._printerWriteLine("# Customer Receipt:");
                this._printerWriteLine(!cashoutResponse.WasCustomerReceiptPrinted() ? cashoutResponse.GetCustomerReceipt().TrimEnd() : "# PRINTED FROM EFTPOS");
                this._printerWriteLine("# CASHOUT: {0}", cashoutResponse.GetCashoutAmount());
                this._printerWriteLine("# BANKED NON-CASH AMOUNT: {0}", cashoutResponse.GetBankNonCashAmount());
                this._printerWriteLine("# BANKED CASH AMOUNT: {0}", cashoutResponse.GetBankCashAmount());
                break;
            case Message.SuccessState.Failed:
                this._printerWriteLine($"# CASHOUT FAILED!");
                this._printerWriteLine("# Error: {0}", txState.Response.GetError());
                this._printerWriteLine("# Error Detail: {0}", txState.Response.GetErrorDetail());
                if (txState.Response != null)
                {
                    cashoutResponse = new CashoutOnlyResponse(txState.Response);
                    this._printerWriteLine("# Response: {0}", cashoutResponse.GetResponseText());
                    this._printerWriteLine("# RRN: {0}", cashoutResponse.GetRRN());
                    this._printerWriteLine("# Scheme: {0}", cashoutResponse.SchemeName);
                    this._printerWriteLine("# Customer Receipt:");
                    this._printerWriteLine(cashoutResponse.GetCustomerReceipt().TrimEnd());
                }
                break;
            case Message.SuccessState.Unknown:
                this._printerWriteLine($"# WE'RE NOT QUITE SURE WHETHER THE CASHOUT WENT THROUGH OR NOT :/");
                this._printerWriteLine($"# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                this._printerWriteLine($"# YOU CAN THE TAKE THE APPROPRIATE ACTION.");
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private void HandleFinishedMoto(TransactionFlowState txState)
    {
        MotoPurchaseResponse motoResponse;
        PurchaseResponse purchaseResponse;
        switch (txState.Success)
        {
            case Message.SuccessState.Success:
                this._printerWriteLine($"# WOOHOO - WE GOT MOTO-PAID!");
                motoResponse = new MotoPurchaseResponse(txState.Response);
                purchaseResponse = motoResponse.PurchaseResponse;
                this._printerWriteLine("# Response: {0}", purchaseResponse.GetResponseText());
                this._printerWriteLine("# RRN: {0}", purchaseResponse.GetRRN());
                this._printerWriteLine("# Scheme: {0}", purchaseResponse.SchemeName);
                this._printerWriteLine("# Card Entry: {0}", purchaseResponse.GetCardEntry());
                this._printerWriteLine("# Customer Receipt:");
                this._printerWriteLine(!purchaseResponse.WasCustomerReceiptPrinted() ? purchaseResponse.GetCustomerReceipt().TrimEnd() : "# PRINTED FROM EFTPOS");
                this._printerWriteLine("# PURCHASE: {0}", purchaseResponse.GetPurchaseAmount());
                this._printerWriteLine("# BANKED NON-CASH AMOUNT: {0}", purchaseResponse.GetBankNonCashAmount());
                this._printerWriteLine("# BANKED CASH AMOUNT: {0}", purchaseResponse.GetBankCashAmount());
                break;
            case Message.SuccessState.Failed:
                this._printerWriteLine($"# WE DID NOT GET MOTO-PAID :(");
                this._printerWriteLine("# Error: {0}", txState.Response.GetError());
                this._printerWriteLine("# Error Detail: {0}", txState.Response.GetErrorDetail());
                if (txState.Response != null)
                {
                    motoResponse = new MotoPurchaseResponse(txState.Response);
                    purchaseResponse = motoResponse.PurchaseResponse;
                    this._printerWriteLine("# Response: {0}", purchaseResponse.GetResponseText());
                    this._printerWriteLine("# RRN: {0}", purchaseResponse.GetRRN());
                    this._printerWriteLine("# Scheme: {0}", purchaseResponse.SchemeName);
                    this._printerWriteLine("# Customer Receipt:");
                    this._printerWriteLine(purchaseResponse.GetCustomerReceipt().TrimEnd());
                }
                break;
            case Message.SuccessState.Unknown:
                this._printerWriteLine($"# WE'RE NOT QUITE SURE WHETHER THE MOTO WENT THROUGH OR NOT :/");
                this._printerWriteLine($"# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                this._printerWriteLine($"# YOU CAN THE TAKE THE APPROPRIATE ACTION.");
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private void HandleFinishedGetLastTransaction(TransactionFlowState txState)
    {
        if (txState.Response != null)
        {
            var gltResponse = new GetLastTransactionResponse(txState.Response);

            if (_lastCmd.Length > 1) {
                // User specified that he intended to retrieve a specific tx by pos_ref_id
                // This is how you can use a handy function to match it.
                var success = _spi.GltMatch(gltResponse, _lastCmd[1]);
                if (success == Message.SuccessState.Unknown)
                {
                    this._printerWriteLine("# Did not retrieve Expected Transaction. Here is what we got:");
                } else {
                    this._printerWriteLine("# Tx Matched Expected Purchase Request.");
                }
            }

            var purchaseResponse = new PurchaseResponse(txState.Response);
            this._printerWriteLine("# Scheme: {0}", purchaseResponse.SchemeName);
            this._printerWriteLine("# Response: {0}", purchaseResponse.GetResponseText());
            this._printerWriteLine("# RRN: {0}", purchaseResponse.GetRRN());
            this._printerWriteLine("# Error: {0}", txState.Response.GetError());
            this._printerWriteLine("# Customer Receipt:");
            this._printerWriteLine(purchaseResponse.GetCustomerReceipt().TrimEnd());
        }
        else
        {
            // We did not even get a response, like in the case of a time-out.
            this._printerWriteLine("# Could Not Retrieve Last Transaction.");
        }
    }

    private static void HandleFinishedSettle(TransactionFlowState txState)
    {
        switch (txState.Success)
        {
            case Message.SuccessState.Success:
                this._printerWriteLine($"# SETTLEMENT SUCCESSFUL!");
                if (txState.Response != null)
                {
                    var settleResponse = new Settlement(txState.Response);
                    this._printerWriteLine("# Response: {0}", settleResponse.GetResponseText());
                    this._printerWriteLine("# Merchant Receipt:");
                    this._printerWriteLine(settleResponse.GetReceipt().TrimEnd());
                    this._printerWriteLine("# Period Start: " + settleResponse.GetPeriodStartTime());
                    this._printerWriteLine("# Period End: " + settleResponse.GetPeriodEndTime());
                    this._printerWriteLine("# Settlement Time: " + settleResponse.GetTriggeredTime());
                    this._printerWriteLine("# Transaction Range: " + settleResponse.GetTransactionRange());
                    this._printerWriteLine("# Terminal Id: " + settleResponse.GetTerminalId());
                    this._printerWriteLine("# Total TX Count: " + settleResponse.GetTotalCount());
                    this._printerWriteLine($"# Total TX Value: {settleResponse.GetTotalValue() / 100.0}");
                    this._printerWriteLine("# By Aquirer TX Count: " + settleResponse.GetSettleByAquirerCount());
                    this._printerWriteLine($"# By Aquirer TX Value: {settleResponse.GetSettleByAquirerValue() / 100.0}");
                    this._printerWriteLine("# SCHEME SETTLEMENTS:");
                    var schemes = settleResponse.GetSchemeSettlementEntries();
                    foreach (var s in schemes)
                    {
                        this._printerWriteLine("# " + s);
                    }

                }
                break;
            case Message.SuccessState.Failed:
                this._printerWriteLine($"# SETTLEMENT FAILED!");
                if (txState.Response != null)
                {
                    var settleResponse = new Settlement(txState.Response);
                    this._printerWriteLine("# Response: {0}", settleResponse.GetResponseText());
                    this._printerWriteLine("# Error: {0}", txState.Response.GetError());
                    this._printerWriteLine("# Merchant Receipt:");
                    this._printerWriteLine(settleResponse.GetReceipt().TrimEnd());
                }
                break;
            case Message.SuccessState.Unknown:
                this._printerWriteLine($"# SETTLEMENT ENQUIRY RESULT UNKNOWN!");
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private static void HandleFinishedSettlementEnquiry(TransactionFlowState txState)
    {
        switch (txState.Success)
        {
            case Message.SuccessState.Success:
                this._printerWriteLine($"# SETTLEMENT ENQUIRY SUCCESSFUL!");
                if (txState.Response != null)
                {
                    var settleResponse = new Settlement(txState.Response);
                    this._printerWriteLine("# Response: {0}", settleResponse.GetResponseText());
                    this._printerWriteLine("# Merchant Receipt:");
                    this._printerWriteLine(settleResponse.GetReceipt().TrimEnd());
                    this._printerWriteLine("# Period Start: " + settleResponse.GetPeriodStartTime());
                    this._printerWriteLine("# Period End: " + settleResponse.GetPeriodEndTime());
                    this._printerWriteLine("# Settlement Time: " + settleResponse.GetTriggeredTime());
                    this._printerWriteLine("# Transaction Range: " + settleResponse.GetTransactionRange());
                    this._printerWriteLine("# Terminal Id: " + settleResponse.GetTerminalId());
                    this._printerWriteLine("# Total TX Count: " + settleResponse.GetTotalCount());
                    this._printerWriteLine($"# Total TX Value: {settleResponse.GetTotalValue() / 100.0}");
                    this._printerWriteLine("# By Aquirer TX Count: " + settleResponse.GetSettleByAquirerCount());
                    this._printerWriteLine($"# By Aquirere TX Value: {settleResponse.GetSettleByAquirerValue() / 100.0}");
                    this._printerWriteLine("# SCHEME SETTLEMENTS:");
                    var schemes = settleResponse.GetSchemeSettlementEntries();
                    foreach (var s in schemes)
                    {
                        this._printerWriteLine("# " + s);
                    }
                }
                break;
            case Message.SuccessState.Failed:
                this._printerWriteLine($"# SETTLEMENT ENQUIRY FAILED!");
                if (txState.Response != null)
                {
                    var settleResponse = new Settlement(txState.Response);
                    this._printerWriteLine("# Response: {0}", settleResponse.GetResponseText());
                    this._printerWriteLine("# Error: {0}", txState.Response.GetError());
                    this._printerWriteLine("# Merchant Receipt:");
                    this._printerWriteLine(settleResponse.GetReceipt().TrimEnd());
                }
                break;
            case Message.SuccessState.Unknown:
                this._printerWriteLine($"# SETTLEMENT ENQUIRY RESULT UNKNOWN!");
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private void PrintActions()
    {
        this._printerWriteLine("# ----------- AVAILABLE ACTIONS ------------");

        if (_spi.CurrentFlow == SpiFlow.Idle)
        {
            this._printerWriteLine("# [kebab:1200:100:500:false] - [kebab:price:tip:cashout:promptForCash] Charge for kebab with extras!");
            this._printerWriteLine("# [13kebab:1300] - MOTO - Accept Payment Over the phone");
            this._printerWriteLine("# [yuck:500] - hand out a refund of $5.00!");
            this._printerWriteLine("# [cashout:5000] - do a cashout only transaction");
            this._printerWriteLine("# [settle] - Initiate Settlement");
            this._printerWriteLine("# [settle_enq] - Settlment Enquiry");
            this._printerWriteLine("#");
            this._printerWriteLine("# [recover:prchs1] - Attempt State Recovery for pos_ref_id 'prchs1'");
            this._printerWriteLine("# [glt:prchs1] - Get Last Transaction - Expect it to be posRefId 'prchs1'");
            this._printerWriteLine("#");
            this._printerWriteLine("# [rcpt_from_eftpos:true] - Offer Customer Receipt From Eftpos");
            this._printerWriteLine("# [sig_flow_from_eftpos:true] - Signature Flow to be handled by Eftpos");
            this._printerWriteLine("#");
        }

        if (_spi.CurrentStatus == SpiStatus.Unpaired && _spi.CurrentFlow == SpiFlow.Idle)
        {
            this._printerWriteLine("# [pos_id:CITYKEBAB1] - Set the POS ID");
        }

        if (_spi.CurrentStatus == SpiStatus.Unpaired || _spi.CurrentStatus == SpiStatus.PairedConnecting)
        {
            this._printerWriteLine("# [eftpos_address:10.161.104.104] - Set the EFTPOS ADDRESS");
        }

        if (_spi.CurrentStatus == SpiStatus.Unpaired && _spi.CurrentFlow == SpiFlow.Idle)
            this._printerWriteLine("# [pair] - Pair with Eftpos");

        if (_spi.CurrentStatus != SpiStatus.Unpaired && _spi.CurrentFlow == SpiFlow.Idle)
            this._printerWriteLine("# [unpair] - Unpair and Disconnect");

        if (_spi.CurrentFlow == SpiFlow.Pairing)
        {
            if (_spi.CurrentPairingFlowState.AwaitingCheckFromPos)
                this._printerWriteLine("# [pair_confirm] - Confirm Pairing Code");

            if (!_spi.CurrentPairingFlowState.Finished)
                this._printerWriteLine("# [pair_cancel] - Cancel Pairing");

            if (_spi.CurrentPairingFlowState.Finished)
                this._printerWriteLine("# [ok] - acknowledge final");
        }

        if (_spi.CurrentFlow == SpiFlow.Transaction)
        {
            var txState = _spi.CurrentTxFlowState;

            if (txState.AwaitingSignatureCheck)
            {
                this._printerWriteLine("# [tx_sign_accept] - Accept Signature");
                this._printerWriteLine("# [tx_sign_decline] - Decline Signature");
            }

            if (txState.AwaitingPhoneForAuth)
            {
                this._printerWriteLine("# [tx_auth_code:123456] - Submit Phone For Auth Code");
            }

            if (!txState.Finished && !txState.AttemptingToCancel)
                this._printerWriteLine("# [tx_cancel] - Attempt to Cancel Tx");

            if (txState.Finished)
                this._printerWriteLine("# [ok] - acknowledge final");
        }

        this._printerWriteLine("# [status] - reprint buttons/status");
        this._printerWriteLine("# [bye] - exit");
        this._printerWriteLine();
    }

    private void PrintPairingStatus()
    {
        this._printerWriteLine("# --------------- STATUS ------------------");
        this._printerWriteLine($"# {_posId} <-> Eftpos: {_eftposAddress} #");
        this._printerWriteLine($"# SPI STATUS: {_spi.CurrentStatus}     FLOW: {_spi.CurrentFlow} #");
        this._printerWriteLine($"# SPI CONFIG: {_spi.Config}");
        this._printerWriteLine("# -----------------------------------------");
        this._printerWriteLine($"# POS: v{_version} Spi: v{Spi.GetVersion()}");

    }

    private void AcceptUserInput()
    {
        var bye = false;
        while (!bye)
        {
            var input = this._printerReadLine();
            if (string.IsNullOrEmpty(input)) { this._printerWrite("> "); continue; }
            var spInput = input.Split(':');
            _lastCmd = spInput;
            try
            {
                bye = ProcessInput(spInput);
            }
            catch (SystemException e)
            {
                this._printerWriteLine("Could Not Process Input. " + e.Message);
                this._printerWriteLine("Try Again.");
                this._printerWrite("> ");
            }
        }
        this._printerWriteLine("# BaBye!");
        if (_spiSecrets != null)
            this._printerWriteLine($"{_posId}:{_eftposAddress}:{_spiSecrets.EncKey}:{_spiSecrets.HmacKey}");
    }

    private bool ProcessInput(string[] spInput)
    {
        switch (spInput[0].ToLower())
        {
            case "purchase":
            case "kebab":
                var tipAmount = 0;
                if (spInput.Length > 2) int.TryParse(spInput[2], out tipAmount);
                var cashoutAmount = 0;
                if (spInput.Length > 3) int.TryParse(spInput[3], out cashoutAmount);
                var promptForCashout = false;
                if (spInput.Length > 4) bool.TryParse(spInput[4], out promptForCashout);
                // posRefId is what you would usually use to identify the order in your own system.
                var posRefId = "kebab-" + DateTime.Now.ToString("dd-MM-yyyy-HH-mm-ss"); 
                var pres = _spi.InitiatePurchaseTxV2(posRefId, int.Parse(spInput[1]), tipAmount, cashoutAmount, promptForCashout);
                if (!pres.Initiated)
                {
                    this._printerWriteLine($"# Could not initiate purchase: {pres.Message}. Please Retry.");
                }
                break;
            case "refund":
            case "yuck":
                var yuckres = _spi.InitiateRefundTx("yuck-" + DateTime.Now.ToString("dd-MM-yyyy-HH-mm-ss"), int.Parse(spInput[1]));
                if (!yuckres.Initiated)
                {
                    this._printerWriteLine($"# Could not initiate refund: {yuckres.Message}. Please Retry.");
                }
                break;
            case "cashout":
                var coRes = _spi.InitiateCashoutOnlyTx("launder-" + DateTime.Now.ToString("dd-MM-yyyy-HH-mm-ss"), int.Parse(spInput[1]));
                if (!coRes.Initiated)
                {
                    this._printerWriteLine($"# Could not initiate cashout: {coRes.Message}. Please Retry.");
                }
                break;
            case "13kebab":
                var motoRed = _spi.InitiateMotoPurchaseTx("kebab-" + DateTime.Now.ToString("dd-MM-yyyy-HH-mm-ss"), int.Parse(spInput[1]));
                if (!motoRed.Initiated)
                {
                    this._printerWriteLine($"# Could not initiate moto purchase: {motoRed.Message}. Please Retry.");
                }
                break;

            case "pos_id":
                this._printerClear();
                if (_spi.SetPosId(spInput[1]))
                {
                    _posId = spInput[1];
                    this._printerWriteLine($"## -> POS ID now set to {_posId}");
                }
                else
                {
                    this._printerWriteLine($"## -> Could not set POS ID");
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
                    this._printerWriteLine($"## -> Eftpos Address now set to {_eftposAddress}");
                }
                else
                {
                    this._printerWriteLine($"## -> Could not set Eftpos Address");
                }
                ;
                PrintStatusAndActions();
                this._printerWrite("> ");
                break;

            case "pair":
                var pairingInited = _spi.Pair();
                if (!pairingInited) this._printerWriteLine($"## -> Could not Start Pairing. Check Settings.");
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
                    this._printerWriteLine($"Ivalid Code Format. {sacRes.Message}. Try Again.");
                }
                break;

            case "settle":
                var settleres = _spi.InitiateSettleTx(RequestIdHelper.Id("settle"));
                if (!settleres.Initiated)
                {
                    this._printerWriteLine($"# Could not initiate settlement: {settleres.Message}. Please Retry.");
                }
                break;
            case "settle_enq":
                var senqres = _spi.InitiateSettlementEnquiry(RequestIdHelper.Id("stlenq"));
                if (!senqres.Initiated)
                {
                    this._printerWriteLine($"# Could not initiate settlement enquiry: {senqres.Message}. Please Retry.");
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
                    this._printerWriteLine($"# Could not initiate recovery. {rres.Message}. Please Retry.");
                }
                break;

            case "glt":
                var gltres = _spi.InitiateGetLastTx();
                this._printerWriteLine(gltres.Initiated ? "# GLT Initiated. Will be updated with Progress." : $"# Could not initiate GLT: {gltres.Message}. Please Retry.");
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
                this._printerWriteLine("# I don't understand. Sorry.");
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

