import React from 'react';

function Moto(props: { handleMotoPay: Function; transactionStatus: boolean }) {
  const { handleMotoPay, transactionStatus } = props;
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
        onClick={() => handleMotoPay()}
      >
        MOTO
      </button>
    </>
  );
}

export default Moto;
