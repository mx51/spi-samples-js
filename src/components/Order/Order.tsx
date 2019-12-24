import React, { useState } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import Input from '../Input/Input';

import './Order.css';

function Surcharge(props: { show: boolean; handleClose: Function }) {
  const { show, handleClose } = props;
  console.log('MOdal show', show);

  return (
    <Modal show={show} onHide={() => handleClose()}>
      <Modal.Header closeButton>
        <Modal.Title>Add Surcharge</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input id="surcharge" name="surcharge" label="Surcharge Amount" />
        <p className="ml-2">Cents</p>
        <Button variant="primary" className="btn-custom" onClick={() => handleClose()} block>
          Apply
        </Button>
      </Modal.Body>
    </Modal>
  );
}

function Order(props: { list: any; onCheckout: Function; onChangeProductQuantity: Function }) {
  const { list, onCheckout, onChangeProductQuantity } = props;

  const [showSurcharge, setShowSurcharge] = useState(false);
  const [surchargeAmount, setSurchargeAmount] = useState(10);

  // const groupedProducts: any = [];
  console.log(list);

  // list.forEach((item: Product) => {
  //   if (!groupedProducts[item.id]) {
  //     groupedProducts[item.id] = { ...item, count: 1 };
  //   } else {
  //     groupedProducts[item.id] = { ...item, count: groupedProducts[item.id].count + 1 };
  //   }
  //   // setgroupedProducts(groupedProducts);
  // });

  console.log('Grouped: ', list, setSurchargeAmount);

  const subTotalAmount: number = list.reduce((total: any, product: any) => total + product.price * product.quantity, 0);
  const totalAmount = subTotalAmount + surchargeAmount;

  return (
    <div className="min-vh-100 sticky-top">
      <Surcharge show={showSurcharge} handleClose={() => setShowSurcharge(false)} />

      <h2 className="order-header">Order</h2>
      <Row className="order-header-buttons no-gutters">
        <Col sm={4}>
          <button type="button">Last Transaction</button>
        </Col>
        <Col sm={4}>
          <button type="button" onClick={() => setShowSurcharge(true)}>
            Add Surcharge
          </button>
        </Col>
        <Col sm={4}>
          <button type="button">Refund</button>
        </Col>
      </Row>
      <ul className="nobull">
        {list.map((item: any) => (
          <li className="space" key={item.id}>
            <Row>
              <Col sm={10}>
                <Row>
                  {/* <button className="orderList" type="button" onClick={() => onRemoveProduct(item.id)}>
                    <Col sm={1}>{item.quantity} </Col>
                    <Col sm={1}> X </Col>
                    <Col sm={5}>{item.name}</Col>
                    <Col sm={3}>${item.price}.00</Col>
                    <Col sm={2}>${item.price * item.quantity}.00</Col>
                  </button> */}
                  <Col sm={5}>
                    <div className="quantity-buttons">
                      <button type="button" onClick={() => onChangeProductQuantity(item.id, 1)}>
                        +
                      </button>
                      <div className="quantity-label">{item.quantity}</div>
                      <button type="button" onClick={() => onChangeProductQuantity(item.id, -1)}>
                        -
                      </button>
                    </div>
                  </Col>

                  <Col sm={5} className="quantity">
                    {item.name}
                  </Col>

                  <Col sm={2} className="quantity">
                    ${item.price * item.quantity}
                  </Col>
                </Row>
              </Col>
            </Row>
          </li>
        ))}
      </ul>

      <div className="total">
        <div className="aaa">
          <Row>
            <Col sm={9}>Subtotal</Col>
            <Col sm={3}>${subTotalAmount}</Col>
          </Row>
          <Row>
            <Col sm={9}>Surcharge</Col>
            <Col sm={3}>${surchargeAmount}</Col>
          </Row>
        </div>
        <hr />
        <Row>
          <Col sm={9}>Total</Col>
          <Col sm={3}>${totalAmount}</Col>
        </Row>
      </div>
      <button type="button" className="checkout-button" onClick={() => onCheckout()}>
        Checkout
      </button>
    </div>
  );
}

export default Order;
