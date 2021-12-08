import React, { Suspense } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import AppRoutes from '.';
import FleetSettings from '../components/FleetSettingsPage';
import NotFound from '../components/NotFoundPage';
import Pair from '../components/PairPage';
import PayAtTable from '../components/PayAtTablePage';
import PreAuth from '../components/PreAuthPage';
import Purchase from '../components/PurchasePage';
import Refund from '../components/RefundPage';
import Terminals from '../components/TerminalsPage';

jest.mock('../components/FleetSettingsPage');
jest.mock('../components/PairPage');
jest.mock('../components/PayAtTablePage');
jest.mock('../components/PreAuthPage');
jest.mock('../components/PurchasePage');
jest.mock('../components/RefundPage');
jest.mock('../components/TerminalsPage');
jest.mock('../components/NotFoundPage');

describe('Test AppRoutes', () => {
  afterEach(cleanup);

  test('should show loading page when rendering process is ongoing', () => {
    // Arrange
    const { container } = render(<AppRoutes />);

    // Assert
    expect(container.innerHTML.includes('Loading')).toBe(true);
  });

  test('should be able to render all pages from router', () => {
    // Arrange
    const componentsList = [
      { reference: FleetSettings, component: <FleetSettings />, text: 'FleetSettings Page' },
      { reference: NotFound, component: <NotFound />, text: 'NotFound Page' },
      { reference: Pair, component: <Pair />, text: 'Pair Page' },
      { reference: PayAtTable, component: <PayAtTable />, text: 'PayAtTable Page' },
      { reference: PreAuth, component: <PreAuth />, text: 'PreAuth Page' },
      { reference: Purchase, component: <Purchase />, text: 'Purchase Page' },
      { reference: Refund, component: <Refund />, text: 'Refund Page' },
      { reference: Terminals, component: <Terminals />, text: 'Terminals Page' },
    ];

    // Act
    for (let index = 0; index < componentsList.length; index += 1) {
      (componentsList[index].reference as Any).mockImplementation(() => <div>{componentsList[index].text}</div>);

      render(<MemoryRouter>{componentsList[index].component}</MemoryRouter>);

      // Assert
      expect(screen.getByText(componentsList[index].text)).toBeInTheDocument();
    }
  });

  test('should be able to lazy load route', async () => {
    // Arrange
    (Purchase as Any).mockImplementation(() => <div>Purchase Page</div>);

    // Act
    const { getByText } = render(
      <Suspense fallback={<p>Loading ...</p>}>
        <AppRoutes />
      </Suspense>
    );

    // Assert
    await waitFor(() => expect(getByText(/Purchase/i)).toBeInTheDocument());
  });
});
