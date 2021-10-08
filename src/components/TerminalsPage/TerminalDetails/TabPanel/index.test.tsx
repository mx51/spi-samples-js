import React from 'react';
import { cleanup } from '@testing-library/react';
import TabPanel from '.';
import mockWithRedux, { defaultMockTerminals, mockTerminalInstanceId } from '../../../../utils/tests/common';

describe('Test <TabPanel />', () => {
  const handleDrawerToggle = jest.fn();

  afterEach(cleanup);

  test('should match TabPanel snapshot test', () => {
    // Arrange
    const container = mockWithRedux(
      <TabPanel
        flow={false}
        index={0}
        setFlow={handleDrawerToggle()}
        subtitle="Test tab 1 subtitle"
        title="Test tab 1 title"
        value={0}
        receiptToggle={false}
        terminal={defaultMockTerminals[mockTerminalInstanceId]}
      >
        <div>Test Panel One</div>
      </TabPanel>
    );

    // Assert
    expect(container).toMatchSnapshot();
    expect(container.innerHTML.includes('<div>Test Panel One</div>')).toBeTruthy();
    expect(handleDrawerToggle).toHaveBeenCalled();
  });

  test('should show receipt panel when receiptToggle value is true', () => {
    const container = mockWithRedux(
      <TabPanel
        flow
        index={1}
        setFlow={handleDrawerToggle()}
        subtitle="Test tab 2 subtitle"
        title="Test tab 2 title"
        value={1}
        receiptToggle
        terminal={defaultMockTerminals[mockTerminalInstanceId]}
      >
        <div>Test Panel Two</div>
      </TabPanel>
    );

    expect(container.innerHTML.includes('Receipt')).toBeTruthy();
    expect(container.innerHTML.includes('Test Panel Two')).toBeTruthy();
    expect(handleDrawerToggle).toHaveBeenCalled();
  });
});
