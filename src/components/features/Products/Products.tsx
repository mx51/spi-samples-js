import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsPairedTerminalStatus } from '../../../features/terminals/terminalSelectors';

function Products() {
  const isTerminalPaired = useSelector(selectIsPairedTerminalStatus);

  return (
    <div>
      <h2>All Products</h2>
      <button disabled={!isTerminalPaired} type="button">
        Checkout $5
      </button>
    </div>
  );
}

export default Products;
