import {
  getLocalStorage,
  getTxFlow,
  isShownTerminalDetails,
  removeItemFromLocalStorage,
  setLocalStorage,
  showDeveloperMode,
} from './common';

describe('Test spi common functions', () => {
  test('should be able to setLocalStorage and getLocalStorage', () => {
    // Arrange
    setLocalStorage('test', 'test');
    const testStorage = getLocalStorage('test');

    // Assert
    expect(testStorage).toEqual('test');
  });

  test('test removeItemFromLocalStorage', () => {
    // Arrange
    removeItemFromLocalStorage('test');
    const testStorage = getLocalStorage('test');

    // Assert
    expect(testStorage).toBeNull();
  });

  test('test getTxFlow', () => {
    // Arrange
    const mockResult = {
      posRefId: 'pos_ref_id',
      id: 'Id',
      type: 'Type',
      displayMessage: 'DisplayMessage',
      amountCents: 0,
      awaitingSignatureCheck: false,
      finished: true,
      success: 'Failed',
      signatureRequiredMessage: '',
      request: {
        id: 'Id',
        eventName: 'EventName',
        data: {
          posRefId: 'pos_ref_id',
          purchaseAmount: 0,
          tipAmount: 0,
          cashAmount: 0,
          promptForCashout: 0,
          surchargeAmount: 0,
          promptForCustomerCopy: false,
          printForSignatureRequiredTransactions: false,
          printMerchantCopy: false,
          customerReceiptHeader: '',
          customerReceiptFooter: '',
          merchantReceiptHeader: '',
          merchantReceiptFooter: '',
        },
        posId: '',
        decryptedJson: '',
      },
      response: {
        data: {
          rrn: 'rrn',
          schemeAppName: 'scheme_app_name',
          schemeName: 'scheme_name',
          merchantReceipt: 'merchant_receipt',
          transactionType: 'transaction_type',
          hostResponseText: 'host_response_text',
          purchaseAmount: 0,
          surchargeAmount: 0,
          cashAmount: 0,
          tipAmount: 0,
        },
      },
    };

    const mockInput = {
      detail: {
        PosRefId: 'pos_ref_id',
        Id: 'Id',
        Type: 'Type',
        DisplayMessage: 'DisplayMessage',
        AmountCents: 0,
        AwaitingSignatureCheck: false,
        Finished: true,
        Success: 'Failed',
        SignatureRequiredMessage: '',
        Request: {
          Id: 'Id',
          EventName: 'EventName',
          Data: {
            pos_ref_id: 'pos_ref_id',
            purchase_amount: 0,
            surcharge_amount: 0,
            cash_amount: 0,
            tip_amount: 0,
            prompt_for_cashout: 0,
          },
        },
        Response: {
          Data: {
            rrn: 'rrn',
            scheme_app_name: 'scheme_app_name',
            scheme_name: 'scheme_name',
            merchant_receipt: 'merchant_receipt',
            transaction_type: 'transaction_type',
            host_response_text: 'host_response_text',
            purchase_amount: 0,
            surcharge_amount: 0,
            cash_amount: 0,
            tip_amount: 0,
          },
        },
      },
    };

    // Assert
    expect(getTxFlow(mockInput.detail)).toMatchObject(mockResult);
  });

  test('test isShownTerminalDetails (fail case)', () => {
    // Arrange
    const result = isShownTerminalDetails('/test');

    // Assert
    expect(result).toBeFalsy();
  });

  test('test isShownTerminalDetails (pass case)', () => {
    // Arrange
    const mockTerminals = {
      '123-123-123': {},
    };

    // Act
    setLocalStorage('terminals', JSON.stringify(mockTerminals));
    const result = isShownTerminalDetails('/terminals/123-123-123');

    // Assert
    expect(result).toBeTruthy();
  });

  test('test showDeveloperMode (fil case)', () => {
    // Arrange
    const result = showDeveloperMode('/test');

    // Assert
    expect(result).toBeFalsy();
  });

  test('test showDeveloperMode (pass case)', () => {
    // Arrange
    const mockTerminals = {
      '123-123-123': {},
    };

    // Act
    setLocalStorage('terminals', JSON.stringify(mockTerminals));
    const result = showDeveloperMode('/terminals/123-123-123');

    // Assert
    expect(result).toBeTruthy();
  });
});
