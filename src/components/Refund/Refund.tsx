import React, { useState } from 'react';
// import { TransactionOptions } from '@assemblypayments/spi-client-js';
import { Col, Row } from 'react-bootstrap';
import './Refund.css';
import Input from '../Input/Input';

import { refund as refundService } from '../../services';

// import { moto as motoService } from '../../services';

function Refund(props: { visible: Boolean; onClose: Function; spi: any }) {
  const { onClose, visible, spi } = props;
  // const [totalPaid, setTotalPaid] = useState<number>(0);
  // const [transactionStatus, setTransactionStatus] = useState<boolean>(false);
  // function toggle() {
  //   document.body.classList.toggle('flyout-toggle');
  // }

  function RefundTransaction() {
    const [RefundAmount, setRefundAmount] = useState(0);

    return (
      <div className="ml-4 mr-4">
        <Input
          id="Refund-Amount"
          name="Refund"
          label="Refund Amount"
          onChange={(e: any) => setRefundAmount(parseInt(e.target.value, 10))}
        />
        <p className="ml-2">Cents</p>
        <button
          className="primary-button"
          type="button"
          onClick={() => refundService.initiateRefund({ Info: () => {} }, spi, RefundAmount * 100, false)}
        >
          Refund
        </button>
      </div>
    );
  }

  return (
    <div className={`checkout-page1 ${visible ? '' : 'd-none'}`}>
      <Col sm={2} className="checkout-order min-vh-100 sticky-top">
        <button type="button" className="primary-button checkout-button" onClick={() => onClose()}>
          Back
        </button>
      </Col>
      <Col sm={10}>
        <div className="checkout-page-flyout">
          <button type="button" className="checkout-flyout-toggle" onClick={() => onClose()}>
            {'▼'}
          </button>
          <Row>
            <Col sm={4} className="sub-column">
              <h2 className="sub-header mb-0">Refund </h2>
              <Row>
                <RefundTransaction />
              </Row>
            </Col>
            <Col sm={5} className="sub-column">
              <h2 className="sub-header mb-0">Flow</h2>
            </Col>
            <Col sm={3} className="sub-column">
              <h2 className="sub-header mb-0">Receipt</h2>
            </Col>
          </Row>
        </div>
      </Col>
    </div>
  );
}

export default Refund;
