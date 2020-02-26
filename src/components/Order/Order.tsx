import React, { useState } from 'react';
import { SpiStatus } from '@mx51/spi-client-js';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import Input from '../Input/Input';
import './Order.scss';

function SurchargeModal(props: {
  show: boolean;
  handleClose: Function;
  handleApplySurcharge: Function;
  surcharge: number;
  setSurcharge: Function;
}) {
  const { show, handleClose, handleApplySurcharge, surcharge, setSurcharge } = props;
  console.log('Modal show', show, handleApplySurcharge);

  // const [surcharge, setSurcharge] = useState<number>(0);
  function applySurcharge() {
    handleApplySurcharge(surcharge / 100);
    setSurcharge(0);
  }

  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Add Surcharge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          id="surcharge"
          name="surcharge"
          label="Surcharge Amount"
          type="number"
          value={surcharge === 0 ? '' : surcharge.toString()}
          onChange={(e: any) => setSurcharge(Number.parseInt(e.target.value, 10))}
        />
        <p className="ml-2">Cents</p>
        <Button variant="primary" className="btn-custom primary-button" onClick={() => applySurcharge()} block>
          Apply
        </Button>
      </Modal.Body>
    </Modal>
  );
}

function Order(props: {
  list: any;
  onCheckout: Function;
  onRefund: Function;
  onLastTransaction: Function;
  onChangeProductQuantity: Function;
  handleApplySurcharge: Function;
  surchargeAmount: number;
  setSurchargeAmount: Function;
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
    setSurchargeAmount,
    status,
    errorMsg,
    onErrorMsg,
  } = props;

  const [showSurcharge, setShowSurcharge] = useState(false);
  const [surcharge, setSurcharge] = useState<number>(0);
  // const [errorMsg, setErrorMsg] = useState('');

  const subTotalAmount: number = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);
  const totalAmount = subTotalAmount + surchargeAmount / 100;

  function removeProductQuntity(id: any) {
    if (list.length === 1 && list[0].quantity === 1) {
      setSurchargeAmount(0);
    }
    onChangeProductQuantity(id, -1);
  }

  function handleCheckout() {
    if (status !== SpiStatus.PairedConnected) {
      onErrorMsg('Please pair your POS to the terminal or check your wifi connection');
    } else {
      onCheckout();
    }
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
          <button type="button" onClick={() => onLastTransaction()}>
            Last Transaction
          </button>
        </Col>
        <Col sm={4}>
          <button type="button" onClick={() => setShowSurcharge(true)}>
            Add Surcharge
          </button>
        </Col>
        <Col sm={4}>
          <button type="button" onClick={() => onRefund()}>
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
        <ul className="nobull">
          {list.map((item: any) => (
            <li className="space" key={item.id}>
              <Row>
                <Col sm={12}>
                  <Row>
                    <Col sm={5}>
                      <div className="quantity-buttons">
                        <button type="button" onClick={() => removeProductQuntity(item.id)}>
                          -
                        </button>
                        <div className="quantity-label">{item.quantity}</div>
                        <button type="button" onClick={() => onChangeProductQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                    </Col>
                    <Col sm={5} className="quantity">
                      {item.name}
                    </Col>
                    <Col sm={2} className="quantity text-right">
                      ${item.price * item.quantity}
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
      <button type="button" className="primary-button checkout-button mb-0" onClick={() => handleCheckout()}>
        Checkout
      </button>
    </div>
  );
}

export default Order;
