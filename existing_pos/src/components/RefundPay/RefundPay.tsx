import React, { useState } from 'react';
import { Input } from '../Input';

function RefundPay(props: { handleRefundPay: Function }) {
  const { handleRefundPay } = props;
  const [refundAmount, setRefundAmount] = useState(0);

  return (
    <>
      <h2 className="sub-header mb-0">Refund</h2>
      <div>
        <form
          onSubmit={(e: React.SyntheticEvent) => {
            e.preventDefault();
            handleRefundPay(refundAmount);
          }}
        >
          <div className="mr-4 ml-4 mt-4">
            <Input
              id="inpRefundAmount"
              name="Refund"
              label="Refund Amount"
              pattern="^[1-9][0-9]*$"
              title="Amount should be positive and more than 0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRefundAmount(parseInt(e.target.value, 10) / 100)}
            />
            <p className="ml-2">Cents</p>
          </div>
          <button id="refundButton" className="primary-button checkout-button mb-0" type="submit">
            Refund
          </button>
        </form>
      </div>
    </>
  );
}

export default RefundPay;
