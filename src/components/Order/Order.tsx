import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './Order.css';

function Order(props: { list: any; onRemoveProduct: Function; onCheckout: Function }) {
  const { list, onRemoveProduct, onCheckout } = props;
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

  console.log('Grouped: ', list);

  return (
    <div className="min-vh-100 sticky-top">
      <p className="order-header">Order</p>
      <ul className="nobull">
        {list.map((item: any) => (
          <li className="space" key={item.id}>
            <Row>
              <Col sm={10}>
                <Row>
                  <button className="orderList" type="button" onClick={() => onRemoveProduct(item.id)}>
                    <Col sm={1}>{item.quantity} </Col>
                    <Col sm={1}> X </Col>
                    <Col sm={5}>{item.name}</Col>
                    <Col sm={3}>${item.price}.00</Col>
                    <Col sm={2}>${item.price * item.quantity}.00</Col>
                  </button>
                </Row>
              </Col>
            </Row>
          </li>
        ))}
      </ul>
      <div className="total">
        Total
        <h3 className="order-amount">
          ${list.reduce((total: any, product: any) => total + product.price * product.quantity, 0)}
        </h3>
      </div>
      <button type="button" className="checkout-button" onClick={() => onCheckout()}>
        Checkout
      </button>
    </div>
  );
}

export default Order;
