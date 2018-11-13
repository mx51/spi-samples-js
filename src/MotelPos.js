import {
    Spi, 
    Logger, 
    Secrets, 
    TransactionOptions,
    TransactionType,
    PrintingResponse,
    TerminalStatusResponse,
    TerminalBattery,
    PurchaseResponse,
    SuccessState,
    SpiFlow,
    SpiStatus} from '@assemblypayments/spi-client-js-beta';

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
export class MotelPos
{
    constructor(log, receipt, flow_msg) 
    {
        this._spi = null;
        this._spiPreauth = null;
        this._posId = "MOTELPOS1";
        this._eftposAddress = "192.168.1.1";
        this._spiSecrets = null;
        this._options = null;
        this._version = '2.4.0';
        this._rcpt_from_eftpos = false;
        this._sig_flow_from_eftpos = false;

        this._apiKey         = null;
        this._serialNumber   = "";
        this._acquirerCode   = "wbc";
        this._autoResolveEftposAddress  = false;
        this._testMode       = true;
        this._useSecureWebSockets = false;

        this._log = log;
        this._receipt = receipt;
        this._flow_msg = flow_msg;
    }

    Start()
    {
        this._log.info("Starting MotelPos...");
        this.LoadPersistedState();

        try
        {
            this._spi = new Spi(this._posId, this._serialNumber, this._eftposAddress, this._spiSecrets); // It is ok to not have the secrets yet to start with.
            this._spi.Config.PromptForCustomerCopyOnEftpos = this._rcpt_from_eftpos;
            this._spi.Config.SignatureFlowOnEftpos = this._sig_flow_from_eftpos;

            this._spi.SetPosInfo("assembly", this._version);
            this._spi.SetAcquirerCode(this._acquirerCode);
            this._spi.SetDeviceApiKey(this._apiKey);
            this._spi.SetSecureWebSockets(this._useSecureWebSockets);
            
            this._options = new TransactionOptions();
            this._options.SetCustomerReceiptHeader("");
            this._options.SetCustomerReceiptFooter("");
            this._options.SetMerchantReceiptHeader("");
            this._options.SetMerchantReceiptFooter("");
        }
        catch (e)
        {
            this._log.info(e.Message);
            return;
        }

        document.addEventListener('DeviceAddressChanged', (e) => this.OnDeviceAddressChanged(e.detail)); 
        document.addEventListener('StatusChanged', (e) => this.OnSpiStatusChanged(e.detail)); 
        document.addEventListener('PairingFlowStateChanged', (e) => this.OnPairingFlowStateChanged(e.detail)); 
        document.addEventListener('SecretsChanged', (e) => this.OnSecretsChanged(e.detail)); 
        document.addEventListener('TxFlowStateChanged', (e) => this.OnTxFlowStateChanged(e.detail)); 

        this._spi.PrintingResponse = this.HandlePrintingResponse.bind(this);
        this._spi.TerminalStatusResponse = this.HandleTerminalStatusResponse.bind(this);
        this._spi.BatteryLevelChanged = this.HandleBatteryLevelChanged.bind(this);

        this._spiPreauth = this._spi.EnablePreauth();

        this._spi.Start();
        this._spi.SetTestMode(this._testMode);

        // And Now we just accept user input and display to the user what is happening.

        this._flow_msg.Clear();
        this._flow_msg.Info("# Welcome to MotelPos !");
        
        this.PrintStatusAndActions();
        this.AcceptUserInput();
    }

    DeviceAddressRequest()
    {
        return {
            ApiKey: this._apiKey,
            SerialNumber: this._serialNumber
        };
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

    // <summary>
    // Called when we received a Status Update i.e. Unpaired/PairedConnecting/PairedConnected
    // </summary>
    // <param name="sender"></param>
    // <param name="spiStatus"></param>
    OnSpiStatusChanged(spiStatus)
    {
        this._log.clear();
        this._log.info(`# --> SPI Status Changed: ${spiStatus}`);
        this.PrintStatusAndActions();
    }


    OnDeviceAddressChanged(deviceAddressStatus)
    {
        var eftposAddress = document.getElementById('eftpos_address');

        eftposAddress.value = deviceAddressStatus.Address;
        this._eftposAddress = deviceAddressStatus.Address;
    }

    HandlePrintingResponse(message)
    {
        this._flow_msg.Clear();
        var printingResponse = new PrintingResponse(message);

        if (printingResponse.isSuccess())
        {
            this._flow_msg.Info("# --> Printing Response: Printing Receipt successful");
        }
        else
        {
            this._flow_msg.Info("# --> Printing Response:  Printing Receipt failed: reason = " + printingResponse.getErrorReason() + ", detail = " + printingResponse.getErrorDetail());
        }

        this._spi.AckFlowEndedAndBackToIdle();
        this.PrintStatusAndActions();
    }

    HandleTerminalStatusResponse(message)
    {
        this._flow_msg.Clear();
        var terminalStatusResponse = new TerminalStatusResponse(message);
        this._flow_msg.Info("# Terminal Status Response #");
        this._flow_msg.Info("# Status: " + terminalStatusResponse.GetStatus());
        this._flow_msg.Info("# Battery Level: " + terminalStatusResponse.GetBatteryLevel() + "%");
        this._flow_msg.Info("# Charging: " + terminalStatusResponse.IsCharging());
        this._spi.AckFlowEndedAndBackToIdle();
        this.PrintStatusAndActions();
    }

    HandleBatteryLevelChanged(message)
    {
        this._log.clear();
        var terminalBattery = new TerminalBattery(message);
        this._flow_msg.Info("# Battery Level Changed #");
        this._flow_msg.Info("# Battery Level: " + terminalBattery.BatteryLevel + "%");
        this._spi.AckFlowEndedAndBackToIdle();
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
                this._flow_msg.Info(`# PosRefId: ${txState.PosRefId}`);
                this._flow_msg.Info(`# Type: ${txState.Type}`);
                this._flow_msg.Info(`# Request Amount: $${(txState.AmountCents / 100.0).toFixed(2)}`);
                this._flow_msg.Info(`# Waiting For Signature: ${txState.AwaitingSignatureCheck}`);
                this._flow_msg.Info(`# Attempting to Cancel : ${txState.AttemptingToCancel}`);
                this._flow_msg.Info(`# Finished: ${txState.Finished}`);
                this._flow_msg.Info(`# Success: ${txState.Success}`);

                if (txState.AwaitingSignatureCheck)
                {
                    // We need to print the receipt for the customer to sign.
                    this._flow_msg.Info(`# RECEIPT TO PRINT FOR SIGNATURE`);
                    this._receipt.Info(txState.SignatureRequiredMessage.GetMerchantReceipt().trim());
                }

                if (txState.Finished)
                {
                   switch(txState.Success) 
                   {
                        case SuccessState.Success:
                            switch (txState.Type)
                            {
                                case TransactionType.Preauth:
                                    this._flow_msg.Info("# PREAUTH RESULT - SUCCESS");
                                    var preauthResponse = new PreauthResponse(txState.Response);
                                    this._flow_msg.Info("# PREAUTH-ID:", preauthResponse.PreauthId);
                                    this._flow_msg.Info("# NEW BALANCE AMOUNT:", preauthResponse.GetBalanceAmount());
                                    this._flow_msg.Info("# PREV BALANCE AMOUNT:", preauthResponse.GetPreviousBalanceAmount());
                                    this._flow_msg.Info("# COMPLETION AMOUNT:", preauthResponse.GetCompletionAmount());

                                    var details = preauthResponse.Details;
                                    this._flow_msg.Info("# Response:", details.GetResponseText());
                                    this._flow_msg.Info("# RRN:", details.GetRRN());
                                    this._flow_msg.Info("# Scheme:", details.SchemeName);
                                    this._flow_msg.Info("# Customer Receipt:");
                                    this._receipt.Info(details.GetCustomerReceipt().trim());
                                    break;
                                case TransactionType.AccountVerify:
                                    this._flow_msg.Info("# ACCOUNT VERIFICATION SUCCESS");
                                    var acctVerifyResponse = new AccountVerifyResponse(txState.Response);
                                    var details = acctVerifyResponse.Details;
                                    this._flow_msg.Info("# Response:", details.GetResponseText());
                                    this._flow_msg.Info("# RRN:", details.GetRRN());
                                    this._flow_msg.Info("# Scheme:", details.SchemeName);
                                    this._flow_msg.Info("# Merchant Receipt:");
                                    this._receipt.Info(details.GetMerchantReceipt().trim());
                                    break;
                                default:
                                    this._flow_msg.Info("# MOTEL POS DOESN'T KNOW WHAT TO DO WITH THIS TX TYPE WHEN IT SUCCEEDS");
                                    break;
                            }
                        break;
                        case SuccessState.Failed:
                            switch (txState.Type)
                            {
                                case TransactionType.Preauth:
                                    this._flow_msg.Info("# PREAUTH TRANSACTION FAILED :(");
                                    this._flow_msg.Info("# Error:", txState.Response.GetError());
                                    this._flow_msg.Info("# Error Detail:", txState.Response.GetErrorDetail());
                                    if (txState.Response != null)
                                    {
                                        var purchaseResponse = new PurchaseResponse(txState.Response);
                                        this._flow_msg.Info("# Response:", purchaseResponse.GetResponseText());
                                        this._flow_msg.Info("# RRN:", purchaseResponse.GetRRN());
                                        this._flow_msg.Info("# Scheme:", purchaseResponse.SchemeName);
                                        this._flow_msg.Info("# Customer Receipt:");
                                        this._receipt.Info(purchaseResponse.GetCustomerReceipt().trim());
                                    }
                                    break;
                                case TransactionType.AccountVerify:
                                    this._flow_msg.Info("# ACCOUNT VERIFICATION FAILED :(");
                                    this._flow_msg.Info("# Error:", txState.Response.GetError());
                                    this._flow_msg.Info("# Error Detail:", txState.Response.GetErrorDetail());
                                    if (txState.Response != null)
                                    {
                                        var acctVerifyResponse = new AccountVerifyResponse(txState.Response);
                                        var details = acctVerifyResponse.Details;
                                        this._receipt.Info(details.GetCustomerReceipt().trim());
                                    }
                                    break;
                                default:
                                    this._flow_msg.Info("# MOTEL POS DOESN'T KNOW WHAT TO DO WITH THIS TX TYPE WHEN IT FAILS");
                                    break;
                            }
                            break;
                        case SuccessState.Unknown:
                            switch (txState.Type)
                            {
                                case TransactionType.Preauth:
                                    this._flow_msg.Info("# WE'RE NOT QUITE SURE WHETHER PREAUTH TRANSACTION WENT THROUGH OR NOT:/");
                                    this._flow_msg.Info("# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                                    this._flow_msg.Info("# IF YOU CONFIRM THAT THE CUSTOMER PAID, CLOSE THE ORDER.");
                                    this._flow_msg.Info("# OTHERWISE, RETRY THE PAYMENT FROM SCRATCH.");
                                    break;
                                case TransactionType.AccountVerify:
                                    this._flow_msg.Info("# WE'RE NOT QUITE SURE WHETHER ACCOUNT VERIFICATION WENT THROUGH OR NOT:/");
                                    this._flow_msg.Info("# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                                    this._flow_msg.Info("# IF YOU CONFIRM THAT THE CUSTOMER PAID, CLOSE THE ORDER.");
                                    this._flow_msg.Info("# OTHERWISE, RETRY THE PAYMENT FROM SCRATCH.");
                                    break;
                                default:
                                    this._flow_msg.Info("# MOTEL POS DOESN'T KNOW WHAT TO DO WITH THIS TX TYPE WHEN IT's UNKNOWN");
                                    break;
                            }
                            break;
                    }
                }
                break;
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
                        inputsEnabled.push('serial_number');
                        inputsEnabled.push('auto_resolve_eftpos_address');
                        inputsEnabled.push('use_secure_web_sockets');
                        inputsEnabled.push('test_mode');
                        inputsEnabled.push('rcpt_from_eftpos');
                        inputsEnabled.push('sig_flow_from_eftpos');
                        inputsEnabled.push('pair');
                        inputsEnabled.push('save_settings');
                        inputsEnabled.push('print_merchant_copy_input');
                        inputsEnabled.push('save_receipt');
                        // inputsEnabled.push('print');
                        inputsEnabled.push('pos_vendor_key');

                        if(!this.IsUnknownStatus())
                        {
                            inputsEnabled.push('eftpos_address');
                        }
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
                inputsEnabled.push('rcpt_from_eftpos');
                inputsEnabled.push('sig_flow_from_eftpos');
                inputsEnabled.push('save_settings');
                // .. but otherwise we give the same options as PairedConnected
                // goto case SpiStatus.PairedConnected;

                if(!this.IsUnknownStatus())
                {
                    inputsEnabled.push('eftpos_address');
                }

            case SpiStatus.PairedConnected:
                switch (this._spi.CurrentFlow)
                {
                    case SpiFlow.Idle: // Paired, Idle
                        inputsEnabled.push('amount_input');
                        inputsEnabled.push('preauth_ref_input');
                        inputsEnabled.push('save_settings');

                        inputsEnabled.push('surcharge_amount_input');
                        inputsEnabled.push('suppress_merchant_password_input');
                        inputsEnabled.push('terminal_status');

                        inputsEnabled.push('acct_verify');
                        inputsEnabled.push('preauth_open');
                        inputsEnabled.push('preauth_topup');
                        inputsEnabled.push('preauth_topdown');
                        inputsEnabled.push('preauth_extend');
                        inputsEnabled.push('preauth_complete');
                        inputsEnabled.push('preauth_cancel');

                        inputsEnabled.push('unpair');
                        inputsEnabled.push('rcpt_from_eftpos');
                        inputsEnabled.push('sig_flow_from_eftpos');
                        break;
                    case SpiFlow.Transaction: // Paired, Transaction
                        if (this._spi.CurrentTxFlowState.AwaitingSignatureCheck)
                        {
                            inputsEnabled.push('tx_sign_accept');
                            inputsEnabled.push('tx_sign_decline');
                        }

                        if(this.IsUnknownStatus())
                        {
                            inputsEnabled.push('ok_retry');
                            inputsEnabled.push('ok_override_paid');
                            inputsEnabled.push('ok_cancel');
                        }

                        if (!this._spi.CurrentTxFlowState.Finished && !this._spi.CurrentTxFlowState.AttemptingToCancel)
                        {
                            inputsEnabled.push('tx_cancel');
                        }
                        else
                        {
                            switch (this._spi.CurrentTxFlowState.Success) 
                            {
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
        let inputs = document.querySelectorAll('.input');
        for(let i = 0; i < inputs.length; i++) 
        {
            inputs[i].disabled = true;
        }

        inputsEnabled.forEach((input) => 
        {
            document.getElementById(input).disabled = false;
        });

        this._flow_msg.Info();
    }

    IsUnknownStatus()
    {
        if (this._spi.CurrentFlow == SpiFlow.Transaction) 
        {
            if (this._spi.CurrentTxFlowState.Finished && this._spi.CurrentTxFlowState.Success == SuccessState.Unknown)
            {
                return true;
            }
        }

        return false;
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
        document.getElementById('settings_form').addEventListener('submit', (e) => {

            e.preventDefault();

            if(this._spi.CurrentStatus === SpiStatus.Unpaired && this._spi.CurrentFlow === SpiFlow.Idle) 
            {
                this._posId         = document.getElementById('pos_id').value;
                this._apiKey        = document.getElementById('pos_vendor_key').value;
                this._eftposAddress = document.getElementById('eftpos_address').value;
                this._serialNumber  = document.getElementById('serial_number').value;
                this._testMode      = document.getElementById('test_mode').checked;
                this._useSecureWebSockets       = document.getElementById('use_secure_web_sockets').checked;
                this._autoResolveEftposAddress  = document.getElementById('auto_resolve_eftpos_address').checked;

                this._spi.SetPosId(this._posId);
                this._spi.SetDeviceApiKey(this._apiKey);
                this._spi.SetEftposAddress(this._eftposAddress);
                this._spi.SetSerialNumber(this._serialNumber);
                this._spi.SetTestMode(this._testMode);
                this._spi.SetSecureWebSockets(this._useSecureWebSockets);
                this._spi.SetAutoAddressResolution(this._autoResolveEftposAddress);

                localStorage.setItem('pos_id', this._posId);
                localStorage.setItem('pos_vendor_key', this._apiKey);
                localStorage.setItem('eftpos_address', this._eftposAddress);
                localStorage.setItem('auto_resolve_eftpos_address', this._autoResolveEftposAddress);
                localStorage.setItem('serial_number', this._serialNumber);
                localStorage.setItem('test_mode', this._testMode);
                localStorage.setItem('use_secure_web_sockets', this._useSecureWebSockets);

                this._log.info(`Saved settings`);
            }

            this._spi.Config.PromptForCustomerCopyOnEftpos = document.getElementById('rcpt_from_eftpos').checked;
            this._spi.Config.SignatureFlowOnEftpos = document.getElementById('sig_flow_from_eftpos').checked;

            localStorage.setItem('rcpt_from_eftpos', this._spi.Config.PromptForCustomerCopyOnEftpos);
            localStorage.setItem('sig_flow_from_eftpos', this._spi.Config.SignatureFlowOnEftpos);

            this.PrintPairingStatus();
        });

        document.getElementById('auto_resolve_eftpos_address').addEventListener('change', () => 
        {
            document.getElementById('eftpos_address').disabled = document.getElementById('auto_resolve_eftpos_address').checked;
        });

        document.getElementById('use_secure_web_sockets').addEventListener('change', () => 
        {
            var isSecure = document.getElementById('use_secure_web_sockets').checked;

            this._spi.SetSecureWebSockets(isSecure);
        });  
        
        document.getElementById('pair').addEventListener('click', () => 
        {
            this._spi.Pair();
        });

        document.getElementById('pair_confirm').addEventListener('click', () => 
        {
            this._spi.PairingConfirmCode();
        });

        document.getElementById('pair_cancel').addEventListener('click', () => 
        {
            this._spi.PairingCancel();
        });

        document.getElementById('unpair').addEventListener('click', () => 
        {
            this._spi.Unpair();
        });

        document.getElementById('acct_verify').addEventListener('click', () => 
        {
            let posRefId    = `actvfy-${new Date().toISOString()}`; 
            let res         = this._spiPreauth.InitiateAccountVerifyTx(posRefId);
            this._flow_msg.Info(res.Initiated ? "# Verify Initiated. Will be updated with Progress." : `# Could not initiate account verify request: ${res.Message}. Please Retry.`);
        });

        document.getElementById('preauth_open').addEventListener('click', () => 
        {
            let amount      = parseInt(document.getElementById('amount').value,10);
            let posRefId    = `propen-${new Date().toISOString()}`; 
            let res         = this._spiPreauth.InitiateOpenTx(posRefId, amount);
            this._flow_msg.Info(res.Initiated ? "# Preauth Initiated. Will be updated with Progress." : `# Could not initiate preauth request: ${res.Message}. Please Retry.`);
        });

        document.getElementById('preauth_topup').addEventListener('click', () => 
        {
            let amount      = parseInt(document.getElementById('amount').value,10);
            let preauthId   = document.getElementById('preauth_ref').value; 
            let ref         = `prtopup-${preauthId}-${new Date().toISOString()}`; 
            let res         = this._spiPreauth.InitiateTopupTx(ref, preauthId, amount);
            this._flow_msg.Info(res.Initiated ? "# Preauth topup Initiated. Will be updated with Progress." : `# Could not initiate preauth topup request: ${res.Message}. Please Retry.`);
        });
        
        document.getElementById('preauth_topdown').addEventListener('click', () => 
        {
            let amount      = parseInt(document.getElementById('amount').value,10);
            let preauthId   = document.getElementById('preauth_ref').value; 
            let ref         = `prtopd-${preauthId}-${new Date().toISOString()}`; 
            let res         = this._spiPreauth.InitiatePartialCancellationTx(ref, preauthId, amount);
            this._flow_msg.Info(res.Initiated ? "# Preauth topdown Initiated. Will be updated with Progress." : `# Could not initiate preauth topdown request: ${res.Message}. Please Retry.`);
        });

        document.getElementById('preauth_extend').addEventListener('click', () => 
        {
            let preauthId   = document.getElementById('preauth_ref').value; 
            let ref         = `prext-${preauthId}-${new Date().toISOString()}`; 
            let res         = this._spiPreauth.InitiateExtendTx(ref, preauthId);
            this._flow_msg.Info(res.Initiated ? "# Preauth extend Initiated. Will be updated with Progress." : `# Could not initiate preauth extend request: ${res.Message}. Please Retry.`);
        });

        document.getElementById('preauth_cancel').addEventListener('click', () => 
        {
            let preauthId   = document.getElementById('preauth_ref').value; 
            let ref         = `prcancel-${preauthId}-${new Date().toISOString()}`; 
            let res         = this._spiPreauth.InitiateCancelTx(ref, preauthId);
            this._flow_msg.Info(res.Initiated ? "# Preauth cancel Initiated. Will be updated with Progress." : `# Could not initiate preauth cancel request: ${res.Message}. Please Retry.`);
        });

        document.getElementById('preauth_complete').addEventListener('click', () => 
        {
            let amount      = parseInt(document.getElementById('amount').value,10);
            let preauthId   = document.getElementById('preauth_ref').value; 
            let ref         = `prcomp-${preauthId}-${new Date().toISOString()}`; 
            let res         = this._spiPreauth.InitiateCompletionTx(ref, preauthId, amount);
            this._flow_msg.Info(res.Initiated ? "# Preauth complete Initiated. Will be updated with Progress." : `# Could not initiate preauth complete request: ${res.Message}. Please Retry.`);
        });

        document.getElementById('tx_sign_accept').addEventListener('click', () => 
        {
            this._spi.AcceptSignature(true);
        });

        document.getElementById('tx_sign_decline').addEventListener('click', () => 
        {
            this._spi.AcceptSignature(false);
        });

        document.getElementById('tx_cancel').addEventListener('click', () => 
        {
            this._spi.CancelTransaction();
        });

        document.getElementById('ok').addEventListener('click', () => 
        {
            this._spi.AckFlowEndedAndBackToIdle();
            this._flow_msg.Clear();
            this._flow_msg.innerHTML = "Select from the options below";
            this.PrintStatusAndActions();
        });

        document.getElementById('ok_cancel').addEventListener('click', () => 
        {
            this._spi.AckFlowEndedAndBackToIdle();
            this._log.clear();
            this._flow_msg.innerHTML = "Order Cancelled";
            this.PrintStatusAndActions();
        });

        document.getElementById('print_merchant_copy').addEventListener('click', () => 
        {
            this._spi.Config.PrintMerchantCopy = document.getElementById('print_merchant_copy').checked;
            this._flow_msg.Clear();
            this._spi.AckFlowEndedAndBackToIdle();
            this.PrintStatusAndActions();
        });

        document.getElementById('save_receipt').addEventListener('click', () => 
        {
            this._options.SetCustomerReceiptHeader(this.SanitizePrintText(document.getElementById('receipt_header').value));
            this._options.SetMerchantReceiptHeader(this.SanitizePrintText(document.getElementById('receipt_header').value));

            this._options.SetCustomerReceiptFooter(this.SanitizePrintText(document.getElementById('receipt_footer').value));
            this._options.SetMerchantReceiptFooter(this.SanitizePrintText(document.getElementById('receipt_footer').value));

            this._flow_msg.Clear();
            this._flow_msg.Info(`Receipt header / footer updated.`);
            this._spi.AckFlowEndedAndBackToIdle();
            this.PrintStatusAndActions();
        });

        document.getElementById('print').addEventListener('click', () => 
        {
            var header   = document.getElementById('receipt_header').value;
            var footer   = document.getElementById('receipt_footer').value;

            var payload = this.SanitizePrintText(header + footer);

            this._spi.PrintReceipt(this._apiKey, payload);
        });

        document.getElementById('terminal_status').addEventListener('click', () => 
        {
            this._spi.GetTerminalStatus();
        });

        document.getElementById('recover').addEventListener('click', () => 
        {
            this._flow_msg.Clear();
            var posRefId = document.getElementById('pos_ref_id').value;
            var res = this._spi.InitiateRecovery(posRefId, TransactionType.Purchase);
            this._flow_msg.Info(res.Initiated ? "# Recovery Initiated. Will be updated with Progress." : `# Could not initiate recovery. ${res.Message}. Please Retry.`);
        });
    }

    LoadPersistedState()
    {
        if(localStorage.getItem('pos_id')) 
        {
            this._posId = localStorage.getItem('pos_id');
            document.getElementById('pos_id').value = this._posId;
        } 
        else 
        {
            this._posId = document.getElementById('pos_id').value;
        }

        if(localStorage.getItem('pos_vendor_key')) 
        {
            this._apiKey = localStorage.getItem('pos_vendor_key');
            document.getElementById('pos_vendor_key').value = this._apiKey;
        } 
        else 
        {
            this._apiKey = document.getElementById('pos_vendor_key').value;
        }

        if(localStorage.getItem('eftpos_address')) 
        {
            this._eftposAddress = localStorage.getItem('eftpos_address');
            document.getElementById('eftpos_address').value = this._eftposAddress;
        } 
        else 
        {
            this._eftposAddress = document.getElementById('eftpos_address').value;
        }

        this._rcpt_from_eftpos = document.getElementById('rcpt_from_eftpos').checked = localStorage.getItem('rcpt_from_eftpos') === 'true' || false;
        this._sig_flow_from_eftpos = document.getElementById('sig_flow_from_eftpos').checked = localStorage.getItem('sig_flow_from_eftpos') === 'true' || false;

        if(localStorage.getItem('EncKey') && localStorage.getItem('HmacKey')) 
        {
            this._spiSecrets = new Secrets(localStorage.getItem('EncKey'), localStorage.getItem('HmacKey'));
        }

        if(localStorage.getItem('serial_number')) 
        {
            this._serialNumber = localStorage.getItem('serial_number');
            document.getElementById('serial_number').value = this._serialNumber;
        } 

        if(localStorage.getItem('auto_resolve_eftpos_address')) 
        {
            this._autoResolveEftposAddress = localStorage.getItem('auto_resolve_eftpos_address');
            document.getElementById('auto_resolve_eftpos_address').checked = this._autoResolveEftposAddress;
        } 

        this._testMode = document.getElementById('test_mode').checked = localStorage.getItem('test_mode') === 'true' || false;
        this._useSecureWebSockets = document.getElementById('use_secure_web_sockets').checked = localStorage.getItem('use_secure_web_sockets') === 'true' || false;
    }

    SanitizePrintText(printText)
    {
        printText = printText.replace("\\emphasis", "\emphasis");
        printText = printText.replace("\\clear", "\clear");
        return printText.replace("\r\n", "\n");
    }
}

/**
 * Start the POS
 */
document.addEventListener('DOMContentLoaded', () => 
{
    try 
    {
        let log         = console;
        let receipt     = new Logger(document.getElementById('receipt_output'),`\n\n \\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/ \n\n`);
        let flow_msg    = new Logger(document.getElementById('flow_msg'));
        let pos         = new MotelPos(log, receipt, flow_msg);
        pos.Start();
    } 
    catch(err) 
    {
        console.error(err);
    }
});

