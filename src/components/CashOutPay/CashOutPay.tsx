import React, { useState } from 'react';
import { Input } from '../Input';

function CashOutPay(props: { handleCashoutPay: Function }) {
  const { handleCashoutPay } = props;
  const [cashoutAmount, setCashoutAmount] = useState(0);

  return (
    <>
      <h2 className="sub-header mb-0">Cashout</h2>
      <div className="mr-4 ml-4 mt-4">
        <Input
          id="Cashout-Amount"
          name="Cashout"
          label="Cashout Amount"
          type="number"
          min="0"
          onChange={(e: any) => setCashoutAmount(parseInt(e.target.value, 10) / 100)}
        />
        <p className="ml-2">Cents</p>
      </div>
      <button
        className="primary-button checkout-button mb-0"
        type="button"
        onClick={() => handleCashoutPay(cashoutAmount)}
      >
        Cashout
      </button>
    </>
  );
}

export default CashOutPay;
