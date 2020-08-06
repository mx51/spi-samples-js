import React, { useState } from 'react';
import { Input } from '../Input';

function CashOutPay(props: { handleCashoutPay: Function }) {
  const { handleCashoutPay } = props;
  const [cashoutAmount, setCashoutAmount] = useState(0);

  return (
    <>
      <h2 className="sub-header mb-0">Cashout</h2>
      <div>
        <form
          onSubmit={(e: React.SyntheticEvent) => {
            e.preventDefault();
            handleCashoutPay(cashoutAmount);
          }}
        >
          <div className="mr-4 ml-4 mt-4">
            <Input
              id="inpCashoutAmount"
              name="Cashout"
              pattern="^[1-9][0-9]*$"
              label="Cashout Amount"
              title="Amount should be positive and more than 0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCashoutAmount(parseInt(e.target.value, 10) / 100)
              }
            />
            <p className="ml-2">Cents</p>
          </div>
          <button id="cashoutButton" className="primary-button checkout-button mb-0" type="submit">
            Cashout
          </button>
        </form>
      </div>
    </>
  );
}

export default CashOutPay;
