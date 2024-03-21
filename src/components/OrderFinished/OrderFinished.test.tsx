import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import { TransactionType } from '@mx51/spi-client-js';
import OrderFinished from '.';
import { renderWithProviders } from '../../utils/tests/test-utils';
import {
  generateTerminalMockData,
  generateTxFlowMockData,
  generateTxLogItemMockData,
} from '../../utils/tests/test-data';
import { messageEvents } from '../../definitions/constants/commonConfigs';
import { TxLogService } from '../../services/txLogService';
import { PATH_REFUND } from '../../definitions/constants/routerConfigs';

jest.mock('../../services/txLogService');
afterEach(cleanup);

describe('Page: /order-finished', () => {
  const terminalId = '500-000-010';
  let preloadedState: any;

  beforeEach(() => {
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
          }),
        }),
      },
    };
  });

  test('render correctly for a successful purchase transaction', () => {
    const mockTransaction = generateTxLogItemMockData({
      amountCents: 960,
      total: 960,
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$9.60');
    expect(screen.queryByTestId('surcharge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });

  test('render correctly for a successful purchase transaction with tip', () => {
    const mockTransaction = generateTxLogItemMockData({
      amountCents: 960,
      tipAmount: 100,
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.queryByTestId('tip')).toHaveTextContent('$1.00');
  });

  test('render correctly for a successful purchase transaction with surcharge', () => {
    const mockTransaction = generateTxLogItemMockData({
      amountCents: 960,
      surchargeAmount: 100,
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.queryByTestId('surcharge')).toHaveTextContent('$1.00');
  });

  test('render correctly for a successful purchase transaction with cashout', () => {
    const mockTransaction = generateTxLogItemMockData({
      amountCents: 960,
      bankCashAmount: 100,
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.queryByTestId('cashout')).toHaveTextContent('$1.00');
  });

  test('render correctly for a failed purchase transaction', () => {
    const mockTransaction = generateTxLogItemMockData({
      amountCents: 960,
      total: 960,
      successState: 'Failed',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Declined')).toBeInTheDocument();
    expect(screen.getByTestId('fail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$9.60');
    expect(screen.queryByTestId('surcharge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });

  test('render correctly for an override purchase transaction', () => {
    const mockTransaction = generateTxLogItemMockData({
      amountCents: 2000,
      total: 2000,
      override: true,
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByTestId('fail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$20.00');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$20.00');
  });

  test('render correctly for a successful refund transaction', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 2000,
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.Refund,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$20.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refund/ })).toBeInTheDocument();
  });

  test('render correctly for a failed refund transaction', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 860,
      successState: 'Failed',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.Refund,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Declined')).toBeInTheDocument();
    expect(screen.getByTestId('fail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$8.60');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refund/ })).toBeInTheDocument();
  });

  test('render correctly for a successful cashout only transaction', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 1000,
      successState: 'Success',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.CashoutOnly,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$10.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cashout/ })).toBeInTheDocument();
  });

  test('render correctly for a pre-auth account verify', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 0,
      successState: 'Success',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.AccountVerify,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pre-auth/ })).toBeInTheDocument();
  });

  test('render correctly for a pre-auth open', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 1000,
      amountCents: 1000,
      successState: 'Success',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.Preauth,
            eventName: messageEvents.preauthOpen,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$10.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$10.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pre-auth/ })).toBeInTheDocument();
  });

  test('render correctly for a pre-auth extend', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 0,
      successState: 'Success',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.Preauth,
            eventName: messageEvents.preauthExtend,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pre-auth/ })).toBeInTheDocument();
  });

  test('render correctly for a pre-auth cancel', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 0,
      successState: 'Success',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.Preauth,
            eventName: messageEvents.preauthCancellation,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pre-auth/ })).toBeInTheDocument();
  });

  // Verified
  test('render correctly for a pre-auth topup', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 1000,
      amountCents: 1000,
      successState: 'Success',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.Preauth,
            eventName: messageEvents.preauthTopup,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$10.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$10.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pre-auth/ })).toBeInTheDocument();
  });

  // Verified
  test('render correctly for a pre-auth reduce', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 500,
      amountCents: 500,
      successState: 'Success',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.Preauth,
            eventName: messageEvents.preauthPartialCancellation,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$5.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$5.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pre-auth/ })).toBeInTheDocument();
  });

  test('render correctly for a pre-auth complete', () => {
    const mockTransaction = generateTxLogItemMockData({
      total: 500,
      amountCents: 500,
      successState: 'Success',
    });
    TxLogService.findTxByPosRefId = jest.fn().mockReturnValue(mockTransaction);
    preloadedState = {
      selectedTerminal: { selectedTerminalId: terminalId },
      terminals: {
        [terminalId]: generateTerminalMockData({
          terminalId,
          pairingFlow: null,
          txFlow: generateTxFlowMockData({
            purchaseAmount: 0,
            success: 'Success',
            type: TransactionType.Preauth,
            eventName: messageEvents.preauthComplete,
          }),
        }),
      },
    };
    renderWithProviders(<OrderFinished />, { preloadedState });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$5.00');
    expect(screen.queryByTestId('subtotal')).toHaveTextContent('$5.00');
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pre-auth/ })).toBeInTheDocument();
  });
});
