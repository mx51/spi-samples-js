import React, { useState } from 'react';
import Input from '../Input/Input';

function RefundPay(props: { handleRefundPay: Function }) {
  const { handleRefundPay } = props;
  const [refundAmount, setRefundAmount] = useState(0);

  return (
    <>
      <h2 className="sub-header mb-0">Refund</h2>

      <Input
        id="Refund-Amount"
        name="Refund"
        label="Refund Amount"
        type="number"
        onChange={(e: any) => setRefundAmount(parseInt(e.target.value, 10) / 100)}
      />
      <p className="ml-2">Cents</p>
      <button className="primary-button" type="button" onClick={() => handleRefundPay(refundAmount)}>
        Refund
      </button>
    </>
  );
}

export default RefundPay;
