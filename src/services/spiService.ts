import { Spi as SpiClient, SpiFlow, TerminalConfigurationResponse, TransactionOptions } from '@mx51/spi-client-js';
import { SPI_PAIR_STATUS, TEXT_FORM_MODAL_CODE_WESTPAC } from '../definitions/constants/commonConfigs';

const events = ['DeviceAddressChanged', 'StatusChanged', 'PairingFlowStateChanged', 'TxFlowStateChanged'];
const currentVersion = '2.8.5';
const defaultPosName = 'mx51';
const defaultPrivateIPAddress = '192.168.1.1';
const defaultEmptyString = '';
const defaultTrueString = 'true';
const defaultCountryCode = 'AU';

class SpiService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private storedSpi: any;

  private spi: TSpiObject;

  private posId: string;

  private eftposAddress: string;

  private spiSecrets: unknown;

  private options: TSpiOption;

  private posName: string;

  private version: string;

  private rcptFromEftpos: boolean;

  private sigFlowFromEftpos: boolean;

  private apiKey: string;

  private serialNumber: string;

  private acquirerCode: string;

  private autoResolveEftposAddress: boolean;

  private testMode: boolean;

  private useSecureWebSockets: boolean;

  private log;

  private printMerchantCopy: boolean;

  constructor() {
    if (window.localStorage.getItem('spi')) {
      this.storedSpi = window.localStorage.getItem('spi') || null;
    }
    this.spi = null;
    this.posId = window.localStorage.getItem('posID') || defaultEmptyString;
    // this.eftposAddress = window.localStorage.getItem('eftpos_address') || defaultPrivateIPAddress;
    this.eftposAddress =
      this.storedSpi.configuration.option === 'eftpos' ? this.storedSpi.configuration.value : defaultPrivateIPAddress;
    this.spiSecrets = null;
    this.options = null;
    this.version = currentVersion;
    this.rcptFromEftpos = window.localStorage.getItem('rcpt_from_eftpos') === defaultTrueString;
    this.sigFlowFromEftpos = window.localStorage.getItem('check-sig-eftpos') === defaultTrueString;
    this.printMerchantCopy = window.localStorage.getItem('print_merchant_copy_input') === defaultTrueString;
    /* ----- Step 1: start ----- */
    // this.apiKey = window.localStorage.getItem('api_key') || defaultEmptyString;
    this.apiKey = this.storedSpi.apikey.value || defaultEmptyString;
    // this.serialNumber = window.localStorage.getItem('serial') || defaultEmptyString;
    this.serialNumber = this.storedSpi.serialNumber.value || defaultEmptyString;
    // this.acquirerCode = window.localStorage.getItem('tenant_code') || defaultEmptyString;
    this.acquirerCode = this.storedSpi.provider.value || defaultPrivateIPAddress;
    // this.posName = defaultPosName;
    this.posName = this.storedSpi.posId.value || defaultPosName;
    // this.autoResolveEftposAddress = window.localStorage.getItem('auto_address') === defaultTrueString;
    this.autoResolveEftposAddress =
      this.storedSpi.configuration.option === 'auto' ? this.storedSpi.configuration.value : defaultPrivateIPAddress;
    // this._acquirerCode = window.localStorage.getItem('tenant_code') || defaultTrueString;
    this.acquirerCode = this.storedSpi.provider.value || defaultEmptyString;
    // this.testMode = window.localStorage.getItem('test_mode') === defaultTrueString;
    this.testMode = this.storedSpi.testMode.value || defaultTrueString;
    /* ----- Step 1: end ----- */
    this.useSecureWebSockets = window.localStorage.getItem('use_secure_web_sockets') === defaultTrueString;
    this.log = console;
    const secretsString = window.localStorage.getItem('secrets') || defaultEmptyString;

    try {
      const secrets = JSON.parse(secretsString);

      if (secrets) {
        this.spiSecrets = secrets;
      }
    } catch (error) {
      this.log.error('unable to access secrets');
    }

    // Where there is an existing pairing and no tenant code set, default to wbc
    if (!this.acquirerCode && this.spiSecrets) {
      this.acquirerCode = TEXT_FORM_MODAL_CODE_WESTPAC;
      // window.localStorage.setItem('tenant_code', TEXT_FORM_MODAL_CODE_WESTPAC); // we have spi object: this.spi.provider.value
    }

    this.getTenantsList();
  }

  start(): void {
    try {
      this.spi = new SpiClient(this.posId, this.serialNumber, this.eftposAddress, this.spiSecrets); // It is ok to not have the secrets yet to start with.
      this.spi.Config.PromptForCustomerCopyOnEftpos = this.rcptFromEftpos;
      this.spi.Config.SignatureFlowOnEftpos = this.sigFlowFromEftpos;
      this.spi.Config.PrintMerchantCopy = this.printMerchantCopy;
      this.spi.SetPosInfo(this.posName, this.version);
      this.spi.SetAcquirerCode(this.acquirerCode);
      this.spi.SetDeviceApiKey(this.apiKey);

      this.options = new TransactionOptions();
      this.options.SetCustomerReceiptHeader(window.localStorage.getItem('receipt_header_input') || '');
      this.options.SetCustomerReceiptFooter(window.localStorage.getItem('receipt_footer_input') || '');
      this.options.SetMerchantReceiptHeader(window.localStorage.getItem('receipt_header_input') || '');
      this.options.SetMerchantReceiptFooter(window.localStorage.getItem('receipt_footer_input') || '');
    } catch (error) {
      this.log.info(error.Message);
      return;
    }

    this.onSpiStateChange = this.onSpiStateChange.bind(this);
    events.map((eventName) => document.addEventListener(eventName, this.onSpiStateChange));
    document.addEventListener('SecretsChanged', SpiService.onSecretsChange);

    this.spi.PrintingResponse = this.onSpiResponse.bind(this);
    this.spi.TerminalConfigurationResponse = SpiService.onTerminalConfigurationChange;
    this.spi.TerminalStatusResponse = this.onSpiResponse.bind(this);
    this.spi.BatteryLevelChanged = this.onSpiResponse.bind(this);
    this.spi.TransactionUpdateMessage = SpiService.onSpiTransactionUpdate.bind(this);

    this.setAutoAddressResolutionState();
    this.spi.Start(); // spi library pair start function to start pairing terminal
    this.printStatusAndActions();
  }

  async getTenantsList(): Promise<void> {
    const tenants = await SpiClient.GetAvailableTenants(this.posName, this.apiKey, defaultCountryCode);
    const defaultTenantList = [
      {
        code: 'wbc',
        name: 'Westpac Presto',
      },
      {
        code: 'til',
        name: 'Till Payments',
      },
    ];
    localStorage.setItem('tenants', JSON.stringify(tenants.Data.length ? tenants.Data : defaultTenantList));
  }

  onSpiStateChange(evt: TSpiEvent): void {
    if (evt.detail && evt.detail === SPI_PAIR_STATUS.CONNECTED) {
      this.spi.AckFlowEndedAndBackToIdle();
    }
  }

  static onSecretsChange(evt: TSpiEvent): void {
    window.localStorage.setItem('secrets', JSON.stringify(evt.detail));
  }

  static onTerminalConfigurationChange(m: unknown): void {
    const terminalConfigurationResponse = new TerminalConfigurationResponse(m);
    window.localStorage.setItem('serialNumber', terminalConfigurationResponse.GetSerialNumber());
  }

  static onSpiTransactionUpdate(m: unknown): void {
    document.dispatchEvent(new CustomEvent('TxnUpdateMessage', { detail: m }));
  }

  onSpiResponse(): void {
    this.spi.AckFlowEndedAndBackToIdle();
    this.printStatusAndActions();
  }

  setAutoAddressResolutionState(): void {
    this.spi.SetTestMode(this.testMode);
    this.spi.SetSecureWebSockets(this.useSecureWebSockets);
    this.spi.SetAutoAddressResolution(this.autoResolveEftposAddress);
  }

  printStatusAndActions(): void {
    this.printFlowInfo();
  }

  printFlowInfo(): void {
    if (SpiFlow.Pairing) {
      this.log.info(this.spi.CurrentPairingFlowState);
      // redux action dispatch pair flow state update
    }

    if (SpiFlow.Transaction) {
      this.log.info(this.spi.CurrentTxFlowState);
      // redux action dispatch pair flow state update
    }
  }
}

export default SpiService;
