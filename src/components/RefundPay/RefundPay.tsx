import React, { useState } from 'react';
import { Input } from '../Input';

function handleKeyPress(event: any) {
  if (event.key < '0' || event.key > '9') {
    event.preventDefault();
    return false;
  }
  return true;
}

function RefundPay(props: { handleRefundPay: Function }) {
  const { handleRefundPay } = props;
  const [refundAmount, setRefundAmount] = useState(0);

  return (
    <>
      <h2 className="sub-header mb-0">Refund</h2>
      <div className="mr-4 ml-4 mt-4">
        <Input
          id="Refund-Amount"
          name="Refund"
          label="Refund Amount"
          type="number"
          onKeyPress={handleKeyPress}
          onChange={(e: any) => setRefundAmount(parseInt(e.target.value, 10) / 100)}
        />
        <p className="ml-2">Cents</p>
      </div>
      <button
        className="primary-button checkout-button mb-0"
        type="button"
        onClick={() => handleRefundPay(refundAmount)}
      >
        Refund
      </button>
    </>
  );
}

export default RefundPay;
