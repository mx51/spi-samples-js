import React from 'react';

function Moto(props: { transactionStatus: boolean; payActionType: Function }) {
  const { transactionStatus, payActionType } = props;
  return (
    <>
      <div className="ml-4 mr-4">
        <p>
          Please click process as Moto button{' '}
          <span role="img" aria-label="down arrow">
            👇
          </span>{' '}
          to process your payment
        </p>
      </div>
      <button
        id="motoPay"
        className="primary-button checkout-button mb-0"
        type="button"
        disabled={transactionStatus}
        onClick={() => {
          payActionType();
        }}
      >
        MOTO
      </button>
    </>
  );
}

export default Moto;
