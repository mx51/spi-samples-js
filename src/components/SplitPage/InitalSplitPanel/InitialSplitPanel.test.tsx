import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { InitialSplitPanel } from './InitialSplitPanel';
import mockWithRedux from '../../../utils/tests/common';

describe('InitialSplitPanel', () => {
  const totalAmount = 100;
  const onClickNext = jest.fn();

  it('should render the component', () => {
    const container = mockWithRedux(<InitialSplitPanel totalAmount={totalAmount} onClickNext={onClickNext} />);

    // Assert that the component is rendered
    expect(container).toMatchSnapshot();
  });

  it('should call onClickNext when the next button is clicked', () => {
    mockWithRedux(<InitialSplitPanel totalAmount={totalAmount} onClickNext={onClickNext} />);

    // Simulate a click event on the next button
    fireEvent.click(screen.getByText('Next'));

    // Assert that onClickNext is called with the correct parameters
    expect(onClickNext).toHaveBeenCalledWith('splitEvenly', 2, 100);
  });
});
