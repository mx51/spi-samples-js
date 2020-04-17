import React, { useState } from 'react';
import { SpiStatus } from '@mx51/spi-client-js';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import SurchargeModal from '../SurchargeModal';
import './Order.scss';

function removeProductQuantityAction(
  id: string,
  list: Array<Product>,
  handleApplySurcharge: Function,
  onChangeProductQuantity: Function
) {
  if (list.length === 1 && list[0].quantity === 1) {
    handleApplySurcharge(0);
  }
  onChangeProductQuantity(id, -1);
}

function CheckoutAction(status: String, onErrorMsg: Function, onCheckout: Function) {
  if (status !== SpiStatus.PairedConnected) {
    onErrorMsg('Please pair your POS to the terminal or check your network connection');
  } else {
    onCheckout();
  }
}
function Order(props: {
  list: Array<Product>;
  onCheckout: Function;
  onRefund: Function;
  onLastTransaction: Function;
  onChangeProductQuantity: Function;
  handleApplySurcharge: Function;
  surchargeAmount: number;
  status: string;
  errorMsg: string;
  onErrorMsg: Function;
}) {
  const {
    list,
    onCheckout,
    onRefund,
    onLastTransaction,
    onChangeProductQuantity,
    handleApplySurcharge,
    surchargeAmount,
    status,
    errorMsg,
    onErrorMsg,
  } = props;

  const [showSurcharge, setShowSurcharge] = useState(false);
  const [surcharge, setSurcharge] = useState<number>(0);

  const subTotalAmount: number = list.reduce(
    (total: number, product: Product) => total + parseFloat(product.price) * product.quantity,
    0
  );
  const totalAmount = subTotalAmount + surchargeAmount / 100;

  function removeProductQuantity(id: string) {
    removeProductQuantityAction(id, list, handleApplySurcharge, onChangeProductQuantity);
  }

  function handleCheckout() {
    CheckoutAction(status, onErrorMsg, onCheckout);
  }

  return (
    <div className="min-vh-100 sticky-top">
      <SurchargeModal
        show={showSurcharge}
        surcharge={surcharge}
        setSurcharge={setSurcharge}
        handleClose={() => setShowSurcharge(false)}
        handleApplySurcharge={() => {
          handleApplySurcharge(surcharge);
          setShowSurcharge(false);
        }}
      />

      <h2 className="sub-header mb-0">Order</h2>
      <Row className="order-header-buttons no-gutters">
        <Col sm={4}>
          <button id="lastTransactionButton" type="button" onClick={() => onLastTransaction()}>
            Last Transaction
          </button>
        </Col>
        <Col sm={4}>
          <button id="surchargeButton" type="button" onClick={() => setShowSurcharge(true)}>
            Add Surcharge
          </button>
        </Col>
        <Col sm={4}>
          <button id="refundButton" type="button" onClick={() => onRefund()}>
            Refund
          </button>
        </Col>
      </Row>
      <Modal show={errorMsg !== ''} onHide={() => onErrorMsg('')}>
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMsg}</p>
          <Button variant="primary" className="btn-custom" onClick={() => onErrorMsg('')} block>
            OK
          </Button>
        </Modal.Body>
      </Modal>
      <div className="orderListScroll">
        <ul className="nobull removeStyle">
          {list.map((item: Product) => (
            <li className="space" key={`order-list-${item.id}`}>
              <Row>
                <Col sm={12}>
                  <Row>
                    <Col sm={5}>
                      <div className="quantity-buttons">
                        <button
                          id={`btnItemDec${item.id}`}
                          type="button"
                          onClick={() => removeProductQuantity(item.id)}
                        >
                          -
                        </button>
                        <div id={`itemQuantity${item.id}`} className="quantity-label">
                          {item.quantity}
                        </div>
                        <button
                          id={`btnItemInc${item.id}`}
                          type="button"
                          onClick={() => onChangeProductQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </Col>
                    <Col sm={5} className="quantity">
                      {item.name}
                    </Col>
                    <Col sm={2} className="quantity text-right">
                      ${parseFloat(item.price) * item.quantity}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </li>
          ))}
        </ul>
      </div>

      <div className="total">
        <div>
          <Row>
            <Col sm={7}>Subtotal</Col>
            <Col sm={5} className="text-right">
              ${subTotalAmount.toFixed(2)}
            </Col>
          </Row>
          <Row>
            <Col sm={7}>Surcharge</Col>
            <Col sm={5} className="text-right">
              ${(surchargeAmount / 100).toFixed(2)}
            </Col>
          </Row>
        </div>
        <hr />
        <div className="total-amount">
          <Row>
            <Col sm={7}>Total</Col>
            <Col sm={5} className="text-right">
              ${totalAmount.toFixed(2)}
            </Col>
          </Row>
        </div>
      </div>
      <button
        type="button"
        className="primary-button checkout-button mb-0"
        onClick={() => {
          handleCheckout();
        }}
      >
        Checkout
      </button>
    </div>
  );
}

export default Order;
