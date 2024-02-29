import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import * as redux from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';
import Order from '.';
import ReduxProvider from '../../../redux/ReduxProvider';
import { store } from '../../../redux/store';

describe('Test <Order />', () => {
  test('snapshot for Order component', () => {
    const { container } = render(
      <ReduxProvider reduxStore={store}>
        <Router>
          <Order disablePayNow={false} isSubtotalEditable={false} bottomButton="payNow" />
        </Router>
      </ReduxProvider>
    );
    expect(container).toMatchSnapshot();
  });

  test('clearAll should clear the products', () => {
    const spy = jest.spyOn(redux, 'useDispatch');
    const dispatch = jest.fn();
    spy.mockReturnValue(dispatch);

    const { getByText } = render(
      <ReduxProvider reduxStore={store}>
        <Router>
          <Order disablePayNow={false} isSubtotalEditable={false} bottomButton="payNow" />
        </Router>
      </ReduxProvider>
    );

    fireEvent.click(getByText(/clear all/i));
    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({ payload: undefined, type: 'product/clearAllProducts' });
  });

  test('When click on Add button opens keypad', () => {
    const spy = jest.spyOn(redux, 'useDispatch');
    const dispatch = jest.fn();
    spy.mockReturnValue(dispatch);

    const { getByLabelText, getAllByLabelText, getByText } = render(
      <ReduxProvider reduxStore={store}>
        <Router>
          <Order disablePayNow={false} isSubtotalEditable={false} bottomButton="payNow" />
        </Router>
      </ReduxProvider>
    );

    fireEvent.click(getAllByLabelText(/add amount/i)[2]);
    expect(getByText(/enter tip amount/i)).toBeVisible();

    fireEvent.click(getByText(/5/i));
    fireEvent.click(getByText(/OK/i));

    expect(dispatch.mock.calls.length).toBe(1);
    expect(dispatch.mock.calls[0][0]).toEqual({ payload: 500, type: 'product/addTipAmount' });
    dispatch.mockReset();

    fireEvent.click(getAllByLabelText(/add amount/i)[0]);
    expect(getByText(/enter surcharge amount/i)).toBeVisible();

    fireEvent.click(getAllByLabelText(/add amount/i)[1]);
    expect(getByText(/enter cashout amount/i)).toBeVisible();

    fireEvent.click(getByLabelText(/close button/i));
    expect(dispatch.mock.calls.length).toBe(0);
  });
});
