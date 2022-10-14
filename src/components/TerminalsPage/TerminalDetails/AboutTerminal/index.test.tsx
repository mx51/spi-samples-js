import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import AboutTerminal from '.';
import {
  terminalConfigurationsPartOne,
  terminalConfigurationsPartTwo,
} from '../../../../definitions/constants/terminalConfigs';
import spiService from '../../../../services/spiService';
import mockWithRedux, {
  defaultMockTerminals,
  mockSpiClient,
  mockTerminalInstanceId,
} from '../../../../utils/tests/common';

describe('Test <AboutTerminal />', () => {
  let mockContainer: Any;

  beforeEach(() => {
    spiService.spiHardwarePrinterAvailable = jest.fn().mockReturnValue(false);
    mockContainer = mockWithRedux(
      <AboutTerminal
        receiptToggle={{
          settlement: false,
          settlementEnquiry: false,
        }}
        setReceiptToggle={jest.fn()}
        terminal={defaultMockTerminals[mockTerminalInstanceId]}
      />
    );
  });

  afterEach(cleanup);

  test('should match AboutTerminal snapshot test', () => {
    // Assert
    expect(mockContainer).toMatchSnapshot();
  });

  test('should show "%" with battery value when SPI response data is available', () => {
    // Arrange
    const terminal = {
      ...defaultMockTerminals[mockTerminalInstanceId],
      batteryLevel: '70',
    };

    // Act
    const terminalConfigResponse = terminalConfigurationsPartOne(terminal);

    // Assert
    expect(terminalConfigResponse[3].content).toBe('70%');
  });

  test('should show "Yes" value in terminal details page when address type is auto', () => {
    // Arrange
    const terminal = {
      ...defaultMockTerminals[mockTerminalInstanceId],
      autoAddress: true,
    };

    // Act
    const terminalConfigResponse = terminalConfigurationsPartTwo(terminal);

    // Assert
    expect(terminalConfigResponse[1].content).toBe('Yes');
  });

  test('should unpair button on click event function get defined', () => {
    // Arrange
    const handleUnPairClick = jest.fn();
    const terminalDetailsUnpairBtnDOM = mockContainer.querySelector('[data-test-id="terminalDetailsUnpairBtn"]');

    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        Unpair: jest.fn(),
      },
    });

    // Act
    fireEvent.click(terminalDetailsUnpairBtnDOM);
    handleUnPairClick();

    // Assert
    expect(handleUnPairClick).toBeDefined();
    expect(spiService.readTerminalInstance(mockTerminalInstanceId).spiClient.Unpair).toBeCalled();
  });

  test('should toggle settlement panel when clicked settlement button', () => {
    // Arrange
    const handleSettlementDisplay = jest.fn();
    const terminalDetailsSettlementBtnDOM = mockContainer.querySelector(
      '[data-test-id="terminalDetailsSettlementBtn"]'
    );
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettleTx: jest.fn(),
      },
    });

    // Act
    fireEvent.click(terminalDetailsSettlementBtnDOM);
    handleSettlementDisplay();

    // Assert
    expect(handleSettlementDisplay).toBeDefined();
    expect(spiService.readTerminalInstance(mockTerminalInstanceId).spiClient.InitiateSettleTx).toBeCalled();
  });

  test('should toggle settlementEnquiry panel when clicked settlementEnquiry button', () => {
    // Arrange
    const handleSettlementEnquiryDisplay = jest.fn();
    const terminalDetailsSettlementEnquiryBtnBtnDOM = mockContainer.querySelector(
      '[data-test-id="terminalDetailsSettlementEnquiryBtn"]'
    );
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettlementEnquiry: jest.fn(),
      },
    });

    // Act
    fireEvent.click(terminalDetailsSettlementEnquiryBtnBtnDOM);
    handleSettlementEnquiryDisplay();

    // Assert
    expect(handleSettlementEnquiryDisplay).toBeDefined();
    expect(spiService.readTerminalInstance(mockTerminalInstanceId).spiClient.InitiateSettlementEnquiry).toBeCalled();
  });

  test('should call settlement() when settlement value is true', () => {
    // Arrange
    const settlement = jest.fn();
    const handleSettlementDisplay = jest.fn().mockImplementation(() => {
      settlement();
    });
    const newMockContainer = mockWithRedux(
      <AboutTerminal
        receiptToggle={{
          settlement: true,
          settlementEnquiry: false,
        }}
        setReceiptToggle={jest.fn()}
        terminal={defaultMockTerminals[mockTerminalInstanceId]}
      />
    );
    const terminalDetailsSettlementBtnDOM = newMockContainer.querySelector(
      '[data-test-id="terminalDetailsSettlementBtn"]'
    );
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettleTx: jest.fn(),
      },
    });

    // Act
    fireEvent.click(terminalDetailsSettlementBtnDOM);
    handleSettlementDisplay();

    // Assert
    expect(settlement).toBeCalled();
  });

  test('should call settlementEnquiry() when settlementEnquiry value is true', () => {
    // Arrange
    const settlementEnquiry = jest.fn();
    const handleSettlementEnquiryDisplay = jest.fn().mockImplementation(() => {
      settlementEnquiry();
    });
    const newMockContainer = mockWithRedux(
      <AboutTerminal
        receiptToggle={{
          settlement: false,
          settlementEnquiry: true,
        }}
        setReceiptToggle={jest.fn()}
        terminal={defaultMockTerminals[mockTerminalInstanceId]}
      />
    );
    const terminalDetailsSettlementEnquiryBtnBtnDOM = newMockContainer.querySelector(
      '[data-test-id="terminalDetailsSettlementEnquiryBtn"]'
    );
    spiService.readTerminalInstance = jest.fn().mockReturnValue({
      spiClient: {
        ...mockSpiClient,
        InitiateSettlementEnquiry: jest.fn(),
      },
    });

    // Act
    fireEvent.click(terminalDetailsSettlementEnquiryBtnBtnDOM);
    handleSettlementEnquiryDisplay();

    // Assert
    expect(settlementEnquiry).toBeCalled();
  });
});
