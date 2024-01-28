import React from 'react';
import { cleanup, screen } from '@testing-library/react';
import { TransactionType } from '@mx51/spi-client-js';
import OrderFinished from '.';
import { renderWithProviders } from '../../utils/tests/test-utils';
import { generateTerminalMockData, generateTxFlowMockData } from '../../utils/tests/test-data';
import { messageEvents } from '../../definitions/constants/commonConfigs';

afterEach(cleanup);

describe('Page: /order-finished', () => {
  const terminalId = '500-000-010';
  test('render correctly for a successful purchase transaction', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              override: false,
              purchaseAmount: 960,
              success: 'Success',
              eventName: messageEvents.purchase,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PURCHASE APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('subTotal')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('surchage')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('cashout')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('tip')).toHaveTextContent('$0.00');
  });

  test('render correctly for a successful purchase transaction with tip', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              override: false,
              purchaseAmount: 960,
              tipAmount: 100,
              success: 'Success',
              eventName: messageEvents.purchase,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PURCHASE APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$10.60');
    expect(screen.getByTestId('subTotal')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('surchage')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('cashout')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('tip')).toHaveTextContent('$1.00');
  });

  test('render correctly for a successful purchase transaction with surcharge', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              override: false,
              purchaseAmount: 960,
              surchargeAmount: 100,
              success: 'Success',
              eventName: messageEvents.purchase,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PURCHASE APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$10.60');
    expect(screen.getByTestId('subTotal')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('surchage')).toHaveTextContent('$1.00');
    expect(screen.getByTestId('cashout')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('tip')).toHaveTextContent('$0.00');
  });

  test('render correctly for a successful purchase transaction with cashout', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              override: false,
              purchaseAmount: 960,
              bankCashAmount: 2040,
              success: 'Success',
              eventName: messageEvents.purchase,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PURCHASE APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$30.00');
    expect(screen.getByTestId('subTotal')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('surchage')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('cashout')).toHaveTextContent('$20.40');
    expect(screen.getByTestId('tip')).toHaveTextContent('$0.00');
  });

  test('render correctly for a failed purchase transaction', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              override: false,
              purchaseAmount: 960,
              success: 'Failed',
              eventName: messageEvents.purchase,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PURCHASE DECLINED')).toBeInTheDocument();
    expect(screen.getByTestId('fail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('subTotal')).toHaveTextContent('$9.60');
    expect(screen.getByTestId('surchage')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('cashout')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('tip')).toHaveTextContent('$0.00');
  });

  test('render correctly for an override purchase transaction', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              override: true,
              purchaseAmount: 2000,
              tipAmount: 0,
              surchargeAmount: 0,
              bankCashAmount: 0,
              success: 'Success',
              eventName: messageEvents.purchase,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PURCHASE APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$20.00');
    expect(screen.getByTestId('subTotal')).toHaveTextContent('$20.00');
    expect(screen.getByTestId('surchage')).toHaveTextContent('$0');
    expect(screen.getByTestId('cashout')).toHaveTextContent('$0');
    expect(screen.getByTestId('tip')).toHaveTextContent('$0');
  });

  test('render correctly for a successful refund transaction', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              override: false,
              purchaseAmount: 960,
              success: 'Success',
              type: TransactionType.Refund,
              eventName: messageEvents.refund,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('REFUND APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$9.60');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refund/ })).toBeInTheDocument();
  });
  test('render correctly for a failed refund transaction', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              override: false,
              purchaseAmount: 960,
              success: 'Failed',
              type: TransactionType.Refund,
              eventName: messageEvents.refund,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('REFUND DECLINED')).toBeInTheDocument();
    expect(screen.getByTestId('fail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$9.60');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Refund/ })).toBeInTheDocument();
  });

  test('render correctly for a successful cashout only transaction', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              purchaseAmount: 0,
              override: false,
              bankCashAmount: 1000,
              success: 'Success',
              type: TransactionType.CashoutOnly,
              eventName: messageEvents.cash,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('CASHOUT APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$10.00');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cashout/ })).toBeInTheDocument();
  });

  test('render correctly for a pre-auth account verify', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              purchaseAmount: 0,
              override: false,
              bankCashAmount: 0,
              preAuthAmount: 0,
              success: 'Success',
              type: TransactionType.AccountVerify,
              eventName: messageEvents.accountVerify,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('ACCOUNT VERIFIED APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });

  test('render correctly for a pre-auth open', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              purchaseAmount: 1000,
              override: false,
              preAuthAmount: 1000,
              success: 'Success',
              type: TransactionType.Preauth,
              eventName: messageEvents.preauthOpen,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PREAUTH OPEN APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$10.00');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });

  test('render correctly for a pre-auth extend', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              purchaseAmount: 0,
              override: false,
              success: 'Success',
              type: TransactionType.Preauth,
              eventName: messageEvents.preauthExtend,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PREAUTH EXTEND APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });

  test('render correctly for a pre-auth cancel', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              purchaseAmount: 0,
              override: false,
              preAuthAmount: 0,
              success: 'Success',
              type: TransactionType.Preauth,
              eventName: messageEvents.preauthCancellation,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PREAUTH CANCEL APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$0.00');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });

  // Verified
  test('render correctly for a pre-auth topup', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              purchaseAmount: 1000,
              override: false,
              bankCashAmount: 0,
              preAuthAmount: 2000,
              balanceAmount: 3000,
              topupAmount: 1000,
              success: 'Success',
              type: TransactionType.Preauth,
              eventName: messageEvents.preauthTopup,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PREAUTH TOPUP APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$10.00');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });

  // Verified
  test('render correctly for a pre-auth reduce', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              purchaseAmount: 500,
              override: false,
              success: 'Success',
              type: TransactionType.Preauth,
              eventName: messageEvents.preauthPartialCancellation,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PREAUTH REDUCE APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$5.00');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });

  test('render correctly for a pre-auth complete', () => {
    renderWithProviders(<OrderFinished />, {
      preloadedState: {
        selectedTerminal: { selectedTerminalId: terminalId },
        terminals: {
          [terminalId]: generateTerminalMockData({
            terminalId,
            pairingFlow: null,
            txFlow: generateTxFlowMockData({
              purchaseAmount: 500,
              override: false,
              success: 'Success',
              type: TransactionType.Preauth,
              eventName: messageEvents.preauthComplete,
            }),
          }),
        },
      },
    });

    expect(screen.getByText('PREAUTH COMPLETE APPROVED')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('total')).toHaveTextContent('$5.00');
    expect(screen.queryByTestId('subTotal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('surchage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('cashout')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tip')).not.toBeInTheDocument();
  });
});
