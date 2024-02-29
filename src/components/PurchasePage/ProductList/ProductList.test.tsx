import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import * as redux from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';
import ProductList from '.';
import ReduxProvider from '../../../redux/ReduxProvider';
import { store } from '../../../redux/store';

describe('Test <ProductList />', () => {
  test('snapshot for ProductList component', () => {
    const { container } = render(
      <ReduxProvider reduxStore={store}>
        <Router>
          <ProductList />
        </Router>
      </ReduxProvider>
    );
    expect(container).toMatchSnapshot();
  });

  test('addProduct when clicking product', () => {
    const spy = jest.spyOn(redux, 'useDispatch');
    const dispatch = jest.fn();
    spy.mockReturnValue(dispatch);

    const { getByText } = render(
      <ReduxProvider reduxStore={store}>
        <Router>
          <ProductList />
        </Router>
      </ReduxProvider>
    );

    fireEvent.click(getByText(/Mocha/i));
    expect(dispatch.mock.calls.length).toBe(2);
    expect(dispatch.mock.calls[0][0]).toEqual({
      payload: 0,
      type: 'product/addKeypadAmount',
    });
    expect(dispatch.mock.calls[1][0]).toEqual({
      payload: { product: { id: 1, image: 'images/product/mocha.png', name: 'Mocha', price: 420 } },
      type: 'product/addProduct',
    });
  });
});
