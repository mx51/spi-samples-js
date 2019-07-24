import {
    Spi, 
    Logger, 
    Secrets, 
    TransactionOptions,
    TransactionType,
    PrintingResponse,
    RefundResponse,
    TerminalStatusResponse,
    TerminalBattery,
    CashoutOnlyResponse,
    MotoPurchaseResponse,
    GetLastTransactionResponse,
    PurchaseResponse,
    PreauthResponse,
    Settlement,
    SuccessState,
    RequestIdHelper,
    SpiFlow,
    SpiStatus} from '../lib/spi-client-js';
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
        this._version = '2.6.0';
        this._serialNumber = "";
        this._rcpt_from_eftpos = false;
        this._sig_flow_from_eftpos = false;
        this._print_merchant_copy = false;

        this._log = log;
        this._receipt = receipt;
        this._flow_msg = flow_msg;
    }

    Start()
    {
        this._log.info("Starting MotelPos...");
        this.LoadPersistedState();

        // region Spi Setup
        // This is how you instantiate Spi.
        this._spi = new Spi(this._posId, this._serialNumber, this._eftposAddress, this._spiSecrets); // It is ok to not have the secrets yet to start with.
        this._spi.Config.PromptForCustomerCopyOnEftpos = this._rcpt_from_eftpos;
        this._spi.Config.SignatureFlowOnEftpos = this._sig_flow_from_eftpos;
        this._spi.Config.PrintMerchantCopy = this._print_merchant_copy;

        this._spi.SetPosInfo("assembly", this._version);

        document.addEventListener('StatusChanged', (e) => this.OnSpiStatusChanged(e.detail)); 
        document.addEventListener('PairingFlowStateChanged', (e) => this.OnPairingFlowStateChanged(e.detail)); 
        document.addEventListener('SecretsChanged', (e) => this.OnSecretsChanged(e.detail)); 
        document.addEventListener('TxFlowStateChanged', (e) => this.OnTxFlowStateChanged(e.detail)); 

        this._spi.PrintingResponse = this.HandlePrintingResponse.bind(this);
        this._spi.TerminalStatusResponse = this.HandleTerminalStatusResponse.bind(this);
        this._spi.BatteryLevelChanged = this.HandleBatteryLevelChanged.bind(this);

        this._spiPreauth = this._spi.EnablePreauth();
        this._spi.Start();

        // And Now we just accept user input and display to the user what is happening.

        this._flow_msg.Clear();
        this._flow_msg.Info("# Welcome to MotelPos !");
        
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
                                    this._receipt.Info(!details.WasCustomerReceiptPrinted() ? details.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
                                    break;
                                case TransactionType.AccountVerify:
                                    this._flow_msg.Info("# ACCOUNT VERIFICATION SUCCESS");
                                    var acctVerifyResponse = new AccountVerifyResponse(txState.Response);
                                    var details = acctVerifyResponse.Details;
                                    this._flow_msg.Info("# Response:", details.GetResponseText());
                                    this._flow_msg.Info("# RRN:", details.GetRRN());
                                    this._flow_msg.Info("# Scheme:", details.SchemeName);
                                    this._flow_msg.Info("# Merchant Receipt:");
                                    this._receipt.Info(!details.WasCustomerReceiptPrinted() ? details.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
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
                                    if (txState.Response != null)
                                    {
                                        this._flow_msg.Info("# Error:", txState.Response.GetError());
                                        this._flow_msg.Info("# Error Detail:", txState.Response.GetErrorDetail());
                                        var purchaseResponse = new PurchaseResponse(txState.Response);
                                        this._flow_msg.Info("# Response:", purchaseResponse.GetResponseText());
                                        this._flow_msg.Info("# RRN:", purchaseResponse.GetRRN());
                                        this._flow_msg.Info("# Scheme:", purchaseResponse.SchemeName);
                                        this._flow_msg.Info("# Customer Receipt:");
                                        this._receipt.Info(!purchaseResponse.WasCustomerReceiptPrinted() ? purchaseResponse.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
                                    }
                                    break;
                                case TransactionType.AccountVerify:
                                    this._flow_msg.Info("# ACCOUNT VERIFICATION FAILED :(");

                                    if (txState.Response != null)
                                    {
                                        this._flow_msg.Info("# Error:", txState.Response.GetError());
                                        this._flow_msg.Info("# Error Detail:", txState.Response.GetErrorDetail());
                                        var acctVerifyResponse = new AccountVerifyResponse(txState.Response);
                                        var details = acctVerifyResponse.Details;
                                        this._receipt.Info(!details.WasMerchantReceiptPrinted() ? details.GetMerchantReceipt().trim() : "# PRINTED FROM EFTPOS");
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
                        inputsEnabled.push('eftpos_address');
                        inputsEnabled.push('rcpt_from_eftpos');
                        inputsEnabled.push('sig_flow_from_eftpos');
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
                inputsEnabled.push('rcpt_from_eftpos');
                inputsEnabled.push('sig_flow_from_eftpos');
                inputsEnabled.push('save_settings');
                // .. but otherwise we give the same options as PairedConnected
                // goto case SpiStatus.PairedConnected;

            case SpiStatus.PairedConnected:
                switch (this._spi.CurrentFlow)
                {
                    case SpiFlow.Idle: // Paired, Idle
                        inputsEnabled.push('amount_input');
                        inputsEnabled.push('surcharge_input');
                        inputsEnabled.push('preauth_ref_input');
                        inputsEnabled.push('save_settings');

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
                        inputsEnabled.push('print_merchant_copy');
                        break;
                    case SpiFlow.Transaction: // Paired, Transaction
                        if (this._spi.CurrentTxFlowState.AwaitingSignatureCheck)
                        {
                            inputsEnabled.push('tx_sign_accept');
                            inputsEnabled.push('tx_sign_decline');
                        }

                        if (!this._spi.CurrentTxFlowState.Finished && !this._spi.CurrentTxFlowState.AttemptingToCancel)
                        {
                            inputsEnabled.push('tx_cancel');
                        }

                        if(this._spi.CurrentTxFlowState.Finished) 
                        {
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
        let inputs = document.querySelectorAll('.input');
        for(let i = 0; i < inputs.length; i++) 
        {
            inputs[i].disabled = true;
        }

        inputsEnabled.forEach((input) => 
        {
            let inputEl = document.getElementById(input);
            if(!inputEl) throw new Error(`Input element not found to enable: ${input}`);
            inputEl.disabled = false;
        });

        this._flow_msg.Info();
    }

    PrintPairingStatus()
    {
        this._flow_msg.Info(`# --------------- STATUS ------------------`);
        this._flow_msg.Info(`# ${this._posId} <-> Eftpos: ${this._eftposAddress} #`);
        this._flow_msg.Info(`# SPI STATUS: ${this._spi.CurrentStatus}     FLOW: ${this._spi.CurrentFlow} #`);
        this._flow_msg.Info(`# SPI CONFIG: ${JSON.stringify(this._spiPreauth.Config)}`);
        this._flow_msg.Info(`# -----------------------------------------`);
        this._flow_msg.Info(`# POS: v${this._version} Spi: v${Spi.GetVersion()}`);

    }

    AcceptUserInput()
    {
        document.getElementById('save_settings').addEventListener('click', () => {

            if(this._spi.CurrentStatus === SpiStatus.Unpaired && this._spi.CurrentFlow === SpiFlow.Idle) 
            {
                this._posId         = document.getElementById('pos_id').value;
                this._eftposAddress = document.getElementById('eftpos_address').value;

                this._spi.SetPosId(this._posId);
                this._spi.SetEftposAddress(this._eftposAddress);

                localStorage.setItem('pos_id', this._posId);
                localStorage.setItem('eftpos_address', this._eftposAddress);
                this._log.info(`Saved settings ${this._posId}:${this._eftposAddress}`);
            }

            this._spiPreauth.Config.EnabledPromptForCustomerCopyOnEftpos = document.getElementById('rcpt_from_eftpos').checked;
            this._spiPreauth.Config.EnabledSignatureFlowOnEftpos = document.getElementById('sig_flow_from_eftpos').checked;
            this._spiPreauth.Config.EnabledPrintMerchantCopy = document.getElementById('print_merchant_copy').checked;

            localStorage.setItem('rcpt_from_eftpos', this._spiPreauth.Config.EnabledPromptForCustomerCopyOnEftpos);
            localStorage.setItem('sig_flow_from_eftpos', this._spiPreauth.Config.EnabledSignatureFlowOnEftpos);
            localStorage.setItem('print_merchant_copy', this._spiPreauth.Config.EnabledPrintMerchantCopy);

            this.PrintPairingStatus();
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
            let surcharge   = parseInt(document.getElementById('surcharge').value,10);
            let preauthId   = document.getElementById('preauth_ref').value; 
            let ref         = `prcomp-${preauthId}-${new Date().toISOString()}`; 
            let res         = this._spiPreauth.InitiateCompletionTx(ref, preauthId, amount, surcharge);
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
        this._print_merchant_copy = document.getElementById('print_merchant_copy').checked = localStorage.getItem('print_merchant_copy') === 'true' || false;

        if(localStorage.getItem('EncKey') && localStorage.getItem('HmacKey')) 
        {
            this._spiSecrets = new Secrets(localStorage.getItem('EncKey'), localStorage.getItem('HmacKey'));
        }
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

