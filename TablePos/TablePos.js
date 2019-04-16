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
    Settlement,
    SuccessState,
    RequestIdHelper,
    SpiFlow,
    SpiStatus} from '@assemblypayments/spi-client-js/dist/spi-client-js';

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
class TablePos
{
    constructor(log, receipt, flow_msg) 
    {
        this._spi = null;
        this._posId = "TABLEPOS1";
        this._eftposAddress = "192.168.1.1";
        this._spiSecrets = null;
        this._version = '2.1.0';
        this._rcpt_from_eftpos = false;
        this._sig_flow_from_eftpos = false;

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

        this._log = log;
        this._receipt = receipt;
        this._flow_msg = flow_msg;
    }

    Start()
    {
        this._log.info("Starting TablePos...");
        this.LoadPersistedState();

        // region Spi Setup
        // This is how you instantiate Spi.
        this._spi = new Spi(this._posId, this._eftposAddress, this._spiSecrets); // It is ok to not have the secrets yet to start with.
        this._spi.Config.PromptForCustomerCopyOnEftpos = this._rcpt_from_eftpos;
        this._spi.Config.SignatureFlowOnEftpos = this._sig_flow_from_eftpos;

        this._spi.SetPosInfo("assembly", this._version);

        document.addEventListener('StatusChanged', (e) => this.OnSpiStatusChanged(e.detail)); 
        document.addEventListener('PairingFlowStateChanged', (e) => this.OnPairingFlowStateChanged(e.detail)); 
        document.addEventListener('SecretsChanged', (e) => this.OnSecretsChanged(e.detail)); 
        document.addEventListener('TxFlowStateChanged', (e) => this.OnTxFlowStateChanged(e.detail)); 

        this._pat = this._spi.EnablePayAtTable();
        this._pat.Config.LabelTableId = "Table Number";
        this._pat.GetBillStatus = this.PayAtTableGetBillDetails.bind(this);
        this._pat.BillPaymentReceived = this.PayAtTableBillPaymentReceived.bind(this);
        this._spi.Start();

        // And Now we just accept user input and display to the user what is happening.

        this._flow_msg.Clear();
        this._flow_msg.Info("# Welcome to TablePos !");
        
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

    // region PayAtTable Delegates

    // <param name="billId"></param>
    // <param name="tableId"></param>
    // <param name="operatorId"></param>
    // <returns></returns>
    PayAtTableGetBillDetails(billId, tableId, operatorId)
    {
        if (!billId)
        {
            // We were not given a billId, just a tableId.
            // This means that we are being asked for the bill by its table number.

            // Let's see if we have it.
            if (!this.tableToBillMapping[tableId])
            {
                // We didn't find a bill for this table.
                // We just tell the Eftpos that.
                return Object.assign(new BillStatusResponse(), { Result: BillRetrievalResult.INVALID_TABLE_ID });
            }

            // We have a billId for this Table.
            // Let's set it so we can retrieve it.
            billId = this.tableToBillMapping[tableId];
        }

        if (!this.billsStore[billId])
        {
            // We could not find the billId that was asked for.
            // We just tell the Eftpos that.
            return Object.assign(new BillStatusResponse(), { Result: BillRetrievalResult.INVALID_BILL_ID });
        }

        var myBill = this.billsStore[billId];

        var response = Object.assign(new BillStatusResponse(),
        {
            Result: BillRetrievalResult.SUCCESS,
            BillId: billId,
            TableId: tableId,
            TotalAmount: myBill.TotalAmount,
            OutstandingAmount: myBill.OutstandingAmount
        });

        let billData = this.assemblyBillDataStore[billId];

        response.BillData = billData;
        return response;
    }

    // <param name="billPayment"></param>
    // <param name="updatedBillData"></param>
    PayAtTableBillPaymentReceived(billPayment, updatedBillData)
    {
        if (!this.billsStore[billPayment.BillId])
        {
            // We cannot find this bill.
            return Object.assign(new BillStatusResponse(), { Result: BillRetrievalResult.INVALID_BILL_ID });
        }

        this._flow_msg.Info(`# Got a ${billPayment.PaymentType} Payment against bill ${billPayment.BillId} for table ${billPayment.TableId}`);
        var bill = this.billsStore[billPayment.BillId];
        bill.OutstandingAmount -= billPayment.PurchaseAmount;
        bill.tippedAmount += billPayment.TipAmount;
        this._flow_msg.Info(`Updated Bill: ${JSON.stringify(bill)}`);

        // Here you can access other data that you might want to store from this payment, for example the merchant receipt.
        // billPayment.PurchaseResponse.GetMerchantReceipt();

        // It is important that we persist this data on behalf of assembly.
        this.assemblyBillDataStore[billPayment.BillId] = updatedBillData;

        return Object.assign(new BillStatusResponse(),
        {
            Result: BillRetrievalResult.SUCCESS,
            OutstandingAmount: bill.OutstandingAmount,
            TotalAmount: bill.TotalAmount
        });
    }


    // endregion

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

                if (txState.Finished)
                {
                   switch(txState.Success) 
                   {
                        case SuccessState.Success:
                            switch (txState.Type)
                            {
                                case TransactionType.Purchase:
                                    this._flow_msg.Info(`# WOOHOO - WE GOT PAID!`);
                                    let purchaseResponse = new PurchaseResponse(txState.Response);
                                    this._flow_msg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
                                    this._flow_msg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
                                    this._flow_msg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
                                    this._flow_msg.Info(`# Customer Receipt:`);
                                    this._receipt.Info(!purchaseResponse.WasCustomerReceiptPrinted() ? purchaseResponse.GetCustomerReceipt().trim() : `# PRINTED FROM EFTPOS`);
                                    this._flow_msg.Info(`# PURCHASE: ${purchaseResponse.GetPurchaseAmount()}`);
                                    this._flow_msg.Info(`# TIP: ${purchaseResponse.GetTipAmount()}`);
                                    this._flow_msg.Info(`# CASHOUT: ${purchaseResponse.GetCashoutAmount()}`);
                                    this._flow_msg.Info(`# BANKED NON-CASH AMOUNT: ${purchaseResponse.GetBankNonCashAmount()}`);
                                    this._flow_msg.Info(`# BANKED CASH AMOUNT: ${purchaseResponse.GetBankCashAmount()}`);
                                    break;
                                case TransactionType.Refund:
                                    this._flow_msg.Info(`# REFUND GIVEN- OH WELL!`);
                                    let refundResponse = new RefundResponse(txState.Response);
                                    this._flow_msg.Info(`# Response: ${refundResponse.GetResponseText()}`);
                                    this._flow_msg.Info(`# RRN: ${refundResponse.GetRRN()}`);
                                    this._flow_msg.Info(`# Scheme: ${refundResponse.SchemeName}`);
                                    this._flow_msg.Info(`# Customer Receipt:`);
                                    this._receipt.Info(!refundResponse.WasCustomerReceiptPrinted() ? refundResponse.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
                                    this._flow_msg.Info(`# REFUNDED AMOUNT: ${refundResponse.GetRefundAmount()}`);
                                    break;
                                case TransactionType.Settle:
                                    this._flow_msg.Info("# SETTLEMENT SUCCESSFUL!");
                                    if (txState.Response != null)
                                    {
                                        let settleResponse = new Settlement(txState.Response);
                                        this._flow_msg.Info(`# Response: ${settleResponse.GetResponseText()}`);
                                        this._flow_msg.Info("# Merchant Receipt:");
                                        this._receipt.Info(settleResponse.GetReceipt().trim());
                                    }
                                    break;
                            }
                        break;
                        case SuccessState.Failed:
                            switch (txState.Type)
                            {
                                case TransactionType.Purchase:
                                    this._flow_msg.Info(`# WE DID NOT GET PAID :(`);
                                    if (txState.Response != null)
                                    {
                                        let purchaseResponse = new PurchaseResponse(txState.Response);
                                        this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
                                        this._flow_msg.Info(`# Response: ${purchaseResponse.GetResponseText()}`);
                                        this._flow_msg.Info(`# RRN: ${purchaseResponse.GetRRN()}`);
                                        this._flow_msg.Info(`# Scheme: ${purchaseResponse.SchemeName}`);
                                        this._flow_msg.Info(`# Customer Receipt:`);
                                        this._receipt.Info(!purchaseResponse.WasCustomerReceiptPrinted()
                                            ? purchaseResponse.GetCustomerReceipt().trim()
                                            : `# PRINTED FROM EFTPOS`);
                                    }
                                    break;
                                case TransactionType.Refund:
                                    this._flow_msg.Info(`# REFUND FAILED!`);
                                    if (txState.Response != null)
                                    {
                                        let refundResponse = new RefundResponse(txState.Response);
                                        this._flow_msg.Info(`# Response: ${refundResponse.GetResponseText()}`);
                                        this._flow_msg.Info(`# RRN: ${refundResponse.GetRRN()}`);
                                        this._flow_msg.Info(`# Scheme: ${refundResponse.SchemeName}`);
                                        this._flow_msg.Info(`# Customer Receipt:`);
                                        this._receipt.Info(!refundResponse.WasCustomerReceiptPrinted() ? refundResponse.GetCustomerReceipt().trim() : "# PRINTED FROM EFTPOS");
                                    }
                                    break;
                                case TransactionType.Settle:
                                    this._flow_msg.Info("# SETTLEMENT FAILED!");
                                    if (txState.Response != null)
                                    {
                                        let settleResponse = new Settlement(txState.Response);
                                        this._flow_msg.Info(`# Response: ${settleResponse.GetResponseText()}`);
                                        this._flow_msg.Info(`# Error: ${txState.Response.GetError()}`);
                                        this._flow_msg.Info("# Merchant Receipt:");
                                        this._receipt.Info(settleResponse.GetReceipt());
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
                                case TransactionType.Purchase:
                                    this._flow_msg.Info("# WE'RE NOT QUITE SURE WHETHER WE GOT PAID OR NOT :/");
                                    this._flow_msg.Info("# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                                    this._flow_msg.Info("# IF YOU CONFIRM THAT THE CUSTOMER PAID, CLOSE THE ORDER.");
                                    this._flow_msg.Info("# OTHERWISE, RETRY THE PAYMENT FROM SCRATCH.");
                                    break;
                                case TransactionType.Refund:
                                    this._flow_msg.Info("# WE'RE NOT QUITE SURE WHETHER THE REFUND WENT THROUGH OR NOT :/");
                                    this._flow_msg.Info("# CHECK THE LAST TRANSACTION ON THE EFTPOS ITSELF FROM THE APPROPRIATE MENU ITEM.");
                                    this._flow_msg.Info("# YOU CAN THE TAKE THE APPROPRIATE ACTION.");
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
                        inputsEnabled.push('table_input');
                        inputsEnabled.push('bill_id_input');
                        inputsEnabled.push('save_settings');

                        inputsEnabled.push('open');
                        inputsEnabled.push('add');
                        inputsEnabled.push('close');
                        inputsEnabled.push('tables');
                        inputsEnabled.push('table');
                        inputsEnabled.push('bill');

                        inputsEnabled.push('purchase');
                        inputsEnabled.push('refund');
                        inputsEnabled.push('settle');

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
            document.getElementById(input).disabled = false;
        });

        this._flow_msg.Info();
    }

    PrintPairingStatus()
    {
        this._flow_msg.Info(`# --------------- STATUS ------------------`);
        this._flow_msg.Info(`# ${this._posId} <-> Eftpos: ${this._eftposAddress} #`);
        this._flow_msg.Info(`# SPI STATUS: ${this._spi.CurrentStatus}     FLOW: ${this._spi.CurrentFlow} #`);
        this._flow_msg.Info(`# SPI CONFIG: ${JSON.stringify(this._spi.Config)}`);
        this._flow_msg.Info("# ----------------TABLES-------------------");
        this._flow_msg.Info(`#    Open Tables: ${Object.keys(this.tableToBillMapping).length}`);
        this._flow_msg.Info(`# Bills in Store: ${Object.keys(this.billsStore).length}`);
        this._flow_msg.Info(`# Assembly Bills: ${Object.keys(this.assemblyBillDataStore).length}`);
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
            }

            this._spi.Config.PromptForCustomerCopyOnEftpos = document.getElementById('rcpt_from_eftpos').checked;
            this._spi.Config.SignatureFlowOnEftpos = document.getElementById('sig_flow_from_eftpos').checked;

            localStorage.setItem('rcpt_from_eftpos', this._spi.Config.PromptForCustomerCopyOnEftpos);
            localStorage.setItem('sig_flow_from_eftpos', this._spi.Config.SignatureFlowOnEftpos);

            this._log.info(`Saved settings ${this._posId}:${this._eftposAddress}`);

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

        document.getElementById('open').addEventListener('click', () => 
        {
            let table = document.getElementById('table_number').value;
            if(!table) 
            {
                this._flow_msg.Info('# Please give a table number');
                return false;
            }

            this.openTable(table);
        });

        document.getElementById('close').addEventListener('click', () => 
        {
            let table = document.getElementById('table_number').value;
            if(!table) 
            {
                this._flow_msg.Info('# Please give a table number');
                return false;
            }
            this.closeTable(table);
        });

        document.getElementById('add').addEventListener('click', () => 
        {
            let table   = document.getElementById('table_number').value;
            let amount  = parseInt(document.getElementById('amount').value,10);
            if(!table) 
            {
                this._flow_msg.Info('# Please give a table number');
                return false;
            }
            if(!amount) 
            {
                this._flow_msg.Info('# Please enter an amount');
                return false;
            }
            this.addToTable(table, amount);
        });
        
        document.getElementById('table').addEventListener('click', () => 
        {
            let table = document.getElementById('table_number').value;
            if(!table) 
            {
                this._flow_msg.Info('# Please give a table number');
                return false;
            }
            this.printTable(table);
        });

        document.getElementById('bill').addEventListener('click', () => 
        {
            let billId = document.getElementById('bill_id').value;
            if(!billId) 
            {
                this._flow_msg.Info('# Please give a bill number');
                return false;
            }
            this.printBill(billId);
        });

        document.getElementById('tables').addEventListener('click', () => 
        {
            this.printTables();
        });

        document.getElementById('purchase').addEventListener('click', () => 
        {
            let posRefId        = `purchase-${new Date().toISOString()}`; 
            let purchaseAmount  = parseInt(document.getElementById('amount').value,10);
            let tipAmount       = 0;
            let cashoutAmount   = 0;
            let promptForCashout = false;
            let res             = this._spi.InitiatePurchaseTxV2(posRefId, purchaseAmount, tipAmount, cashoutAmount, promptForCashout);
            if (!res.Initiated)
            {
                this._flow_msg.Info(`# Could not initiate purchase: ${res.Message}. Please Retry.`);
            }
        });
    
        document.getElementById('refund').addEventListener('click', () => 
        {
            let amount      = parseInt(document.getElementById('amount').value,10);
            let posRefId    = `refund-${new Date().toISOString()}`; 
            let res         = this._spi.InitiateRefundTx(posRefId, amount);
            this._flow_msg.Info(res.Initiated ? "# Refund Initiated. Will be updated with Progress." : `# Could not initiate refund: ${res.Message}. Please Retry.`);
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

        document.getElementById('settle').addEventListener('click', () => 
        {
            let res = this._spi.InitiateSettleTx(RequestIdHelper.Id("settle"));
            this._flow_msg.Info(res.Initiated ? "# Settle Initiated. Will be updated with Progress." : `# Could not initiate settle: ${res.Message}. Please Retry.`);
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

    //region My Pos Functions

    openTable(tableId)
    {
        if (this.tableToBillMapping[tableId])
        {
            this._flow_msg.Info(`Table Already Open: ${JSON.stringify(this.billsStore[this.tableToBillMapping[tableId]])}`);
            return;
        }

        let newBill = Object.assign(new Bill(), { BillId: this.newBillId(), TableId: tableId });
        this.billsStore[newBill.BillId] = newBill;
        this.tableToBillMapping[newBill.TableId] = newBill.BillId;
        this.SaveBillState();
        this._flow_msg.Info(`Opened: ${JSON.stringify(newBill)}`);
    }

    addToTable(tableId, amountCents)
    {
        if (!this.tableToBillMapping[tableId])
        {
            this._flow_msg.Info("Table not Open.");
            return;
        }
        let bill = this.billsStore[this.tableToBillMapping[tableId]];
        bill.TotalAmount += amountCents;
        bill.OutstandingAmount += amountCents;
        this.SaveBillState();
        this._flow_msg.Info(`Updated: ${JSON.stringify(bill)}`);
    }

    closeTable(tableId)
    {
        if (!this.tableToBillMapping[tableId])
        {
            this._flow_msg.Info("Table not Open.");
            return;
        }
        var bill = this.billsStore[this.tableToBillMapping[tableId]];
        if (bill.OutstandingAmount > 0)
        {
            this._flow_msg.Info(`Bill not Paid Yet: ${JSON.stringify(bill)}`);
            return;
        }
        
        delete this.billsStore[this.tableToBillMapping[tableId]];
        delete this.tableToBillMapping[tableId];
        delete this.assemblyBillDataStore[bill.BillId];
        this.SaveBillState();
        this._flow_msg.Info(`Closed: ${JSON.stringify(bill)}`);
    }

    printTable(tableId)
    {
        if (!this.tableToBillMapping[tableId])
        {
            this._flow_msg.Info("Table not Open.");
            return;
        }
        this.printBill(this.tableToBillMapping[tableId]);
    }

    printTables()
    {
        if (Object.keys(this.tableToBillMapping).length > 0) 
        { 
            this._flow_msg.Info("# Open Tables: "); 
            for(let table in this.tableToBillMapping)
            {
                this._flow_msg.Info(`# Table #${table}, Bill #${this.tableToBillMapping[table]}`);
            }
        } 
        else 
        {  
            this._flow_msg.Info("# No Open Tables."); 
        }

        if (Object.keys(this.billsStore).length > 0) 
        {
            this._flow_msg.Info("# My Bills Store: ");

            for(let bill in this.billsStore)
            {
                this._flow_msg.Info("# " + this.billsStore[bill].toString());
            }
        }

        if (Object.keys(this.assemblyBillDataStore).length > 0) 
        {
            this._flow_msg.Info("# Assembly Bills Data: " + JSON.stringify(this.assemblyBillDataStore));
        }
    }

    printBill(billId)
    {
        if (!this.billsStore[billId])
        {
            this._flow_msg.Info("Bill Not Found.");
            return;
        }
        this._flow_msg.Info(`Bill: ${this.billsStore[billId].toString()}`);
    }

    newBillId()
    {
        return ((Date.now() * 1000) + new Date().getMilliseconds()).toString();
    }

    // endregion


    SaveBillState() 
    {
        localStorage.setItem('tableToBillMapping', JSON.stringify(this.tableToBillMapping));
        localStorage.setItem('billsStore', JSON.stringify(this.billsStore));
        localStorage.setItem('assemblyBillDataStore', JSON.stringify(this.assemblyBillDataStore));
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

        if(localStorage.getItem('EncKey') && localStorage.getItem('HmacKey')) 
        {
            this._spiSecrets = new Secrets(localStorage.getItem('EncKey'), localStorage.getItem('HmacKey'));
        }

        this.tableToBillMapping     = JSON.parse(localStorage.getItem('tableToBillMapping') || '{}');
        this.assemblyBillDataStore  = JSON.parse(localStorage.getItem('assemblyBillDataStore') || '{}');
        let savedBillData           = JSON.parse(localStorage.getItem('billsStore') || '{}');

        for(let bill in savedBillData)
        {
            this.billsStore[bill] = Object.assign(new Bill(), savedBillData[bill]);
        }
    }
}


class Bill
{
    constructor() 
    {
        this.BillId = null;
        this.TableId = null;
        this.TotalAmount = 0;
        this.OutstandingAmount = 0;
        this.tippedAmount = 0;
    }
}
Bill.prototype.toString = function() 
{
    return `${this.BillId} - Table:${this.TableId} Total:$${(this.TotalAmount / 100).toFixed(2)} Outstanding:$${(this.OutstandingAmount / 100).toFixed(2)} Tips:$${(this.tippedAmount / 100).toFixed(2)}`;
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
        let pos         = new TablePos(log, receipt, flow_msg);
        pos.Start();
    } 
    catch(err) 
    {
        console.error(err);
    }
});

